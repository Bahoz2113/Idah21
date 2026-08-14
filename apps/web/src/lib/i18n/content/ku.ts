import type { Content } from "./tr";

/**
 * İÇERİK SÖZLÜĞÜ — KURMANCÎ (Latin alfabesi).
 *
 * LEHÇE SEÇİMİ. Batman ve çevresinde konuşulan Kurmancîdir ve Türkiye'de
 * Latin alfabesiyle yazılır. Soranî (Arap alfabesi) bu bölgenin okuru için
 * yanlış tercih olurdu — hem lehçe hem yazı sistemi farklı.
 *
 * ÖZEL İSİMLER ÇEVRİLMEZ: kurum adı, mahalle ve cadde adları, telefon.
 * Veli hangi dilde okursa okusun aynı kapıya gelir.
 *
 * ANA DİLDE OKUMA. Bu sayfa Kurmancî konuşan bir veli için sembolik bir
 * jest değil; teknik terimlerin (mîkrokontroler, algorîtma, telemetrî)
 * Kurmancîde yerleşik karşılıkları kullanıldı, olmadığında uluslararası
 * biçim Kurmancî imlasıyla yazıldı.
 *
 * YAYINDAN ÖNCE ANA DİL KONTROLÜ GEREKİR. Bu metinler makine üretimi
 * değil ama ana dili Kurmancî olan bir okurun gözden geçirmesi şart —
 * özellikle ravekirin (izafe) ekleri ve fiil çekimleri.
 */
