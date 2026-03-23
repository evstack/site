# EV Docs Migration Plan: VitePress to Fumadocs (Next.js)

## Context

The ev-node documentation currently lives in a separate VitePress site (`/ev-node/docs/`). We're migrating it into the Evolve marketing site (`/evolve/`) built with Next.js 16, React 19, and Tailwind CSS 4. The docs will live at `/docs/*` alongside the existing marketing pages (`/`, `/privacy-policy`, `/terms-and-conditions`).

**Core requirement**: Keep `.md` files with minimal changes. A one-time cleanup of 14 files removes Vue-specific syntax and adjusts container title syntax; the remaining 110 files drop in untouched. All content, structure, and dynamic version rendering are preserved. No conversion to `.mdx`. No build-time pre-processor scripts.

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

**Critical**: `remark-directive` does NOT parse `:::warning Disclaimer` (space-separated title). The entire directive is rejected. Must convert to `:::warning[Disclaimer]` (bracket syntax) in one-time cleanup.

### `<script setup>` blocks — 9 files
All import either Vue components or the shared constants file:
- `import constants from '../.vitepress/constants/constants.js'` — 7 files
- `import Callout from '../.vitepress/components/callout.vue'` — 3 files
- `import spec from '../src/openapi-rpc.json'` — 2 files (API docs)

### Template interpolation `{{ }}` — 5 files
Used inside code blocks with `sh-vue` / `ts-vue` / `bash-vue` language specifiers AND in regular code blocks:

**In `sh-vue` / `bash-vue` code blocks** (3 files):
- `guides/da/celestia-da.md` — 6 instances
- `guides/da/local-da.md` — uses `bash-vue`
- `guides/cometbft-to-evolve.md` — 1 instance

**In regular code blocks** (2 additional files):
- `guides/evm/single.md` — `{{constants.evolveLatestTag}}`
- `guides/cometbft-to-evolve.md` — `{{constants.evolveIgniteAppVersion}}`

### Vue components in markdown — 4 total
| Component | Used in | Size | Purpose |
|-----------|---------|------|---------|
| `<Callout />` | 3 files | 15 lines | Alpha notice banner |
| `<CelestiaGasEstimator />` | 1 file | 1,589 lines | Interactive gas calculator |
| `<OAIntroduction :spec="spec" />` | 1 file | External lib | OpenAPI intro (vitepress-openapi) |
| `twitter.vue`, `keplr.vue` | 0 files | — | Present but unused in markdown |

### Other VitePress features
- **Mermaid diagrams** — at least 1 file confirmed (`guides/deploy/testnet.md`). Verify full count during Phase 8 — may be more across learn/specs and ADR files.
- **Custom heading IDs** (`{#custom-id}`) — 24 files (supported by Fumadocs `remarkHeading` with `customId: true`, enabled by default)
- **Internal links with `.md` extension** — used extensively (`./path.md`)
- **Reference-style links** — 102 instances across specs and ADRs
- **HTML comments** — `<!-- markdownlint-disable -->` in 5 files (MDX-compatible, no action needed)
- **Co-located images** — `.png` / `.jpg` files alongside `.md` files in `learn/specs/`, `adr/figures/`, `reference/specs/` (handled by Fumadocs `remarkImage` plugin with `useImport: true` — works out of the box)
- **Audit PDFs** — `audit/informal-systems.pdf`, `audit/binary-builders.pdf`. Check if referenced from any `.md` file. If yes, copy to `public/docs/audit/` and update links.
- **OpenAPI spec** — `src/openapi-rpc.json` (32KB). Must be copied for `fumadocs-openapi` to generate API pages.
- **Frontmatter** — 13 files (standard `description`, `title`, plus VitePress-specific `layout: home`, `pageClass`, `aside`, `outline`)
- **Home page hero** (`index.md`) — VitePress `layout: home` with hero/features YAML (will NOT be migrated — the marketing site IS the homepage)
- **`getting-started/` directory** — exists on disk (5 files) but NOT in VitePress sidebar. Audit for orphan status — may be superseded by `guides/quick-start.md`. Include or exclude during Phase 3.
- **Emoji in headings** — 15 files use emoji characters (🚀, ⚡, 🛡️, etc.). MDX handles these natively — no action needed.
- **Task list checkboxes** — `- [ ]` / `- [x]` syntax in 2 files. Standard Markdown — works in Fumadocs.

### Code block languages in use
14 language identifiers across ~500 code blocks: `bash`, `go`, `yaml`, `json`, `mermaid`, `text`, `sh`, `protobuf`/`proto`, `txt`, `rust`, `solidity`, `javascript`/`js`, `toml`. Verify Shiki supports `protobuf` and `solidity` — add to Shiki config if not included by default.

