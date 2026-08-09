-- SQL Schema for WeddingBells - AI-First Matrimonial Marketplace
-- Uses PostgreSQL and pgvector for semantic profile matching

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Users Table (Core Auth & Account Details)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    mobile_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('self', 'parent', 'family')),
    is_otp_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Profiles Table (Matrimonial Profile Details)
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    date_of_birth DATE NOT NULL,
    age INT NOT NULL,
    height VARCHAR(10), -- e.g., "5'8\""
    location VARCHAR(100) NOT NULL, -- e.g., "Bangalore, Karnataka"
    mother_tongue VARCHAR(50) NOT NULL,
    religion VARCHAR(50) NOT NULL,
    community VARCHAR(50), -- Caste/Community
    sub_community VARCHAR(50),
    marital_status VARCHAR(30) NOT NULL,
    children_status VARCHAR(20) DEFAULT 'No',

    -- Education & Career
    education_level VARCHAR(50),
    profession VARCHAR(100),
    company VARCHAR(100),
    income_range VARCHAR(50), -- Stored/shown as range for privacy, e.g. "₹15–20 LPA"
    work_location VARCHAR(100),

    -- Lifestyle
    food_preference VARCHAR(30), -- e.g., Vegetarian, Non-Vegetarian, Eggetarian
    smoking_status VARCHAR(20),
    drinking_status VARCHAR(20),
    hobbies TEXT[],

    -- Free text for Semantic Search & AI Embeddings
    about_me TEXT,
    partner_expectations TEXT,
    family_expectations TEXT,
    future_goals TEXT,
    marriage_expectations TEXT,

    -- Management modes
    profile_mode VARCHAR(20) DEFAULT 'self' CHECK (profile_mode IN ('self', 'parent', 'joint')),
    managed_by VARCHAR(50), -- e.g., "Father - Rajesh Sharma"
    candidate_invited BOOLEAN DEFAULT FALSE,
    candidate_accepted BOOLEAN DEFAULT FALSE,
    candidate_email VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Profile Embeddings Table (For Vector Similarity Search using pgvector)
CREATE TABLE profile_embeddings (
    profile_id INT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    about_me_vector vector(1536), -- 1536 is standard size for OpenAI text-embedding-3-small or text-embedding-ada-002
    partner_expectations_vector vector(1536),
    lifestyle_vector vector(1536),
    family_expectations_vector vector(1536),
    combined_profile_vector vector(1536),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Preferences Table (Classified Preferences for Hybrid Matching)
CREATE TABLE preferences (
    profile_id INT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,

    -- Must Have Requirements (Hard Filters)
    must_age_min INT,
    must_age_max INT,
    must_genders VARCHAR(10)[],
    must_locations VARCHAR(100)[],
    must_marital_statuses VARCHAR(30)[],
    must_religions VARCHAR(50)[],
    must_communities VARCHAR(50)[],
    must_food_preferences VARCHAR(30)[],

    -- Prefer Requirements (Scoring Boosts)
    prefer_education_levels VARCHAR(50)[],
    prefer_income_min INT, -- e.g., Minimum LPA limit
    prefer_height_min VARCHAR(10),
    prefer_languages VARCHAR(50)[],

    -- Deal Breakers (Instant Exclusions)
    dealbreaker_smoking BOOLEAN DEFAULT FALSE,
    dealbreaker_drinking BOOLEAN DEFAULT FALSE,
    dealbreaker_married BOOLEAN DEFAULT FALSE,
    dealbreaker_wants_children BOOLEAN DEFAULT FALSE,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Profile Photos Table (Public and Private Photos)
CREATE TABLE profile_photos (
    id SERIAL PRIMARY KEY,
    profile_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    photo_url VARCHAR(255) NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    is_avatar BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Private Photo Requests Table (Access Permission system)
CREATE TABLE private_photo_requests (
    id SERIAL PRIMARY KEY,
    requester_profile_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    target_profile_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(requester_profile_id, target_profile_id)
);

-- 7. Verification Table (Trust & Safety system)
CREATE TABLE verification (
    profile_id INT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    identity_status VARCHAR(20) DEFAULT 'unverified' CHECK (identity_status IN ('unverified', 'pending', 'verified', 'rejected')),
    identity_document_type VARCHAR(30), -- Aadhaar, PAN, Passport, etc. (never shown directly)
    photo_selfie_status VARCHAR(20) DEFAULT 'unverified' CHECK (photo_selfie_status IN ('unverified', 'pending', 'verified', 'rejected')),
    is_verified_badge BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Likes & Interests Table (Mutual Acceptance tracking)
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    sender_profile_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_profile_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(sender_profile_id, receiver_profile_id)
);

-- 9. Matches Table (Formed when mutual acceptance occurs)
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    profile_1_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    profile_2_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    compatibility_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profile_1_id, profile_2_id)
);

-- 10. Messages Table (Chat restricted to mutual matches)
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    match_id INT REFERENCES matches(id) ON DELETE CASCADE,
    sender_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    flagged_as_spam BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Reports & Blocks Table (Safety controls)
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    reporter_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    reported_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blocks (
    id SERIAL PRIMARY KEY,
    blocker_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    blocked_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(blocker_id, blocked_id)
);

-- 12. Security Audit Log Table
CREATE TABLE security_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    device_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
