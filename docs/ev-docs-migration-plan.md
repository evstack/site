# EV Docs Migration Plan: VitePress to Fumadocs (Next.js)

## Context

The ev-node documentation currently lives in a separate VitePress site (`/ev-node/docs/`). We're migrating it into the Evolve marketing site (`/evolve/`) built with Next.js 16, React 19, and Tailwind CSS 4. The docs will live at `/docs/*` alongside the existing marketing pages (`/`, `/privacy-policy`, `/terms-and-conditions`).

**Core requirement**: Keep `.md` files with minimal changes. A one-time cleanup of 12 files removes Vue-specific syntax; the remaining 112 files drop in untouched. All content, structure, and dynamic version rendering are preserved. No conversion to `.mdx`. No build-time pre-processor scripts.

**Why Fumadocs?** It's built specifically for Next.js App Router, uses Tailwind CSS 4, and provides battle-tested docs primitives (sidebar, search, TOC, components) out of the box. It processes `.md` files natively through its MDX compiler. Combined with remark plugins, it handles VitePress container syntax (`:::tip`, `:::warning`, `:::code-group`) transparently.

---

## VitePress Syntax Audit

Thorough audit of all 124 `.md` files reveals the exact VitePress features in use:

### Container directives — 35 instances across 12 files
- `:::tip` — 8 occurrences (7 files)
- `:::warning` / `:::warning Disclaimer` — 5 occurrences (4 files)
- `:::info` — 1 occurrence
- `:::code-group` — 4 instances across 3 files (tabbed code blocks)
- No `:::danger` or `:::note` found

### `<script setup>` blocks — 8 files
All import either Vue components or the shared constants file:
- `import constants from '../.vitepress/constants/constants.js'` — 7 files
- `import Callout from '../.vitepress/components/callout.vue'` — 3 files
- `import spec from '../src/openapi-rpc.json'` — 2 files (API docs)

### Template interpolation `{{ }}` — 3 files
Only used inside code blocks with `sh-vue` / `ts-vue` language specifiers (a VitePress feature that processes template syntax inside fenced code). Example:
```
```sh-vue [Arabica]
Evolve Version: {{constants.celestiaNodeArabicaEvolveTag}}
```
```

### Vue components in markdown — 4 total
| Component | Used in | Size | Purpose |
|-----------|---------|------|---------|
| `<Callout />` | 3 files | 15 lines | Alpha notice banner |
| `<CelestiaGasEstimator />` | 1 file | 1,589 lines | Interactive gas calculator |
| `<OAIntroduction :spec="spec" />` | 1 file | External lib | OpenAPI intro (vitepress-openapi) |
| `twitter.vue`, `keplr.vue` | 0 files | — | Present but unused in markdown |

### Other VitePress features
- **Mermaid diagrams** — 1 file (`guides/deploy/testnet.md`)
- **Custom heading IDs** (`{#custom-id}`) — 24 files
- **Internal links with `.md` extension** — used extensively (`./path.md`)
- **Reference-style links** — 102 instances across specs and ADRs
- **Frontmatter** — 13 files (standard `description`, `title`, plus VitePress-specific `layout: home`, `pageClass`, `aside`, `outline`)
- **Home page hero** (`index.md`) — VitePress `layout: home` with hero/features YAML (will NOT be migrated — the marketing site IS the homepage)

### What is NOT used
- `:::danger`, `:::note` containers
- `[[toc]]` directive
- Line highlighting in code blocks (`js{1,3-5}`)
- `<script>` (only `<script setup>`)

---

## Recommended Approach: Fumadocs + One-Time Cleanup + Remark Plugins

### Architecture overview

```
.md files in content/docs/
        │
        ▼
┌─────────────────────────────────────────────┐
│  Fumadocs MDX compiler                       │
│  + remark-directive                          │
│  + remarkAdmonition (:::tip → <Callout>)     │
│  + remark-vitepress-codegroup                │
│    (:::code-group → <Tabs>)                  │
│  + remark-template-vars                      │
│    (%golangVersion% → actual value)          │
│  + remark-strip-md-links                     │
│    (./path.md → ./path)                      │
│  + client-side Mermaid rendering             │
│  + Shiki syntax highlighting (built-in)      │
└─────────────────────────────────────────────┘
        │
        ▼
  Rendered docs at /docs/*
```

### How each VitePress feature is handled

