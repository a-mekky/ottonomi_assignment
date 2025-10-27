# JobBoard Client

## Overview

JobBoard Client is a modern React single-page application for a job posting platform. It provides interfaces for job seekers to browse opportunities and apply, and for employers to post jobs and manage applications through an intuitive dashboard.

- **Technology**: React 19 with Vite 7
- **Purpose**: Frontend interface for job posting and application management
- **Build Tool**: Vite with Hot Module Replacement (HMR)
- **Styling**: Tailwind CSS with custom design system

## Technology Stack

### Core Dependencies

- **React 19.1.1** - Modern UI library with concurrent features
- **React Router DOM 7.9.4** - Client-side routing and navigation
- **Vite 7.1.7** - Fast build tool with HMR for rapid development

### UI & Styling

- **Tailwind CSS 4.1.16** - Utility-first CSS framework
- **Lucide React 0.546.0** - Comprehensive icon library
- Custom design system with blue/purple gradient theme

### Data & Utilities

- **Axios 1.12.2** - HTTP client for API communication
- **Date-fns 4.1.0** - Date formatting and manipulation

### Development Tools

- **ESLint 9.36.0** - Code linting and quality assurance
- **Autoprefixer 10.4.21** - CSS vendor prefixing
- **PostCSS 8.5.6** - CSS processing and transformation

## Project Structure

```
client/src/
  components/
    application/     - Application form components
    dashboard/       - Dashboard-specific components
    job/            - Job-related components
    layout/         - Layout wrapper components
    shared/         - Reusable UI components
  pages/            - Top-level route components
  hooks/            - Custom React hooks for data fetching
  services/         - API integration and HTTP client
  utils/            - Helper functions and validators
  assets/           - Static images and icons
```

## Pages

### JobList (`/`)

**Purpose**: Browse all available jobs with pagination

**Features**:
- Responsive job cards grid layout
- Pagination with page numbers and Previous/Next buttons
- Pagination info showing item range (e.g., "Showing 1-12 of 47 jobs")
- Loading states while fetching data
- Error handling with retry functionality
- Empty state for no jobs

**Integrations**:
- `useJobs` hook for data fetching
- `JobCard` components for job display
- `Pagination` component for navigation
- `PaginationInfo` for item count display

### JobDetail (`/job/:id`)

**Purpose**: View detailed information about a specific job posting

**Features**:
- Full job description with proper formatting
- Job metadata display (company, location, salary, date posted)
- Prominent apply button navigation
- Relative time formatting for posted date
- Back navigation to job list
- Gradient header with prominent design

**Integrations**:
- `useJobDetails` hook for fetching job data
- Date formatting utilities for display

### JobApply (`/job/:id/apply`)

**Purpose**: Submit application for a specific job position

**Features**:
- Job summary card with key details
- Application form with name and email inputs
- CV upload with drag-and-drop functionality
- File validation (type and size)
- Upload progress tracking
- Success state with option to apply again
- Back navigation to job details

**Integrations**:
- `ApplicationForm` component
- `useJobDetails` hook for job information

### PostJob (`/post-job`)

**Purpose**: Create new job posting

**Features**:
- Multi-field form for job details
- Client and server-side validation
- Error handling with field-specific messages
- Cancel and submit actions
- Success navigation to job list

**Integrations**:
- `JobForm` component with full validation
- Custom error handling for backend responses

### Dashboard (`/dashboard`)

**Purpose**: View statistics and manage posted jobs

**Features**:
- Statistics cards showing total jobs, applications, and recent activity
- Top jobs list displaying 5 jobs with most applications
- Posted jobs table with application counts
- Full pagination support for jobs list
- Quick action to post new job
- Empty states for sections without data

**Integrations**:
- `useDashboardStats` hook for statistics
- `usePostedJobs` hook for jobs with pagination
- `StatsCard` components (4 instances)
- `TopJobsList` component
- `JobsTable` component with pagination

### JobCandidates (`/dashboard/jobs/:jobId/candidates`)

