# JobHelper

A full-stack job application tracker with an AI-powered cover letter assistant. Built to solve a real problem — keeping track of applications and writing tailored cover letters fast.

**Live demo:** [jobhelper.vercel.app](https://jobhelper.vercel.app) &nbsp;·&nbsp; Guest mode available — no sign-up required to try it out.

---

## Features

**Kanban Board**
- Track applications across three stages: Applied → Interview → Rejected
- Drag & drop cards between columns
- Guest mode with localStorage — data migrates automatically on sign-up

**AI Cover Letter Chat**
- Conversational chat powered by Google Gemini 2.5 Flash
- AI reads your resume (PDF) and the job description to write a tailored letter
- Full chat history — come back to any previous conversation and keep refining
- Edit AI messages directly in the chat
- Export the final letter to PDF

**Other**
- OAuth authentication via Supabase (Google, GitHub)
- Resume upload to Supabase Storage
- 19 UI languages including RTL (Arabic)
- Vercel Analytics (disabled in debug mode and localhost)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4, shadcn/ui, Radix UI |
| State | Redux Toolkit |
| Routing | React Router v7 |
| Forms | React Hook Form + Zod |
| Backend | Supabase (Auth, PostgreSQL, Storage, Edge Functions) |
| AI | Google Gemini 2.5 Flash |
| Deployment | Vercel |
| i18n | i18next (19 languages) |

---

## Architecture

```
src/
├── react/
│   ├── pages/          # Route-level components
│   ├── forms/          # Form components
│   ├── components/     # Reusable UI pieces
│   └── sections/       # Layout sections (header, etc.)
├── services/           # API calls (Supabase + Edge Functions)
├── store/              # Redux slices
├── hooks/              # Custom hooks
└── playground/         # Supabase Edge Functions source
    ├── cover-letter-chat/       # General AI chat (Gemini multi-turn)
    ├── generate-cover-letter/   # Initial letter generation from PDF resume
    └── refine-cover-letter/     # Letter refinement with chat history
```

**Edge Functions** run on Deno (Supabase) and call the Gemini API. The cover letter chat function maintains conversation context by passing the full message history and resume PDF on each request, giving the AI complete context for every reply.

**Row Level Security** on all Supabase tables — users can only access their own data.

---

## Local Setup

**Prerequisites:** Node.js 18+, a Supabase project, a Gemini API key.

```bash
git clone https://github.com/your-username/job-helper.git
cd job-helper
npm install
```

Create `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Set `GEMINI_API_KEY` as a secret in your Supabase project dashboard.

Run the SQL migration from `src/playground/cover_letter_chats_migration.sql` in the Supabase SQL editor, then:

```bash
npm run dev
```

---

## Database Schema

```sql
-- Job application cards
job-helper-cards-database
  card_id    uuid PK
  user_id    uuid FK → auth.users
  company_name, position, email, status, id_time

-- AI chat sessions
cover_letter_chats
  id         uuid PK
  user_id    uuid FK → auth.users
  job_title, company_name, job_description, resume_url
  messages   jsonb   -- [{role: "user"|"ai", content: string}]
  created_at, updated_at
```

---

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Type-check + production build
npm run type-check   # TypeScript check only
npm run test         # Vitest unit tests
npm run lint         # ESLint
```

---

## License

MIT
