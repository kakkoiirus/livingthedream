# Product Requirements Document (PRD)

**Project Name:** Живущие мечтой (Living the Dream)
**Version:** 2.0
**Status:** Implemented
**Last Updated:** 2025-01-16

---

## 1. Executive Summary

"Живущие мечтой" is a Russian-language personal travel blog documenting cycling adventures across Europe. The project prioritizes minimalism, high performance, and privacy, serving as a static digital archive of travel experiences through text and photography.

### Key Objectives
- Create a fast, lightweight static blog
- Maintain clean, minimal aesthetic with typography-focused design
- Ensure privacy-focused experience (no tracking, no analytics)
- Achieve perfect Lighthouse scores across all metrics
- Provide seamless theme switching (light/dark/system modes)

---

## 2. Technical Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Framework** | Astro 5 | Static Site Generation with zero JavaScript by default |
| **Content Management** | Astro Content Collections | Type-safe content with glob loader |
| **Frontend Library** | React (selective) | For ThemeSwitcher component only |
| **Styling** | Tailwind CSS v4 | Utility-first with custom theme via Vite plugin |
| **Typography** | Newsreader (Google Fonts) | Serif display font for elegant reading experience |
| **Icons** | Material Symbols Outlined | Google's icon font for consistent iconography |
| **Hosting** | GitHub Pages | Free static hosting with HTTPS |
| **Custom Domain** | livingthedream.ru | Personalized branding |
| **CI/CD** | GitHub Actions | Auto-deploy on push to main branch |
| **Content Format** | Markdown | Simple, version-controllable content |

---

## 3. Functional Requirements

### 3.1 Homepage (`/`)

**Location:** `src/pages/index.astro`

**Requirements:**
- **Layout:** Simple vertical list of all posts with large italic titles
- **Sorting:** Chronological order (oldest posts first via `publishDate`)
- **Content Display:** Post titles only (no dates, no cover images)
- **Typography:** `text-2xl md:text-3xl italic font-normal`
- **Spacing:** `space-y-12 md:space-y-16` between posts
- **Link Animation:** Underline animation on hover (`.link-hover` class)
- **Pagination:** None (single scrollable list)
- **Empty State:** Russian message "Посты пока не опубликованы." when no posts exist
- **URL Structure:** Clean URLs without `/posts/` prefix (e.g., `/nachalo-puti/`)
- **Decorative Element:** Loading spinner at bottom (purely decorative, `aria-hidden="true"`)

**Implementation Details:**
```javascript
// Uses getCollection('posts') with glob loader
// Sorts by publishDate ascending
// Generates slugs by removing /index.md or .md extensions
```

---

### 3.2 Post Page (`/[slug]/`)

**Location:** `src/pages/[id].astro`

**Requirements:**
- **Dynamic Routing:** Use `getStaticPaths()` to generate routes from Content Collection
- **Max Width:** 65ch for optimal reading experience
- **Content Structure:**
  1. **Back Link:** "На главную" with `arrow_back` Material Symbol icon
  2. **Title:** Large post title with decorative green line underneath
  3. **Body:** Markdown content with images embedded between paragraphs
  4. **Gallery:** Grid of remaining images (20-30 photos) after main text
  5. **Footer Decoration:** Gradient line at bottom

- **Image Handling:**
  - Inline images referenced in markdown via standard `![](path)` syntax
  - Gallery images specified via `images` array in frontmatter
  - Images stored in `public/posts/[slug]/images/` directory
  - Use Astro's `<Image />` component for optimization (responsive formats, lazy loading)

- **Decorative Elements:**
  - Green accent line under title: `w-12 h-1 rounded-full` with `--color-primary`
  - Gradient footer: `linear-gradient(to right, transparent, var(--color-border), transparent)`

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
- Sticky positioning with backdrop blur (`backdrop-blur-md`)
- Site title "Живущие мечтой" linked to home with link-hover animation
- Theme switcher button (Material Symbols icons)
- Responsive padding (py-4 sm:py-6)
- Bottom border for visual separation

**Footer:**
- Minimal centered design
- Copyright notice: "© {year} Живущие мечтой"
- Single text line with muted color

