const sampleProfiles = [
  {
    _id: "65a000000000000000000001",
    fullName: "Dr. Anum Chaudhry",
    email: "dr.anum@example.com",
    password: "Password123!",
    age: 24,
    gender: "Female",
    country: "Pakistan",
    city: "Lahore",
    profileImage: "/profiles/girl1_1.jpg",
    profileImages: [
      "/profiles/girl1_1.jpg",
      "/profiles/girl1_2.jpg",
      "/profiles/girl1_3.jpg"
    ],
    bio: "MBBS Doctor & Resident Physician at Mayo Hospital Lahore 🩺. Passionate about healthcare, aesthetic coffee lounges, Urdu poetry, and genuine intellectual conversations.",
    interests: ["Doctor / MBBS", "Aesthetic Cafes", "Urdu Poetry", "Literature", "Travel"],
    isSample: true
  },
  {
    _id: "65a000000000000000000002",
    fullName: "Syeda Fatima Zahra",
    email: "fatima.zahra@example.com",
    password: "Password123!",
    age: 23,
    gender: "Female",
    country: "Pakistan",
    city: "Islamabad",
    profileImage: "/profiles/girl2_1.jpeg",
    profileImages: [
      "/profiles/girl2_1.jpeg",
      "/profiles/girl2_2.jpeg",
      "/profiles/girl2_3.jpeg"
    ],
    bio: "Software Engineer & Mobile App Developer 💻. Love tech innovations, espresso coffee dates, sunset views at Margalla Hills, and long evening drives.",
    interests: ["Software Engineer", "Tech Startups", "Espresso", "Margalla Hikes", "Coding"],
    isSample: true
  },
  {
    _id: "65a000000000000000000003",
    fullName: "Hira Farooq",
    email: "hira.farooq@example.com",
    password: "Password123!",
    age: 25,
    gender: "Female",
    country: "Pakistan",
    city: "Karachi",
    profileImage: "/profiles/girl3_1.jpeg",
    profileImages: [
      "/profiles/girl3_1.jpeg",
      "/profiles/girl3_2.jpeg",
      "/profiles/girl3_3.jpeg"
    ],
    bio: "Corporate Banker & Financial Analyst at Habib Bank Karachi 📊. Passionate about wealth management, seaside dining, live music, and book clubs.",
    interests: ["Corporate Banking", "Fintech", "Seaside Dining", "Reading", "Live Music"],
    isSample: true
  },
  {
    _id: "65a000000000000000000004",
    fullName: "Ayla Noor",
    email: "ayla.noor@example.com",
    password: "Password123!",
    age: 22,
    gender: "Female",
    country: "Pakistan",
    city: "Lahore",
    profileImage: "/profiles/girl4_1.jpeg",
    profileImages: [
      "/profiles/girl4_1.jpeg",
      "/profiles/girl4_2.jpeg",
      "/profiles/girl4_3.jpeg"
    ],
    bio: "Architectural Designer & Fine Artist 🎨. Obsessed with minimalist interior design, cozy coffee spots in Gulberg, and art gallery exhibitions.",
    interests: ["Architect", "Interior Design", "Painting", "Art Galleries", "Coffee"],
    isSample: true
  },
  {
    _id: "65a000000000000000000005",
    fullName: "Zoya Hashmi",
    email: "zoya.hashmi@example.com",
    password: "Password123!",
    age: 24,
    gender: "Female",
    country: "Pakistan",
    city: "Rawalpindi",
    profileImage: "/profiles/girl5_1.jpeg",
    profileImages: [
      "/profiles/girl5_1.jpeg",
      "/profiles/girl5_2.jpeg",
      "/profiles/girl5_3.jpeg"
    ],
    bio: "Clinical Psychologist & Mental Health Counselor 🧠. Believer in emotional intelligence, deep listening, mindful living, and peaceful evening walks.",
    interests: ["Psychologist", "Mental Health", "Mindfulness", "Philosophy", "Tea"],
    isSample: true
  },
  {
    _id: "65a000000000000000000006",
    fullName: "Mahnoor Sheikh",
    email: "mahnoor.sheikh@example.com",
    password: "Password123!",
    age: 26,
    gender: "Female",
    country: "Pakistan",
    city: "Islamabad",
    profileImage: "/profiles/girl6_1.jpeg",
    profileImages: [
      "/profiles/girl6_1.jpeg",
      "/profiles/girl6_2.jpeg",
      "/profiles/girl6_3.jpeg"
    ],
    bio: "International Flight Attendant & Travel Vlogger ✈️. Explored 20+ countries! Love aviation, boutique cafes, fashion styling, and weekend road trips.",
    interests: ["Flight Attendant", "Aviation", "World Travel", "Fashion", "Vlogging"],
    isSample: true
  },
  {
    _id: "65a000000000000000000007",
    fullName: "Kainat Gillani",
    email: "kainat.gillani@example.com",
    password: "Password123!",
    age: 23,
    gender: "Female",
    country: "Pakistan",
    city: "Peshawar",
    profileImage: "/profiles/girl7_1.jpeg",
    profileImages: [
      "/profiles/girl7_1.jpeg",
      "/profiles/girl7_2.jpeg"
    ],
    bio: "Fashion Stylist & Digital Content Creator 📸. Passionate about traditional fusion wear, aesthetic photography, and discovering hidden food gems.",
    interests: ["Fashion Design", "Photography", "Content Creation", "Foodie", "Travel"],
    isSample: true
  },
  {
    _id: "65a000000000000000000008",
    fullName: "Noor-ul-Ain Khan",
    email: "noorulain.khan@example.com",
    password: "Password123!",
    age: 25,
    gender: "Female",
    country: "Pakistan",
    city: "Faisalabad",
    profileImage: "/profiles/girl8_1.jpeg",
    profileImages: [
      "/profiles/girl8_1.jpeg",
      "/profiles/girl8_2.jpeg"
    ],
    bio: "Lecturer in English Literature & Academic Researcher 📚. Love classical novels, intellectual debates, quiet coffee corners, and gardening.",
    interests: ["University Lecturer", "Literature", "Research", "Writing", "Coffee"],
    isSample: true
  },
  {
    _id: "65a000000000000000000009",
    fullName: "Dr. Alishba Qureshi",
    email: "alishba.q@example.com",
    password: "Password123!",
    age: 24,
    gender: "Female",
    country: "Pakistan",
    city: "Multan",
    profileImage: "/profiles/girl9_1.jpeg",
    profileImages: [
      "/profiles/girl9_1.jpeg",
      "/profiles/girl9_2.jpeg"
    ],
    bio: "Dental Surgeon (BDS) & Aesthetic Dentist 🦷. Spreading bright smiles, passionate about skincare, organic living, and fine dining.",
    interests: ["Dentist / BDS", "Healthcare", "Skincare", "Fine Dining", "Aesthetics"],
    isSample: true
  },
  {
    _id: "65a000000000000000000010",
    fullName: "Natalia Mirza",
    email: "natalia.mirza@example.com",
    password: "Password123!",
    age: 23,
    gender: "Female",
    country: "Pakistan",
    city: "Karachi",
    profileImage: "/profiles/girl10_1.jpeg",
    profileImages: [
      "/profiles/girl10_1.jpeg",
      "/profiles/girl10_2.jpeg"
    ],
    bio: "Brand Manager & Event Planner 🎉. Passionate about public relations, luxury event styling, beach sunsets, and rooftop dining.",
    interests: ["Brand Manager", "Event Planning", "Public Relations", "Beach Sunsets", "Fashion"],
    isSample: true
  },
  {
    _id: "65a000000000000000000011",
    fullName: "Laiba Chaudhry",
    email: "laiba.c@example.com",
    password: "Password123!",
    age: 22,
    gender: "Female",
    country: "Pakistan",
    city: "Lahore",
    profileImage: "/profiles/girl11_1.jpeg",
    profileImages: [
      "/profiles/girl11_1.jpeg",
      "/profiles/girl11_2.jpeg"
    ],
    bio: "Civil Engineer & Interior Decorator 🏗️. Designing modern spaces, passionate about architecture, outdoor sketching, and artisan tea lounges.",
    interests: ["Civil Engineer", "Architecture", "Interior Design", "Sketching", "Tea"],
    isSample: true
  }
];

module.exports = { sampleProfiles };
