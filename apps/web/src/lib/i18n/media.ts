import type { Locale } from "./config";
import {
  realMedia,
  type MediaCategory,
  type RealMediaItem,
} from "@/lib/media/real-media";

/**
 * GALERİ SÖZLÜĞÜ — kayıt başlıkları (caption) ve alt metinleri dört dilde.
 *
 * Manifest (`lib/media/real-media.ts`) tek dilli kalır: dosya yolları,
 * ölçüler ve kategoriler dile bağlı değildir. Dile bağlı olan iki alan
 * (caption + alt) burada kayıt kimliğiyle eşlenir ve `localizedMedia`
 * birleştirir. Kurucunun kuralı: "hangi dili seçersem yazılı her içerik
 * o dile dönmeli" — galeri kartları bu kuralın en görünür yüzeyiydi.
 *
 * GÜVENLİK AĞI. Çevirisi unutulan kayıt Türkçesiyle görünür, sayfa
 * kırılmaz; `eksikCeviriler()` derleme sonrası denetimde kullanılır ve
 * boş dönmediği sürece iş bitmiş sayılmaz.
 */

type MediaText = { caption: string; alt: string };
type MediaTextMap = Record<string, MediaText>;

const en: MediaTextMap = {
  "saha-roket-firlatma-02": {
    caption: "From workshop to launch",
    alt: "CEZERİ ROBOTECH students' model rocket test, from workshop preparation to the launch moment in Batman",
  },
  "atolye-iha-uretim-01": {
    caption: "UAV body and electronics assembly",
    alt: "Assembling the flight electronics of a carbon-fibre model UAV at the CEZERİ ROBOTECH workshop in Batman",
  },
  "saha-iha-simurgh-01": {
    caption: "Simurgh-24 flight test",
    alt: "First take-off and flight test of the Simurgh-24 fixed-wing UAV built by CEZERİ ROBOTECH students",
  },
  "ziyaret-nasiroglu-vitrin-01": {
    caption: "Nasıroğlu visit — project showcase",
    alt: "Batman MP Ferhat Nasıroğlu examining the student project showcase at the CEZERİ ROBOTECH workshop",
  },
  "ziyaret-nasiroglu-ogrenci-01": {
    caption: "Nasıroğlu visit — with a student",
    alt: "Batman MP Ferhat Nasıroğlu shaking hands with a student building a model aircraft at the CEZERİ ROBOTECH workshop",
  },
  "ziyaret-nasiroglu-grup-01": {
    caption: "Nasıroğlu visit — at the workshop",
    alt: "Batman MP Ferhat Nasıroğlu with the CEZERİ ROBOTECH team and a student in front of the project shelf",
  },
  "ziyaret-ramanli-kit-01": {
    caption: "Ramanlı visit — training kit",
    alt: "Batman MP Serkan Ramanlı receiving a robotics training kit from an instructor at the CEZERİ ROBOTECH workshop",
  },
  "ziyaret-ramanli-3d-baski-01": {
    caption: "Ramanlı visit — 3D printer",
    alt: "Batman MP Serkan Ramanlı examining a running 3D printer and its output at the CEZERİ ROBOTECH workshop",
  },
  "ziyaret-ramanli-vitrin-01": {
    caption: "Ramanlı visit — project showcase",
    alt: "Batman MP Serkan Ramanlı touring the model aircraft and robotics showcase at the CEZERİ ROBOTECH workshop",
  },
  "ziyaret-ramanli-ekip-01": {
    caption: "Ramanlı visit — with the team",
    alt: "Batman MP Serkan Ramanlı and the CEZERİ ROBOTECH team in front of the robotic owl emblem",
  },
  "protokol-esnaf-odasi-01": {
    caption: "Chamber of Tradesmen protocol — signing",
    alt: "Signing moment of the technology education protocol between CEZERİ ROBOTECH and the Batman Chamber of Tradesmen and Craftsmen",
  },
  "protokol-esnaf-odasi-02": {
    caption: "Chamber of Tradesmen protocol — meeting",
    alt: "CEZERİ ROBOTECH team meeting with the management of the Batman Chamber of Tradesmen and Craftsmen",
  },
  "etkinlik-yediiki-vali-01": {
    caption: "YEDİİKİ — Governor Canalp on the field",
    alt: "Governor of Batman Ekrem Canalp examining the CEZERİ ROBOTECH students' model aircraft at the YEDİİKİ Robot and Technology Competition",
  },
  "etkinlik-yediiki-vali-video-01": {
    caption: "YEDİİKİ — Governor's visit footage",
    alt: "Video of Governor of Batman Ekrem Canalp visiting the CEZERİ ROBOTECH stand at the YEDİİKİ Robot and Technology Competition",
  },
  "etkinlik-yediiki-takim-01": {
    caption: "YEDİİKİ — the team",
    alt: "CEZERİ ROBOTECH team with their medals and plaque at the YEDİİKİ Robot and Technology Festival",
  },
  "atolye-takim-01": {
    caption: "Team — at the workshop",
    alt: "CEZERİ ROBOTECH student team with their self-built model aircraft and drone beside their instructors",
  },
  "atolye-calisma-01": {
    caption: "Workshop session",
    alt: "Students working on projects at the CEZERİ ROBOTECH workshop in Batman — video recording",
  },
  "atolye-calisma-02": {
    caption: "Workshop session",
    alt: "Students doing electronics and assembly work at the CEZERİ ROBOTECH workshop — video recording",
  },
  "atolye-calisma-03": {
    caption: "Workshop session",
    alt: "A long-running project session at the CEZERİ ROBOTECH workshop — video recording",
  },
  "saha-iha-ucus-01": {
    caption: "Simurgh on the field — team and flight",
    alt: "Flight display of the green fixed-wing UAV built by the CEZERİ ROBOTECH team over the school field, watched by students",
  },
  "robotik-labirent-01": {
    caption: "Maze robot in competition",
    alt: "The maze-solving robot programmed by CEZERİ ROBOTECH students running the competition course",
  },
  "roportaj-siber-guvenlik-01": {
    caption: "Cybersecurity interview",
    alt: "CEZERİ ROBOTECH IT specialist giving a press statement on cybercrime and digital fraud",
  },
  "ekip-egitmenler-01": {
    caption: "Instructor team",
    alt: "CEZERİ ROBOTECH Batman instructor team in front of the robotic owl emblem",
  },
  "atolye-dersler-01": {
    caption: "Workshop lessons",
    alt: "Lesson moments at the CEZERİ ROBOTECH workshop, from circuit building to mini-drone flight — video recording",
  },
  "atolye-tur-01": {
    caption: "Workshop tour",
    alt: "Inside the CEZERİ ROBOTECH Batman workshop: 3D-printed products, a hexacopter drone and robotics training kits",
  },
  "3d-baski-uretim-01": {
    caption: "Print in progress",
    alt: "A 3D printer producing a UAV body part in orange filament, print head in motion",
  },
  "robotik-tezgah-01": {
    caption: "Robot assembly bench",
    alt: "Adjusting the microcontroller board of a tracked robot with an ultrasonic sensor at the bench",
  },
  "atolye-iha-yapim-01": {
    caption: "UAV body building",
    alt: "CEZERİ ROBOTECH students building a foam-body fixed-wing UAV with their own hands, from cutting to assembly",
  },
  "merkez-tanitim-01": {
    caption: "Scenes from the centre",
    alt: "Clips from the classrooms, workshop sessions and field events of the CEZERİ ROBOTECH centre in Batman — promotional video",
  },
  "saha-hava-cekimi-01": {
    caption: "Event aerial view",
    alt: "Drone aerial footage of a CEZERİ ROBOTECH rocket launch event and the participating crowd",
  },
  "robotik-montaj-01": {
    caption: "Robot assembly",
    alt: "Adjusting the servo bracket of a tracked robot with a screwdriver and testing the track motors",
  },
  "3d-baski-atolye-01": {
    caption: "3D print station",
    alt: "An orange UAV body part and the print head at the workshop's 3D print station",
  },
  "robotik-kopek-01": {
    caption: "Robot dog at the centre",
    alt: "The four-legged robot dog walking in front of students and the humanoid robot at the CEZERİ ROBOTECH centre",
  },
  "etkinlik-yediiki-stant-01": {
    caption: "YEDİİKİ — CEZERİ stand",
    alt: "Visiting children trying VR headsets and examining robots at the CEZERİ ROBOTECH stand at the YEDİİKİ Robot Competition",
  },
  "3d-baski-el-01": {
    caption: "3D print — the magic hand project",
    alt: "Parts of the articulated hand project printed on the 3D printer at the CEZERİ ROBOTECH workshop, and assembly of the kit handed to students",
  },
  "atolye-muhendislik-01": {
    caption: "Engineering is our craft",
    alt: "CEZERİ ROBOTECH students' engineering work, from the workshop bench to field flight",
  },
  "elektronik-alarm-01": {
    caption: "Burglar alarm project",
    alt: "Building and testing a home burglar alarm circuit with a perfboard, transistor and LDR at the CEZERİ ROBOTECH workshop",
  },
  "yazilim-trafik-01": {
    caption: "AI traffic light",
    alt: "CEZERİ ROBOTECH students' AI-assisted smart traffic light project recognising vehicles with computer vision",
  },
  "atolye-genc-muhendisler-01": {
    caption: "Next-generation engineers",
    alt: "Young students working on motor winding and circuit building at the CEZERİ ROBOTECH workshop",
  },
};

