# 🏥 HealthSync

> Bridging Traditional Medicine with Modern Healthcare Technology

**HealthSync** is a comprehensive Electronic Medical Records (EMR) platform that revolutionizes healthcare management by seamlessly integrating ICD-11 disease classification, real-time collaboration, AI-powered medical insights, and instant access to relevant research papers. Built for organizations and healthcare professionals who demand precision, efficiency, and innovation.


## ✨ Features

### 🎯 Core Capabilities

- **🔐 Multi-Role Authentication System**
  - Secure JWT-based authentication
  - Role-based access control (Organizations & Doctors)
  - Session management with auto-keep-alive

- **📊 Intelligent Patient Management**
  - Create and manage patient records
  - ICD-11 disease code integration via WHO Clinical Tables API
  - Real-time patient assignment to doctors
  - Comprehensive diagnosis tracking with history

- **🔄 Real-Time Collaboration**
  - Socket.IO powered live updates
  - Instant patient assignment notifications
  - Connected doctors status monitoring
  - Live dashboard synchronization

- **🤖 AI-Powered Medical Insights**
  - Groq API integration for disease information
  - Automated medical knowledge retrieval
  - Comprehensive disease data including symptoms, treatments, and prognosis
  - Evidence-based medical information
  - Direct access to relevant research papers via SerpaAI when searching diseases
  - Instant academic literature retrieval for any disease or condition

- **📈 Advanced Analytics Dashboard**
  - Organization-wide patient statistics
  - Visual data representation with interactive charts
  - Recent patients and diagnosis tracking
  - Doctor availability monitoring

- **🎨 Modern User Interface**
  - Responsive design with Tailwind CSS v4
  - Dark mode support with animated transitions
  - Smooth animations powered by Framer Motion & GSAP
  - Radix UI components for accessibility


## 🏗️ Architecture

### Monorepo Structure


