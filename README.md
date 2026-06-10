# able-pro-material-react-ts
# SmartOps Frontend

React + TypeScript frontend for the SmartOps operations management platform. Built with Vite, MUI, Redux Toolkit, and RTK Query.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| MUI v6 | Component library |
| Redux Toolkit | Global state management |
| RTK Query | API data fetching & caching |
| React Router v7 | Client-side routing |
| Inter (Fontsource) | Typography |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- SmartOps backend running (see backend repo)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000/dev
VITE_APP_BASE_NAME=/
```

### Development

```bash
npm run dev
```

App runs at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Folder Structure

```
src/
├── main.tsx                          # Entry point
├── App.tsx                           # Root component (Provider + Theme + Router)
├── theme.ts                          # MUI custom theme
├── index.css                         # Global styles + scrollbar reset
│
├── types/
│   └── index.ts                      # All shared TypeScript interfaces
│                                     # (User, Task, Notification, ActivityLog, etc.)
│
├── store/
│   ├── index.ts                      # Redux store + typed hooks
│   ├── api/
│   │   ├── apiSlice.ts               # RTK Query base with 401 handling
│   │   ├── authApi.ts                # /auth endpoints
│   │   ├── taskApi.ts                # /tasks endpoints
│   │   ├── userApi.ts                # /users endpoints
│   │   └── notificationApi.ts        # /notifications + /dashboard + /activity-logs
│   └── slices/
│       ├── authSlice.ts              # Auth state (user, token, isAuthenticated)
│       ├── taskSlice.ts              # Task list + filters state
│       └── uiSlice.ts                # Sidebar, snackbar, dialog open/close flags
│
├── routes/
│   └── AppRoutes.tsx                 # All routes with ProtectedRoute/PublicRoute guards
│
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx       # Main shell (sidebar + header + outlet + global dialogs)
│   │   ├── AppSidebar.tsx            # Collapsible nav drawer, role-aware links
│   │   └── AppHeader.tsx             # Top bar, notification badge, user menu
│   └── common/
│       ├── AppInit.tsx               # Syncs user profile from API on app load
│       ├── PageHeader.tsx            # Page title + breadcrumbs + action slot
│       ├── StatusChip.tsx            # TaskStatus → colored MUI Chip
│       ├── PriorityChip.tsx          # TaskPriority → colored MUI Chip
│       ├── UserAvatar.tsx            # Avatar with tooltip from User object
│       ├── TaskCard.tsx              # Card component for grid task view
│       ├── DashboardStats.tsx        # Stat overview cards row
│       ├── EmptyState.tsx            # Centered empty state with optional CTA
│       ├── ConfirmDialog.tsx         # Reusable confirm/delete modal
│       ├── CreateTaskDialog.tsx      # Task creation form (Redux-driven open/close)
│       ├── EditTaskDialog.tsx        # Task edit form (Redux-driven open/close)
│       └── CreateUserDialog.tsx      # User creation form (admin only)
│
├── pages/
│   ├── auth/
│   │   └── LoginPage.tsx             # Email + password login
│   ├── dashboard/
│   │   └── DashboardPage.tsx         # Stats, charts, at-risk tasks, activity feed
│   ├── tasks/
│   │   ├── TasksPage.tsx             # Task list with table/grid toggle + filters
│   │   └── TaskDetailPage.tsx        # Full task detail, comments, status/assign
│   ├── team/
│   │   └── TeamPage.tsx              # User management table (admin/manager)
│   ├── activity/
│   │   └── ActivityPage.tsx          # Audit log with change diffs
│   └── notifications/
│       └── NotificationsPage.tsx     # Notification list with mark read/all
│
└── utils/
    └── helpers.ts                    # formatDate, getUserInitials, statusColor, etc.
```

---

## Pages & Features

### Login (`/login`)
- Email + password authentication
- JWT token stored in `localStorage`
- Redirects to `/dashboard` on success

### Dashboard (`/dashboard`)
- Overview stats: total tasks, completion rate, overdue, at-risk, active users
- Task breakdown by status and priority with progress bars
- At-risk tasks list
- Recent activity feed

### Tasks (`/tasks`)
- Table view and grid view toggle
- Filter by status, priority, search
- Pagination
- Create, edit, delete tasks
- Click row to open task detail

### Task Detail (`/tasks/:id`)
- Full task info: description, tags, assignee, due date, project, department
- Inline status and assignee change (admin/manager)
- Comment thread with Enter-to-send
- Watch/unwatch toggle
- Time tracking progress bar

### Team (`/team`) — Admin/Manager only
- User table with search, role, status filters
- Inline role change dropdown
- Create and delete users

### Activity (`/activity`) — Admin/Manager only
- Full audit log table
- Shows who changed what, from/to values, IP address, timestamp

### Notifications (`/notifications`)
- All/unread filter
- Mark individual or all as read
- Clicking a task notification navigates to that task

---

## State Management

### Redux Slices

| Slice | Manages |
|-------|---------|
| `auth` | Current user, JWT token, isAuthenticated |
| `tasks` | Task list, filters, pagination, selected task |
| `ui` | Sidebar open state, snackbar, dialog open/close |

### RTK Query Tags

| Tag | Invalidated by |
|-----|---------------|
| `Task` | createTask, updateTask, deleteTask, updateStatus, assign |
| `User` | createUser, updateUser, deleteUser, changeRole |
| `Notification` | markSeen, markAllSeen |
| `Dashboard` | createTask, updateTask, deleteTask |
| `Activity` | — (read-only) |

---

## Authentication Flow

1. User submits login form → `POST /auth/login`
2. Token + user saved to Redux state and `localStorage`
3. `AppInit` fires `GET /auth/profile` in background to sync fresh user data
4. All API calls attach `Authorization: Bearer <token>` via RTK Query `prepareHeaders`
5. Any `401` response clears `localStorage` and redirects to `/login`
6. On refresh, token is rehydrated from `localStorage` automatically

---

## Role-Based Access

| Feature | user | manager | admin |
|---------|------|---------|-------|
| View tasks | ✅ | ✅ | ✅ |
| Create tasks | ✅ | ✅ | ✅ |
| Edit tasks | ✅ | ✅ | ✅ |
| Delete tasks | ❌ | ✅ | ✅ |
| Change task status (inline) | ❌ | ✅ | ✅ |
| Assign tasks (inline) | ❌ | ✅ | ✅ |
| View Team page | ❌ | ✅ | ✅ |
| Create/delete users | ❌ | ❌ | ✅ |
| Change user roles | ❌ | ❌ | ✅ |
| View Activity log | ❌ | ✅ | ✅ |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/dev` |
| `VITE_APP_BASE_NAME` | Vite base path | `/` |

---

## Key Design Decisions

- **No axios** — RTK Query's `fetchBaseQuery` handles all HTTP with automatic token injection and 401 redirect
- **Global dialogs in layout** — `CreateTaskDialog`, `EditTaskDialog`, `CreateUserDialog` live in `DashboardLayout` and are controlled via Redux `uiSlice` so any page can open them without prop drilling
- **`?? []` guards everywhere** — API responses may omit array fields (`tags`, `comments`, `watchedBy`); all array accesses are guarded to prevent runtime crashes
- **Sidebar collapses to icons** — `sidebarOpen` in `uiSlice` drives a permanent MUI Drawer that transitions between 240px and 64px