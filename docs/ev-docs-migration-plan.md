# EV Docs Migration Plan: VitePress to Fumadocs (Next.js)

## Context

The ev-node documentation currently lives in a separate VitePress site (`/ev-node/docs/`). We're migrating it into the Evolve marketing site (`/evolve/`) built with Next.js 16, React 19, and Tailwind CSS 4. The docs will live at `/docs/*` alongside the existing marketing pages (`/`, `/privacy-policy`, `/terms-and-conditions`).

**Why Fumadocs?** It's built specifically for Next.js App Router, uses Tailwind CSS 4, and provides battle-tested docs primitives (sidebar, search, TOC, MDX components) out of the box — either as a full UI kit or headless. This avoids rebuilding navigation, search, and content processing from scratch.

---

## Current Docs Inventory (VitePress)

| Section | Files | Path | Description |
|---------|-------|------|-------------|
| Learn | 17 | `/learn/` | Core concepts, sequencing, specs |
| Guides | 35 | `/guides/` | Quick start, DA, deployment, EVM, operations |
| API Docs | auto | `/api/` | Auto-generated from `openapi-rpc.json` |
| ADRs | 23 | `/adr/` | Architecture decision records |
| Reference | 16 | `/reference/` | Config, API, interfaces, specs |
| Concepts | 7 | `/concepts/` | Block lifecycle, DA, fees, etc. |
| Overview | 3 | `/overview/` | What is Evolve, architecture |
| EV-ABCI | 6 | `/ev-abci/` | Cosmos SDK integration |
| EV-Reth | 7 | `/ev-reth/` | Ethereum execution layer |
| **Total** | **~124** | | |

### VitePress features in use
- Markdown callouts (`::: tip`, `::: warning`, `::: danger`, `::: info`)
- Mermaid diagrams (`vitepress-plugin-mermaid`)
- OpenAPI auto-generated sidebar/pages (`vitepress-openapi`)
- Vue components: `CelestiaGasEstimator.vue` (interactive calculator), `callout.vue`, `twitter.vue`, `keplr.vue`
- Constants file for version strings (imported via `<script setup>`)
- Local search
- Collapsible sidebar with nested groups
- Edit-on-GitHub links

---

## Recommended Approach: Fumadocs UI (Full Kit)

Use `fumadocs-ui` (not headless) to get the complete docs experience — sidebar, search, TOC, navbar, MDX components — then customize the theme to match the Evolve design system.

### Why full UI over headless?
- The old docs already use standard docs UI patterns (sidebar, search, TOC) — no need to rebuild these
- Fumadocs UI is fully customizable via CSS variables and component forking
- Saves significant development time on sidebar logic, search UX, mobile navigation, breadcrumbs
- Can still fork individual components later via `npx @fumadocs/cli add` if needed

---

## Integration Architecture

```
src/app/
  layout.tsx              ← Wrap with RootProvider (theme + search context)
  page.tsx                ← Marketing homepage (unchanged)
  privacy-policy/         ← Legal pages (unchanged)
  terms-and-conditions/   ← Legal pages (unchanged)
  docs/
    layout.tsx            ← DocsLayout with sidebar tree
    [[...slug]]/
      page.tsx            ← Catch-all docs page renderer
  api/
    search/
      route.ts            ← Fumadocs search API endpoint

content/
  docs/                   ← All migrated MDX content lives here
    meta.json             ← Root sidebar config
    learn/
      meta.json
      about.mdx
      data-availability.mdx
      sequencing/
        meta.json
        overview.mdx
        single.mdx
        based.mdx
      ...
    guides/
      meta.json
      quick-start.mdx
      da/
        meta.json
        local-da.mdx
        celestia-da.mdx
        ...
      deploy/
      evm/
      ...
    api/
      meta.json
      index.mdx
      ...
    reference/
    concepts/
    overview/
    ev-abci/
    ev-reth/
    adr/

src/lib/
  source.ts               ← Fumadocs source/loader config
  layout.shared.tsx        ← Shared layout options (nav links, logo)
  docs-constants.ts        ← Version strings (replaces VitePress constants.js)

src/components/
  mdx.tsx                  ← MDX component overrides
  docs/
    CelestiaGasEstimator.tsx  ← Migrated from Vue → React
```

### Key files to create/modify

