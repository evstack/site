---
title: AI-Ready Documentation
description: Use Evolve docs with AI coding tools like Claude Code, Cursor, ChatGPT, and more
---

# AI-Ready Documentation

Evolve documentation is optimized for AI-assisted development. Every page is available as clean, structured markdown — ready to feed into your favorite AI coding tool.

## Available Endpoints

| Endpoint | Description |
|----------|-------------|
| [`/llms.txt`](/llms.txt) | Curated index of all documentation pages with titles, URLs, and descriptions |
| [`/llms-full.txt`](/llms-full.txt) | Complete documentation content in a single markdown file |
| `/api/md/{page-path}` | Individual page as processed markdown (e.g., `/api/md/overview/architecture`) |

## Using with AI Tools

### Claude Code

Point Claude Code at the full documentation:

```bash
claude "Read https://ev.xyz/llms-full.txt, I want to ask questions about Evolve"
```

Or reference specific pages:

```bash
claude "Read https://ev.xyz/api/md/guides/quick-start and help me set up my first rollup"
```

### Cursor

In Cursor, add the docs URL to your project context:

1. Open **Settings** → **Features** → **Docs**
2. Add `https://ev.xyz/llms.txt` as a documentation source
3. Cursor will index the documentation for use in chat and completions

### ChatGPT

Paste the llms.txt URL directly into a conversation:

```
Read https://ev.xyz/llms-full.txt and help me understand how to deploy an EVM rollup with Evolve.
```

### Other AI Tools

Any AI tool that supports the [llms.txt standard](https://llmstxt.org/) can automatically discover and consume Evolve documentation. The `/llms.txt` endpoint follows the community standard used by Vercel, Cloudflare, Supabase, and other developer platforms.

## Copy from the UI

Every documentation page includes **Copy Markdown** and **Open** buttons (visible in the table of contents on desktop, or above the title on mobile). Use these to quickly copy page content into any AI tool.

## How It Works

The LLM-optimized endpoints are automatically generated from the same markdown source files that power this documentation site. When a new page is added, it's instantly available through all endpoints — no extra configuration needed.

- **`/llms.txt`** follows the [llms.txt specification](https://llmstxt.org/), similar to `robots.txt` but for AI agents
- **`/llms-full.txt`** concatenates all pages into a single file, ideal for loading into an AI's context window
- **Per-page markdown** strips frontmatter, imports, and JSX — delivering clean, readable content optimized for language models
