# Blogify V1 REST API Documentation

This technical document provides comprehensive REST API contracts for Blogify V1, detailing all endpoints, request/response formats, authentication mechanisms, and usage guidelines for integrating with the Blogify blog platform.

## Table of Contents

1. [Authentication Endpoints](#1-authentication-endpoints)
2. [Blog Management Endpoints](#2-blog-management-endpoints)
3. [Comment System Endpoints](#3-comment-system-endpoints)
4. [Tag Management Endpoints](#4-tag-management-endpoints)
5. [Error Handling](#5-error-handling)
6. [Authentication & Authorization](#6-authentication--authorization)

---

## 1. Authentication Endpoints

### 1.1. Register User

```
POST /api/v1/auth/register
Content-Type: application/json
```

**Request:**

```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Verification code sent to your email. Please verify your email"
}
```

**Error Cases:**

```json
- 409: Email already in use
- 400: Validation errors (fullName, email, password)
```

### 1.2. Login User

```
POST /api/v1/auth/login
Content-Type: application/json
```

**Request:**

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "role": "USER",
      "isEmailVerified": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Cases:**

```json
- 401: Invalid credentials
- 403: Email not verified
- 400: Validation errors
```

### 1.3. Logout User

```
POST /api/v1/auth/logout
Authorization: Bearer {accessToken}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

**Error Cases:**

```json
- 401: Authorization token missing
- 401: Invalid token
```

### 1.4. Verify Email

```
POST /api/v1/auth/verify-email
Content-Type: application/json
```

**Request:**

```json
{
  "otp": "123456"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Error Cases:**

```json
- 401: Invalid or expired verification OTP
- 400: Validation errors
```

### 1.5. Resend OTP

```
POST /api/v1/auth/resend-otp
Content-Type: application/json
```

**Request:**

```json
{
  "email": "john.doe@example.com",
  "type": "EMAIL_VERIFICATION"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "OTP sent. Please check your mail to verify it"
}
```

**Error Cases:**

```json
- 404: User not found
- 400: Email already verified (for EMAIL_VERIFICATION)
- 400: Validation errors
```

### 1.6. Forgot Password

```
POST /api/v1/auth/forgot-password
Content-Type: application/json
```

**Request:**

```json
{
  "email": "john.doe@example.com"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Password reset OTP sent. Please check your email"
}
```

**Error Cases:**

```json
- 404: User not found
- 400: Validation errors
```

### 1.7. Reset Password

```
POST /api/v1/auth/reset-password
Content-Type: application/json
```

**Request:**

```json
{
  "email": "john.doe@example.com",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Cases:**

```json
- 401: Invalid or expired OTP
- 404: User not found
- 400: Validation errors
```

### 1.8. Refresh Access Token

```
POST /api/v1/auth/refresh
Content-Type: application/json
```

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Access token generated",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Cases:**

```json
- 401: Invalid refresh token
- 401: Token has expired
```

---

## 2. Blog Management Endpoints

### 2.1. Get All Blogs

```
GET /api/v1/blogs?search=javascript&author=John%20Doe&tag=programming&sortBy=createdAt&sortOrder=desc&page=1&limit=10
```

**Query Parameters:**

- `search` (optional): Search blogs by title
- `author` (optional): Filter by author name
- `tag` (optional): Filter by tag name
- `sortBy` (optional): Sort field (title, createdAt) - default: createdAt
- `sortOrder` (optional): Sort order (asc, desc) - default: desc
- `page` (optional): Page number - default: 1
- `limit` (optional): Items per page - default: 10

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Blogs retrieved successfully",
  "data": {
    "blogs": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Getting Started with TypeScript",
        "description": "A comprehensive guide to TypeScript...",
        "author": {
          "_id": "507f1f77bcf86cd799439012",
          "fullName": "John Doe",
          "email": "john.doe@example.com"
        },
        "tags": [
          {
            "_id": "507f1f77bcf86cd799439013",
            "name": "typescript"
          }
        ],
        "comments": [],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 2.2. Get Blog by ID

```
GET /api/v1/blogs/{blogId}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Blog retrieved successfully",
  "data": {
    "blog": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Getting Started with TypeScript",
      "description": "A comprehensive guide to TypeScript...",
      "author": "507f1f77bcf86cd799439012",
      "comments": [],
      "tags": [],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Cases:**

```json
- 400: Invalid blog ID
- 404: Blog not found
```

### 2.3. Get Blogs by User

```
GET /api/v1/blogs/{userId}/blogs
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Blogs retrieved successfully",
  "data": {
    "blogs": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Getting Started with TypeScript",
        "description": "A comprehensive guide to TypeScript...",
        "author": "507f1f77bcf86cd799439012",
        "comments": [],
        "tags": [],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

**Error Cases:**

```json
- 400: Invalid user ID
- 404: User not found
```

### 2.4. Get My Blogs (Authenticated)

```
GET /api/v1/blogs/my-blogs
Authorization: Bearer {accessToken}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Blogs retrieved successfully",
  "data": {
    "blogs": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Getting Started with TypeScript",
        "description": "A comprehensive guide to TypeScript...",
        "author": "507f1f77bcf86cd799439012",
        "comments": [],
        "tags": [],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

**Error Cases:**

```json
- 401: Authorization token missing
- 401: Invalid token
```

### 2.5. Create Blog

```
POST /api/v1/blogs
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request:**

```json
{
  "title": "Getting Started with TypeScript",
  "description": "A comprehensive guide to TypeScript for beginners. This article covers the basics of TypeScript, its benefits, and how to get started with your first TypeScript project.",
  "tags": ["typescript", "programming", "javascript"]
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "blog": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Getting Started with TypeScript",
      "description": "A comprehensive guide to TypeScript for beginners...",
      "author": "507f1f77bcf86cd799439012",
      "comments": [],
      "tags": [
        {
          "_id": "507f1f77bcf86cd799439013",
          "name": "typescript"
        },
        {
          "_id": "507f1f77bcf86cd799439014",
          "name": "programming"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Cases:**

```json
- 401: Authorization token missing
- 401: Invalid token
- 409: You already have a blog with this title
- 400: Validation errors
```

### 2.6. Update Blog

```
PATCH /api/v1/blogs/{blogId}
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request:**

```json
{
  "title": "Updated TypeScript Guide",
  "description": "Updated comprehensive guide to TypeScript...",
  "tags": ["typescript", "programming", "web-development"]
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Blog updated successfully",
  "data": {
    "updatedBlog": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Updated TypeScript Guide",
      "description": "Updated comprehensive guide to TypeScript...",
      "author": "507f1f77bcf86cd799439012",
      "comments": [],
      "tags": [],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:30:00.000Z"
    }
  }
}
```

**Error Cases:**

```json
- 401: Authorization token missing
- 401: Invalid token
- 403: Forbidden: Permission Denied (not blog owner)
- 400: Invalid blog ID
- 404: Blog not found
- 400: Validation errors
```

### 2.7. Delete Blog

```
DELETE /api/v1/blogs/{blogId}
Authorization: Bearer {accessToken}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

**Error Cases:**

```json
- 401: Authorization token missing
- 401: Invalid token
- 403: Forbidden: Permission Denied (not blog owner)
- 400: Invalid blog ID
- 404: Blog not found
```

---

## 3. Comment System Endpoints

### 3.1. Add Comment

```
POST /api/v1/comments/{blogId}
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request:**

```json
{
  "content": "Great article! Very helpful for beginners."
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "comment": {
      "_id": "507f1f77bcf86cd799439015",
      "content": "Great article! Very helpful for beginners.",
      "blog": "507f1f77bcf86cd799439011",
      "author": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-15T12:30:00.000Z",
      "updatedAt": "2024-01-15T12:30:00.000Z"
    }
  }
}
```

**Error Cases:**

```json
- 401: Authorization token missing
- 401: Invalid token
- 400: Validation errors
```

### 3.2. Get Comments by Blog

```
GET /api/v1/comments/{blogId}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Comments retrieved successfully",
  "data": {
    "comments": [
      {
        "_id": "507f1f77bcf86cd799439015",
        "content": "Great article! Very helpful for beginners.",
        "blog": "507f1f77bcf86cd799439011",
        "author": {
          "_id": "507f1f77bcf86cd799439012",
          "fullName": "John Doe",
          "email": "john.doe@example.com"
        },
        "createdAt": "2024-01-15T12:30:00.000Z",
        "updatedAt": "2024-01-15T12:30:00.000Z"
      }
    ]
  }
}
```

### 3.3. Edit Comment

```
PATCH /api/v1/comments/{commentId}
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request:**

```json
{
  "content": "Updated comment content"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Comment edited successfully",
  "data": {
    "editedComment": {
      "_id": "507f1f77bcf86cd799439015",
      "content": "Updated comment content",
      "blog": "507f1f77bcf86cd799439011",
      "author": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-15T12:30:00.000Z",
      "updatedAt": "2024-01-15T13:30:00.000Z"
    }
  }
}
```

**Error Cases:**

```json
- 401: Authorization token missing
- 401: Invalid token
- 404: Comment not found
- 403: Permission denied (not comment owner)
- 400: Validation errors
```

### 3.4. Delete Comment

```
DELETE /api/v1/comments/{commentId}
Authorization: Bearer {accessToken}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

**Error Cases:**

```json
- 401: Authorization token missing
- 401: Invalid token
- 404: Comment not found
- 403: Permission denied (not comment owner)
```

---

## 4. Tag Management Endpoints

### 4.1. Create Tag

```
POST /api/v1/tags
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request:**

```json
{
  "name": "machine-learning"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Tag created and submitted for admin approval.",
  "data": {
    "tag": {
      "_id": "507f1f77bcf86cd799439016",
      "name": "machine-learning",
      "status": "PENDING",
      "createdBy": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-15T14:30:00.000Z",
      "updatedAt": "2024-01-15T14:30:00.000Z"
    }
  }
}
```

**Error Cases:**

```json
- 401: Authorization token missing
- 401: Invalid token
- 400: Validation errors
```

### 4.2. Approve Tag (Admin Only)

```
PATCH /api/v1/tags/{tagId}
Authorization: Bearer {accessToken}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Tag approved",
  "data": {
    "tag": {
      "_id": "507f1f77bcf86cd799439016",
      "name": "machine-learning",
      "status": "APPROVED",
      "createdBy": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-15T14:30:00.000Z",
      "updatedAt": "2024-01-15T15:30:00.000Z"
    }
  }
}
```

**Error Cases:**

```json
- 401: Authorization token missing
- 401: Invalid token
- 403: Forbidden: Permission Denied (not admin)
- 404: Tag not found
```

### 4.3. Delete Tag (Admin Only)

```
DELETE /api/v1/tags/{tagId}
Authorization: Bearer {accessToken}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Tag deleted successfully"
}
```

**Error Cases:**

```json
- 401: Authorization token missing
- 401: Invalid token
- 403: Forbidden: Permission Denied (not admin)
- 404: Tag not found
```

---

## 5. Error Handling

### 5.1. Standard Error Response Format

All API endpoints return errors in a consistent format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### 5.2. Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data or validation errors
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **500 Internal Server Error**: Server error

### 5.3. Validation Error Example(multiple errors)

```json
{
  "success": false,
  "message": [
    "Full name must be at least 3 characters long",
    "Email must be a valid email address",
    "Password must be at least 6 characters long"
  ]
}
```

---

## 6. Authentication & Authorization

### 6.1. JWT Token Structure

**Access Token Payload:**

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "role": "USER",
  "iat": 1642234567,
  "exp": 1642235467
}
```

**Refresh Token Payload:**

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "role": "USER",
  "iat": 1642234567,
  "exp": 1642839367
}
```

### 6.2. Token Expiration

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

### 6.3. Authorization Headers

For protected endpoints, include the access token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6.4. Role-based Access Control

- **USER**: Can create/edit/delete own blogs and comments
- **ADMIN**: Can approve tags, delete any tag, and access admin-only endpoints

### 6.5. Protected vs Public Endpoints

**Public Endpoints:**

- `GET /api/v1/blogs` - Get all blogs
- `GET /api/v1/blogs/{blogId}` - Get specific blog
- `GET /api/v1/blogs/{userId}/blogs` - Get user's blogs
- `GET /api/v1/comments/{blogId}` - Get blog comments
- `POST /api/v1/auth/*` - All authentication endpoints

**Protected Endpoints:**

- All other endpoints require valid JWT access token

---

## 7. Rate Limiting & Security

### 7.1. Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Security**: Signed tokens with expiration
- **Input Validation**: Joi schema validation for all inputs
- **SQL Injection Protection**: Mongoose ODM protection
- **XSS Protection**: Input sanitization and validation

### 7.2. Best Practices

- Store sensitive data in environment variables
- Use HTTPS in production
- Implement proper CORS policies
- Regular token rotation
- Monitor failed authentication attempts

---

## 8. Data Models

### 8.1. User Model

```typescript
{
  _id: ObjectId,
  fullName: string (3-20 chars),
  email: string (unique),
  password: string (hashed),
  role: "USER" | "ADMIN",
  isEmailVerified: boolean,
  refreshToken?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### 8.2. Blog Model

```typescript
{
  _id: ObjectId,
  title: string (3-50 chars, indexed),
  description: string (10-1000 chars),
  author: ObjectId (ref: User, indexed),
  comments: ObjectId[] (ref: Comment),
  tags: ObjectId[] (ref: Tag),
  createdAt: Date,
  updatedAt: Date
}
```

### 8.3. Comment Model

```typescript
{
  _id: ObjectId,
  content: string (3-100 chars),
  blog: ObjectId (ref: Blog),
  author: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### 8.4. Tag Model

```typescript
{
  _id: ObjectId,
  name: string (3-20 chars, unique, lowercase),
  status: "PENDING" | "APPROVED",
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### 8.5. OTP Model

```typescript
{
  _id: ObjectId,
  email: string (lowercase),
  otp: string (6 digits),
  type: "EMAIL_VERIFICATION" | "RESET_PASSWORD",
  expiresAt: Date (TTL index),
  verified: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

**API Version**: V1  
**Base URL**: `https://api.blogify.com/api/v1`  
**Documentation Version**: 1.0.0  
**Last Updated**: January 2024