### Font mismatch
The old VitePress docs use **IBM Plex Mono** for code; the Evolve marketing site uses **Geist Mono**. Decision needed: use Geist Mono for consistency with the marketing site (recommended), or load IBM Plex Mono for docs code blocks to match the old site exactly.

### VitePress config features to replicate
From `.vitepress/config.ts`:
- **Edit on GitHub** — `https://github.com/evstack/docs/edit/main/:path`
- **Last updated timestamps** — `lastUpdated: true`
- **Footer** — "Released under the APACHE-2.0 License" / "Copyright © 2024 Evolve"
- **Social links** — GitHub (`evstack`), Twitter/X (`@ev_stack`), Telegram
- **Per-page OG tags** — dynamic `og:title` and `og:description` from frontmatter
- **Deep outline (TOC)** — `outline: { level: "deep" }` (all heading levels)
- **Plausible analytics** — `plausible.celestia.org` with `data-domain: ev.xyz`
- **Sitemap** — `hostname: https://ev.xyz`

### What is NOT used
- `:::danger`, `:::note` containers
- `[[toc]]` directive
- Line highlighting in code blocks (`js{1,3-5}`)
- `<script>` (only `<script setup>`)
- Raw HTML tags (no `<details>`, `<summary>`, `<kbd>` etc.)
- Curly braces in prose (all `{}` are inside code blocks — Go types like `interface{}` are safe)

---

## Recommended Approach: Fumadocs + One-Time Cleanup + Remark Plugins

### Architecture overview

```
.md files in content/docs/
        │
        ▼
┌───────────────────────────────────────────────────┐
│  Fumadocs MDX compiler                             │
│  + remarkImage (co-located images → static import) │
│  + remarkHeading (custom IDs {#id}, TOC generation)│
│  + remark-directive                                │
│  + remarkDirectiveAdmonition                       │
│    (:::tip → <Callout>, :::warning[T] → <Callout>) │
│  + remark-vitepress-codegroup                      │
│    (:::code-group → <Tabs>)                        │
│  + remark-template-vars                            │
│    (%golangVersion% → actual value)                │
│  + remark-strip-md-links                           │
│    (./path.md → ./path)                            │
│  + Shiki syntax highlighting (built-in)            │
└───────────────────────────────────────────────────┘
        │
        ▼
  Rendered docs at /docs/*
```

### How each VitePress feature is handled

| VitePress feature | Solution | Type |
|---|---|---|
| `:::tip`, `:::warning`, `:::info` | Fumadocs `remarkDirectiveAdmonition` plugin | Remark plugin (zero-config) |
| `:::warning Disclaimer` (space title) | One-time cleanup: convert to `:::warning[Disclaimer]` (bracket syntax) | One-time edit (5 instances) |
| `:::code-group` (tabbed code blocks) | Custom `remark-vitepress-codegroup` plugin → Fumadocs `<Tabs>` | Remark plugin |
| `<script setup>` blocks | One-time cleanup: delete from 9 files | One-time edit |
| `<Callout />` Vue component | One-time cleanup: replace with `:::tip` + static text in 3 files | One-time edit |
| `{{constants.xxx}}` in code blocks | One-time cleanup: change to `%xxx%` marker, change `sh-vue` → `sh` | One-time edit (5 files) |
| Dynamic version rendering | `remark-template-vars` plugin resolves `%xxx%` from `docs-constants.ts` | Remark plugin |
| `<CelestiaGasEstimator />` | React port, mapped via MDX components | React component |
| `<OAIntroduction />` (OpenAPI) | Replaced by `fumadocs-openapi` | Fumadocs plugin |
| Internal links with `.md` extension | `remark-strip-md-links` plugin | Remark plugin |
| Custom heading IDs `{#id}` | Fumadocs `remarkHeading` with `customId: true` (default) | Built-in |
| Co-located images (`./image.png`) | Fumadocs `remarkImage` with `useImport: true` (default) | Built-in |
| Edit on GitHub | `ViewOptionsPopover` component with `githubUrl` prop | Fumadocs UI |
| Last updated timestamps | `fumadocs-mdx/plugins/last-modified` (git-based) | Fumadocs plugin |
| Per-page OG tags | Next.js `generateMetadata` in `page.tsx` from `page.data` | Next.js native |
| Deep outline (all heading levels) | Fumadocs `remarkHeading` includes h1–h6 by default | Built-in |
| Sitemap with docs pages | `source.getPages()` in Next.js `sitemap.ts` | Next.js native |
| Plausible analytics | `<Script>` tag in root layout | Next.js native |
| Footer (license/copyright) | Custom footer in `DocsLayout` sidebar `footer` slot | Custom component |
| Social links (GitHub, X, Telegram) | `links` array with `type: 'icon'` in `baseOptions()` | Fumadocs config |
| VitePress frontmatter (`aside`, `outline`, `pageClass`) | Extend Fumadocs frontmatter schema via Zod; map to `DocsPage` props | Schema extension |
| Mermaid diagrams | Client-side React component using `mermaid` npm package | React component |

