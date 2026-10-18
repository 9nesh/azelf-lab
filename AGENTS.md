# Prototype Instructions

## Azelf design direction

The user selected `artifacts/reference.png` as the landing-page visual target and explicitly requested a handcrafted SVG logo. Preserve the oversized tight Helvetica typography, warm white background, black arching mark with a red oval, airy spacing, pagination diff, and Detect / Repair / Verify sequence. Keep brand vectors in `public/assets/` and avoid remote font dependencies. Early-access and repository flows remain explicitly labeled previews until real services are connected.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

Typography feedback: maintain a clear display / heading / body / label hierarchy. Body and actions should be at least 16px, section labels at least 12px, form notes at least 13px. Do not shrink mobile text simply to fit; allow wrapping instead.

## Implementation continuity

Build scope and trust boundaries: `AZELF_FIRST_VERSION_BUILD_GUIDE.md`; sprint checkpoints: `AZELF_FIVE_HOUR_DELIVERY_GOALS.md`. Preserve both requirements documents.
On restart or context compression, read `docs/implementation-status.md` and `docs/architecture-decisions.md`, then verify current files and running services before continuing. Update these records after milestones, significant failures, or direction changes. Record actual evidence and unfinished requirements; fake execution never counts as live repair. Merge and deployment require human approval.