| VitePress feature | Solution | Type |
|---|---|---|
| `:::tip`, `:::warning`, `:::info` | Fumadocs built-in `remarkAdmonition` plugin | Remark plugin (zero-config) |
| `:::code-group` (tabbed code blocks) | Custom `remark-vitepress-codegroup` plugin → Fumadocs `<Tabs>` | Remark plugin |
| `<script setup>` blocks | One-time cleanup: delete from 8 files | One-time edit |
| `<Callout />` Vue component | One-time cleanup: replace with `:::tip` + static text in 3 files | One-time edit |
| `{{constants.xxx}}` in `sh-vue` blocks | One-time cleanup: change `sh-vue` → `sh`, change `{{constants.xxx}}` → `%xxx%` marker | One-time edit |
| Dynamic version rendering | `remark-template-vars` plugin resolves `%xxx%` markers from `docs-constants.ts` at build time | Remark plugin |
| `<CelestiaGasEstimator />` | React port, mapped via MDX components | React component |
| `<OAIntroduction />` (OpenAPI) | Replaced by `fumadocs-openapi` | Fumadocs plugin |
| Internal links with `.md` extension | `remark-strip-md-links` plugin | Remark plugin |
| Custom heading IDs `{#id}` | Supported by Fumadocs / `remark-heading-id` | Built-in or plugin |
| Mermaid diagrams | Client-side React component using `mermaid` package | React component |
| Frontmatter (`description`, `title`) | Native Fumadocs support | Built-in |
| VitePress `layout: home` (`index.md`) | Not migrated — marketing site is the homepage | Skipped |

---

## One-Time Cleanup: 12 Files

Only 12 of 124 files need any changes. The edits are small and mechanical:

### Edit type 1: Strip `<script setup>` blocks (8 files)
Delete the entire block (3–4 lines each):
```md
<!-- DELETE THIS BLOCK -->
<script setup>
import Callout from '../.vitepress/components/callout.vue'
import constants from '../.vitepress/constants/constants.js'
</script>
```

### Edit type 2: Replace `<Callout />` with `:::tip` (3 files)
```md
<!-- BEFORE -->
:::tip
<Callout />
:::

<!-- AFTER -->
:::tip
This tutorial explores Evolve, currently in Alpha stage.
:::
```

### Edit type 3: Convert `sh-vue` to `sh` + template markers (3 files)
Replace VitePress template interpolation with remark-compatible markers:
```md
<!-- BEFORE -->
```sh-vue [Arabica]
Evolve Version: {{constants.celestiaNodeArabicaEvolveTag}}
Celestia Node Version: {{constants.celestiaNodeArabicaTag}}
```

<!-- AFTER -->
```sh [Arabica]
Evolve Version: %celestiaNodeArabicaEvolveTag%
Celestia Node Version: %celestiaNodeArabicaTag%
```
```

The `%xxx%` markers are resolved to actual values at build time by the `remark-template-vars` plugin, reading from `docs-constants.ts`. This preserves dynamic version rendering — update one file, all docs reflect the change.

### Edit type 4: Replace `<OAIntroduction>` (1 file — `api/index.md`)
Replace the VitePress OpenAPI component with a reference to the Fumadocs OpenAPI-generated pages. This file is restructured as part of the OpenAPI migration (Phase 4).

### Files NOT edited (112 of 124)
These drop in completely untouched. Standard Markdown with `:::` containers, code blocks, links, images, tables, frontmatter — all handled by Fumadocs + remark plugins.

---

## Dynamic Version Rendering

Version strings remain centrally managed, matching the VitePress DX:

**VitePress (old)**:
```
constants.js → <script setup> import → {{constants.xxx}} in sh-vue code blocks
```

**Fumadocs (new)**:
```
docs-constants.ts → remark-template-vars plugin → %xxx% in sh code blocks
```

**`src/lib/docs-constants.ts`** — single source of truth:
```ts
export const docsConstants: Record<string, string> = {
  golangVersion: 'go1.25.0',
  evolveLatestTag: 'v1.0.0-beta.4',
  evolveIgniteAppVersion: 'evolve/v0.4.0',
  localDALatestTag: 'v1.0.0-beta.1',
  igniteVersionTag: 'v28.5.3',
  celestiaNodeArabicaTag: 'v0.23.4-arabica',
  celestiaNodeMochaTag: 'v0.23.4-mocha',
  celestiaNodeMainnetTag: 'v0.22.3',
  // ... all other constants
};
```

**`src/plugins/remark-template-vars.ts`** — remark plugin:
```ts
// Walks the AST, finds code block text nodes containing %xxx%,
// replaces with the matching value from docsConstants.
// Runs inside Fumadocs' MDX pipeline — no external build step.
```

