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
  LockKeyhole
} from 'lucide-react';
import { seedProfiles, calculateHybridScore, parseNaturalLanguageQuery } from './profilesData';

export default function App() {
  // --- AUTH STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' or 'register'
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loginPhone, setLoginPhone] = useState('+91 98765 43210');

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

  // Security and admin states
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [reports, setReports] = useState([
    { id: 101, reporter: "Neha Deshmukh", reported: "Spammer101", reason: "Asked for bank account transfer immediately after matching.", status: "pending", date: "Today" }
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

  // Switch role context for demonstration
  const handleRoleChange = (role) => {
    let mode = "self";
    let managed_by = "";
    if (role === "parent") {
      mode = "parent";
      managed_by = "Father - Rajesh Malhotra";
    } else if (role === "joint") {
      mode = "joint";
      managed_by = "Father - Rajesh Malhotra (Co-managed)";
    }

    setCurrentUser(prev => ({
      ...prev,
      account_type: role,
      profile_mode: mode,
      managed_by: managed_by
    }));
    showToast(`Switched workspace context to ${role.toUpperCase()} mode successfully.`);
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

      // Layer 1: Hard Filters (Eliminate profiles that fail Must Haves)
      if (currentUser.gender === "Male" && profile.gender !== "Female") return false;
      if (currentUser.gender === "Female" && profile.gender !== "Male") return false;

      if (profile.age < preferences.must_age_min || profile.age > preferences.must_age_max) return false;

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
      const { score, reasons } = calculateHybridScore(currentUser, profile);
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

  // AUTH SUBMISSION HANDLERS
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
      showToast("🔐 Matrimonial Security OTP sent to " + loginPhone);
    } else {
      setIsLoggedIn(true);
      showToast("🟢 Welcome back to PureVows AI! Secure session initiated.");
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // Parse commas into lists for hobbies, interests, facts
    const parsedHobbies = registerForm.hobbies.split(",").map(item => item.trim());
    const parsedInterests = registerForm.special_interests.split(",").map(item => item.trim());
    const parsedFacts = registerForm.interesting_facts.split(",").map(item => item.trim());

    const freshUser = {
      ...registerForm,
      hobbies: parsedHobbies,
      special_interests: parsedInterests,
      interesting_facts: parsedFacts,
      profile_mode: registerForm.account_type,
      managed_by: registerForm.account_type === 'parent' ? 'Father - Rajesh Malhotra' : ''
    };

    setCurrentUser(freshUser);
    setOnboardingForm(freshUser);
    setIsLoggedIn(true);
    showToast("🎉 Matrimonial Profile Created Successfully! Welcome to PureVows AI.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-slate-950 to-pink-950/20 text-slate-100 flex flex-col font-sans selection:bg-pink-700 selection:text-white relative overflow-x-hidden">

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
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-5">
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
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Trusted AI Matrimonial Marketplace
            </span>
          </div>
        </div>

        {isLoggedIn ? (
          <>
            {/* Multi-generational workspace profile selector */}
            <div className="flex flex-wrap items-center gap-2.5 bg-slate-900/90 p-2 rounded-2xl border border-white/10 shadow-lg">
              <span className="text-xs font-extrabold text-slate-400 px-2.5 uppercase tracking-wider">Account Context:</span>
              <button
                onClick={() => handleRoleChange("self")}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all duration-200 ${
                  currentUser.account_type === 'self'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md shadow-pink-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                👤 Self-Managed
              </button>
              <button
                onClick={() => handleRoleChange("parent")}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all duration-200 ${
                  currentUser.account_type === 'parent'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md shadow-pink-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                👨‍👩‍👧 Parent-Managed
              </button>
              <button
                onClick={() => handleRoleChange("joint")}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all duration-200 ${
                  currentUser.account_type === 'joint'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md shadow-pink-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                👥 Jointly-Managed
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
                {isAdminOpen ? "Close Safety Dashboard" : "Safety/Admin Panel"}
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
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

          {/* LEFT COLUMN: LOGGED IN PROFILE & TRUST VERIFICATION WIZARD */}
          <section className="lg:col-span-4 flex flex-col gap-8 animate-fadeIn">

            {/* USER PROFILE CARD */}
            <div className="bg-slate-900/75 border border-white/10 rounded-3xl shadow-xl overflow-hidden p-6 md:p-8 relative backdrop-blur-md">

              {/* Top Badge: Mode */}
              <div className="absolute top-6 right-6 flex flex-col gap-1.5 items-end">
                <span className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full ${
                  currentUser.profile_mode === 'joint'
                    ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                    : currentUser.profile_mode === 'parent'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'bg-pink-500/10 text-pink-300 border border-pink-500/20'
                }`}>
                  {currentUser.profile_mode === 'joint' ? "👥 Joint Profile" : currentUser.profile_mode === 'parent' ? "👨‍👩‍👧 Parent Managed" : "👤 Self Managed"}
                </span>
                {currentUser.managed_by && (
                  <span className="text-xs text-slate-400 font-semibold italic">
                    By {currentUser.managed_by}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-5 mb-6 mt-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center border-2 border-white/10 text-white font-black text-3xl shadow-lg shrink-0">
                  {currentUser.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white">{currentUser.name}</h3>
                  <p className="text-sm text-slate-300 font-medium mt-0.5">{currentUser.age} yrs • {currentUser.height} • {currentUser.location}</p>

                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    {currentUser.is_verified_identity ? (
                      <span className="text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified
                      </span>
                    ) : (
                      <span className="text-[11px] bg-white/5 text-slate-400 border border-white/5 font-extrabold px-2.5 py-0.5 rounded-full">
                        ID Unverified
                      </span>
                    )}
                    {currentUser.is_verified_photo ? (
                      <span className="text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Photo Verified
                      </span>
                    ) : (
                      <span className="text-[11px] bg-white/5 text-slate-400 border border-white/5 font-extrabold px-2.5 py-0.5 rounded-full">
                        Photo Unverified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Habits & Customization info */}
              <div className="bg-slate-950/60 p-4.5 rounded-2xl border border-white/5 space-y-3.5 mb-6">
                <div className="grid grid-cols-3 gap-2 border-b border-white/5 pb-3">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-black block">Smoking</span>
                    <span className="text-xs font-extrabold text-slate-200">{currentUser.smoking_status || "No"}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-black block">Drinking</span>
                    <span className="text-xs font-extrabold text-slate-200">{currentUser.drinking_status || "No"}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-black block">Weed</span>
                    <span className="text-xs font-extrabold text-slate-200">{currentUser.weed_status || "No"}</span>
                  </div>
                </div>

                {/* Hobbies / Interests / Facts Rendering */}
                {currentUser.hobbies && currentUser.hobbies.length > 0 && (
                  <div>
                    <span className="text-[10px] text-pink-400 font-extrabold block uppercase tracking-wider mb-1">Hobbies</span>
                    <div className="flex flex-wrap gap-1">
                      {currentUser.hobbies.map((h, i) => (
                        <span key={i} className="text-[11px] bg-slate-900 px-2 py-0.5 rounded-md border border-white/5 text-slate-300">{h}</span>
                      ))}
                    </div>
                  </div>
                )}

                {currentUser.special_interests && currentUser.special_interests.length > 0 && (
                  <div>
                    <span className="text-[10px] text-amber-400 font-extrabold block uppercase tracking-wider mb-1">Interesting Facts & Specialties</span>
                    <div className="flex flex-wrap gap-1">
                      {currentUser.special_interests.map((int, i) => (
                        <span key={i} className="text-[11px] bg-slate-900 px-2 py-0.5 rounded-md border border-white/5 text-slate-300">{int}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-white/5 text-sm mb-6 leading-relaxed">
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider mb-0.5">Religion/Caste</span>
                    <span className="font-bold text-white">{currentUser.religion} ({currentUser.community})</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider mb-0.5">Mother Tongue</span>
                    <span className="font-bold text-white">{currentUser.mother_tongue}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider mb-0.5">Profession</span>
                    <span className="font-bold text-white">{currentUser.profession}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider mb-0.5">Private Income</span>
                    <span className="font-bold text-pink-400">{currentUser.income_range}</span>
                  </div>
                </div>
                <div className="pt-3.5 border-t border-white/5">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">About Me:</span>
                  <p className="text-slate-300 italic leading-relaxed">"{currentUser.about_me}"</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setOnboardingForm({ ...currentUser });
                    setOnboardingStep(1);
                    setIsOnboardingOpen(true);
                  }}
                  className="w-full bg-white text-slate-950 hover:bg-slate-200 text-sm font-extrabold py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 shadow-md"
                >
                  <Settings className="w-4.5 h-4.5" />
                  Edit Profile (Progressive Flow)
                </button>

                {!currentUser.is_verified_identity && (
                  <button
                    onClick={triggerVerification}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white text-sm font-extrabold py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 shadow-lg shadow-pink-900/30"
                  >
                    <ShieldCheck className="w-4.5 h-4.5" />
                    Verify Identity & Photo Now
                  </button>
                )}
              </div>
            </div>

            {/* PARENT DASHBOARD & INVITATION SYSTEM */}
            {currentUser.account_type === 'parent' && (
              <div className="bg-gradient-to-br from-amber-950/20 to-orange-950/10 rounded-3xl border border-amber-900/30 p-6 md:p-8 shadow-xl backdrop-blur-md">
                <h4 className="text-base font-black text-amber-200 flex items-center gap-2 mb-3">
                  <Users className="text-amber-400 w-5 h-5" />
                  Parent & Family Dashboard
                </h4>
                <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                  As a parent, you can create a profile for your son/daughter and configure preferences. To co-manage seamlessly and avoid split accounts, send them a digital invitation.
                </p>

                {parentInviteStatus === 'idle' ? (
                  <form onSubmit={handleParentInvite} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">
                        Son / Daughter's Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. child@email.com"
                        value={parentInviteInput}
                        onChange={(e) => setParentInviteInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-sm text-white focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder:text-slate-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-extrabold py-3 px-5 rounded-xl transition-all duration-150 shadow-md"
                    >
                      Send Co-Management Invite
                    </button>
                  </form>
                ) : parentInviteStatus === 'invited' ? (
                  <div className="bg-amber-950/30 p-4 rounded-2xl border border-amber-500/20 text-sm">
                    <div className="flex items-center gap-2 text-amber-300 font-extrabold mb-1.5">
                      <Clock className="w-4.5 h-4.5 animate-spin" />
                      Invite Pending Acceptance...
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      We emailed your child at <strong className="text-slate-100">{parentInviteInput}</strong>. They are reviewing the invitation to take ownership or co-manage.
                    </p>
                  </div>
                ) : (
                  <div className="bg-emerald-950/20 p-5 rounded-2xl border border-emerald-500/20 text-sm">
                    <div className="flex items-center gap-2 text-emerald-300 font-extrabold mb-1.5">
                      <CheckSquare className="w-5 h-5 text-emerald-400" />
                      Invite Accepted!
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs mb-4">
                      Your child has approved the request. Both of you are now in <strong>Joint Management Mode</strong>.
                    </p>
                    <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-white/5">
                      <span className="font-semibold text-slate-300 text-xs">Allow Child to Co-Manage</span>
                      <button
                        onClick={() => setCoManageToggle(!coManageToggle)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          coManageToggle ? 'bg-emerald-500' : 'bg-white/10'
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          coManageToggle ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DYNAMIC TRUST VERIFICATION POPUP/STEPPER */}
            {verifyStep !== "idle" && (
              <div className="bg-slate-900 border-2 border-pink-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative animate-fadeIn">
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
            )}

            {/* EXPLAINABLE CLASSIFIED PREFERENCE DASHBOARD */}
            <div className="bg-slate-900/75 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md">
              <h4 className="text-base font-black text-white flex items-center gap-2 mb-4">
                <Settings className="text-pink-500 w-5 h-5" />
                Your Classified Match Criteria
              </h4>

              <div className="space-y-4">
                {/* MUST HAVES */}
                <div className="bg-rose-950/20 p-4 rounded-2xl border border-rose-500/20">
                  <span className="text-xs font-black text-rose-300 uppercase tracking-widest block mb-2.5">
                    📌 Must Have (Hard Filters)
                  </span>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckSquare className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Age Range: <strong className="font-bold text-white">{preferences.must_age_min} to {preferences.must_age_max}</strong></span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckSquare className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Target Gender: <strong className="font-bold text-white">{preferences.must_genders.join(", ")}</strong></span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckSquare className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Locations: <strong className="font-bold text-white">{preferences.must_locations.join(", ")}</strong></span>
                    </li>
                  </ul>
                </div>

                {/* PREFERS */}
                <div className="bg-blue-950/20 p-4 rounded-2xl border border-blue-500/20">
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

                {/* DEAL BREAKERS */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-white/10">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-widest block mb-2.5">
                    🚫 Deal Breakers (Instant Exclusions)
                  </span>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center justify-between">
                      <span>Non-Smoker Only</span>
                      <span className="text-xs bg-slate-100 text-slate-950 px-2.5 py-0.5 rounded-full font-black">YES</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Already Married</span>
                      <span className="text-xs bg-slate-100 text-slate-950 px-2.5 py-0.5 rounded-full font-black">NO WAY</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* MIDDLE COLUMN: DISCOVER & AI RECOMMENDATION FEED */}
          <section className="lg:col-span-5 flex flex-col gap-8 animate-fadeIn">

            {/* ASK AI SEARCH FORM */}
            <div className="bg-slate-900/75 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/10 rounded-full blur-3xl -z-10"></div>

              <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2 mb-2">
                <Zap className="text-pink-400 w-5 h-5 fill-pink-500/20" />
                "Ask AI" Intuitive Match Search
              </h3>
              <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                Describe what you seek in normal conversational language. Our validator will translate it to a secure search schema safely.
              </p>

              <form onSubmit={handleAiSearch} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g., Find someone who is 26-30, based in Bangalore, vegetarian and family-oriented"
                    value={nlQuery}
                    onChange={(e) => setNlQuery(e.target.value)}
                    className="w-full pl-5 pr-14 py-4 rounded-2xl bg-slate-950/80 border border-white/10 text-sm text-white focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-150 placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 top-2.5 p-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-all duration-150"
                  >
                    {isAiSearching ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* DEMONSTRATION OF SECURE PARSING SCHEMA */}
                {parsedSchema && (
                  <div className="bg-slate-950 border border-white/10 text-slate-100 p-5 rounded-2xl text-xs space-y-3 font-mono relative animate-fadeIn">
                    <div className="flex justify-between items-center text-xs text-pink-400 font-extrabold border-b border-white/5 pb-2">
                      <span>✓ SAFE LLM VALIDATED SEARCH SCHEMA</span>
                      <button
                        type="button"
                        onClick={() => {
                          setParsedSchema(null);
                          setNlQuery("");
                        }}
                        className="text-slate-400 hover:text-white"
                      >
                        Clear Filter
                      </button>
                    </div>
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed text-slate-200">
                      {JSON.stringify(parsedSchema, null, 2)}
                    </pre>
                    <p className="text-[11px] text-slate-400 italic leading-relaxed">
                      The structured JSON above strictly bounds the SQL generation layer, preventing malicious database query injection.
                    </p>
                  </div>
                )}
              </form>
            </div>

            {/* AI-FIRST RECOMMENDED MATCHES FEED */}
            <div className="space-y-5">
              <div className="flex justify-between items-center px-1">
                <h4 className="text-base md:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Compass className="text-pink-400 w-5 h-5" />
                  AI-Driven Matches ({rankedMatches.length})
                </h4>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sorted by Mutual Compatibility</span>
              </div>

              {rankedMatches.length === 0 ? (
                <div className="bg-slate-900/50 p-14 text-center rounded-3xl border border-dashed border-white/10">
                  <HelpCircle className="w-14 h-14 text-slate-500 mx-auto mb-4" />
                  <h5 className="font-extrabold text-white text-base">No compatible matches found</h5>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                    Try broadening your "Ask AI" search parameters or modifying your match constraints.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {rankedMatches.map((profile) => {
                    const isLikedByMe = likes[profile.id] === 'accepted';
                    const hasPhotoAccess = !profile.photos[1] || photoRequestStatus[profile.id] === 'approved';

                    return (
                      <div
                        key={profile.id}
                        className="bg-slate-900/75 border border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-pink-500/20 transition-all duration-300 relative group backdrop-blur-md"
                      >
                        {/* Compatibility Badge with soft pulse glow */}
                        <div className="absolute top-5 right-5 bg-slate-950/90 text-white backdrop-blur-xl border border-white/10 py-2 px-4 rounded-full flex items-center gap-2 z-10 shadow-lg">
                          <Heart className="w-4 h-4 fill-pink-500 text-pink-500 animate-pulse" />
                          <span className="font-black text-xs md:text-sm tracking-wide">{profile.matchScore}% Compatibility</span>
                        </div>

                        {/* Main picture area with gradient overlay */}
                        <div className="relative h-64 bg-slate-950">
                          <img
                            src={profile.photos[0].url}
                            alt={profile.name}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

                          {/* Basic Overlay Info */}
                          <div className="absolute bottom-5 left-5 right-5">
                            <h4 className="text-xl md:text-2xl font-black flex items-center gap-2 text-white">
                              {profile.name}
                              {profile.is_verified_identity && (
                                <ShieldCheck className="w-5 h-5 text-emerald-400 fill-emerald-400/20 shrink-0" />
                              )}
                            </h4>
                            <p className="text-sm text-slate-200 font-bold mt-1">
                              {profile.age} yrs • {profile.height} • {profile.profession}
                            </p>
                          </div>
                        </div>

                        {/* EXPLAINABLE AI SCORE CARD */}
                        <div className="p-6 md:p-8 space-y-5">
                          <div className="bg-pink-950/20 p-4.5 rounded-2xl border border-pink-500/20">
                            <span className="text-xs font-black text-pink-300 uppercase tracking-widest block mb-2.5">
                              💡 Why We Recommend This Match
                            </span>
                            <div className="grid grid-cols-1 gap-1.5">
                              {profile.explainableReasons.map((reason, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-slate-200 text-xs md:text-sm font-semibold">
                                  <Check className="w-4 h-4 text-pink-400 stroke-[3.5] shrink-0" />
                                  <span>{reason}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Summary */}
                          <p className="text-slate-300 text-sm italic leading-relaxed">
                            "{profile.about_me}"
                          </p>

                          {/* Private Album Section */}
                          {profile.photos[1] && (
                            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-3 text-sm">
                              <div className="flex items-center gap-2 text-slate-200 font-bold">
                                <Lock className="w-4.5 h-4.5 text-slate-400" />
                                <span>Private Photo Album 🔒</span>
                              </div>

                              {photoRequestStatus[profile.id] === 'approved' ? (
                                <button
                                  onClick={() => {
                                    setIsPhotoVisibleMap(prev => ({ ...prev, [profile.id]: !prev[profile.id] }));
                                    showToast("Viewing secure private photo.");
                                  }}
                                  className="bg-white text-slate-950 hover:bg-slate-200 font-black py-1.5 px-4 rounded-lg text-xs"
                                >
                                  {isPhotoVisibleMap[profile.id] ? "Hide Photo" : "View Photo"}
                                </button>
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
                          )}

                          {/* Private Photo Render */}
                          {isPhotoVisibleMap[profile.id] && photoRequestStatus[profile.id] === 'approved' && profile.photos[1] && (
                            <div className="border border-white/10 rounded-2xl overflow-hidden shadow-inner p-2 bg-slate-950 relative">
                              <span className="absolute top-5 left-5 bg-slate-950/90 border border-white/10 text-white font-black text-xs uppercase px-3 py-1 rounded-full">
                                Authorized Private Image
                              </span>
                              <img
                                src={profile.photos[1].url}
                                alt="Private Album"
                                className="w-full h-52 object-cover rounded-xl"
                              />
                            </div>
                          )}

                          {/* ACTIONS FOOTER */}
                          <div className="flex gap-3 pt-3">
                            <button
                              onClick={() => setSelectedProfile(profile)}
                              className="flex-1 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs md:text-sm font-extrabold py-3 px-4 rounded-xl transition-all duration-150"
                            >
                              Full Profile Details
                            </button>

                            <button
                              onClick={() => handleLike(profile.id, profile.name)}
                              disabled={isLikedByMe}
                              className={`flex-1 text-xs md:text-sm font-extrabold py-3 px-4 rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 ${
                                isLikedByMe
                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                                  : 'bg-pink-600 text-white hover:bg-pink-700 shadow-lg shadow-pink-900/30'
                              }`}
                            >
                              <Heart className={`w-4.5 h-4.5 ${isLikedByMe ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                              {isLikedByMe ? "Matched & Connected" : "Express Interest"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* RIGHT COLUMN: CHAT HUB & SPAM BLOCK SYSTEM */}
          <section className="lg:col-span-3 flex flex-col gap-8 animate-fadeIn">
            <div className="bg-slate-900/75 border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[650px] backdrop-blur-md shadow-2xl">

              {/* Header */}
              <div className="bg-slate-950 p-5 flex items-center justify-between shrink-0 border-b border-white/5">
                <h3 className="font-extrabold text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 text-white">
                  <MessageCircle className="w-5 h-5 text-pink-400" />
                  Matrimonial Chat Hub
                </h3>
                <span className="text-[10px] bg-pink-600 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Strict Acceptance
                </span>
              </div>

              {/* Chat List Selection (only show mutual matches) */}
              <div className="bg-slate-950/40 p-4 border-b border-white/5 shrink-0">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">ACTIVE MUTUAL CONNECTIONS</span>
                <div className="flex gap-2.5 overflow-x-auto">
                  {profiles.filter(p => likes[p.id] === 'accepted').map(partner => (
                    <button
                      key={partner.id}
                      onClick={() => setActiveChatId(partner.id)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl transition-all border text-left shrink-0 ${
                        activeChatId === partner.id
                          ? 'bg-slate-850 border-pink-500/40 shadow-md font-extrabold text-white'
                          : 'border-transparent text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden relative shrink-0">
                        <img src={partner.photos[0].url} alt={partner.name} className="object-cover w-full h-full" />
                      </div>
                      <span className="text-xs md:text-sm">{partner.name.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages Body */}
              {activeChatId ? (
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950/20 flex flex-col justify-end">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm shadow-md leading-relaxed ${
                        msg.sender === 'You'
                          ? 'bg-slate-100 text-slate-950 ml-auto rounded-tr-none'
                          : 'bg-slate-800 text-slate-100 rounded-tl-none border border-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-3 mb-1.5">
                        <span className="font-extrabold text-xs">{msg.sender}</span>
                        <span className="text-[10px] opacity-60 font-semibold">{msg.time}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {msg.flagged && (
                        <span className="text-[10px] text-yellow-300 font-bold bg-slate-950 border border-yellow-500/20 px-2.5 py-1 rounded-full block mt-2 text-center">
                          ⚠️ SYSTEM FLAG: Financial Terms Detected
                        </span>
                      )}
                    </div>
                  ))}

                  {spamAlert && (
                    <div className="bg-rose-950/50 border-2 border-rose-800/40 rounded-2xl p-4 text-rose-200 text-xs md:text-sm font-semibold flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <p>{spamAlert}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <Heart className="w-12 h-12 text-pink-500/20 mb-3" />
                  <h5 className="font-bold text-white text-sm">No active chat selected</h5>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">Match with a candidate first to begin secure messaging.</p>
                </div>
              )}

              {/* Chat Footer Input */}
              {activeChatId && (
                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-slate-950 flex gap-2.5 shrink-0">
                  <input
                    type="text"
                    placeholder="Type a secure message..."
                    value={currentMessageInput}
                    onChange={(e) => setCurrentMessageInput(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-xs md:text-sm text-white focus:ring-1 focus:ring-pink-500 focus:outline-none placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-xl transition-all duration-150 shrink-0"
                  >
                    <Send className="w-4.5 h-4.5" />
                  </button>
                </form>
              )}
            </div>
          </section>
        </main>
      )}

      {/* FULL PROFILE DETAIL MODAL */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 relative animate-fadeIn">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-6 right-6 bg-white/5 text-slate-300 hover:text-white p-2 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="w-full md:w-1/3">
                <img
                  src={selectedProfile.photos[0].url}
                  alt={selectedProfile.name}
                  className="w-full h-56 object-cover rounded-2xl shadow-md"
                />
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="text-xs bg-white/5 text-slate-300 border border-white/5 font-extrabold px-3 py-1 rounded-full">
                    {selectedProfile.gender}
                  </span>
                  <span className="text-xs bg-white/5 text-slate-300 border border-white/5 font-extrabold px-3 py-1 rounded-full">
                    {selectedProfile.marital_status}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                    {selectedProfile.name}
                    {selectedProfile.is_verified_identity && (
                      <ShieldCheck className="w-6 h-6 text-emerald-400 fill-emerald-400/10" />
                    )}
                  </h3>
                  <p className="text-sm md:text-base text-slate-300 font-semibold mt-1">{selectedProfile.location} • {selectedProfile.age} yrs • {selectedProfile.height}</p>
                </div>

                <div className="grid grid-cols-2 gap-3.5 text-sm">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider mb-0.5">Income Level</span>
                    <span className="font-extrabold text-pink-400 text-sm">{selectedProfile.income_range}</span>
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider mb-0.5">Education</span>
                    <span className="font-extrabold text-white text-sm">{selectedProfile.education_level}</span>
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider mb-0.5">Profession</span>
                    <span className="font-extrabold text-white text-sm">{selectedProfile.profession}</span>
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider mb-0.5">Religion / Caste</span>
                    <span className="font-extrabold text-white text-sm">{selectedProfile.religion} ({selectedProfile.community})</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5 border-t border-white/5 pt-5 text-sm leading-relaxed text-left">
              <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-white/5 mb-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-black block">Smoking Habit</span>
                  <span className="text-xs font-extrabold text-slate-200">{selectedProfile.smoking_status || "No"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-black block">Alcohol Habit</span>
                  <span className="text-xs font-extrabold text-slate-200">{selectedProfile.drinking_status || "No"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-black block">Weed Habit</span>
                  <span className="text-xs font-extrabold text-slate-200">{selectedProfile.weed_status || "No"}</span>
                </div>
              </div>

              {selectedProfile.hobbies && selectedProfile.hobbies.length > 0 && (
                <div>
                  <h5 className="font-black text-white text-xs uppercase tracking-widest mb-1.5 text-pink-400">Hobbies</h5>
                  <div className="flex flex-wrap gap-1">
                    {selectedProfile.hobbies.map((h, i) => (
                      <span key={i} className="text-[11px] bg-slate-950 px-2.5 py-1 rounded-md border border-white/5 text-slate-300">{h}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProfile.special_interests && selectedProfile.special_interests.length > 0 && (
                <div>
                  <h5 className="font-black text-white text-xs uppercase tracking-widest mb-1.5 text-amber-300">Special Interests</h5>
                  <div className="flex flex-wrap gap-1">
                    {selectedProfile.special_interests.map((int, i) => (
                      <span key={i} className="text-[11px] bg-slate-950 px-2.5 py-1 rounded-md border border-white/5 text-slate-300">{int}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProfile.interesting_facts && selectedProfile.interesting_facts.length > 0 && (
                <div>
                  <h5 className="font-black text-white text-xs uppercase tracking-widest mb-1.5 text-pink-400">Interesting Facts</h5>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 bg-slate-950/60 p-3 rounded-xl border border-white/5">
                    {selectedProfile.interesting_facts.map((fact, i) => (
                      <li key={i}>{fact}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h5 className="font-black text-white text-xs uppercase tracking-widest mb-1.5 text-pink-400">About Me</h5>
                <p className="text-slate-200 italic">"{selectedProfile.about_me}"</p>
              </div>

              <div>
                <h5 className="font-black text-white text-xs uppercase tracking-widest mb-1.5 text-pink-400">Partner Expectations</h5>
                <p className="text-slate-200">"{selectedProfile.partner_expectations}"</p>
              </div>

              <div className="grid grid-cols-2 gap-5 pt-2">
                <div>
                  <h5 className="font-black text-white text-xs uppercase tracking-widest mb-1.5 text-amber-300">Lifestyle Summary</h5>
                  <p className="text-slate-300">{selectedProfile.lifestyle}</p>
                </div>
                <div>
                  <h5 className="font-black text-white text-xs uppercase tracking-widest mb-1.5 text-amber-300">Family Expectations</h5>
                  <p className="text-slate-300">{selectedProfile.family_expectations}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-5 border-t border-white/5">
                <button
                  onClick={() => {
                    handleLike(selectedProfile.id, selectedProfile.name);
                    setSelectedProfile(null);
                  }}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-sm font-extrabold py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  Connect With {selectedProfile.name}
                </button>
                <button
                  onClick={() => {
                    setReports(prev => [
                      ...prev,
                      {
                        id: Date.now(),
                        reporter: "You",
                        reported: selectedProfile.name,
                        reason: "Flagged profile content as potentially suspicious.",
                        status: "pending",
                        date: "Just now"
                      }
                    ]);
                    showToast(`⚠️ You have flagged and reported ${selectedProfile.name}'s profile. Safety team will investigate.`);
                    setSelectedProfile(null);
                  }}
                  className="bg-white/5 hover:bg-white/10 text-rose-400 border border-rose-500/20 text-sm font-bold py-3.5 px-5 rounded-xl"
                >
                  Report Safety Violation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROGRESSIVE ONBOARDING SETUP FORM POPUP */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl p-6 md:p-8 relative animate-fadeIn">

            <button
              type="button"
              onClick={() => setIsOnboardingOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Stepper Status Indicators */}
            <div className="flex justify-between items-center mb-6 mt-2">
              <span className="text-xs font-black bg-pink-500/10 text-pink-300 px-3.5 py-1.5 rounded-full border border-pink-500/20 uppercase tracking-wider">
                Progressive Registration (Step {onboardingStep} of 6)
              </span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div
                    key={num}
                    className={`h-2.5 w-6 rounded-full transition-all duration-300 ${
                      onboardingStep >= num ? 'bg-pink-500 shadow-md shadow-pink-900/30' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleOnboardingSubmit} className="space-y-5 text-left">

              {/* STEP 1: ACCOUNT TYPE */}
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
                        className={`p-4.5 border rounded-xl text-center font-extrabold text-sm capitalize transition-all duration-150 ${
                          onboardingForm.account_type === type
                            ? 'bg-pink-600/20 border-pink-500 text-pink-300 ring-2 ring-pink-500/30'
                            : 'border-white/10 hover:border-white/20 text-slate-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 mt-5">
                    <label className="block text-xs uppercase font-bold text-slate-400 mb-1 tracking-wider">Mobile Number for OTP onboarding</label>
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full px-4 py-3 bg-slate-950/85 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: BASIC INFORMATION */}
              {onboardingStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="font-black text-white text-base">Step 2: Core Details</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Name</label>
                      <input
                        type="text"
                        required
                        value={onboardingForm.name}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-950/85 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Gender</label>
                      <select
                        value={onboardingForm.gender}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-950/85 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-pink-500"
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Location</label>
                      <input
                        type="text"
                        required
                        value={onboardingForm.location}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-950/85 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Date of Birth</label>
                      <input
                        type="date"
                        required
                        value={onboardingForm.date_of_birth}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, date_of_birth: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-950/85 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: EDUCATION & CAREER */}
              {onboardingStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="font-black text-white text-base">Step 3: Education & Career</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Highest Degree</label>
                      <input
                        type="text"
                        required
                        value={onboardingForm.education_level}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, education_level: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-950/85 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Profession</label>
                      <input
                        type="text"
                        required
                        value={onboardingForm.profession}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, profession: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-950/85 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Current Salary Range (shown as abstract range for privacy)</label>
                    <select
                      value={onboardingForm.income_range}
                      onChange={(e) => setOnboardingForm(prev => ({ ...prev, income_range: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-950/85 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-pink-500"
                    >
                      <option>₹10–15 LPA</option>
                      <option>₹15–20 LPA</option>
                      <option>₹20–25 LPA</option>
                      <option>₹25–30 LPA</option>
                      <option>₹30–40 LPA</option>
                      <option>₹40 LPA+</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 4: FAMILY EXPECTATIONS */}
              {onboardingStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="font-black text-white text-base">Step 4: Family Details</h4>

                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Religion</label>
                    <input
                      type="text"
                      required
                      value={onboardingForm.religion}
                      onChange={(e) => setOnboardingForm(prev => ({ ...prev, religion: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-950/85 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Mother Tongue</label>
                    <input
                      type="text"
                      required
                      value={onboardingForm.mother_tongue}
                      onChange={(e) => setOnboardingForm(prev => ({ ...prev, mother_tongue: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-950/85 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: LIFESTYLE & PERSONAL FREE-TEXT */}
              {onboardingStep === 5 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="font-black text-white text-base">Step 5: Lifestyle & Expectations</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Food Preference</label>
                      <select
                        value={onboardingForm.food_preference}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, food_preference: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-950/85 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-pink-500"
                      >
                        <option>Vegetarian</option>
                        <option>Non-Vegetarian</option>
                        <option>Eggetarian</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Smoking Habit</label>
                      <select
                        value={onboardingForm.smoking_status}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, smoking_status: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-950/85 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-pink-500"
                      >
                        <option>No</option>
                        <option>Yes</option>
                        <option>Occasionally</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Drinking Habit</label>
                      <select
                        value={onboardingForm.drinking_status}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, drinking_status: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-950/85 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-pink-500"
                      >
                        <option>No</option>
                        <option>Yes</option>
                        <option>Occasionally</option>
                        <option>Socially</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Weed Habit</label>
                      <select
                        value={onboardingForm.weed_status}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, weed_status: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-950/85 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-pink-500"
                      >
                        <option>No</option>
                        <option>Yes</option>
                        <option>Occasionally</option>
                      </select>
                    </div>
                  </div>

                  {/* Rich text hobbies inputs for progressive editing */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Hobbies (comma separated)</label>
                      <input
                        type="text"
                        value={Array.isArray(onboardingForm.hobbies) ? onboardingForm.hobbies.join(", ") : onboardingForm.hobbies}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, hobbies: e.target.value.split(",").map(i => i.trim()) }))}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Special Interests</label>
                      <input
                        type="text"
                        value={Array.isArray(onboardingForm.special_interests) ? onboardingForm.special_interests.join(", ") : onboardingForm.special_interests}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, special_interests: e.target.value.split(",").map(i => i.trim()) }))}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">About Me (used for Semantic Matching)</label>
                    <textarea
                      rows={3}
                      value={onboardingForm.about_me}
                      onChange={(e) => setOnboardingForm(prev => ({ ...prev, about_me: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-950/85 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 6: VERIFICATION PRE-APPROVALS */}
              {onboardingStep === 6 && (
                <div className="space-y-5 animate-fadeIn">
                  <h4 className="font-black text-white text-base">Step 6: Confirm Photos & Finalize</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    You can start using PureVows AI right away! Would you like to pre-approve safety terms and finalize your account profile?
                  </p>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-white/10 text-sm space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer text-slate-200">
                      <input type="checkbox" defaultChecked className="mt-1 accent-pink-500" />
                      <span>Accept digital personal data verification guidelines (DPDP Act 2023)</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer text-slate-200">
                      <input type="checkbox" defaultChecked className="mt-1 accent-pink-500" />
                      <span>Allow matches to see my public photos directly</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Stepper Footer Controls */}
              <div className="flex justify-between pt-5 border-t border-white/5 mt-6">
                <button
                  type="button"
                  onClick={handlePrevOnboardingStep}
                  disabled={onboardingStep === 1}
                  className="px-5 py-2 text-sm font-extrabold text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                >
                  Previous
                </button>

                {onboardingStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNextOnboardingStep}
                    className="bg-white hover:bg-slate-200 text-slate-950 text-xs md:text-sm font-extrabold py-2.5 px-5 rounded-xl transition-all duration-150"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700 text-white text-xs md:text-sm font-extrabold py-2.5 px-6 rounded-xl shadow-lg shadow-pink-900/20"
                  >
                    Finish and Save Profile
                  </button>
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
          <div className="flex flex-wrap gap-5">
            <span className="hover:text-white cursor-pointer transition-colors font-semibold">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors font-semibold">DPDP Compliance</span>
            <span className="hover:text-white cursor-pointer transition-colors font-semibold">Security Audits</span>
            <span className="hover:text-white cursor-pointer transition-colors font-semibold">Support</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
