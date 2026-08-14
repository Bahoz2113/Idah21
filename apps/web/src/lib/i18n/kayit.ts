import type { Locale } from "./config";

/**
 * KAYIT FORMU SÖZLÜĞÜ — etiketler, yardım metinleri ve sözleşme maddeleri.
 *
 * Ayrı dosyada durmasının sebebi hacim: form tek başına sitenin geri
 * kalanı kadar dize taşıyor ve anlatı sözlüğüyle aynı dosyada dursaydı
 * ikisini de okumak zorlaşırdı.
 *
 * ŞARTLAR ÇEVRİLİR AMA TÜRKÇE ESASTIR. Bir veli anlamadığı bir metni
 * imzalamamalı; bu yüzden maddeler dört dilde de yazıldı. Ancak imzalanan
 * belge Türkçe düzenlenir ve uyuşmazlıkta Türkçe metin geçerlidir —
 * `governingNote` bunu her dilde açıkça söyler. Çevirileri bağlayıcı ilan
 * etmek, hukuki incelemeden geçmemiş bir metni sözleşme hükmü hâline
 * getirmek olurdu.
 *
 * MADDE METİNLERİ KURUMUN KENDİ METNİDİR. Türkçe maddeler kâğıt formdan
 * alındı. Tek değişiklik kurucunun kendi düzeltmesidir: 5. maddenin üçüncü
 * bendi kâğıtta "bedeli TARAFIMIZA fatura edilecektir" diyordu ve bu hâliyle
 * sorumluluğu kurumun üstüne alıyordu; "tarafınıza" olarak düzeltildi.
 * Çevirilerde de aynı bent muhatapsız edilgen yazılmıştı ("will be
 * invoiced"), Türkçe netleşince onlar da netleştirildi — sözleşmenin dört
 * dilde aynı şeyi söylemesi gerekir.
 */

