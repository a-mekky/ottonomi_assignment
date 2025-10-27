# Job Portal Backend API

A comprehensive REST API for job posting and candidate application management system built with Node.js and Express.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Server](#running-the-server)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
  - [Public Endpoints](#public-endpoints)
  - [Dashboard Endpoints](#dashboard-endpoints)
- [Features & Implementation](#features--implementation)
  - [Pagination System](#pagination-system)
  - [File Upload System](#file-upload-system)
  - [Error Handling](#error-handling)
  - [Request Logging](#request-logging)
  - [Input Validation](#input-validation)
- [Security Features](#security-features)
- [Performance Optimizations](#performance-optimizations)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)
- [Additional Resources](#additional-resources)

---

## Overview

This backend API provides a complete job portal system where:
- **Job Seekers** can browse job listings and submit applications with CV uploads
- **Job Posters** can create job postings, view applications, and download candidate CVs
- The system handles file uploads, data validation, pagination, and error management

**Key Characteristics:**
- RESTful API design
- MongoDB for data storage
- ES6 modules for modern JavaScript
- Modular architecture for maintainability
- Comprehensive error handling and validation
- Security best practices implementation

---

## Features

### ✨ Core Features

- ✅ **Job Management**: Create, list, and view job postings with full details
- ✅ **Application System**: Submit job applications with CV file uploads
- ✅ **Dashboard for Posters**: View all jobs with application statistics
- ✅ **Pagination**: Efficient data retrieval with configurable page size
- ✅ **File Upload**: Secure CV upload with file type and size validation
- ✅ **Input Validation**: Server-side validation for all user inputs
- ✅ **Request Logging**: HTTP request logging with Morgan
- ✅ **Error Handling**: Comprehensive error handling with cleanup
- ✅ **Security Headers**: Helmet.js for enhanced security
- ✅ **CORS Configuration**: Configurable cross-origin resource sharing

### 🔒 Security Features

- File type validation (PDF, DOC, DOCX only)
- File size limits (5MB maximum)
- Input sanitization and validation
- Secure file naming with timestamps and random suffixes
- SQL injection prevention through Mongoose validation
- XSS protection via Helmet middleware
- Environment-based CORS configuration

---

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **MongoDB** (Local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository** (if applicable)
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Configuration](#environment-configuration))

4. **Start the server**
   ```bash
   npm run dev    # Development mode with auto-reload
   # OR
   npm start      # Production mode
   ```

### Environment Configuration

Create a `.env` file in the `server` directory with the following variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | 5000 | No |
| `NODE_ENV` | Environment (development/production) | development | Yes |
| `MONGODB_URI_LOCAL` | Local MongoDB connection string | - | Yes (for local) |
| `MONGODB_URI_ATLAS` | MongoDB Atlas connection string | - | Yes (for production) |
| `UPLOAD_DIR` | Directory for uploaded files | uploads | No |
| `FRONTEND_URL` | Frontend URL for CORS | - | No (for production) |

**Example `.env` file:**
```env
PORT=5000
NODE_ENV=development
UPLOAD_DIR=uploads
MONGODB_URI_LOCAL=mongodb://localhost:27017/ottonomi_jobs
MONGODB_URI_ATLAS=mongodb+srv://user:pass@cluster.mongodb.net/ottonomi_jobs
FRONTEND_URL=http://localhost:5173
```

### Running the Server

**Development Mode:**
```bash
npm run dev
```
- Uses `node --watch` for auto-reload on file changes
- Shows detailed error messages
- Enables Morgan logging in 'dev' format

**Production Mode:**
```bash
npm start
```
- Uses standard Node.js execution
- Shows minimal error information
- Enables Morgan logging in 'combined' format

The server will start on `http://localhost:5000` (or your configured PORT).

---

## Project Structure

```
server/
├── config/
│   └── database.js           # MongoDB connection configuration
├── controllers/
│   ├── jobController.js       # Job-related business logic
│   ├── applicationController.js  # Application submission logic
│   └── dashboardController.js    # Dashboard and statistics logic
├── middleware/
│   ├── validateRequest.js    # Input validation middleware
│   └── uploadMiddleware.js   # File upload configuration
├── models/
│   ├── Job.js                # Job database schema
│   └── Application.js        # Application database schema
├── routes/
│   ├── jobRoutes.js          # Job API routes
│   ├── applicationRoutes.js  # Application API routes
│   └── dashboardRoutes.js    # Dashboard API routes
├── utils/
│   └── pagination.js         # Pagination helper functions
├── docs/
│   └── AUTHENTICATION.md     # Authentication implementation guide
├── uploads/                   # Directory for uploaded CV files
├── index.js                   # Main server entry point
└── package.json               # Dependencies and scripts
```

---

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | Latest LTS | Runtime environment |
| **Express** | ^5.1.0 | Web framework for REST API |
| **MongoDB** | Latest | NoSQL database |
| **Mongoose** | ^8.19.2 | MongoDB object modeling |
| **dotenv** | ^17.2.3 | Environment variable management |
| **Multer** | ^2.0.2 | File upload handling |
| **express-validator** | ^7.3.0 | Input validation |
| **Helmet** | ^8.1.0 | Security headers |
| **CORS** | ^2.8.5 | Cross-origin resource sharing |
| **Morgan** | ^1.10.1 | HTTP request logging |

### Package Descriptions

#### express-validator (^7.3.0)
- **Purpose**: Input validation and sanitization
- **Why**: Built on validator.js, provides chainable validation methods
- **Usage**: Validates job postings and application submissions

#### helmet (^8.1.0)
- **Purpose**: Set security-related HTTP headers
- **Why**: Mitigates common web vulnerabilities (XSS, clickjacking, etc.)
- **Usage**: Applied globally to protect all endpoints

#### cors (^2.8.5)
- **Purpose**: Enable CORS with configuration
- **Why**: Allows frontend to communicate with API from different origins
- **Usage**: Configured with environment-based origin whitelisting

#### morgan (^1.10.1)
- **Purpose**: HTTP request logger middleware
- **Why**: Logs requests for debugging and monitoring
- **Usage**: Different log formats for development and production

#### dotenv (^17.2.3)
- **Purpose**: Load environment variables from `.env` file
- **Why**: Centralized configuration management
- **Usage**: Loads all configuration at startup

---

## Database Models

### Job Model

**Schema:** `server/models/Job.js`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | Yes | Job title (max 200 chars) |
| `company` | String | Yes | Company name |
| `description` | String | Yes | Job description (min 50 chars) |
| `location` | String | No | Job location |
| `salary` | String | No | Salary information |
| `datePosted` | Date | Auto | Date when job was posted |
| `createdAt` | Date | Auto | Document creation timestamp |
| `updatedAt` | Date | Auto | Document update timestamp |

**Indexes:**
- `datePosted: -1` - For efficient sorting by posting date

**Purpose:** Stores job posting information

---

### Application Model

**Schema:** `server/models/Application.js`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Applicant's full name |
| `email` | String | Yes | Applicant's email address |
| `jobId` | ObjectId | Yes | Reference to Job document |
| `cvPath` | String | Yes | File path to uploaded CV |
| `appliedAt` | Date | Auto | Application submission date |
| `createdAt` | Date | Auto | Document creation timestamp |
| `updatedAt` | Date | Auto | Document update timestamp |

**Indexes:**
- `{ email: 1, jobId: 1 }` (unique) - Prevents duplicate applications
- `{ jobId: 1, appliedAt: -1 }` - Optimizes querying applications by job

**Purpose:** Stores candidate applications with CV file references

---

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Public Endpoints

#### GET /jobs
Get paginated list of all job postings.

**Query Parameters:**
| Parameter | Type | Default | Max | Description |
|-----------|------|--------|-----|-------------|
| `page` | number | 1 | ∞ | Page number |
| `limit` | number | 12 | 100 | Items per page |
| `sort` | string | -datePosted | - | Sort field (prefix `-` for descending) |

**Response (200 OK):**
```json
{
  "success": true,
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 47,
    "itemsPerPage": 12,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Senior React Developer",
      "company": "TechCorp",
      "description": "We are looking for...",
      "location": "Remote",
      "salary": "$100k - $150k",
      "datePosted": "2025-10-20T10:00:00.000Z",
      "createdAt": "2025-10-20T10:00:00.000Z",
      "updatedAt": "2025-10-20T10:00:00.000Z"
    }
  ]
}
```

**Example:**
```bash
curl "http://localhost:5000/api/jobs?page=1&limit=10&sort=-datePosted"
```

---

#### GET /jobs/:id
Get single job posting by ID.

**URL Parameters:**
- `id` - MongoDB ObjectId of the job

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Senior React Developer",
    "company": "TechCorp",
    "description": "We are looking for...",
    "location": "Remote",
    "salary": "$100k - $150k",
    "datePosted": "2025-10-20T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Invalid job ID format
- `404` - Job not found

---

#### POST /jobs
Create a new job posting.

**Request Body:**
```json
{
  "title": "Senior React Developer",
  "company": "TechCorp",
  "description": "We are looking for an experienced React developer...",
  "location": "Remote",
  "salary": "$100k - $150k"
}
```

**Validation Rules:**
- `title`: Required, max 200 characters
- `company`: Required
- `description`: Required, min 50 characters
- `location`: Optional
- `salary`: Optional

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Senior React Developer",
    "company": "TechCorp",
    "description": "We are looking for...",
    "datePosted": "2025-10-20T10:00:00.000Z"
  }
}
```

---

#### POST /applications
Submit a job application with CV file upload.

**Request:**
- Content-Type: `multipart/form-data`
- Body fields:
  - `name` (string, required) - Applicant's name
  - `email` (string, required) - Valid email address
  - `jobId` (string, required) - Valid MongoDB ObjectId
  - `cv` (file, required) - PDF, DOC, or DOCX file (max 5MB)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@example.com",
    "jobId": "507f1f77bcf86cd799439011",
    "cvPath": "uploads/1234567890-filename.pdf",
    "appliedAt": "2025-10-20T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing or invalid file, validation errors
- `404` - Job not found
- `409` - Duplicate application (already applied)
- `500` - Server error (file cleanup handled automatically)

**Features:**
- Automatic file cleanup on errors
- Race condition handling for duplicate submissions
- File type and size validation

---

### Dashboard Endpoints

#### GET /dashboard/stats
Get overall dashboard statistics.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalJobs": 47,
      "totalApplications": 152,
      "recentJobs": 12,
      "recentApplications": 45
    },
    "topJobs": [
      {
        "title": "Senior React Developer",
        "company": "TechCorp",
        "applicationCount": 23
      }
    ]
  }
}
```

---

#### GET /dashboard/jobs
Get all jobs with application statistics (paginated).

**Query Parameters:**
| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | number | 1 | ∞ | Page number |
| `limit` | number | 12 | 100 | Items per page |
| `sort` | string | -datePosted | - | Sort field |

**Response (200 OK):**
```json
{
  "success": true,
  "pagination": {
    "currentPage": 1,
    "totalPages": 4,
    "totalItems": 47,
    "itemsPerPage": 12,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Senior React Developer",
      "company": "TechCorp",
      "applicationCount": 23,
      "latestApplication": "2025-10-24T10:30:00.000Z",
      "datePosted": "2025-10-20T10:00:00.000Z"
    }
  ]
}
```

**Note:** Currently public (authentication can be added - see `docs/AUTHENTICATION.md`)

---

#### GET /dashboard/jobs/:jobId/applications
Get all applications for a specific job (paginated).

**URL Parameters:**
- `jobId` - MongoDB ObjectId of the job

**Query Parameters:**
| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | number | 1 | ∞ | Page number |
| `limit` | number | 12 | 100 | Items per page |
| `sort` | string | -appliedAt | - | Sort field |

**Response (200 OK):**
```json
{
  "success": true,
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 23,
    "itemsPerPage": 12,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "job": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Senior React Developer",
    "company": "TechCorp",
    "location": "Remote",
    "datePosted": "2025-10-20T10:00:00.000Z"
  },
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com",
      "cvPath": "uploads/1234567890-cv.pdf",
      "appliedAt": "2025-10-24T10:30:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `400` - Invalid job ID format
- `404` - Job not found

---

#### GET /dashboard/applications/:id
Get single application details with populated job information.

**URL Parameters:**
- `id` - MongoDB ObjectId of the application

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@example.com",
    "cvPath": "uploads/1234567890-cv.pdf",
    "appliedAt": "2025-10-24T10:30:00.000Z",
    "jobId": {
      "title": "Senior React Developer",
      "company": "TechCorp",
      "location": "Remote",
      "salary": "$100k - $150k",
      "description": "We are looking for...",
      "datePosted": "2025-10-20T10:00:00.000Z"
    }
  }
}
```

---

#### GET /dashboard/applications/:id/cv
Download CV file for an application.

**URL Parameters:**
- `id` - MongoDB ObjectId of the application

**Response:**
- **200 OK**: File download with appropriate headers
  - `Content-Type`: Based on file extension (pdf, doc, docx)
  - `Content-Disposition`: Attachment with filename

**Error Responses:**
- `400` - Invalid application ID format
- `404` - Application not found or CV file not found on server

---

## Features & Implementation

### Pagination System

**Purpose:** Efficiently handle large datasets by limiting the number of results per request.

**Implementation:** `server/utils/pagination.js`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12, max: 100)
- `sort`: Sort field with optional `-` prefix for descending order

**Benefits:**
- Reduced data transfer
- Faster API responses
- Lower database load
- Better user experience
- Scalability for large datasets

**Response Structure:**
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 47,
    "itemsPerPage": 12,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Why:** Prevents loading thousands of records at once, improving performance and user experience.

---

### File Upload System

**Implementation:** `server/middleware/uploadMiddleware.js`

**Features:**
- **File Type Validation**: Only PDF, DOC, and DOCX files allowed
- **Size Limit**: 5MB maximum file size
- **Secure Filenames**: Timestamp + random number + sanitized original name
- **Unique Naming**: Prevents filename conflicts and overwrites
- **Directory Management**: Automatically creates upload directory if missing

**Supported File Types:**
- `application/pdf`
- `application/msword` (.doc)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (.docx)

**Storage:**
- Files stored in `uploads/` directory (configurable via `UPLOAD_DIR`)
- Accessible via static file serving at `/uploads/filename`
- Automatic cleanup on validation errors or duplicate applications

**Why:** Secure file handling prevents malicious uploads and ensures data integrity.

---

### Error Handling

**Approach:** Multi-layer error handling with automatic cleanup.

**Layers:**

1. **Global Error Handler** (`index.js`)
   - Catches all unhandled errors
   - Returns user-friendly messages
   - Logs detailed errors in development mode

2. **Controller-Level Error Handling**
   - Try-catch blocks in all controller functions
   - Proper return statements to prevent "headers already sent" errors
   - File cleanup on application submission failures

3. **File Cleanup on Errors**
   - Validates job exists before saving application
   - Checks for duplicate applications
   - Handles race conditions with MongoDB unique index
   - Cleans up uploaded files if any error occurs

4. **Validation Errors**
   - Express-validator catches validation errors before processing
   - Returns detailed error messages
   - Cleans up uploaded files if validation fails

**Example Error Response:**
```json
{
  "success": false,
  "message": "Application submission failed",
  "error": "You have already applied to this job"
}
```

**Why:** Ensures no orphaned files, provides clear error messages, and maintains data consistency.

---

### Request Logging

**Implementation:** Morgan middleware

**Configuration:**
- **Development**: `morgan('dev')` - Colored, concise output
- **Production**: `morgan('combined')` - Apache combined log format

**What Gets Logged:**
- HTTP method and URL
- Status code
- Response time
- IP address

**Why:** Essential for debugging, monitoring, and analyzing API usage patterns.

---

### Input Validation

**Implementation:** express-validator

**Job Validation:**
- `title`: Required, max 200 characters
- `company`: Required
- `description`: Required, minimum 50 characters
- `location`: Optional
- `salary`: Optional

**Application Validation:**
- `name`: Required
- `email`: Required, must be valid email format
- `jobId`: Required, must be valid MongoDB ObjectId

**Why:** Prevents invalid data from entering the database, protects against malicious input.

---

## Security Features

### Helmet.js
Sets security-related HTTP headers to protect against:
- Cross-site scripting (XSS)
- Clickjacking
- MIME-type sniffing
- And other common web vulnerabilities

### CORS Configuration
- Development: Allows all origins (`*`)
- Production: Restricted to specified `FRONTEND_URL`

### File Upload Security
- File type whitelist (only PDF, DOC, DOCX)
- File size limit (5MB)
- Filename sanitization (removes special characters)
- Unique filename generation (prevents overwriting)

### Input Sanitization
- Express-validator for all inputs
- MongoDB ObjectId validation
- Email format validation
- String trimming and length validation

**Why:** Protects against common web vulnerabilities and ensures data integrity.

---

## Performance Optimizations

### Database Indexes
- `Job.datePosted: -1` - Fast sorting by posting date
- `Application.jobId: 1, appliedAt: -1` - Efficient application queries
- `Application.email: 1, jobId: 1` (unique) - Prevents duplicates, speeds up lookups

### Lean Queries
- Uses `.lean()` for read-only operations
- Returns plain JavaScript objects instead of Mongoose documents
- Reduces memory usage and improves response times

### Aggregation Optimization
- Limits aggregation to only paginated job IDs
- Reduces processing time for dashboard statistics

### Static File Serving
- Files served directly by Express
- No additional server or CDN required
- Efficient for development and small-scale deployments

**Why:** Ensures fast API responses and efficient database queries, especially with large datasets.

---

## Testing

### Testing with cURL

**Get all jobs:**
```bash
curl "http://localhost:5000/api/jobs?page=1&limit=10"
```

**Create a job:**
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Developer","company":"TechCorp","description":"We are looking for an experienced developer to join our team...","location":"Remote"}'
```

**Submit an application:**
```bash
curl -X POST http://localhost:5000/api/applications \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "jobId=507f1f77bcf86cd799439011" \
  -F "cv=@/path/to/cv.pdf"
```

**Get dashboard stats:**
```bash
curl http://localhost:5000/api/dashboard/stats
```

### Testing Pagination

Test pagination with different parameters:
```bash
# Page 1
curl "http://localhost:5000/api/jobs?page=1&limit=10"

# Page 2
curl "http://localhost:5000/api/jobs?page=2&limit=10"

# Sort by title ascending
curl "http://localhost:5000/api/jobs?sort=title"

# Sort by date descending
curl "http://localhost:5000/api/jobs?sort=-datePosted"
```

### Testing Error Scenarios

**Invalid job ID:**
```bash
curl http://localhost:5000/api/jobs/invalid-id
# Expected: 400 Bad Request
```

**Missing required fields:**
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Developer"}'
# Expected: 400 Validation Error
```

**Duplicate application:**
```bash
# Submit application twice
curl -X POST http://localhost:5000/api/applications \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "jobId=507f1f77bcf86cd799439011" \
  -F "cv=@cv.pdf"
# Expected: 409 Conflict
```

---

## Future Enhancements

### Authentication System
- JWT-based authentication for secure access
- Role-based authorization (job seeker, recruiter, admin)
- Protected dashboard routes
- **See:** `docs/AUTHENTICATION.md` for implementation guide

### Rate Limiting
- Prevent abuse and DDoS attacks
- Limit requests per IP address
- Different limits for different endpoints

### Search Functionality
- Full-text search for job titles and descriptions
- MongoDB text indexes for efficient searching
- Filter by company, location, salary range

### Filtering
- Filter jobs by company, location, salary
- Filter applications by date range
- Multiple filter combinations

### Application Status Tracking
- Status: pending, reviewed, accepted, rejected
- Status update endpoints
- Email notifications on status changes

### Job Ownership
- Track who posted each job
- Job posters can only see their own job applications
- Admin can see all jobs

---

## Additional Resources

### Documentation
- **Authentication Guide**: `server/docs/AUTHENTICATION.md` - Complete JWT authentication implementation guide
- **Express.js**: https://expressjs.com/
- **Mongoose**: https://mongoosejs.com/
- **Multer**: https://github.com/expressjs/multer

### MongoDB
- **Local Setup**: https://docs.mongodb.com/manual/installation/
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Best Practices**: https://docs.mongodb.com/manual/administration/operational-checklist/

### Security
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Helmet.js**: https://helmetjs.github.io/
- **express-validator**: https://express-validator.github.io/docs/

---

## Project Status

✅ **Implemented:**
- Job posting and management
- Application submission with CV uploads
- Dashboard with statistics
- Pagination for all list endpoints
- Comprehensive error handling
- File upload security
- Input validation
- Request logging

🚧 **Future Enhancements:**
- Authentication and authorization (documentation ready)
- Rate limiting
- Search and filtering
- Application status tracking
- Job ownership

---