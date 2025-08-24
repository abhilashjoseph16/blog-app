# Blog Application with User Management

## Overview

This is a production-like Blog Application built using Next.js featuring user authentication, role-based access, blog CRUD operations, and user profile management. The backend is powered by Next.js API routes with MongoDB Atlas for the database.

---

## Features

- User Registration and Login (JWT authentication)
- Role-based access: Admins and Users
- Create, Read, Update, Delete blog posts
- Public blog listing and detail pages
- User profile management (view and edit profile)
- Commenting system (optional bonus feature)
- Pagination and filtering on blog listing
- Deployed on Vercel with MongoDB Atlas backend

---

## Tech Stack

- Frontend: Next.js (React, App Router)
- Backend: Next.js API Routes
- Database: MongoDB Atlas
- Authentication: JWT with HTTP-only Cookies
- Styling: Your choice of CSS Modules or UI library
- Deployment: Vercel (frontend) + MongoDB Atlas (database)

---

## Getting Started

### Prerequisites

- Node.js (v16 or newer recommended)
- MongoDB Atlas account with a free cluster
- Git installed

### Setup

1. Clone the repository:

git clone https://github.com/abhilashjoseph16/blog-app.git

cd blog-app


2. Install dependencies:

npm install


3. Configure environment variables:

Create a `.env` file in the root directory:

MONGODB_URI=your-mongodb-atlas-connection-string or mongodb-local
JWT_SECRET= jwt secret


4. Run the development server:

npm run dev


5. Open [http://localhost:3000] to view the app.

---

## Deployment

The app is deployed on Vercel. To deploy your own version:

- Push your code to GitHub/GitLab
- Connect your repository with Vercel at https://vercel.com
- Set environment variables in the Vercel dashboard matching `.env`
- Deploy and access your live app URL from Vercel

---

## Folder Structure

- `/app` - Next.js pages and routing
- `/api` - API route handlers for backend logic
- `/components` - Reusable React components
- `/lib` - Database connections and utilities
- `/middleware` - Middleware for token verification
- `/models` - Mongoose models and schemas
- `/styles` - Global SCSS
- `/public` - Static assets like images and icons

---

## URL

- `/home` - Home Page
- `/profile` - Profile Page
- `/posts/create` - Create Post Page
- `/blog` - Public Blog Listing Page
- `/login` - Login Page
- `/register` - Register Page

---

## Contribution

Contributions are welcome! Please open issues or submit pull requests for bug fixes and feature requests.

---

## License

[MIT License](LICENSE)

---

## Author

Abhilash Joseph - [GitHub](https://github.com/abhilashjoseph16)