const tr = {
  eyebrow: "Kayıt",
  titleLead: "Kayıt ve",
  titleAccent: "Kabul Formu",
  titleTail: "",
  lead: "Formu doldurup gönderin; doldurulmuş form PDF olarak merkeze ulaşır ve bir kopyası hemen cihazınıza iner. Kaydı kesinleştirmek için atölyede ıslak imza alınır.",

  // ── Bölüm başlıkları
  s1: "Genel Bilgiler",
  s2: "Program Detayları",
  s3: "Ödeme Bilgileri",
  s4: "Öğrenciye Özel Bilgiler",
  sTerms: "Şartlar ve Koşullar",
  s11: "Onay ve Kabul",

  // ── Alanlar
  ogrenciAd: "Öğrenci Adı Soyadı",
  dogumTarihi: "Doğum Tarihi",
  veliAd: "Veli Adı Soyadı",
  telefon: "Telefon Numarası",
  eposta: "E-posta",
  epostaHint: "İsteğe bağlı — kaydınızın bir kopyasını size de gönderebilmemiz için",
  adres: "Adres",
  programlar: "Katılınacak Program(lar)",
  // Kurucunun kararı: liste veli tarafından İŞARETLENMEZ; çocuğun neler
  // öğreneceğini göstermek için durur. Programlar merkezde belirlenir.
  programlarNot: "Bu liste bilgilendirme amaçlıdır; çocuğunuzun katılacağı programlar kayıt sırasında merkezde birlikte belirlenir.",
  baslangicTarihi: "Kurs Başlangıç Tarihi",
  bitisTarihi: "Kurs Bitiş Tarihi",
  tarihHint: "Bilmiyorsanız boş bırakın; merkez sizinle birlikte belirler.",
  odemeTuru: "Ödeme Türü",
  odemeGunu: "Ödeme Günü",
  odemeGunuHint: "Takvimden ödemeyi yapacağınız günü seçin",
  pesin: "Peşin",
  taksitli: "Taksitli",
  toplamTutar: "Toplam Tutar",
  taksitPlani: "Taksitli Seçenekte Ödeme Planı",
  tutarHint: "Bilmiyorsanız boş bırakın; merkez sizinle birlikte belirler.",

  alerjiSoru: "Öğrencinin herhangi bir alerjisi var mı?",
  alerjiDetay: "Lütfen çocuğunuzun alerjisini açıklayınız",
  hastalikSoru: "Öğrencinin herhangi bir hastalığı var mı?",
  hastalikDetay: "Lütfen çocuğunuzun hastalığını açıklayınız",
  fobiSoru: "Öğrencinin herhangi bir fobisi var mı?",
  fobiDetay: "Lütfen çocuğunuzun fobisini açıklayınız",
  evet: "Evet",
  hayir: "Hayır",

  medyaItiraz: "Fotoğraf ve video kullanımına itirazım var",
  medyaItirazDetay: "İtirazınızın kapsamını belirtin",

  sartlarOnay: "Bu formda belirtilen tüm şartları okudum, anladım ve kabul ediyorum.",
  saglikRiza:
    "Öğrencinin yukarıda belirttiğim sağlık bilgilerinin (alerji, hastalık, fobi) yalnızca eğitim güvenliği amacıyla işlenmesine açık rıza veriyorum.",
  saglikRizaNot:
    "Sağlık bilgisi 6698 sayılı KVKK kapsamında özel nitelikli kişisel veridir; bu yüzden ayrı bir onay alınır. Bu bilgi yalnızca eğitmenin sahada doğru davranabilmesi için kullanılır.",
  governingNote:
    "Sözleşmenin Türkçe metni esastır. Diğer dillerdeki karşılıklar yalnızca anlamayı kolaylaştırmak içindir.",
  imzaNot:
    "İmza alanı PDF'te boş bırakılır. Islak imza atölyede, kayıt kesinleşirken alınır.",

  // ── Eylemler ve durumlar
  gonder: "Formu Gönder",
  gonderiliyor: "Gönderiliyor…",
  basariliBaslik: "Formunuz merkeze ulaştı",
  basariliGovde:
    "Doldurulmuş form PDF olarak merkeze gönderildi ve bir kopyası cihazınıza indi. Başvuru numaranız:",
  pdfIndir: "PDF'i yeniden indir",
  whatsappGonder: "WhatsApp'tan bilgi ver",
  whatsappNot:
    "WhatsApp bir web sayfasından dosya eklemeye izin vermez; bu düğme özet bilgiyi metin olarak açar. İndirdiğiniz PDF'i dilerseniz sohbete kendiniz ekleyebilirsiniz.",
  hataBaslik: "Form gönderilemedi",
  hataGovde:
    "Sunucuya ulaşılamadı. Lütfen WhatsApp'tan yazın ya da telefonla arayın; kaydınızı elden alalım.",
  yeniForm: "Yeni form doldur",

  // ── Doğrulama hataları
  hataZorunlu: "Bu alan zorunlu.",
  hataTelefon: "Telefon numarası geçerli görünmüyor.",
  hataEposta: "E-posta adresi geçerli görünmüyor.",
  hataTarih: "Tarih geçerli görünmüyor.",
  hataProgram: "En az bir program seçin.",
  hataDetay: "\"Evet\" işaretlediniz; lütfen detayını yazın.",
  hataOnay: "Devam etmek için bu onayı vermeniz gerekiyor.",
  hataUzun: "Bu alan çok uzun.",
  hataOzet: "Formda eksik veya hatalı alanlar var. Lütfen işaretli yerleri düzeltin.",

  // ── Sözleşme maddeleri (kâğıt formdan birebir)
  terms: [
    {
      title: "Malzeme Kullanımı ve Zararlar",
      items: [
        "Öğrenciye kurs kapsamında verilen malzemelerin itinalı kullanımı zorunludur.",
        "Malzemelerin kasıtlı olarak zarar görmesi durumunda, zarar bedeli veli tarafından karşılanacaktır.",
        "İstemli şekilde kırılan, kaybolan veya hasar gören cihaz ya da ekipmanların bedeli tarafınıza fatura edilecektir.",
      ],
    },
    {
      title: "Devamsızlık ve Telafi Dersleri",
      items: [
        "Öğrencinin devamsızlık yapması durumunda telafi dersi hakkı verilmemektedir.",
        "Kurs merkezi tarafından kaynaklanan durumlarda telafi dersi sağlanacaktır.",
      ],
    },
    {
      title: "Ödeme Koşulları",
      items: [
        "Dönemlik peşin ödemelerde %10 indirim uygulanır.",
        "Taksitli ödemelerde belirtilen tarihlere uyulması zorunludur.",
      ],
    },
    {
      title: "Fotoğraf ve Video Kullanımı",
      items: [
        "Kurs süresince çekilen fotoğraf ve videolar, tanıtım materyallerinde kullanılabilir.",
        "Bu konuda herhangi bir itirazınız var ise lütfen belirtiniz.",
      ],
    },
    {
      title: "Fesih ve Cayma Hakkı",
      items: [
        "Kurs başladıktan sonra ödemenin iadesi talep edilemez.",
        "Sadece kurs merkezi tarafından iptal edilen programlarda geri ödeme yapılır.",
      ],
    },
    {
      title: "Diğer Koşullar",
      items: [
        "Çocukların güvenliği ve disiplini kurs merkezi sorumluluğunda olup, kurallara uyulmaması durumunda öğrencinin kaydı iptal edilebilir.",
      ],
    },
  ],
} as const;

