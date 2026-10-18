# Architecture decisions

2026-10-18 — Preserve existing Vite landing and Sites packaging. Add `/lab` in existing UI; separate consumer on its own origin. Use TypeScript HTTP services alongside existing root.

2026-10-18 — Node 24.18.0 LTS and npm lockfile; built-in node:sqlite for durable single-operator records and content-addressed evidence. Transactions, active-scope uniqueness and fencing remain mandatory.

2026-10-18 — Do not run untrusted candidate code or runtime repair on the unrestricted host. Live execution and independent candidate verification stay blocked until enforced isolation, egress and credential separation pass canary checks. Deterministic tests of reviewed source may run locally and are labeled accordingly.

2026-10-18 — Initial folder is not a Git checkout. Establish a local repository to identify baselines; this does not provide remote publication. No remote is invented and no production deployment is authorized.