---

## One-Time Cleanup: 14 Files

Only 14 of 124 files need any changes. The edits are small and mechanical:

### Edit type 1: Strip `<script setup>` blocks (9 files)
Delete the entire block (3–4 lines each):
```md
<!-- DELETE THIS BLOCK -->
<script setup>
import Callout from '../.vitepress/components/callout.vue'
import constants from '../.vitepress/constants/constants.js'
</script>
```

Files: `guides/da/celestia-da.md`, `guides/da/local-da.md`, `guides/deploy/testnet.md`, `guides/use-tia-for-gas.md`, `guides/quick-start.md`, `guides/gm-world.md`, `guides/cometbft-to-evolve.md`, `api/index.md`, `api/operationsByTags/[operationId].md`

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

Files: `guides/deploy/testnet.md`, `guides/use-tia-for-gas.md`, `guides/gm-world.md`

### Edit type 3: Convert template interpolation to `%xxx%` markers (5 files)
```md
<!-- BEFORE -->
```sh-vue [Arabica]
Evolve Version: {{constants.celestiaNodeArabicaEvolveTag}}
```

<!-- AFTER -->
```sh [Arabica]
Evolve Version: %celestiaNodeArabicaEvolveTag%
```
```

For regular code blocks (not `sh-vue`):
```md
<!-- BEFORE -->
```bash
git clone --depth 1 --branch {{constants.evolveLatestTag}} https://github.com/evstack/ev-node.git
```

<!-- AFTER -->
```bash
git clone --depth 1 --branch %evolveLatestTag% https://github.com/evstack/ev-node.git
```
```

Files: `guides/da/celestia-da.md`, `guides/da/local-da.md`, `guides/cometbft-to-evolve.md`, `guides/evm/single.md`, `guides/quick-start.md` (verify)

### Edit type 4: Convert container titles to bracket syntax (3 files)
```md
<!-- BEFORE (VitePress) — remark-directive REJECTS this entirely -->
:::warning Disclaimer

<!-- AFTER (Fumadocs) -->
:::warning[Disclaimer]
```

Files: `guides/reset-state.md`, `guides/deploy/overview.md`, and 1 other guide file

### Edit type 5: Map VitePress-specific frontmatter (3 files)
```yaml
# BEFORE (VitePress)
---
aside: false
outline: false
---

# AFTER (Fumadocs)
---
full: true
toc: false
---
```

```yaml
# BEFORE
---
pageClass: gas-calculator
---

# AFTER (remove — handle via component styling)
---
---
```

Files: `api/index.md`, `api/operationsByTags/[operationId].md`, `guides/celestia-gas-calculator.md`

### Edit type 6: Replace OpenAPI page (2 files — `api/`)
The `api/index.md` and `api/operationsByTags/[operationId].md` files use VitePress OpenAPI components and dynamic routes. These are entirely replaced by `fumadocs-openapi` generated pages. Not a line-edit — these files are restructured or replaced.

### Edit type 7: Replace `index.md` home layout (1 file)
The root `index.md` uses VitePress `layout: home` with hero/features YAML. Replace with a simple docs landing page that links to the main sections. The marketing site at `/` is the real homepage.

### Files NOT edited (110 of 124)
Drop in completely untouched. Standard Markdown with `:::` containers, code blocks, links, images, tables, frontmatter — all handled by Fumadocs + remark plugins.

---

## Dynamic Version Rendering

Version strings remain centrally managed, matching the VitePress DX:

**VitePress (old)**: `constants.js` → `<script setup>` import → `{{constants.xxx}}` in `sh-vue` code blocks

**Fumadocs (new)**: `docs-constants.ts` → `remark-template-vars` plugin → `%xxx%` in code blocks

**`src/lib/docs-constants.ts`** — single source of truth:
```ts
export const docsConstants: Record<string, string> = {
  golangVersion: 'go1.25.0',
  evolveLatestTag: 'v1.0.0-beta.4',
  evolveIgniteAppVersion: 'evolve/v0.4.0',
  localDALatestTag: 'v1.0.0-beta.1',
  igniteVersionTag: 'v28.5.3',
  celestiaNodeArabicaTag: 'v0.23.4-arabica',
  celestiaNodeArabicaEvolveTag: 'v1.0.0-beta.1',
  celestiaNodeMochaTag: 'v0.23.4-mocha',
  celestiaNodeMochaEvolveTag: 'v1.0.0-beta.1',
  celestiaNodeMainnetTag: 'v0.22.3',
  celestiaNodeMainnetEvolveTag: 'v1.0.0-beta.1',
  // ↑ Complete list — all 11 constants from .vitepress/constants/constants.js
};
```

