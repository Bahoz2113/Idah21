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
    index: "10 — Vexwendin",
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
      lead: "Li atolyeya Batmanê xwendekar çaperê 3D dixebitînin, laşê dronê dimeltînin, çerx lehîm dikin û li qadê testa firîna rastîn dikin. Wêneyên jêrîn ji van xebatan hatine girtin; dîsîplînên ku hê qeyda wan tune bi etîketa 'Konsept' hatine nîşankirin.",
    },
    basin: {
      eyebrow: "Em Di Çapemeniyê De",
      titleLead: "Gava Yên Din Me Vedibêjin",
      titleAccent: "",
      titleTail: "",
      lead: "Em karê xwe ne bi sozên mezinkirî; bi keda xwendekarên xwe, bi projeyên rastîn ên derdikevin holê û bi xebatên xwe yên li qadê vedibêjin.",
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

  about: {
    eyebrow: "Em Kî Ne",
    titleLead: "Baregeheke Teknolojiyê ya li Batmanê Çêbûyî,",
    titleAccent: "Pêşerojê Ava Dike",
    titleTail: "",
    lead: "Em CEZERÎ ROBOTECH in. Li Batmanê çêbûne; baregeheke teknolojiyê ya aqilmendiya sûnî, robotîk, nermalav û hewavaniyê ne ku meraqê dike zanîn, zanînê dike sêwiran û sêwiranê dike berhemeke bi rastî dixebite.",

    photoAlt:
      "Kadroya perwerdekaran a CEZERÎ ROBOTECH li Batmanê, li ber amblema kundê robotîk a saziyê",
    photoCaption: "Kadroya me ya perwerdekaran li atolyeya Batmanê",

    identity: [
      "Dema em bi rê ketin me ji xwe pirseke hêsan lê bihêz kir: Ma zarokên me dê tenê bikarhênerên teknolojiyê bin, an dê ew mirov bin ku wê fêm dikin, pêş dixin û rê li pêşerojê nîşan didin? CEZERÎ ROBOTECH bersiva me ya vê pirsê ye.",
      "Navenda me ya li Batmanê; robotîk û kodkirin, nermalav, aqilmendiya sûnî, elektronîk, sêwiran û hilberîna 3D, drone, IHA û xebatên hewavaniyê di nav heman çanda hilberînê de tîne cem hev. Ji bo me teknolojî ne cîhaneke dûr e ku li ser ekranê tê temaşekirin. Qadeke hilberînê ya rastîn e — tê destlêdan, tê veqetandin, ji nû ve tê danîn, tê kodkirin, tê ceribandin û di dawiyê de dixebite.",
      "Em dixwazin meraqa el-Cezerî ya ku em navê wê hildigirin, hişê wî yê endezyariyê û vîna wî ya hilberînê ya ku sedsalan derbas kiriye bi zarokên îro re bibin pêşerojê. Em ji mîrateya mezin a zanist û endezyariya borî îlham digirin û rûyê xwe didin aqilmendiya sûnî, sîstemên otonom, robotan û teknolojiyên hewayî yên pêşerojê.",
    ],

    quotes: [
      "Em li benda wê nînin ku pêşeroj li cihekî din were avakirin. Em wê li Batmanê, bi xwendekarên xwe re ava dikin.",
      "Ji bo me xeletî ne têkçûn e; destpêka ramanê, lêkolînê û fêrbûna rastîn e.",
      "Bila zarokên me pêşerojê tenê temaşe nekin; bila wê sêwirînin, kod bikin û ava bikin.",
      "Pêşeroj di destên yên ku wê ava dikin de teşe digire.",
    ],

    blocks: [
      {
        title: "Nifşek ku Teknolojiyê Ava Dike, Ne ku Tenê Bi Kar Tîne",
        body: [
          "Di navenda têgihiştina me ya perwerdehiyê de armancek heye: Zarokan ji bikarhênerên pasîf ên teknolojiyê derxin û bikin hilberînerên ku dikarin fikrên xwe bikin rastî.",
          "Bi taybetî ji xwendekarên di navbera 6-16 salî de re, li gorî temen û asta pêşketina wan perwerdehiya teknolojiyê ya pratîkî pêşkêş dikin. Herwiha car caran ji bo beşdarên 18 salî û mezintir bernameyên robotîk û kodkirinê yên pratîkî yên ji sifirê dest pê dikin li dar dixin.",
          "Di atolyeyên me de xwendekar ne kodekê ji ber dike ne jî modeleke amade dubare dike. Fêr dibe ka pirsgirêkek çawa tê diyarkirin, çareserî çawa tê sêwirandin, perçe çawa tên gihandin hev û gava ceribandina yekem nexebitî çawa ji nû ve tê ramîn.",
          "Çerxeke elektronîk saz dike, ji senzoran dane distîne, algorîtmayê pêş dixe, robot sêwirîne, nermalav dinivîse, modela 3D çêdike, prototîp hilberîne, drone û sîstemên firînê nas dike, roketa modelî pêş dixe. Fêr dibe ku fikra xwe rave bike, projeya xwe pêşkêş bike, bi hevalên tîmê re hevkariyê saz bike û bi qasî encamê nirx bide pêvajoyê jî.",
          "Ji ber vê yekê em dixwazin ji xwendekarên xwe re ne tenê behreyên teknîkî; herwiha çareserkirina pirsgirêkan, ramana analîtîk, sebir, kombûn, berpirsiyarî, xebata tîmê, hişmendiya sêwiranê û wêrekiya hilberînê bidin.",
          "Em dizanin ku awayê fêrbûnê, meraq û leza pêşketina her zarokî cuda ye. Loma em perwerdehiyê ne wek vegotineke yekalî lê wek pêvajoyeke jîndar dibînin ku tê de xwendekar keşf dike, pirs dike, ceribandinê dike û berhema xwe derdixe holê.",
        ],
      },
      {
        title: "Ne Ders; Atolye, Ezmûn û Projeya Rastîn",
        body: [
          "Li CEZERÎ ROBOTECH fêrbûn bi teoriyê dest pê dike û bi pratîkê kûr dibe. Robotîk û kodkirin, mantiqa nermalava bingehîn û pêşketî, sepanên aqilmendiya sûnî, elektronîk, sêwiran û çapa 3D, teknolojiyên IHA-drone, hewavanî û xebatên roketa modelî ne sernavên ji hev qetiyayî ne. Her yek ji van, parçeyek ji rêwîtiya xwendekar a ji fikrekê ber bi sîstemeke xebitî ye.",
          "Xwendekarên me carinan bi sîstemeke alarmê ya hêsan mantiqa senzorê keşf dikin, carinan tevgerên robotekê kod dikin, carinan modeleke 3D sêwirînin û dikin berhemeke fizîkî. Û carinan jî şahidiya wê dikin ku amûreke hewayî an roketek a ku mehan jê re keda wan çûye digihîje ezmên.",
          "Ev nêzîkatî tenê bersiva pirsa «çawa tê kirin?» nade. Wan teşwîq dike ku bipirsin «çawa dikare çêtir bibe?», «ev pirsgirêk bi kîjan rêbaza din dikare were çareserkirin?» û «ez çi dikarim ava bikim?».",
          "Bi atolyeyên demsala havîn û biharê, xebatên projeyê û pêvajoyên amadekariya pêşbaziyan em piştgiriyê didin ku xwendekarên me bi teknolojiyê re têkiliyeke demdirêj saz bikin. Em TEKNOFEST û pêşbaziyên teknolojiyê yên wek wê ne tenê wek çalakiyên ku tê de derece tê stendin, lê wek qadên pêşketinê dibînin ku tê de lêkolîn, dîsîplîna projeyê, xebata tîmê û wêrekiya pêşkêşkirina fikrê tê fêrbûn.",
        ],
      },
      {
        title: "Cihê ku Xewn Dibe Sîstemeke Xebitî",
        body: [
          "Em bi tenê behskirina pêşerojê ji zarokan re têr nakin; em ji wan re dorhêlekê peyda dikin ku tê de bi destên xwe parçeyek ji pêşerojê ava bikin.",
          "Yek ji nimûneyên herî diyar ên vê têgihiştinê, Pêşbaziya Robot û Teknolojiyê ya Yediiki bû ku di 29-30ê Nîsana 2026an de li Batmanê hat lidarxistin. Di vê organîzasyona ku tê de projeyên robotîk û aqilmendiya sûnî hatin pêşandan, me wek CEZERÎ ROBOTECH cara yekem li Batmanê firîna IHA ya VTOL û pêşandana berdana roketa modelî pêk anî.",
          "Ji bo me ev firîn û berdan tenê pêşandaneke teknîkî nebû. Delîl bû ku xewnek li Batmanê hatî avakirin dikare bi zanîna endezyariyê û pêvajoyeke hilberînê ya biryardar bibe rastî. Hesta «ez jî dikarim bikim» ku di çavên zarokekî de çêdibe, yek ji encamên herî bi nirx e.",
          "Robotên ku li atolyeyên me têne sêwirandin, çerxên elektronîk, sepanên aqilmendiya sûnî, modelên 3D, sîstemên dronê û roketên modelî yên bi bilindahiyên cuda hemû berhema heman ramanê ne: Rêya herî bihêz a fêrbûnê hilberîn e.",
        ],
      },
      {
        title: "Navendeke ku Ji Batmanê Ber Bi Pêşerojê Vedibe",
        body: [
          "CEZERÎ ROBOTECH ne tenê kursek e ku ders dide. Em ekosîstemeke hilberîn û pêşketinê ava dikin ku tê de zarok, ciwan, endezyar, perwerdekar, sazî û karsaziyên herêmî li dora teknolojiyê digihîjin hev.",
          "Em bawer dikin ku kapasîteya teknolojiyê ya Batmanê ne bi hejmara bikarhêneran, lê bi mirovên ku kod dinivîsin, robot pêş dixin, proje hilberînin, aqilmendiya sûnî rast bi kar tînin û ji bo pirsgirêkên rastîn çareseriyan sêwirînin dê mezin bibe. Loma em deriyê navenda xwe ne tenê ji dersên îro re, lê ji pîşeyên sibê û ji qadên pisporiyê yên nû yên ku hê navê wan nehatiye danîn re vedikin.",
          "Em xebatên xwe bi berpirsiyariyeke herêmî û vîzyoneke gerdûnî dimeşînin. Em dixwazin zarok û ciwanên Batmanê bi perwerdehiya teknolojiyê ya bi kalîte re bicivin, potansiyela xwe keşf bikin û bi bawerî di dorhêlên hilberînê yên neteweyî an navneteweyî de cih bigirin.",
          "Ji bo me Batman ne tenê bajarê ku em tê de ne. Navenda veguherîna ku me dest pê kiriye, îlhama me û navnîşana soza ku me daye pêşerojê ye.",
        ],
      },
      {
        title: "Ji Perwerdehiyê Ber Bi Veguherîna Dîjîtal",
        body: [
          "Em nêrîna xwe ya li ser teknolojiyê tenê bi perwerdehiya zarok û ciwanan sînordar nakin. CEZERÎ ROBOTECH di heman demê de ji karsazî û saziyan re pêşxistina nermalavê, çareseriyên bi piştgiriya aqilmendiya sûnî, şêwirmendî û xizmetên veguherîna dîjîtal pêşkêş dike.",
          "Hevkariya ku bi Odeya Esnaf û Hunermendan a Batmanê hatiye kirin; nimûneyeke berbiçav a vîna me ye ku alîkariya karsaziyên herêmî bike da ku xwe li cîhana dîjîtal biguncînin, berhemdariya xwe zêde bikin û teknolojiyê bi bandortir bi kar bînin. Hevkariya ku bi Şaxa Batmanê ya Sendîkaya Petrol-İş re di warê perwerdehî û nermalavê de hatiye avakirin jî nêzîkatiya me ya kirina teknolojiyê ji bo beşên cuda yên civakê zêdetir gihîştî nîşan dide.",
          "Ji ber ku em dizanin veguherîna teknolojîk tenê bi amûr an nermalavê pêk nayê. Veguherîna rastîn bi wê dest pê dike ku mirov digihîje zanînê, behreyên nû bi dest dixe û dikare teknolojiyê bike çareseriyeke li gorî pêdiviya xwe.",
          "Loma em ji aliyekî ve endezyarên pêşerojê perwerde dikin û ji aliyê din ve ji karsaziyên îro re çareseriyên ku pê xwe ji bo pêşerojê amade bikin pêşkêş dikin.",
        ],
      },
    ],

    valuesTitle: "Nirxên ku Me Dikin Em",
    values: [
      {
        title: "Meraq",
        body: "Meraq xala destpêkê ya CEZERÎ ROBOTECH e. Ji ber ku her keşfa mezin bi wêrekiya kirina pirsa rast dest pê dike.",
      },
      {
        title: "Hilberîn",
        body: "Hilberîn navenda perwerdehiya me ye. Em bawer dikin ku ji bo zanînek bibe nirxeke rastîn divê were ceribandin, sepandin û parvekirin.",
      },
      {
        title: "Mirov Pêşî",
        body: "Mirov li pêşiya teknolojiyê ye. Em aqilmendiya sûnî, robotan û nermalavê ne wek armanc lê wek amûrên ku hêza ramîn, hilberîn û çareserkirina mirov xurt dikin dibînin.",
      },
      {
        title: "Rastgoyî",
        body: "Xwezayîbûn û dilsozî bingeha ragihandina me ye. Em karê xwe ne bi sozên mezinkirî; bi keda xwendekarên xwe, bi projeyên rastîn ên derdikevin holê û bi xebatên xwe yên li qadê vedibêjin.",
      },
      {
        title: "Bawerî",
        body: "Bawerî ji bo têkiliya ku em bi zarok û malbatan re saz dikin bêalternatîf e. Em dorhêlekê ava dikin ku rêzê li meraqa xwendekar digire, pêşketina wî girîng dibîne û her gavê bi fêrbûna rastîn piştgirî dike.",
      },
      {
        title: "Ji Herêmî Bo Gerdûnî",
        body: "Em ji herêmî ber bi gerdûnî dinêrin. Em bawer dikin ku fikreke li Batmanê hatî hilberandin dikare bigihîje cîhanê; bi perwerdehiya rast, xebata biryardar û xewneke bihêz tu erdnîgarî ji hilberîna teknolojiyê der namîne.",
      },
    ],

    missionTitle: "Mîsyona Me",
    mission:
      "Zarok û ciwanan ne tenê wek bikarhênerên teknolojiyê; wek kesên ku diramin, sêwirînin, kod dikin û hilberînin perwerde kirin; di warên robotîk, nermalav, aqilmendiya sûnî, elektronîk, hilberîna 3D û hewavaniyê de dorhêlên fêrbûnê yên bi kalîte, pratîkî û li ser projeyan pêşkêş kirin; û bi çareseriyên ji pêdiviyên rastîn çêbûyî beşdarî veguherîna dîjîtal a sazî û karsaziyan bûn.",
    visionTitle: "Vîzyona Me",
    vision:
      "Bi destpêka ji Batmanê, bûyîna yek ji navendên pêşeng ên perwerdehî û hilberînê yên Tirkiyeyê di warên aqilmendiya sûnî, robotîk û hewavaniyê de; û pêşengiya perwerdekirina nifşeke nû ya endezyar, karsaz û dahênerên ku teknolojiya xwe pêş dixin, di astê gerdûnî de proje hilberînin û nirx didin mirovahiyê.",

    heritageTitle: "Çîroka Navê Me",
    heritageLead:
      "Navê saziyê ji Îsmaîl el-Cezerî tê, ku qeyda yekem a sîstematîk a otomatên bernamekirî hiştiye. Îro heman dîsîplîn bi mîkrokontroler, senzor û algorîtmayê didome.",

    promiseTitle: "Soza Me ya Pêşerojê",
    promise: [
      "Em bawer dikin ku di hundirê her zarokî de fikrek heye ku li benda keşfkirinê ye.",
      "Em li vir in ku wê fikrê bi meraqê mezin bikin, bi zanînê xurt bikin, bi amûrên rast bigihînin hev û heta ku bibe berhemeke rastîn li kêleka xwendekar bimeşin.",
      "Di tevgera yekem a robotekê de, di cara yekem ku kodek rast dixebite de, di ronahiya çerxekê de, di bûyîna sêwiraneke 3D bo berhemeke fizîkî de û di kêliya ku roketek bilind dibe ezmên de em heman heyecanê dibînin.",
      "Loma em ne tenê teknolojiya îro hîn dikin. Em karakterê nifşekê ava dikin ku pirsan dike, çareseriyan pêş dixe, bi hev re dixebite, ji xeletiyê natirse û ji nû ve diceribîne.",
    ],
    signOff: "Em CEZERÎ ROBOTECH in. Xewnekê ku li Batmanê çêbûye bi zanîn, bi ked û bi teknolojiyê dibin pêşerojê.",
  },

  channels: {
    instagramHint: "Wêneyên atolyeyê, parvekirinên projeyan û ragihandin",
    whatsappHint: "Ji bo tomarkirin, bernameya dersê û bihayê tavilê binivîsin",
    mapsHint: "Rêya baregeha me ya li Taxa Belde bistînin",
  },
};
