# Product Requirements Document (PRD)

**Project Name:** Живущие мечтой (Living the Dream)
**Version:** 1.0
**Status:** Implemented
**Last Updated:** 2025-01-08

---

## 1. Executive Summary

"Живущие мечтой" is a Russian-language personal travel blog documenting cycling adventures across Europe. The project prioritizes minimalism, high performance, and privacy, serving as a static digital archive of travel experiences through text and photography.

### Key Objectives
- Create a fast, lightweight static blog
- Maintain clean, minimal aesthetic with 2025 "trendy" earth tone design
- Ensure privacy-focused experience (no tracking, no analytics)
- Achieve perfect Lighthouse scores across all metrics
- Provide seamless theme switching (light/dark mode)

---

## 2. Technical Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Framework** | Astro 5 | Static Site Generation with zero JavaScript by default |
| **Content Management** | Astro Content Collections | Type-safe content with glob loader |
| **Frontend Library** | React (selective) | For ThemeSwitcher component only |
| **Styling** | Tailwind CSS v4 | Utility-first with custom theme via Vite plugin |
| **Hosting** | GitHub Pages | Free static hosting with HTTPS |
| **Custom Domain** | livingthedream.ru | Personalized branding |
| **CI/CD** | GitHub Actions | Auto-deploy on push to main branch |
| **Content Format** | Markdown | Simple, version-controllable content |

---

## 3. Functional Requirements

### 3.1 Homepage (`/`)

**Location:** `src/pages/index.astro`

**Requirements:**
- **Layout:** Simple vertical list of all posts
- **Sorting:** Chronological order (oldest posts first via `publishDate`)
- **Content Display:** Post titles only (no dates, no cover images)
- **Pagination:** None (single scrollable list)
- **Empty State:** Russian message "Посты пока не опубликованы." when no posts exist
- **URL Structure:** Clean URLs without `/posts/` prefix (e.g., `/nachalo-puti/`)

**Implementation Details:**
```javascript
// Uses getCollection('posts') with glob loader
// Sorts by publishDate ascending
// Generates slugs by removing /index.md or .md extensions
```

---

### 3.2 Post Page (`/[slug]/`)

**Location:** `src/pages/posts/[id].astro` (planned, currently unimplemented)

**Requirements:**
- **Dynamic Routing:** Use `getStaticPaths()` to generate routes from Content Collection
- **Content Structure:**
  1. **Title:** Large, clear post title
  2. **Body:** Markdown content with images embedded between paragraphs
  3. **Gallery:** Grid of remaining images (20-30 photos) after main text

- **Image Handling:**
  - Inline images referenced in markdown via standard `![](path)` syntax
  - Gallery images specified via `images` array in frontmatter
  - Images stored in `public/posts/[slug]/images/` directory
  - Use Astro's `<Image />` component for optimization (responsive formats, lazy loading)

- **Lightbox:** Out of scope for MVP (planned for future iteration)

---

### 3.3 Content Schema

**Location:** `src/content.config.ts`

**Frontmatter Schema:**
```typescript
{
  title: string;              // Post title (required)
  description?: string;       // Optional description for SEO
  publishDate: Date;          // Used for chronological sorting (oldest first)
  images?: string[];          // Gallery images (displayed in grid after content)
  inlineImages?: string[];    // Images embedded within post content
}
```

**Content Structure:**
```
src/content/posts/
├── [slug]/
│   ├── index.md          // Markdown content with frontmatter
│   └── images/           // NOT implemented - images go to public/
```

**Public Assets Structure:**
```
public/posts/
├── [slug]/
│   └── images/
│       ├── 001.jpg
│       ├── 002.jpg
│       └── ...
```

---

### 3.4 Navigation & Layout

**Location:** `src/layouts/BaseLayout.astro`

**Header:**
- Site title "Живущие мечтой" linked to home
- Theme switcher button (Sun/Moon icons)
- Responsive padding (py-6 sm:py-8)
- Bottom border for visual separation