**`src/plugins/remark-template-vars.ts`** — remark plugin (~30 lines):
- Walks AST code block text nodes
- Finds `%variableName%` markers
- Replaces with matching value from `docsConstants`
- Runs inside Fumadocs' MDX pipeline — no external build step

To bump a version: edit `docs-constants.ts` → all docs pages reflect the change on next build.

---

## Integration Architecture

```
content/
  docs/                     ← .md files (one-time cleanup applied)
    meta.json               ← Root sidebar config (new)
    learn/
      meta.json
      about.md
      specs/
        out-of-order-blocks.png   ← co-located image (served via remarkImage)
        ...
    guides/
      meta.json
      quick-start.md
      da/
        meta.json
        local-da.md
        celestia-da.md
      deploy/
      evm/
    api/
      meta.json
      index.md
    adr/
      figures/
        header_shares_commit.jpg  ← co-located image
    reference/
    concepts/
    overview/
    ev-abci/
    ev-reth/

src/app/
  layout.tsx                ← RootProvider + Plausible analytics
  page.tsx                  ← Marketing homepage (unchanged)
  privacy-policy/           ← Legal pages (unchanged)
  terms-and-conditions/     ← Legal pages (unchanged)
  sitemap.ts                ← Extend to include docs pages
  docs/
    layout.tsx              ← DocsLayout with sidebar, footer, social links
    [[...slug]]/
      page.tsx              ← Catch-all page + generateMetadata + editUrl + lastModified
  api/
    search/
      route.ts              ← Fumadocs search API endpoint

src/lib/
  source.ts                 ← Fumadocs source/loader config
  layout.shared.tsx         ← Nav links, social links, logo
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
    DocsFooter.tsx               ← License + copyright footer
```

### Key files to create/modify

| File | Action | Purpose |
|------|--------|---------|
| `source.config.ts` | Create | Docs collection, remark plugins, frontmatter schema, lastModified plugin |
| `next.config.mjs` | Modify | Wrap with `createMDX()` |
| `tsconfig.json` | Modify | Add `"collections/*": [".source/*"]` path alias |
| `src/app/globals.css` | Modify | Add Fumadocs CSS imports |
| `src/app/layout.tsx` | Modify | Wrap with `RootProvider`, add Plausible analytics script |
| `src/app/sitemap.ts` | Modify | Include docs pages via `source.getPages()` |
| `src/app/docs/layout.tsx` | Create | DocsLayout with sidebar, footer, social links |
| `src/app/docs/[[...slug]]/page.tsx` | Create | Page renderer + generateMetadata + editUrl + lastModified |
| `src/app/api/search/route.ts` | Create | Search endpoint |
| `src/lib/source.ts` | Create | Fumadocs loader |
| `src/lib/layout.shared.tsx` | Create | Nav links, social links (GitHub, X, Telegram), logo |
| `src/lib/docs-constants.ts` | Create | Version constants (single source of truth) |
| `src/plugins/remark-template-vars.ts` | Create | Dynamic version rendering in code blocks |
| `src/plugins/remark-vitepress-codegroup.ts` | Create | Code-group to Tabs plugin |
| `src/plugins/remark-strip-md-links.ts` | Create | Remove .md from links |
| `src/components/mdx.tsx` | Create | MDX components mapping |
| `src/components/docs/CelestiaGasEstimator.tsx` | Create | React port of Vue gas calculator |
| `src/components/docs/MermaidDiagram.tsx` | Create | Client-side Mermaid renderer |
| `src/components/docs/DocsFooter.tsx` | Create | License + copyright footer |
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
import { z } from 'zod';
import { pageSchema } from 'fumadocs-core/source/schema';
import remarkDirective from 'remark-directive';
import { remarkDirectiveAdmonition } from 'fumadocs-core/mdx-plugins';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import { remarkTemplateVars } from './src/plugins/remark-template-vars';
import { remarkVitepressCodeGroup } from './src/plugins/remark-vitepress-codegroup';
import { remarkStripMdLinks } from './src/plugins/remark-strip-md-links';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      full: z.boolean().default(false),   // maps VitePress aside: false
      toc: z.boolean().default(true),     // maps VitePress outline: false
    }),
  },
});

export default defineConfig({
  plugins: [lastModified()],             // git-based last updated timestamps
  mdxOptions: {
    remarkPlugins: (defaults) => [
      remarkDirective,
      remarkDirectiveAdmonition,         // :::tip, :::warning[T], :::info → <Callout>
      remarkVitepressCodeGroup,          // :::code-group → <Tabs>
      remarkTemplateVars,                // %version% → actual value
      remarkStripMdLinks,                // ./path.md → ./path
      ...defaults,                       // includes remarkImage, remarkHeading, etc.
    ],
  },
});
```

**1.3 Wrap `next.config.mjs`** with MDX plugin
```js
import { createMDX } from 'fumadocs-mdx/next';

