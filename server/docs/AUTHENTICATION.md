# Authentication Middleware Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Implementation Guide](#implementation-guide)
4. [Authentication Flow](#authentication-flow)
5. [Security Best Practices](#security-best-practices)
6. [Testing Guide](#testing-guide)
7. [Integration Steps](#integration-steps)
8. [Code Examples](#code-examples)
9. [API Documentation](#api-documentation)
10. [Troubleshooting](#troubleshooting)

---

## Introduction

### Purpose
This documentation explains how to implement JWT-based authentication middleware to protect the dashboard routes (`/api/dashboard/*`). The authentication system will ensure only authenticated job posters/admins can access candidate information and download CVs.

### Current State
- **Dashboard routes are publicly accessible** (no authentication required)
- All routes in `server/routes/dashboardRoutes.js` are open
- Anyone can view applications and download CVs

### Future State
- Dashboard routes will be protected by authentication middleware
- Users must log in and provide a valid JWT token
- Role-based access control (only job posters/admins can access)

### Authentication Strategy
- **JWT (JSON Web Tokens)** - Stateless, scalable, industry-standard
- Token-based authentication (no server-side session storage)
- Bearer token in Authorization header
- Role-based authorization for additional security

---

## Prerequisites

### Required npm Packages
```bash
npm install jsonwebtoken bcryptjs
```

### Package Descriptions
- **jsonwebtoken**: Generate and verify JWT tokens
- **bcryptjs**: Hash passwords securely

### Environment Variables

Add to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d

# Database (existing)
MONGODB_URI_LOCAL=mongodb://localhost:27017/ottonomi_jobs
MONGODB_URI_ATLAS=your-atlas-connection-string

# CORS (for production)
FRONTEND_URL=http://localhost:5173
```

### Database Model Requirements

You'll need to create a **User model** for storing authentication data.

---

## Implementation Guide

### Step 1: Create User Model

**File:** `server/models/User.js` (NEW)

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include password by default
  },
  role: {
    type: String,
    enum: ['job_seeker', 'recruiter', 'admin'],
    default: 'job_seeker',
  },
  company: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
```

**Why:**
- Password hashing before save (bcrypt with salt)
- Email validation with regex
- Role-based access control
- `select: false` prevents password exposure in queries

---

### Step 2: Create Authentication Middleware

**File:** `server/middleware/auth.js` (NEW)

```javascript
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

/**
 * Verify JWT token and authenticate user
 * Attaches user info to req.user
 */
export const authenticateUser = async (req, res, next) => {
  try {
    // Get token from Authorization header
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please log in.',
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database (exclude password)
    const user = await User.findById(decoded.userId)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please log in again.',
      });
    }

    // Attach user info to request object
    req.user = user;
    
    // Continue to next middleware/route handler
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again.',
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message,
    });
  }
};

/**
 * Check if authenticated user is a job poster (recruiter or admin)
 */
export const authorizeJobPoster = async (req, res, next) => {
  try {
    // req.user was attached by authenticateUser middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if user has the required role
    if (req.user.role !== 'admin' && req.user.role !== 'recruiter') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Job poster privileges required.',
      });
    }

    // User is authorized, continue
    next();
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization error',
      error: error.message,
    });
  }
};

/**
 * Optional: Check if user owns the specific job
 */
export const authorizeJobOwner = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { Job } = await import('../models/Job.js');
    
    const job = await Job.findById(jobId).lean();
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if current user is the job creator
    if (job.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own job applications.',
      });
    }

    next();
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization error',
      error: error.message,
    });
  }
};
```

**Key Features:**
- Extracts token from Authorization header
- Verifies token signature and expiration
- Attaches user to `req.user` for controllers to access
- Role-based authorization support
- Clear error messages for different failure cases

---

### Step 3: Create Auth Controller

**File:** `server/controllers/authController.js` (NEW)

```javascript
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'job_seeker',
      company,
    });

    // Generate token
    const token = generateToken(user._id);

    // Don't send password in response
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      data: userObj,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Don't send password in response
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: userObj,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

/**
 * Get current user info
 * GET /api/auth/me
 */
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is attached by authenticateUser middleware
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
};
```

---

### Step 4: Create Auth Routes

**File:** `server/routes/authRoutes.js` (NEW)

```javascript
import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register - Register new user
router.post('/register', register);

// POST /api/auth/login - Login user
router.post('/login', login);

// GET /api/auth/me - Get current user (requires authentication)
router.get('/me', authenticateUser, getCurrentUser);

export default router;
```

---

### Step 5: Register Auth Routes

**File:** `server/index.js`

Add the import and route:

```javascript
import authRoutes from './routes/authRoutes.js';

// After other imports...

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Dashboard routes (for job posters)
app.use('/api/dashboard', dashboardRoutes);
```

---

### Step 6: Protect Dashboard Routes

**File:** `server/routes/dashboardRoutes.js`

Update to add middleware:

```javascript
import express from 'express';
import {
    getAllJobsWithStats,
    getApplicationsForJob,
    getApplicationDetails,
    downloadApplicationCV,
    getDashboardStats
} from '../controllers/dashboardController.js';
import { authenticateUser, authorizeJobPoster } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to ALL dashboard routes
router.use(authenticateUser);

// Apply role-based authorization (job poster/admin only)
router.use(authorizeJobPoster);

// All routes below are now protected
// User must be logged in AND have job poster role

// GET /api/dashboard/stats - Overall dashboard statistics
router.get('/stats', getDashboardStats);

// GET /api/dashboard/jobs - Get all jobs with application counts
router.get('/jobs', getAllJobsWithStats);

// GET /api/dashboard/jobs/:jobId/applications - Get all applications for a job
router.get('/jobs/:jobId/applications', getApplicationsForJob);

// GET /api/dashboard/applications/:id - Get single application details
router.get('/applications/:id', getApplicationDetails);

// GET /api/dashboard/applications/:id/cv - Download CV file
router.get('/applications/:id/cv', downloadApplicationCV);

export default router;
```

**That's it!** With these two middleware calls, all dashboard routes are now protected.

---

## Authentication Flow

### Complete Request Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Client Request with Token                                │
│    GET /api/dashboard/jobs                                   │
│    Headers: { Authorization: "Bearer <token>" }            │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Express receives request                                 │
│    - Passes to dashboardRoutes                              │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. authenticateUser middleware runs                         │
│    ✓ Extract token from header                              │
│    ✓ Verify token signature                                 │
│    ✓ Decode user ID from token                              │
│    ✓ Fetch user from database                               │
│    ✓ Attach user to req.user                                │
│    ✓ Call next()                                            │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. authorizeJobPoster middleware runs                       │
│    ✓ Check req.user exists                                  │
│    ✓ Check if role is 'admin' or 'recruiter'               │
│    ✓ If valid: call next()                                  │
│    ✓ If invalid: return 403 Forbidden                       │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Dashboard controller executes                            │
│    - Access req.user for user info                          │
│    - Filter data based on permissions                       │
│    - Return response                                        │
└─────────────────────────────────────────────────────────────┘
```

### Login Flow

```
POST /api/auth/login
Body: { email: "recruiter@company.com", password: "secret123" }
                          ↓
1. Validate email and password
2. Find user in database
3. Compare password with hashed password
4. Generate JWT token
5. Return token and user data
                          ↓
Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "recruiter@company.com",
    "role": "recruiter",
    "name": "John Doe"
  }
}
```

---

## Security Best Practices

### 1. JWT Secret Management
```env
# Use a strong, random secret (min 32 characters)
JWT_SECRET=your-super-secret-random-key-minimum-32-characters-long-change-in-production

# Generate secure secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Token Expiration
```javascript
// Recommended: Short expiration times
JWT_EXPIRES_IN=7d    // For refresh tokens
JWT_EXPIRES_IN=1h    // For access tokens
```

### 3. Password Hashing
```javascript
// Always hash passwords - NEVER store plain text
const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash(password, salt);
```

### 4. HTTPS Requirements
```javascript
// In production, use HTTPS only
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  // Force HTTPS
}
```

### 5. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many login attempts, please try again later.'
});

router.post('/login', loginLimiter, login);
```

---

## Testing Guide

### Using Postman

#### 1. Register a User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "secure123",
  "role": "recruiter",
  "company": "TechCorp"
}
```

#### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@company.com",
  "password": "secure123"
}
```

**Save the token from response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": { ... }
}
```

#### 3. Access Protected Dashboard Route
```
GET http://localhost:5000/api/dashboard/jobs
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Using cURL

#### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@company.com","password":"secure123","role":"recruiter"}'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@company.com","password":"secure123"}'
```

#### Access Dashboard
```bash
curl http://localhost:5000/api/dashboard/jobs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Integration Steps

### Quick Integration Checklist

- [ ] Install packages: `npm install jsonwebtoken bcryptjs`
- [ ] Add environment variables to `.env`
- [ ] Create User model
- [ ] Create auth middleware
- [ ] Create auth controller
- [ ] Create auth routes
- [ ] Register auth routes in `index.js`
- [ ] Add middleware to dashboard routes
- [ ] Test registration and login
- [ ] Test protected routes

### Minimal Code Changes

Only **3 files** need to be modified to add authentication:

1. **`server/routes/dashboardRoutes.js`** - Add 2 lines:
```javascript
import { authenticateUser, authorizeJobPoster } from '../middleware/auth.js';
router.use(authenticateUser);
router.use(authorizeJobPoster);
```

2. **`server/index.js`** - Add 2 lines:
```javascript
import authRoutes from './routes/authRoutes.js';
app.use('/api/auth', authRoutes);
```

That's it! All existing dashboard controllers work unchanged.

---

## Code Examples

### Complete File Examples

All code files are documented in the sections above. See:
- [Step 1: User Model](#step-1-create-user-model)
- [Step 2: Auth Middleware](#step-2-create-authentication-middleware)
- [Step 3: Auth Controller](#step-3-create-auth-controller)
- [Step 4: Auth Routes](#step-4-create-auth-routes)
- [Step 6: Protected Dashboard Routes](#step-6-protect-dashboard-routes)

---

## API Documentation

### Public Auth Endpoints

#### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "secure123",
  "role": "recruiter",
  "company": "TechCorp"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@company.com",
    "role": "recruiter",
    "company": "TechCorp"
  }
}
```

#### POST /api/auth/login
Login user and get token.

**Request:**
```json
{
  "email": "john@company.com",
  "password": "secure123"
}
```

**Response:** Same as register

#### GET /api/auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@company.com",
    "role": "recruiter"
  }
}
```

### Protected Dashboard Endpoints

All these endpoints require `Authorization: Bearer <token>` header.

#### GET /api/dashboard/stats
Get overall dashboard statistics

#### GET /api/dashboard/jobs
Get all jobs with application counts

#### GET /api/dashboard/jobs/:jobId/applications
Get all applications for a specific job

#### GET /api/dashboard/applications/:id
Get single application details

#### GET /api/dashboard/applications/:id/cv
Download CV file for an application

---

## Troubleshooting

### Common Errors

#### "No token provided"
- **Cause:** Missing or incorrect Authorization header
- **Fix:** Include `Authorization: Bearer <token>` in headers

#### "Invalid token"
- **Cause:** Token signature doesn't match JWT_SECRET
- **Fix:** Use correct JWT_SECRET or get new token

#### "Token expired"
- **Cause:** Token past expiration time
- **Fix:** Login again to get new token

#### "Access denied. Job poster privileges required."
- **Cause:** User role is not 'recruiter' or 'admin'
- **Fix:** Update user role in database or register with correct role

#### "User not found"
- **Cause:** Token contains user ID that no longer exists
- **Fix:** Login again to get new token

### Debugging Tips

```javascript
// Log token in middleware for debugging
console.log('Token:', token);
console.log('Decoded:', decoded);

// Log user in controller
console.log('Authenticated user:', req.user);
```

### FAQ

**Q: Can I use this authentication with existing code?**
A: Yes! Minimal changes needed. Just add middleware to routes.

**Q: What happens to current public dashboard routes?**
A: They become protected. Users must login to access.

**Q: Can I make some routes public and others protected?**
A: Yes! Apply middleware selectively to specific routes.

**Q: How do I test protected routes?**
A: Use Postman or curl with Authorization header.

**Q: Should I use this in production?**
A: Yes, with these additions: HTTPS, rate limiting, token refresh mechanism.

---

## Summary

This authentication system provides:
- ✅ JWT-based token authentication
- ✅ Role-based authorization
- ✅ Secure password hashing
- ✅ Minimal code changes to existing code
- ✅ Production-ready security practices
- ✅ Clear separation of concerns
- ✅ Easy to test and debug

**Next Steps:**
1. Install required packages
2. Create User model
3. Create auth middleware and controllers
4. Apply middleware to dashboard routes
5. Test thoroughly
6. Deploy with HTTPS and rate limiting

For questions or issues, refer to this documentation.
