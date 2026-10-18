# Architecture decisions

2026-10-18 — Preserve existing Vite landing and Sites packaging. Add `/lab` in existing UI; separate consumer on its own origin. Use TypeScript HTTP services alongside existing root.

2026-10-18 — Node 24.18.0 LTS and npm lockfile; built-in node:sqlite for durable single-operator records and content-addressed evidence. Transactions, active-scope uniqueness and fencing remain mandatory.

2026-10-18 — Do not run untrusted candidate code or runtime repair on the unrestricted host. Live execution and independent candidate verification stay blocked until enforced isolation, egress and credential separation pass canary checks. Deterministic tests of reviewed source may run locally and are labeled accordingly.

2026-10-18 — Initial folder is not a Git checkout. Establish a local repository to identify baselines; this does not provide remote publication. No remote is invented and no production deployment is authorized.

2026-10-18 — Existing ChatGPT CLI auth and GitHub keyring access are available only outside the initial sandbox. Never mount host auth into candidate containers. Model transport requires a separate trusted broker; network-none verifier can be implemented and tested independently.

2026-10-18 — Container image pinned by digest, UID 1000, read-only root, no capabilities, no-new-privileges, bounded tmpfs/memory/CPU/PIDs/output and wall deadlines. Protected evaluator stays in trusted host controller; candidate is observed over HTTP and cannot write trusted verdicts. Deterministic reference patches will be explicitly labeled evaluator fixtures, never live Mew output.

2026-10-18 — User-authorized choices relayed by accountability chat: use exact build-chat model, resolved from turn_context as `gpt-6.1-sol`; 60,000 total tokens per attempt including cached input and retries, one attempt per incident, ten-minute wall deadline, at most two repair invocations / 120,000 tokens for required demonstrations. Existing supported Codex authentication preferred; no new API key or credits authorized. Live execution remains blocked because aggregate hard ceiling enforcement is not established for codex-cli 0.153.0. Usage reporting or cancelling a stream is insufficient to claim this limit.

2026-10-18 — User authorized PRIVATE GitHub repo `9nesh/azelf-lab` (created, isPrivate=true) and separate Vercel test projects `azelf-lab-vendor` and `azelf-lab-consumer`. CLI authenticated as 9nesh on both providers. Repository setup does not authorize merge or test deployment. No deployment is started by project preparation.

2026-10-18 — Internal Docker networks intentionally have no directly published candidate port. A separate trusted relay uses a fixed candidate upstream and a five-route GET allowlist, no credentials or caller-controlled URLs. It bridges browser traffic without giving candidate containers general egress.