**Purpose**: View all applications for a specific job

**Features**:
- Job summary card with full details
- Candidate cards in responsive grid layout
- CV download functionality with blob handling
- Download progress and error handling
- Pagination for candidate list
- Back navigation to dashboard
- Empty state for no applications

**Integrations**:
- `useCandidates` hook for fetching applications
- `CandidatesList` component
- `CandidateCard` components for each applicant

## Components

### Application Components

#### ApplicationForm

**Purpose**: Job application submission form

**Features**:
- Name and email input fields with validation
- CV upload with drag-and-drop support
- Immediate file validation feedback
- Upload progress bar
- Success state with celebration message
- Error display for submission failures

**Props**:
- `jobId` - Target job for application

**State Management**:
- Form data (name, email, cv file)
- Validation errors per field
- Loading state during submission
- Success state after submission
- Upload progress percentage

**Validation**:
- Email format validation
- File type validation (PDF, DOC, DOCX)
- File size validation (max 5MB)
- Required field checks

### Dashboard Components

#### StatsCard

**Purpose**: Display individual statistics with icon and optional change indicator

**Features**:
- Icon display with colored background
- Label and value display
- Optional change indicator text
- Color variants (blue, green, purple, orange)

**Props**:
- `icon` - Icon component from Lucide React
- `label` - Statistic label text
- `value` - Main statistic value
- `change` - Optional change indicator (e.g., "Last 7 days")
- `color` - Background color theme (default: blue)

**Reusability**: Used 4 times on Dashboard for different statistics

#### TopJobsList

**Purpose**: Display top 5 jobs by application count

**Features**:
- Compact list format with ranking display
- Clickable rows navigate to candidates page
- Trophy icon in gradient header
- Conditional rendering (hidden if no data)

**Props**:
- `topJobs` - Array of top job objects with application counts

#### JobsTable

**Purpose**: List all posted jobs with application counts

**Features**:
- Pagination footer with info and controls
- Clickable rows for navigation
- Empty state for no jobs
- Application count badges
- Responsive layout

**Props**:
- `jobs` - Array of job objects
- `pagination` - Pagination metadata object
- `onPageChange` - Callback function for page changes

**Navigation**: Row clicks navigate to candidates page for that job

#### CandidateCard

**Purpose**: Display individual candidate information with CV download capability

**Features**:
- Candidate name and email display
- Applied date with relative formatting
- CV download button with blob handling
- Download progress and error states
- Clean card layout with icon

**Props**:
- `candidate` - Candidate object with all details

**File Handling**: Extracts filename from Content-Disposition header or uses fallback

#### CandidatesList

**Purpose**: Grid layout for candidate cards

**Features**:
- Responsive grid (1 column mobile, 3 columns desktop)
- Pagination controls below grid
- Empty state for no candidates
- Section header with candidate count

**Props**:
- `candidates` - Array of candidate objects
- `jobTitle` - Job title for empty state
- `pagination` - Pagination metadata
- `onPageChange` - Page change handler

### Job Components

#### JobCard

**Purpose**: Compact job listing card for grid view

**Features**:
- Truncated description (2 lines)
- Metadata badges for location and salary
- Hover effects with shadow and border changes
- Clickable navigation to detail page
- Relative date formatting

**Props**:
- `job` - Job object with all fields

#### JobForm

**Purpose**: Job creation and editing form

**Features**:
- Multiple input fields (title, company, description, location, salary)
- Client-side validation with immediate feedback
- Server-side error integration
- Description character minimum (50 characters)
- Optional fields for location and salary
- Cancel and submit buttons

**Props**: None (self-contained)

**Validation**:
- Required field checks
- Minimum description length
- Backend error mapping to form fields

### Layout Components

#### Layout

**Purpose**: Main application wrapper with header and footer

**Features**:
- Gradient background (blue to purple)
- Fixed header at top
- Flexible content area
- Footer at bottom
- Full-height flex layout

**Props**:
- `children` - Page content to render

#### Header

