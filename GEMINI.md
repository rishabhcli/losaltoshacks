# Project Overview

This is a frontend React application built with Vite, TypeScript, and Tailwind CSS. The application, `@palantir/pilot-template`, appears to be a market analysis or trends dashboard designed to integrate with Palantir Foundry's Ontology via the `@osdk/react` (Palantir OSDK).

Currently, it utilizes a drop-in shim (`src/lib/osdk-shims.ts`) that replaces live Palantir OSDK hooks with mock data (`src/lib/mockData.ts`) so the application functions locally without an active backend connection.

## Key Technologies
- **Framework:** React 19, Vite
- **Language:** TypeScript
- **Routing:** React Router DOM (v6)
- **Styling:** Tailwind CSS 3.4 with PostCSS, `clsx`, `tailwind-merge`
- **UI Components:** Radix UI primitives (shadcn-like structure in `src/components/ui/`), Lucide React (icons)
- **State/Data Fetching:** `@tanstack/react-query`, local state context (`src/contexts/PreferencesContext.tsx`)
- **Backend/Data:** Palantir OSDK (shimmed locally)

## Architecture & Directory Structure
- `src/pages/`: Contains the main route components (e.g., `Dashboard`, `TrendsExplorer`, `Recommendations`, `Briefing`).
- `src/components/ui/`: Reusable, atomic UI components built on Radix UI (accordion, dialog, button, input, etc.).
- `src/components/market/`: Application-specific layout and domain components.
- `src/lib/`: Utility functions, authentication configurations (`auth.ts`), and the critical `osdk-shims.ts` file which provides a mock backend.
- `ontology/`: Contains Palantir Foundry ontology metadata and seed scripts.

## Building and Running

The project uses `pnpm` as its package manager.

**Key Commands:**
- **Development Server:** `pnpm run dev` (starts the Vite dev server)
- **Build Production:** `pnpm run build`
- **Preview Production Build:** `pnpm run preview`
- **Type Checking:** `pnpm run type-check` (runs `tsc --noEmit`)
- **Linting:** `pnpm run lint` and `pnpm run lint:fix`
- **Testing:** `pnpm run test` (uses Vitest)

## Development Conventions

- **Typing:** Strict TypeScript is enforced. Types and interfaces should be properly declared.
- **Styling:** Rely on Tailwind utility classes. For component variants, the codebase relies on `class-variance-authority` (cva) along with `cn` utility to merge classes.
- **Mocking Data:** Until a live Palantir backend is connected, any new data objects or actions should be updated or stubbed in `src/lib/osdk-shims.ts` and `src/lib/mockData.ts`.
- **Component Architecture:** Keep UI primitive concerns separate (in `src/components/ui/`) from domain/business logic components (in `src/components/market/`). Use React hooks (`src/hooks/`) for reusable component logic.
