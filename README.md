# Omniflow — AI Study Planner & Learning Schedule System

A full-stack academic productivity platform built with React + Express + PostgreSQL.

## Project Structure

```
.
├── backend/
│   ├── config/
│   │   └── constants.ts          # Server config
│   ├── db/
│   │   ├── index.ts              # Drizzle + postgres.js connection
│   │   ├── schema.ts             # All table definitions + Zod schemas
│   │   └── migrations/
│   │       └── 1773471953413_init_study_planner.sql
│   ├── middleware/
│   │   └── errorHandler.ts
│   ├── repositories/
│   │   └── studyPlanner.ts       # Data access for all entities
│   ├── routes/
│   │   └── studyPlanner.ts       # REST API routes
│   └── server.ts               # Express entry point
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── custom/
│       │   │   ├── DashboardView.tsx     # Main dashboard with stats
│       │   │   ├── ScheduleView.tsx      # Weekly calendar + session management
│       │   │   ├── ProgressView.tsx      # Heatmap + thesis milestones
│       │   │   ├── CollabView.tsx        # Kanban board + @mentions
│       │   │   ├── GpaView.tsx           # GPA predictor + course table
│       │   │   ├── IntegrationsView.tsx  # Canvas/Blackboard/GCal/Advisor
│       │   │   └── OmniflowBadge.tsx
│       │   └── ui/                   # shadcn/ui components
│       ├── lib/
│       │   └── api.ts                # All API service methods
│       ├── pages/
│       │   └── Index.tsx             # App shell + landing page + navigation
│       ├── types/
│       │   └── index.ts              # All TypeScript types
│       └── index.css             # Omniflow dark theme tokens
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, shadcn/ui, Lucide React
- **Backend**: Express.js, TypeScript, Drizzle ORM, postgres.js
- **Database**: PostgreSQL
- **Routing**: React Router DOM (HashRouter)

## Features Implemented

### Epic 1: Intelligent Planning Engine
- Weekly calendar view with 7-day grid navigation
- Study session CRUD (create, complete, delete)
- AI session suggestion button (generates recommended sessions)
- Session types: study, review, exam, group
- Deadline overlay on calendar

### Epic 2: Progress Tracking & Analytics
- Daily progress log (hours studied vs planned)
- 28-day activity heatmap
- Mood tracking (1-5 scale)
- Thesis milestone tracker with progress bars
- Weekly report comparison (planned vs actual)
- Dashboard with stat cards

### Epic 3: Cross-Platform Integration
- Canvas LMS integration (connect + sync deadlines)
- Blackboard integration (connect + sync)
- Google Calendar export (push sessions)
- Advisor Dashboard integration (share progress)
- Demo sync imports sample deadlines/sessions

### Epic 4: Collaboration Hub
- Kanban board (To Do / In Progress / Done)
- Task creation with @mention support
- Project-based filtering
- Activity feed
- Priority levels (low/medium/high/urgent)

### GPA Predictor
- Course enrollment with credits and grades
- Current GPA calculation (weighted by credits)
- Predicted GPA (study hours impact model)
- Target GPA tracking
- Visual gauge bars
- AI insight text

## API Routes

All routes under `/api/planner/`:

- `GET/POST /courses` — Course management
- `GET/POST /sessions` — Study sessions
- `PUT/DELETE /sessions/:id`
- `GET/POST /deadlines`
- `PUT/DELETE /deadlines/:id`
- `GET/POST /progress` — Progress logs (upsert by date)
- `DELETE /progress/:id`
- `GET/POST /thesis` — Thesis milestones
- `PUT/DELETE /thesis/:id`
- `GET/POST /collab` — Collaboration tasks
- `PUT/DELETE /collab/:id`
- `GET/POST /gpa` — GPA entries
- `PUT/DELETE /gpa/:id`

## Design System

Omniflow Academic OS — deep navy dark theme:
- Background: `#0B0F1A`
- Surface: `#131929`
- Border: `#1E2D45`
- Primary: `#4F46E5` (indigo)
- Secondary: `#0EA5E9` (sky)
- Accent: `#06B6D4` (cyan)
- Success: `#10B981`
- Warning: `#F59E0B`
- Error: `#EF4444`

## Navigation

All navigation state lives in `frontend/src/pages/Index.tsx`.
Views: `landing` | `dashboard` | `schedule` | `progress` | `collab` | `gpa` | `integrations`