**Purpose**: Top navigation bar with logo and links

**Features**:
- Logo with gradient icon
- Active route highlighting
- Sticky positioning (top of page)
- Responsive navigation labels (hidden on mobile)
- Three main navigation routes

**Routes**:
- Home (jobs list)
- Dashboard
- Post Job

**Active Detection**: `useLocation` hook for current route

#### Footer

**Purpose**: Application footer with branding

**Features**:
- Branding with gradient logo
- Copyright information
- Centered content layout
- Border top for separation

### Shared Components

#### Input

**Purpose**: Reusable text input field with icon and error support

**Features**:
- Label with optional required indicator
- Icon positioning on left
- Error state with red border and message
- Focus states with blue border
- Full accessibility support

**Props**:
- `label` - Field label text
- `error` - Error message to display
- `icon` - Icon component (optional)
- `className` - Additional CSS classes
- `required` - Display required asterisk
- All standard input props

#### TextArea

**Purpose**: Multi-line text input for longer content

**Features**:
- Label with optional required indicator
- Error state with red border
- Configurable row count
- Non-resizable by default
- Focus states with blue border

**Props**:
- `label` - Field label text
- `error` - Error message to display
- `className` - Additional CSS classes
- `required` - Display required asterisk
- `rows` - Number of visible lines (default: 4)
- All standard textarea props

#### FileUpload

**Purpose**: CV file upload with drag-and-drop functionality

**Features**:
- Drag-and-drop area
- Click to browse file selection
- File preview with name and size
- Remove file option
- Immediate validation feedback
- Visual states for error, success, and drag

**Props**:
- `label` - Upload area label
- `error` - Error message to display
- `onChange` - Callback when valid file selected
- `onError` - Callback for validation errors
- `accept` - Allowed file extensions (default: PDF, DOC, DOCX)
- `required` - Display required asterisk
- `className` - Additional CSS classes

**Validation**: Immediate file type and size checking before setting state

**Allowed Types**: PDF, DOC, DOCX (max 5MB)

#### Loading

**Purpose**: Loading indicator with customizable message

**Features**:
- Dual-ring animated spinner
- Customizable message text
- Centered layout
- Blue theme consistent with app

**Props**:
- `message` - Loading message (default: "Loading...")

#### ErrorMessage

**Purpose**: Error display with optional retry functionality

**Features**:
- Error icon display
- Error message text
- Optional retry button
- Centered layout
- Red theme for errors

**Props**:
- `message` - Error message to display
- `onRetry` - Optional retry callback function

#### Pagination

**Purpose**: Page number navigation with Previous/Next buttons

**Features**:
- Smart page number display (max 7 with ellipsis)
- Previous and Next buttons
- Active page highlighting with scale and shadow
- Keyboard navigation support
- ARIA labels for accessibility
- Responsive button labels

**Props**:
- `currentPage` - Current active page number
- `totalPages` - Total number of pages
- `onPageChange` - Callback function for page changes
- `className` - Additional CSS classes

**Algorithm**: Intelligently shows page numbers with ellipsis for large ranges

**Active Page Styling**: Blue background, white text, shadow effect, 5% scale increase

#### PaginationInfo

**Purpose**: Display item range and total count information

**Features**:
- Auto-calculated item range
- Total item count display
- Hides when no items
- Proper singular/plural text

**Props**:
- `currentPage` - Current page number
- `itemsPerPage` - Items per page (default: 12)
- `totalItems` - Total number of items
- `className` - Additional CSS classes

**Format**: "Showing X-Y of Z jobs"

## Custom Hooks

### useJobs

**Purpose**: Fetch all jobs with pagination support

**Returns**: `{ jobs, loading, error, refetch, pagination }`

**Features**:
- Automatic initial fetch on mount
- Page parameter support
- Loading and error states
- Pagination metadata included

**API Endpoint**: `GET /api/jobs?page=X&limit=12`

**Usage**: Used by JobList page for browsing all jobs

### useJobDetails

**Purpose**: Fetch single job by ID

