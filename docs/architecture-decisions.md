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

2026-10-18 — Within runtime investigation timebox, direct mock transport proved rollout tracking is not a strict aggregate ceiling: setting 60,000 allowed a mock 61,000-token completed turn, with no max_output_tokens in the outgoing request. No real inference occurred. Proposed alternative presented for explicit human approval; strict policy remains active until an answer arrives.

2026-10-18 — Proposed broker route uses installed Codex app-server with a task-local host HOME/CODEX_HOME, only existing auth cache copied privately after approval, no native execution environment, and one wrapper-owned dynamic container tool. The container has a read-only consumer export plus a single writable adapter-file mount, read-only evidence, fixed fixture-only internal network, UID 1000, CPU/memory/PID/output/deadline controls, and no Docker socket. All model authentication remains outside candidate processes. Native skill registry is empty in mock preflight; namespace-correct arbitrary host-file reads are rejected.

2026-10-18 — Exact repair-container canaries passed 12/12, including protected source write denial and fixture access. Failed Docker cp/chown setup attempts were replaced with read-only source and single-file writable mounts; rootfs and cap-drop restrictions were preserved. No root candidate process or broad writable source mount was introduced.

2026-10-18 — Initial attempted authorization via delegated accountability selection was rejected by automatic approval review before any command ran, then revoked by the accountability chat. No authorization file or model invocation resulted. Direct human approval was subsequently verified with read_thread: user message 01a15124-2ca2-7a82-8b9b-40db5c87916f says "yes approve", following the explicit bounded-route/token-overrun question in chat 01a15105-c6c7-7721-b3ea-03b292a9cd61.

2026-10-18 — The directly approved policy uses exact gpt-6.1-sol, existing sign-in only, credential-bearing trusted task-local app-server separate from candidate execution, container-only code commands after canaries, 600-second wall deadline, one attempt/incident, two live invocations maximum (rename then combined), 30 container-tool calls, 1 MiB output, no automatic retries. Stop at 60,000 reported input+output tokens including cached input; in-flight overrun is accepted and no exact token-overrun/dollar cap is guaranteed. Policy version 3 records this approved exception. Merge and deployment remain separate human actions.
