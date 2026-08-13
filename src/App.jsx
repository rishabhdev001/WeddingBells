import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Users,
  Search,
  MessageCircle,
  AlertTriangle,
  User,
  Compass,
  Upload,
  Check,
  Settings,
  Send,
  CheckCircle,
  CheckSquare,
  HelpCircle,
  Lock,
  Info,
  Award,
  X,
  Zap,
  ShieldAlert,
  Clock,
  LogOut,
  Sparkles,
  Palette,
  Eye,
  EyeOff,
  UserCheck,
  Slash,
  LockKeyhole
} from 'lucide-react';
import { seedProfiles, calculateHybridScore, parseNaturalLanguageQuery } from './profilesData';

export default function App() {
  // --- AUTH & TAB STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' or 'register'
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loginPhone, setLoginPhone] = useState('+91 98765 43210');

  // Active Navigation Tab once logged in
  const [currentTab, setCurrentTab] = useState('matches'); // 'matches', 'profile', 'settings'

  // Theme State: 'dark', 'light', 'gold'
  const [themeMode, setThemeMode] = useState('dark');

  // Registration Form
  const [registerForm, setRegisterForm] = useState({
    name: "Rishabh Malhotra",
    gender: "Male",
    age: 28,
    date_of_birth: "1998-06-15",
    height: "5'10\"",
    location: "Bangalore, Karnataka",
    mother_tongue: "Hindi",
    religion: "Hindu",
    community: "Brahmin",
    marital_status: "Never married",
    education_level: "Master's Degree",
    profession: "Senior Product Designer",
    company: "Adobe",
    income_range: "₹20–25 LPA",
    food_preference: "Vegetarian",
    smoking_status: "No",
    drinking_status: "No",
    weed_status: "No",
    hobbies: "Photography, Cooking, Yoga",
    special_interests: "Behavioral Economics, Mechanical keyboards",
    interesting_facts: "I once baked perfect sourdough, Climbed three peaks in India",
    about_me: "I'm a software design professional who enjoys travelling, exploring new places and spending quality time with family. I value career progress as well as deep personal integrity.",
    partner_expectations: "Looking for a career-oriented, vegetarian professional based in Bangalore, with a family-first mindset and open communication.",
    account_type: "self", // self, parent, family
    profile_mode: "self", // self, parent, joint
    managed_by: "",
    is_verified_identity: false,
    is_verified_photo: false,
  });

  // Active Current Logged In User State
  const [primaryPhotoIndex, setPrimaryPhotoIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState({
    name: "Rishabh Malhotra",
    gender: "Male",
    age: 28,
    date_of_birth: "1998-06-15",
    height: "5'10\"",
    location: "Bangalore, Karnataka",
    mother_tongue: "Hindi",
    religion: "Hindu",
    community: "Brahmin",
    marital_status: "Never married",
    education_level: "Master's Degree",
    profession: "Senior Product Designer",
    company: "Adobe",
    income_range: "₹20–25 LPA",
    food_preference: "Vegetarian",
    smoking_status: "No",
    drinking_status: "No",
    weed_status: "No",
    hobbies: ["Photography", "Cooking", "Yoga"],
    special_interests: ["Behavioral Economics", "Mechanical keyboards"],
    interesting_facts: ["I once baked perfect sourdough", "Climbed three peaks in India"],
    account_type: "self", // self, parent, family
    profile_mode: "self", // self, parent, joint
    managed_by: "",
    is_verified_identity: false,
    is_verified_photo: false,
    photos: [
      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400", is_public: true },
    ]
  });

  // Onboarding modal step (1 to 6)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingForm, setOnboardingForm] = useState({ ...currentUser });

  // Profiles list including seeded ones
  const [profiles, setProfiles] = useState(seedProfiles);

  // Custom user preferences state
  const [preferences, setPreferences] = useState({
    must_age_min: 24,
    must_age_max: 32,
    must_genders: ["Female"],
    must_locations: ["Bangalore", "Hyderabad", "Mumbai"],
    must_marital_statuses: ["Never married"],
    must_food_preference: "Vegetarian",
    prefer_education_level: "Master's Degree",
    prefer_income_min: 15,
    dealbreaker_smoking: true,
    dealbreaker_drinking: false,
    custom_filters: [], // list of custom filter keywords/options
  });

  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [newCustomFilterInput, setNewCustomFilterInput] = useState("");
  const [prefForm, setPrefForm] = useState({
    must_age_min: 24,
    must_age_max: 32,
    must_genders: ["Female"],
    must_locations: ["Bangalore", "Hyderabad", "Mumbai"],
    must_marital_statuses: ["Never married"],
    must_food_preference: "Vegetarian",
    prefer_education_level: "Master's Degree",
    prefer_income_min: 15,
    dealbreaker_smoking: true,
    dealbreaker_drinking: false,
    custom_filters: [],
  });

  // Interaction States
  const [likes, setLikes] = useState({
    1: 'accepted', // Pre-seed a mutual match with Priya Nair (ID: 1)
  });
  const [activeChatId, setActiveChatId] = useState(1); // Default to Priya's chat
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Priya Nair', content: "Hello! Our preferences seem to align beautifully. I'm based in Bangalore too.", time: "10:30 AM", flagged: false },
    { id: 2, sender: 'You', content: "Hi Priya! Great to connect. Yes, I read your profile and love that we both value family time alongside our tech careers.", time: "10:32 AM", flagged: false }
  ]);
  const [currentMessageInput, setCurrentMessageInput] = useState("");
  const [spamAlert, setSpamAlert] = useState(null);

  // Private photo request state (target_profile_id: status)
  const [photoRequestStatus, setPhotoRequestStatus] = useState({
    2: 'approved', // Pre-approved for Rahul Sharma
  });

  // Natural Language Search state
  const [nlQuery, setNlQuery] = useState("");
  const [parsedSchema, setParsedSchema] = useState(null);
  const [isAiSearching, setIsAiSearching] = useState(false);

  // Joint management invite state
  const [parentInviteInput, setParentInviteInput] = useState("");
  const [parentInviteStatus, setParentInviteStatus] = useState("idle"); // idle, invited, accepted
  const [coManageToggle, setCoManageToggle] = useState(false);

  // Trust Verification wizard state
  const [verifyStep, setVerifyStep] = useState("idle"); // idle, choosing, doc_upload, selfie_upload, verifying, completed
  const [uploadedDocType, setUploadedDocType] = useState("Aadhaar");
  const [uploadedDocFile, setUploadedDocFile] = useState(null);
  const [uploadedSelfieFile, setUploadedSelfieFile] = useState(null);

  // User uploaded additional pictures
  const [selectedLocalPhoto, setSelectedLocalPhoto] = useState(null);
  const [isNewPhotoPublic, setIsNewPhotoPublic] = useState(true);

  // Helper for direct file upload reading
  const handleLocalFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedLocalPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Security and admin states
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [reports, setReports] = useState([
    { id: 101, reporter: "Neha Deshmukh", reported: "Spammer101", reason: "Asked for bank account transfer immediately after matching.", status: "pending", date: "Today" }
  ]);

  // Custom user block list
  const [blockedProfiles, setBlockedProfiles] = useState([
    { id: 4, name: "Vikram Sengupta", reason: "Spam behavior" } // pre-blocked for demo setting
  ]);

  const [bannedProfileIds, setBannedProfileIds] = useState([]);
  const [isPhotoVisibleMap, setIsPhotoVisibleMap] = useState({});

  // Active Selected Profile for detail view modal
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Execute the "Ask AI" parser & rank matches
  const handleAiSearch = (e) => {
    e.preventDefault();
    if (!nlQuery.trim()) {
      setParsedSchema(null);
      return;
    }
    setIsAiSearching(true);
    setTimeout(() => {
      const parsed = parseNaturalLanguageQuery(nlQuery);
      setParsedSchema(parsed);
      setIsAiSearching(false);
      showToast("AI parsed search terms and applied structured schema safely!");
    }, 800);
  };

  // Calculate matching & filter based on Layer 1 & Layer 2 & Layer 3
  const getRankedMatches = () => {
    return profiles.filter(profile => {
      if (bannedProfileIds.includes(profile.id)) return false;
      // Exclude blocked profiles
      if (blockedProfiles.some(bp => bp.id === profile.id)) return false;

      // Layer 1: Hard Filters (Eliminate profiles that fail Must Haves)
      // Gender preference based on must_genders
      if (preferences.must_genders && preferences.must_genders.length > 0) {
        if (!preferences.must_genders.includes(profile.gender)) return false;
      } else {
        if (currentUser.gender === "Male" && profile.gender !== "Female") return false;
        if (currentUser.gender === "Female" && profile.gender !== "Male") return false;
      }

      // Age range hard filter
      if (profile.age < preferences.must_age_min || profile.age > preferences.must_age_max) return false;

      // Locations hard filter
      if (preferences.must_locations && preferences.must_locations.length > 0) {
        const profileCity = profile.location.split(",")[0].trim().toLowerCase();
        const hasLocationMatch = preferences.must_locations.some(loc => profileCity.includes(loc.toLowerCase()));
        if (!hasLocationMatch) return false;
      }

      // Food preference hard filter
      if (preferences.must_food_preference) {
        if (profile.food_preference !== preferences.must_food_preference) return false;
      }

      // Dealbreakers
      if (preferences.dealbreaker_smoking && (profile.smoking_status === "Yes" || profile.smoking_status === "Occasionally")) {
        return false;
      }
      if (preferences.dealbreaker_drinking && (profile.drinking_status === "Yes" || profile.drinking_status === "Occasionally" || profile.drinking_status === "Socially")) {
        return false;
      }

      // Custom Match Preferences Filters Check
      if (preferences.custom_filters && preferences.custom_filters.length > 0) {
        const profileStr = `${profile.name} ${profile.profession} ${profile.company} ${profile.religion} ${profile.community} ${profile.about_me} ${profile.hobbies.join(" ")}`.toLowerCase();
        const matchesAnyCustom = preferences.custom_filters.some(filter =>
          profileStr.includes(filter.toLowerCase())
        );
        if (!matchesAnyCustom) return false;
      }

      if (parsedSchema) {
        if (parsedSchema.age) {
          if (profile.age < parsedSchema.age.min || profile.age > parsedSchema.age.max) return false;
        }
        if (parsedSchema.locations) {
          const profileCity = profile.location.split(",")[0].trim().toLowerCase();
          const hasLocationMatch = parsedSchema.locations.some(loc => profileCity.includes(loc.toLowerCase()));
          if (!hasLocationMatch) return false;
        }
        if (parsedSchema.vegetarian && profile.food_preference !== "Vegetarian") {
          return false;
        }
      }

      return true;
    }).map(profile => {
      // Calculate Hybrid score with dynamic preference weights
      const { score, reasons } = calculateHybridScore(currentUser, profile, preferences);
      return {
        ...profile,
        matchScore: score,
        explainableReasons: reasons
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  };

  const rankedMatches = getRankedMatches();

  // Handle express interest (Like)
  const handleLike = (profileId, name) => {
    const isAlreadyLiked = likes[profileId];
    if (isAlreadyLiked === 'accepted') {
      showToast(`You are already matched with ${name}! You can chat with them directly.`);
      return;
    }

    setLikes(prev => ({
      ...prev,
      [profileId]: 'accepted'
    }));

    setChatMessages(prev => [
      ...prev,
      { id: Date.now(), sender: name, content: `Hi! Thanks for expressing interest. I'd love to chat and get to know you better.`, time: "Just now", flagged: false }
    ]);
    setActiveChatId(profileId);
    showToast(`💖 Mutual interest accepted! You and ${name} have matched. Chat is now open!`);
  };

  // Handle private photo request
  const handlePhotoRequest = (profileId, name) => {
    setPhotoRequestStatus(prev => ({
      ...prev,
      [profileId]: 'pending'
    }));
    showToast(`Request sent to ${name} to view private photos. Pending consent.`);

    setTimeout(() => {
      setPhotoRequestStatus(prev => ({
        ...prev,
        [profileId]: 'approved'
      }));
      showToast(`🎉 ${name} has approved your private photo request!`);
    }, 3000);
  };

  // Safe message sending with simulated fraud word detection
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!currentMessageInput.trim()) return;

    const messageText = currentMessageInput;
    const isSpammy = /\b(bank account|money|pay me|send cash|wire transfer|card details|otp|password|financial)\b/i.test(messageText);

    const newMessage = {
      id: Date.now(),
      sender: 'You',
      content: messageText,
      time: "Just now",
      flagged: isSpammy
    };

    setChatMessages(prev => [...prev, newMessage]);
    setCurrentMessageInput("");

    if (isSpammy) {
      setSpamAlert("⚠️ FRAUD ALERT: Our AI detected sensitive financial terms ('money', 'bank', 'transfer'). We have flagged this message for moderator safety.");
      setReports(prev => [
        ...prev,
        {
          id: Date.now(),
          reporter: "System Safeguard",
          reported: currentUser.name,
          reason: `Suspicious financial keywords detected: "${messageText}"`,
          status: "pending",
          date: "Just now"
        }
      ]);
    } else {
      setSpamAlert(null);
      setTimeout(() => {
        const partner = profiles.find(p => p.id === activeChatId);
        const replyText = `That sounds great. I'd love to discuss that with my family as well. Let's schedule a call this weekend!`;
        setChatMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: partner ? partner.name : "Match", content: replyText, time: "Just now", flagged: false }
        ]);
      }, 1500);
    }
  };

  // Simulated Verification Process
  const triggerVerification = () => {
    setVerifyStep("choosing");
  };

  const handleDocUpload = (e) => {
    setUploadedDocFile(e.target.files[0] ? e.target.files[0].name : "sample_id.jpg");
    setVerifyStep("selfie_upload");
  };

  const handleSelfieUpload = (e) => {
    setUploadedSelfieFile(e.target.files[0] ? e.target.files[0].name : "selfie.jpg");
    setVerifyStep("verifying");

    setTimeout(() => {
      setCurrentUser(prev => ({
        ...prev,
        is_verified_identity: true,
        is_verified_photo: true
      }));
      setVerifyStep("completed");
      showToast("🟢 Verification Successful! Badges 'Identity Verified' and 'Photo Verified' applied to your profile.");
    }, 2500);
  };

  // Parent profile invite simulation
  const handleParentInvite = (e) => {
    e.preventDefault();
    if (!parentInviteInput.trim()) return;

    setParentInviteStatus("invited");
    showToast(`Invitation sent to your son/daughter (${parentInviteInput}) to join and co-manage this profile.`);

    setTimeout(() => {
      setParentInviteStatus("accepted");
      setCurrentUser(prev => ({
        ...prev,
        profile_mode: "joint",
        managed_by: `Father - Rajesh Malhotra & Candidate (${parentInviteInput})`
      }));
      setCoManageToggle(true);
      showToast("🎉 Candidate accepted the invite! The profile is now 'Jointly Managed'.");
    }, 4000);
  };

  // Add personal photo helper via direct upload
  const handleAddCustomPhoto = (e) => {
    e.preventDefault();
    if (!selectedLocalPhoto) {
      showToast("⚠️ Please select an image file to upload.");
      return;
    }

    const newPic = {
      url: selectedLocalPhoto,
      is_public: isNewPhotoPublic
    };

    setCurrentUser(prev => {
      const updatedPhotos = [...(prev.photos || []), newPic];
      if (isNewPhotoPublic) {
        setPrimaryPhotoIndex(updatedPhotos.length - 1);
      }
      return {
        ...prev,
        photos: updatedPhotos
      };
    });
    setSelectedLocalPhoto(null);
    showToast(`📸 Photo uploaded directly and added successfully as a ${isNewPhotoPublic ? 'Public' : 'Private'} picture.`);
  };

  // Delete photo helper
  const handleDeletePhoto = (indexToDelete) => {
    setCurrentUser(prev => {
      const updatedPhotos = (prev.photos || []).filter((_, idx) => idx !== indexToDelete);
      // Adjust primary photo index if needed
      if (primaryPhotoIndex >= updatedPhotos.length) {
        setPrimaryPhotoIndex(Math.max(0, updatedPhotos.length - 1));
      } else if (primaryPhotoIndex === indexToDelete) {
        setPrimaryPhotoIndex(0);
      } else if (primaryPhotoIndex > indexToDelete) {
        setPrimaryPhotoIndex(prevIdx => prevIdx - 1);
      }
      return {
        ...prev,
        photos: updatedPhotos
      };
    });
    showToast("🗑️ Photo deleted successfully.");
  };

  // Progressive profile creation form submission
  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    setCurrentUser({ ...onboardingForm });
    setIsOnboardingOpen(false);
    showToast("Profile successfully updated via progressive setup form!");
  };

  const handleNextOnboardingStep = () => {
    if (onboardingStep < 6) {
      setOnboardingStep(prev => prev + 1);
    }
  };

  const handlePrevOnboardingStep = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(prev => prev - 1);
    }
  };

  // Moderator actions
  const handleBanUser = (profileId, name) => {
    setBannedProfileIds(prev => [...prev, profileId]);
    showToast(`Moderator Action: Banned and suspended profile for ${name}.`);
    if (selectedProfile && selectedProfile.id === profileId) {
      setSelectedProfile(null);
    }
  };

  const handleResolveReport = (reportId) => {
    setReports(prev => prev.map(rep => rep.id === reportId ? { ...rep, status: "resolved" } : rep));
    showToast(`Report ID ${reportId} resolved successfully.`);
  };

  const handleUnblockProfile = (profileId, name) => {
    setBlockedProfiles(prev => prev.filter(bp => bp.id !== profileId));
    showToast(`🔓 Unblocked connection: ${name}`);
  };

  const handleBlockProfile = (profileId, name) => {
    setBlockedProfiles(prev => [...prev, { id: profileId, name, reason: "Blocked from matches" }]);
    showToast(`🔒 Blocked connection: ${name}`);
  };

  // AUTH SUBMISSION HANDLERS
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
      showToast("🔐 Matrimonial Security OTP sent to " + loginPhone);
    } else {
      setIsLoggedIn(true);
      setCurrentTab('matches');
      showToast("🟢 Welcome back to PureVows AI! Secure session initiated.");
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const parsedHobbies = registerForm.hobbies.split(",").map(item => item.trim());
    const parsedInterests = registerForm.special_interests.split(",").map(item => item.trim());
    const parsedFacts = registerForm.interesting_facts.split(",").map(item => item.trim());

    const freshUser = {
      ...registerForm,
      hobbies: parsedHobbies,
      special_interests: parsedInterests,
      interesting_facts: parsedFacts,
      profile_mode: registerForm.account_type,
      managed_by: registerForm.account_type === 'parent' ? 'Father - Rajesh Malhotra' : '',
      photos: [
        { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400", is_public: true }
      ]
    };

    setCurrentUser(freshUser);
    setOnboardingForm(freshUser);
    setIsLoggedIn(true);
    setCurrentTab('matches');
    showToast("🎉 Matrimonial Profile Created Successfully! Welcome to PureVows AI.");
  };

  // THEME COLOR MAPPING
  const getThemeClass = () => {
    if (themeMode === 'light') {
      return 'bg-gradient-to-tr from-slate-100 via-white to-pink-50 text-slate-900';
    }
    if (themeMode === 'gold') {
      return 'bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/40 text-slate-100';
    }
    return 'bg-gradient-to-tr from-slate-900 via-slate-950 to-pink-950/20 text-slate-100';
  };

  return (
    <div className={`min-h-screen ${getThemeClass()} flex flex-col font-sans selection:bg-pink-700 selection:text-white relative overflow-x-hidden transition-all duration-300`}>

      {/* Premium Elegant Structural Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_36px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] -z-10" />

      {/* Beautiful Premium Glow Backdrops */}
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[50%] rounded-full bg-gradient-to-tr from-pink-500/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] left-[25%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-amber-500/5 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-slate-900 border border-slate-800 text-white py-4 px-6 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <Zap className="text-pink-400 w-5 h-5" />
          <span className="font-bold text-sm tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* HEADER NAVBAR */}
      <header className={`sticky top-0 z-40 ${themeMode === 'light' ? 'bg-white/80 border-slate-200' : 'bg-slate-950/80 border-white/5'} backdrop-blur-xl border-b shadow-2xl px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-5`}>
        <div className="flex items-center gap-4">

          {/* Custom Beautiful Interlocking Rings SVG Logo (PureVows AI) */}
          <div className="flex items-center justify-center p-1 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
            <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="roseRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#db2777" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
                <linearGradient id="goldRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
              <circle cx="38" cy="50" r="22" stroke="url(#roseRingGrad)" strokeWidth="6" fill="none" />
              <circle cx="62" cy="50" r="22" stroke="url(#goldRingGrad)" strokeWidth="6" strokeDasharray="110 30" fill="none" />
              <circle cx="62" cy="50" r="22" stroke="url(#goldRingGrad)" strokeWidth="6" fill="none" className="opacity-20" />
              <path d="M50 34 L52.5 42.5 L61 45 L52.5 47.5 L50 56 L47.5 47.5 L39 45 L47.5 42.5 Z" fill="#fbbf24" className="animate-pulse" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">
                PureVows AI
              </span>
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
              Trusted AI Matrimonial Marketplace
            </span>
          </div>
        </div>

        {isLoggedIn ? (
          <>
            {/* Elegant Header Navigation Tabs (No accountcontext switchers here) */}
            <div className={`flex items-center gap-1.5 p-1 rounded-2xl border ${themeMode === 'light' ? 'bg-slate-200/60 border-slate-300' : 'bg-slate-900/90 border-white/10'} shadow-lg`}>
              <button
                onClick={() => setCurrentTab('matches')}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-extrabold transition-all ${
                  currentTab === 'matches'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-pink-400'
                }`}
              >
                🔍 Find Matches
              </button>
              <button
                onClick={() => setCurrentTab('profile')}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-extrabold transition-all ${
                  currentTab === 'profile'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-pink-400'
                }`}
              >
                👤 My Profile
              </button>
              <button
                onClick={() => setCurrentTab('settings')}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-extrabold transition-all ${
                  currentTab === 'settings'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-pink-400'
                }`}
              >
                ⚙️ Settings
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAdminOpen(!isAdminOpen)}
                className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold border transition-all duration-200 flex items-center gap-2 ${
                  isAdminOpen
                    ? 'bg-rose-950/50 text-rose-300 border-rose-800'
                    : 'bg-slate-100 text-slate-900 border-transparent hover:bg-white hover:scale-[1.02] shadow-md'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                {isAdminOpen ? "Close Admin" : "Safety Panel"}
              </button>

              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  showToast("👋 Logged out securely.");
                }}
                className="p-2.5 bg-slate-900 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5 text-rose-400" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-sm font-bold text-pink-400 flex items-center gap-2">
            <Lock className="w-4.5 h-4.5" /> Security Shield Enforced
          </div>
        )}
      </header>

      {/* ADMIN PANEL OVERLAY */}
      {isAdminOpen && isLoggedIn && (
        <div className="bg-rose-950/30 border-b border-rose-800/40 p-6 md:p-8 shadow-inner transition-all animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
                  <ShieldCheck className="text-rose-500 w-6 h-6" />
                  Trust & Safety Admin Moderation Center
                </h2>
                <p className="text-sm text-slate-400 mt-1">Real-time DPDP consent records, liveness checks, and conversational fraud scans.</p>
              </div>
            </div>

            <div className="bg-slate-900/95 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="bg-slate-950 text-slate-200 px-5 py-4 text-xs font-bold tracking-wider uppercase border-b border-white/5">
                Active Reports and Spammer Flags Queue
              </div>
              <div className="divide-y divide-white/5">
                {reports.map((report) => (
                  <div key={report.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="font-extrabold text-white text-base">Reporter: {report.reporter}</span>
                        <span className="text-slate-600">|</span>
                        <span className="text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full text-xs">Reported: {report.reported}</span>
                      </div>
                      <p className="text-slate-300 text-sm italic">Reason: "{report.reason}"</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {report.status === "pending" ? (
                        <>
                          <button
                            onClick={() => {
                              const matchProf = profiles.find(p => p.name === report.reported);
                              if (matchProf) {
                                handleBanUser(matchProf.id, matchProf.name);
                              }
                              handleResolveReport(report.id);
                            }}
                            className="bg-rose-600 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-xl hover:bg-rose-700"
                          >
                            Ban Accused Account
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" /> Resolved & Safe
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOT LOGGED IN LANDING PAGE & PORTAL */}
      {!isLoggedIn ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-6xl mx-auto w-full animate-fadeIn z-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center">

            {/* Value Proposition Hero details */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/10 to-amber-500/10 border border-pink-500/30 rounded-full px-4 py-1.5 text-xs text-pink-300 font-extrabold tracking-widest uppercase">
                <Sparkles className="w-4.5 h-4.5 text-pink-400" /> AI-First Matrimony Revolution
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Matrimonial Matching <br />
                <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">
                  Redefined by Trust & AI.
                </span>
              </h1>

              <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
                Replace painful filter browsing with beautiful mutual compatibility mapping, DPDP-compliant safety verification, and smooth multi-generational co-management for individuals and parents.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 shadow-inner">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-3 font-bold">
                    🛡️
                  </div>
                  <h4 className="font-extrabold text-white text-sm">Verified Matches Only</h4>
                  <p className="text-xs text-slate-400 mt-1">Multi-step Aadhaar/Liveness photo check for peace of mind.</p>
                </div>
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 shadow-inner">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3 font-bold">
                    👥
                  </div>
                  <h4 className="font-extrabold text-white text-sm">Joint Parental Mode</h4>
                  <p className="text-xs text-slate-400 mt-1">Allow parents and children to collaborate under a unified account.</p>
                </div>
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 shadow-inner">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3 font-bold">
                    🤖
                  </div>
                  <h4 className="font-extrabold text-white text-sm">"Ask AI" Intuitive NLP</h4>
                  <p className="text-xs text-slate-400 mt-1">Search the secure matching pool using normal conversational speech.</p>
                </div>
              </div>
            </div>

            {/* DUAL LOGIN / REGISTRATION PORTAL */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative backdrop-blur-md">

              {/* Tab selector */}
              <div className="flex gap-2 p-1 bg-slate-950/80 rounded-2xl border border-white/5 mb-6">
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  className={`flex-1 py-3 text-xs md:text-sm font-extrabold rounded-xl transition-all ${
                    authTab === 'login'
                      ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🔐 OTP Quick Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('register')}
                  className={`flex-1 py-3 text-xs md:text-sm font-extrabold rounded-xl transition-all ${
                    authTab === 'register'
                      ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ✨ Create Matrimonial Profile
                </button>
              </div>

              {/* REGISTER PROFILE SCREEN */}
              {authTab === 'register' ? (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs uppercase font-extrabold text-slate-400 mb-1.5 tracking-wider">Account Manager Mode</label>
                    <select
                      value={registerForm.account_type}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, account_type: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                    >
                      <option value="self">👤 Creating for Myself (Self-Managed)</option>
                      <option value="parent">👨‍👩‍👧 Creating for my Son/Daughter (Parent-Managed)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">Candidate Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">Gender</label>
                      <select
                        value={registerForm.gender}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">Age</label>
                      <input
                        type="number"
                        required
                        value={registerForm.age}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">Location</label>
                      <input
                        type="text"
                        required
                        value={registerForm.location}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-1 border-t border-white/5 mt-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Smoke habit</label>
                      <select
                        value={registerForm.smoking_status}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, smoking_status: e.target.value }))}
                        className="w-full px-2 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs text-white"
                      >
                        <option>No</option>
                        <option>Yes</option>
                        <option>Occasionally</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Alcohol habit</label>
                      <select
                        value={registerForm.drinking_status}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, drinking_status: e.target.value }))}
                        className="w-full px-2 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs text-white"
                      >
                        <option>No</option>
                        <option>Yes</option>
                        <option>Occasionally</option>
                        <option>Socially</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Weed habit</label>
                      <select
                        value={registerForm.weed_status}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, weed_status: e.target.value }))}
                        className="w-full px-2 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs text-white"
                      >
                        <option>No</option>
                        <option>Yes</option>
                        <option>Occasionally</option>
                      </select>
                    </div>
                  </div>

                  {/* Progressive Customization: Hobbies, Special Interests, Interesting Facts */}
                  <div className="space-y-3 pt-3 border-t border-white/5">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Hobbies (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Photography, Cooking, Yoga"
                        value={registerForm.hobbies}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, hobbies: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Interesting Facts (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Climbed three peaks, Won state level chess"
                        value={registerForm.interesting_facts}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, interesting_facts: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-4.5 bg-pink-600 hover:bg-pink-700 text-white font-black rounded-2xl text-sm transition-all shadow-lg shadow-pink-900/30"
                    >
                      🚀 Register Matrimonial Profile
                    </button>
                  </div>
                </form>
              ) : (
                /* LOGIN SCREEN */
                <form onSubmit={handleLoginSubmit} className="space-y-5 text-left">
                  <div>
                    <label className="block text-xs uppercase font-extrabold text-slate-400 mb-1.5 tracking-wider">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  {otpSent && (
                    <div className="space-y-2 animate-fadeIn">
                      <label className="block text-xs uppercase font-extrabold text-slate-400 mb-1.5 tracking-wider">Verification OTP Code (Simulated)</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter any 4 digit code"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-950 border border-white/10 rounded-xl text-sm text-center font-black tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                      <span className="text-[11px] text-slate-400 italic">Code sent to mobile for instant DPDP identification.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4.5 bg-pink-600 hover:bg-pink-700 text-white font-black rounded-2xl text-sm transition-all shadow-lg shadow-pink-900/30"
                  >
                    {otpSent ? "Authorize Secure Login" : "Send Quick Access OTP"}
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>
      ) : (
        /* LOGGED IN USER INTERFACES */
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 relative z-10">

          {/* DYNAMIC TRUST VERIFICATION MODAL OVERLAY */}
          {verifyStep !== "idle" && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative text-left">
                <button
                  onClick={() => setVerifyStep("idle")}
                  className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <h4 className="text-base font-black text-white flex items-center gap-2 mb-3">
                  <ShieldCheck className="text-pink-500 w-5.5 h-5.5" />
                  Matrimonial Trust & Safety Verification
                </h4>

                {verifyStep === "choosing" && (
                  <div className="space-y-5">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Choose an official ID document. We use high-precision liveness detection to match your photo with your uploaded ID. Your ID document is <strong>never</strong> shown to matches.
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {["Aadhaar Card", "PAN Card", "Passport", "Driving Licence"].map(doc => (
                        <button
                          key={doc}
                          onClick={() => {
                            setUploadedDocType(doc);
                            setVerifyStep("doc_upload");
                          }}
                          className="p-3.5 text-xs md:text-sm border border-white/10 hover:border-pink-500/40 hover:bg-pink-500/10 rounded-xl text-center font-extrabold text-slate-200 transition-all duration-150"
                        >
                          {doc}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {verifyStep === "doc_upload" && (
                  <div className="space-y-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-white/5 text-xs md:text-sm text-slate-300 flex items-start gap-2.5">
                      <Info className="text-blue-400 w-5 h-5 shrink-0 mt-0.5" />
                      <span>Selected: <strong>{uploadedDocType}</strong>. Upload a clear picture of your ID card.</span>
                    </div>
                    <div className="border-2 border-dashed border-white/10 hover:border-pink-500/30 rounded-xl p-8 text-center transition-all cursor-pointer relative bg-slate-950/40">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDocUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload className="mx-auto w-10 h-10 text-slate-400 mb-3" />
                      <span className="text-sm font-extrabold text-slate-200 block">Click to Upload Document Photo</span>
                      <span className="text-xs text-slate-400 mt-1 block">Supports JPG, PNG up to 5MB</span>
                    </div>
                    <div className="flex justify-between">
                      <button onClick={() => setVerifyStep("choosing")} className="text-xs text-slate-400 hover:text-white underline">Back</button>
                    </div>
                  </div>
                )}

                {verifyStep === "selfie_upload" && (
                  <div className="space-y-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-white/5 text-xs md:text-sm text-slate-300 flex items-start gap-2.5">
                      <Info className="text-blue-400 w-5 h-5 shrink-0 mt-0.5" />
                      <span>Document received: <strong className="text-slate-100">{uploadedDocFile}</strong>. Next, perform selfie liveness matching.</span>
                    </div>
                    <div className="border-2 border-dashed border-white/10 hover:border-pink-500/30 rounded-xl p-8 text-center transition-all cursor-pointer relative bg-slate-950/40">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSelfieUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <User className="mx-auto w-10 h-10 text-slate-400 mb-3" />
                      <span className="text-sm font-extrabold text-slate-200 block">Click to Upload Live Selfie</span>
                      <span className="text-xs text-slate-400 mt-1 block">Please align your face clearly in good lighting</span>
                    </div>
                  </div>
                )}

                {verifyStep === "verifying" && (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-14 h-14 rounded-full border-4 border-pink-500 border-t-transparent animate-spin mx-auto"></div>
                    <div>
                      <h5 className="font-bold text-white text-sm">AI Selfie-to-ID Face Similarity Matcher</h5>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Executing mathematical 128-point face liveness analysis & safety lookup...</p>
                    </div>
                  </div>
                )}

                {verifyStep === "completed" && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                    <div>
                      <h5 className="font-bold text-emerald-300 text-base">Identity & Photos Verified!</h5>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Your profile is now marked with 🟢 Photo Verified and 🟢 Identity Verified badges.</p>
                    </div>
                    <button
                      onClick={() => setVerifyStep("idle")}
                      className="bg-white hover:bg-slate-200 text-slate-950 text-xs md:text-sm font-extrabold py-2 px-5 rounded-xl"
                    >
                      Great, thanks!
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 1: FIND MATCHES FEED */}
          {currentTab === 'matches' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">

              {/* LEFT COLUMN: CRITERIA SIDEBAR */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900/75 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-base font-black text-white flex items-center gap-2">
                      <Settings className="text-pink-500 w-5 h-5 animate-spin-slow" />
                      Your Match Criteria
                    </h4>
                    <button
                      onClick={() => {
                        setPrefForm({ ...preferences });
                        setIsPreferencesModalOpen(true);
                      }}
                      className="text-xs bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 font-extrabold px-3.5 py-1.5 rounded-full border border-pink-500/30 shadow-lg shadow-pink-500/5 hover:scale-105 transition-all duration-200"
                    >
                      ✏️ Edit Filters
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* MUST HAVES */}
                    <div className="bg-rose-950/20 p-4 rounded-2xl border border-rose-500/20 text-left">
                      <span className="text-xs font-black text-rose-300 uppercase tracking-widest block mb-2.5">
                        📌 Must Have (Hard Filters)
                      </span>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-center gap-2.5">
                          <CheckSquare className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>Age: <strong className="font-bold text-white">{preferences.must_age_min} to {preferences.must_age_max}</strong></span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckSquare className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>Target Gender: <strong className="font-bold text-white">{preferences.must_genders.join(", ")}</strong></span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckSquare className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>Locations: <strong className="font-bold text-white">{preferences.must_locations.join(", ")}</strong></span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckSquare className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>Food Preference: <strong className="font-bold text-white">{preferences.must_food_preference}</strong></span>
                        </li>
                        {preferences.dealbreaker_smoking && (
                          <li className="flex items-center gap-2.5 text-rose-300">
                            <span className="w-4 h-4 flex items-center justify-center font-bold text-rose-400 text-xs shrink-0">✕</span>
                            <span>Dealbreaker: <strong className="font-bold text-rose-200">No Smoking</strong></span>
                          </li>
                        )}
                        {preferences.dealbreaker_drinking && (
                          <li className="flex items-center gap-2.5 text-rose-300">
                            <span className="w-4 h-4 flex items-center justify-center font-bold text-rose-400 text-xs shrink-0">✕</span>
                            <span>Dealbreaker: <strong className="font-bold text-rose-200">No Drinking</strong></span>
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* PREFERS */}
                    <div className="bg-blue-950/20 p-4 rounded-2xl border border-blue-500/20 text-left">
                      <span className="text-xs font-black text-blue-300 uppercase tracking-widest block mb-2.5">
                        ⭐ Prefer (Scoring Weight Boosts)
                      </span>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-center gap-2.5">
                          <Award className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>Education: <strong className="font-bold text-white">{preferences.prefer_education_level}</strong></span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Award className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>Minimum Income: <strong className="font-bold text-white">₹{preferences.prefer_income_min} LPA+</strong></span>
                        </li>
                      </ul>
                    </div>

                    {/* CUSTOM ACTIVE FILTERS */}
                    {preferences.custom_filters && preferences.custom_filters.length > 0 && (
                      <div className="bg-amber-950/20 p-4 rounded-2xl border border-amber-500/20 text-left">
                        <span className="text-xs font-black text-amber-300 uppercase tracking-widest block mb-2.5">
                          ✨ Custom Preferences / Keywords
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {preferences.custom_filters.map((filter, index) => (
                            <span
                              key={index}
                              className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1"
                            >
                              {filter}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = preferences.custom_filters.filter((_, idx) => idx !== index);
                                  setPreferences(p => ({ ...p, custom_filters: updated }));
                                  showToast(`Removed custom filter: "${filter}"`);
                                }}
                                className="hover:text-white"
                                title="Remove filter"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* PARENT CO-MANAGEMENT DRAWER (Only visible if account type was created as Parent) */}
                {currentUser.account_type === 'parent' && (
                  <div className="bg-gradient-to-br from-amber-950/20 to-orange-950/10 rounded-3xl border border-amber-900/30 p-6 shadow-xl backdrop-blur-md">
                    <h4 className="text-base font-black text-amber-200 flex items-center gap-2 mb-3">
                      <Users className="text-amber-400 w-5 h-5" />
                      Parent Co-Manage Status
                    </h4>
                    {parentInviteStatus === 'idle' ? (
                      <form onSubmit={handleParentInvite} className="space-y-4">
                        <input
                          type="email"
                          required
                          placeholder="e.g. child@email.com"
                          value={parentInviteInput}
                          onChange={(e) => setParentInviteInput(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                        />
                        <button type="submit" className="w-full bg-amber-500 text-slate-950 text-xs font-extrabold py-2.5 rounded-xl">
                          Send Co-Management Invite
                        </button>
                      </form>
                    ) : (
                      <div className="text-xs text-slate-300">
                        <span className="text-emerald-400 font-bold">✓ Active Joint Co-Management</span> with {parentInviteInput || 'candidate'}.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* MIDDLE COLUMN: DISCOVER FEED */}
              <div className="lg:col-span-5 space-y-8">
                {/* ASK AI SEARCH FORM */}
                <div className="bg-slate-900/75 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
                  <h3 className="text-lg font-black text-white flex items-center gap-2 mb-2">
                    <Zap className="text-pink-400 w-5 h-5 fill-pink-500/20" />
                    "Ask AI" Intuitive Match Search
                  </h3>
                  <form onSubmit={handleAiSearch} className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g., Find someone who is 26-30, based in Bangalore, vegetarian and family-oriented"
                        value={nlQuery}
                        onChange={(e) => setNlQuery(e.target.value)}
                        className="w-full pl-5 pr-14 py-4 rounded-2xl bg-slate-950/80 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all placeholder:text-slate-500"
                      />
                      <button type="submit" className="absolute right-2.5 top-2.5 p-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl">
                        {isAiSearching ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Search className="w-5 h-5" />}
                      </button>
                    </div>

                    {parsedSchema && (
                      <div className="bg-slate-950 border border-white/10 text-slate-100 p-5 rounded-2xl text-xs space-y-3 font-mono">
                        <div className="flex justify-between items-center text-xs text-pink-400 font-extrabold border-b border-white/5 pb-2">
                          <span>✓ SAFE VALIDATED SEARCH SCHEMA</span>
                          <button type="button" onClick={() => { setParsedSchema(null); setNlQuery(""); }} className="text-slate-400">Clear</button>
                        </div>
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed text-slate-200">
                          {JSON.stringify(parsedSchema, null, 2)}
                        </pre>
                      </div>
                    )}
                  </form>
                </div>

                {/* AI RECOMMENDATION MATCH FEED */}
                <div className="space-y-5">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <Compass className="text-pink-400 w-5 h-5" />
                      AI matches for you ({rankedMatches.length})
                    </h4>
                  </div>

                  {rankedMatches.map((profile) => {
                    const isLikedByMe = likes[profile.id] === 'accepted';
                    return (
                      <div key={profile.id} className="bg-slate-900/75 border border-white/10 rounded-3xl overflow-hidden hover:border-pink-500/20 transition-all duration-300 relative group backdrop-blur-md">
                        <div className="absolute top-5 right-5 bg-slate-950/90 text-white border border-white/10 py-2 px-4 rounded-full flex items-center gap-2 z-10 shadow-lg">
                          <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                          <span className="font-black text-xs md:text-sm">{profile.matchScore}% Compatibility</span>
                        </div>

                        <div className="relative h-64 bg-slate-950">
                          <img src={profile.photos[0].url} alt={profile.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                          <div className="absolute bottom-5 left-5 right-5">
                            <h4 className="text-xl font-black flex items-center gap-2 text-white">
                              {profile.name}
                              {profile.is_verified_identity && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                            </h4>
                            <p className="text-sm text-slate-200 font-bold mt-1">{profile.age} yrs • {profile.height} • {profile.profession}</p>
                          </div>
                        </div>

                        <div className="p-6 space-y-5 text-left">
                          {/* Private Album section */}
                          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <LockKeyhole className="w-4 h-4 text-pink-400" />
                              <div>
                                <span className="text-xs font-bold text-slate-200 block">Private Album</span>
                                <span className="text-[10px] text-slate-400 block">Requires authorization consent</span>
                              </div>
                            </div>
                            <div>
                              {photoRequestStatus[profile.id] === 'approved' ? (
                                <span className="text-xs bg-emerald-500/10 text-emerald-400 font-extrabold py-1.5 px-3 rounded-full border border-emerald-500/10 flex items-center gap-1">
                                  ✓ Unlocked
                                </span>
                              ) : photoRequestStatus[profile.id] === 'pending' ? (
                                <span className="text-xs bg-white/5 text-slate-400 font-extrabold py-1.5 px-3 rounded-full border border-white/5">
                                  Pending Access...
                                </span>
                              ) : (
                                <button
                                  onClick={() => handlePhotoRequest(profile.id, profile.name)}
                                  className="bg-pink-600 hover:bg-pink-700 text-white font-black py-1.5 px-4 rounded-lg text-xs transition-all"
                                >
                                  Request Access
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="bg-pink-950/20 p-4.5 rounded-2xl border border-pink-500/20">
                            <span className="text-xs font-black text-pink-300 uppercase tracking-widest block mb-2.5">💡 Why We Recommend This Match</span>
                            <div className="grid grid-cols-1 gap-1.5">
                              {profile.explainableReasons.map((reason, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-slate-200 text-xs md:text-sm font-semibold">
                                  <Check className="w-4 h-4 text-pink-400 stroke-[3.5] shrink-0" />
                                  <span>{reason}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button onClick={() => setSelectedProfile(profile)} className="flex-1 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-extrabold py-3 rounded-xl">Full Profile</button>
                            <button onClick={() => handleLike(profile.id, profile.name)} disabled={isLikedByMe} className={`flex-1 text-xs font-extrabold py-3 rounded-xl flex items-center justify-center gap-1.5 ${isLikedByMe ? 'bg-emerald-500/15 text-emerald-300' : 'bg-pink-600 text-white'}`}>
                              <Heart className="w-4.5 h-4.5" /> {isLikedByMe ? "Matched & Connected" : "Express Interest"}
                            </button>
                            <button onClick={() => handleBlockProfile(profile.id, profile.name)} className="px-3 bg-white/5 hover:bg-rose-900/30 border border-white/10 rounded-xl" title="Block Profile">
                              🚫
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: CHAT HUB */}
              <div className="lg:col-span-3 space-y-8">
                <div className="bg-slate-900/75 border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[650px] backdrop-blur-md shadow-2xl">
                  <div className="bg-slate-950 p-5 flex items-center justify-between border-b border-white/5">
                    <h3 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 text-white">
                      <MessageCircle className="w-5 h-5 text-pink-400" /> Matrimonial Chat Hub
                    </h3>
                  </div>

                  <div className="bg-slate-950/40 p-4 border-b border-white/5">
                    <span className="text-[10px] text-slate-400 font-extrabold block mb-2">MUTUAL CONNECTIONS</span>
                    <div className="flex gap-2.5 overflow-x-auto">
                      {profiles.filter(p => likes[p.id] === 'accepted').map(partner => (
                        <button key={partner.id} onClick={() => setActiveChatId(partner.id)} className={`flex items-center gap-2 p-1.5 rounded-xl border ${activeChatId === partner.id ? 'bg-slate-850 border-pink-500/40 text-white' : 'border-transparent text-slate-300'}`}>
                          <img src={partner.photos[0].url} alt={partner.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950/20 flex flex-col justify-end">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm ${msg.sender === 'You' ? 'bg-slate-100 text-slate-950 ml-auto' : 'bg-slate-800 text-slate-100'}`}>
                        <div className="flex justify-between items-center gap-2 mb-1">
                          <span className="font-extrabold text-xs">{msg.sender}</span>
                          <span className="text-[10px] opacity-60">{msg.time}</span>
                        </div>
                        <p>{msg.content}</p>
                      </div>
                    ))}
                    {spamAlert && <div className="bg-rose-950/50 border border-rose-800 p-4 text-rose-200 text-xs rounded-2xl">{spamAlert}</div>}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-slate-950 flex gap-2.5">
                    <input type="text" placeholder="Type secure message..." value={currentMessageInput} onChange={(e) => setCurrentMessageInput(e.target.value)} className="flex-1 px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none" />
                    <button type="submit" className="bg-pink-600 p-3 rounded-xl"><Send className="w-4 h-4" /></button>
                  </form>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MY MATRIMONIAL PROFILE TAB (SEPARATE VIEW OWN PROFILE PAGE) */}
          {currentTab === 'profile' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-left">

              <div className="bg-slate-900/75 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative backdrop-blur-md">

                {/* Mode Indicator */}
                <div className="absolute top-6 right-6">
                  <span className="text-xs font-black bg-pink-500/10 text-pink-300 border border-pink-500/20 px-3.5 py-1.5 rounded-full capitalize">
                    🛡️ {currentUser.profile_mode} managed profile
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-white mb-6 flex items-center gap-2">
                  <User className="text-pink-400 w-7 h-7" />
                  Your Matrimonial Profile Portal
                </h2>

                <div className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b border-white/5">

                  {/* Photo area with picture/selfie upload capabilities */}
                  <div className="w-full md:w-1/3 space-y-5 text-left">
                    <div className="relative group rounded-2xl overflow-hidden border-2 border-white/10 bg-slate-950 aspect-square shadow-xl">
                      {currentUser.photos && currentUser.photos[primaryPhotoIndex] ? (
                        <img
                          src={currentUser.photos[primaryPhotoIndex].url}
                          alt="Your Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : currentUser.photos && currentUser.photos[0] ? (
                        <img
                          src={currentUser.photos[0].url}
                          alt="Your Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                          <User className="w-14 h-14" />
                          <span className="text-xs font-bold mt-2">No photo uploaded</span>
                        </div>
                      )}

                      {currentUser.is_verified_photo && (
                        <div className="absolute bottom-4 left-4 bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                          <Check className="w-3.5 h-3.5" /> Photo Verified
                        </div>
                      )}

                      {/* Overlaid primary indicator */}
                      <div className="absolute top-4 right-4 bg-pink-600 text-white font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md">
                        Primary Active
                      </div>
                    </div>

                    {/* MANAGE PHOTOS / CHOOSE PRIMARY */}
                    {currentUser.photos && currentUser.photos.length > 0 && (
                      <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 space-y-3">
                        <span className="text-xs font-black text-slate-300 uppercase tracking-widest block">
                          🖼️ Manage Photo Portfolio
                        </span>
                        <div className="grid grid-cols-3 gap-2.5">
                          {currentUser.photos.map((photo, index) => {
                            const isPrimary = index === primaryPhotoIndex;
                            return (
                              <div
                                key={index}
                                className={`relative rounded-lg overflow-hidden border-2 aspect-square cursor-pointer group/thumb transition-all duration-200 ${
                                  isPrimary ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-white/10 hover:border-white/25'
                                }`}
                                onClick={() => setPrimaryPhotoIndex(index)}
                                title="Click to set as primary profile picture"
                              >
                                <img src={photo.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />

                                {/* Label indicator */}
                                <div className={`absolute bottom-0 inset-x-0 text-[8px] font-bold text-center py-0.5 ${
                                  photo.is_public ? 'bg-emerald-950/80 text-emerald-300' : 'bg-rose-950/80 text-rose-300'
                                }`}>
                                  {photo.is_public ? 'Public' : 'Private'}
                                </div>

                                {/* Set as primary / delete hover overlay */}
                                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover/thumb:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-150">
                                  {!isPrimary && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setPrimaryPhotoIndex(index);
                                        showToast("⭐️ Set as your primary profile photo.");
                                      }}
                                      className="bg-pink-500 hover:bg-pink-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded"
                                    >
                                      Use Primary
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeletePhoto(index);
                                    }}
                                    className="bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white font-black text-[9px] px-1.5 py-0.5 rounded border border-white/10"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-[10px] text-slate-400 italic">
                          💡 Click any thumbnail above to set it as your primary public profile picture.
                        </p>
                      </div>
                    )}

                    {/* DIRECT PHOTO/SELFIE FILE UPLOADER */}
                    <div className="bg-slate-950/80 p-4.5 rounded-2xl border border-white/5 space-y-3.5">
                      <span className="text-xs font-black text-pink-400 uppercase tracking-widest block">
                        📸 Add Profile Photo / Selfie
                      </span>
                      <form onSubmit={handleAddCustomPhoto} className="space-y-3">
                        <div className="relative border-2 border-dashed border-white/10 hover:border-pink-500/30 rounded-xl p-4 text-center transition-all cursor-pointer bg-slate-900/40">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLocalFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            id="portfolio-file-upload"
                          />
                          <Upload className="mx-auto w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-[11px] font-bold text-slate-200 block">
                            {selectedLocalPhoto ? "✅ Photo Selected" : "Click to select a photo file"}
                          </span>
                        </div>

                        {selectedLocalPhoto && (
                          <div className="relative rounded-lg overflow-hidden border border-white/10 max-h-24 aspect-video bg-slate-950 flex items-center justify-center">
                            <img src={selectedLocalPhoto} alt="Upload Preview" className="h-full object-contain" />
                            <button
                              type="button"
                              onClick={() => setSelectedLocalPhoto(null)}
                              className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-rose-600 transition-all text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <span>Set public photo</span>
                          <button
                            type="button"
                            onClick={() => setIsNewPhotoPublic(!isNewPhotoPublic)}
                            className={`px-3 py-1 rounded font-bold ${isNewPhotoPublic ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}
                          >
                            {isNewPhotoPublic ? "Public" : "Private Album"}
                          </button>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs py-2 rounded-lg"
                        >
                          Upload Photo / Selfie
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Core Details section */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-2xl font-black text-white">{currentUser.name}</h3>
                      <p className="text-sm text-slate-400 font-semibold mt-1">
                        {currentUser.age} years old • {currentUser.height} • {currentUser.location}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-400 block uppercase tracking-wider mb-1">Career</span>
                        <span className="font-extrabold text-slate-200">{currentUser.profession} at {currentUser.company || "Adobe"}</span>
                      </div>
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-400 block uppercase tracking-wider mb-1">Confidential Income</span>
                        <span className="font-extrabold text-pink-400">{currentUser.income_range}</span>
                      </div>
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-400 block uppercase tracking-wider mb-1">Religion / Community</span>
                        <span className="font-extrabold text-slate-200">{currentUser.religion} • {currentUser.community}</span>
                      </div>
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-400 block uppercase tracking-wider mb-1">Mother Tongue</span>
                        <span className="font-extrabold text-slate-200">{currentUser.mother_tongue}</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5">
                      <span className="text-xs text-pink-400 font-extrabold uppercase tracking-widest block mb-1">About Myself</span>
                      <p className="text-slate-300 italic text-sm">"{currentUser.about_me}"</p>
                    </div>
                  </div>
                </div>

                {/* Additional Matrimonial Customizations Details */}
                <div className="mt-8 space-y-6">
                  <h4 className="text-lg font-black text-white">Interactive Habits & Custom Hobbies</h4>

                  <div className="grid grid-cols-3 gap-4 bg-slate-950/80 p-4 rounded-2xl border border-white/5">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-black block">Smoking Habit</span>
                      <span className="text-sm font-extrabold text-white">{currentUser.smoking_status || "No"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-black block">Alcohol consumption</span>
                      <span className="text-sm font-extrabold text-white">{currentUser.drinking_status || "No"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-black block">Weed habit</span>
                      <span className="text-sm font-extrabold text-white">{currentUser.weed_status || "No"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-950/50 p-5 rounded-2xl border border-white/5">
                      <span className="text-xs text-pink-400 font-extrabold uppercase tracking-wider block mb-2">Interests & Hobbies</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(currentUser.hobbies || []).map((h, i) => (
                          <span key={i} className="text-xs bg-slate-900 px-3 py-1 rounded-lg border border-white/5 text-slate-300">{h}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-950/50 p-5 rounded-2xl border border-white/5">
                      <span className="text-xs text-amber-300 font-extrabold uppercase tracking-wider block mb-2">Interesting Facts</span>
                      <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                        {(currentUser.interesting_facts || []).map((fact, i) => (
                          <li key={i}>{fact}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* VERIFICATION TRIGGER AREA */}
                {!currentUser.is_verified_identity && (
                  <div className="mt-8 bg-gradient-to-r from-pink-900/20 to-rose-900/10 p-6 rounded-2xl border border-pink-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-extrabold text-white text-base flex items-center gap-2">
                        <ShieldCheck className="text-emerald-400" /> Trust Verification Badging Pending
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">Elevate match priority by verifying your Aadhaar ID and live face selfie.</p>
                    </div>
                    <button onClick={triggerVerification} className="bg-pink-600 text-white font-extrabold text-xs px-5 py-3 rounded-xl">Verify ID & Selfie Now</button>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS VIEWPORT */}
          {currentTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-left">

              <div className="bg-slate-900/75 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md">

                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                  <Settings className="text-pink-500 w-6 h-6" />
                  App Settings & Controls
                </h2>

                {/* THEME SELECTION PANEL */}
                <div className="p-6 bg-slate-950/85 rounded-2xl border border-white/5 space-y-4 mb-6">
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Palette className="text-pink-400 w-4.5 h-4.5" />
                    App Theme Mode Selector
                  </h4>
                  <p className="text-xs text-slate-400">Select your preferred user experience mode.</p>

                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => { setThemeMode('dark'); showToast(" Premium Dark Mesh theme applied."); }}
                      className={`p-4 border rounded-xl text-center text-xs font-black transition-all ${themeMode === 'dark' ? 'border-pink-500 bg-pink-500/10 text-pink-300' : 'border-white/5 text-slate-300'}`}
                    >
                      🌌 Premium Dark
                    </button>
                    <button
                      onClick={() => { setThemeMode('light'); showToast(" Elegant Light mode applied."); }}
                      className={`p-4 border rounded-xl text-center text-xs font-black transition-all ${themeMode === 'light' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-700' : 'border-white/5 text-slate-300'}`}
                    >
                      ☀️ Elegant Light
                    </button>
                    <button
                      onClick={() => { setThemeMode('gold'); showToast(" Majestic Gold Royal theme applied."); }}
                      className={`p-4 border rounded-xl text-center text-xs font-black transition-all ${themeMode === 'gold' ? 'border-amber-500 bg-amber-500/10 text-amber-300' : 'border-white/5 text-slate-300'}`}
                    >
                      👑 Majestic Gold
                    </button>
                  </div>
                </div>

                {/* EDIT PROFILE SHORTCUT */}
                <div className="p-6 bg-slate-950/85 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                  <div>
                    <h4 className="font-extrabold text-sm text-white">Progressive Profile Setup Setup</h4>
                    <p className="text-xs text-slate-400 mt-1">Update your career goals, expectations, religion, mother tongue, and habits.</p>
                  </div>
                  <button
                    onClick={() => {
                      setOnboardingForm({ ...currentUser });
                      setOnboardingStep(1);
                      setIsOnboardingOpen(true);
                    }}
                    className="bg-white text-slate-950 font-black text-xs px-5 py-3 rounded-xl"
                  >
                    Launch Profile Flow
                  </button>
                </div>

                {/* BLOCKED CONTACTS LIST */}
                <div className="p-6 bg-slate-950/85 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="font-extrabold text-sm text-white">Blocked Connections Directory</h4>
                  <p className="text-xs text-slate-400">Blocked contacts cannot view your profile details or send mutual requests.</p>

                  {blockedProfiles.length === 0 ? (
                    <div className="text-xs text-slate-500 py-3 italic">No blocked contacts.</div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {blockedProfiles.map((bp) => (
                        <div key={bp.id} className="py-3 flex items-center justify-between text-xs md:text-sm">
                          <div>
                            <span className="font-extrabold text-white">{bp.name}</span>
                            <span className="text-slate-500 ml-2">({bp.reason})</span>
                          </div>
                          <button
                            onClick={() => handleUnblockProfile(bp.id, bp.name)}
                            className="text-pink-400 hover:text-white underline font-bold"
                          >
                            Unblock
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </main>
      )}

      {/* FULL PROFILE DETAIL MODAL */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 relative animate-fadeIn">
            <button onClick={() => setSelectedProfile(null)} className="absolute top-6 right-6 bg-white/5 text-slate-300 hover:text-white p-2 rounded-full transition-all">
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="w-full md:w-1/3">
                <img src={selectedProfile.photos[0].url} alt={selectedProfile.name} className="w-full h-56 object-cover rounded-2xl shadow-md" />
              </div>
              <div className="flex-1 space-y-4 text-left">
                <h3 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                  {selectedProfile.name}
                  {selectedProfile.is_verified_identity && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
                </h3>
                <p className="text-sm md:text-base text-slate-300 font-semibold mt-1">{selectedProfile.location} • {selectedProfile.age} yrs • {selectedProfile.height}</p>

                {/* Private Album section in detail view */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <LockKeyhole className="w-4 h-4 text-pink-400" />
                    <div>
                      <span className="text-slate-200 font-bold block">Private Photo Album</span>
                      <span className="text-[10px] text-slate-400 block">Ask permission to view private portfolio</span>
                    </div>
                  </div>
                  <div>
                    {photoRequestStatus[selectedProfile.id] === 'approved' ? (
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold py-1.5 px-3 rounded-full">
                        ✓ Authorized
                      </span>
                    ) : photoRequestStatus[selectedProfile.id] === 'pending' ? (
                      <span className="text-xs bg-white/5 text-slate-400 font-bold py-1.5 px-3 rounded-full">
                        Pending Approval...
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePhotoRequest(selectedProfile.id, selectedProfile.name)}
                        className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-1 px-3 rounded text-xs"
                      >
                        Request Access
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 text-sm">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider mb-0.5">Income Level</span>
                    <span className="font-extrabold text-pink-400 text-sm">{selectedProfile.income_range}</span>
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider mb-0.5">Profession</span>
                    <span className="font-extrabold text-white text-sm">{selectedProfile.profession}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5 border-t border-white/5 pt-5 text-sm leading-relaxed text-left">
              <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-white/5">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-black block">Smoking</span>
                  <span className="text-xs font-extrabold text-slate-200">{selectedProfile.smoking_status || "No"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-black block">Drinking</span>
                  <span className="text-xs font-extrabold text-slate-200">{selectedProfile.drinking_status || "No"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-black block">Weed</span>
                  <span className="text-xs font-extrabold text-slate-200">{selectedProfile.weed_status || "No"}</span>
                </div>
              </div>

              <div>
                <h5 className="font-black text-white text-xs uppercase tracking-widest mb-1.5 text-pink-400">Hobbies</h5>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedProfile.hobbies || []).map((h, i) => (
                    <span key={i} className="text-xs bg-slate-950 px-3 py-1 rounded-md border border-white/5 text-slate-300">{h}</span>
                  ))}
                </div>
              </div>

              {selectedProfile.special_interests && (
                <div>
                  <h5 className="font-black text-white text-xs uppercase tracking-widest mb-1.5 text-amber-300">Special Interests</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedProfile.special_interests || []).map((int, i) => (
                      <span key={i} className="text-xs bg-slate-950 px-3 py-1 rounded-md border border-white/5 text-slate-300">{int}</span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h5 className="font-black text-white text-xs uppercase tracking-widest mb-1.5 text-pink-400">About Me</h5>
                <p className="text-slate-200 italic">"{selectedProfile.about_me}"</p>
              </div>

              <div className="flex gap-3 pt-5 border-t border-white/5">
                <button onClick={() => { handleLike(selectedProfile.id, selectedProfile.name); setSelectedProfile(null); }} className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-sm font-extrabold py-3.5 px-5 rounded-xl flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 fill-white" /> Connect With {selectedProfile.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM PREFERENCES EDIT MODAL */}
      {isPreferencesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 relative animate-fadeIn text-left">
            <button
              type="button"
              onClick={() => setIsPreferencesModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Settings className="text-pink-500 w-6 h-6" />
                Edit Match Preferences
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Refine your filters. Must Haves acts as strict hard filters, while Prefers boost the compatibility match scores.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPreferences({ ...prefForm });
                setIsPreferencesModalOpen(false);
              }}
              className="space-y-4"
            >
              {/* MUST HAVES SECTION */}
              <div className="bg-rose-950/10 p-4 rounded-2xl border border-rose-500/10 space-y-3">
                <span className="text-xs font-black text-rose-300 uppercase tracking-widest block mb-1">
                  📌 Must Haves (Hard Filters)
                </span>

                {/* Age Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1">Min Age</label>
                    <input
                      type="number"
                      value={prefForm.must_age_min}
                      onChange={(e) => setPrefForm(p => ({ ...p, must_age_min: parseInt(e.target.value) || 20 }))}
                      className="w-full bg-slate-950/80 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
                      min="18"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1">Max Age</label>
                    <input
                      type="number"
                      value={prefForm.must_age_max}
                      onChange={(e) => setPrefForm(p => ({ ...p, must_age_max: parseInt(e.target.value) || 100 }))}
                      className="w-full bg-slate-950/80 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
                      min="18"
                      max="100"
                    />
                  </div>
                </div>

                {/* Genders */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">Target Gender</label>
                  <div className="flex gap-2">
                    {["Female", "Male"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          const genders = prefForm.must_genders.includes(g)
                            ? prefForm.must_genders.filter(x => x !== g)
                            : [...prefForm.must_genders, g];
                          setPrefForm(p => ({ ...p, must_genders: genders.length ? genders : [g] }));
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          prefForm.must_genders.includes(g)
                            ? "bg-pink-600 text-white"
                            : "bg-slate-950 text-slate-400 hover:text-white"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">Preferred Cities (Comma separated)</label>
                  <input
                    type="text"
                    value={prefForm.must_locations.join(", ")}
                    onChange={(e) => {
                      const locs = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                      setPrefForm(p => ({ ...p, must_locations: locs }));
                    }}
                    className="w-full bg-slate-950/80 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
                    placeholder="Bangalore, Hyderabad, Delhi..."
                  />
                </div>

                {/* Food Preference */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">Food Preference</label>
                  <select
                    value={prefForm.must_food_preference || ""}
                    onChange={(e) => setPrefForm(p => ({ ...p, must_food_preference: e.target.value }))}
                    className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                  </select>
                </div>

                {/* Dealbreakers */}
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-extrabold text-slate-300">
                    <input
                      type="checkbox"
                      checked={prefForm.dealbreaker_smoking}
                      onChange={(e) => setPrefForm(p => ({ ...p, dealbreaker_smoking: e.target.checked }))}
                      className="rounded border-slate-700 bg-slate-950 text-pink-500 focus:ring-0"
                    />
                    No Smoking Dealbreaker
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-extrabold text-slate-300">
                    <input
                      type="checkbox"
                      checked={prefForm.dealbreaker_drinking}
                      onChange={(e) => setPrefForm(p => ({ ...p, dealbreaker_drinking: e.target.checked }))}
                      className="rounded border-slate-700 bg-slate-950 text-pink-500 focus:ring-0"
                    />
                    No Drinking Dealbreaker
                  </label>
                </div>
              </div>

              {/* PREFERS SECTION */}
              <div className="bg-blue-950/10 p-4 rounded-2xl border border-blue-500/10 space-y-3">
                <span className="text-xs font-black text-blue-300 uppercase tracking-widest block mb-1">
                  ⭐ Prefers (Scoring Weight Boosts)
                </span>

                {/* Education */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">Preferred Education</label>
                  <select
                    value={prefForm.prefer_education_level}
                    onChange={(e) => setPrefForm(p => ({ ...p, prefer_education_level: e.target.value }))}
                    className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
                  >
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="MBA">MBA</option>
                    <option value="MD">MD (Medicine)</option>
                    <option value="B.Tech + MS">B.Tech + MS</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                  </select>
                </div>

                {/* Minimum Income */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">Minimum Income Preferred (LPA)</label>
                  <input
                    type="number"
                    value={prefForm.prefer_income_min}
                    onChange={(e) => setPrefForm(p => ({ ...p, prefer_income_min: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-950/80 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
                    min="0"
                  />
                </div>
              </div>

              {/* CUSTOM MATCH PREFERENCES BUILDER SECTION */}
              <div className="bg-amber-950/15 p-4 rounded-2xl border border-amber-500/20 space-y-3">
                <span className="text-xs font-black text-amber-300 uppercase tracking-widest block mb-1">
                  ✨ Custom Options / Keywords Filter
                </span>
                <p className="text-[10px] text-slate-400">
                  Add custom keywords (e.g., "doctor", "Intel", "classical") to match against candidate profiles.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCustomFilterInput}
                    onChange={(e) => setNewCustomFilterInput(e.target.value)}
                    placeholder="e.g. Doctor, Intel, Chess"
                    className="flex-1 bg-slate-950/80 border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newCustomFilterInput.trim()) {
                          const val = newCustomFilterInput.trim();
                          if (!prefForm.custom_filters.includes(val)) {
                            setPrefForm(p => ({ ...p, custom_filters: [...p.custom_filters, val] }));
                          }
                          setNewCustomFilterInput("");
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newCustomFilterInput.trim()) {
                        const val = newCustomFilterInput.trim();
                        if (!prefForm.custom_filters.includes(val)) {
                          setPrefForm(p => ({ ...p, custom_filters: [...p.custom_filters, val] }));
                        }
                        setNewCustomFilterInput("");
                      }
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-slate-950 px-3 py-2 rounded-xl text-xs font-black"
                  >
                    Add Option
                  </button>
                </div>

                {prefForm.custom_filters && prefForm.custom_filters.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prefForm.custom_filters.map((filter, index) => (
                      <span
                        key={index}
                        className="text-xs bg-slate-950 border border-white/10 text-slate-200 px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        {filter}
                        <button
                          type="button"
                          onClick={() => {
                            setPrefForm(p => ({
                              ...p,
                              custom_filters: p.custom_filters.filter((_, idx) => idx !== index)
                            }));
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPreferencesModalOpen(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white text-sm font-bold bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white text-sm font-black bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl transition-all shadow-lg shadow-pink-500/20"
                >
                  Save & Apply Filters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROGRESSIVE ONBOARDING SETUP FORM POPUP */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl p-6 md:p-8 relative animate-fadeIn">
            <button type="button" onClick={() => setIsOnboardingOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-full transition-all">
              <X className="w-6 h-6" />
            </button>

            <div className="flex justify-between items-center mb-6 mt-2">
              <span className="text-xs font-black bg-pink-500/10 text-pink-300 px-3.5 py-1.5 rounded-full border border-pink-500/20 uppercase tracking-wider">
                Progressive Registration (Step {onboardingStep} of 6)
              </span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className={`h-2.5 w-6 rounded-full transition-all duration-300 ${onboardingStep >= num ? 'bg-pink-500 shadow-md shadow-pink-900/30' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>

            <form onSubmit={handleOnboardingSubmit} className="space-y-5 text-left">

              {onboardingStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="font-black text-white text-base">Step 1: Welcome & Profile Mode</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">How do you intend to run this profile?</p>
                  <div className="grid grid-cols-3 gap-3">
                    {["self", "parent", "family"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setOnboardingForm(prev => ({ ...prev, account_type: type }))}
                        className={`p-4.5 border rounded-xl text-center font-extrabold text-sm capitalize transition-all duration-150 ${onboardingForm.account_type === type ? 'bg-pink-600/20 border-pink-500 text-pink-300 ring-2 ring-pink-500/30' : 'border-white/10 hover:border-white/20 text-slate-200'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {onboardingStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="font-black text-white text-base">Step 2: Core Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">Name</label>
                      <input type="text" required value={onboardingForm.name} onChange={(e) => setOnboardingForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">Gender</label>
                      <select value={onboardingForm.gender} onChange={(e) => setOnboardingForm(prev => ({ ...prev, gender: e.target.value }))} className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white">
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {onboardingStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="font-black text-white text-base">Step 3: Education & Career</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">Highest Degree</label>
                      <input type="text" required value={onboardingForm.education_level} onChange={(e) => setOnboardingForm(prev => ({ ...prev, education_level: e.target.value }))} className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">Profession</label>
                      <input type="text" required value={onboardingForm.profession} onChange={(e) => setOnboardingForm(prev => ({ ...prev, profession: e.target.value }))} className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white" />
                    </div>
                  </div>
                </div>
              )}

              {onboardingStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="font-black text-white text-base">Step 4: Family Details</h4>
                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">Religion</label>
                    <input type="text" required value={onboardingForm.religion} onChange={(e) => setOnboardingForm(prev => ({ ...prev, religion: e.target.value }))} className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white" />
                  </div>
                </div>
              )}

              {onboardingStep === 5 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="font-black text-white text-base">Step 5: Lifestyle & Expectations</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">Food Preference</label>
                      <select value={onboardingForm.food_preference} onChange={(e) => setOnboardingForm(prev => ({ ...prev, food_preference: e.target.value }))} className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white">
                        <option>Vegetarian</option>
                        <option>Non-Vegetarian</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">Smoking Habit</label>
                      <select value={onboardingForm.smoking_status} onChange={(e) => setOnboardingForm(prev => ({ ...prev, smoking_status: e.target.value }))} className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white">
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">Drinking Habit</label>
                      <select value={onboardingForm.drinking_status} onChange={(e) => setOnboardingForm(prev => ({ ...prev, drinking_status: e.target.value }))} className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white">
                        <option>No</option>
                        <option>Yes</option>
                        <option>Socially</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">Weed Habit</label>
                      <select value={onboardingForm.weed_status} onChange={(e) => setOnboardingForm(prev => ({ ...prev, weed_status: e.target.value }))} className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white">
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Hobbies (comma separated)</label>
                    <input type="text" value={Array.isArray(onboardingForm.hobbies) ? onboardingForm.hobbies.join(", ") : onboardingForm.hobbies} onChange={(e) => setOnboardingForm(prev => ({ ...prev, hobbies: e.target.value.split(",").map(i => i.trim()) }))} className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white" />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">About Me</label>
                    <textarea rows={3} value={onboardingForm.about_me} onChange={(e) => setOnboardingForm(prev => ({ ...prev, about_me: e.target.value }))} className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white" />
                  </div>
                </div>
              )}

              {onboardingStep === 6 && (
                <div className="space-y-5 animate-fadeIn">
                  <h4 className="font-black text-white text-base">Step 6: Confirm Photos & Finalize</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">Ready to complete setup?</p>
                </div>
              )}

              <div className="flex justify-between pt-5 border-t border-white/5 mt-6">
                <button type="button" onClick={handlePrevOnboardingStep} disabled={onboardingStep === 1} className="px-5 py-2 text-sm font-extrabold text-slate-400 disabled:opacity-20">Previous</button>
                {onboardingStep < 6 ? (
                  <button type="button" onClick={handleNextOnboardingStep} className="bg-white text-slate-950 font-extrabold py-2.5 px-5 rounded-xl">Next</button>
                ) : (
                  <button type="submit" className="bg-pink-600 text-white font-extrabold py-2.5 px-6 rounded-xl">Save Profile</button>
                )}
              </div>

            </form>
          </div>
        </div>
      )}

      {/* FOOTER BAR */}
      <footer className="bg-slate-950 text-slate-400 py-8 px-6 mt-16 border-t border-white/5 shrink-0 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <div>
            <p className="font-extrabold text-white text-base">PureVows AI Matrimonial System</p>
            <p className="text-slate-500 mt-1">Robust AI matching + Multi-generational co-management + Extreme Privacy Guardrails.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