To bump a version: edit `docs-constants.ts` → all docs pages reflect the change on next build. Same workflow as updating `constants.js` in VitePress.

---

## Integration Architecture

```
content/
  docs/                     ← .md files (original VitePress content, one-time cleanup applied)
    meta.json               ← Root sidebar config (new file)
    learn/
      meta.json             ← Sidebar order (new file)
      about.md
      data-availability.md
      sequencing/
        meta.json
        overview.md
        single.md
        based.md
      specs/
        meta.json
        ...
      ...
    guides/
      meta.json
      quick-start.md
      gm-world.md
      da/
        meta.json
        local-da.md
        celestia-da.md
        ...
      deploy/
      evm/
      ...
    api/
      meta.json
      index.md
    reference/
    concepts/
    overview/
    ev-abci/
    ev-reth/
    adr/

src/app/
  layout.tsx                ← Wrap with RootProvider
  page.tsx                  ← Marketing homepage (unchanged)
  privacy-policy/           ← Legal pages (unchanged)
  terms-and-conditions/     ← Legal pages (unchanged)
  docs/
    layout.tsx              ← DocsLayout with sidebar tree
    [[...slug]]/
      page.tsx              ← Catch-all docs page renderer
  api/
    search/
      route.ts              ← Fumadocs search API endpoint

src/lib/
  source.ts                 ← Fumadocs source/loader config
  layout.shared.tsx         ← Shared layout options (nav links, logo)
  docs-constants.ts         ← Version strings (single source of truth)

src/plugins/
  remark-template-vars.ts       ← %xxx% → actual values in code blocks
  remark-vitepress-codegroup.ts ← :::code-group → <Tabs>
  remark-strip-md-links.ts      ← Strip .md from internal links

src/components/
  mdx.tsx                       ← MDX component overrides
  docs/
    CelestiaGasEstimator.tsx    ← React port of Vue component
    MermaidDiagram.tsx           ← Client-side Mermaid renderer
```

### Key files to create/modify

| File | Action | Purpose |
|------|--------|---------|
| `source.config.ts` | Create | Define docs collection, remark plugins |
| `next.config.mjs` | Modify | Wrap with `createMDX()` |
| `tsconfig.json` | Modify | Add `"collections/*": [".source/*"]` path alias |
| `src/app/globals.css` | Modify | Add Fumadocs CSS imports |
| `src/app/layout.tsx` | Modify | Wrap with `RootProvider` |
| `src/app/docs/layout.tsx` | Create | DocsLayout with sidebar |
| `src/app/docs/[[...slug]]/page.tsx` | Create | Catch-all page renderer |
| `src/app/api/search/route.ts` | Create | Search endpoint |
| `src/lib/source.ts` | Create | Fumadocs loader |
| `src/lib/layout.shared.tsx` | Create | Shared nav/layout config |
| `src/lib/docs-constants.ts` | Create | Version constants (single source of truth) |
| `src/plugins/remark-template-vars.ts` | Create | Dynamic version rendering in code blocks |
| `src/plugins/remark-vitepress-codegroup.ts` | Create | Code-group to Tabs plugin |
| `src/plugins/remark-strip-md-links.ts` | Create | Remove .md from links |
| `src/components/mdx.tsx` | Create | MDX components mapping |
| `src/components/docs/CelestiaGasEstimator.tsx` | Create | React port of Vue gas calculator |
| `src/components/docs/MermaidDiagram.tsx` | Create | Client-side Mermaid renderer |
| `.gitignore` | Modify | Add `.source/` |

---

## Step-by-Step Implementation Plan

### Phase 1: Fumadocs Scaffold

**1.1 Install dependencies**
```bash
npm i fumadocs-mdx fumadocs-core fumadocs-ui @types/mdx remark-directive
```

**1.2 Create `source.config.ts`** at project root
```ts
import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import remarkDirective from 'remark-directive';
import { remarkAdmonition } from 'fumadocs-core/mdx-plugins';
import { remarkTemplateVars } from './src/plugins/remark-template-vars';
import { remarkVitepressCodeGroup } from './src/plugins/remark-vitepress-codegroup';
import { remarkStripMdLinks } from './src/plugins/remark-strip-md-links';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: (defaults) => [
      remarkDirective,
      remarkAdmonition,          // :::tip, :::warning, :::info → <Callout>
      remarkVitepressCodeGroup,  // :::code-group → <Tabs>
      remarkTemplateVars,        // %version% → actual value from docs-constants.ts
      remarkStripMdLinks,        // ./path.md → ./path
      ...defaults,
    ],
  },
});
```