```
└── akankshrakesh-healthsync-react/
    ├── package.json                          # Root monorepo package configuration
    ├── vercel.json                           # Vercel deployment configuration with API routing
    ├── api/
    │   └── [...slug].js                      # Vercel serverless catch-all route handler
    ├── backend/
    │   ├── README.md                         # Backend-specific documentation
    │   ├── index.js                          # Main server entry point with Socket.IO setup
    │   ├── package.json                      # Backend dependencies (Express, MongoDB, Socket.IO)
    │   ├── lib/
    │   │   ├── mongo.js                      # MongoDB connection manager and database utilities
    │   │   └── userStore.js                  # User CRUD operations and authentication helpers
    │   └── routes/
    │       ├── auth.js                       # Authentication endpoints (login, signup, /me, logout, password reset)
    │       ├── groq.js                       # AI-powered disease information via Groq API + research papers via SerpaAI
    │       ├── icd11.js                      # WHO ICD-11 disease code search proxy
    │       ├── notifications.js              # User notification management system
    │       ├── organizations.js              # Organization management and doctor assignment
    │       └── patients.js                   # Patient CRUD, diagnosis tracking, and medical records
    └── react/
        ├── README.md                         # Frontend-specific documentation
        ├── eslint.config.js                  # ESLint configuration with TypeScript rules
        ├── index.html                        # Main HTML entry point
        ├── package.json                      # Frontend dependencies (React 19, Vite, TailwindCSS)
        ├── tsconfig.app.json                 # TypeScript config for application code
        ├── tsconfig.json                     # Base TypeScript configuration
        ├── tsconfig.node.json                # TypeScript config for Node.js scripts
        ├── vite.config.ts                    # Vite build configuration with React plugin
        ├── .env.production                   # Production environment variables
        └── src/
            ├── App.css                       # Global application styles
            ├── green.index.css               # Theme-specific stylesheet (green variant)
            ├── index.css                     # Base styles and Tailwind directives
            ├── main.tsx                      # Application entry point with routing and providers
            ├── components/
            │   ├── auth-guard.tsx            # Protected route wrapper with authentication check
            │   ├── community.tsx             # Landing page community section
            │   ├── cta.tsx                   # Call-to-action component for landing page
            │   ├── footer.tsx                # Application footer with links
            │   ├── forgot-password.tsx       # Password recovery form
            │   ├── header.tsx                # Navigation header with theme toggle
            │   ├── hero.tsx                  # Landing page hero section
            │   ├── login.tsx                 # User login form with JWT authentication
            │   ├── reactBit.tsx              # Animated dark mode veil effect component
            │   ├── signup.tsx                # User registration form (doctor/organization)
            │   ├── theme-toggle.tsx          # Dark/light mode switcher
            │   ├── dashboard/
            │   │   ├── AddDiagnosisModal.tsx        # Modal for adding patient diagnosis with ICD-11
            │   │   ├── AnalyticsTab.tsx             # Visual analytics with charts and statistics
            │   │   ├── ConfirmDeleteModal.tsx       # Confirmation dialog for patient deletion
            │   │   ├── dashboard-header.tsx         # Dashboard navigation and user menu
            │   │   ├── DashboardLayout.tsx          # Main dashboard layout with sidebar
            │   │   ├── EditPatientModal.tsx         # Modal for editing patient information
            │   │   ├── emr-dashboard.tsx            # Main EMR dashboard (org vs doctor views)
            │   │   ├── icd11.tsx                    # ICD-11 disease code search interface
            │   │   ├── NewPatientModal.tsx          # Modal for creating new patient records
            │   │   ├── NotificationCenter.tsx       # Real-time notification dropdown
            │   │   ├── OrgDoctorsPanel.tsx          # Organization's doctor list with drag-drop assignment
            │   │   ├── PatientsPage.tsx             # Full patient list with search and filters
            │   │   ├── RecentDiagnosis.tsx          # Recent diagnoses widget for dashboard
            │   │   ├── RecentlyAssignedPanel.tsx    # Doctor's assigned patients panel
            │   │   ├── RecentPatients.tsx           # Recent patients widget with quick actions
            │   │   ├── ReportsModal.tsx             # Patient reports and medical history viewer
            │   │   ├── ReportsPage.tsx              # Comprehensive reports page
            │   │   ├── settings.tsx                 # User settings and preferences
            │   │   ├── sidebar.tsx                  # Dashboard navigation sidebar
            │   │   └── stat-card.tsx                # Reusable statistic card component
            │   ├── pages/
            │   │   ├── about.tsx                    # About page with project information
            │   │   └── home.tsx                     # Landing page with all sections
            │   └── ui/
            │       ├── badge.tsx                    # Styled badge component (Radix UI)
            │       ├── button.tsx                   # Reusable button component with variants
            │       ├── card.tsx                     # Card component for content containers
            │       ├── icons.jsx                    # Icon components library (JSX)
            │       ├── icons.tsx                    # Icon components library (TypeScript)
            │       └── input.tsx                    # Form input component with validation
            └── lib/
                ├── auth.tsx                         # Authentication context provider and hooks
                ├── keepAlive.ts                     # Backend keep-alive utility for Render
                ├── mongo.ts                         # Frontend MongoDB utilities (if needed)
                ├── socket.tsx                       # Socket.IO provider component
                ├── socketContext.ts                 # Socket.IO React context definition
                ├── useSocket.ts                     # Custom hook for Socket.IO connection
                └── utils.ts                         # Utility functions (classNames, formatters, etc.)
```

## Technology Stack

#### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Routing:** React Router v7
- **Animations:** Framer Motion, GSAP
- **UI Components:** Radix UI
- **Real-time:** Socket.IO Client

#### Backend
- **Runtime:** Node.js 22
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT + bcrypt
- **Real-time:** Socket.IO Server
- **AI Integration:** Groq API
- **External APIs:** WHO ICD-11 Clinical Tables + SerpaAI for research papers

---

## 😼 Quick Start

### Prerequisites