type Like<T extends readonly unknown[], V> = { readonly [I in keyof T]: V };
type TermList<T extends readonly { items: readonly unknown[] }[]> = {
  readonly [I in keyof T]: { title: string; items: Like<T[I]["items"], string> };
};

export type KayitStrings = {
  [K in keyof typeof tr]: K extends "terms" ? TermList<typeof tr.terms> : string;
};

const en: KayitStrings = {
  eyebrow: "Enrolment",
  titleLead: "Enrolment and",
  titleAccent: "Acceptance Form",
  titleTail: "",
  lead: "Fill in the form and send it; the completed form reaches the centre as a PDF and a copy downloads to your device straight away. Enrolment is finalised with a wet signature at the workshop.",

  s1: "General Information",
  s2: "Programme Details",
  s3: "Payment Information",
  s4: "Student-Specific Information",
  sTerms: "Terms and Conditions",
  s11: "Consent and Acceptance",

  ogrenciAd: "Student's Full Name",
  dogumTarihi: "Date of Birth",
  veliAd: "Parent's Full Name",
  telefon: "Phone Number",
  eposta: "Email",
  epostaHint: "Optional — so we can send you a copy of your enrolment as well",
  adres: "Address",
  programlar: "Programme(s) to Attend",
  programlarNot: "This list is for information only; your child's programmes are decided together at the centre during enrolment.",
  baslangicTarihi: "Course Start Date",
  bitisTarihi: "Course End Date",
  tarihHint: "Leave blank if you don't know; the centre will set it with you.",
  odemeTuru: "Payment Type",
  odemeGunu: "Payment Date",
  odemeGunuHint: "Pick the day you will make the payment from the calendar",
  pesin: "Up front",
  taksitli: "In instalments",
  toplamTutar: "Total Amount",
  taksitPlani: "Payment Plan for the Instalment Option",
  tutarHint: "Leave blank if you don't know; the centre will set it with you.",

  alerjiSoru: "Does the student have any allergies?",
  alerjiDetay: "Please describe your child's allergy",
  hastalikSoru: "Does the student have any medical conditions?",
  hastalikDetay: "Please describe your child's medical condition",
  fobiSoru: "Does the student have any phobias?",
  fobiDetay: "Please describe your child's phobia",
  evet: "Yes",
  hayir: "No",

  medyaItiraz: "I object to the use of photographs and video",
  medyaItirazDetay: "Please state the scope of your objection",

  sartlarOnay: "I have read, understood and accept all the terms set out in this form.",
  saglikRiza:
    "I give explicit consent for the student's health information stated above (allergies, medical conditions, phobias) to be processed solely for the purpose of safety during training.",
  saglikRizaNot:
    "Health information is special category personal data under Turkish data protection law (KVKK no. 6698), so a separate consent is taken. It is used only so the instructor can act correctly in the workshop.",
  governingNote:
    "The Turkish text of this agreement governs. Versions in other languages are provided only to aid understanding.",
  imzaNot:
    "The signature field is left blank in the PDF. The wet signature is taken at the workshop when enrolment is finalised.",

  gonder: "Send the Form",
  gonderiliyor: "Sending…",
  basariliBaslik: "Your form has reached the centre",
  basariliGovde:
    "The completed form was sent to the centre as a PDF and a copy has downloaded to your device. Your reference number:",
  pdfIndir: "Download the PDF again",
  whatsappGonder: "Notify us on WhatsApp",
  whatsappNot:
    "WhatsApp does not allow a web page to attach files; this button opens a text summary. You can attach the downloaded PDF to the chat yourself if you prefer.",
  hataBaslik: "The form could not be sent",
  hataGovde:
    "The server could not be reached. Please write to us on WhatsApp or call us and we will take your enrolment directly.",
  yeniForm: "Fill in a new form",

  hataZorunlu: "This field is required.",
  hataTelefon: "That phone number doesn't look valid.",
  hataEposta: "That email address doesn't look valid.",
  hataTarih: "That date doesn't look valid.",
  hataProgram: "Select at least one programme.",
  hataDetay: "You selected \"Yes\"; please write the details.",
  hataOnay: "You need to give this consent to continue.",
  hataUzun: "This field is too long.",
  hataOzet: "Some fields are missing or invalid. Please correct the marked entries.",

  terms: [
    {
      title: "Use of Materials and Damages",
      items: [
        "Materials issued to the student as part of the course must be used with care.",
        "If materials are damaged deliberately, the cost of the damage will be met by the parent.",
        "The cost of devices or equipment broken, lost or damaged intentionally will be invoiced to you.",
      ],
    },
    {
      title: "Absence and Make-Up Lessons",
      items: [
        "No right to a make-up lesson is granted where the student is absent.",
        "A make-up lesson will be provided where the cause lies with the centre.",
      ],
    },
    {
      title: "Payment Terms",
      items: [
        "A 10% discount applies to term payments made up front.",
        "For instalment payments, the stated dates must be observed.",
      ],
    },
    {
      title: "Use of Photographs and Video",
      items: [
        "Photographs and video taken during the course may be used in promotional material.",
        "If you have any objection to this, please state it.",
      ],
    },
    {
      title: "Termination and Right of Withdrawal",
      items: [
        "No refund of payment may be requested once the course has started.",
        "Refunds are made only for programmes cancelled by the centre.",
      ],
    },
    {
      title: "Other Conditions",
      items: [
        "The safety and discipline of children is the responsibility of the centre, and the student's enrolment may be cancelled if the rules are not observed.",
      ],
    },
  ],
};

