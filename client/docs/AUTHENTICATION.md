# Client-Side Authentication Documentation

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
This documentation explains how to implement client-side authentication for the JobBoard React application. The authentication system will protect dashboard routes, manage user sessions, and provide login/register flows.

### Current State
- **All routes are publicly accessible** (no authentication required)
- Users can access dashboard without logging in
- No user sessions or token management
- No login or registration pages

### Future State
- Dashboard routes will be protected by authentication
- Users must log in to access their dashboard
- JWT tokens stored in localStorage for persistence
- Login and registration pages
- Automatic token validation on app load
- Token expiration handling with auto-logout

### Authentication Strategy
- **JWT Token Storage**: localStorage for persistence across sessions
- **Axios Interceptors**: Automatic token injection in requests
- **Protected Routes**: React Router route guards
- **Auth Context**: Centralized authentication state management
- **Token Refresh**: Optional token validation on mount

---

## Prerequisites

### Required Understanding
- React Context API for state management
- React Router DOM for route protection
- Axios interceptors for token handling
- localStorage API for token storage

### No Additional Packages Required
- Uses existing `axios` for API calls
- Uses existing `react-router-dom` for routing
- Uses React built-in `createContext` and `useContext`

### Environment Setup
Ensure your `.env` file has the correct API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Implementation Guide

### Step 1: Create Auth Context

**File:** `src/contexts/AuthContext.jsx` (NEW)

**Purpose**: Centralized authentication state management

**Features**:
- User and token state
- Login/logout functions
- Token persistence in localStorage
- Automatic token loading on mount
- Error and loading states

**Key Functions**:
- `login(token, user)` - Store token and user data
- `logout()` - Clear auth state and navigate to login
- `register(token, user)` - Similar to login, navigate to dashboard
- `checkAuth()` - Validate token with backend
- `clearError()` - Clear error messages

**State Structure**:
```javascript
{
  user: null | { id, name, email, role, company },
  token: null | string,
  loading: boolean,
  error: null | string
}
```

**Why**:
- Centralized authentication state accessible throughout app
- Automatic token persistence and loading
- Single source of truth for auth status
- Easy to add features like "remember me"

---

### Step 2: Create Auth Service

**File:** `src/services/authService.js` (NEW)

**Purpose**: API calls for authentication operations

**Functions**:
- `register(userData)` - POST /api/auth/register
- `login(credentials)` - POST /api/auth/login
- `getCurrentUser()` - GET /api/auth/me
- `logout()` - Clear local data (no API call needed)

**Error Handling**:
- Transform API errors to user-friendly messages
- Handle network failures
- Validate response data
- Extract token from response

**Why**:
- Separation of API logic from components
- Reusable across login/register pages
- Consistent error handling
- Easy to mock for testing

---

### Step 3: Create Protected Route Component

**File:** `src/components/auth/ProtectedRoute.jsx` (NEW)

**Purpose**: Route guard that checks authentication before rendering

**Features**:
- Check if user is authenticated
- Redirect to login if not authenticated
- Save attempted route for redirect after login
- Optional role-based access control
- Show loading state during auth check

**Props**:
- `children` - Component to render if authenticated
- `requiredRole` - Optional role requirement ('recruiter', 'admin')
- `redirectTo` - Optional redirect path (default: '/login')

**Why**:
- Clean route protection without repetitive code
- Centralized auth checking logic
- Save intended destination for better UX
- Support for role-based access control

---

### Step 4: Create Login Page

**File:** `src/pages/Login.jsx` (NEW)

**Purpose**: User login interface

**Features**:
- Email and password input fields
- Form validation with error display
- Loading state during submission
- Error handling for invalid credentials
- Link to registration page
- Redirect after successful login
- Remember return URL from navigation

**State Management**:
- Form data (email, password)
- Validation errors
- Loading state
- Form-level errors

**User Flow**:
1. User enters credentials
2. Validate form fields
3. Call authService.login()
4. Store token and user in context
5. Navigate to dashboard or saved return URL
6. Show error if login fails

**Why**:
- Simple, focused login experience
- Clear error messages
- Fast feedback on validation
- Smooth navigation after success

---

### Step 5: Create Register Page

**File:** `src/pages/Register.jsx` (NEW)