const ku: MediaTextMap = {
  "saha-roket-firlatma-02": {
    caption: "Ji atolyeyê ber bi avêtinê",
    alt: "Testa roketa modelê ya xwendekarên CEZERÎ ROBOTECH, ji amadekariya atolyeyê heta kêliya avêtinê li Batmanê",
  },
  "atolye-iha-uretim-01": {
    caption: "Montaja laş û elektronîka ÎHA'yê",
    alt: "Montajkirina elektronîka firînê ya ÎHA'ya modelê ya bi laşê karbonfîber li atolyeya CEZERÎ ROBOTECH a Batmanê",
  },
  "saha-iha-simurgh-01": {
    caption: "Testa firînê ya Simurgh-24",
    alt: "Rabûna yekem û testa firînê ya ÎHA'ya baskê sabît Simurgh-24 ku xwendekarên CEZERÎ ROBOTECH çêkirine",
  },
  "ziyaret-nasiroglu-vitrin-01": {
    caption: "Serdana Nasiroglu — vîtrîna projeyan",
    alt: "Parlamenterê Batmanê Ferhat Nasiroglu vîtrîna projeyên xwendekaran li atolyeya CEZERÎ ROBOTECH dinirxîne",
  },
  "ziyaret-nasiroglu-ogrenci-01": {
    caption: "Serdana Nasiroglu — bi xwendekarekî re",
    alt: "Parlamenterê Batmanê Ferhat Nasiroglu destê xwendekarekî ku balafira modelê çêdike digire",
  },
  "ziyaret-nasiroglu-grup-01": {
    caption: "Serdana Nasiroglu — li atolyeyê",
    alt: "Parlamenterê Batmanê Ferhat Nasiroglu bi tîma CEZERÎ ROBOTECH û xwendekarekî re li ber refika projeyan",
  },
  "ziyaret-ramanli-kit-01": {
    caption: "Serdana Ramanli — seta perwerdehiyê",
    alt: "Parlamenterê Batmanê Serkan Ramanli seta perwerdehiya robotîkê ji perwerdekar werdigire",
  },
  "ziyaret-ramanli-3d-baski-01": {
    caption: "Serdana Ramanli — çapera 3D",
    alt: "Parlamenterê Batmanê Serkan Ramanli çapera 3D ya dixebite û derana wê li atolyeya CEZERÎ ROBOTECH dinirxîne",
  },
  "ziyaret-ramanli-vitrin-01": {
    caption: "Serdana Ramanli — vîtrîna projeyan",
    alt: "Parlamenterê Batmanê Serkan Ramanli vîtrîna balafirên modelê û projeyên robotîkê digere",
  },
  "ziyaret-ramanli-ekip-01": {
    caption: "Serdana Ramanli — bi tîmê re",
    alt: "Parlamenterê Batmanê Serkan Ramanli û tîma CEZERÎ ROBOTECH li ber sembola kundê robotîk",
  },
  "protokol-esnaf-odasi-01": {
    caption: "Protokola Odeya Esnafan — îmze",
    alt: "Kêliya îmzekirina protokola perwerdehiya teknolojiyê di navbera CEZERÎ ROBOTECH û Odeya Esnaf û Pîşekarên Batmanê de",
  },
  "protokol-esnaf-odasi-02": {
    caption: "Protokola Odeya Esnafan — hevdîtin",
    alt: "Tîma CEZERÎ ROBOTECH di hevdîtina protokolê de bi rêveberiya Odeya Esnaf û Pîşekarên Batmanê re",
  },
  "etkinlik-yediiki-vali-01": {
    caption: "YEDIÎKÎ — Walî Canalp li qadê",
    alt: "Waliyê Batmanê Ekrem Canalp balafira modelê ya xwendekarên CEZERÎ ROBOTECH di Pêşbaziya Robot û Teknolojiyê ya YEDIÎKÎ de dinirxîne",
  },
  "etkinlik-yediiki-vali-video-01": {
    caption: "YEDIÎKÎ — tomara serdana Walî",
    alt: "Tomara vîdyoyê ya serdana Waliyê Batmanê Ekrem Canalp bo standa CEZERÎ ROBOTECH di Pêşbaziya YEDIÎKÎ de",
  },
  "etkinlik-yediiki-takim-01": {
    caption: "YEDIÎKÎ — tîm",
    alt: "Tîma CEZERÎ ROBOTECH bi madalya û plaketa xwe di Festîvala Robot û Teknolojiyê ya YEDIÎKÎ de",
  },
  "atolye-takim-01": {
    caption: "Tîm — li atolyeyê",
    alt: "Tîma xwendekarên CEZERÎ ROBOTECH bi balafira modelê û droneya ku bi xwe çêkirine, li kêleka perwerdekarên xwe",
  },
  "atolye-calisma-01": {
    caption: "Xebata atolyeyê",
    alt: "Xebata projeyan a xwendekaran li atolyeya CEZERÎ ROBOTECH a Batmanê — tomara vîdyoyê",
  },
  "atolye-calisma-02": {
    caption: "Xebata atolyeyê",
    alt: "Xebata elektronîk û montajê ya xwendekaran li atolyeya CEZERÎ ROBOTECH — tomara vîdyoyê",
  },
  "atolye-calisma-03": {
    caption: "Xebata atolyeyê",
    alt: "Xebateke projeyê ya dirêj li atolyeya CEZERÎ ROBOTECH — tomara vîdyoyê",
  },
  "saha-iha-ucus-01": {
    caption: "Simurgh li qadê — tîm û firîn",
    alt: "Pêşandana firînê ya ÎHA'ya baskê sabît a kesk ku tîma CEZERÎ ROBOTECH çêkiriye, li ser qada dibistanê",
  },
  "robotik-labirent-01": {
    caption: "Robota labîrentê di pêşbaziyê de",
    alt: "Robota çareserkirina labîrentê ya ku xwendekarên CEZERÎ ROBOTECH bername kirine, di qursa pêşbaziyê de",
  },
  "roportaj-siber-guvenlik-01": {
    caption: "Hevpeyvîna ewlehiya sîber",
    alt: "Pisporê IT yê CEZERÎ ROBOTECH derbarê sûcên sîber û sextekariya dîjîtal de daxuyaniyê dide çapemeniyê",
  },
  "ekip-egitmenler-01": {
    caption: "Kadroya perwerdekaran",
    alt: "Kadroya perwerdekarên CEZERÎ ROBOTECH a Batmanê li ber sembola kundê robotîk",
  },
  "atolye-dersler-01": {
    caption: "Dersên atolyeyê",
    alt: "Kêliyên dersan li atolyeya CEZERÎ ROBOTECH, ji avakirina dewreyê heta firîna mini-droneyê — tomara vîdyoyê",
  },
  "atolye-tur-01": {
    caption: "Gera atolyeyê",
    alt: "Hundirê atolyeya CEZERÎ ROBOTECH a Batmanê: beranhemên çapa 3D, droneya hexacopter û setên perwerdehiya robotîkê",
  },
  "3d-baski-uretim-01": {
    caption: "Çap didome",
    alt: "Çapera 3D bi fîlamenta porteqalî parçeyekî laşê ÎHA'yê çê dike, serê çapê di tevgerê de",
  },
  "robotik-tezgah-01": {
    caption: "Texgeha montaja robotan",
    alt: "Eyarkirina karta mîkrokontrolker a robota şopdar a bi sensora ultrasonîk li ser texgehê",
  },
  "atolye-iha-yapim-01": {
    caption: "Çêkirina laşê ÎHA'yê",
    alt: "Xwendekarên CEZERÎ ROBOTECH ÎHA'ya baskê sabît a bi laşê kefikê bi destên xwe çê dikin, ji birînê heta montajê",
  },
  "merkez-tanitim-01": {
    caption: "Ji navendê dîmen",
    alt: "Beşên ji polan, xebatên atolyeyê û çalakiyên qadê yên navenda CEZERÎ ROBOTECH a Batmanê — vîdyoya danasînê",
  },
  "saha-hava-cekimi-01": {
    caption: "Dîmena hewayî ya çalakiyê",
    alt: "Dîmenên hewayî yên bi drone ji çalakiya avêtina roketê ya CEZERÎ ROBOTECH û girseya beşdaran",
  },
  "robotik-montaj-01": {
    caption: "Montaja robotê",
    alt: "Eyarkirina brakêta servo ya robota şopdar bi dernefîsê û testkirina motorên şopê",
  },
  "3d-baski-atolye-01": {
    caption: "Stasyona çapa 3D",
    alt: "Parçeyekî laşê ÎHA'yê yê porteqalî û serê çapê li stasyona çapa 3D ya atolyeyê",
  },
  "robotik-kopek-01": {
    caption: "Kûçikê robot li navendê",
    alt: "Kûçikê robot ê çarling li navenda CEZERÎ ROBOTECH li ber xwendekaran û robota mirovî dimeşe",
  },
  "etkinlik-yediiki-stant-01": {
    caption: "YEDIÎKÎ — standa CEZERÎ",
    alt: "Zarokên serdaner li standa CEZERÎ ROBOTECH di Pêşbaziya Robotan a YEDIÎKÎ de berçavkên VR diceribînin û robotan dinirxînin",
  },
  "3d-baski-el-01": {
    caption: "Çapa 3D — projeya destê efsûnî",
    alt: "Parçeyên projeya destê movikdar ên ku bi çapera 3D hatine çapkirin û montaja seta ku ji xwendekaran re tê dayîn",
  },
  "atolye-muhendislik-01": {
    caption: "Endezyarî karê me ye",
    alt: "Xebatên endezyariyê yên xwendekarên CEZERÎ ROBOTECH, ji texgeha atolyeyê heta firîna qadê",
  },
  "elektronik-alarm-01": {
    caption: "Projeya alarma dizan",
    alt: "Avakirin û testkirina dewreya alarma dizan a malê bi perfboard, transîstor û LDR li atolyeya CEZERÎ ROBOTECH",
  },
  "yazilim-trafik-01": {
    caption: "Roniya trafîkê ya bi AI",
    alt: "Projeya roniya trafîkê ya biaqil a bi piştgiriya zîrekiya sûnî ya xwendekarên CEZERÎ ROBOTECH ku bi dîtina komputerê wesayîtan nas dike",
  },
  "atolye-genc-muhendisler-01": {
    caption: "Endezyarên nifşê nû",
    alt: "Xwendekarên ciwan li atolyeya CEZERÎ ROBOTECH li ser pêçana motorê û avakirina dewreyê dixebitin",
  },
};