| File | Action | Purpose |
|------|--------|---------|
| `source.config.ts` | Create | Define docs collection, frontmatter schema |
| `next.config.mjs` | Modify | Wrap with `createMDX()` |
| `tsconfig.json` | Modify | Add `"collections/*": [".source/*"]` path alias |
| `src/app/globals.css` | Modify | Add Fumadocs CSS imports |
| `src/app/layout.tsx` | Modify | Wrap with `RootProvider` |
| `src/app/docs/layout.tsx` | Create | DocsLayout with sidebar |
| `src/app/docs/[[...slug]]/page.tsx` | Create | Catch-all page renderer |
| `src/app/api/search/route.ts` | Create | Search endpoint |
| `src/lib/source.ts` | Create | Fumadocs loader |
| `src/lib/layout.shared.tsx` | Create | Shared nav/layout config |
| `src/components/mdx.tsx` | Create | MDX components mapping |
| `.gitignore` | Modify | Add `.source/` |

---

## Step-by-Step Implementation Plan

### Phase 1: Fumadocs Scaffold (no content yet)

**1.1 Install dependencies**
```bash
npm i fumadocs-mdx fumadocs-core fumadocs-ui @types/mdx
```

**1.2 Create `source.config.ts`** at project root
```ts
import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig();
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

**1.6 Handle CSS integration** — this is the trickiest part

The Evolve site has global `h1–h4` styles and custom CSS variables. Fumadocs' preset modifies base styles. Two strategies:

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
This gives full CSS isolation but requires moving existing pages.

**Decision point**: Option A is less disruptive. We should test Fumadocs CSS imports and verify no visual regressions on marketing pages before committing to either approach.

**1.7 Modify root layout** — add `RootProvider`
```tsx
import { RootProvider } from 'fumadocs-ui/provider/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body>
        <RootProvider
          theme={{ enabled: false }} // We handle our own theme (light-only for now)
        >
          <Header />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