**Purpose**: User registration interface

**Features**:
- Name, email, password, role, company fields
- Form validation with immediate feedback
- Role selection (job_seeker or recruiter)
- Company field for recruiters
- Password confirmation (optional)
- Error handling for duplicate emails
- Redirect to dashboard after registration

**State Management**:
- Form data with all fields
- Per-field validation errors
- Loading state
- Success state

**User Flow**:
1. User enters registration data
2. Client-side validation
3. Call authService.register()
4. Store token and user in context
5. Navigate to dashboard
6. Show error if registration fails

**Why**:
- Capture required user information
- Role-based onboarding
- Immediate validation feedback
- Seamless registration to dashboard

---

### Step 6: Update API Service with Interceptors

**File:** `src/services/api.js` (MODIFY)

**Changes**:
- Add request interceptor to inject token
- Add response interceptor to handle 401 errors
- Auto-logout on token expiration
- Clear auth state on unauthorized errors

**Request Interceptor**:
```javascript
// Add Authorization header if token exists
const token = localStorage.getItem('authToken');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

**Response Error Interceptor**:
```javascript
if (error.response?.status === 401) {
  // Clear auth state
  // Redirect to login
  // Show session expired message
}
```

**Why**:
- Automatic token injection for all requests
- Centralized error handling
- Seamless token expiration handling
- No manual header management needed

---

### Step 7: Update App Routing

**File:** `src/App.jsx` (MODIFY)

**Changes**:
- Wrap entire app with AuthProvider
- Add /login and /register routes
- Wrap dashboard routes with ProtectedRoute
- Add logout route (optional)

**New Routes**:
```javascript
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
```

**Protected Routes**:
```javascript
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

**Why**:
- Centralized route protection
- AuthProvider available to all components
- Clean separation of public and protected routes
- Easy to add/remove protected routes

---

### Step 8: Update Header Navigation

**File:** `src/components/layout/Header.jsx` (MODIFY)

**Changes**:
- Conditional navigation based on auth state
- Show "Login"/"Register" when not authenticated
- Show user name and "Logout" when authenticated
- Optional role-based link visibility

**Conditional Rendering**:
```javascript
{isAuthenticated ? (
  <>
    <span>Welcome, {user.name}</span>
    <button onClick={logout}>Logout</button>
  </>
) : (
  <>
    <Link to="/login">Login</Link>
    <Link to="/register">Register</Link>
  </>
)}
```

**Why**:
- Clear visual indication of auth status
- Easy navigation to auth pages
- Prominent logout option
- Better user experience

---

## Authentication Flow

### Complete Login Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User visits Login page                                   │
│    GET /login                                                │
│    Component: Login.jsx                                      │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. User enters credentials and submits                      │
│    - Email: recruiter@company.com                           │
│    - Password: secret123                                    │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Form validation runs (client-side)                       │
│    ✓ Email format check                                     │
│    ✓ Password required check                                │
│    ✓ Set loading state                                      │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. authService.login() called                               │
│    POST /api/auth/login                                     │
│    Body: { email, password }                               │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Server validates credentials                             │
│    ✓ Email exists in database                              │
│    ✓ Password matches hashed password                       │
│    ✓ Generate JWT token                                     │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Server response received                                 │
│    {                                                         │
│      success: true,                                         │
│      token: "eyJhbGci...",                                  │
│      data: { id, name, email, role }                       │
│    }                                                        │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. AuthContext.login() called                               │
│    ✓ Store token in localStorage                           │
│    ✓ Store user in context state                           │
│    ✓ Set isAuthenticated = true                             │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. Navigate to dashboard                                    │
│    Router.push('/dashboard')                                │
│    or Router.push(savedReturnUrl)                           │
└─────────────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. ProtectedRoute checks auth                               │
│    ✓ isAuthenticated = true                                │
│    ✓ Render Dashboard component                            │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 10. Dashboard makes API calls                              │
│     GET /api/dashboard/stats                                │
│     GET /api/dashboard/jobs                                  │
│     Headers: { Authorization: "Bearer token" }             │
└─────────────────────────────────────────────────────────────┘
```

### Protected Route Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User navigates to protected route                       │
│    GET /dashboard/jobs/123/candidates                      │
│    or click on "View Candidates" button                   │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. ProtectedRoute component mounts                         │
│    - Check AuthContext.isAuthenticated                      │
│    - Check if token exists in localStorage                │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
                       ├─── Authenticated? ──YES→ Step 3
                       │
                       NO↓
┌─────────────────────────────────────────────────────────────┐
│ 3a. User not authenticated                                │
│     - Save current pathname as returnUrl                  │
│     - Router.push('/login?returnUrl=/dashboard/...')       │
│     - Render nothing (redirecting)                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3b. User authenticated                                    │
│     - Check optional requiredRole                          │
│     - If role check fails: show access denied              │
│     - If role check passes: render children                │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Component renders (e.g., JobCandidates)                  │
│     - Makes API call with token in header                 │
│     - Server validates token and returns data              │
│     - Component displays data                              │
└─────────────────────────────────────────────────────────────┘
```

