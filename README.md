# WeddingBells - AI-First Matrimonial Marketplace

WeddingBells is an **AI-first matrimonial marketplace** designed to replace the outdated, high-friction, and low-trust experience of traditional matrimonial sites. By pairing high-quality semantic recommendation layers with deterministic preference matching, a secure trust verification framework, and multi-generational profile management (Self, Parent, Joint), WeddingBells offers the perfect balance of modern intelligence and traditional alignment.

---

## Technical Architecture & Core Pillars

### 1. Multi-Generational Profile Management (Self, Parent, Joint)
Unlike traditional systems that lead to friction or separate duplicate accounts for parents and candidates, WeddingBells models relationship-level co-management natively.
* **👤 Self-Managed Mode**: Created and operated entirely by the candidate.
* **👨‍👩‍👧 Parent/Family Mode**: Created by a parent or guardian. They can configure the profile, and invite the son/daughter via email.
* **👥 Joint Mode**: Established when a son/daughter accepts their parent's invitation. Both parent and candidate have permissions to manage the account, see matches, or handle communication based on co-management rules.

```
       [ Parent Account ]
              │
              ├─► Creates candidate profile (e.g. "My Son")
              │
              └─► Sends digital invite to Candidate
                       │
                       ▼
         [ Candidate Accepts Invite ]
                       │
                       ├─► Accept & Transfer Ownership (Self-Managed)
                       └─► Co-Manage Profile Together (Jointly Managed)
```

---

### 2. Trust, Safety, & Privacy (Indian Context Oriented)
To address the critical safety and privacy requirements of Indian matrimonial users:
* **✓ Verified Badges**: Realized via multi-step verification including **Email OTP**, **Mobile OTP**, **Identity Document Verification** (Aadhaar, PAN, Passport, or DL), and **Selfie / Face Similarity Verification**. To maximize privacy, physical verification documents are *never* visible to other users—only the final verified badge is shown.
* **🔒 Privacy Guards**:
  * Exact income figures are abstracted into ranges (e.g., ₹15-20 LPA).
  * Exact addresses are restricted to general location representations (e.g., "Bangalore, Karnataka").
  * **Private Album Control**: Photos can be categorized as *Public* (visible to matches/all) or *Private* (requiring explicit authorization requests before viewing is permitted via short-lived signed URLs).
* **🛡️ Fraud Detection & Safety Controls**: Real-time reporting, user blocking, automated duplicate-profile warnings (analyzing device finger-printing and similar profile pictures), and automated message content scanning to guard against financial fraud and spam.

---

### 3. The Hybrid Match Ranking Engine
The matching framework is divided into three layers to combine perfect structural alignment with deep semantic understanding. This hybrid model delivers robust scalability, predictable results, and explainability.

```
                  USER PROFILE & PREFERENCES
                             │
                             ▼
                 ┌───────────────────────┐
                 │        LAYER 1        │
                 │     Hard Filters      │
                 └───────────┬───────────┘
                             │ (Eliminate profiles that fail Must Haves
                             │  or violate Deal Breakers)
                             ▼
                 ┌───────────────────────┐
                 │        LAYER 2        │
                 │   Preference Score    │
                 └───────────┬───────────┘
                             │ (Calculates multi-dimensional weightings:
                             │  Age (15%), Career (10%), Lifestyle (15%), etc.)
                             ▼
                 ┌───────────────────────┐
                 │        LAYER 3        │
                 │  Semantic AI Match    │
                 └───────────┬───────────┘
                             │ (Uses pgvector similarity on text embeddings of
                             │  about me, partner expectations, and lifestyle)
                             ▼
                 ┌───────────────────────┐
                 │     Ranked Matches    │
                 └───────────────────────┘
```

#### Layer 1: Hard Filters (Deterministic Elimination)
Strictly filters out candidates based on **Must Have** requirements and **Deal Breakers** (e.g., Gender, Marital Status, Smoking preference, and extreme Age constraints).

#### Layer 2: Preference Scoring (Multi-Dimensional Alignment)
Calculates a numerical score out of 100 based on weighted preferences:
* **Age Compatibility** (15%)
* **Education & Career** (10% each)
* **Location & Language** (10% each)
* **Lifestyle & Family Expectations** (15% & 10%)
* **Religion & Community** (10%)

#### Layer 3: Semantic AI Matching (pgvector Similarity)
Compares dense vector representations of free-text inputs (*About Me*, *Partner Expectations*, *Family Expectations*, *Future Goals*, and *Marriage Expectations*) using cosine distance in `pgvector`. This enables WeddingBells to comprehend nuanced prompts such as matching "career-oriented but values family time" with a candidate who expresses "I love my IT career but family is my ultimate priority."

---

### 4. "Ask AI" Search Schema Validation
To avoid unsafe direct SQL execution from natural language prompts, WeddingBells uses a structured validator loop.

```
  [ Natural Language Query ]
              │
              ▼
    [ AI Semantic Parser ]
              │
              ▼
   [ Validated Search Schema ] (JSON payload containing age, location, lifestyle, etc.)
              │
              ▼
     [ Safe Search API ]
              │
              ▼
       [ Database Run ]
```

This ensures full injection safety, consistent search execution, and extremely simple natural language match discovery.

---

## Database Schema Model
The system is modeled around 12 core tables mapping accounts, profile options, preferences, verification stages, match agreements, and private communications. Refer to [schema.sql](./schema.sql) for details on:
1. `users`
2. `profiles`
3. `profile_embeddings`
4. `preferences`
5. `profile_photos`
6. `private_photo_requests`
7. `verification`
8. `likes`
9. `matches`
10. `messages`
11. `reports` & `blocks`
12. `security_logs`

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v15+) with `pgvector` extension

### Running the Interactive Web App Mockup
To visualize the product prototype, run the Vite React app:
```bash
npm install
npm run dev
```
