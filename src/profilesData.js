// Seed profiles for WeddingBells - AI-First Matrimonial Marketplace

export const seedProfiles = [
  {
    id: 1,
    name: "Priya Nair",
    gender: "Female",
    age: 28,
    date_of_birth: "1998-04-12",
    height: "5'5\"",
    location: "Bangalore, Karnataka",
    mother_tongue: "Malayalam",
    religion: "Hindu",
    community: "Nair",
    marital_status: "Never married",
    children_status: "No",
    education_level: "Master's Degree",
    profession: "Senior Software Engineer",
    company: "Google",
    income_range: "₹25–30 LPA",
    income_numeric: 28,
    work_location: "Bangalore, India",
    food_preference: "Vegetarian",
    smoking_status: "No",
    drinking_status: "Socially",
    hobbies: ["Classical Dance", "Reading", "Hiking"],
    about_me: "I work in IT and enjoy my career, but family is extremely important to me. I am flexible about where I live after marriage, but prefer South or West India. I believe in balancing traditional values with modern aspirations.",
    partner_expectations: "Looking for someone who is career-oriented but also values family time. A professional working in Bangalore or Hyderabad, preferably vegetarian, who believes in equal partnership and open communication.",
    lifestyle: "Moderately active, enjoys weekend getaways and quiet reading evenings. Values clean living and healthy nutrition.",
    family_expectations: "Hails from a close-knit nuclear family. Respect and affection for parents and elders is extremely important.",
    future_goals: "Wants to lead an engineering team and eventually start a family. Intends to continue working after marriage.",
    is_verified_identity: true,
    is_verified_photo: true,
    photos: [
      { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400", is_public: true },
      { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400", is_public: false } // Private photo
    ]
  },
  {
    id: 2,
    name: "Rahul Sharma",
    gender: "Male",
    age: 29,
    date_of_birth: "1997-08-22",
    height: "5'11\"",
    location: "Bangalore, Karnataka",
    mother_tongue: "Hindi",
    religion: "Hindu",
    community: "Brahmin",
    marital_status: "Never married",
    children_status: "No",
    education_level: "MBA",
    profession: "Product Manager",
    company: "Walmart Tech",
    income_range: "₹20–25 LPA",
    income_numeric: 22,
    work_location: "Bangalore, India",
    food_preference: "Vegetarian",
    smoking_status: "No",
    drinking_status: "No",
    hobbies: ["Yoga", "Cooking", "Photography"],
    about_me: "I am a career-oriented Product Manager in Bangalore, but I deeply value family time and traditional connections. I love staying active and exploring culinary arts.",
    partner_expectations: "Seeking a family-oriented, vegetarian professional who lives or is willing to live in Bangalore. Mutual respect and common value systems are vital.",
    lifestyle: "Vegetarian, non-smoker, loves morning yoga and home cooking.",
    family_expectations: "Traditional but progressive parents who are well-settled. Values family togetherness.",
    future_goals: "Hopes to build a stable home environment while advancing in technology product leadership.",
    is_verified_identity: true,
    is_verified_photo: true,
    photos: [
      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400", is_public: true },
      { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400", is_public: false }
    ]
  },
  {
    id: 3,
    name: "Aisha Khan",
    gender: "Female",
    age: 27,
    date_of_birth: "1999-01-15",
    height: "5'4\"",
    location: "Hyderabad, Telangana",
    mother_tongue: "Urdu",
    religion: "Muslim",
    community: "Sunni",
    marital_status: "Never married",
    children_status: "No",
    education_level: "MD (Medicine)",
    profession: "Cardiologist",
    company: "Apollo Hospital",
    income_range: "₹35–40 LPA",
    income_numeric: 38,
    work_location: "Hyderabad, India",
    food_preference: "Non-Vegetarian",
    smoking_status: "No",
    drinking_status: "No",
    hobbies: ["Violin", "Gardening", "Volunteering"],
    about_me: "Professionally established doctor in Hyderabad. Deeply family-oriented, spiritual, and passionate about humanitarian work. I value compassionate communication.",
    partner_expectations: "An educated Muslim professional, preferably a doctor or senior manager, who lives in Hyderabad or is open to relocating. Someone who values life partnership and emotional depth.",
    lifestyle: "Active and disciplined hospital routine, spiritual, values healthy communication and home hobbies.",
    family_expectations: "Respectful and cultured background. Expects mutual regard and visits to extended families.",
    future_goals: "Aims to open a community clinic to help the underserved while having a loving household.",
    is_verified_identity: true,
    is_verified_photo: false,
    photos: [
      { url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400", is_public: true }
    ]
  },
  {
    id: 4,
    name: "Vikram Sengupta",
    gender: "Male",
    age: 31,
    date_of_birth: "1995-11-03",
    height: "5'9\"",
    location: "Kolkata, West Bengal",
    mother_tongue: "Bengali",
    religion: "Hindu",
    community: "Kayastha",
    marital_status: "Never married",
    children_status: "No",
    education_level: "B.Tech + MS",
    profession: "Senior Data Scientist",
    company: "Intel",
    income_range: "₹18–22 LPA",
    income_numeric: 20,
    work_location: "Kolkata, India",
    food_preference: "Non-Vegetarian",
    smoking_status: "No",
    drinking_status: "Socially",
    hobbies: ["Acoustic Guitar", "Chess", "Writing Blogs"],
    about_me: "Data scientist with a blend of tech curiosity and artistic soul. I value simple living, long conversations, and deep traditional Bengali roots.",
    partner_expectations: "A career-oriented yet family-respecting girl, open to residing in Kolkata or migrating. Someone who is friendly and communicative.",
    lifestyle: "Loves classical literature, quiet weekends with filter coffee, and occasional trekking.",
    family_expectations: "Warm family of educators. Deep appreciation for literature, fine arts, and family gatherings.",
    future_goals: "To continue conducting research in machine learning and raise a warm, culturally conscious family.",
    is_verified_identity: false,
    is_verified_photo: true,
    photos: [
      { url: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?auto=format&fit=crop&q=80&w=400", is_public: true }
    ]
  },
  {
    id: 5,
    name: "Rohan Mehra",
    gender: "Male",
    age: 28,
    date_of_birth: "1998-05-19",
    height: "5'10\"",
    location: "Delhi, NCR",
    mother_tongue: "Punjabi",
    religion: "Sikh",
    community: "Khatri",
    marital_status: "Never married",
    children_status: "No",
    education_level: "Bachelor of Design",
    profession: "UI/UX Consultant",
    company: "Self-Employed",
    income_range: "₹15–20 LPA",
    income_numeric: 18,
    work_location: "Delhi, India",
    food_preference: "Vegetarian",
    smoking_status: "No",
    drinking_status: "No",
    hobbies: ["Travelling", "Interior Design", "Cycling"],
    about_me: "Creative, independent designer based in Delhi. I am vegetarian, a complete non-smoker, and highly family-oriented. I believe in enjoying life's little moments.",
    partner_expectations: "An optimistic, friendly professional with a strong sense of humor. Someone who enjoys traveling and is located in or open to relocating to Delhi.",
    lifestyle: "Travel lover, fitness enthusiast, non-smoker, vegetarian food lover.",
    family_expectations: "Supportive, entrepreneurial family who values mutual independence but stays closely connected.",
    future_goals: "Expand my design consultancy internationally and find a partner to travel the world with.",
    is_verified_identity: true,
    is_verified_photo: true,
    photos: [
      { url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400", is_public: true }
    ]
  },
  {
    id: 6,
    name: "Neha Deshmukh",
    gender: "Female",
    age: 30,
    date_of_birth: "1996-09-08",
    height: "5'3\"",
    location: "Mumbai, Maharashtra",
    mother_tongue: "Marathi",
    religion: "Hindu",
    community: "Maratha",
    marital_status: "Never married",
    children_status: "No",
    education_level: "Master of Science",
    profession: "Financial Analyst",
    company: "HDFC Bank",
    income_range: "₹15–18 LPA",
    income_numeric: 16,
    work_location: "Mumbai, India",
    food_preference: "Vegetarian",
    smoking_status: "No",
    drinking_status: "No",
    hobbies: ["Baking", "Marathon Running", "Sketching"],
    about_me: "I am a structured financial analyst living in Mumbai. I lead an active, healthy lifestyle and am very close to my parents. I value mutual understanding, transparency, and a stable routine.",
    partner_expectations: "Looking for an established professional in Mumbai or Pune, non-smoker, vegetarian, and well-educated. Must have a high regard for family bonds.",
    lifestyle: "Early riser, marathon runner, loves quiet home baking and sketching sessions.",
    family_expectations: "Traditional family values, respectful interaction, and celebrating festivals together.",
    future_goals: "Achieve senior financial management roles while establishing a warm and loving family life.",
    is_verified_identity: false,
    is_verified_photo: false,
    photos: [
      { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400", is_public: true }
    ]
  }
];

// Helper to calculate Match Compatibility Score based on the specified weights
// Age: 15%, Education: 10%, Career: 10%, Location: 10%, Lifestyle: 15%, Family: 10%, Religion/Community: 10%, Interests: 10%, Future Goals: 10%
export function calculateHybridScore(userProfile, targetProfile) {
  let score = 0;
  const reasons = [];

  // 1. Age (15%) - ideal difference of <= 3 years
  const ageDiff = Math.abs(userProfile.age - targetProfile.age);
  if (ageDiff <= 2) {
    score += 15;
    reasons.push("Excellent age alignment");
  } else if (ageDiff <= 4) {
    score += 10;
    reasons.push("Comfortable age difference");
  } else {
    score += 5;
  }

  // 2. Education (10%)
  if (userProfile.education_level === targetProfile.education_level) {
    score += 10;
    reasons.push("Matching education level");
  } else if (userProfile.education_level.includes("Master's") || userProfile.education_level.includes("MBA") || userProfile.education_level.includes("MD")) {
    if (targetProfile.education_level.includes("Master's") || targetProfile.education_level.includes("MBA") || targetProfile.education_level.includes("MD") || targetProfile.education_level.includes("B.Tech")) {
      score += 8;
      reasons.push("Highly educated matching profile");
    } else {
      score += 5;
    }
  } else {
    score += 5;
  }

  // 3. Career (10%)
  const highTechProfessions = ["Senior Software Engineer", "Product Manager", "Senior Data Scientist", "UI/UX Consultant"];
  if (userProfile.profession === targetProfile.profession) {
    score += 10;
    reasons.push("Same professional track");
  } else if (highTechProfessions.includes(userProfile.profession) && highTechProfessions.includes(targetProfile.profession)) {
    score += 9;
    reasons.push("Tech/Management career alignment");
  } else {
    score += 6;
    reasons.push("Professionally established");
  }

  // 4. Location (10%)
  const userCity = userProfile.location.split(",")[0].trim();
  const targetCity = targetProfile.location.split(",")[0].trim();
  if (userCity === targetCity) {
    score += 10;
    reasons.push(`Both based in ${userCity}`);
  } else if (userProfile.about_me?.toLowerCase().includes("relocat") || targetProfile.about_me?.toLowerCase().includes("relocat")) {
    score += 8;
    reasons.push("Flexible about relocation after marriage");
  } else {
    score += 4;
  }

  // 5. Lifestyle (15%) - food habits, smoking, drinking
  let lifestyleMatch = true;
  if (userProfile.food_preference && targetProfile.food_preference) {
    if (userProfile.food_preference === targetProfile.food_preference) {
      score += 5;
    } else {
      lifestyleMatch = false;
    }
  }
  if (userProfile.smoking_status === "No" && targetProfile.smoking_status === "No") {
    score += 5;
  } else {
    lifestyleMatch = false;
  }
  if (userProfile.drinking_status === "No" && targetProfile.drinking_status === "No") {
    score += 5;
  } else {
    score += 3;
  }
  if (lifestyleMatch) {
    reasons.push("Identical lifestyle preferences");
  } else {
    reasons.push("Complimentary lifestyle habits");
  }

  // 6. Family expectations (10%)
  if (userProfile.family_expectations && targetProfile.family_expectations) {
    score += 10;
    reasons.push("Similar family values and expectations");
  } else {
    score += 7;
  }

  // 7. Religion/community (10%)
  if (userProfile.religion === targetProfile.religion) {
    score += 7;
    if (userProfile.community === targetProfile.community) {
      score += 3;
      reasons.push(`Same cultural background (${userProfile.religion} - ${userProfile.community})`);
    } else {
      reasons.push(`Same religion (${userProfile.religion})`);
    }
  } else {
    score += 3;
  }

  // 8. Interests / Hobbies (10%)
  const sharedHobbies = userProfile.hobbies?.filter(hobby => targetProfile.hobbies?.includes(hobby)) || [];
  if (sharedHobbies.length > 0) {
    score += 10;
    reasons.push(`Shared hobbies: ${sharedHobbies.join(", ")}`);
  } else {
    score += 6;
    reasons.push("Unique personal interests to share");
  }

  // 9. Future goals (10%)
  if (userProfile.future_goals && targetProfile.future_goals) {
    score += 10;
    reasons.push("Cohesive future aspirations and goals");
  } else {
    score += 7;
  }

  return {
    score: Math.min(100, Math.max(50, score)),
    reasons
  };
}

// Convert natural language queries to structured filter JSON simulating our safe parser
export function parseNaturalLanguageQuery(queryText) {
  const query = queryText.toLowerCase();
  const filters = {};

  // Age extraction
  const ageMatchRange = query.match(/(\d{2})[\s-–to]+(\d{2})/);
  if (ageMatchRange) {
    filters.age = { min: parseInt(ageMatchRange[1]), max: parseInt(ageMatchRange[2]) };
  } else {
    const ageMatchMin = query.match(/(?:above|greater than|over)\s*(\d{2})/i);
    const ageMatchMax = query.match(/(?:below|less than|under)\s*(\d{2})/i);
    filters.age = {
      min: ageMatchMin ? parseInt(ageMatchMin[1]) : 20,
      max: ageMatchMax ? parseInt(ageMatchMax[1]) : 45
    };
  }

  // Location extraction
  const locations = [];
  if (query.includes("bangalore") || query.includes("bengaluru")) locations.push("Bangalore");
  if (query.includes("hyderabad")) locations.push("Hyderabad");
  if (query.includes("mumbai") || query.includes("bombay")) locations.push("Mumbai");
  if (query.includes("delhi") || query.includes("ncr")) locations.push("Delhi");
  if (query.includes("kolkata") || query.includes("calcutta")) locations.push("Kolkata");
  if (locations.length > 0) {
    filters.locations = locations;
  }

  // Vegetarian preference
  if (query.includes("veg") || query.includes("vegetarian")) {
    filters.vegetarian = true;
  }

  // Career extraction
  if (query.includes("software") || query.includes("tech") || query.includes("it") || query.includes("engineer") || query.includes("manager") || query.includes("scientist") || query.includes("doctor")) {
    filters.professionally_established = true;
  }

  // Family-oriented
  if (query.includes("family") || query.includes("traditional")) {
    filters.family_oriented = true;
  }

  return filters;
}
