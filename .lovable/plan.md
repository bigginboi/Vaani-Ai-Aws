

# Vaani AI – Empowering Bharat's Digital Voice

## Overview
An AI-powered content platform for Indian MSMEs and creators to generate, schedule, analyze, and repurpose multilingual content across social platforms.

**Tech Stack:** React + Vite + Tailwind CSS + Supabase (Database, Auth, Edge Functions, Storage) + Lovable AI (content generation, translation, sentiment analysis)

---

## Phase 1: Foundation & Auth

### Google OAuth Login
- Sign in with Google via Supabase Auth
- User profile with name, avatar, and brand preferences
- Clean onboarding flow after first login

### App Shell & Navigation
- Sidebar navigation with Dashboard, Create, Schedule, Analytics, Repurpose sections
- Responsive layout with mobile support
- Dark/light mode toggle

---

## Phase 2: AI Content Generator (Core Feature)

### Multilingual Content Creation
- Input: Topic/prompt, target language (Hindi, Bengali, Tamil, Marathi, Assamese, English), tone (Professional, Friendly, Promotional, Educational), target platform (Instagram, LinkedIn, X, YouTube)
- AI generates culturally adapted content (not direct translation) via Lovable AI edge function
- Platform-specific formatting (character limits, hashtag style, structure)

### Engagement Prediction
- Viral probability score based on content analysis
- Best posting time suggestion (IST-based)
- Hook strength rating
- Expected engagement rate estimate

### Draft Management
- Autosave drafts to Supabase database
- Edit, delete, and organize drafts
- Quick publish or schedule from draft

---

## Phase 3: Content Scheduler

### Calendar View
- Monthly/weekly calendar with drag-and-drop post scheduling
- Color-coded by platform
- Time zone aware (IST default)

### Post Queue
- Queue management with reordering
- Multi-platform scheduling (same content to multiple platforms)
- Scheduled posts stored in database with status tracking

### Social Platform Publishing
- Integration with X/Twitter API for posting
- LinkedIn and Instagram publishing setup (requires developer accounts)
- Post status tracking (scheduled, published, failed)

---

## Phase 4: Analytics Dashboard

### Engagement Metrics
- Overview cards: total posts, engagement rate, reach, growth
- Charts showing performance over time (using Recharts)
- Per-post performance breakdown

### AI-Powered Insights
- Sentiment analysis of post performance using Lovable AI
- AI-generated improvement suggestions
- Monthly performance summary report generation

### Best Performing Content
- Top posts ranking
- Content type analysis (which formats perform best)

---

## Phase 5: Content Repurposing Engine

### Cross-Platform Conversion
- Blog → Instagram caption
- Caption → LinkedIn post
- Post → X thread
- Automatic character limit adjustment per platform

### Batch Repurposing
- Select existing content and repurpose to multiple formats at once
- Preview all versions before saving
- One-click schedule repurposed content

---

## Database Structure

- **profiles** – User info, brand preferences, onboarding status
- **brand_voices** – Stored brand tone/style from uploaded content
- **content_drafts** – All generated and edited content with autosave
- **scheduled_posts** – Calendar entries with platform, time, status
- **analytics_data** – Post performance metrics
- **trending_topics** – Cached trending data for India

---

## Design Direction
- Clean, minimal SaaS aesthetic with professional typography
- Subtle animations and smooth transitions
- Toast notifications for actions
- Loading skeletons for data fetching
- Card-based layout for content items
- Indian-market focused color palette (warm, trustworthy tones)