**1.3 Wrap `next.config.mjs`** with MDX plugin
```js
import { createMDX } from 'fumadocs-mdx/next';

const config = {
  // existing next config
};

const withMDX = createMDX();
export default withMDX(config);
```

**1.4 Add path alias** to `tsconfig.json`
```json
"paths": {
  "@/*": ["./src/*"],
  "collections/*": [".source/*"]
}
```

**1.5 Add `.source/` to `.gitignore`**

**1.6 Handle CSS integration**

**Option A (Recommended): Scoped Fumadocs styles**
- Import Fumadocs CSS only in the docs layout, not in globals.css
- Use `@layer` to scope Fumadocs styles so they don't leak to marketing pages
- Override Fumadocs CSS variables (`--color-fd-*`) to match Evolve's color scheme

**Option B: Route groups for isolation**
```
src/app/
  (marketing)/
    layout.tsx          ← Marketing layout (no Fumadocs)
    page.tsx
    privacy-policy/
    terms-and-conditions/
  (docs)/
    layout.tsx          ← Docs layout with Fumadocs
    docs/
      [[...slug]]/page.tsx
```
Full CSS isolation but requires moving existing pages.

**Decision point**: Option A is less disruptive. Test first.

**1.7 Modify root layout** — add `RootProvider`
```tsx
import { RootProvider } from 'fumadocs-ui/provider/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body>
        <RootProvider theme={{ enabled: false }}>
          <Header /> {/* conditionally hide on /docs routes */}
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
```

**1.8 Create docs layout and page**

`src/app/docs/layout.tsx` — `DocsLayout` with sidebar tree.

`src/app/docs/[[...slug]]/page.tsx` — catch-all page renderer with `DocsPage`, `DocsTitle`, `DocsDescription`, `DocsBody`.

**1.9 Create search API route**
```ts
// src/app/api/search/route.ts
import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
export const { GET } = createFromSource(source);
```

**1.10 Create a test page** — add `content/docs/index.md` with basic content to verify setup.

**1.11 Verify no visual regressions** on marketing pages.

---

### Phase 2: Remark Plugins

**2.1 Container directives** — zero work needed

Fumadocs' built-in `remarkAdmonition` (requires `remark-directive`) converts:
- `:::tip` → `<Callout type="info">`
- `:::warning` → `<Callout type="warn">`
- `:::danger` → `<Callout type="error">`
- `:::info` → `<Callout type="info">`

Supports custom titles: `:::warning Disclaimer` → `<Callout type="warn" title="Disclaimer">`

**2.2 `remark-template-vars`** — dynamic version rendering

Custom remark plugin that:
- Walks AST code block nodes
- Finds `%variableName%` markers in text content
- Replaces with values from `docs-constants.ts`
- ~30 lines of code

This preserves the VitePress DX: update `docs-constants.ts` once → all docs reflect the change.

**2.3 `remark-vitepress-codegroup`** — tabbed code blocks

