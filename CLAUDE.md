# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # TypeScript check + production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

This is a React SPA for managing real estate lot sales (compra/venta de lotes) with role-based access control. Currently uses mock data, designed for future Supabase integration.

### Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui components
- React Router v6 for routing
- Context API for state management

### Core Concepts

**Role System** (`src/types/index.ts`, `src/utils/permissions.ts`):
- `master`: Full access including user management
- `admin`: Project/lot management, no deletion
- `comercial`: Sales operations, assign lots, register payments
- `cliente`: View own statement only

**Data Flow**:
- `AuthContext` handles login/logout with mock users from `src/data/users.ts`
- `DataContext` provides CRUD operations for projects, lots, payments
- `ProtectedRoute` enforces role-based access on routes

**Key Patterns**:
- Path alias `@/` maps to `src/`
- UI components in `src/components/ui/` follow shadcn/ui conventions
- Mock data in `src/data/` simulates backend responses
- Formatters in `src/utils/formatters.ts` handle currency (MXN), dates, status labels

### Domain Model
- **Project**: Real estate development with multiple lots
- **Lot**: Individual plot with status (available/reserved/sold), payment plan
- **Payment**: Transaction record (down_payment/monthly/extra)
- **Statement**: Calculated view of client's payment progress

## Test Credentials

```
master@lotes.com / master123
admin@lotes.com / admin123
ventas@lotes.com / ventas123
cliente1@email.com / cliente123
```
