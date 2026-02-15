# ActionBee Admin — Project Directives

## General Rules

- **Mobile-first responsive design**: Every component and page MUST be fully responsive. Always design for mobile first, then scale up for tablet and desktop.
- Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) consistently.
- Tables must have a mobile-friendly alternative (cards, stacked layout, or horizontal scroll).
- Dialogs/modals must be full-screen on mobile (`sm:max-w-*` pattern).
- Sidebar must be collapsible/off-canvas on mobile (already handled by Shadcn SidebarProvider).
- Touch targets must be at least 44px on mobile.
- Test all layouts at 320px, 375px, 768px, and 1024px+ breakpoints.

## Architecture

- Clean Architecture with bounded contexts under `src/contexts/`.
- Each context has: domain, application, infrastructure, presentation layers.
- Shared code goes in `src/shared/`.
- DI wiring in `<context>/di.ts`.

## Tech Stack

- Next.js (App Router), TypeScript, TailwindCSS, Shadcn/ui
- TanStack Query, React Hook Form, Zod
- Font: Montserrat
- Palette: Bee Gold (#FBBD23), Bee Amber (#FCAC1C), Black (#000000)

## Backend

- NestJS REST API at `localhost:3001` (dev) / `api.actionbee.com.br` (prod)
- All admin endpoints require Bearer token via `Authorization` header.
- Authenticated requests go through `apiFetch` in `src/shared/infrastructure/api/api-client.ts`.