### Token Expiration Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User is on Dashboard (authenticated)                    │
│    Token in localStorage                                    │
│    Time: Token expires in 30 seconds                        │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. User clicks "View Candidates"                          │
│    Component makes API call                                 │
│    GET /api/dashboard/jobs/:id/applications                │
│    Headers: { Authorization: "Bearer expired-token" }       │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Server receives request                                │
│    ✓ Token provided in header                             │
│    ✗ Token signature invalid or expired                   │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Server returns error                                    │
│    Status: 401 Unauthorized                                │
│    {                                                        │
│      success: false,                                        │
│      message: "Token expired. Please log in again."        │
│    }                                                       │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Axios response interceptor catches error               │
│    if (error.response?.status === 401) {                   │
│      // Token expired or invalid                           │
│    }                                                       │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Execute logout logic                                    │
│    ✓ Clear token from localStorage                        │
│    ✓ Clear user from context                               │
│    ✓ Set isAuthenticated = false                           │
│    ✓ Show "Session expired" toast message                 │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Redirect to login page                                  │
│    Router.push('/login?returnUrl=/dashboard/jobs/...')     │
│    Clear auth state                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Best Practices

### 1. Token Storage in localStorage

**Why localStorage**:
- Persists across browser sessions
- Available across all tabs
- Easy to implement and access
- No server-side session needed

**Security Considerations**:
- XSS attacks can access localStorage
- Never log tokens to console in production
- HTTPS only in production
- Token expiration mitigates stolen tokens

**Implementation**:
```javascript
// Store token
localStorage.setItem('authToken', token);

// Retrieve token
const token = localStorage.getItem('authToken');

// Remove token
localStorage.removeItem('authToken');
```

### 2. HTTPS Requirements

**Production Configuration**:
```javascript
if (process.env.NODE_ENV === 'production') {
  // Check protocol
  if (window.location.protocol !== 'https:') {
    // Warn user or redirect
    console.warn('Non-secure connection detected');
  }
}
```

**Why HTTPS**:
- Encrypts data in transit
- Protects tokens from man-in-the-middle attacks
- Required for production deployment

### 3. Secure Password Handling

**Password Input**:
```javascript
<input type="password" />
// Never store passwords
// Use password type to hide input
// Add show/hide toggle for UX
```

**Password Validation**:
- Minimum 6 characters (server enforced)
- Client-side validation for immediate feedback
- Strength indicators (optional)

### 4. Automatic Token Injection

**Request Interceptor**:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Why**:
- No manual header management needed
- Consistent across all API calls
- Automatic and error-prone

### 5. Logout on Unauthorized

**Response Interceptor**:
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logout user
      AuthContext.logout();
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Why**:
- Immediate logout on token expiration
- Prevents stale auth state
- Clear user feedback

---

## Testing Guide

### Manual Testing Steps

#### 1. Test User Registration
```
1. Navigate to /register
2. Fill in name, email, password, role
3. Click "Register"
4. Verify: Redirected to dashboard
5. Verify: Token saved in localStorage
6. Verify: User data in context
```

#### 2. Test User Login
```
1. Navigate to /login
2. Enter valid credentials
3. Click "Login"
4. Verify: Redirected to dashboard
5. Verify: Token saved in localStorage
6. Verify: User data in context
```

