# JobBoard - Full-Stack Job Posting Platform

A modern web application for posting jobs and managing candidate applications, built with React and Node.js.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Project Architecture](#project-architecture)
- [Technology Stack](#technology-stack)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Development Workflow](#development-workflow)

---

## Overview

JobBoard is a full-stack job posting platform that enables companies to post job openings and candidates to apply with their CVs. The system provides a comprehensive dashboard for tracking applications and managing job postings.

**Core Functionality:**
- Job seekers can browse and apply to job openings
- Employers can post jobs and manage applications
- Dashboard with statistics and application tracking
- Secure CV file upload and management

---

## Quick Start

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **MongoDB** (Local installation or MongoDB Atlas account)
- **npm** package manager

### Installation

1. **Clone the repository** (if applicable)

   ```bash
   git clone <repository-url>
   cd ottonomi_assessment
   ```

2. **Install Server Dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration**

   **Server Configuration** (`server/.env`):

   ```env
   PORT=5000
   NODE_ENV=development
   UPLOAD_DIR=uploads
   MONGODB_URI_LOCAL=mongodb://localhost:27017/ottonomi_jobs
   MONGODB_URI_ATLAS=your-atlas-connection-string
   FRONTEND_URL=http://localhost:5173
   ```

   **Client Configuration** (`client/.env`):

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the Application**

   **Terminal 1 - Start Server:**

   ```bash
   cd server
   npm run dev
   ```

   Server will run on `http://localhost:5000`

   **Terminal 2 - Start Client:**

   ```bash
   cd client
   npm run dev
   ```

   Client will run on `http://localhost:5173`

### Verification

- Server health check: http://localhost:5000/health
- Client application: http://localhost:5173

---

## Project Architecture

The application follows a **monorepo structure** with clear separation between frontend and backend.

```
┌─────────────────────────────────────────┐
│           React Client (Vite)           │
│  - Pages & Components                   │
│  - Custom Hooks                          │
│  - API Services                          │
│  - Tailwind CSS Styling                 │
└─────────────┬───────────────────────────┘
              │ HTTP REST API
              ↓
┌─────────────────────────────────────────┐
│      Express Backend (Node.js)          │
│  - RESTful API Endpoints                │
│  - Controllers & Middleware             │
│  - File Upload Handling                 │
│  - MongoDB Integration                  │
└─────────────┬───────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────┐
│         MongoDB Database                 │
│  - Jobs Collection                      │
│  - Applications Collection              │
└─────────────────────────────────────────┘
```

**Key Components:**

- **Frontend**: Single-page React application with routing, component-based architecture, and custom hooks for data fetching
- **Backend**: RESTful API with Express, Mongoose for database operations, Multer for file uploads
- **Database**: MongoDB with Mongoose ODM for data modeling and validation
- **File Storage**: Local file storage for CV uploads with secure naming and validation

For detailed architecture documentation, see:
- Frontend details: [`client/README.md`](client/README.md#project-structure)
- Backend details: [`server/README.md`](server/README.md#project-structure)

---

## Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.1.1 | UI library with concurrent features |
| Vite | 7.1.7 | Build tool with HMR |
| React Router DOM | 7.9.4 | Client-side routing |
| Tailwind CSS | 4.1.16 | Utility-first CSS framework |
| Lucide React | 0.546.0 | Icon library |
| Axios | 1.12.2 | HTTP client |
| Date-fns | 4.1.0 | Date formatting |

### Backend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | Latest LTS | Runtime environment |
| Express | 5.1.0 | Web framework |
| MongoDB | Latest | NoSQL database |
| Mongoose | 8.19.2 | MongoDB object modeling |
| Multer | 2.0.2 | File upload handling |
| Express-validator | 7.3.0 | Input validation |
| Helmet | 8.1.0 | Security headers |
| CORS | 2.8.5 | Cross-origin resource sharing |
| Morgan | 1.10.1 | HTTP request logging |

### Development Tools

- **ESLint** - Code linting and quality assurance
- **Autoprefixer** - CSS vendor prefixing
- **PostCSS** - CSS processing

For detailed technology explanations and implementation decisions, see:
- Frontend: [`client/README.md`](client/README.md#technology-stack)
- Backend: [`server/README.md`](server/README.md#technology-stack)

---

## Key Features

### ✨ Core Capabilities

- **Job Management**: Create, list, and view detailed job postings
- **Application System**: Submit applications with CV file uploads
- **Dashboard Analytics**: Statistics overview with application counts
- **File Upload**: Secure CV upload with validation (PDF, DOC, DOCX)
- **Pagination**: Efficient data retrieval for large datasets
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### 🔒 Security Features

- Input validation on both client and server
- File type and size restrictions (5MB max)
- Secure filename generation for uploads
- Helmet.js security headers
- CORS configuration for production
- XSS protection

### 📊 Dashboard Features

- Total jobs and applications count
- Recent activity tracking (7 days)
- Top 5 jobs by application count
- Applications per job view
- CV download functionality

For complete feature lists and implementation details:
- Frontend features: [`client/README.md`](client/README.md#pages)
- Backend features: [`server/README.md`](server/README.md#features)
- API documentation: [`server/README.md`](server/README.md#api-endpoints)

---

## Project Structure

```
ottonomi_assessment/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page-level components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API integration
│   │   └── utils/         # Helper functions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
├── server/                 # Express backend API
│   ├── controllers/       # Business logic
│   ├── models/           # Database schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── config/           # Configuration files
│   ├── uploads/          # CV file storage
│   └── package.json      # Backend dependencies
│
└── README.md              # This file
```

For detailed project structure:
- Frontend structure: [`client/README.md`](client/README.md#project-structure)
- Backend structure: [`server/README.md`](server/README.md#project-structure)

---

## Documentation

### Main Documentation Files

- **Frontend Documentation**: [`client/README.md`](client/README.md)
  - Component architecture
  - Custom hooks usage
  - Page implementations
  - Styling approach

- **Backend Documentation**: [`server/README.md`](server/README.md)
  - API endpoints
  - Database models
  - Middleware and controllers
  - Error handling

- **Authentication Guide**: [`server/docs/AUTHENTICATION.md`](server/docs/AUTHENTICATION.md)
  - JWT implementation guide
  - Middleware setup
  - Future authentication features

### Quick Links

**Client Documentation Sections:**
- [Pages & Routes](client/README.md#pages)
- [Components](client/README.md#components)
- [Custom Hooks](client/README.md#custom-hooks)
- [API Service](client/README.md#services)
- [Utilities](client/README.md#utilities)

**Server Documentation Sections:**
- [API Endpoints](server/README.md#api-endpoints)
- [Database Models](server/README.md#database-models)
- [Features & Implementation](server/README.md#features--implementation)
- [Security Features](server/README.md#security-features)
- [Testing Guide](server/README.md#testing)

---

## Development Workflow

### Running in Development

**Both servers run concurrently:**

1. **Start MongoDB** (if using local installation)

2. **Run Server** (Terminal 1):

   ```bash
   cd server
   npm run dev
   ```

   Features:
   - Auto-reload on file changes
   - Detailed error messages
   - Morgan request logging

3. **Run Client** (Terminal 2):

   ```bash
   cd client
   npm run dev
   ```

   Features:
   - Hot Module Replacement (HMR)
   - Fast refresh for React
   - Instant updates without page reload

### Build for Production

**Build Client:**

```bash
cd client
npm run build
```

Output: `client/dist/`

**Start Server in Production:**

```bash
cd server
npm start
```

### Available Scripts

**Server Scripts:**

```bash
npm start        # Production mode
npm run dev      # Development with auto-reload
```

**Client Scripts:**

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

For complete development workflow details:
- Client: [`client/README.md`](client/README.md#development-workflow)
- Server: [`server/README.md`](server/README.md#getting-started)

---

## Additional Information

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features required
- Mobile responsive (iOS Safari, Chrome Mobile)

### Production Deployment

The client is configured for deployment on Netlify with:
- Automatic redirects for SPA routing
- Node.js 22 environment
- Build command: `npm run build`

See `client/netlify.toml` for deployment configuration.


## Support & Resources

### Project Status

✅ **Implemented:**
- Complete job posting system
- Application submission with CV uploads
- Dashboard with statistics
- Secure file handling
- Responsive UI

🚧 **Future Enhancements:**
- JWT authentication (documentation ready)
- Search and filtering
- Rate limiting
- Application status tracking