```

Note: the marketing site is light-mode only. Fumadocs includes `next-themes` by default. We can disable it or embrace light/dark for docs. Decision needed.

**1.8 Create docs layout and page**

`src/app/docs/layout.tsx`:
```tsx
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
```

`src/app/docs/[[...slug]]/page.tsx`:
```tsx
import { source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { createRelativeLink } from 'fumadocs-ui/mdx';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}
```

**1.9 Create search API route**
```ts
// src/app/api/search/route.ts
import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const { GET } = createFromSource(source);
```

**1.10 Create a test page** — add `content/docs/index.mdx` with basic content to verify the setup works end-to-end.

**1.11 Verify no visual regressions** on marketing pages (`/`, `/privacy-policy`, `/terms-and-conditions`).

---

### Phase 2: Theme Customization

**2.1 Pick a base theme** and override CSS variables to match Evolve's design system.

Fumadocs provides these theme presets: `neutral`, `black`, `vitepress`, `ocean`, `purple`, etc. Start with `neutral` or `vitepress` (closest to old site feel).

**2.2 Override Fumadocs CSS variables** to match Evolve's colors:
```css
:root {
  --color-fd-primary: #B8A6FF;          /* map to --purple */
  --color-fd-background: #F3F4F4;       /* map to --background-bg */
  --color-fd-foreground: #000000;        /* map to --foreground-color */
  --color-fd-muted-foreground: #A0A0A0;  /* map to --darksmoke */
  --color-fd-border: #DAE4E7;            /* map to --diagonal */
  /* etc. */
}
```

**2.3 Configure fonts** — Fumadocs doesn't ship fonts. The existing Inter + Geist Mono from `next/font` should apply automatically via CSS variables already set on `<html>`.

**2.4 Customize the docs navbar** — configure nav links to match old VitePress nav:
```tsx
// src/lib/layout.shared.tsx
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Evolve',
    },
    links: [
      { text: 'Learn', url: '/docs/learn/about' },
      { text: 'Guides', url: '/docs/guides/quick-start' },
      { text: 'API', url: '/docs/api' },
    ],
    githubUrl: 'https://github.com/evstack',
  };
}
```

**2.5 Consider sidebar tabs** — the old VitePress sidebar has 3 top-level sections (Learn, Guides, API). In Fumadocs, these can be rendered as sidebar tabs using `"root": true` in each section's `meta.json`. This gives a cleaner UX than a single long sidebar.

---

### Phase 3: Content Migration

**3.1 Copy and convert markdown files**

For each VitePress `.md` file → Fumadocs `.mdx` file:

| VitePress pattern | Fumadocs equivalent |
|---|---|
| `:::tip` / `:::warning` / `:::danger` / `:::info` | `<Callout type="info\|warn\|error">` component |
| `<script setup>` with Vue imports | React component imports at top of MDX |
| `{{ constants.version }}` template syntax | Import from `@/lib/docs-constants` and use JSX |
| Relative links `./path.md` | Relative links `./path` (no extension) |
| Frontmatter `description:` | Frontmatter `title:` + `description:` |
| Mermaid code blocks | Use `fumadocs-core` remark plugin or embed as component |

**3.2 Create `meta.json` files** for sidebar ordering

Each directory needs a `meta.json` to control sidebar order and display. Map from the VitePress `sidebarHome()` config:

```json
// content/docs/meta.json (root)
{
  "root": true,
  "pages": [
    "learn",
    "guides",
    "api",
    "reference",
    "concepts",
    "overview",
    "ev-abci",
    "ev-reth",
    "adr"
  ]
}
```

```json
// content/docs/learn/meta.json
{
  "title": "Learn",
  "root": true,
  "pages": [
    "about",
    "data-availability",
    "sequencing",
    "execution",
    "specs",
    "transaction-flow",
    "config"
  ]
}
```

```json
// content/docs/guides/meta.json
{
  "title": "How To Guides",
  "root": true,
  "pages": [
    "quick-start",
    "gm-world",
    "da",
    "deploy",
    "evm",
    "full-node",
    "restart-chain",
    "reset-state",
    "cometbft-to-evolve",
    "migrating-to-ev-abci",
    "create-genesis",
    "metrics",
    "use-tia-for-gas",
    "celestia-gas-calculator"
  ]
}
```

**3.3 Migrate Vue components to React**

| Vue Component | React Equivalent | Complexity |
|---|---|---|
| `callout.vue` | Use Fumadocs `<Callout>` | Trivial — drop-in |
| `CelestiaGasEstimator.vue` | Rewrite as React `'use client'` component | High — 46KB interactive component |
| `twitter.vue` | Simple embed component | Low |
| `keplr.vue` | Wallet connection component | Medium |

The `CelestiaGasEstimator` is the most complex. It's a large interactive calculator with form inputs, calculations, and results display. This should be migrated as a standalone `'use client'` React component and imported into the relevant MDX page.

**3.4 Migrate version constants**

Create `src/lib/docs-constants.ts`:
```ts
export const docsConstants = {
  golangVersion: 'go1.25.0',
  evolveLatestTag: 'v1.0.0-beta.4',
  localDALatestTag: 'v1.0.0-beta.1',
  // ... remaining constants from VitePress constants.js
};
```

Use in MDX:
```mdx
import { docsConstants } from '@/lib/docs-constants';