**Parameters**: `jobId` - Job identifier

**Returns**: `{ job, loading, error, refetch }`

**Features**:
- Validation for missing jobId
- Refetch capability
- Loading and error handling

**API Endpoint**: `GET /api/jobs/:id`

**Usage**: Used by JobDetail and JobApply pages

### useDashboardStats

**Purpose**: Fetch dashboard statistics and metrics

**Returns**: `{ stats, loading, error, refetch }`

**Features**:
- Statistics overview object
- Top jobs array (max 5)
- Recent activity counts
- Single API call for all stats

**API Endpoint**: `GET /api/dashboard/stats`

**Usage**: Used by Dashboard page

### usePostedJobs

**Purpose**: Fetch posted jobs with application counts

**Returns**: `{ jobs, loading, error, refetch, pagination }`

**Features**:
- Jobs with application counts included
- Full pagination support
- Loading and error states

**API Endpoint**: `GET /api/dashboard/jobs?page=X&limit=12`

**Usage**: Used by Dashboard page for jobs table

### useCandidates

**Purpose**: Fetch applications for a specific job

**Parameters**: `jobId` - Job identifier

**Returns**: `{ candidates, job, loading, error, refetch, pagination }`

**Features**:
- Returns both candidates array and job object
- Pagination support for long lists
- Loading and error handling
- Refetch capability

**API Endpoint**: `GET /api/dashboard/jobs/:jobId/applications?page=X&limit=12`

**Usage**: Used by JobCandidates page

## Services

### API Service (api.js)

**Base Configuration**:
- Axios instance with configured base URL
- Environment variable: `VITE_API_URL` or default `http://localhost:5000/api`
- Default headers: `Content-Type: application/json`
- Response interceptor for global error logging

#### jobService

- `getAll(params)` - Fetch all jobs with pagination support
  - Accepts page and limit query parameters
  - Returns paginated job list

- `getById(id)` - Fetch single job by ID
  - Returns job object with full details

- `create(jobData)` - Create new job posting
  - Accepts job data object
  - Returns created job

#### applicationService

- `submit(applicationData, options)` - Submit application with CV upload
  - Handles FormData for file upload
  - Supports upload progress tracking
  - Enhanced error messages for different scenarios
  - Pre-submission validation for required fields
  - Timeout of 60 seconds for large files

**Error Handling**:
- Connection timeout errors
- File too large errors (413)
- Unsupported file type errors (415)
- Generic application errors

#### dashboardService

- `getStats()` - Get dashboard statistics overview
  - Returns total jobs, applications, recent activity

- `getJobsWithStats(params)` - Get jobs with application counts
  - Accepts pagination parameters
  - Returns jobs array with applicationCount field

- `getApplicationsForJob(jobId, params)` - Get job applications
  - Accepts pagination parameters
  - Returns applications and job details

- `getApplicationDetails(applicationId)` - Get single application details
  - Returns full application object

- `downloadCV(applicationId)` - Download CV file as blob
  - Returns binary file data
  - Handles filename extraction from headers

## Utilities

### formatDate.js

**formatRelativeDate(dateString)**

Purpose: Convert timestamps to human-readable relative time

**Examples**:
- "Just now" (less than 1 minute)
- "5 minutes ago"
- "3 hours ago"
- "2 days ago"
- "2 weeks ago"
- "6 months ago"
- "1 year ago"

**Algorithm**: Progressive time unit calculation with pluralization

**Use Cases**: Job cards, candidate tables, any relative time display

**formatFullDate(dateString)**

Purpose: Format dates to full readable format

**Format**: "Month DD, YYYY" (e.g., "January 15, 2024")

**Use Cases**: Job detail page, application dates, formal date display

### validators.js

**validateEmail(email)**

Purpose: Validate email format using regex pattern

Method: Standard email regex with TLD requirement

