# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Живущие мечтой" (Living the Dream) is a Russian-language travel blog built with Astro 5, documenting cycling adventures across Europe. The site is deployed to GitHub Pages with a custom domain (livingthedream.ru).

## Common Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Build production site to ./dist/
npm run preview      # Preview production build locally
npm ci               # Install dependencies (used in CI)
```

## Architecture

### Content Management
- Posts are managed via Astro Content Collections in `src/content/posts/[slug]/index.md`
- Content schema defined in `src/content.config.ts`
- Each post directory contains:
  - `index.md` - Markdown content with frontmatter
  - `images/` - Post-specific images referenced via `images` or `inlineImages` arrays

### Frontmatter Schema
```typescript
{
  title: string,              // Post title
  description?: string,       // Optional description
  publishDate: Date,          // Used for chronological sorting (oldest first)
  images?: string[],          // Gallery images (displayed in grid)
  inlineImages?: string[]     // Images embedded within post content
}
```

### Routing & Pages
- `src/pages/index.astro` - Home page listing all posts
- `src/pages/posts/[id].astro` - Dynamic post page using `getStaticPaths()`
- Clean URLs: `/posts/[slug]/`

### Styling System
- **Tailwind CSS v4** via Vite plugin with custom earth tone palette
- CSS custom properties defined in `src/styles/global.css`:
  - `--color-background`, `--color-foreground`, `--color-muted`, `--color-accent`, `--color-accent-hover`, `--color-border`
- Theme switching handled via `.light` and `.dark` classes on `<html>`
- All colors support smooth transitions (0.3s ease)

### Color Palette
- Stone (base neutrals): `stone-50` through `stone-950`
- Sage (accents): `sage-50` through `sage-950`
- Terracotta (warm accents): `terracotta-50` through `terracotta-950`
- Muted Blue (highlights): `muted-blue-50` through `muted-blue-950`

### Components
- **ThemeSwitcher.tsx** - React component with `client:load` directive
  - Manages dark/light theme with localStorage persistence
  - Detects system preference as fallback
  - Uses `mounted` state to avoid hydration mismatch

### Layouts
- **BaseLayout.astro** - Main layout with SEO meta tags
  - Props: `title` (default: "Живущие мечтой"), `image` (default: "/og-default.jpg")
  - Open Graph and Twitter card meta tags
  - Canonical URL generation using `Astro.site`

## Deployment Configuration

**astro.config.mjs:**
```javascript
site: 'https://livingthedream.ru'  // Custom domain
```

**GitHub Actions CI/CD** (`.github/workflows/deploy.yml`):
- Triggers on push to `main` branch
- Uses Node.js 20 with npm caching
- Runs `npm ci` + `npm run build`
- Deploys `./dist` to GitHub Pages

## Language Note

All blog content is in **Russian**. The `<html>` element uses `lang="ru"`. When editing content or templates, ensure proper UTF-8 encoding and Russian character support.
