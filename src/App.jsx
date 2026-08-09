import React, { useState, useEffect } from 'react';
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
  HelpCircle,
  Lock,
  Info,
  Award,
  Ban,
  Eye,
  CheckSquare,
  X,
  Share2,
  Zap,
  ShieldAlert,
  Clock,
  LockKeyhole
} from 'lucide-react';
import { seedProfiles, calculateHybridScore, parseNaturalLanguageQuery } from './profilesData';

export default function App() {
  // --- STATE ---
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
    hobbies: ["Photography", "Cooking", "Yoga"],
    about_me: "I'm a software design professional who enjoys travelling, exploring new places and spending quality time with family. I value career progress as well as deep personal integrity.",
    partner_expectations: "Looking for a career-oriented, vegetarian professional based in Bangalore, with a family-first mindset and open communication.",
    account_type: "self", // self, parent, family
    profile_mode: "self", // self, parent, joint
    managed_by: "",
    is_verified_identity: false,
    is_verified_photo: false,
  });

  // Onboarding step (1 to 6)
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
    // Pre-seed a mutual match with Priya Nair (ID: 1) for immediate interactive chatting!
    1: 'accepted',
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
      // Exclude banned profiles
      if (bannedProfileIds.includes(profile.id)) return false;

      // Layer 1: Hard Filters (Eliminate profiles that fail Must Haves)
      // Filter by opposite gender (or matching user target)
      if (currentUser.gender === "Male" && profile.gender !== "Female") return false;
      if (currentUser.gender === "Female" && profile.gender !== "Male") return false;

      // Filter by specified age range from preferences
      if (profile.age < preferences.must_age_min || profile.age > preferences.must_age_max) return false;

      // Apply Parsed AI filters if present
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
      // Layer 2: Preference score & Layer 3: Semantic explanations
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
      [profileId]: 'accepted' // Automatically make it mutual for beautiful UX testing
    }));

    // Add introductory greeting
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

    // Simulate auto-approval after 3 seconds
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
      // Add report automatically to demonstrate automated fraud detection
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
      // Simulate matching partner replying after 1.5 seconds
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

    // Simulate Face similarity match and Aadhaar verification
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

    // Auto accept after 3 seconds
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-pink-200">

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white py-3 px-5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <Zap className="text-yellow-400 w-5 h-5" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-pink-500 to-rose-500 p-2.5 rounded-2xl text-white shadow-md shadow-pink-100">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
              WeddingBells
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-2 bg-slate-100 px-2 py-0.5 rounded-full">
              AI-First Matrimony
            </span>
          </div>
        </div>

        {/* Multi-generational workspace profile selector */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 px-2">Account Context:</span>
          <button
            onClick={() => handleRoleChange("self")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentUser.account_type === 'self'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👤 Self-Managed
          </button>
          <button
            onClick={() => handleRoleChange("parent")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentUser.account_type === 'parent'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👨‍👩‍👧 Parent-Managed
          </button>
          <button
            onClick={() => handleRoleChange("joint")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentUser.account_type === 'joint'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👥 Jointly-Managed
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdminOpen(!isAdminOpen)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
              isAdminOpen
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 shadow-sm'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            {isAdminOpen ? "Close Admin Dashboard" : "Safety/Admin Panel"}
          </button>
        </div>
      </header>

      {/* ADMIN PANEL OVERLAY */}
      {isAdminOpen && (
        <div className="bg-red-50/70 border-b-2 border-red-200 p-6 shadow-inner transition-all animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="text-red-600 w-5 h-5" />
                Trust & Safety Admin Moderation Center
              </h2>
              <span className="text-xs bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-full">
                Active Session Logs & Fraud Scanners
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">Total Active Profiles</span>
                <span className="text-2xl font-black text-slate-800">{profiles.length + 1} Profiles</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">Identity Verified</span>
                <span className="text-2xl font-black text-emerald-600">80% Users</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">AI Photo Matches</span>
                <span className="text-2xl font-black text-blue-600">99.2% Accurate</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">System Alerts</span>
                <span className="text-2xl font-black text-rose-600">{reports.filter(r => r.status === 'pending').length} Action Needed</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-900 text-white px-4 py-3 text-xs font-bold tracking-wider uppercase">
                Active Reports and Spammer Flags Queue
              </div>
              <div className="divide-y divide-slate-100">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">Reporter: {report.reporter}</span>
                        <span className="text-slate-400">|</span>
                        <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full text-xs">Reported: {report.reported}</span>
                      </div>
                      <p className="text-slate-600 text-xs italic">Reason: "{report.reason}"</p>
                      <span className="text-xs text-slate-400 block mt-1">Logged: {report.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.status === "pending" ? (
                        <>
                          <button
                            onClick={() => {
                              const matchProf = profiles.find(p => p.name === report.reported);
                              if (matchProf) {
                                handleBanUser(matchProf.id, matchProf.name);
                              } else {
                                showToast(`Action taken against ${report.reported}.`);
                              }
                              handleResolveReport(report.id);
                            }}
                            className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-700"
                          >
                            Ban Accused Account
                          </button>
                          <button
                            onClick={() => handleResolveReport(report.id)}
                            className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-200"
                          >
                            Dismiss/Resolve
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Resolved & Safe
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

      {/* MAIN LAYOUT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: LOGGED IN PROFILE & TRUST VERIFICATION WIZARD */}
        <section className="lg:col-span-4 flex flex-col gap-6">

          {/* USER PROFILE CARD */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 relative">

            {/* Top Badge: Mode */}
            <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                currentUser.profile_mode === 'joint'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  : currentUser.profile_mode === 'parent'
                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                    : 'bg-pink-50 text-pink-700 border border-pink-100'
              }`}>
                {currentUser.profile_mode === 'joint' ? "👥 Joint Profile" : currentUser.profile_mode === 'parent' ? "👨‍👩‍👧 Parent Managed" : "👤 Self Managed"}
              </span>
              {currentUser.managed_by && (
                <span className="text-[10px] text-slate-400 font-medium italic">
                  By {currentUser.managed_by}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-4 mt-2">
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center border-2 border-pink-300 text-pink-600 font-bold text-2xl shadow-inner">
                {currentUser.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{currentUser.name}</h3>
                <p className="text-xs text-slate-500">{currentUser.age} yrs • {currentUser.height} • {currentUser.location}</p>

                <div className="flex items-center gap-2 mt-1.5">
                  {currentUser.is_verified_identity ? (
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified
                    </span>
                  ) : (
                    <span className="text-[11px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">
                      ID Unverified
                    </span>
                  )}
                  {currentUser.is_verified_photo ? (
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Photo Verified
                    </span>
                  ) : (
                    <span className="text-[11px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">
                      Photo Unverified
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs mb-4">
              <div className="grid grid-cols-2 gap-y-2">
                <div><span className="text-slate-400 block font-medium">Religion/Caste</span><span className="font-semibold text-slate-800">{currentUser.religion} ({currentUser.community})</span></div>
                <div><span className="text-slate-400 block font-medium">Mother Tongue</span><span className="font-semibold text-slate-800">{currentUser.mother_tongue}</span></div>
                <div><span className="text-slate-400 block font-medium">Profession</span><span className="font-semibold text-slate-800">{currentUser.profession}</span></div>
                <div><span className="text-slate-400 block font-medium">Private Income</span><span className="font-semibold text-pink-600">{currentUser.income_range}</span></div>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">About Me:</span>
                <p className="text-slate-600 italic line-clamp-2">"{currentUser.about_me}"</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setOnboardingForm({ ...currentUser });
                  setOnboardingStep(1);
                  setIsOnboardingOpen(true);
                }}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Settings className="w-4 h-4" />
                Edit Profile (Progressive Flow)
              </button>

              {!currentUser.is_verified_identity && (
                <button
                  onClick={triggerVerification}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white hover:from-pink-700 hover:to-rose-600 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-pink-100"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Verify Identity & Photo Now
                </button>
              )}
            </div>
          </div>

          {/* PARENT DASHBOARD & INVITATION SYSTEM */}
          {currentUser.account_type === 'parent' && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl border border-amber-100 p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                <Users className="text-amber-600 w-5 h-5" />
                Parent & Family Dashboard
              </h4>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                As a parent, you can create a profile for your son/daughter and configure preferences. To co-manage seamlessly and avoid split accounts, send them a digital invitation.
              </p>

              {parentInviteStatus === 'idle' ? (
                <form onSubmit={handleParentInvite} className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Son / Daughter's Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. child@email.com"
                      value={parentInviteInput}
                      onChange={(e) => setParentInviteInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-sm"
                  >
                    Send Co-Management Invite
                  </button>
                </form>
              ) : parentInviteStatus === 'invited' ? (
                <div className="bg-amber-100/60 p-3.5 rounded-xl border border-amber-200 text-xs">
                  <div className="flex items-center gap-2 text-amber-800 font-bold mb-1">
                    <Clock className="w-4 h-4 animate-spin" />
                    Invite Pending Acceptance...
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    We emailed your child at <strong className="text-slate-800">{parentInviteInput}</strong>. They are reviewing the invitation to take ownership or co-manage.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    Invite Accepted!
                  </div>
                  <p className="text-slate-600 text-[11px] mb-3">
                    Your child has approved the request. Both of you are now in <strong>Joint Management Mode</strong>.
                  </p>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-emerald-100">
                    <span className="font-semibold text-slate-700 text-[11px]">Allow Child to Co-Manage</span>
                    <button
                      onClick={() => setCoManageToggle(!coManageToggle)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        coManageToggle ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        coManageToggle ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DYNAMIC TRUST VERIFICATION POPUP/STEPPER */}
          {verifyStep !== "idle" && (
            <div className="bg-white rounded-2xl border-2 border-pink-100 p-6 shadow-md relative animate-fadeIn">
              <button
                onClick={() => setVerifyStep("idle")}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                <ShieldCheck className="text-pink-600 w-5 h-5" />
                Matrimonial Trust & Safety Verification
              </h4>

              {verifyStep === "choosing" && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Choose an official ID document. We use high-precision liveness detection to match your photo with your uploaded ID. Your ID document is <strong>never</strong> shown to matches.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Aadhaar Card", "PAN Card", "Passport", "Driving Licence"].map(doc => (
                      <button
                        key={doc}
                        onClick={() => {
                          setUploadedDocType(doc);
                          setVerifyStep("doc_upload");
                        }}
                        className="p-3 text-xs border border-slate-200 hover:border-pink-300 hover:bg-pink-50 rounded-xl text-center font-bold text-slate-700 transition-all"
                      >
                        {doc}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {verifyStep === "doc_upload" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-3 rounded-xl border text-xs text-slate-600 flex items-start gap-2">
                    <Info className="text-blue-500 w-4 h-4 shrink-0 mt-0.5" />
                    <span>Selected: <strong>{uploadedDocType}</strong>. Upload a clear picture of your ID card.</span>
                  </div>
                  <div className="border-2 border-dashed border-slate-200 hover:border-pink-300 rounded-xl p-6 text-center transition-all cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDocUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700 block">Click to Upload Document Photo</span>
                    <span className="text-[10px] text-slate-400">Supports JPG, PNG up to 5MB</span>
                  </div>
                  <div className="flex justify-between">
                    <button onClick={() => setVerifyStep("choosing")} className="text-xs text-slate-500 hover:underline">Back</button>
                  </div>
                </div>
              )}

              {verifyStep === "selfie_upload" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-3 rounded-xl border text-xs text-slate-600 flex items-start gap-2">
                    <Info className="text-blue-500 w-4 h-4 shrink-0 mt-0.5" />
                    <span>Document received: <strong className="text-slate-800">{uploadedDocFile}</strong>. Next, perform selfie liveness matching.</span>
                  </div>
                  <div className="border-2 border-dashed border-slate-200 hover:border-pink-300 rounded-xl p-6 text-center transition-all cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSelfieUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <User className="mx-auto w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700 block">Click to Upload Live Selfie</span>
                    <span className="text-[10px] text-slate-400">Please align your face clearly in good lighting</span>
                  </div>
                </div>
              )}

              {verifyStep === "verifying" && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 rounded-full border-4 border-pink-500 border-t-transparent animate-spin mx-auto"></div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs">AI Selfie-to-ID Face Similarity Matcher</h5>
                    <p className="text-[11px] text-slate-500">Executing mathematical 128-point face liveness analysis & safety lookup...</p>
                  </div>
                </div>
              )}

              {verifyStep === "completed" && (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <h5 className="font-bold text-emerald-800 text-sm">Identity & Photos Verified!</h5>
                    <p className="text-xs text-slate-500">Your profile is now marked with 🟢 Photo Verified and 🟢 Identity Verified badges.</p>
                  </div>
                  <button
                    onClick={() => setVerifyStep("idle")}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-1.5 px-4 rounded-xl"
                  >
                    Great, thanks!
                  </button>
                </div>
              )}
            </div>
          )}

          {/* EXPLAINABLE CLASSIFIED PREFERENCE DASHBOARD */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h4 className="text-sm font-bold text-slate-950 flex items-center gap-1.5 mb-3">
              <Settings className="text-pink-600 w-4.5 h-4.5" />
              Your Classified Match Criteria
            </h4>

            <div className="space-y-4">
              {/* MUST HAVES */}
              <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-100">
                <span className="text-[11px] font-black text-rose-700 uppercase tracking-wider block mb-2">
                  📌 Must Have (Hard Filters)
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-rose-500" />
                    <span>Age Range: <strong className="font-semibold text-slate-900">{preferences.must_age_min} to {preferences.must_age_max}</strong></span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-rose-500" />
                    <span>Target Gender: <strong className="font-semibold text-slate-900">{preferences.must_genders.join(", ")}</strong></span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-rose-500" />
                    <span>Locations: <strong className="font-semibold text-slate-900">{preferences.must_locations.join(", ")}</strong></span>
                  </li>
                </ul>
              </div>

              {/* PREFERS */}
              <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
                <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider block mb-2">
                  ⭐ Prefer (Scoring Weight Boosts)
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-blue-500" />
                    <span>Education: <strong className="font-semibold text-slate-900">{preferences.prefer_education_level}</strong></span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-blue-500" />
                    <span>Minimum Income: <strong className="font-semibold text-slate-900">₹{preferences.prefer_income_min} LPA+</strong></span>
                  </li>
                </ul>
              </div>

              {/* DEAL BREAKERS */}
              <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-2">
                  🚫 Deal Breakers (Instant Exclusions)
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center justify-between">
                    <span>Non-Smoker Only</span>
                    <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold">YES</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Already Married</span>
                    <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold">NO WAY</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* MIDDLE COLUMN: DISCOVER & AI RECOMMENDATION FEED */}
        <section className="lg:col-span-5 flex flex-col gap-6">

          {/* ASK AI SEARCH FORM */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full blur-3xl -z-10 opacity-30"></div>

            <h3 className="text-base font-bold text-slate-950 flex items-center gap-2 mb-1.5">
              <Zap className="text-pink-600 w-5 h-5 fill-pink-50" />
              "Ask AI" Intuitive Match Search
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Describe what you seek in normal conversational language. Our validator will translate it to a secure search schema safely.
            </p>

            <form onSubmit={handleAiSearch} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., Find someone who is 26-30, based in Bangalore, vegetarian and family-oriented"
                  value={nlQuery}
                  onChange={(e) => setNlQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all"
                >
                  {isAiSearching ? (
                    <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Search className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>

              {/* DEMONSTRATION OF SECURE PARSING SCHEMA */}
              {parsedSchema && (
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs space-y-2 font-mono relative animate-fadeIn">
                  <div className="flex justify-between items-center text-[10px] text-pink-400 font-bold border-b border-slate-800 pb-1.5">
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
                  <pre className="text-[11px] overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(parsedSchema, null, 2)}
                  </pre>
                  <p className="text-[10px] text-slate-400 italic">
                    The structured JSON above strictly bounds the SQL generation layer, preventing malicious database query injection.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* AI-FIRST RECOMMENDED MATCHES FEED */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Compass className="text-pink-600 w-4.5 h-4.5" />
                AI-Driven Matches ({rankedMatches.length})
              </h4>
              <span className="text-xs text-slate-500">Sorted by Mutual Compatibility</span>
            </div>

            {rankedMatches.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200">
                <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h5 className="font-bold text-slate-800 text-sm">No compatible matches found</h5>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Try broadening your "Ask AI" search parameters or modifying your match constraints.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {rankedMatches.map((profile) => {
                  const isLikedByMe = likes[profile.id] === 'accepted';
                  const hasPhotoAccess = !profile.photos[1] || photoRequestStatus[profile.id] === 'approved';

                  return (
                    <div
                      key={profile.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 relative group"
                    >
                      {/* Compatibility Badge */}
                      <div className="absolute top-4 right-4 bg-slate-900/90 text-white backdrop-blur-sm py-1.5 px-3 rounded-full flex items-center gap-1.5 z-10">
                        <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                        <span className="font-bold text-xs">{profile.matchScore}% Compatibility</span>
                      </div>

                      {/* Main picture area with gradient overlay */}
                      <div className="relative h-48 bg-slate-200">
                        <img
                          src={profile.photos[0].url}
                          alt={profile.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        {/* Basic Overlay Info */}
                        <div className="absolute bottom-4 left-4 text-white">
                          <h4 className="text-lg font-bold flex items-center gap-1.5">
                            {profile.name}
                            {profile.is_verified_identity && (
                              <ShieldCheck className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                            )}
                          </h4>
                          <p className="text-xs text-slate-200 font-medium">
                            {profile.age} yrs • {profile.height} • {profile.profession}
                          </p>
                        </div>
                      </div>

                      {/* EXPLAINABLE AI SCORE CARD */}
                      <div className="p-5 space-y-4">
                        <div className="bg-pink-50/50 p-3.5 rounded-xl border border-pink-100/60">
                          <span className="text-[10px] font-black text-pink-700 uppercase tracking-wider block mb-1">
                            💡 Why We Recommend This Match
                          </span>
                          <div className="grid grid-cols-1 gap-1">
                            {profile.explainableReasons.map((reason, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold">
                                <Check className="w-3.5 h-3.5 text-pink-600 stroke-[3.5]" />
                                <span>{reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Summary */}
                        <p className="text-slate-600 text-xs italic line-clamp-2">
                          "{profile.about_me}"
                        </p>

                        {/* Private Album Section */}
                        {profile.photos[1] && (
                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 text-slate-700 font-semibold">
                              <Lock className="w-4 h-4 text-slate-500" />
                              <span>Private Photo Album 🔒</span>
                            </div>

                            {photoRequestStatus[profile.id] === 'approved' ? (
                              <button
                                onClick={() => {
                                  setIsPhotoVisibleMap(prev => ({ ...prev, [profile.id]: !prev[profile.id] }));
                                  showToast("Viewing secure private photo.");
                                }}
                                className="bg-slate-900 text-white font-bold py-1 px-3 rounded-lg text-[10px]"
                              >
                                {isPhotoVisibleMap[profile.id] ? "Hide Photo" : "View Photo"}
                              </button>
                            ) : photoRequestStatus[profile.id] === 'pending' ? (
                              <span className="text-[10px] bg-slate-200 text-slate-600 font-bold py-1 px-2.5 rounded-full">
                                Pending Access...
                              </span>
                            ) : (
                              <button
                                onClick={() => handlePhotoRequest(profile.id, profile.name)}
                                className="bg-pink-600 text-white hover:bg-pink-700 font-bold py-1 px-3 rounded-lg text-[10px]"
                              >
                                Request Access
                              </button>
                            )}
                          </div>
                        )}

                        {/* Private Photo Render */}
                        {isPhotoVisibleMap[profile.id] && photoRequestStatus[profile.id] === 'approved' && profile.photos[1] && (
                          <div className="border border-slate-100 rounded-xl overflow-hidden shadow-inner p-2 bg-slate-50 relative">
                            <span className="absolute top-4 left-4 bg-slate-900/90 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full">
                              Authorized Private Image
                            </span>
                            <img
                              src={profile.photos[1].url}
                              alt="Private Album"
                              className="w-full h-40 object-cover rounded-lg"
                            />
                          </div>
                        )}

                        {/* ACTIONS FOOTER */}
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => setSelectedProfile(profile)}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-3 rounded-xl transition-all"
                          >
                            Full Profile Details
                          </button>

                          <button
                            onClick={() => handleLike(profile.id, profile.name)}
                            disabled={isLikedByMe}
                            className={`flex-1 text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1 ${
                              isLikedByMe
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-pink-600 text-white hover:bg-pink-700 shadow-sm shadow-pink-100'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isLikedByMe ? 'fill-emerald-700' : ''}`} />
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
        <section className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">

            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <MessageCircle className="w-4.5 h-4.5 text-pink-400" />
                Matrimonial Chat Hub
              </h3>
              <span className="text-[10px] bg-pink-600 text-white font-bold px-2 py-0.5 rounded-full">
                Strict Acceptance Enabled
              </span>
            </div>

            {/* Chat List Selection (only show mutual matches) */}
            <div className="bg-slate-50 p-2.5 border-b border-slate-100 shrink-0">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">ACTIVE MUTUAL CONNECTIONS</span>
              <div className="flex gap-2 overflow-x-auto">
                {profiles.filter(p => likes[p.id] === 'accepted').map(partner => (
                  <button
                    key={partner.id}
                    onClick={() => setActiveChatId(partner.id)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl transition-all border text-left shrink-0 ${
                      activeChatId === partner.id
                        ? 'bg-white border-pink-200 shadow-sm font-extrabold'
                        : 'border-transparent text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden relative">
                      <img src={partner.photos[0].url} alt={partner.name} className="object-cover w-full h-full" />
                    </div>
                    <span className="text-xs">{partner.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Body */}
            {activeChatId ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 flex flex-col justify-end">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-sm ${
                      msg.sender === 'You'
                        ? 'bg-slate-900 text-white ml-auto rounded-tr-none'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-2 mb-1">
                      <span className="font-black text-[10px]">{msg.sender}</span>
                      <span className="text-[9px] opacity-60">{msg.time}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                    {msg.flagged && (
                      <span className="text-[9px] text-yellow-400 font-bold bg-slate-800/80 px-2 py-0.5 rounded-full block mt-1 text-center">
                        ⚠️ SYSTEM FLAG: Financial Terms Detected
                      </span>
                    )}
                  </div>
                ))}

                {/* Simulated Warning Alert */}
                {spamAlert && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-800 text-[11px] font-semibold flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <p>{spamAlert}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <Heart className="w-10 h-10 text-pink-300 mb-2" />
                <h5 className="font-bold text-slate-800 text-xs">No active chat selected</h5>
                <p className="text-[11px] text-slate-400">Match with a candidate first to begin secure messaging.</p>
              </div>
            )}

            {/* Chat Footer Input */}
            {activeChatId && (
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Type a secure message... (Try typing 'send money')"
                  value={currentMessageInput}
                  onChange={(e) => setCurrentMessageInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* FULL PROFILE DETAIL MODAL */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 relative animate-fadeIn">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 bg-slate-100 text-slate-500 hover:text-slate-800 p-1.5 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="w-full md:w-1/3">
                <img
                  src={selectedProfile.photos[0].url}
                  alt={selectedProfile.name}
                  className="w-full h-48 object-cover rounded-2xl shadow-sm"
                />
                <div className="flex gap-1.5 mt-2">
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                    {selectedProfile.gender}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                    {selectedProfile.marital_status}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-950 flex items-center gap-1.5">
                    {selectedProfile.name}
                    {selectedProfile.is_verified_identity && (
                      <ShieldCheck className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedProfile.location} • {selectedProfile.age} yrs • {selectedProfile.height}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-medium">Income Level</span>
                    <span className="font-bold text-pink-600 text-xs">{selectedProfile.income_range}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-medium">Education</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedProfile.education_level}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-medium">Profession</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedProfile.profession}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-medium">Religion / Caste</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedProfile.religion} ({selectedProfile.community})</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-4 text-xs">
              <div>
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">About Me</h5>
                <p className="text-slate-600 leading-relaxed italic">"{selectedProfile.about_me}"</p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">Partner Expectations</h5>
                <p className="text-slate-600 leading-relaxed">"{selectedProfile.partner_expectations}"</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <h5 className="font-bold text-slate-950 text-[11px] mb-1">Lifestyle</h5>
                  <p className="text-slate-600">{selectedProfile.lifestyle}</p>
                </div>
                <div>
                  <h5 className="font-bold text-slate-950 text-[11px] mb-1">Family Expectations</h5>
                  <p className="text-slate-600">{selectedProfile.family_expectations}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    handleLike(selectedProfile.id, selectedProfile.name);
                    setSelectedProfile(null);
                  }}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  Connect With {selectedProfile.name}
                </button>
                <button
                  onClick={() => {
                    // Report candidate simulation
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
                  className="bg-slate-100 hover:bg-slate-200 text-rose-600 text-xs font-bold py-2.5 px-4 rounded-xl"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 p-6 relative animate-fadeIn">

            <button
              type="button"
              onClick={() => setIsOnboardingOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Stepper Status Indicators */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold bg-pink-50 text-pink-700 px-3 py-1 rounded-full border border-pink-100">
                Progressive Registration (Step {onboardingStep} of 6)
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div
                    key={num}
                    className={`h-2 w-5 rounded-full transition-all ${
                      onboardingStep >= num ? 'bg-pink-600' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleOnboardingSubmit} className="space-y-4">

              {/* STEP 1: ACCOUNT TYPE */}
              {onboardingStep === 1 && (
                <div className="space-y-3 animate-fadeIn">
                  <h4 className="font-black text-slate-900 text-sm">Step 1: Welcome & Profile Mode</h4>
                  <p className="text-xs text-slate-500">How do you intend to run this profile?</p>

                  <div className="grid grid-cols-3 gap-2">
                    {["self", "parent", "family"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setOnboardingForm(prev => ({ ...prev, account_type: type }))}
                        className={`p-4 border rounded-xl text-center font-bold text-xs capitalize ${
                          onboardingForm.account_type === type
                            ? 'bg-pink-50 border-pink-500 text-pink-700 ring-2 ring-pink-100'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 mt-4">
                    <label className="block text-[11px] font-bold text-slate-600">Mobile Number for OTP onboarding</label>
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: BASIC INFORMATION */}
              {onboardingStep === 2 && (
                <div className="space-y-3 animate-fadeIn">
                  <h4 className="font-black text-slate-900 text-sm">Step 2: Core Details</h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={onboardingForm.name}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Gender</label>
                      <select
                        value={onboardingForm.gender}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-pink-500"
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Location</label>
                      <input
                        type="text"
                        required
                        value={onboardingForm.location}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        required
                        value={onboardingForm.date_of_birth}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, date_of_birth: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: EDUCATION & CAREER */}
              {onboardingStep === 3 && (
                <div className="space-y-3 animate-fadeIn">
                  <h4 className="font-black text-slate-900 text-sm">Step 3: Education & Career</h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Highest Degree</label>
                      <input
                        type="text"
                        required
                        value={onboardingForm.education_level}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, education_level: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Profession</label>
                      <input
                        type="text"
                        required
                        value={onboardingForm.profession}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, profession: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Current Salary Range (shown as abstract range for privacy)</label>
                    <select
                      value={onboardingForm.income_range}
                      onChange={(e) => setOnboardingForm(prev => ({ ...prev, income_range: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-pink-500"
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
                <div className="space-y-3 animate-fadeIn">
                  <h4 className="font-black text-slate-900 text-sm">Step 4: Family Details</h4>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Religion</label>
                    <input
                      type="text"
                      required
                      value={onboardingForm.religion}
                      onChange={(e) => setOnboardingForm(prev => ({ ...prev, religion: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Mother Tongue</label>
                    <input
                      type="text"
                      required
                      value={onboardingForm.mother_tongue}
                      onChange={(e) => setOnboardingForm(prev => ({ ...prev, mother_tongue: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: LIFESTYLE & PERSONAL FREE-TEXT */}
              {onboardingStep === 5 && (
                <div className="space-y-3 animate-fadeIn">
                  <h4 className="font-black text-slate-900 text-sm">Step 5: Lifestyle & Expectations</h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Food Preference</label>
                      <select
                        value={onboardingForm.food_preference}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, food_preference: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-pink-500"
                      >
                        <option>Vegetarian</option>
                        <option>Non-Vegetarian</option>
                        <option>Eggetarian</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Smoking Habit</label>
                      <select
                        value={onboardingForm.smoking_status}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, smoking_status: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-pink-500"
                      >
                        <option>No</option>
                        <option>Yes</option>
                        <option>Occasionally</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">About Me (used for Semantic Matching)</label>
                    <textarea
                      rows={2}
                      value={onboardingForm.about_me}
                      onChange={(e) => setOnboardingForm(prev => ({ ...prev, about_me: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 6: VERIFICATION PRE-APPROVALS */}
              {onboardingStep === 6 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="font-black text-slate-900 text-sm">Step 6: Confirm Photos & Finalize</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    You can start using WeddingBells right away! Would you like to pre-approve safety terms and finalize your account profile?
                  </p>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="mt-0.5" />
                      <span>Accept digital personal data verification guidelines (DPDP Act 2023)</span>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="mt-0.5" />
                      <span>Allow matches to see my public photos directly</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Stepper Footer Controls */}
              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrevOnboardingStep}
                  disabled={onboardingStep === 1}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30"
                >
                  Previous
                </button>

                {onboardingStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNextOnboardingStep}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold py-2 px-6 rounded-xl shadow-sm"
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
      <footer className="bg-slate-900 text-slate-400 py-6 px-6 mt-12 border-t border-slate-800 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div>
            <p className="font-bold text-slate-200">WeddingBells Matrimonial System</p>
            <p className="text-slate-500 mt-1">Robust AI matching + Multi-generational co-management + Extreme Privacy Guardrails.</p>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-200 cursor-pointer">DPDP Compliance</span>
            <span className="hover:text-slate-200 cursor-pointer">Security Audits</span>
            <span className="hover:text-slate-200 cursor-pointer">Support</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