#### 3. Test Protected Route Access
```
1. While logged in, navigate to /dashboard
2. Verify: Dashboard renders without redirect
3. Navigate to /dashboard/jobs/:id/candidates
4. Verify: Candidates page renders
```

#### 4. Test Unauthenticated Access
```
1. Logout or clear localStorage
2. Navigate to /dashboard
3. Verify: Redirected to /login
4. Verify: Original URL saved as returnUrl
```

#### 5. Test Login After Redirect
```
1. Try accessing /dashboard (while not logged in)
2. Get redirected to /login?returnUrl=/dashboard
3. Login with valid credentials
4. Verify: Redirected to /dashboard (not just '/')
```

#### 6. Test Token Expiration
```
1. Login successfully
2. Wait for token to expire (or manually expire)
3. Navigate to protected route
4. Verify: Auto-logout and redirect to login
5. Verify: "Session expired" message shown
```

#### 7. Test Logout
```
1. While logged in, click "Logout"
2. Verify: Redirected to home page
3. Verify: Token cleared from localStorage
4. Verify: User data cleared
5. Try accessing /dashboard
6. Verify: Redirected to login
```

### Test Scenarios

#### Valid Login
- **Input**: Correct email and password
- **Expected**: Redirect to dashboard, token saved
- **Verify**: Can access protected routes

#### Invalid Credentials
- **Input**: Wrong email or password
- **Expected**: Show error message
- **Verify**: Stay on login page, token not saved

#### Expired Token
- **Setup**: Login then wait for token expiration
- **Action**: Access protected route
- **Expected**: Auto-logout, redirect to login
- **Verify**: "Session expired" message

#### Network Failure
- **Setup**: Disconnect internet
- **Action**: Attempt login
- **Expected**: Show network error message
- **Verify**: Can retry when network restored

#### Protected Route Without Auth
- **Setup**: No token in localStorage
- **Action**: Navigate to /dashboard
- **Expected**: Redirect to /login
- **Verify**: returnUrl parameter saved

#### Logout Functionality
- **Setup**: Logged in user
- **Action**: Click logout
- **Expected**: Redirect to home, clear auth
- **Verify**: Cannot access protected routes

---

## Integration Steps

### Quick Integration Checklist

- [ ] Install no additional packages (use existing)
- [ ] Create AuthContext with provider
- [ ] Create authService API functions
- [ ] Create ProtectedRoute component
- [ ] Create Login and Register pages
- [ ] Update api.js with interceptors
- [ ] Update App.jsx with AuthProvider and routes
- [ ] Update Header with conditional navigation
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test logout functionality
- [ ] Test protected routes
- [ ] Test token expiration handling
- [ ] Handle all edge cases

### Files to Create (5 new files)

1. **`src/contexts/AuthContext.jsx`** - Auth state management
2. **`src/services/authService.js`** - API authentication calls
3. **`src/components/auth/ProtectedRoute.jsx`** - Route guard
4. **`src/pages/Login.jsx`** - Login page
5. **`src/pages/Register.jsx`** - Registration page

### Files to Modify (3 existing files)

1. **`src/services/api.js`** - Add request/response interceptors
2. **`src/App.jsx`** - Add AuthProvider and login/register routes
3. **`src/components/layout/Header.jsx`** - Conditional navigation

### Minimal Code Changes

#### api.js Changes
```javascript
// Add request interceptor
api.interceptors.request.use(addAuthToken);

// Add response interceptor
api.interceptors.response.use(successHandler, errorHandler);
```

#### App.jsx Changes
```javascript
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Wrap with provider
<AuthProvider>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  </Routes>
</AuthProvider>
```

#### Header.jsx Changes
```javascript
const { user, isAuthenticated, logout } = useAuth();

{isAuthenticated ? (
  <button onClick={logout}>Logout</button>
) : (
  <Link to="/login">Login</Link>
)}
```

**That's it!** Three main files to modify, five files to create.

---

## Code Examples

### Complete Implementation Files

