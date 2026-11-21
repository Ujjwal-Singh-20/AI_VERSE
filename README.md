# AI VERSE // The Gamified AI/ML Engineering Universe

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?logo=three.js)](https://docs.pmnd.rs/react-three-fiber)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange?logo=firebase)](https://firebase.google.com/)

> `PATTERNS TO PURPOSE` :: An interactive 3D learning platform taking developers from core data logic to autonomous agent systems and production ML deployment.

---

## [KEY_SYSTEMS // CORE_CAPABILITIES]

AI VERSE replaces passive tutorial reading with an interactive, mission-driven software engineering simulator:

### [01 // 3D_EXPLORATION_MAP]
- Developed with **Three.js** and **React Three Fiber (R3F)**.
- Explorable archipelago environment where each floating landmass represents a specialized engineering domain.
- Real-time camera transitions, procedural lighting, fluid wave models, and custom post-processing bloom shaders.

### [02 // COGNITIVE_SIGNATURES]
- Deterministic visual identicon generator mapped to each student's institutional identity.
- Built on a seeded PRNG and dynamic attention-field matrix, generating visual mathematical archetypes without external image CDNs.

### [03 // MISSION_CONTROL_IDE]
- Embedded **Monaco Editor** environment with syntax highlighting, custom file trees, and split drag-and-resize panels.
- Live execution output streams (`stdout`, `stderr`) paired with automated validation passes against hidden test datasets.
- In-browser artifact management for downloading raw datasets and uploading serialized model weights (`.pkl`).

### [04 // AI_EVALUATION_ORCHESTRATOR]
- Multi-tier verification pipeline backed by Google's **Gemini**.
- Configured with a senior engineer persona to review code quality, prevent hardcoding, enforce integrity on protected blocks, and deliver targeted feedback.

### [05 // INTERLEAVED_CURRICULUM_GRAPH]
A 28-mission curriculum structured as an interleaved learning path rather than isolated, disconnected silos:
- `TRACK // BUILDER (B1-B5)`: Deterministic data pipelines, schema contracts, and stream logic.
- `TRACK // ML_PIPELINE (M1-M7)`: Feature processing, model training, persistence, and drift monitoring.
- `TRACK // GENAI (G1-G6)`: Context injection, structured schema enforcement, RAG pipelines, and guardrails.
- `TRACK // AGENTIC (A1-A5)`: Tool registries, multi-step planners, reflection cycles, and agent swarms.
- `TRACK // DEPLOYMENT (D1-D5)`: Microservice interfaces, container packaging, latency budgeting, and health probes.

### [06 // GUEST_SANDBOX_ACCESS]
- Instant 1-click preview mode allowing external visitors, evaluators, and recruiters to explore the platform without authentication gates.
- Ephemeral state persisted locally (`localStorage`) for sandbox execution and code drafts with zero write footprint on Firestore.

### [07 // EASTER_EGG_BRAINROT_MODE]
- Keyboard shortcut (`Ctrl + B` / `Cmd + B`) unlocks a full-platform Brainrot UI translation layer (`PROGRESS_RIZZ`, `MOD_ROOM`, `THE_VAULT`, `BYE_BYE_💀`).

---

## [SYSTEM_ARCHITECTURE]

```
+-------------------------------------------------------------+
|                       AI VERSE CLIENT                       |
|   React 19 | Vite | Three.js / R3F | TailwindCSS | Monaco   |
+------------------------------+------------------------------+
                               |
              [API_TRANSPORT]  |  [FIREBASE_SDK]
                               |
            +------------------+------------------+
            |                                     |
            v                                     v
+-----------------------------+     +-----------------------------+
|       FASTAPI GATEWAY       |     |       GOOGLE FIREBASE       |
|  - Level Definition Catalog |     |  - OAuth Validation         |
|  - Hidden Test Injector     |     |  - Student Cloud Profiles   |
|  - Gemini LLM Evaluator     |     |  - Code Draft Storage       |
|  - Platform Visit Telemetry |     |  - Security Rules Guard     |
+--------------+--------------+     +-----------------------------+
               |
        [IPC / HTTP]
               |
               v
+-----------------------------+
|    CODE EXECUTION ENGINE    |
|  - Isolated Subprocess Core |
|  - NumPy, Pandas, Scikit    |
|  - Sandboxed Environment    |
+-----------------------------+
```

---

## [REPOSITORY_LAYOUT]

```
AI_VERSE/
|-- public/                     # Static assets and runtime definitions
|-- src/
|   |-- assets/                 # Vector resources and brand graphics
|   |-- components/             # Three.js modules and interface primitives
|   |   |-- AIIdenticon/        # Procedural identicon renderers
|   |   |-- CognitiveSignature/ # Cellular attention-field visualizers
|   |   |-- BackendStatus.tsx   # Live connection health monitor
|   |   |-- Connections.tsx     # Spline networks between 3D nodes
|   |   |-- FileUpload.tsx      # Model weight and dataset uploader
|   |   |-- Island.tsx          # 3D floating landmass instances
|   |   |-- OceanEnvironment.tsx# Shaders and environmental scene rigs
|   |   |-- OverlayUI.tsx       # Dynamic mission inspection tray
|   |   |-- SettingsModal.tsx   # API key and preferences modal
|   |   `-- WorldMap.tsx        # Scene orchestrator
|   |-- context/
|   |   |-- AuthContext.tsx     # Session state and guest mode bridge
|   |   `-- LevelContext.tsx    # Mission metadata and progression state
|   |-- lib/
|   |   `-- firebase.ts         # Client authentication initialization
|   |-- pages/
|   |   |-- AdminPage.tsx       # Telemetry views, rosters, and activity
|   |   |-- LandingPage.tsx     # Entry view with guest access trigger
|   |   |-- LevelDocPage.tsx    # Technical track manuals
|   |   |-- ProfilePage.tsx     # User portfolio and cognitive signature
|   |   |-- SuggestedRoutePage.tsx # Interleaved mission roadmap
|   |   `-- TrackPage.tsx       # Mission Control IDE and execution view
|   |-- App.tsx                 # Core router and layout coordinator
|   `-- main.tsx                # Client bootloader
|-- firestore.rules             # Access control rules and locked telemetry
|-- package.json
`-- vite.config.ts
```

---

## [TECH_SPECIFICATIONS]

- `UI_FRAMEWORK`      : React 19 + TypeScript
- `GRAPHICS_PIPELINE`  : Three.js + React Three Fiber + Drei
- `STYLE_ENGINE`      : TailwindCSS v4 + Framer Motion
- `CODE_SURFACE`      : Monaco Editor (VS Code core)
- `IDENTITY_DATASTORE`: Firebase Auth + Cloud Firestore
- `BUNDLER`           : Vite + SWC

---

## [QUICKSTART]

### [STEP_01 // PREREQUISITES]
- Node.js 18.0.0 or higher
- npm or pnpm package manager

### [STEP_02 // ENVIRONMENT_CONFIG]
Create a `.env` configuration file in the project root:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_BACKEND_URL=http://localhost:8000
```

### [STEP_03 // LAUNCH]
```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Compile production bundle
npm run build
```

---

## [SECURITY_MODEL]

- `AUTH_ENFORCEMENT`: Institutional email validation (`@kiit.ac.in`) enforces cloud save restrictions.
- `ISOLATED_GUEST_MODE`: Unauthenticated clients run entirely on local browser storage without read/write access to user records.
- `LOCKED_TELEMETRY`: Analytics counters are set to `allow write: if false` on client rules, ensuring only backend service accounts can increment visits.
- `EPHEMERAL_CREDENTIALS`: Client-side LLM keys remain stored in the user's browser `localStorage` and are transmitted only over TLS directly to the execution pipeline.
