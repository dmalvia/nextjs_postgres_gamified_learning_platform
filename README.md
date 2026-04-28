# 🚀 BuildSpace - Gamified Learning Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-5C6BC0?logo=drizzle)](https://orm.drizzle.team/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk)](https://clerk.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

A modern, gamified learning platform that transforms coding education into an engaging adventure. Learn web development through hands-on projects, earn XP, unlock achievements, and compete on leaderboards.

## ✨ Features

### 🎮 Gamification

- **XP & Leveling System** - Earn experience points for completing lessons
- **Achievement Badges** - Unlock special badges for milestones
- **Daily Streaks** - Maintain streaks to boost your progress
- **Leaderboards** - Compete with learners globally

### 📚 Course Management

- **YouTube Integration** - Automatically fetch courses from YouTube playlists
- **Lesson Tracking** - Track progress through individual lessons
- **Course Enrollment** - Enroll in courses and track completion
- **Progress Dashboard** - Visual overview of your learning journey

### 👤 User Features

- **Secure Authentication** - Powered by Clerk
- **Profile Management** - Customize your learning profile
- **Recent Activity** - Track your learning history
- **Real-time Updates** - Instant progress synchronization

### 🎨 Modern UI/UX

- **Responsive Design** - Works seamlessly on all devices
- **Smooth Animations** - Powered by Framer Motion
- **Accessible Components** - Built with Shadcn UI

## 🛠️ Tech Stack

| Category             | Technology              |
| -------------------- | ----------------------- |
| **Framework**        | Next.js 16 (App Router) |
| **Language**         | TypeScript              |
| **Database**         | PostgreSQL              |
| **ORM**              | Drizzle ORM             |
| **Authentication**   | Clerk                   |
| **Styling**          | Tailwind CSS            |
| **UI Components**    | Shadcn UI               |
| **Animations**       | Framer Motion           |
| **API Integration**  | YouTube Data API v3     |
| **State Management** | TanStack Query          |

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database (Neon, Vercel Postgres, or local)
- Clerk account for authentication
- YouTube Data API v3 key

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dmalvia/buildspace.git
cd buildspace
```

### 2. Install Dependencies

npm install

# or

yarn install

# or

pnpm install

### 3. Set Up Environment Variables

# Clerk Authentication

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_webhook_secret

# Database

DATABASE_URL=your_postgresql_connection_string

# YouTube API

YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=your_channel_id

### 5. Run Development Server

npm run dev

# or

yarn dev

# or

pnpm dev

📦 Database Schema
Core Tables
users - User profiles and gamification stats

courses - Course information and metadata

lessons - Individual lessons with YouTube URLs

enrollments - User course enrollment tracking

progress - Lesson completion tracking

achievements - Badge definitions

user_achievements - Earned achievements per user

🎯 API Endpoints
Endpoint Method Description
/api/user/sync POST Sync Clerk user to database
/api/user/unified-stats GET Fetch all user stats
/api/courses GET List all courses
/api/courses/[id] GET Get course details
/api/courses/[id]/enroll POST/DELETE Enroll/unenroll from course
/api/progress POST Update lesson progress
/api/leaderboard GET Fetch leaderboard data
/api/achievements GET Fetch user achievements
🎮 Gamification System
XP Points System
Lesson Completion - 10-25 XP per lesson (based on course length)

Achievement Unlock - 50-200 XP per achievement

Streak Bonus - Bonus XP for maintaining daily streaks

Achievement Types
First Steps - Complete first lesson (+50 XP)

Quick Learner - Complete 5 lessons (+100 XP)

Course Master - Complete first course (+200 XP)

Streak Starter - Maintain 7-day streak (+150 XP)

🚢 Deployment
Deploy on Vercel
The easiest way to deploy your Next.js app is to use the Vercel Platform.

Push your code to GitHub

Import your repository to Vercel

Add environment variables

Deploy!

Database Setup for Production
For production, use a managed PostgreSQL service:

Neon - Serverless Postgres

Vercel Postgres

Supabase

📁 Project Structure
text
buildspace/
├── app/
│ ├── (auth)/ # Authentication pages
│ ├── (dashboard)/ # Dashboard layout and pages
│ ├── api/ # API routes
│ └── layout.tsx # Root layout
├── components/
│ ├── dashboard/ # Dashboard components
│ ├── ui/ # Reusable UI components
│ └── providers/ # Context providers
├── db/
│ ├── schema/ # Drizzle schemas
│ ├── drizzle.ts # Database connection
│ └── seed.ts # Seed script
├── config/
│ └── landing/ # Landing page content
├── public/ # Static assets
└── scripts/ # Utility scripts
🔧 Available Scripts
bash

# Development

npm run dev # Start development server

# Database

npm run db:generate # Generate Drizzle migrations
npm run db:push # Push schema to database
npm run db:seed # Seed database with initial data
npm run db:studio # Open Drizzle Studio

# YouTube Integration

npm run fetch:youtube # Fetch courses from YouTube playlists

# Build

npm run build # Build for production
npm run start # Start production server
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Next.js - React framework

Clerk - Authentication

Drizzle ORM - Database ORM

Shadcn UI - UI Components

Framer Motion - Animations

YouTube Data API - Video integration

📧 Contact
Dipesh Malvia

Project Link: https://github.com/yourusername/buildspace

⭐ Show your support
Give a ⭐️ if this project helped you!