Pattern: `^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

**validateFileType(file, allowedTypes)**

Purpose: Check file extension against allowed types

Parameters:
- `file` - File object from input
- `allowedTypes` - Array of allowed extensions (e.g., ['.pdf', '.doc'])

Method: Lowercase filename matching

**validateFileSize(file, maxSizeMB)**

Purpose: Validate file size is within limit

Parameters:
- `file` - File object
- `maxSizeMB` - Maximum size in megabytes

Returns: Boolean for size check

**Constants**:

- `ALLOWED_FILE_TYPES`: `['.pdf', '.doc', '.docx']`
- `MAX_FILE_SIZE_MB`: `5`

## Styling Approach

### Design System

**Primary Colors**:
- Blue: `#2563eb` (primary actions, links, active states)
- Purple: `#7c3aed` (secondary branding, accents)

**Gradients**: Linear blue-to-purple for branding elements

**Neutrals**: Gray scale (50-900) for text and backgrounds

**Shadows**: Layered system (sm, md, lg, xl) with color variants (blue, purple, gray)

**Borders**: 2px standard, rounded-xl (12px) for modern feel

**Spacing**: Tailwind's standard scale (4px increments: 4, 8, 12, 16, 20, 24...)

### Typography

**Font Family**: System UI stack (system-ui, Avenir, Helvetica, Arial, sans-serif)

**Font Weights**:
- Regular (400) - Body text
- Medium (500) - Buttons, labels
- Semibold (600) - Headings, emphasis
- Bold (700) - Important text, values

**Sizes**: Text-sm to text-4xl for hierarchy

**Line Height**: 1.5 base, 1.1 for headings

### Color Usage

- **Blue**: Primary actions, links, active navigation, selected states
- **Purple**: Secondary branding, special accents
- **Green**: Success states, positive actions
- **Red**: Errors, warnings, required indicators
- **Orange**: Time-based information, time-sensitive content
- **Gray**: Text (50-700), borders (200-300), backgrounds (50-100)

### Responsive Design

**Breakpoints**:
- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up

**Mobile-First Approach**: All styles start mobile, enhanced for larger screens

**Grid Systems**: Responsive columns (1 → 2 → 3 based on screen size)

**Navigation**: Text labels hidden on small screens, icons visible

**Spacing**: Adjusted padding/margin per breakpoint for optimal layout

### Interactive States

**Hover**:
- Border color changes
- Background lightening
- Shadow increase
- Scale transforms
- Cursor pointer

**Active**:
- Scale effects (105%)
- Strong color application
- Enhanced shadows
- Ring effects

**Focus**:
- Blue focus ring outline
- Keyboard accessibility

**Disabled**:
- 40% opacity
- Cursor not-allowed
- No hover effects

**Loading**:
- Animated spinners
- Progress bars
- Skeleton states

### Animation & Transitions

**Duration**: 150-300ms for most transitions

**Easing**: Default ease-out

**Properties**: Colors, transforms, shadows, opacity

**Hover Delays**: Instant on, slight delay on out for better UX

**Page Transitions**: Smooth scroll to top on navigation

## Key Implementation Decisions

### Why Custom Hooks Pattern

- Separation of concerns (data fetching vs UI rendering)
- Reusable data fetching logic across components
- Consistent error handling across application
- Easy to test in isolation
- Centralized API integration points
- Reduced component complexity
- Single responsibility principle

### Why Axios over Fetch

- Interceptors for global error handling
- Automatic JSON parsing
- Request/response transformation
- Better error objects with more detail
- Progress events for file uploads
- Timeout support built-in
- Backwards compatibility

### Why Component Composition

- Single Responsibility Principle adherence
- Reusable building blocks (Input, Card components)
- Easier to test and debug
- Better code organization
- Team collaboration friendly
- Scalable architecture

### Why No State Management Library

- Application state is simple and manageable
- Props drilling is minimal with current structure
- Custom hooks handle data fetching efficiently
- No deeply nested component trees
- Reduced bundle size (faster load times)
- Easier onboarding for new developers

### Why Pagination