const config = {
  // existing next config (remote image patterns, etc.)
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

**Note**: Fumadocs uses its own `prose` class (fork of Tailwind Typography). The existing project does NOT use `@tailwindcss/typography`, so no conflict expected. If typography conflicts arise with the global `h1–h4` styles in `globals.css`, use Option B.

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

**1.7 Modify root layout** — add `RootProvider` + Plausible analytics
```tsx
import { RootProvider } from 'fumadocs-ui/provider/next';
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body>
        <RootProvider theme={{ enabled: false }}>
          <Header /> {/* conditionally hide on /docs routes */}
          {children}
        </RootProvider>
        <Script
          defer
          data-domain="ev.xyz"
          src="https://plausible.celestia.org/js/plausible.js"
        />
      </body>
    </html>
  );
}
```

**1.8 Create docs layout** — `src/app/docs/layout.tsx`
```tsx
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { DocsFooter } from '@/components/docs/DocsFooter';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      sidebar={{ footer: <DocsFooter /> }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
```

**1.9 Create docs page** — `src/app/docs/[[...slug]]/page.tsx`
```tsx
import { source } from '@/lib/source';
import {
  DocsBody, DocsDescription, DocsPage, DocsTitle,
  ViewOptionsPopover, PageLastUpdate,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const { lastModified } = await page.data.load();

  return (
    <DocsPage
      toc={page.data.toc !== false ? page.data.toc : undefined}
      full={page.data.full}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
      </DocsBody>
      <ViewOptionsPopover
        githubUrl={`https://github.com/evstack/docs/blob/main/${page.path}`}
      />
      {lastModified && <PageLastUpdate date={lastModified} />}
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) return {};

  const url = `/docs/${(params.slug ?? []).join('/')}`;

  return {
    title: `${page.data.title} | Evolve`,
    description: page.data.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${page.data.title} | Evolve`,
      description: page.data.description,
      url,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.data.title} | Evolve`,
      description: page.data.description,
    },
  };
}
```

**1.10 Create search API route**
```ts
// src/app/api/search/route.ts
import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
export const { GET } = createFromSource(source);
```

**1.11 Create shared layout config** — `src/lib/layout.shared.tsx`
```tsx
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

// Custom Telegram SVG icon (from old VitePress config)
const TelegramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z..." />
  </svg>
);

export function baseOptions(): BaseLayoutProps {
  return {
    nav: { title: 'Evolve' },
    githubUrl: 'https://github.com/evstack',
    links: [
      { text: 'Learn', url: '/docs/learn/about' },
      { text: 'Guides', url: '/docs/guides/quick-start' },
      { text: 'API', url: '/docs/api' },
      {
        type: 'icon',
        label: 'Twitter',
        icon: <XIcon />,     // from lucide-react or custom SVG
        url: 'https://twitter.com/ev_stack',
        external: true,
      },
      {
        type: 'icon',
        label: 'Telegram',
        icon: <TelegramIcon />,
        url: 'https://t.me/+2p8-IYf6sQ0zNmEx',
        external: true,
      },
    ],
  };
}
```

**1.12 Create footer component** — `src/components/docs/DocsFooter.tsx`
```tsx
export function DocsFooter() {
  return (
    <div className="text-xs text-fd-muted-foreground">
      <p>Released under the APACHE-2.0 License</p>
      <p>Copyright © 2024 Evolve</p>
    </div>
  );
}
```

**1.13 Extend sitemap** — update `src/app/sitemap.ts`
```ts
import { source } from '@/lib/source';

// Add docs pages to existing sitemap
const docsPages = source.getPages().map((page) => ({
  url: new URL(page.url, SITE_URL).toString(),
  changeFrequency: 'weekly' as const,
  priority: 0.5,
}));
```

**1.14 Verify no visual regressions** on marketing pages.

---

### Phase 2: Remark Plugins

**2.1 Container directives** — zero work needed

Fumadocs' `remarkDirectiveAdmonition` (requires `remark-directive`) converts:
- `:::tip` → `<Callout type="info">`
- `:::warning` → `<Callout type="warn">`
- `:::warning[Disclaimer]` → `<Callout type="warn" title="Disclaimer">`
- `:::danger` → `<Callout type="error">`
- `:::info` → `<Callout type="info">`

**Important**: Space-separated titles like `:::warning Disclaimer` are NOT supported — `remark-directive` rejects the entire directive. The one-time cleanup converts these to bracket syntax.

**2.2 `remark-template-vars`** — dynamic version rendering

Custom remark plugin (~30 lines) that:
- Walks AST code block text nodes
- Finds `%variableName%` markers
- Replaces with values from `docs-constants.ts`

**2.3 `remark-vitepress-codegroup`** — tabbed code blocks

Custom remark plugin that:
- Detects `:::code-group` container directives
- Extracts tab labels from code block meta (e.g., ` ```sh [Arabica] `)
- Converts to Fumadocs `<Tabs>` + `<Tab>` components
- Only 4 instances in 3 files