Install Go version {docsConstants.golangVersion}
```

**3.5 Handle callout syntax transformation**

Write a script or do manually — convert VitePress callout blocks:
```md
::: tip
Some tip content
:::
```
→ Fumadocs MDX:
```mdx
<Callout type="info">
Some tip content
</Callout>
```

Mapping:
| VitePress | Fumadocs `<Callout type="">` |
|---|---|
| `:::tip` | `info` |
| `:::warning` | `warn` |
| `:::danger` | `error` |
| `:::info` | `info` |
| `:::note` | `info` |

**3.6 Handle Mermaid diagrams**

Options:
1. Use `rehype-mermaid` or `remark-mermaid` plugin with Fumadocs' remark/rehype pipeline
2. Or pre-render Mermaid diagrams to SVG and embed as images

Option 1 is better for maintainability. Add the plugin in `source.config.ts`:
```ts
export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMermaid],
  },
});
```

**3.7 Handle OpenAPI docs**

The old site used `vitepress-openapi` to auto-generate API pages from `openapi-rpc.json`. Options for Fumadocs:

1. **Fumadocs OpenAPI plugin** — Fumadocs has `fumadocs-openapi` that generates MDX pages from OpenAPI specs. This is the closest equivalent.
2. **Manual API pages** — Write MDX pages manually for each endpoint.
3. **Embed Swagger/Redoc** — Use a React component to render the spec.

Option 1 is the most direct replacement:
```bash
npm i fumadocs-openapi
```

---

### Phase 4: Navigation & Header Integration

**4.1 Decide on header behavior**

The marketing site has a custom `<Header>` component. The docs pages will use Fumadocs' `DocsLayout` which includes its own navbar. Options:

- **Option A**: Hide the marketing `<Header>` on `/docs/*` routes and use Fumadocs' built-in navbar. Simpler, consistent docs experience.
- **Option B**: Keep the marketing `<Header>` globally and configure Fumadocs to hide its own navbar. Consistent site-wide branding but requires more custom work.
- **Option C**: Customize Fumadocs navbar to visually match the marketing header. Best UX but most effort.

**Recommendation**: Option A — conditionally render `<Header>` outside `/docs/*`. The docs layout provides its own nav with search, breadcrumbs, and sidebar toggle. Add a "Back to Home" link in the docs nav.

**4.2 Add cross-navigation**
- Marketing header: add a "Docs" link pointing to `/docs`
- Docs navbar: add a link back to `/` (the marketing site)

---

### Phase 5: Polish & Verify

**5.1 Test all pages render correctly** — iterate through the ~124 pages and fix any MDX compilation errors, broken links, or missing assets.

**5.2 Copy static assets** — move images from old `/public/img/` to the new `/public/docs/` or similar.

**5.3 Set up redirects** — if the old docs had different URL patterns, add redirects in `next.config.mjs` to preserve SEO. Key mappings:
- `/learn/*` → `/docs/learn/*`
- `/guides/*` → `/docs/guides/*`
- `/api/*` → `/docs/api/*`

**5.4 Test search** — verify Orama search indexes all docs pages and returns relevant results.

**5.5 Test mobile** — sidebar collapse, search dialog, TOC behavior on mobile viewports.

**5.6 Verify marketing pages are unaffected** — no style regressions on `/`, `/privacy-policy`, `/terms-and-conditions`.

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Fumadocs CSS conflicts with marketing styles | Global `h1–h4` and typography styles could clash | Scope Fumadocs CSS to `/docs` route, or use route groups for isolation |
| Mermaid rendering | Some diagrams may not render identically | Test each diagram, fall back to pre-rendered SVGs if needed |
| `CelestiaGasEstimator` complexity | 46KB Vue component needs full React rewrite | Budget significant time; can initially link to old site |
| OpenAPI page generation | `fumadocs-openapi` may have different output than `vitepress-openapi` | Test early; may need to customize templates |
| Build time increase | 124 MDX pages + search indexing adds to build | Should still be fast since content is static; monitor in CI |
| `RootProvider` side effects | Wraps entire app, adds `next-themes` context | Disable theme toggle if not needed; test carefully |

---

## Estimated Effort by Phase

| Phase | Scope | Notes |
|-------|-------|-------|
| Phase 1 | Fumadocs scaffold + routing | Straightforward setup |
| Phase 2 | Theme customization | CSS variable mapping |
| Phase 3 | Content migration (124 files) | Bulk of the work — callout syntax, Vue→React, meta.json files |
| Phase 4 | Navigation integration | Header conditional rendering |
| Phase 5 | QA + polish | Link checking, mobile testing, redirects |

---

## Open Decisions

1. **Light/dark mode for docs?** Marketing site is light-only. Should docs support dark mode? (Fumadocs supports it out of the box.)
2. **CSS isolation strategy?** Option A (scoped imports) vs Option B (route groups). Need to test Fumadocs CSS impact on existing pages first.
3. **Header strategy?** Hide marketing header on docs pages vs customize Fumadocs navbar to match.
4. **OpenAPI approach?** Use `fumadocs-openapi` plugin vs manual API pages vs embedded Swagger.
5. **Mermaid strategy?** Runtime rendering plugin vs pre-rendered SVGs.
6. **Gas Calculator migration timing?** Migrate the full React component now vs link to old site temporarily.
7. **ADR inclusion?** Are all 23 ADRs still relevant and should they be migrated, or are some obsolete?
8. **URL structure?** Keep old paths under `/docs/` prefix (e.g., `/docs/learn/about`) or flatten?