const ku: KayitStrings = {
  eyebrow: "Tomarkirin",
  titleLead: "Forma Tomarkirin û",
  titleAccent: "Qebûlkirinê",
  titleTail: "",
  lead: "Formê dagirin û bişînin; forma dagirtî wek PDF digihîje navendê û kopiyek yekser tê barkirin ser cihazê we. Tomarkirin bi îmzeya destan a li atolyeyê diqede.",

  s1: "Agahiyên Giştî",
  s2: "Hûrgiliyên Bernameyê",
  s3: "Agahiyên Dayînê",
  s4: "Agahiyên Taybet ên Xwendekar",
  sTerms: "Şert û Merc",
  s11: "Erêkirin û Qebûlkirin",

  ogrenciAd: "Nav û Paşnavê Xwendekar",
  dogumTarihi: "Dîroka Jidayikbûnê",
  veliAd: "Nav û Paşnavê Serperiştyar",
  telefon: "Hejmara Telefonê",
  eposta: "E-name",
  epostaHint: "Bijarte — da ku em kopiyeke tomara we ji we re jî bişînin",
  adres: "Navnîşan",
  programlar: "Bernameya/yên ku Beşdar Dibe",
  programlarNot: "Ev lîste tenê ji bo agahdariyê ye; bernameyên zarokê we di dema tomarkirinê de li navendê bi hev re tên diyarkirin.",
  baslangicTarihi: "Dîroka Destpêka Kursê",
  bitisTarihi: "Dîroka Dawiya Kursê",
  tarihHint: "Ger nizanin vala bihêlin; navend bi we re diyar dike.",
  odemeTuru: "Cureyê Dayînê",
  odemeGunu: "Roja Dayînê",
  odemeGunuHint: "Ji salnameyê roja ku hûn ê bidin hilbijêrin",
  pesin: "Pêşîn",
  taksitli: "Bi taksît",
  toplamTutar: "Berhevoka Giştî",
  taksitPlani: "Plana Dayînê ya Bijarteya Taksîtê",
  tutarHint: "Ger nizanin vala bihêlin; navend bi we re diyar dike.",

  alerjiSoru: "Alerjiyeke xwendekar heye?",
  alerjiDetay: "Ji kerema xwe alerjiya zarokê xwe rave bikin",
  hastalikSoru: "Nexweşiyeke xwendekar heye?",
  hastalikDetay: "Ji kerema xwe nexweşiya zarokê xwe rave bikin",
  fobiSoru: "Fobiyeke xwendekar heye?",
  fobiDetay: "Ji kerema xwe fobiya zarokê xwe rave bikin",
  evet: "Erê",
  hayir: "Na",

  medyaItiraz: "Ez li dijî bikaranîna wêne û vîdyoyan im",
  medyaItirazDetay: "Ji kerema xwe berfirehiya îtiraza xwe diyar bikin",

  sartlarOnay: "Min hemû şertên di vê formê de xwendin, fêm kirin û qebûl dikim.",
  saglikRiza:
    "Ez razî me ku agahiyên tenduristiyê yên xwendekar (alerjî, nexweşî, fobî) tenê ji bo ewlehiya perwerdehiyê bêne bikaranîn.",
  saglikRizaNot:
    "Agahiya tenduristiyê li gorî qanûna 6698an (KVKK) daneya kesane ya taybet e; loma erêkirineke cuda tê stendin. Ev agahî tenê ji bo ku perwerdekar li qadê rast tevbigere tê bikaranîn.",
  governingNote:
    "Metnê Tirkî yê peymanê esas e. Guhertoyên bi zimanên din tenê ji bo hêsankirina têgihiştinê ne.",
  imzaNot:
    "Qada îmzeyê di PDF'ê de vala tê hiştin. Îmzeya destan li atolyeyê, dema tomarkirin diqede, tê stendin.",

  gonder: "Formê Bişîne",
  gonderiliyor: "Tê şandin…",
  basariliBaslik: "Forma we gihîşt navendê",
  basariliGovde:
    "Forma dagirtî wek PDF ji navendê re hat şandin û kopiyek daket ser cihazê we. Hejmara serlêdana we:",
  pdfIndir: "PDF'ê ji nû ve dabezîne",
  whatsappGonder: "Bi WhatsAppê agahdar bike",
  whatsappNot:
    "WhatsApp destûrê nade ku rûpeleke webê pel pêve bike; ev bişkok kurteyekê wek nivîs vedike. Hûn dikarin PDF'a daketî bi xwe pêve bikin.",
  hataBaslik: "Form nehat şandin",
  hataGovde:
    "Nekarî bigihîje rajekar. Ji kerema xwe ji WhatsAppê binivîsin an telefon bikin; em tomara we rasterast bistînin.",
  yeniForm: "Formeke nû dagire",

  hataZorunlu: "Ev qad pêwîst e.",
  hataTelefon: "Hejmara telefonê ne derbasdar xuya dike.",
  hataEposta: "Navnîşana e-nameyê ne derbasdar xuya dike.",
  hataTarih: "Dîrok ne derbasdar xuya dike.",
  hataProgram: "Herî kêm bernameyekê hilbijêrin.",
  hataDetay: "We \"Erê\" nîşan kir; ji kerema xwe hûrgiliyê binivîsin.",
  hataOnay: "Ji bo berdewamiyê divê hûn vê erêkirinê bidin.",
  hataUzun: "Ev qad pir dirêj e.",
  hataOzet: "Di formê de qadên kêm an çewt hene. Ji kerema xwe cihên nîşankirî sererast bikin.",

  terms: [
    {
      title: "Bikaranîna Malzemeyan û Ziyan",
      items: [
        "Bikaranîna bi baldarî ya malzemeyên ku di çarçoveya kursê de didin xwendekar pêwîst e.",
        "Ger malzeme bi zanetî ziyan bibînin, bihayê ziyanê ji aliyê serperiştyar ve tê dayîn.",
        "Bihayê cihaz an alavên ku bi zanetî tên şikandin, winda bûn an ziyan dîtin dê ji we re were fatûrekirin.",
      ],
    },
    {
      title: "Nehatin û Dersên Telafiyê",
      items: [
        "Ger xwendekar neyê, mafê dersa telafiyê nayê dayîn.",
        "Di rewşên ku ji navendê tên, dersa telafiyê tê dayîn.",
      ],
    },
    {
      title: "Şertên Dayînê",
      items: [
        "Di dayînên demsalî yên pêşîn de %10 daxistin tê sepandin.",
        "Di dayînên bi taksît de pêdiviye bi dîrokên diyarkirî were girêdan.",
      ],
    },
    {
      title: "Bikaranîna Wêne û Vîdyoyê",
      items: [
        "Wêne û vîdyoyên ku di dema kursê de tên girtin dikarin di materyalên danasînê de bên bikaranîn.",
        "Ger di vî warî de îtiraza we hebe ji kerema xwe diyar bikin.",
      ],
    },
    {
      title: "Fesx û Mafê Vekişînê",
      items: [
        "Piştî ku kurs dest pê kir vegerandina dayînê nayê xwestin.",
        "Vegerandina drav tenê ji bo bernameyên ku ji aliyê navendê ve hatine betalkirin tê kirin.",
      ],
    },
    {
      title: "Şertên Din",
      items: [
        "Ewlehî û dîsîplîna zarokan di berpirsiyariya navenda kursê de ye û ger rêzik neyên şopandin tomara xwendekar dikare were betalkirin.",
      ],
    },
  ],
};