export const ku: Content = {
  org: {
    slogan: "XEYAL BIKE, KOD BIKE, PAŞEROJÊ SÊWIRÎNE.",
    tagline: "Baregeha Teknolojiyê ya Batmanê: Endezyarên Pêşerojê yên 6-16 Salî Perwerde Dibin.",
    description:
      "CEZERÎ ROBOTECH navendeke perwerdehiya teknolojiyê ye li Batmanê, ku ji zarok û " +
      "ciwanên di navbera 6-16 salî de perwerdehiya robotîk û kodkirinê, aqilmendiya " +
      "sûnî, sîstemên IHA/VTOL, roketvaniyê û sêwirana 3D dide. Xwendekar di atolyeyên " +
      "pratîkî de drona xwe bi destên xwe dimeltînin, koda xwe dinivîsin û bi testên " +
      "firîna qadê dîsîplîna endezyariyê ji nêz ve dijîn.",
    legalName: "Navenda Teknolojî û Perwerdehiyê ya Cezerî Robotech",
    ageRangeLabel: "6-16 salî",
    foundingLocation: "Batman, Tirkiye",
  },

  intro: {
    index: "01 — Nêzîkatiya Me",
    titleLead: "Nifşên ku Pêşerojê Naxwin,",
    titleAccent: "Sêwirînin",
    titleTail: "",
    body: "Xwendekar li vir tenê fêrî nivîsandina kodê an xebitandina robotekê nabin; fêrî ramanê, sêwiranê, ceribandinê, xeletîkirinê û ji nû ve çêkirinê dibin.",
  },

  cta: {
    index: "09 — Vexwendin",
    titleLead: "Werin Pêşerojê",
    titleAccent: "Bi Hev Re",
    titleTail: "Sêwirînin",
    lead: "Rêwîtiya teknolojiyê ya zarokê xwe di temenê rast de, bi rêberiya rast û bi projeyên rastîn dest pê bikin.",
  },

  metrics: [
    { label: "Hangara Perwerdehiyê", hint: "Ji IHA'yê heta aqilmendiya sûnî 10 dîsîplînên bingehîn" },
    { label: "Rêza Temen", hint: "Rêyeke li gorî temen pileyî" },
    { label: "Atolyeya Pratîkî", hint: "Di dawiya her dersê de encameke xebitî" },
    { label: "Baregeha Batmanê", hint: "Navenda teknolojiyê ya Taxa Belde" },
  ],

  legacy: [
    {
      era: "1206",
      title: "Pirtûka El-Cezerî",
      body: "Îsmaîl el-Cezerî berhema xwe ya der barê amûrên mekanîkî yên awarte de temam dike; qeyda yekem a sîstematîk a otomatên bernamekirî dihêle.",
    },
    {
      era: "Sîbernetîk",
      title: "Otomatê Bernamekirî",
      body: "Amûrên ku bi hêza avê dixebitin û rêza karên wan bi mîlê kamê û manîvelê tê guhertin — bapîrê endezyariya kontrolê ya nûjen.",
    },
    {
      era: "Îro",
      title: "Kod û Senzor",
      body: "Heman dîsîplîn niha bi mîkrokontroler, senzor û algorîtmayê didome. Heman ax, heman meraq.",
    },
    {
      era: "Sibê",
      title: "Sîstemên Otonom",
      body: "Xwendekarên ku li atolyeya Batmanê perwerde dibin amûrên hewayî yên otonom û sîstemên aqilmendiya sûnî sêwirînin.",
    },
  ],

  chapters: {
    egitimler: {
      eyebrow: "Perwerdehiyên Me",
      titleLead: "Deh Perwerdehî, Yek Dîsîplîn:",
      titleAccent: "Tiştekî Xebitî Çêbike.",
      titleTail: "",
      lead: "Li CEZERÎ ROBOTECH perwerdehî li deh dîsîplînên bingehîn hatiye dabeşkirin: sîstemên IHA/VTOL, roketvanî, aqilmendiya sûnî û fêrbûna makîneyê, robotîk û kodkirin, sêwirana 3D û hilberîna zêdekî, nermalav û algorîtma, elektronîk û mekatronîk, hişyariya ewlehiya sîber, zanistên fezayê û hewavaniyê, karsaziya teknolojiyê. Her perwerdehî bi encameke xebitî ya ku xwendekar bi destê xwe hilberandiye diqede.",
    },
    mufredat: {
      eyebrow: "Bernameya Me",
      titleLead: "Hefte bi Hefte",
      titleAccent: "Em Çi Hîn Dikin?",
      titleTail: "",
      lead: "Li CEZERÎ ROBOTECH çar bername têne meşandin: kodkirina bi blokan (ji ScratchJr heta mBlock), atolyeya elektrîk û enerjiyê ya bingehîn, atolyeya ceribandina elektronîk û lehîmkirinê, robotîk û kodkirin bi Arduino. Li jêr plana dersê ya hefteyî, amûrên bikaranînê û pêkhateya modulan a her bernameyê heye — hûn dikarin hefte bi hefte bixwînin ku em çi hîn dikin.",
    },
    atolye: {
      eyebrow: "Atolye û Qad",
      titleLead: "Ne Simulasyon. Atolyeyeke Rastîn.",
      titleAccent: "",
      titleTail: "",
      lead: "Li atolyeya Batmanê xwendekar çaperê 3D dixebitînin, laşê dronê dimeltînin, çerx lehîm dikin û li qadê testa firîna rastîn dikin. Wêneyên jêrîn ji van xebatan hatine girtin; dîsîplînên ku hê qeyda wan tune bi etîketa 'Konsept' hatine nîşankirin. Rûyên xwendekaran ji ber rêzgirtina nepenîtiyê hatine tarîkirin.",
    },
    miras: {
      eyebrow: "Mîrateya Cezerî",
      titleLead: "Heşt Sed Sal Berê Li Vir",
      titleAccent: "Otomat",
      titleTail: "Hebûn.",
      lead: "Navê saziyê ji Îsmaîl el-Cezerî tê, ku qeyda yekem a sîstematîk a otomatên bernamekirî hiştiye. Îro heman dîsîplîn bi mîkrokontroler, senzor û algorîtmayê didome.",
    },
    basin: {
      eyebrow: "Em Di Çapemeniyê De",
      titleLead: "Gava Yên Din Me Vedibêjin",
      titleAccent: "",
      titleTail: "",
      lead: "Nûçe, hevpeyivîn û qeydên çalakiyan ên di çapemeniya herêmî û neteweyî de. Ne ya ku sazî li ser xwe dibêje, ya ku aliyê sêyem piştrast kiriye.",
    },
    sss: {
      eyebrow: "Pirsên Pir Tên Pirsîn",
      titleLead: "Tiştên Tên Meraqkirin",
      titleAccent: "",
      titleTail: "",
      lead: "Pirsên ku dê û bav û xwendekar herî zêde dipirsin û bersivên wan ên zelal.",
    },
    iletisim: {
      eyebrow: "Operasyonên Baregehê",
      titleLead: "Bi Baregehê Re Têkilî Deyne",
      titleAccent: "",
      titleTail: "",
      lead: "Ji WhatsAppê binivîsin, li Instagramê bişopînin an rasterast werin atolyeyê.",
    },
  },

  disciplines: {
    "iha-vtol": {
      title: "Sîstemên IHA / VTOL",
      summary: "Sêwiran, meltandin û kontrola firîna amûrên hewayî yên bêpîlot ên bi rabûna stûnî.",
      detail:
        "Di perwerdehiya drone û IHA de xwendekar platformên multirotor û VTOL ji sifirê dimeltînin, karta kontrola firînê kalîbre dikin û plansaziya erka otonom dikin. Perwerdehî bi testa firîna rastîn a qadê temam dibe.",
      outcomes: [
        "Meltandina laş û sîstema pêldanê",
        "Kalîbrekirina karta kontrola firînê",
        "Plansaziya erka otonom",
        "Testa firîna qadê",
      ],
    },
    roketcilik: {
      title: "Roketvanî û Pêldan",
      summary: "Aerodînamîka roketa modelî, hesabê pêldanê û protokola ewle ya berdanê.",
      detail:
        "Xwendekar aerodînamîka laşê roketê, geometriya baskan û rêjeya pêldan-girseyê hesab dikin; sîstema rizgarkirinê sêwirînin û bi protokoleke kontrolkirî berdanê pêk tînin.",
      outcomes: [
        "Sêwirana aerodînamîk",
        "Hesabê pêldan-girseyê",
        "Sîstema rizgarkirinê ya paraşûtê",
        "Berdana kontrolkirî",
      ],
    },
    "yapay-zeka": {
      title: "Aqilmendiya Sûnî û Fêrbûna Makîneyê",
      summary: "Têgihiştina aqilmendiya sûnî bi pêvajoya wêneyan, komdaneyan û perwerdekirina modelê.",
      detail:
        "Di modula aqilmendiya sûnî de xwendekar komdaneyên xwe berhev dikin, modeleke dabeşkirina wêneyan perwerde dikin û fêr dibin ku şîrove bikin ka model çima şaş bûye. Armanc ew e ku aqilmendiya sûnî ne wek sêhrê lê wek endezyariyê were fêmkirin.",
      outcomes: [
        "Çêkirina komdaneyê",
        "Perwerdekirin û testkirina modelê",
        "Sepana pêvajoya wêneyan",
        "Xwendewariya etîk û alîgiriyê",
      ],
    },
    robotik: {
      title: "Robotîk û Sîstemên Otonom",
      summary: "Xelekeya senzor-motor, şopandina xetê û mekanîzmayên biryara otonom.",
      detail:
        "Di dilê kursa robotîk û kodkirinê de xwendekar xwendina senzorê, ajotina motorê û xelekeya paşvegerê saz dikin; robotên otonom ên ku astengan dibînin û rê rast dikin pêş dixin.",
      outcomes: [
        "Yekgirtina senzor-aktuator",
        "Hestiyariya mantiqa PID",
        "Navîgasyona otonom",
        "Amadekariya pêşbaziya robotan",
      ],
    },
    "3d-tasarim": {
      title: "Sêwirana 3D û Hilberîna Zêdekî",
      summary: "Modelkirina parametrîk, dilîmkirin û hilberîna perçeyên rastîn bi çaperê 3D.",
      detail:
        "Di kursa sêwirana 3D de xwendekar bi CAD'a parametrîk perçeyên xwe model dikin, mîhengên dilîmkirinê baştir dikin û li çaperê 3D hilberînin û pîvana toleransê dikin.",
      outcomes: [
        "Modelkirina CAD ya parametrîk",
        "Baştirkirina dilîmkirinê",
        "Hilberîna çapa 3D",
        "Kontrola pîvan û toleransê",
      ],
    },
    kodlama: {
      title: "Nermalav û Algorîtma",
      summary: "Derbasbûna pileyî ji bernamesaziya bi blokan bo ya bi nivîsê.",
      detail:
        "Rêya ku di 6 saliyê de bi bernamesaziya dîtbarî ya bi blokan dest pê dike, bi mezinbûna temen ber bi Python û C'ya vegirtî ve diçe. Di her astê de xwendekar berhemeke xebitî radest dike.",
      outcomes: [
        "Ramana algorîtmîk",
        "Bernamesaziya bi blokan",
        "Bingehên Python",
        "Kodkirina sîstema vegirtî",
      ],
    },
    elektronik: {
      title: "Elektronîk û Mekatronîk",
      summary: "Xwendina çerxê, lehîmkirin û yekgirtina mekanîk-elektronîk.",
      detail:
        "Xwendekar nexşeya çerxê dixwînin, li ser breadboardê prototîp saz dikin, bi ewlehî lehîm dikin û elektronîkê bi organên veguhastina mekanîkî re digihînin hev.",
      outcomes: [
        "Xwendina nexşeya çerxê",
        "Lehîmkirina ewle",
        "Bikaranîna mîkrokontroler",
        "Yekgirtina mekatronîk",
      ],
    },
    "siber-guvenlik": {
      title: "Hişyariya Ewlehiya Sîber",
      summary: "Paqijiya dîjîtal, mantiqa şîfrekirinê û çanda ewlehiyê ya li ser parastinê.",
      detail:
        "Bi naveroka li ser parastinê xwendekar paqijiya şîfreyê, mantiqa şîfrekirinê, naskirina taktîkên endezyariya civakî û tevgera torê ya ewle pêş dixin.",
      outcomes: [
        "Paqijiya dîjîtal",
        "Mantiqa şîfrekirinê",
        "Naskirina endezyariya civakî",
        "Tevgera torê ya ewle",
      ],
    },
    "uzay-havacilik": {
      title: "Zanistên Fezayê û Hewavaniyê",
      summary: "Bingehên mekanîka gerdûnê, sîstemên satelîtan û sêwirana erkê.",
      detail:
        "Mantiqa gerdûnê, jêrsîstemên satelîtê û dîsîplîna plansaziya erkê bi sêwirana erkeke biçûk a mîna CanSat bi awayekî pratîkî tê xebitandin.",
      outcomes: [
        "Hestiyariya mekanîka gerdûnê",
        "Jêrsîstemên satelîtê",
        "Sêwirana barê erkê",
        "Xwendina telemetriyê",
      ],
    },
    girisimcilik: {
      title: "Karsaziya Teknolojiyê",
      summary: "Ji fikrê bo prototîpê, ji prototîpê bo pêşkêşkirinê: dîsîplîna berhemkirinê.",
      detail:
        "Xwendekar pirsgirêkê diyar dikin, çareseriyê prototîp dikin, lêçûnê derdixin û li ber jûriyê diparêzin. Wek tîm ji bo pêşbaziyên mîna Teknofestê amade dibin.",
      outcomes: [
        "Diyarkirina pirsgirêkê",
        "Prototîpkirina bilez",
        "Analîza lêçûnê",
        "Pêşkêşkirina li ber jûriyê",
      ],
    },
  },

  faqs: [
    {
      q: "CEZERÎ ROBOTECH çi ye?",
      a: "CEZERÎ ROBOTECH navendeke perwerdehiya teknolojiyê ye ku li Batmanê ye û ji zarok û ciwanên di navbera 6-16 salî de perwerdehiya robotîk û kodkirinê, aqilmendiya sûnî, IHA/VTOL, roketvanî û sêwirana 3D dide. Perwerdehî bi tevahî di forma atolyeya pratîkî de tê meşandin.",
    },
    {
      q: "Ji kîjan koman temenî re perwerdehî tê dayîn?",
      a: "Perwerdehî ji bo xwendekarên di navbera 6 û 16 salî de ye. Bername li gorî temen pileyî ye: 6-8 salî bi bernamesaziya dîtbarî ya bi blokan û robotîka bingehîn dest pê dike, 9-12 salî bi elektronîk û sêwirana 3D kûr dibe, 13-16 salî derbasî modulên pêşketî yên wekî IHA/VTOL, aqilmendiya sûnî û roketvaniyê dibe.",
    },
    {
      q: "Ez li Batmanê li kursa robotîk û kodkirinê digerim, ji ku derê dest pê bikim?",
      a: "Ji bo destpêkê hûn dikarin beşdarî atolyeya nasînê ya belaş a CEZERÎ ROBOTECH bibin. Piştî ku temen û qada eleqeya xwendekar diyar bû, rêya hangara guncaw tê pêşniyarkirin. Ji bo tomarkirinê hûn dikarin bi 0540 662 72 72 re têkilî deynin, ji heman hejmarê bi WhatsAppê binivîsin an ji Instagramê ji hesabê @cezerirobotech re peyamê bişînin.",
    },
    {
      q: "Zanîna berê an ezmûna komputerê pêwîst e?",
      a: "Na. Bername ji bo xwendekarên ku ji sifirê dest pê dikin hatine sêwirandin. Xwendekarekî ku qet kod nenivîsandiye bi bernamesaziya dîtbarî ya bi blokan dest pê dike û bi pileyî derbasî bernamesaziya bi nivîsê dibe. Hemû amûrên pêwîst li atolyeyê têne dayîn.",
    },
    {
      q: "Perwerdehî li ku derê tê dayîn?",
      a: "Hemû perwerdehî rû bi rû li atolyeya CEZERÎ ROBOTECH a li navnîşana Taxa Belde, Kolana Firat, Apartmana Barış No:16/B ya Batmanê tê dayîn. Li atolyeyê çaperên 3D, tezgeha elektronîkê, stasyona meltandina dronê û qada testa firînê hene.",
    },
    {
      q: "Di perwerdehiya drone û IHA de xwendekar bi rastî difirînin?",
      a: "Erê. Xwendekar platformên IHA û VTOL ên ku meltandine di bin çavdêriya perwerdekar de testa firîna rastîn a qadê dikin. Firîn bi protokola ewlehiyê û lîsteya kontrolê, di şert û mercên hewa û qadê yên guncaw de têne kirin.",
    },
    {
      q: "Bernameya dersê û dema wê çawa ye?",
      a: "Ders bi rêza hefteyî, li derveyî saetên dibistanê û dawiya hefteyê têne plansazkirin. Her modula hangarê bi dewreyê pêş dikeve û di dawiya dewreyê de xwendekar projeya xwe radest dike. Ji bo hilbijartinên roj û saetê yên rojane hûn dikarin ji hejmara 0540 662 72 72 bi WhatsAppê agahî bistînin.",
    },
    {
      q: "Dê û bav pêşketina xwendekar çawa dişopînin?",
      a: "CEZERÎ ROBOTECH sîstema xwe ya rêveberiya perwerdehiyê bi kar tîne. Dê û bav dikarin ji panela xwe rewşa beşdariyê, nirxandinên dersê, pêşketina projeyê û notên perwerdekar bibînin.",
    },
    {
      q: "Ji bo pêşbaziyên mîna Teknofestê amadekarî tê kirin?",
      a: "Erê. Karsaziya Teknolojiyê û modulên hangarê yên asta pêşketî, xwendekaran wek tîm ji bo pêşbaziyên teknolojiyê yên neteweyî yên mîna Teknofestê amade dikin. Pêvajo hemû qonaxan ji diyarkirina pirsgirêkê heta prototîpê û pêşkêşkirina li ber jûriyê digire nav xwe.",
    },
    {
      q: "Xwendekarên ji derveyî Batmanê dikarin beşdar bibin?",
      a: "Erê. CEZERÎ ROBOTECH her çend navenda wê li Batmanê be jî, ji seranserê Herêma Anadoliya Başûrrojhilat, bi taybetî ji Sêrt, Mêrdîn û Diyarbekirê xwendekaran qebûl dike. Ji bo xwendekarên ji derveyî herêmê bernameyên dawiya hefteyê yên tîr dikarin bên plansazkirin.",
    },
  ],

  channels: {
    instagramHint: "Wêneyên atolyeyê, parvekirinên projeyan û ragihandin",
    whatsappHint: "Ji bo tomarkirin, bernameya dersê û bihayê tavilê binivîsin",
    mapsHint: "Rêya baregeha me ya li Taxa Belde bistînin",
  },
};