**2.4 `remark-strip-md-links`** — link cleanup (~10 lines)

Strips `.md` extension from internal link `href` attributes.

---

### Phase 3: One-Time Content Cleanup

Apply mechanical edits to 14 files (detailed above):

1. Delete `<script setup>` blocks (9 files)
2. Replace `<Callout />` with `:::tip` + static text (3 files)
3. Convert `{{constants.xxx}}` → `%xxx%` and `sh-vue` → `sh` (5 files)
4. Convert `:::warning Disclaimer` → `:::warning[Disclaimer]` (3 files)
5. Map VitePress frontmatter to Fumadocs equivalents (3 files)
6. Restructure API pages for `fumadocs-openapi` (2 files)
7. Replace `index.md` home layout with docs landing page (1 file)

Copy all `.md` files (with edits applied) into `content/docs/`, preserving directory structure. Add `meta.json` sidebar config files.

**Exclude from `content/docs/`**:
- `api/operationsByTags/[operationId].md` — VitePress dynamic route file. Brackets in filename would confuse Fumadocs. Replaced by `fumadocs-openapi` generated pages.
- Any `.md` files that exist on disk but are NOT in the VitePress sidebar config. Audit the old docs directory against `sidebarHome()` to identify orphan files. Decide per-file: include in sidebar, or exclude entirely.

**Copy public scripts** to new `public/docs/`:
- `install.sh`, `install-go.sh`, `install-jq.sh` — referenced from guide pages. Update any absolute `/install.sh` references in `.md` files to `/docs/install.sh` (or keep at root if preferred).

---

### Phase 4: React Component Ports & OpenAPI

**4.1 `<CelestiaGasEstimator />`** — React port required

1,589-line Vue component → `'use client'` React component. Register in MDX components map so the tag in `.md` files renders automatically.

**4.2 `<MermaidDiagram />`** — client-side renderer