const ar: MediaTextMap = {
  "saha-roket-firlatma-02": {
    caption: "من الورشة إلى الإطلاق",
    alt: "اختبار الصاروخ النموذجي لطلاب جزري روبوتيك، من التحضير في الورشة إلى لحظة الإطلاق في باتمان",
  },
  "atolye-iha-uretim-01": {
    caption: "تجميع هيكل وإلكترونيات الطائرة المسيّرة",
    alt: "تركيب إلكترونيات الطيران لطائرة مسيّرة نموذجية بهيكل من ألياف الكربون في ورشة جزري روبوتيك في باتمان",
  },
  "saha-iha-simurgh-01": {
    caption: "اختبار طيران سيمرغ-24",
    alt: "الإقلاع الأول واختبار الطيران للطائرة المسيّرة ثابتة الجناح سيمرغ-24 التي صنعها طلاب جزري روبوتيك",
  },
  "ziyaret-nasiroglu-vitrin-01": {
    caption: "زيارة ناصر أوغلو — واجهة المشاريع",
    alt: "نائب باتمان فرحات ناصر أوغلو يتفقد واجهة مشاريع الطلاب في ورشة جزري روبوتيك",
  },
  "ziyaret-nasiroglu-ogrenci-01": {
    caption: "زيارة ناصر أوغلو — مع طالب",
    alt: "نائب باتمان فرحات ناصر أوغلو يصافح طالبًا يصنع طائرة نموذجية في ورشة جزري روبوتيك",
  },
  "ziyaret-nasiroglu-grup-01": {
    caption: "زيارة ناصر أوغلو — في الورشة",
    alt: "نائب باتمان فرحات ناصر أوغلو مع فريق جزري روبوتيك وطالب أمام رف المشاريع",
  },
  "ziyaret-ramanli-kit-01": {
    caption: "زيارة رامانلي — طقم التدريب",
    alt: "نائب باتمان سركان رامانلي يتسلّم طقم تدريب الروبوتات من المدرب في ورشة جزري روبوتيك",
  },
  "ziyaret-ramanli-3d-baski-01": {
    caption: "زيارة رامانلي — الطابعة ثلاثية الأبعاد",
    alt: "نائب باتمان سركان رامانلي يتفقد الطابعة ثلاثية الأبعاد أثناء عملها ومخرجاتها في ورشة جزري روبوتيك",
  },
  "ziyaret-ramanli-vitrin-01": {
    caption: "زيارة رامانلي — واجهة المشاريع",
    alt: "نائب باتمان سركان رامانلي يتجول في واجهة الطائرات النموذجية ومشاريع الروبوتات في ورشة جزري روبوتيك",
  },
  "ziyaret-ramanli-ekip-01": {
    caption: "زيارة رامانلي — مع الفريق",
    alt: "نائب باتمان سركان رامانلي وفريق جزري روبوتيك أمام شعار البومة الروبوتية",
  },
  "protokol-esnaf-odasi-01": {
    caption: "بروتوكول غرفة الحرفيين — التوقيع",
    alt: "لحظة توقيع بروتوكول التعليم التقني بين جزري روبوتيك وغرفة الحرفيين والصنّاع في باتمان",
  },
  "protokol-esnaf-odasi-02": {
    caption: "بروتوكول غرفة الحرفيين — الاجتماع",
    alt: "فريق جزري روبوتيك في اجتماع البروتوكول مع إدارة غرفة الحرفيين والصنّاع في باتمان",
  },
  "etkinlik-yediiki-vali-01": {
    caption: "يدي إيكي — الوالي جان ألب في الميدان",
    alt: "والي باتمان أكرم جان ألب يتفقد الطائرة النموذجية لطلاب جزري روبوتيك في مسابقة يدي إيكي للروبوتات والتقنية",
  },
  "etkinlik-yediiki-vali-video-01": {
    caption: "يدي إيكي — تسجيل زيارة الوالي",
    alt: "تسجيل مصوَّر لزيارة والي باتمان أكرم جان ألب لجناح جزري روبوتيك في مسابقة يدي إيكي للروبوتات والتقنية",
  },
  "etkinlik-yediiki-takim-01": {
    caption: "يدي إيكي — الفريق",
    alt: "فريق جزري روبوتيك بميدالياته ودرعه في مهرجان يدي إيكي للروبوتات والتقنية",
  },
  "atolye-takim-01": {
    caption: "الفريق — في الورشة",
    alt: "فريق طلاب جزري روبوتيك مع الطائرة النموذجية والمسيّرة اللتين صنعوهما بأنفسهم إلى جانب مدربيهم",
  },
  "atolye-calisma-01": {
    caption: "جلسة عمل في الورشة",
    alt: "طلاب يعملون على مشاريعهم في ورشة جزري روبوتيك في باتمان — تسجيل مصوَّر",
  },
  "atolye-calisma-02": {
    caption: "جلسة عمل في الورشة",
    alt: "طلاب يعملون في الإلكترونيات والتجميع في ورشة جزري روبوتيك — تسجيل مصوَّر",
  },
  "atolye-calisma-03": {
    caption: "جلسة عمل في الورشة",
    alt: "جلسة مشروع طويلة في ورشة جزري روبوتيك — تسجيل مصوَّر",
  },
  "saha-iha-ucus-01": {
    caption: "سيمرغ في الميدان — الفريق والطيران",
    alt: "عرض طيران الطائرة المسيّرة ثابتة الجناح الخضراء التي صنعها فريق جزري روبوتيك فوق ملعب المدرسة أمام الطلاب",
  },
  "robotik-labirent-01": {
    caption: "روبوت المتاهة في المسابقة",
    alt: "روبوت حلّ المتاهة الذي برمجه طلاب جزري روبوتيك أثناء جولته في مسار المسابقة",
  },
  "roportaj-siber-guvenlik-01": {
    caption: "مقابلة عن الأمن السيبراني",
    alt: "خبير تقنية المعلومات في جزري روبوتيك يدلي بتصريح صحفي عن الجرائم السيبرانية والاحتيال الرقمي",
  },
  "ekip-egitmenler-01": {
    caption: "كادر المدربين",
    alt: "كادر مدربي جزري روبوتيك في باتمان أمام شعار البومة الروبوتية",
  },
  "atolye-dersler-01": {
    caption: "دروس الورشة",
    alt: "لقطات من الدروس في ورشة جزري روبوتيك، من بناء الدارة إلى طيران المسيّرة الصغيرة — تسجيل مصوَّر",
  },
  "atolye-tur-01": {
    caption: "جولة في الورشة",
    alt: "داخل ورشة جزري روبوتيك في باتمان: منتجات الطباعة ثلاثية الأبعاد ومسيّرة سداسية المراوح وأطقم تدريب الروبوتات",
  },
  "3d-baski-uretim-01": {
    caption: "الطباعة جارية",
    alt: "طابعة ثلاثية الأبعاد تنتج قطعة من هيكل طائرة مسيّرة بخيوط برتقالية، ورأس الطباعة في حركة",
  },
  "robotik-tezgah-01": {
    caption: "منضدة تجميع الروبوتات",
    alt: "ضبط لوحة المتحكم الدقيق لروبوت مجنزر مزوّد بحساس فوق صوتي على المنضدة",
  },
  "atolye-iha-yapim-01": {
    caption: "صناعة هيكل الطائرة المسيّرة",
    alt: "طلاب جزري روبوتيك يصنعون بأيديهم طائرة مسيّرة ثابتة الجناح بهيكل من الفوم، من القصّ إلى التجميع",
  },
  "merkez-tanitim-01": {
    caption: "لقطات من المركز",
    alt: "مقاطع من الصفوف وجلسات الورشة والفعاليات الميدانية لمركز جزري روبوتيك في باتمان — فيديو تعريفي",
  },
  "saha-hava-cekimi-01": {
    caption: "منظر جوي للفعالية",
    alt: "لقطات جوية بالمسيّرة لفعالية إطلاق صواريخ جزري روبوتيك وجمهور المشاركين",
  },
  "robotik-montaj-01": {
    caption: "تجميع الروبوت",
    alt: "ضبط حامل السيرفو لروبوت مجنزر بالمفك واختبار محركات الجنزير",
  },
  "3d-baski-atolye-01": {
    caption: "محطة الطباعة ثلاثية الأبعاد",
    alt: "قطعة برتقالية من هيكل طائرة مسيّرة ورأس الطباعة في محطة الطباعة ثلاثية الأبعاد بالورشة",
  },
  "robotik-kopek-01": {
    caption: "الكلب الروبوتي في المركز",
    alt: "الكلب الروبوتي رباعي الأرجل يمشي أمام الطلاب والروبوت البشري في مركز جزري روبوتيك",
  },
  "etkinlik-yediiki-stant-01": {
    caption: "يدي إيكي — جناح جزري",
    alt: "أطفال زائرون يجرّبون نظارات الواقع الافتراضي ويتفقدون الروبوتات في جناح جزري روبوتيك بمسابقة يدي إيكي",
  },
  "3d-baski-el-01": {
    caption: "طباعة ثلاثية الأبعاد — مشروع اليد السحرية",
    alt: "قطع مشروع اليد المفصلية المطبوعة على الطابعة ثلاثية الأبعاد في ورشة جزري روبوتيك وتجميع الطقم الذي يُسلَّم للطلاب",
  },
  "atolye-muhendislik-01": {
    caption: "الهندسة مهنتنا",
    alt: "أعمال هندسية لطلاب جزري روبوتيك، من منضدة الورشة إلى الطيران الميداني",
  },
  "elektronik-alarm-01": {
    caption: "مشروع إنذار السرقة",
    alt: "بناء واختبار دارة إنذار سرقة منزلي بلوحة مثقوبة وترانزستور وحساس ضوئي في ورشة جزري روبوتيك",
  },
  "yazilim-trafik-01": {
    caption: "إشارة مرور بالذكاء الاصطناعي",
    alt: "مشروع إشارة المرور الذكية المدعومة بالذكاء الاصطناعي لطلاب جزري روبوتيك، تتعرف على المركبات بالرؤية الحاسوبية",
  },
  "atolye-genc-muhendisler-01": {
    caption: "مهندسو الجيل الجديد",
    alt: "طلاب صغار يعملون على لفّ المحركات وبناء الدارات في ورشة جزري روبوتيك",
  },
};

