"""
Yüz anonimleştirme — KVKK için çocuk yüzlerini tanınmaz hâle getirir.

KULLANIM
    pip install opencv-python-headless
    # YuNet modelini indir (~230 KB):
    curl -L -o yunet.onnx https://media.githubusercontent.com/media/opencv/\
opencv_zoo/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx

    python3 scripts/anonymize-faces.py image girdi.png cikti.png
    python3 scripts/anonymize-faces.py video girdi.mkv cikti.mkv

Video için önce kaynağı KAYIPSIZ ara formata (FFV1/mkv) çıkarın, maskeleyin,
sonra son kodlamayı yapın. Sıkıştırılmış kaynağı doğrudan işlemek çift
kodlama kaybı yaratır.

SINIR — otomatik tespit kusursuz değildir:
Yüz tespiti nesnelerde yanlış pozitif (3D baskı figürü, duvar çizimi) ve
aşırı yan profilde kaçırma yapabilir. Bu yüzden çıktı GÖZLE DOĞRULANMALIDIR.
İçinde insan yüzü olmayan klipleri betikten geçirmeyin — yanlış pozitifler
gereksiz leke bırakır.


TASARIM NOTU — neden sadece kare bazlı tespit yetmez:
YuNet her kareyi bağımsız değerlendirir. Bir çocuk başını çevirdiğinde veya
kısa süre kapandığında tespit düşer ve o karelerde yüz AÇIK kalır. Tek bir
açık kare, videoyu duraklatan birinin yüzü görmesi demektir — anonimleştirme
başarısız sayılır.

Bu yüzden üç katman var:
  1. Tespit    — YuNet, düşük eşikle (fazla yakalasın, kaçırmasın)
  2. İz sürme  — kaybolan yüz, son bilinen konumunda N kare daha maskelenir
  3. Genişletme— kutu %35 büyütülür (saç, çene, kulak dışarıda kalmasın)

Maskeleme yöntemi: pikselleştirme + Gauss. Sadece Gauss bulanıklık, güçlü
yeniden-netleştirme saldırılarına karşı bilgi bırakabilir; önce çözünürlüğü
yok edip sonra yumuşatmak geri döndürülemez.
"""
import sys
import cv2
import numpy as np

MODEL = "yunet.onnx"
SCORE_THRESHOLD = 0.45     # düşük tut: kaçırmaktansa fazla yakala
NMS_THRESHOLD = 0.3
PAD = 0.35                 # kutuyu her yönde %35 genişlet
TRACK_TTL = 12             # tespit düşerse bu kadar kare daha maskele
MIN_FACE_PX = 14           # bundan küçük yüzler zaten tanınamaz


def make_detector(w, h):
    d = cv2.FaceDetectorYN.create(MODEL, "", (w, h), SCORE_THRESHOLD, NMS_THRESHOLD, 5000)
    d.setInputSize((w, h))
    return d


def detect(detector, frame):
    _, faces = detector.detect(frame)
    out = []
    if faces is None:
        return out
    for f in faces:
        x, y, fw, fh = f[:4]
        if fw < MIN_FACE_PX or fh < MIN_FACE_PX:
            continue
        out.append([float(x), float(y), float(fw), float(fh)])
    return out


def mask_region(frame, box):
    """Pikselleştir + bulanıklaştır. Geri döndürülemez."""
    h, w = frame.shape[:2]
    x, y, bw, bh = box
    # Genişlet
    cx, cy = x + bw / 2, y + bh / 2
    bw *= 1 + PAD
    bh *= 1 + PAD
    x0 = max(0, int(cx - bw / 2))
    y0 = max(0, int(cy - bh / 2))
    x1 = min(w, int(cx + bw / 2))
    y1 = min(h, int(cy + bh / 2))
    if x1 - x0 < 4 or y1 - y0 < 4:
        return

    roi = frame[y0:y1, x0:x1]
    rh, rw = roi.shape[:2]
    # 1) Çözünürlüğü yok et
    small = cv2.resize(roi, (max(2, rw // 14), max(2, rh // 14)), interpolation=cv2.INTER_LINEAR)
    pix = cv2.resize(small, (rw, rh), interpolation=cv2.INTER_NEAREST)
    # 2) Blok kenarlarını yumuşat — pikselleştirme "sansür" gibi durmasın
    k = max(3, (min(rw, rh) // 6) | 1)
    blurred = cv2.GaussianBlur(pix, (k, k), 0)

    # Oval maske: kare bir leke yerine yüz hattına oturan yumuşak geçiş
    mask = np.zeros((rh, rw), dtype=np.float32)
    cv2.ellipse(mask, (rw // 2, rh // 2), (int(rw * 0.52), int(rh * 0.55)), 0, 0, 360, 1.0, -1)
    mask = cv2.GaussianBlur(mask, (k, k), 0)[..., None]

    frame[y0:y1, x0:x1] = (blurred * mask + roi * (1 - mask)).astype(np.uint8)


class Tracker:
    """Tespit düştüğünde son konumu bir süre daha maskelemeyi sürdürür."""

    def __init__(self):
        self.tracks = []  # [box, ttl]

    def update(self, dets):
        for t in self.tracks:
            t[1] -= 1
        for d in dets:
            dcx, dcy = d[0] + d[2] / 2, d[1] + d[3] / 2
            matched = False
            for t in self.tracks:
                b = t[0]
                bcx, bcy = b[0] + b[2] / 2, b[1] + b[3] / 2
                if abs(dcx - bcx) < max(b[2], d[2]) * 0.8 and abs(dcy - bcy) < max(b[3], d[3]) * 0.8:
                    t[0] = d
                    t[1] = TRACK_TTL
                    matched = True
                    break
            if not matched:
                self.tracks.append([d, TRACK_TTL])
        self.tracks = [t for t in self.tracks if t[1] > 0]
        return [t[0] for t in self.tracks]


def process_image(src, dst):
    img = cv2.imread(src)
    if img is None:
        raise SystemExit(f"okunamadi: {src}")
    h, w = img.shape[:2]
    det = make_detector(w, h)
    faces = detect(det, img)
    # Fotoğrafta çok ölçekli tarama: uzaktaki küçük yüzler tek geçişte kaçabilir
    for scale in (1.6, 2.2):
        big = cv2.resize(img, (int(w * scale), int(h * scale)))
        d2 = make_detector(big.shape[1], big.shape[0])
        for f in detect(d2, big):
            faces.append([f[0] / scale, f[1] / scale, f[2] / scale, f[3] / scale])
    for f in faces:
        mask_region(img, f)
    cv2.imwrite(dst, img, [cv2.IMWRITE_PNG_COMPRESSION, 3])
    print(f"  {dst.split('/')[-1]}: {len(faces)} yuz maskelendi")


def process_video(src, dst):
    cap = cv2.VideoCapture(src)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    det = make_detector(w, h)
    out = cv2.VideoWriter(dst, cv2.VideoWriter_fourcc(*"FFV1"), fps, (w, h))
    tracker = Tracker()
    n = masked = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        boxes = tracker.update(detect(det, frame))
        for b in boxes:
            mask_region(frame, b)
        masked += len(boxes)
        out.write(frame)
        n += 1
    cap.release()
    out.release()
    print(f"  {dst.split('/')[-1]}: {n} kare, {masked} yuz maskesi")


if __name__ == "__main__":
    mode, src, dst = sys.argv[1], sys.argv[2], sys.argv[3]
    (process_image if mode == "image" else process_video)(src, dst)