**Theme Switcher:**
- **Component:** `src/components/ThemeSwitcher.tsx` (React)
- **Directive:** `client:load` for immediate hydration
- **Features:**
  - Three-state toggle: light → dark → system
  - localStorage persistence with key `'theme'`
  - System preference detection as fallback
  - Prevent flash of unstyled content via inline script
- **Icons:** Material Symbols (`light_mode`, `dark_mode`, `desktop_windows`)
- **Styling:** Transparent background, rounded-full, hover opacity change

---

### 3.5 Theme System

**Location:** `src/styles/global.css`

**Design Philosophy:**
- Minimalist typography-focused design
- Green accent color palette (#2d5340 primary)
- Smooth transitions (0.3s ease) for all color changes
- CSS custom properties for easy theme switching
- Support for both `.light` and `.dark` classes on `<html>` element

**Color Palette:**

| Name | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| Background | `#f8f7f7` | `#0c0c0c` | Page background |
| Foreground | `#1a1a1a` | `#e8e8e8` | Primary text |
| Muted | `#666666` | `#999999` | Secondary text |
| Primary | `#2d5340` | `#4a7a5f` | Accent color (green) |
| Primary Light | `#3d6b52` | `#5a8a6f` | Accent hover state |
| Border | `#e5e5e5` | `#222222` | Dividers, borders |

**Typography:**
- **Display Font:** Newsreader (Google Fonts) - serif with optical sizing
- **Font URL:** `https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap`
- **Icons:** Material Symbols Outlined (Google Fonts)
- **Icon URL:** `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200`
- **Line height:** 1.6
- **Cyrillic Support:** Yes

**Custom CSS:**
```css
/* Custom scrollbar (8px width, rounded thumb) */
/* Selection color (--color-primary) */
/* Link hover animation (scaleX transform) */
/* Focus visible styles (2px solid --color-primary) */
```

---

### 3.6 SEO & Social Sharing

**Location:** `src/layouts/BaseLayout.astro` (head section)

**Required Meta Tags:**
```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:..." rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:..." rel="stylesheet">

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
- Google Fonts via CDN with preconnect

---

### 4.2 Accessibility

**Requirements:**
- Semantic HTML5 elements (`<header>`, `<main>`, `<footer>`, `<nav>`, `<article>`)
- Proper ARIA labels where needed (`aria-label="Blog posts"`, `aria-label="Navigation"`)
- Color contrast ratios WCAG AA compliant
- Keyboard navigation support
- Visible focus indicators (`outline: 2px solid var(--color-primary)`)
- `lang="ru"` attribute on `<html>` element
- Decorative elements marked with `aria-hidden="true"`

---

### 4.3 Responsiveness

**Breakpoints:**
- Mobile: < 640px (default)
- Tablet: 640px - 1024px (`sm:`, `md:`)
- Desktop: > 1024px (`lg:`)

**Mobile-First:**
- Base styles target mobile
- Progressive enhancement for larger screens
- Touch-friendly interactive elements (40px minimum touch target)

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
- Newsreader font supports Cyrillic characters

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
| **Image Optimization** | Medium | Custom compression algorithms if Astro defaults insufficient |
| **Search** | Low | Client-side search if post count grows significantly |
| **RSS Feed** | Low | Optional feed for subscribers |
| **Comments** | Low | Third-party solution (e.g., giscus) if needed |

---

## 9. Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Lighthouse Performance | 100 | Achieved |
| Lighthouse Accessibility | 100 | Achieved |
| Lighthouse Best Practices | 100 | Achieved |
| Lighthouse SEO | 100 | Achieved |
| Deployment Time | < 2 min | Achieved |
| Build Time | < 30 sec | Achieved |

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
│   │   └── [id].astro          # Dynamic post page
│   └── styles/
│       └── global.css          # Global styles + theme
├── astro.config.mjs            # Astro configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── CLAUDE.md                   # Claude Code guidance
├── docs/
│   └── PRD.md                  # This document
└── README.md                   # Project overview
```

---

### 10.2 Related Documents

- **CLAUDE.md:** Implementation guidance for Claude Code
- **astro.config.mjs:** Framework configuration
- **content.config.ts:** Content schema definition

---

### 10.3 Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2025-01-16 | Redesigned with Newsreader typography, Material Symbols icons, green accent palette, sticky header, link animations |
| 1.0 | 2025-01-08 | Initial implementation with earth tone palette |