Simple `'use client'` React component using `mermaid` npm package. Map to ` ```mermaid ` code blocks via MDX component override for `pre`/`code` elements. Only 1 file uses Mermaid.

**4.3 OpenAPI docs** — `fumadocs-openapi`
```bash
npm i fumadocs-openapi
```
Copy `src/openapi-rpc.json` (32KB) from the old docs repo into the new project. `fumadocs-openapi` reads this spec and generates pages at build time, replacing VitePress OpenAPI components and dynamic routes (`[operationId].paths.js`).

**4.4 `twitter.vue`, `keplr.vue`** — skip (unused)

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

**Complete list of `meta.json` files needed** (one per directory with pages):

| Path | Derived from |
|------|-------------|
| `content/docs/meta.json` | Root sidebar sections |
| `content/docs/learn/meta.json` | `sidebarHome()` Learn section |
| `content/docs/learn/sequencing/meta.json` | Sequencing sub-items |
| `content/docs/learn/specs/meta.json` | Technical Specifications sub-items |
| `content/docs/guides/meta.json` | How To Guides section |
| `content/docs/guides/da/meta.json` | DA sub-items |
| `content/docs/guides/deploy/meta.json` | Deploy sub-items |
| `content/docs/guides/evm/meta.json` | EVM sub-items |
| `content/docs/api/meta.json` | API Documentation section |
| `content/docs/reference/meta.json` | Reference section |
| `content/docs/reference/configuration/meta.json` | Config sub-items |
| `content/docs/reference/api/meta.json` | API reference sub-items |
| `content/docs/reference/interfaces/meta.json` | Interface sub-items |
| `content/docs/reference/specs/meta.json` | Spec sub-items |
| `content/docs/concepts/meta.json` | Concepts section |
| `content/docs/overview/meta.json` | Overview section |
| `content/docs/ev-abci/meta.json` | EV-ABCI section |
| `content/docs/ev-abci/modules/meta.json` | Modules sub-items |
| `content/docs/ev-reth/meta.json` | EV-Reth section |
| `content/docs/ev-reth/features/meta.json` | Features sub-items |
| `content/docs/adr/meta.json` | ADR section |

Page ordering in each `meta.json` should match the VitePress `sidebarHome()` config. For sections not in the sidebar (reference, concepts, overview, ev-abci, ev-reth, adr), use `"pages": ["..."]` (rest operator) for alphabetical ordering, or specify explicit order if desired

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

**6.4 Sidebar tabs** — use `"root": true` in top-level `meta.json` files for tab-based section switching (Learn / Guides / API tabs).

---

### Phase 7: Navigation & Header Integration

**7.1 Header behavior** — conditionally render the marketing `<Header>` outside `/docs/*` routes. Fumadocs' `DocsLayout` provides its own navbar with search, breadcrumbs, sidebar toggle, and social links.

**7.2 Cross-navigation**:
- Marketing header: add a "Docs" link → `/docs`
- Docs navbar: add a link back to `/` (marketing site)

---

### Phase 8: Polish & Verify

**8.1 Test all ~124 pages render correctly**

**8.2 Copy static assets** — co-located images from old `docs/` maintain their relative paths in `content/docs/`. Fumadocs' `remarkImage` handles them via static imports. Public assets (favicons, logos) go to `public/docs/`.

**8.3 Redirects** — if deploying on the same domain as the old docs:
```js
// next.config.mjs
redirects: async () => [
  { source: '/learn/:path*', destination: '/docs/learn/:path*', permanent: true },
  { source: '/guides/:path*', destination: '/docs/guides/:path*', permanent: true },
  { source: '/api/:path*', destination: '/docs/api/:path*', permanent: true },
]
```

**8.4 Test search** — verify Orama indexes all pages and returns relevant results.

**8.5 Test mobile** — sidebar collapse, search dialog, TOC behavior.

**8.6 Verify marketing pages unaffected** — no CSS regressions on `/`, `/privacy-policy`, `/terms-and-conditions`.

**8.7 Test edit links** — verify "Edit on GitHub" links point to correct file paths.

**8.8 Test last updated** — verify timestamps display and are accurate from git history. Note: requires non-shallow git clone in CI (Vercel default is shallow — may need `VERCEL_DEEP_CLONE=true` or equivalent).

**8.9 Test sitemap** — verify `/sitemap.xml` includes all docs pages with correct URLs.

**8.10 Test OG tags** — verify per-page `og:title`, `og:description`, and canonical URLs render correctly for social sharing and SEO.

**8.11 Test canonical URLs** — verify each docs page has a `<link rel="canonical">` tag with the correct URL.

**8.12 Audit for orphan pages** — compare `.md` files in `content/docs/` against `meta.json` sidebar configs. In Fumadocs, all `.md` files generate pages regardless of sidebar inclusion. Decide per orphan file:
- Add to sidebar via `meta.json`
- Use `"pages": ["..."]` rest operator to include automatically
- Remove from `content/docs/` if obsolete

**8.13 Test public scripts** — verify `install.sh`, `install-go.sh`, `install-jq.sh` are accessible and correctly referenced from guide pages.

---

## What Changes vs. What Stays The Same

### Stays the same (zero changes — 110 files)
- All markdown content, headings, paragraphs, lists, tables
- `:::tip`, `:::warning`, `:::info` container syntax (no title)
- Code blocks with syntax highlighting
- Mermaid diagram syntax
- Co-located images (`./image.png`) — served via Fumadocs `remarkImage`
- Frontmatter (`description`, `title`)
- Custom heading IDs (`{#id}`)
- Reference-style links
- HTML comments (`<!-- markdownlint-disable -->`)
- Internal links (`./path.md` — `.md` stripped at build time)

### One-time cleanup (14 files, small mechanical edits)
- `<script setup>` blocks → deleted (9 files)
- `<Callout />` → `:::tip` + static text (3 files)
- `{{constants.xxx}}` → `%xxx%` markers (5 files)
- `sh-vue` / `ts-vue` / `bash-vue` → `sh` / `ts` / `bash` (3 files)
- `:::warning Disclaimer` → `:::warning[Disclaimer]` (3 files)
- VitePress frontmatter (`aside`, `outline`, `pageClass`) → Fumadocs equivalents (3 files)
- API pages → restructured for `fumadocs-openapi` (2 files)
- `index.md` home layout → simple docs landing page (1 file)

### Preserved via remark plugin (same DX as VitePress)
- Dynamic version rendering: `%xxx%` in code blocks resolved from `docs-constants.ts` at build time

### Preserved via Fumadocs features (matching VitePress)
- Edit on GitHub links → `ViewOptionsPopover` component
- Last updated timestamps → `lastModified` plugin (git-based)
- Social links (GitHub, X, Telegram) → `baseOptions()` icon links
- Footer (license/copyright) → custom `DocsFooter` component
- Per-page OG tags → Next.js `generateMetadata`
- Deep TOC (all heading levels) → default Fumadocs behavior
- Full-text search → Orama (built-in)
- Sitemap → `source.getPages()` in `sitemap.ts`
- Plausible analytics → `<Script>` tag in root layout

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
| `fumadocs-mdx` | Content processing (.md → typed data), lastModified plugin | Active, 2025, Next.js 16 |
| `fumadocs-core` | Remark plugins (admonition, heading, image), search, utilities | Active, 2025 |
| `fumadocs-ui` | Pre-built docs UI (sidebar, search, TOC, layout, ViewOptionsPopover) | Active, 2025, Tailwind CSS 4 |
| `@types/mdx` | TypeScript types for MDX | Active |
| `remark-directive` | Parses `:::` container syntax into AST | Active, unified ecosystem |
| `fumadocs-openapi` | OpenAPI → docs page generation | Active, 2025 |
| `mermaid` | Client-side diagram rendering | Active, v11+ |
| `zod` | Frontmatter schema validation | Active |

**NOT used** (outdated or unnecessary):
- `contentlayer` / `contentlayer2` — semi-maintained
- `next-mdx-remote` — not well maintained in 2025
- `velite` — pre-1.0
- `rehype-mermaid` — pulls in Playwright, overkill for 1 diagram

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Fumadocs CSS conflicts with marketing styles | Global typography clashes | Scope via `@layer` or route groups; test early |
| `<CelestiaGasEstimator>` React port | Complex interactive component | Budget significant time; can initially link to old site |
| MDX compiler edge cases on `.md` files | Raw `<` or `{` in prose | Audit found none in prose — all are in code blocks (safe) |
| `:::code-group` remark plugin | Custom plugin needed | Small scope — only 4 instances in 3 files |
| `RootProvider` side effects | Adds `next-themes` globally | Disable via `theme: { enabled: false }` |
| Shallow git clone in CI | `lastModified` returns null | Set `VERCEL_DEEP_CLONE=true` or use GitHub API fallback |
| Co-located image paths | May not resolve correctly | Fumadocs `remarkImage` with `useImport: true` (default) handles this |
| Fumadocs `prose` class vs global `h1–h4` | Typography conflicts | Fumadocs prose is scoped to docs body; test early |
| Shiki language support | `protobuf` / `solidity` may not be included by default | Add to Shiki config if missing; test code blocks in Phase 8 |
| Mermaid count higher than expected | May be more than 1 file with mermaid diagrams | Verify full count during Phase 8; client-side renderer handles any count |

---

## Estimated Effort by Phase

| Phase | Scope | Notes |
|-------|-------|-------|
| Phase 1 | Fumadocs scaffold + routing + config | Includes layout, page, search, metadata, footer, social links, analytics, sitemap |
| Phase 2 | Remark plugins | 3 small custom plugins (~70 lines total) |
| Phase 3 | One-time content cleanup | Mechanical edits to 14 files + meta.json files |
| Phase 4 | React component ports + OpenAPI | CelestiaGasEstimator is the main effort |
| Phase 5 | Sidebar `meta.json` files | Mapping from VitePress sidebar config |
| Phase 6 | Theme customization | CSS variable overrides |
| Phase 7 | Navigation integration | Header conditional rendering |
| Phase 8 | QA + polish | Test all 124 pages, search, mobile, edit links, OG tags, sitemap |

---

## Open Decisions

1. **Light/dark mode for docs?** Marketing site is light-only. Should docs support dark mode? (Low effort if yes — Fumadocs supports it via `RootProvider`.)
2. **CSS isolation strategy?** Scoped `@layer` imports vs route groups. Test first.
3. **Header strategy?** Hide marketing header on docs pages vs customize Fumadocs navbar to match.
4. **Gas Calculator timing?** Port the full React component now vs link to old site temporarily.
5. **ADR inclusion?** Are all 23 ADRs still relevant, or are some obsolete?
6. **URL structure?** `/docs/learn/about` (prefixed) vs `/learn/about` (flat)?
7. **Mermaid approach?** Client-side React component vs pre-rendered SVG (only 1 diagram).
8. **Analytics domain?** Keep `ev.xyz` or update to new domain for the combined site?
9. **Edit link repo?** Currently points to `evstack/docs` — update if docs move to the `evolve` repo.
10. **Code font?** Old docs use IBM Plex Mono; Evolve site uses Geist Mono. Use Geist Mono for consistency (recommended) or keep IBM Plex Mono for docs?
11. **Audit PDFs?** `audit/informal-systems.pdf` and `audit/binary-builders.pdf` exist in old docs. Include in migration if referenced from any page.
12. **`getting-started/` directory?** 5 files exist on disk but NOT in the VitePress sidebar. Include, merge into guides, or drop?
13. **Orphan files across all sections?** Some `.md` files may exist but not appear in `sidebarHome()`. Audit and decide per-file during Phase 3.