const ar: KayitStrings = {
  eyebrow: "التسجيل",
  titleLead: "استمارة التسجيل",
  titleAccent: "والقبول",
  titleTail: "",
  lead: "املأ الاستمارة وأرسلها؛ تصل الاستمارة المعبّأة إلى المركز بصيغة PDF وتُنزَّل نسخة على جهازك فوراً. ويكتمل التسجيل بتوقيع خطّي في الورشة.",

  s1: "معلومات عامة",
  s2: "تفاصيل البرنامج",
  s3: "معلومات الدفع",
  s4: "معلومات خاصة بالطالب",
  sTerms: "الشروط والأحكام",
  s11: "الإقرار والقبول",

  ogrenciAd: "اسم الطالب الكامل",
  dogumTarihi: "تاريخ الميلاد",
  veliAd: "اسم ولي الأمر الكامل",
  telefon: "رقم الهاتف",
  eposta: "البريد الإلكتروني",
  epostaHint: "اختياري — لنرسل إليك نسخة من تسجيلك أيضاً",
  adres: "العنوان",
  programlar: "البرنامج/البرامج المطلوب الالتحاق بها",
  programlarNot: "هذه القائمة للاطلاع فقط؛ تُحدَّد برامج طفلكم معًا في المركز أثناء التسجيل.",
  baslangicTarihi: "تاريخ بدء الدورة",
  bitisTarihi: "تاريخ انتهاء الدورة",
  tarihHint: "اتركه فارغاً إن لم تكن تعرفه؛ يحدّده المركز معك.",
  odemeTuru: "طريقة الدفع",
  odemeGunu: "يوم الدفع",
  odemeGunuHint: "اختاروا من التقويم اليوم الذي ستدفعون فيه",
  pesin: "دفعة واحدة",
  taksitli: "بالتقسيط",
  toplamTutar: "المبلغ الإجمالي",
  taksitPlani: "خطة الدفع في حالة التقسيط",
  tutarHint: "اتركه فارغاً إن لم تكن تعرفه؛ يحدّده المركز معك.",

  alerjiSoru: "هل لدى الطالب أي حساسية؟",
  alerjiDetay: "يرجى توضيح حساسية طفلكم",
  hastalikSoru: "هل لدى الطالب أي مرض؟",
  hastalikDetay: "يرجى توضيح مرض طفلكم",
  fobiSoru: "هل لدى الطالب أي رهاب؟",
  fobiDetay: "يرجى توضيح رهاب (خوف) طفلكم",
  evet: "نعم",
  hayir: "لا",

  medyaItiraz: "لديّ اعتراض على استخدام الصور ومقاطع الفيديو",
  medyaItirazDetay: "يرجى بيان نطاق اعتراضك",

  sartlarOnay: "قرأت جميع الشروط الواردة في هذه الاستمارة وفهمتها وأقبل بها.",
  saglikRiza:
    "أمنح موافقة صريحة على معالجة المعلومات الصحية المذكورة أعلاه عن الطالب (الحساسية، المرض، الرهاب) لغرض السلامة أثناء التدريب فقط.",
  saglikRizaNot:
    "المعلومات الصحية بيانات شخصية ذات طبيعة خاصة بموجب القانون التركي رقم ٦٦٩٨ لحماية البيانات، لذا تُؤخذ موافقة منفصلة عليها. وتُستخدم فقط ليتصرّف المدرّب تصرّفاً صحيحاً في الورشة.",
  governingNote:
    "النص التركي للعقد هو المعتمد. النسخ بلغات أخرى مقدَّمة لتيسير الفهم فقط.",
  imzaNot:
    "يُترك حقل التوقيع فارغاً في ملف PDF. ويُؤخذ التوقيع الخطّي في الورشة عند اكتمال التسجيل.",

  gonder: "إرسال الاستمارة",
  gonderiliyor: "جارٍ الإرسال…",
  basariliBaslik: "وصلت استمارتك إلى المركز",
  basariliGovde:
    "أُرسلت الاستمارة المعبّأة إلى المركز بصيغة PDF ونُزِّلت نسخة على جهازك. رقم طلبك:",
  pdfIndir: "تنزيل ملف PDF مرة أخرى",
  whatsappGonder: "أبلِغنا عبر واتساب",
  whatsappNot:
    "لا يسمح واتساب لصفحة ويب بإرفاق الملفات؛ يفتح هذا الزر ملخّصاً نصياً. ويمكنك إرفاق ملف PDF الذي نزّلته بنفسك إن أردت.",
  hataBaslik: "تعذّر إرسال الاستمارة",
  hataGovde:
    "تعذّر الوصول إلى الخادم. يرجى مراسلتنا على واتساب أو الاتصال بنا لنأخذ تسجيلك مباشرة.",
  yeniForm: "تعبئة استمارة جديدة",

  hataZorunlu: "هذا الحقل مطلوب.",
  hataTelefon: "رقم الهاتف لا يبدو صحيحاً.",
  hataEposta: "البريد الإلكتروني لا يبدو صحيحاً.",
  hataTarih: "التاريخ لا يبدو صحيحاً.",
  hataProgram: "اختر برنامجاً واحداً على الأقل.",
  hataDetay: "اخترت «نعم»؛ يرجى كتابة التفاصيل.",
  hataOnay: "عليك منح هذه الموافقة للمتابعة.",
  hataUzun: "هذا الحقل طويل أكثر من اللازم.",
  hataOzet: "توجد حقول ناقصة أو غير صحيحة. يرجى تصحيح المواضع المعلَّمة.",

  terms: [
    {
      title: "استخدام المواد والأضرار",
      items: [
        "يجب استخدام المواد المسلَّمة للطالب ضمن الدورة بعناية.",
        "في حال إتلاف المواد عمداً، يتحمّل وليّ الأمر قيمة الضرر.",
        "تُفوتَر عليكم قيمة الأجهزة أو المعدات التي تُكسَر أو تُفقَد أو تتضرّر عن قصد.",
      ],
    },
    {
      title: "الغياب ودروس التعويض",
      items: [
        "لا يُمنح حق درس تعويضي في حال غياب الطالب.",
        "يُقدَّم درس تعويضي في الحالات الناشئة عن المركز.",
      ],
    },
    {
      title: "شروط الدفع",
      items: [
        "يُطبَّق خصم ١٠٪ على الدفعات الفصلية المسدَّدة دفعة واحدة.",
        "في الدفع بالتقسيط يجب الالتزام بالتواريخ المحدَّدة.",
      ],
    },
    {
      title: "استخدام الصور ومقاطع الفيديو",
      items: [
        "يجوز استخدام الصور ومقاطع الفيديو الملتقطة أثناء الدورة في المواد التعريفية.",
        "إن كان لديك أي اعتراض على ذلك فيرجى بيانه.",
      ],
    },
    {
      title: "الفسخ وحق العدول",
      items: [
        "لا يجوز طلب استرداد المبلغ بعد بدء الدورة.",
        "يُرَدّ المبلغ فقط في البرامج التي يلغيها المركز.",
      ],
    },
    {
      title: "شروط أخرى",
      items: [
        "سلامة الأطفال وانضباطهم من مسؤولية مركز الدورة، ويجوز إلغاء تسجيل الطالب في حال عدم الالتزام بالقواعد.",
      ],
    },
  ],
};

const dictionaries: Record<Locale, KayitStrings> = { tr, en, ku, ar };

export function kayitStrings(locale: Locale): KayitStrings {
  return dictionaries[locale];
}