- Node.js 22.x or higher
- MongoDB instance (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HealthSync-React
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../react
   npm install
   ```

3. **Configure environment variables**

   Create `.env` in the `backend/` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB=healthsync
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key
   
   # Server
   PORT=4000
   FRONTEND_URL=http://localhost:3000
   
   # Features
   ENABLE_SOCKETS=true
   
   # AI Integration (Optional)
   GROQ_API_KEY=your-groq-api-key
   ```

   Create `.env` in the `react/` directory:
   ```env
   VITE_API_URL=http://localhost:4000
   VITE_SOCKET_URL=http://localhost:4000
   ```

4. **Start the development servers**

   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend** (Terminal 2):
   ```bash
   cd react
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:4000`

---

## 🎓 Usage Guide

### For Organizations

1. **Sign Up** as an organization
2. **View Dashboard** to see all patients and doctors
3. **Assign Patients** to doctors via drag-and-drop interface
4. **Monitor Activity** through real-time analytics
5. **Track Connected Doctors** for instant collaboration

### For Doctors

1. **Sign Up** or with your organization name
2. **View Assigned Patients** in your dashboard
3. **Add Diagnoses** with ICD-11 disease codes
4. **Search Disease Information** using AI-powered insights
5. **Access Research Papers** directly when searching any disease or condition
6. **Track Patient History** and treatment progress


## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup      # Create new account
POST   /api/auth/login       # Authenticate user
GET    /api/auth/me          # Get current user
POST   /api/auth/logout      # Logout user
POST   /api/auth/forgot-password    # Password recovery
POST   /api/auth/reset-password     # Reset password
```

### Patients
```
POST   /api/patients         # Create patient
GET    /api/patients         # List patients
GET    /api/patients/:id     # Get patient details
PUT    /api/patients/:id     # Update patient
DELETE /api/patients/:id     # Delete patient
GET    /api/patients/diagnosis      # Get all diagnoses
POST   /api/patients/:id/diagnosis  # Add diagnosis
```

### Organizations
```
GET    /api/organizations              # List organizations
GET    /api/organizations/:id/doctors  # Get organization doctors
POST   /api/organizations/:id/assign   # Assign patient to doctor
```

### ICD-11
```
GET    /api/icd11/search     # Search disease codes
```

### Medical Insights
```
POST   /api/groq/disease-info         # Get AI-powered disease info + research papers
POST   /api/groq/diagnosis-summary    # Generate diagnosis summary
```

### Notifications
```
GET    /api/notifications     # Get user notifications
```


## 🔐 Security Features

- **Password Hashing:** bcrypt with salt rounds
- **JWT Tokens:** 7-day expiration with secure signing
- **CORS Protection:** Configured for production
- **Input Validation:** Server-side validation on all endpoints
- **MongoDB Injection Prevention:** Parameterized queries
- **Real-time Authentication:** Socket.IO middleware verification


## 🎨 UI Features

### Themes
- **Light Mode:** Clean, professional medical interface
- **Dark Mode:** Eye-friendly with animated veil effect
- **Smooth Transitions:** Powered by Framer Motion

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop-optimized layouts
- Touch-friendly interfaces

### Accessibility
- Radix UI primitives for WCAG compliance
- Keyboard navigation support
- Screen reader friendly
- High contrast mode compatible


## 📦 Deployment

### Frontend (Vercel)

```bash
cd react
npm run build
# Deploy to Vercel via GitHub integration or CLI
```

### Backend (Render / Railway / Fly.io)

```bash
cd backend
npm start
# Configure environment variables on platform
# Set ENABLE_SOCKETS=true for real-time features
```

### Environment Checklist
- ✅ Set `MONGODB_URI` to production database
- ✅ Generate strong `JWT_SECRET`
- ✅ Configure `FRONTEND_URL` for CORS
- ✅ Enable `ENABLE_SOCKETS` for real-time features
- ✅ Add `GROQ_API_KEY` for AI features


## 🧪 Development

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

### Backend Scripts
```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
```


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