Custom remark plugin that:
- Detects `:::code-group` container directives (from `remark-directive`)
- Extracts tab labels from code block meta (e.g., ` ```sh [Arabica] `)
- Converts to Fumadocs `<Tabs>` + `<Tab>` components
- Only 4 instances in 3 files, so scope is small

**2.4 `remark-strip-md-links`** — link cleanup

Custom remark plugin that:
- Finds link nodes where `href` ends in `.md`
- Strips the `.md` extension
- ~10 lines of code

**2.5 Custom heading IDs** — test first

The `{#custom-id}` syntax may be handled by Fumadocs out of the box. If not, add `remark-heading-id` plugin.

---

### Phase 3: One-Time Content Cleanup

Apply the mechanical edits to 12 files (described in detail above):

1. Delete `<script setup>` blocks from 8 files
2. Replace `<Callout />` with `:::tip` + static text in 3 files
3. Convert `sh-vue` → `sh` and `{{constants.xxx}}` → `%xxx%` in 3 files
4. Restructure `api/index.md` for Fumadocs OpenAPI

Copy all 124 `.md` files (with edits applied to the 12) into `content/docs/`, preserving directory structure. Add `meta.json` sidebar config files.

---

### Phase 4: React Component Ports & OpenAPI

**4.1 `<CelestiaGasEstimator />`** — React port required

1,589-line Vue component → `'use client'` React component. Register in MDX components map so the tag in `.md` files renders the React version automatically.

**4.2 `<MermaidDiagram />`** — client-side renderer

Simple `'use client'` React component using the `mermaid` npm package. Mapped to ` ```mermaid ` code blocks via a rehype plugin or MDX component override. Only 1 file uses Mermaid.

**4.3 OpenAPI docs** — `fumadocs-openapi`

Replace `vitepress-openapi` with `fumadocs-openapi`:
```bash
npm i fumadocs-openapi
```
Generates pages from `openapi-rpc.json` at build time.

**4.4 `twitter.vue`, `keplr.vue`** — skip

Not used in any markdown file. No port needed.

---

### Phase 5: Sidebar Configuration

Create `meta.json` files mapping the VitePress `sidebarHome()` structure:

```json
// content/docs/meta.json (root)
{
  "root": true,
  "pages": ["learn", "guides", "api", "reference", "concepts", "overview", "ev-abci", "ev-reth", "adr"]
}
```

```json
// content/docs/learn/meta.json
{
  "title": "Learn",
  "root": true,
  "pages": [
    "about", "data-availability", "sequencing", "execution",
    "specs", "transaction-flow", "config"
  ]
}
```

```json
// content/docs/guides/meta.json
{
  "title": "How To Guides",
  "root": true,
  "pages": [
    "quick-start", "gm-world", "da", "deploy", "evm",
    "full-node", "restart-chain", "reset-state",
    "cometbft-to-evolve", "migrating-to-ev-abci",
    "create-genesis", "metrics", "use-tia-for-gas",
    "celestia-gas-calculator"
  ]
}
```

Additional `meta.json` files for nested directories (`learn/sequencing/`, `learn/specs/`, `guides/da/`, `guides/deploy/`, `guides/evm/`, etc.)

The `meta.json` files are the ONLY new files added alongside the `.md` content.

---

### Phase 6: Theme Customization

**6.1 Pick a base theme** — start with `neutral` or `vitepress` preset.

**6.2 Override CSS variables** to match Evolve's design system:
```css
:root {
  --color-fd-primary: #B8A6FF;          /* --purple */
  --color-fd-background: #F3F4F4;       /* --background-bg */
  --color-fd-foreground: #000000;        /* --foreground-color */
  --color-fd-muted-foreground: #A0A0A0;  /* --darksmoke */
  --color-fd-border: #DAE4E7;            /* --diagonal */
}
```

**6.3 Fonts** — Inter + Geist Mono already loaded via `next/font`, no action needed.

**6.4 Docs navbar** — configure to match old VitePress nav:
```tsx
export function baseOptions(): BaseLayoutProps {
  return {
    nav: { title: 'Evolve' },
    links: [
      { text: 'Learn', url: '/docs/learn/about' },
      { text: 'Guides', url: '/docs/guides/quick-start' },
      { text: 'API', url: '/docs/api' },
    ],
    githubUrl: 'https://github.com/evstack',
  };
}
```

**6.5 Sidebar tabs** — use `"root": true` in top-level `meta.json` files for tab-based section switching.

---

### Phase 7: Navigation & Header Integration

**7.1 Header behavior** — conditionally render the marketing `<Header>` outside `/docs/*` routes. Fumadocs' `DocsLayout` provides its own navbar with search, breadcrumbs, and sidebar toggle.

**7.2 Cross-navigation**:
- Marketing header: add a "Docs" link → `/docs`
- Docs navbar: add a link back to `/` (marketing site)

---

### Phase 8: Polish & Verify

**8.1 Test all ~124 pages render correctly**

**8.2 Copy static assets** — images from old `docs/` to `content/docs/` (maintaining relative paths)

**8.3 Redirects** — if deploying on the same domain as the old docs:
```js
// next.config.mjs
redirects: async () => [
  { source: '/learn/:path*', destination: '/docs/learn/:path*', permanent: true },
  { source: '/guides/:path*', destination: '/docs/guides/:path*', permanent: true },
  { source: '/api/:path*', destination: '/docs/api/:path*', permanent: true },
]
```

**8.4 Test search** — verify Orama indexes all pages.

**8.5 Test mobile** — sidebar, search dialog, TOC.

**8.6 Verify marketing pages unaffected** — no CSS regressions.

---

## What Changes vs. What Stays The Same

### Stays the same (zero changes)
- All markdown content, headings, paragraphs, lists, tables (112 files untouched)
- `:::tip`, `:::warning`, `:::info` container syntax
- `:::code-group` tabbed code blocks
- Code blocks with syntax highlighting
- Mermaid diagram syntax
- Images and static assets
- Frontmatter (`description`, `title`)
- Custom heading IDs (`{#id}`)
- Reference-style links
- Internal links (`./path.md` — `.md` stripped at build time)

### One-time cleanup (12 files, small mechanical edits)
- `<script setup>` blocks → deleted (8 files, 3–4 lines each)
- `<Callout />` → replaced with `:::tip` + static text (3 files)
- `{{constants.xxx}}` → `%xxx%` template markers (3 files)
- `sh-vue` / `ts-vue` → `sh` / `ts` language identifier (3 files)

### Preserved via remark plugin (same DX as VitePress)
- Dynamic version rendering: `%xxx%` in code blocks resolved from `docs-constants.ts` at build time. Update one file → all docs reflect the change.

### New files added alongside content
- `meta.json` per directory (sidebar ordering)

### Requires a React port (1 component)
- `CelestiaGasEstimator.vue` → `CelestiaGasEstimator.tsx` (1,589 lines)

### Not migrated (replaced by marketing site)
- `index.md` home layout (hero, features) — the Evolve marketing site IS the homepage

---

## Package Requirements

All packages must be actively maintained (2025+).

| Package | Purpose | Status |
|---------|---------|--------|
| `fumadocs-mdx` | Content processing (.md/.mdx → typed data) | Active, 2025, Next.js 16 compatible |
| `fumadocs-core` | Headless utilities, remark plugins, search | Active, 2025 |
| `fumadocs-ui` | Pre-built docs UI (sidebar, search, TOC, layout) | Active, 2025, Tailwind CSS 4 |
| `@types/mdx` | TypeScript types for MDX | Active |
| `remark-directive` | Parses `:::` container syntax into AST | Active, unified ecosystem |
| `fumadocs-openapi` | OpenAPI → docs page generation | Active, 2025 |
| `mermaid` | Client-side diagram rendering | Active, v11+ |

**NOT used** (outdated or unnecessary):
- `contentlayer` / `contentlayer2` — semi-maintained, not needed with Fumadocs
- `next-mdx-remote` — not well maintained in 2025, not needed
- `velite` — pre-1.0, not needed with Fumadocs
- `rehype-mermaid` — pulls in Playwright, overkill for 1 diagram

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Fumadocs CSS conflicts with marketing styles | Global typography clashes | Scope via `@layer` or route groups; test early |
| `<CelestiaGasEstimator>` React port | Complex interactive component | Budget significant time; can initially link to old site |
| MDX compiler chokes on `.md` edge cases | Raw `<` or `{` in prose | Escape in one-time cleanup; most files are clean |
| `:::code-group` remark plugin | Custom plugin needed | Small scope — only 4 instances in 3 files |
| `RootProvider` side effects | Adds `next-themes` globally | Disable theme toggle; test carefully |
| Custom heading IDs `{#id}` | May not be supported out of box | Test with Fumadocs; add `remark-heading-id` plugin if needed |

---

## Estimated Effort by Phase

| Phase | Scope | Notes |
|-------|-------|-------|
| Phase 1 | Fumadocs scaffold + routing | Standard setup |
| Phase 2 | Remark plugins | 3 small custom plugins (~80 lines total) |
| Phase 3 | One-time content cleanup | Mechanical edits to 12 files |
| Phase 4 | React component ports + OpenAPI | CelestiaGasEstimator is the main effort |
| Phase 5 | Sidebar `meta.json` files | Mapping from VitePress sidebar config |
| Phase 6 | Theme customization | CSS variable overrides |
| Phase 7 | Navigation integration | Header conditional rendering |
| Phase 8 | QA + polish | Test all 124 pages, search, mobile |

---

## Open Decisions

1. **Light/dark mode for docs?** Marketing site is light-only. Should docs support dark mode?
2. **CSS isolation strategy?** Scoped `@layer` imports vs route groups. Test first.
3. **Header strategy?** Hide marketing header on docs pages vs customize Fumadocs navbar to match.
4. **Gas Calculator timing?** Port the full React component now vs link to old site temporarily.
5. **ADR inclusion?** Are all 23 ADRs still relevant, or are some obsolete?
6. **URL structure?** `/docs/learn/about` (prefixed) vs `/learn/about` (flat)?
7. **Mermaid approach?** Client-side React component vs pre-rendered SVG (only 1 diagram).