**Footer:**
- Site title "Живущие мечтой"
- Copyright notice with current year (© 2025)
- Responsive layout (column on mobile, row on desktop)

**Theme Switcher:**
- **Component:** `src/components/ThemeSwitcher.tsx` (React)
- **Directive:** `client:load` for immediate hydration
- **Features:**
  - Toggle between light/dark themes
  - localStorage persistence with key `'theme'`
  - System preference detection as fallback
  - Prevent flash of unstyled content via inline script
  - `mounted` state to avoid hydration mismatch

---

### 3.5 Theme System

**Location:** `src/styles/global.css`

**Design Philosophy:**
- 2025 "trendy" sophisticated earth tone palette
- Smooth transitions (0.3s ease) for all color changes
- CSS custom properties for easy theme switching
- Support for both `.light` and `.dark` classes on `<html>` element

**Color Palette:**

| Name | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| Background | `stone-50` (#fafaf9) | `stone-950` (#0c0a09) | Page background |
| Foreground | `stone-900` (#1c1917) | `stone-100` (#fafaf9) | Primary text |
| Muted | `stone-500` (#78716c) | `stone-400` (#a8a29e) | Secondary text |
| Accent | `sage-600` (#657550) | `sage-400` (#94a87e) | Links, buttons |
| Accent Hover | `sage-700` (#4f5c3e) | `sage-300` (#b3c2a0) | Interactive states |
| Border | `stone-200` (#e7e5e4) | `stone-800` (#292524) | Dividers, borders |

**Additional Palettes:**
- **Terracotta:** Warm accents (terracotta-50 through terracotta-950)
- **Muted Blue:** Subtle highlights (muted-blue-50 through muted-blue-950)

**Typography:**
- System font stack for zero latency
- Font family: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif`
- Line height: 1.6
- No external font files

---

### 3.6 SEO & Social Sharing

**Location:** `src/layouts/BaseLayout.astro` (head section)

**Required Meta Tags:**
```html
<!-- Basic SEO -->
<title>{title}</title>
<link rel="canonical" href={canonicalURL} />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:image" content={new URL(image, Astro.url)} />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content={canonicalURL} />
<meta property="twitter:title" content={title} />
<meta property="twitter:image" content={new URL(image, Astro.url)} />
```

**Props:**
- `title`: Default "Живущие мечтой"
- `image`: Default "/og-default.jpg"

**Privacy:**
- No analytics (Google Analytics, Plausible, etc.)
- No tracking cookies
- No RSS feed (intentional omission)

---

## 4. Non-Functional Requirements

### 4.1 Performance

**Targets:**
- Lighthouse Score: 100/100 across all categories (Performance, Accessibility, Best Practices, SEO)
- First Contentful Paint (FCP): < 1.0s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Total Blocking Time (TBT): < 100ms

**Implementation:**
- Static site generation (pre-rendered HTML)
- Native lazy loading for images (`loading="lazy"`)
- Astro Image service for responsive formats (WebP, AVIF)
- Minimal JavaScript (only for theme switcher)
- No external dependencies or CDNs

---

### 4.2 Accessibility

**Requirements:**
- Semantic HTML5 elements (`<header>`, `<main>`, `<footer>`, `<nav>`)
- Proper ARIA labels where needed (`aria-label="Blog posts"`)
- Color contrast ratios WCAG AA compliant
- Keyboard navigation support
- Visible focus indicators (`outline: 2px solid var(--color-accent)`)
- `lang="ru"` attribute on `<html>` element

---

### 4.3 Responsiveness

**Breakpoints:**
- Mobile: < 640px (default)
- Tablet: 640px - 1024px (`sm:`)
- Desktop: > 1024px (`lg:`)

**Mobile-First:**
- Base styles target mobile
- Progressive enhancement for larger screens
- Touch-friendly interactive elements

---

### 4.4 Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari iOS 14+

---

## 5. Infrastructure & DevOps

### 5.1 Repository

- **Platform:** GitHub
- **Visibility:** Public
- **Main Branch:** `main`

---

### 5.2 CI/CD Pipeline

**Location:** `.github/workflows/deploy.yml`

**Trigger:**
- Push to `main` branch
- Manual workflow dispatch

**Workflow:**
1. Checkout code
2. Setup Node.js v20 with npm caching
3. Install dependencies (`npm ci`)
4. Build Astro site (`npm run build`)
5. Upload `./dist` artifact
6. Deploy to GitHub Pages

**Permissions:**
- `contents: read`
- `pages: write`
- `id-token: write`

---

### 5.3 Domain Configuration

**Custom Domain:** livingthedream.ru

**DNS Settings:**
- CNAME record pointing to GitHub Pages
- CNAME file in `public/` directory

**Astro Config:**
```javascript
// astro.config.mjs
site: 'https://livingthedream.ru'
```

---

## 6. Development Workflow

### 6.1 Common Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Build production site to ./dist/
npm run preview      # Preview production build locally
npm ci               # Install dependencies (used in CI)
```

---

### 6.2 Branching Strategy

- **Direct deployment:** Push to `main` triggers production build
- **Feature branches:** Create branches for development, PR to main
- **No staging environment:** Preview locally before pushing to main

---

## 7. Content Guidelines

### 7.1 Language

- All content in **Russian**
- UTF-8 encoding
- Proper Russian typography

---

### 7.2 Image Guidelines

- Store in `public/posts/[slug]/images/`
- Use descriptive filenames (e.g., `001.jpg`, `002.jpg`)
- Reference with absolute paths: `/posts/[slug]/images/filename.jpg`
- Add alt text and title attributes

---

### 7.3 Post Structure

1. Start with title (frontmatter)
2. Publish date for sorting
3. Narrative content in paragraphs
4. Images interspersed with text
5. Explanatory footnotes (if needed)

---

## 8. Future Enhancements (Post-MVP)

| Feature | Priority | Description |
|---------|----------|-------------|
| **Lightbox** | High | Full-screen image viewing with keyboard navigation |
| **Post Page Implementation** | Critical | Dynamic routing for individual posts currently unimplemented |
| **Image Optimization** | Medium | Custom compression algorithms if Astro defaults insufficient |
| **Search** | Low | Client-side search if post count grows significantly |
| **RSS Feed** | Low | Optional feed for subscribers |
| **Comments** | Low | Third-party solution (e.g., giscus) if needed |

---

## 9. Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Lighthouse Performance | 100 | TBD |
| Lighthouse Accessibility | 100 | TBD |
| Lighthouse Best Practices | 100 | TBD |
| Lighthouse SEO | 100 | TBD |
| Deployment Time | < 2 min | TBD |
| Build Time | < 30 sec | TBD |

---

## 10. Appendix

### 10.1 File Structure

```
livingthedream-astro/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── public/
│   ├── CNAME                   # Custom domain
│   ├── favicon.svg             # Site icon
│   ├── og-default.jpg          # Default OG image
│   └── posts/                  # Post images
│       └── [slug]/
│           └── images/
├── src/
│   ├── components/
│   │   └── ThemeSwitcher.tsx   # Theme toggle button
│   ├── content/
│   │   ├── posts/              # Content collection
│   │   │   └── [slug]/
│   │   │       └── index.md    # Post content
│   │   └── content.config.ts   # Schema definition
│   ├── layouts/
│   │   └── BaseLayout.astro    # Main layout
│   ├── pages/
│   │   ├── index.astro         # Homepage
│   │   └── posts/
│   │       └── [id].astro      # Dynamic post page (TODO)
│   └── styles/
│       └── global.css          # Global styles + theme
├── astro.config.mjs            # Astro configuration
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration (if needed)
├── tsconfig.json               # TypeScript config
├── CLAUDE.md                   # Claude Code guidance
└── README.md                   # Project overview
```

---

### 10.2 Related Documents

- **CLAUDE.md:** Implementation guidance for Claude Code
- **astro.config.mjs:** Framework configuration
- **content.config.ts:** Content schema definition
