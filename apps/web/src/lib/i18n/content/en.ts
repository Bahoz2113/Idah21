import type { Content } from "./tr";

/**
 * İÇERİK SÖZLÜĞÜ — İNGİLİZCE.
 *
 * Yapı `Content` tipiyle Türkçeye bağlı; eksik alan derlemede yakalanır.
 *
 * ÇEVİRİ DEĞİL, KARŞILIK. Adresler, telefon ve kurum adı çevrilmez —
 * bunlar özel isimdir ve İngilizce okuyan bir veli de aynı sokağa gider,
 * aynı numarayı arar. Yalnızca anlatı ve açıklama İngilizceleştirildi.
 *
 * "Hangar" kelimesi kasıtlı korundu: kurumun kendi terimi, havacılık
 * çağrışımı İngilizcede de aynı biçimde çalışıyor.
 */
export const en: Content = {
  org: {
    slogan: "IMAGINE. CODE. DESIGN THE FUTURE.",
    tagline: "Batman's Technology Base: Where Engineers Aged 6–16 Are Made.",
    description:
      "CEZERİ ROBOTECH is a technology education centre in Batman, Türkiye, teaching " +
      "children and teenagers aged 6–16 robotics and coding, artificial intelligence, " +
      "UAV/VTOL systems, rocketry and 3D design. In hands-on workshops students " +
      "assemble their own drones, write their own code and experience engineering " +
      "discipline first-hand through real field flight tests.",
    legalName: "Cezeri Robotech Technology and Education Centre",
    ageRangeLabel: "ages 6–16",
    foundingLocation: "Batman, Türkiye",
  },

  intro: {
    index: "01 — Our Approach",
    titleLead: "Generations Who Don't Consume the Future,",
    titleAccent: "They Design",
    titleTail: "It",
    body: "Here students don't just learn to write code or make a robot move; they learn to think, to design, to experiment, to fail and to build again.",
  },

  cta: {
    index: "09 — Invitation",
    titleLead: "Let's Design the Future",
    titleAccent: "Together",
    titleTail: "",
    lead: "Start your child's technology journey at the right age, with the right guidance and with real projects.",
  },

  metrics: [
    { label: "Training Hangars", hint: "Ten core disciplines, from UAVs to AI" },
    { label: "Age Range", hint: "A path tiered by age" },
    { label: "Hands-On Workshop", hint: "A working result at the end of every lesson" },
    { label: "Batman Base", hint: "Technology centre in Belde district" },
  ],

  legacy: [
    {
      era: "1206",
      title: "Al-Jazari's Book",
      body: "Ismail al-Jazari completes his treatise on extraordinary mechanical devices, leaving the first systematic record of programmable automata.",
    },
    {
      era: "Cybernetics",
      title: "The Programmable Automaton",
      body: "Water-powered machines whose sequence of tasks could be changed with camshafts and cranks — the ancestor of modern control engineering.",
    },
    {
      era: "Today",
      title: "Code and Sensor",
      body: "The same discipline now runs on microcontrollers, sensors and algorithms. Same soil, same curiosity.",
    },
    {
      era: "Tomorrow",
      title: "Autonomous Systems",
      body: "Students trained in the Batman workshop are designing autonomous aircraft and artificial intelligence systems.",
    },
  ],

  chapters: {
    egitimler: {
      eyebrow: "Our Programmes",
      titleLead: "Ten Programmes, One Discipline:",
      titleAccent: "Build Something That Works.",
      titleTail: "",
      lead: "Education at CEZERİ ROBOTECH is divided into ten core disciplines: UAV/VTOL systems, rocketry, artificial intelligence and machine learning, robotics and coding, 3D design and additive manufacturing, software and algorithms, electronics and mechatronics, cyber-security awareness, space and aviation sciences, technology entrepreneurship. Every programme closes with a working result the student built with their own hands.",
    },
    mufredat: {
      eyebrow: "Our Curriculum",
      titleLead: "What We Teach,",
      titleAccent: "Week by Week",
      titleTail: "",
      lead: "Four separate programmes run at CEZERİ ROBOTECH: block-based coding (from ScratchJr to mBlock), the basic electricity and energy workshop, the electronics experiment and soldering workshop, and robotics and coding with Arduino. Below you'll find each programme's weekly lesson plan, the tools used and the module structure — you can read what we teach week by week.",
    },
    atolye: {
      eyebrow: "Workshop and Field",
      titleLead: "Not a Simulation. A Real Workshop.",
      titleAccent: "",
      titleTail: "",
      lead: "In the Batman workshop students run 3D printers, assemble drone airframes, solder circuits and carry out real flight tests in the field. The frames below are taken from that work; disciplines not yet documented are marked 'Concept'. Students' faces are blurred out of respect for their privacy.",
    },
    miras: {
      eyebrow: "The Jazari Legacy",
      titleLead: "Eight Hundred Years Ago There Were",
      titleAccent: "Automata",
      titleTail: "Here.",
      lead: "The centre takes its name from Ismail al-Jazari, who left the first systematic record of programmable automata. Today the same discipline runs on microcontrollers, sensors and algorithms.",
    },
    basin: {
      eyebrow: "In the Press",
      titleLead: "When Others Tell Our Story",
      titleAccent: "",
      titleTail: "",
      lead: "News reports, interviews and event coverage in the local and national press. Not the account we give of ourselves, but the record a third party confirmed.",
    },
    sss: {
      eyebrow: "Frequently Asked Questions",
      titleLead: "What Parents Ask",
      titleAccent: "",
      titleTail: "",
      lead: "The questions parents and students ask most often, with clear answers.",
    },
    iletisim: {
      eyebrow: "Base Operations",
      titleLead: "Contact the Base",
      titleAccent: "",
      titleTail: "",
      lead: "Message us on WhatsApp, follow us on Instagram, or simply come to the workshop.",
    },
  },

  disciplines: {
    "iha-vtol": {
      title: "UAV / VTOL Systems",
      summary: "Design, assembly and flight control of vertical take-off unmanned aircraft.",
      detail:
        "In the drone and UAV programme students assemble multirotor and VTOL platforms from scratch, calibrate the flight controller and plan autonomous missions. The course closes with a real flight test in the field.",
      outcomes: [
        "Airframe and propulsion assembly",
        "Flight controller calibration",
        "Autonomous mission planning",
        "Field flight test",
      ],
    },
    roketcilik: {
      title: "Rocketry and Propulsion",
      summary: "Model rocket aerodynamics, thrust calculation and safe launch protocol.",
      detail:
        "Students calculate airframe aerodynamics, fin geometry and thrust-to-weight ratio; they design the recovery system and carry out a launch under a controlled protocol.",
      outcomes: [
        "Aerodynamic design",
        "Thrust-to-weight calculation",
        "Parachute recovery system",
        "Controlled launch",
      ],
    },
    "yapay-zeka": {
      title: "Artificial Intelligence and Machine Learning",
      summary: "Understanding AI through image processing, datasets and model training.",
      detail:
        "In the artificial intelligence module students collect their own datasets, train an image classification model and learn to interpret why the model got it wrong. The aim is to make AI legible as engineering, not magic.",
      outcomes: [
        "Building a dataset",
        "Model training and testing",
        "Image processing application",
        "Ethics and bias literacy",
      ],
    },
    robotik: {
      title: "Robotics and Autonomous Systems",
      summary: "The sensor-motor loop, line following and autonomous decision making.",
      detail:
        "At the core of the robotics and coding course students build sensor reading, motor drive and feedback loops; they develop autonomous robots that detect obstacles and correct their course.",
      outcomes: [
        "Sensor-actuator integration",
        "Intuition for PID control",
        "Autonomous navigation",
        "Robot competition preparation",
      ],
    },
    "3d-tasarim": {
      title: "3D Design and Additive Manufacturing",
      summary: "Parametric modelling, slicing and producing real parts on a 3D printer.",
      detail:
        "In the 3D design course students model their own parts in parametric CAD, optimise slicing settings, print them on a 3D printer and measure the tolerances.",
      outcomes: [
        "Parametric CAD modelling",
        "Slicing optimisation",
        "3D print production",
        "Dimension and tolerance checking",
      ],
    },
    kodlama: {
      title: "Software and Algorithms",
      summary: "A graded path from block-based to text-based programming.",
      detail:
        "The path starts at age six with block-based visual programming and evolves into Python and embedded C as students grow. At every level the student delivers a working product.",
      outcomes: [
        "Algorithmic thinking",
        "Block-based programming",
        "Python fundamentals",
        "Embedded systems coding",
      ],
    },
    elektronik: {
      title: "Electronics and Mechatronics",
      summary: "Reading circuits, soldering and joining mechanics to electronics.",
      detail:
        "Students read circuit diagrams, build prototypes on a breadboard, solder safely and combine electronics with mechanical drive components.",
      outcomes: [
        "Reading circuit diagrams",
        "Safe soldering",
        "Working with microcontrollers",
        "Mechatronic integration",
      ],
    },
    "siber-guvenlik": {
      title: "Cyber-Security Awareness",
      summary: "Digital hygiene, the logic of encryption and a defence-first security culture.",
      detail:
        "Through defence-oriented material students develop password hygiene, an understanding of encryption, the ability to recognise social engineering tactics and safe behaviour on networks.",
      outcomes: [
        "Digital hygiene",
        "The logic of encryption",
        "Recognising social engineering",
        "Safe network behaviour",
      ],
    },
    "uzay-havacilik": {
      title: "Space and Aviation Sciences",
      summary: "The fundamentals of orbital mechanics, satellite systems and mission design.",
      detail:
        "Orbital logic, satellite subsystems and the discipline of mission planning are covered hands-on through a CanSat-style miniature mission design.",
      outcomes: [
        "Intuition for orbital mechanics",
        "Satellite subsystems",
        "Payload design",
        "Reading telemetry",
      ],
    },
    girisimcilik: {
      title: "Technology Entrepreneurship",
      summary: "From idea to prototype, from prototype to pitch: the discipline of shipping.",
      detail:
        "Students define a problem, prototype a solution, work out its cost and defend it before a jury. They prepare as teams for competitions such as Teknofest.",
      outcomes: ["Defining the problem", "Rapid prototyping", "Cost analysis", "Jury pitch"],
    },
  },

  faqs: [
    {
      q: "What is CEZERİ ROBOTECH?",
      a: "CEZERİ ROBOTECH is a technology education centre in Batman, Türkiye, teaching children and teenagers aged 6–16 robotics and coding, artificial intelligence, UAV/VTOL systems, rocketry and 3D design. All courses run entirely as hands-on workshops.",
    },
    {
      q: "Which age groups do you teach?",
      a: "Courses are for students aged 6 to 16. The programme is tiered by age: ages 6–8 begin with block-based visual programming and basic robotics, ages 9–12 go deeper with electronics and 3D design, and ages 13–16 move on to advanced modules such as UAV/VTOL, artificial intelligence and rocketry.",
    },
    {
      q: "I'm looking for a robotics and coding course in Batman — where do I start?",
      a: "You can start by joining CEZERİ ROBOTECH's free introductory workshop. Once the student's age and interests are clear, we recommend a suitable hangar path. To enrol, call 0540 662 72 72, write to the same number on WhatsApp, or message @cezerirobotech on Instagram.",
    },
    {
      q: "Is prior knowledge or computer experience required?",
      a: "No. The programmes are designed for complete beginners. A student who has never written code starts with block-based visual programming and moves gradually to text-based programming. All the hardware needed is provided in the workshop.",
    },
    {
      q: "Where are the courses held?",
      a: "All courses are taught in person at the CEZERİ ROBOTECH workshop at Belde Mahallesi, Fırat Caddesi, Barış Apartmanı No:16/B, Batman. The workshop has 3D printers, an electronics bench, a drone assembly station and a flight test area.",
    },
    {
      q: "Do students really fly in the drone and UAV course?",
      a: "Yes. Students put the UAV and VTOL platforms they assembled through real field flight tests under instructor supervision. Flights are carried out with a safety protocol and checklist, in suitable weather and site conditions.",
    },
    {
      q: "What is the timetable and how long do courses run?",
      a: "Lessons are scheduled weekly, outside school hours and at weekends. Each hangar module runs for a term, and at the end of the term the student delivers their own project. For current days and times, ask on WhatsApp at 0540 662 72 72.",
    },
    {
      q: "How do parents follow their child's progress?",
      a: "CEZERİ ROBOTECH runs its own education management system. Parents can see attendance, lesson assessments, project progress and instructor notes from their own panel.",
    },
    {
      q: "Do you prepare students for competitions like Teknofest?",
      a: "Yes. The Technology Entrepreneurship track and the advanced hangar modules prepare students as teams for national technology competitions such as Teknofest. The process covers every stage, from defining the problem to the prototype and the jury pitch.",
    },
    {
      q: "Can students from outside Batman attend?",
      a: "Yes. Although CEZERİ ROBOTECH is based in Batman, it accepts students from across South-Eastern Anatolia, particularly Siirt, Mardin and Diyarbakır. Intensive weekend programmes can be arranged for students travelling from outside the region.",
    },
  ],

  channels: {
    instagramHint: "Workshop frames, project posts and announcements",
    whatsappHint: "Message us now for enrolment, timetables and pricing",
    mapsHint: "Get directions to our base in Belde district",
  },
};
