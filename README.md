# Blogify - Modern Blog Platform API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.1-black)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.17-green)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-8.17-orange)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-yellow)](https://jwt.io/)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-7.0-blue)](https://nodemailer.com/)
[![Joi](https://img.shields.io/badge/Joi-17.13--validation-orange)](https://joi.dev/)

A robust, scalable REST API for a modern blog platform built with Node.js, TypeScript, Express, and MongoDB. Features comprehensive authentication, email services, content management, and advanced querying capabilities.

---

## 📋 Table of Contents

- [🌟 Features](#-features)
  - [Authentication & Authorization](#authentication--authorization)
  - [Blog Management](#blog-management)
  - [Comment System](#comment-system)
  - [Tag Management](#tag-management)
  - [Email Services](#email-services)
  - [Search & Filtering](#search--filtering)
  - [Pagination](#pagination)
  - [Data Validation](#data-validation)
  - [Error Handling](#error-handling)
- [🏗️ Architecture](#️-architecture)
  - [Tech Stack](#tech-stack)
  - [Database Schema](#database-schema)
  - [API Structure](#api-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Database Setup](#database-setup)
- [📁 Project Structure](#-project-structure)
- [🔧 Available Scripts](#-available-scripts)
- [🔐 Authentication System](#-authentication-system)
- [📧 Email Service](#-email-service)
- [🏷️ Tag System](#️-tag-system)
- [💬 Comment System](#-comment-system)
- [🔍 Search & Filtering](#-search--filtering)
- [📄 Pagination](#-pagination)
- [✅ Data Validation](#-data-validation)
- [🛡️ Security Features](#️-security-features)
- [📚 API Documentation](#-api-documentation)
- [🙏 Acknowledgments](#-acknowledgments)

---

## 🌟 Features

### Authentication & Authorization

- **JWT-based Authentication** - Secure token-based authentication with access and refresh tokens
- **Role-based Access Control** - User and Admin roles with granular permissions
- **Email Verification** - OTP-based email verification system
- **Password Reset** - Secure password reset via email OTP
- **Session Management** - Refresh token rotation and secure logout
- **Token Expiration** - Configurable token expiration times (15min access, 7 days refresh)

### Blog Management

- **CRUD Operations** - Full Create, Read, Update, Delete functionality
- **Author-specific Blogs** - Users can manage their own blogs
- **Blog Ownership** - Secure access control for blog modifications
- **Duplicate Prevention** - Prevents duplicate blog titles per author
- **Rich Content Support** - Title and description fields with validation

### Comment System

- **Nested Comments** - Comments linked to specific blogs
- **Author Attribution** - Comments tied to authenticated users
- **CRUD Operations** - Full comment management (create, read, update, delete)
- **Ownership Control** - Users can only modify their own comments
- **Blog Integration** - Comments automatically linked to blog posts

### Tag Management

- **Smart Tag System** - Reuse existing tags or create new ones
- **Admin Approval** - New tags require admin approval before use
- **Tag Status Management** - PENDING, APPROVED status tracking
- **Case-insensitive** - Automatic lowercase conversion for consistency
- **Duplicate Prevention** - Unique tag names with proper indexing

### Email Services

- **Template-based Emails** - Handlebars templates for consistent branding
- **Multiple Email Types** - Verification and password reset emails
- **SMTP Integration** - Configurable SMTP settings (Brevo/other providers)
- **HTML Email Support** - Rich, responsive email templates
- **Error Handling** - Robust error handling for email delivery

### Search & Filtering

- **Multi-field Search** - Search blogs by title with case-insensitive matching
- **Author Filtering** - Filter blogs by author name
- **Tag Filtering** - Filter blogs by specific tags
- **Combined Queries** - Multiple filters can be applied simultaneously
- **Fuzzy Matching** - Flexible search with regex patterns

### Pagination

- **Configurable Pagination** - Customizable page size and navigation
- **Metadata Support** - Total count, total pages, current page info
- **Performance Optimized** - Efficient database queries with pageOffset/limit
- **Empty Result Handling** - Proper handling of no results scenarios

### Data Validation

- **Joi Schema Validation** - Comprehensive input validation
- **Custom Error Messages** - User-friendly validation error messages
- **Type Safety** - TypeScript interfaces for all data structures
- **Middleware Integration** - Automatic validation for all routes

### Error Handling

- **Global Error Handler** - Centralized error management for Api Errors
- **Undefined Route Handler** - Undefined routes hit management with proper route not found message

---

## 🏗️ Architecture

### Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.9
- **Framework**: Express.js 5.1
- **Database**: MongoDB 8.17 with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer with SMTP
- **Validation**: Joi schema validation
- **Templates**: Handlebars for email templates
- **Password Hashing**: bcryptjs
- **Development**: Nodemon with ts-node

### Database Schema

#### Users Collection

```typescript
{
  _id: ObjectId,
  fullName: String (3-20 chars),
  email: String (unique, indexed),
  password: String (hashed),
  role: String (USER/ADMIN),
  isEmailVerified: Boolean,
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Blogs Collection

```typescript
{
  _id: ObjectId,
  title: String (indexed),
  description: String,
  author: ObjectId (ref: User, indexed),
  comments: [ObjectId] (ref: Comment),
  tags: [ObjectId] (ref: Tag),
  createdAt: Date,
  updatedAt: Date
}
```

#### Comments Collection

```typescript
{
  _id: ObjectId,
  content: String,
  blog: ObjectId (ref: Blog),
  author: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

#### Tags Collection

```typescript
{
  _id: ObjectId,
  name: String (unique, lowercase),
  status: String (PENDING/APPROVED),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

#### OTP Collection

```typescript
{
  _id: ObjectId,
  email: String (lowercase),
  otp: String (6 digits),
  type: String (EMAIL_VERIFICATION/RESET_PASSWORD),
  expiresAt: Date (TTL index),
  verified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### API Structure

```
/api/v1/
├── /auth
│   ├── POST /register          # Register new user
│   ├── POST /login             # login to the app
│   ├── POST /logout            # logout and end session from the app
│   ├── POST /verify-email      # verifies the email for accessing contents of app
│   ├── POST /resend-otp        # resends otp for email_verification / reset_password
│   ├── POST /forgot-password   # sends otp code for resetting password
│   ├── POST /reset-password    # resets password with otp verification
│   └── POST /refresh           # generates access token from refresh token
├── /blogs
│   ├── GET /                   # get all blogs with advanced query features:filtering, searching, sorting,...
│   ├── GET /:blogId            # get info about particular blog
│   ├── GET /:userId/blogs      # list blogs belonging to particular user
│   ├── GET /my-blogs           # get info about blog of authenticated user
│   ├── POST /                  # creates a new blog
│   ├── PATCH /:blogId          # update blog for authenticated user
│   └── DELETE /:blogId         # deletes blog for authenticated user
├── /comments
│   ├── POST /:blogId           # allows commenting for authenticated user only
│   ├── GET /:blogId            # get comments for a particular blog
│   ├── PATCH /:commentId       # allows editing comment for authenticated user only
│   └── DELETE /:commentId      # allows deleting for authenticated user only
└── /tags
    ├── POST /                  # creates new tag by admin/user
    ├── PATCH /:tagId           # approve tag by admin only
    └── DELETE /:tagId          # delete tag by admin only
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** 8.17+ ([Download](https://www.mongodb.com/try/download/community))
- **SMTP Service** (Brevo, Gmail, SendGrid, etc.)
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Santos2175/blog-platform-api.git
   cd blog-platform-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=your_local_db or cloud_hosted_mongo_atlas_url

   # JWT Configuration
   ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here

   # Email Configuration (SMTP)
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password
   EMAIL_FROM=Blogify Team
   EMAIL_ADDRESS=your_valid_email_registered_on_brevo
   ```

4. **Database Setup**

   ```bash
   # Start MongoDB (if running locally)
   mongod

   # The application will automatically connect to MongoDB on startup
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

### Environment Variables

| Variable               | Description               | Required | Default     |
| ---------------------- | ------------------------- | -------- | ----------- |
| `PORT`                 | Server port number        | No       | 5000        |
| `NODE_ENV`             | Environment mode          | No       | development |
| `MONGODB_URI`          | MongoDB connection string | Yes      | -           |
| `ACCESS_TOKEN_SECRET`  | JWT access token secret   | Yes      | -           |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret  | Yes      | -           |
| `SMTP_HOST`            | SMTP server host          | Yes      | -           |
| `SMTP_PORT`            | SMTP server port          | Yes      | -           |
| `SMTP_USER`            | SMTP username             | Yes      | -           |
| `SMTP_PASS`            | SMTP password             | Yes      | -           |
| `EMAIL_FROM`           | Email sender name         | Yes      | -           |
| `EMAIL_ADDRESS`        | Email sender address      | Yes      | -           |

---

## 📁 Project Structure

```
blog-platform-api/
├── src/
│   ├── config/                 # Configuration files
│   │   ├── db.config.ts       # MongoDB connection
│   │   └── mail.config.ts     # Email service configuration
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.ts # Authentication endpoints
│   │   ├── blog.controller.ts # Blog management
│   │   ├── comment.controller.ts # Comment operations
│   │   └── tag.controller.ts  # Tag management
│   ├── lib/                   # Shared utilities
│   │   ├── interface/         # TypeScript interfaces
│   │   ├── templates/         # Email templates (Handlebars)
│   │   ├── utils/             # Utility functions
│   │   └── validators/        # Joi validation schemas
│   ├── middlewares/           # Express middlewares
│   │   ├── authenticate.middleware.ts # JWT authentication
│   │   ├── authorize.middleware.ts   # Role-based authorization
│   │   ├── error.middleware.ts       # Error handling
│   │   ├── route.middleware.ts       # Route handling
│   │   └── validateInput.middleware.ts # Input validation
│   ├── models/                # Mongoose models
│   │   ├── user.model.ts      # User schema
│   │   ├── blog.model.ts      # Blog schema
│   │   ├── comment.model.ts   # Comment schema
│   │   ├── tag.model.ts       # Tag schema
│   │   └── Otp.model.ts       # OTP schema
│   ├── routes/                # API routes
│   │   ├── auth.route.ts      # Authentication routes
│   │   ├── blog.route.ts      # Blog routes
│   │   ├── comment.route.ts   # Comment routes
│   │   ├── tag.route.ts       # Tag routes
│   │   └── index.ts           # Route aggregator
│   ├── services/              # Business logic
│   │   ├── auth.service.ts    # Authentication logic
│   │   ├── blog.service.ts    # Blog operations
│   │   ├── comment.service.ts # Comment operations
│   │   └── tag.service.ts     # Tag operations
│   └── server.ts              # Application entry point
├── dist/                      # Compiled JavaScript (production)
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── nodemon.json               # Development configuration
└── README.md                  # Project documentation
```

---

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint (if configured)

---

## 🔐 Authentication System

### JWT Token Management

The application uses a dual-token system for enhanced security:

- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for token renewal

### Authentication Flow

1. **Registration**: User registers → Email verification OTP sent
2. **Email Verification**: User enters OTP → Account activated
3. **Login**: User logs in → Access + Refresh tokens issued
4. **API Access**: Access token used for authenticated requests
5. **Token Refresh**: Refresh token used to get new access token
6. **Logout**: Refresh token invalidated

### Protected Routes

All routes except authentication endpoints and other publicly accessible routes require valid JWT tokens:

```typescript
// Example protected route
router.get('/my-blogs', authenticate, blogController.getMyBlogs);
```

### Role-based Authorization

```typescript
// Admin-only routes
router.patch(
  '/tags/:tagId',
  authenticate,
  authorize(['ADMIN']),
  tagController.approveTag
);
```

---

## 📧 Email Service

### Email Templates

The application uses Handlebars templates for consistent email formatting:

- **Email Verification Template**: Welcome email with OTP
- **Password Reset Template**: Password reset with OTP

### SMTP Configuration

Supports any SMTP provider (Brevo, Gmail, SendGrid, etc.):

```typescript
// Example Brevo configuration
{
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: 'your_username',
    pass: 'your_password'
  }
}
```

### Email Features

- **HTML Templates**: Rich, responsive email design
- **OTP Integration**: Automatic OTP generation and sending
- **Error Handling**: Graceful failure handling
- **Template Context**: Dynamic content injection

---

## 🏷️ Tag System

### Smart Tag Management

The tag system prevents duplicates and ensures consistency:

1. **Tag Creation**: New tags are created with PENDING status for normal users and APPROVED for Admins
2. **Admin Approval**: Admins can approve pending tags
3. **Tag Reuse**: Existing tags are automatically reused
4. **Case Handling**: All tags converted to lowercase

### Tag Workflow

```typescript
// User creates blog with new tag
POST /api/v1/tags
{
  "name": "JavaScript"
}
// Response: Tag created and submitted for approval

// Admin approves tag
PATCH /api/v1/tags/:tagId
// Response: Tag status changed to APPROVED
```

---

## 💬 Comment System

### Comment Features

- **Blog Integration**: Comments automatically linked to blogs
- **User Attribution**: Comments tied to authenticated users
- **CRUD Operations**: Full comment lifecycle management
- **Ownership Control**: Users can only modify their comments

### Comment Operations

```typescript
// Add comment to blog
POST /api/v1/comments/:blogId
{
  "content": "Great article!"
}

// Get comments for blog
GET /api/v1/comments/:blogId

// Edit comment
PATCH /api/v1/comments/:commentId
{
  "content": "Updated comment"
}

// Delete comment
DELETE /api/v1/comments/:commentId
```

---

## 🔍 Search & Filtering

### Advanced Query Parameters

The blog API supports comprehensive filtering and search:

```typescript
// Search blogs by title
GET /api/v1/blogs?search=javascript

// Filter by author
GET /api/v1/blogs?author=John%20Doe

// Filter by tag
GET /api/v1/blogs?tag=programming

// Sort results based on createdAt/title
GET /api/v1/blogs?sortBy=createdAt&sortOrder=desc

// Pagination
GET /api/v1/blogs?page=1&limit=10

// Combined queries
GET /api/v1/blogs?search=react&tag=frontend&sortBy=title&page=2&limit=5
```

### Search Features

- **Case-insensitive Search**: Flexible matching
- **Regex Patterns**: Advanced search capabilities
- **Multi-field Filtering**: Author, tag, and search combinations
- **Sorting Options**: Title and creation date sorting

---

## 📄 Pagination

### Pagination Response Format

```json
{
  "success": true,
  "message": "Blogs retrieved successfully",
  "data": {
    "blogs": [...],
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### Pagination Features

- **Configurable Page Size**: Customizable limit parameter
- **Metadata Support**: Total count and page information
- **Performance Optimized**: Efficient database queries
- **Empty Result Handling**: Proper handling of no results

---

## ✅ Data Validation

### Joi Schema Validation

Comprehensive input validation with custom error messages:

```typescript
// User registration validation
{
  fullName: Joi.string().trim().min(3).max(20).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).max(20).required()
}
```

### Validation Features

- **Type Safety**: TypeScript interfaces for all data
- **Custom Messages**: User-friendly error messages
- **Middleware Integration**: Automatic validation
- **Comprehensive Coverage**: All endpoints validated

---

## 🛡️ Security Features

### Security Implementations

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Security**: Secure token generation and verification
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses
- **CORS Protection**: Cross-origin request handling

### Best Practices

- **Environment Variables**: Sensitive data in environment files
- **Token Expiration**: Short-lived access tokens
- **Input Sanitization**: Protection against injection attacks

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Verify Email

```http
POST /api/v1/auth/verify-email
Content-Type: application/json

{
  "otp": "123456"
}
```

### Blog Endpoints

#### Get All Blogs

```http
GET /api/v1/blogs?search=javascript&tag=programming&page=1&limit=10
Authorization: Bearer <access_token>
```

#### Create Blog

```http
POST /api/v1/blogs
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Getting Started with TypeScript",
  "description": "A comprehensive guide to TypeScript...",
  "tags": ["typescript", "programming"]
}
```

### Comment Endpoints

#### Add Comment

```http
POST /api/v1/comments/:blogId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "content": "Great article! Very helpful."
}
```

### Tag Endpoints

#### Create Tag

```http
POST /api/v1/tags
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "machine-learning"
}
```

---

## 🙏 Acknowledgments

- [Node.js](https://nodejs.org/) for the JavaScript runtime
- [Express.js](https://expressjs.com/) for the web framework
- [MongoDB](https://www.mongodb.com/) for the database
- [Mongoose](https://mongoosejs.com/) for the ODM
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [JWT](https://jwt.io/) for authentication
- [Nodemailer](https://nodemailer.com/) for email services
- [Joi](https://joi.dev/) for validation
- [Handlebars](https://handlebarsjs.com/) for email templates

---

**Built with ❤️ for modern blog platforms**
