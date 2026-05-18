# Tony Ashiuma — Portfolio

Personal portfolio and automation showcase for Tony Ashiuma, built with React, TypeScript, Vite, and Tailwind CSS. Deployed on Cloudflare Pages.

## Tech stack

- **React** + **TypeScript**
- **Vite**
- **Tailwind CSS** + **shadcn/ui**
- **React Router**

## Local development

```sh
# Install dependencies
npm install

# Start dev server
npm run dev
```

## Build & deploy

```sh
# Production build
npm run build
```

Deployed automatically via Cloudflare Pages on push to `main`.

## Structure

```
src/
  pages/          # Route-level pages (Home, Automation, AutomationDetail, ...)
  components/     # Shared UI components (Navbar, Footer, WorkflowDiagram, ...)
  data/           # Static project data (automationProjects.ts, ...)
  hooks/          # Custom React hooks
public/
  shots/          # Project screenshots
```