#### AuthContext.jsx
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load token on mount
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
      // Optionally validate token with backend
    }
    setLoading(false);
  }, []);

  const login = async (token, userData) => {
    localStorage.setItem('authToken', token);
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const register = async (token, userData) => {
    await login(token, userData);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

#### ProtectedRoute.jsx
```javascript
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loading } from '../shared/Loading';

export function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    // Save attempted URL for redirect after login
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
```

#### Login.jsx
```javascript
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { Input } from '../components/shared/Input';
import { Mail, Lock } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const returnUrl = new URLSearchParams(location.search).get('returnUrl');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { token, data } = await authService.login({ email, password });
      await login(token, data);
      navigate(returnUrl || '/dashboard');
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Email" name="email" icon={Mail} />
      <Input label="Password" name="password" type="password" icon={Lock} />
      <button type="submit" disabled={loading}>Login</button>
      {errors.submit && <p>{errors.submit}</p>}
    </form>
  );
}
```

---

## API Documentation

### Client-Side API Calls

#### authService.register(userData)

Register a new user.

**Request:**
```javascript
authService.register({
  name: "John Doe",
  email: "john@company.com",
  password: "secure123",
  role: "recruiter",
  company: "TechCorp"
});
```

**Response:**
```javascript
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  data: {
    id: "507f1f77bcf86cd799439011",
    name: "John Doe",
    email: "john@company.com",
    role: "recruiter",
    company: "TechCorp"
  }
}
```

#### authService.login(credentials)

Login with email and password.

**Request:**
```javascript
authService.login({
  email: "john@company.com",
  password: "secure123"
});
```

**Response:**
Same structure as register

### Protected API Calls

All API calls to `/api/dashboard/*` automatically include the token:

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example:**
```javascript
// In any component, no manual headers needed
const response = await dashboardService.getStats();
// Token automatically added by interceptor
```

---

## Troubleshooting

### Common Issues

#### "Token not persisting after refresh"
- **Cause**: localStorage not being read on mount
- **Fix**: Ensure useEffect runs on component mount to load token

#### "401 Unauthorized on all requests"
- **Cause**: Token expired or invalid format
- **Fix**: Check token in localStorage, try logging in again

#### "Infinite redirect loop on login"
- **Cause**: ProtectedRoute checking auth before token loaded
- **Fix**: Add loading state check in ProtectedRoute

#### "Context not available error"
- **Cause**: Component using useAuth() outside AuthProvider
- **Fix**: Ensure AuthProvider wraps entire app in App.jsx

#### "Login successful but no redirect"
- **Cause**: Navigation logic not executed
- **Fix**: Check navigate() call after login() completes

#### "Session expired message not showing"
- **Cause**: Error interceptor not logging out
- **Fix**: Check response interceptor catches 401 status

### Debug Tips

```javascript
// Check localStorage
console.log(localStorage.getItem('authToken'));

// Check auth context
const { user, isAuthenticated, token } = useAuth();
console.log({ user, isAuthenticated, token });

// Check network request headers
// Open DevTools > Network tab > Request Headers
// Look for "Authorization: Bearer ..."

// Test API endpoint directly
// Use Postman with same Authorization header
```

### FAQ

**Q: Do I need to add manual headers to API calls?**
A: No! The interceptor adds the token automatically to all requests.

**Q: How do I test authentication locally?**
A: Use the server's `/api/auth/login` endpoint with Postman first, then use the token in your app.

**Q: What happens if localStorage is disabled?**
A: Auth will not persist across sessions. User must login each visit.

**Q: Can I protect only certain dashboard routes?**
A: Yes! Use ProtectedRoute selectively on specific routes.

**Q: How do I logout a user programmatically?**
A: Call `logout()` from AuthContext, which clears token and state.

---

## Summary

This client-side authentication system provides:
- ✅ JWT token management in localStorage
- ✅ Automatic token injection in API requests
- ✅ Protected routes with React Router
- ✅ Centralized auth state with Context API
- ✅ Login and registration flows
- ✅ Token expiration handling
- ✅ Automatic logout on 401 errors
- ✅ Return URL preservation
- ✅ Clean separation of concerns

**Next Steps:**
1. Create AuthContext with provider
2. Create authService API functions
3. Create ProtectedRoute component
4. Create Login and Register pages
5. Update api.js with interceptors
6. Update App.jsx with routes and provider
7. Update Header with conditional navigation
8. Test all authentication flows
9. Handle edge cases
10. Deploy with HTTPS

For questions or issues, refer to this documentation.

