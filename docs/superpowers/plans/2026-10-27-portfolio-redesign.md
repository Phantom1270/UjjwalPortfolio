# Portfolio Redesign Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement the tasks in this session. The user's detailed brief authorizes design decisions and implementation without a design approval round.

**Goal:** Make Ujjwal's actual work understandable through a warm, editorial static portfolio.

**Architecture:** One semantic HTML page, a replacement token-based stylesheet, and a small progressively enhanced mobile navigation script. Responsive HTML workflow diagrams provide evidence without fabricated screenshots.

**Tech Stack:** HTML, CSS, vanilla JavaScript. Existing static hosting and CNAME. Bundled Playwright for development verification only.

**Spec:** User's pasted brief, 2026-10-27; primary factual source is `Ujjwal_Shukla_Resume_latest.pdf`.

## Global constraints

- Preserve CNAME and static hosting; do not add a framework or build dependency.
- Ivory, charcoal, olive; Georgia display serif and system humanist sans serif, with no font download.
- Show three featured projects, four additional projects, education, leadership, selective capabilities, direct contact, and resume.
- No invented metrics, project URLs, screenshots, contribution claims, or deployment status.
- All content visible without JavaScript; no intro, continuous animation, or custom cursor.

## Review focus

- 360px mobile and enlarged text: content and diagrams must wrap without overflow.
- JavaScript unavailable: navigation, project content, resume, and contact remain usable.
- Keyboard use: menu toggles with Enter/Space, Escape returns focus, anchor selection reaches its target.
- Desktop/mobile resizing: menu visibility and focus stay consistent.
- Evidence accuracy: separate deployment paths, no first-place claim, no unexplained forest-fire metric.

## Tasks

- [x] Read original site and latest resume; inventory assets and existing links.
- [x] Replace `index.html`, `styles.css`, and `main.js`; add favicon and social image.
- [x] Verify navigation, PDF, internal links, responsive layouts, reduced motion, and JavaScript-disabled behavior using a local browser.
- [x] Inspect desktop, tablet, and narrow mobile screenshots and refine presentation.
- [x] Record source provenance, link checks, unresolved factual issues, and verification in `docs/content-notes.md`.

## Decisions

Work in the user-requested existing workspace and leave changes reviewable without commits or publication. Use native HTML workflow figures rather than introducing a diagram runtime. Hcare's public repository README confirmed MedVigilant as its alternate name, so both names describe one project. Exclude historical numeric commercial and accuracy claims that cannot be corroborated.

## Completion record

Implemented all tasks. Independent code review found no critical or important issues beyond the header-offset issue resolved during review. The no-JavaScript header now remains in document flow; the enhanced sticky header uses its measured height for anchor offsets. Regression checks passed. Small diagram text was enlarged and CSS formatting expanded following the review.