const CEVIRILER: Partial<Record<Locale, MediaTextMap>> = { en, ku, ar };

/** Kategori etiketleri — filtre düğmelerinde görünür. */
const KATEGORI: Record<Locale, Record<MediaCategory, string>> = {
  tr: {
    atolye: "Atölye",
    drone: "İHA / VTOL",
    saha: "Saha Testi",
    "3d-baski": "3D Baskı",
    robotik: "Robotik",
    ekip: "Ekip",
    ziyaret: "Ziyaret",
  },
  en: {
    atolye: "Workshop",
    drone: "UAV / VTOL",
    saha: "Field Test",
    "3d-baski": "3D Printing",
    robotik: "Robotics",
    ekip: "Team",
    ziyaret: "Visits",
  },
  ku: {
    atolye: "Atolye",
    drone: "ÎHA / VTOL",
    saha: "Testa Qadê",
    "3d-baski": "Çapa 3D",
    robotik: "Robotîk",
    ekip: "Tîm",
    ziyaret: "Serdan",
  },
  ar: {
    atolye: "الورشة",
    drone: "الطائرات المسيّرة",
    saha: "اختبار ميداني",
    "3d-baski": "طباعة ثلاثية الأبعاد",
    robotik: "الروبوتات",
    ekip: "الفريق",
    ziyaret: "الزيارات",
  },
};