- Performance: Load 12 items vs hundreds at once
- Better UX: Manageable data chunks for users
- Reduced server load: Fewer database queries
- Bandwidth optimization: Smaller response payloads
- 12 items chosen as optimal balance between scrolling and clicking

### Why Client-Side Validation

- Immediate user feedback without server round-trip
- Reduced server requests and load
- Better overall user experience
- Catches errors before submission attempt
- Still validates on backend for security

## Routing Structure

```
/                                      → JobList (public)
/job/:id                               → JobDetail (public)
/job/:id/apply                         → JobApply (public)
/post-job                              → PostJob (public)
/dashboard                             → Dashboard (public)
/dashboard/jobs/:jobId/candidates      → JobCandidates (public)
```

**Note**: All routes currently public. Authentication system would add protected routes in future versions.

## State Management Strategy

### Component State (useState)

- Form inputs and validation errors
- Loading and success states
- Local UI state (modals, dropdowns, file selection)
- File upload progress tracking

### URL State (React Router)

- Current page/route information
- Job ID and other URL parameters
- Page numbers (could be added as query params)

### Server State (Custom Hooks)

- Jobs list and details
- Dashboard statistics
- Applications and candidates lists
- Managed by custom hooks with caching behavior

### Derived State

- Pagination calculations from metadata
- Formatted dates from timestamps
- Filtered/sorted data (when implemented client-side)

## Error Handling Strategy

### Network Errors

- Display ErrorMessage component
- Provide retry functionality
- Log errors to console for debugging
- User-friendly error messages

### Validation Errors

- Field-level error display below inputs
- Red border on invalid input fields
- Clear, actionable error messages
- Prevent form submission until valid

### File Upload Errors

- Immediate validation feedback before submission
- Specific error messages (type, size, etc.)
- Visual error states in FileUpload component
- Backend error integration for server-side errors

### Not Found / Missing Data

- Empty state components with helpful messages
- Navigation options to relevant pages
- No crashes or blank screens
- User guidance on next steps

## Performance Optimizations

### Code Splitting

- Route-based splitting via React Router
- Lazy loading for heavy components
- Dynamic imports for modals/dialogs

### React Optimizations

- Memo for expensive components
- Callback hooks where appropriate
- Avoid unnecessary re-renders
- Proper key props in lists

### Asset Optimization

- SVG icons from Lucide React (scalable, small)
- No heavy image libraries
- Minimal dependencies
- Tree-shaking with Vite

### API Efficiency

- Pagination reduces payload size significantly
- Single requests per page load
- Abort controllers for cancelled requests
- Progress tracking for uploads

## Development Workflow

### Scripts

- `npm run dev` - Start Vite dev server (port 5173)
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Setup

Create `.env` file in client directory:

```
VITE_API_URL=http://localhost:5000/api
```

**Default**: http://localhost:5000/api

### Hot Module Replacement

- Instant updates without full page reload
- Preserves component state
- Fast feedback loop

### Linting

- ESLint with React hooks plugin
- React refresh plugin for HMR
- Unused vars warning (except capitalized variables)
- Consistent code style enforcement

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features
- CSS Grid and Flexbox
- No IE11 support
- Mobile responsive (iOS Safari, Chrome Mobile)

## Accessibility Features

- Semantic HTML (header, main, footer, nav)
- ARIA labels on all interactive elements
- ARIA-current for active navigation
- Keyboard navigation support throughout
- Focus states on all interactive elements
- Screen reader friendly
- Alt text for icons via lucide-react
- High contrast text and backgrounds

## Future Enhancements

### Features

- Search and filter jobs
- Save favorite jobs for later
- Application status tracking
- Real-time notifications
- Job categories and tags
- Advanced filtering (salary, location, etc.)
- Email notifications

### Technical

- Unit tests (Jest, React Testing Library)
- E2E tests (Playwright, Cypress)
- TypeScript migration for type safety
- SEO improvements

### UX Improvements

- Skeleton loaders instead of spinners
- Keyboard shortcuts
- Dark mode toggle
- Customizable dashboard
- Export data functionality
