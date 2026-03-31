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

## Dialog / Form UI Patterns

- Form fields inside dialogs must occupy full dialog width (`w-full`).
- When two fields fit comfortably side by side (e.g. Valor + Data, Origem + Destino), use `grid grid-cols-2 gap-3`.
- Date fields must **never** use `type="date"` (native browser picker). Use a plain `<Input>` with `placeholder="dd/mm/aaaa"`, `maxLength={10}`, and the `maskDate` helper from `@/shared/utils/masks` applied via `register`'s `onChange`. Convert back to ISO on submit with `unmaskDate`.

```tsx
// Applying mask via register onChange (pattern from add-stock-entry-dialog)
<Input
  id="field-id"
  placeholder="dd/mm/aaaa"
  maxLength={10}
  {...register("fieldName", {
    onChange: (e) => setValue("fieldName", maskDate(e.target.value)),
  })}
/>

// In onSubmit — convert DD/MM/AAAA → YYYY-MM-DD
fieldName: unmaskDate(values.fieldName) ?? values.fieldName,
```

## Backend

- NestJS REST API at `localhost:3001` (dev) / `api.actionbee.com.br` (prod)
- All admin endpoints require Bearer token via `Authorization` header.
- Authenticated requests go through `apiFetch` in `src/shared/infrastructure/api/api-client.ts`.