/** Manifest + dil: caption ve alt seçilen dile döner, gerisi aynı kalır. */
export function localizedMedia(locale: Locale): readonly RealMediaItem[] {
  const harita = CEVIRILER[locale];
  if (!harita) return realMedia; // tr — manifest zaten Türkçe
  return realMedia.map((m) => {
    const ceviri = harita[m.id];
    return ceviri ? { ...m, caption: ceviri.caption, alt: ceviri.alt } : m;
  });
}

export function kategoriEtiketi(locale: Locale, k: MediaCategory): string {
  return KATEGORI[locale][k];
}

export function localizedMediaFilters(
  locale: Locale,
): readonly { id: MediaCategory | "tumu"; label: string }[] {
  return [
    { id: "tumu" as const, label: "" }, // etiket ui.mediaAll'dan gelir
    ...(Object.keys(KATEGORI.tr) as MediaCategory[])
      .filter((c) => realMedia.some((m) => m.category === c))
      .map((c) => ({ id: c, label: kategoriEtiketi(locale, c) })),
  ];
}

/** Denetim: çevirisi eksik kayıtlar. Boş dönmüyorsa iş bitmemiştir. */
export function eksikCeviriler(): string[] {
  const eksik: string[] = [];
  for (const [dil, harita] of Object.entries(CEVIRILER)) {
    for (const m of realMedia) {
      if (!harita[m.id]) eksik.push(`${dil}:${m.id}`);
    }
  }
  return eksik;
}
