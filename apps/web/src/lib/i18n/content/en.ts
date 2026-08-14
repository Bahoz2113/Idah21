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
    index: "10 — Invitation",
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
      lead: "In the Batman workshop students run 3D printers, assemble drone airframes, solder circuits and carry out real flight tests in the field. The frames below are taken from that work; disciplines not yet documented are marked 'Concept'.",
    },
    basin: {
      eyebrow: "In the Press",
      titleLead: "When Others Tell Our Story",
      titleAccent: "",
      titleTail: "",
      lead: "We describe our work not with inflated promises but through our students' effort, the real projects that emerge and the work we do in the field.",
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

  about: {
    eyebrow: "Who We Are",
    titleLead: "A Technology Base Born in Batman,",
    titleAccent: "Building the Future",
    titleTail: "",
    lead: "We are CEZERİ ROBOTECH. Born in Batman, we are a technology base for artificial intelligence, robotics, software and aviation — one that turns curiosity into knowledge, knowledge into design, and design into something that actually works.",

    photoAlt:
      "The CEZERİ ROBOTECH instructor team in Batman, standing in front of the centre's robotic owl emblem",
    photoCaption: "Our instructor team at the Batman workshop",

    identity: [
      "When we set out, we asked ourselves a simple but powerful question: will our children only be users of technology, or will they be the people who understand it, develop it and give the future its direction? CEZERİ ROBOTECH is our answer to that question.",
      "Our centre in Batman brings robotics and coding, software, artificial intelligence, electronics, 3D design and manufacturing, drones, UAVs and aviation together inside a single culture of making. For us technology is not a distant world watched on a screen. It is a real workshop floor — touched, taken apart, rebuilt, coded, tested, and finally made to work.",
      "We want to carry al-Jazari's curiosity, his engineering mind and his centuries-old will to build forward into the future with today's children. We draw on the great scientific and engineering heritage of the past while turning our faces towards artificial intelligence, autonomous systems, robots and the aerial technologies of tomorrow.",
    ],

    quotes: [
      "We are not waiting for the future to be built somewhere else. We are building it here in Batman, together with our students.",
      "For us a mistake is not a failure; it is where thinking, researching and real learning begin.",
      "Let our children not merely watch the future; let them design it, code it and build it.",
      "The future is shaped in the hands of those who build it.",
    ],

    blocks: [
      {
        title: "A Generation That Builds Technology, Not Just Consumes It",
        body: [
          "There is a single goal at the centre of how we teach: to move children out of being passive consumers of technology and turn them into makers who can bring their own ideas to life.",
          "We offer hands-on technology courses suited to age and stage of development, primarily to children and teenagers aged 6–16. We also run periodic beginner-level applied robotics and coding programmes for participants aged 18 and over.",
          "In our workshops students do not memorise a piece of code or repeat a ready-made model. They learn how to define a problem, how to design a solution, how the parts fit together, and how to think again when the first attempt does not work.",
          "They build an electronic circuit, read data from sensors, develop an algorithm, design a robot, write software, create a 3D model, produce a prototype, get to know drones and flight systems, and develop a model rocket. They learn to explain an idea, present a project, work with teammates and value the process as much as the result.",
          "That is why we aim to give our students more than technical skills: problem solving, analytical thinking, patience, focus, responsibility, teamwork, design awareness and the courage to build.",
          "We know that every child learns differently, is curious about different things and moves at a different pace. So we treat teaching not as a one-way lecture but as a living process in which the student explores, asks, experiments and produces something of their own.",
        ],
      },
      {
        title: "Not Lessons — Workshops, Experience and Real Projects",
        body: [
          "Learning at CEZERİ ROBOTECH begins with theory and deepens through practice. Robotics and coding, basic and advanced software logic, artificial intelligence applications, electronics, 3D design and printing, UAV and drone technologies, aviation and model rocketry are not disconnected headings. Each one is part of the student's journey from an idea to a working system.",
          "Sometimes our students discover sensor logic through a simple alarm system, sometimes they code a robot's movements, sometimes they design a 3D model and turn it into a physical object. And sometimes they watch an aircraft or a rocket they have worked on for months finally meet the sky.",
          "This approach does not just answer the question «how is it done?». It encourages them to ask «how could it be done better?», «what other method could solve this problem?» and «what could I build?».",
          "Through our summer and spring workshops, project work and competition preparation, we help our students build a long-term relationship with technology. We see TEKNOFEST and similar technology competitions not merely as events where places are won, but as arenas for learning research, project discipline, teamwork and the courage to present an idea.",
        ],
      },
      {
        title: "Where a Dream Becomes a Working System",
        body: [
          "We are not content to tell children about the future; we give them a place where they can build a piece of it with their own hands.",
          "One of the clearest examples of this was the Yediiki Robot and Technology Competition held in Batman on 29–30 April 2026. At that event, where robotics and artificial intelligence projects were exhibited, CEZERİ ROBOTECH carried out Batman's first VTOL UAV flight and its first model rocket launch demonstration.",
          "For us that flight and that launch were not merely a technical display. They were proof that a dream formed in Batman can become real through engineering knowledge and a determined process of making. The feeling of «I can do this too» taking shape in a child's eyes is one of the most valuable outcomes there is.",
          "The robots, electronic circuits, artificial intelligence applications, 3D models, drone systems and model rockets of every size built in our workshops are all products of the same idea: the strongest way to learn is to build.",
        ],
      },
      {
        title: "A Centre Opening from Batman to the Future",
        body: [
          "CEZERİ ROBOTECH is not simply a course that delivers lessons. We are building an ecosystem of making and growth where children, young people, engineers, educators, institutions and local businesses can meet around technology.",
          "We believe Batman's technological capacity will grow not through the number of its users but through people who write code, develop robots, produce projects, use artificial intelligence well and design solutions to real problems. That is why we open our doors not only to today's lessons but to tomorrow's professions and to new fields of expertise that do not yet have names.",
          "We do this work with a local sense of responsibility and a universal outlook. We want the children and young people of Batman to meet high-quality technology education, discover their own potential and take their place with confidence in national and international arenas of production.",
          "For us Batman is not merely the city we happen to be in. It is the centre of the transformation we started, our source of inspiration, and the address of the promise we have made to the future.",
        ],
      },
      {
        title: "From Education to Digital Transformation",
        body: [
          "We do not limit our view of technology to teaching children and young people. CEZERİ ROBOTECH also provides businesses and institutions with software development, AI-supported solutions, consultancy and digital transformation services.",
          "Our collaboration with the Batman Chamber of Tradesmen and Craftsmen is one concrete example of our intent to help local businesses adapt to the digital world, raise their productivity and use technology more effectively. Our collaboration with the Batman branch of the Petrol-İş union, in education and software, likewise reflects our approach of making technology more reachable for different parts of society.",
          "Because we know that technological transformation does not happen through devices or software alone. Real transformation begins when a person reaches knowledge, gains new skills and can turn technology into a solution that fits their own need.",
          "So while we train the engineers of the future on one side, on the other we give today's businesses solutions they can use to prepare for it.",
        ],
      },
    ],

    valuesTitle: "The Values That Make Us Who We Are",
    values: [
      {
        title: "Curiosity",
        body: "Curiosity is where CEZERİ ROBOTECH starts. Because every great discovery begins with the courage to ask the right question.",
      },
      {
        title: "Making",
        body: "Making is at the centre of how we teach. We believe knowledge only becomes real value when it is tried, applied and shared.",
      },
      {
        title: "People First",
        body: "People come before technology. We see artificial intelligence, robots and software not as ends in themselves but as tools that strengthen a person's power to think, build and solve.",
      },
      {
        title: "Honesty",
        body: "Plain speaking and sincerity are the basis of how we communicate. We describe our work not with inflated promises but through our students' effort, the real projects that emerge and the work we do in the field.",
      },
      {
        title: "Trust",
        body: "Trust is indispensable to the relationship we build with children and families. We create an environment that respects a student's curiosity, cares about their development and supports every step with real learning.",
      },
      {
        title: "Local to Universal",
        body: "We look from the local to the universal. We believe an idea produced in Batman can reach the world, and that with the right education, steady work and a strong dream no geography stays outside technology.",
      },
    ],

    missionTitle: "Our Mission",
    mission:
      "To raise children and young people not as mere consumers of technology but as individuals who think, design, code and build; to offer high-quality, hands-on, project-based learning in robotics, software, artificial intelligence, electronics, 3D manufacturing and aviation; and to contribute to the digital transformation of institutions and businesses with solutions born of real needs.",
    visionTitle: "Our Vision",
    vision:
      "Starting from Batman, to become one of Türkiye's leading centres for education and production in artificial intelligence, robotics and aviation; and to lead the way in raising a new generation of engineers, entrepreneurs and inventors who develop their own technology, produce work on a global scale and add value to humanity.",

    heritageTitle: "The Story Behind Our Name",
    heritageLead:
      "The centre takes its name from Ismail al-Jazari, who left the first systematic record of programmable automata. Today the same discipline runs on microcontrollers, sensors and algorithms.",

    promiseTitle: "Our Promise to the Future",
    promise: [
      "We believe there is an idea inside every child, waiting to be discovered.",
      "We are here to grow that idea with curiosity, strengthen it with knowledge, bring it together with the right tools, and walk beside the student until it becomes something real.",
      "In a robot's first movement, in the first time a piece of code runs correctly, in the light of a circuit, in a 3D design becoming a physical object, and in the moment a rocket rises into the sky, we see the same excitement.",
      "That is why we do not only teach today's technology. We are building the character of a generation that asks questions, develops solutions, works together, is not afraid to fail and tries again.",
    ],
    signOff: "We are CEZERİ ROBOTECH. We carry a dream born in Batman into the future — with knowledge, with effort and with technology.",
  },

  channels: {
    instagramHint: "Workshop frames, project posts and announcements",
    whatsappHint: "Message us now for enrolment, timetables and pricing",
    mapsHint: "Get directions to our base in Belde district",
  },
};
