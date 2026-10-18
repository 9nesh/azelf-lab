# Azelf five hour delivery goals

## Delivery objective

Within a five-hour implementation sprint, deliver Azelf Lab connected to a real maintenance loop: establish a healthy consumer, introduce an incompatible vendor API change, observe the failure, run a bounded Codex repair, verify the patch independently, publish a repair PR, and verify an approved test deployment.

The operator must be able to see what happened, what the repair agent received, which files changed, which checks passed, and which actions still require approval. Preserve the existing landing page and Sites build contract.

Use [the first version build guide](AZELF_FIRST_VERSION_BUILD_GUIDE.md) for implementation details and security boundaries. This document establishes execution order, deadlines, acceptance gates, and priorities. It does not declare any unimplemented feature complete or remove requirements from the build guide.

The five hours are an engineering delivery target, not a guaranteed completion time. Start the elapsed clock when implementation begins. Record the start, target finish, and actual checkpoint times in the implementation status file. This planning document does not start a background build or scheduled automation.

## Definition of success

At the end of the sprint, demonstrate all of the following with retained evidence:

1. **Working baseline:** three permits, correct statuses, filtering, and `$375.00` in total fees through a real HTTP integration.
2. **Observable failure:** changing the vendor leaves the consumer unchanged and breaks a protected workflow. Azelf Lab displays the actual failure.
3. **Real repair:** an isolated Codex job changes only the authorized consumer adapter using approved incident evidence.
4. **Independent proof:** a fresh verifier runs unchanged protected checks against the exact candidate and rejects a deliberately wrong patch.
5. **Reviewable delivery:** a real PR contains exactly the verified repair and usable evidence, with automatic merge disabled.
6. **Hosted outcome:** after authorized human merge and test deployment, the original workflow passes against the pinned changed vendor. The incident resolves only after post-deployment observation.
7. **Correct restraint:** an irrelevant addition generates no patch, a vendor outage creates an availability incident, and an undocumented status produces a decision request.
8. **Usable Lab:** controls, consumer views, timeline, diff, verification comparison, evidence, cancellation, and persistent run history reflect real backend state.

The field rename is the first full demonstration. The combined rename and pagination case is the second proof that the mechanism generalizes beyond one replacement. A fake executor may test orchestration but cannot satisfy either live repair goal.

Report completion separately as local loop, proposal delivery, and hosted loop. A failed external prerequisite cannot be relabeled a successful end-to-end delivery.

## Starting position

The inspected workspace contains a React/Vite landing-page prototype, local brand assets, Sites packaging support, and the implementation guide. The lab services, vendor fixture, consumer application, runtime executor, verifier, and publisher still need implementation.

Keep the landing page available. Add Azelf Lab as a distinct application view or route using the existing React project. Follow the repository's current `AGENTS.md`; do not replace the visual system or hosting setup as part of scaffolding the backend.

Use one development agent initially. Keep tasks sequential where they share interfaces or files. Parallelize independent commands only where safe; do not spend the sprint coordinating several unfinished implementations.

## First twenty minutes must remove uncertainty

Before committing to the hosted deadline, establish whether the critical execution path is actually available:

- Run the current build and Sites checks and record their baseline.
- Confirm the supported Node/npm toolchain and a usable browser test runtime.
- Confirm a container or equivalent runner can enforce the isolation requirements.
- Confirm the selected runtime Codex interface can authenticate and complete a harmless disposable smoke task.
- Confirm a repository can receive the repair branch and PR through the authorized publisher.
- Confirm test hosting access, deployment identity retrieval, and the user's merge/deployment authorization path.
- Identify how the human approval step will be handed off so it is not discovered at minute 295.

Inspect credentials through existence/access checks without printing their values. Never compensate for missing access by giving the repair process broad host credentials.

By minute 20, record each prerequisite as available, unavailable, or unverified, with the next action and responsible party. Continue unaffected work immediately. The hosted finish remains blocked if its required access is absent.

## Goal 1 — Establish the baseline and experiment identity

**Window: minute 0–60. Checkpoint at minute 60.**

Spend the first 20 minutes on the prerequisite checks above, then build the smallest complete baseline:

- Add the TypeScript vendor service and a separate consumer with a dedicated HTTP adapter.
- Serve the three known synthetic permits and expose immutable version identity.
- Freeze protected assertions for records, statuses, total fees, filtering, and visible failures.
- Add a persistent run record with pinned consumer/vendor identities and configuration.
- Add the Azelf Lab shell with real baseline preview, vendor identity, run ID, and Run checks.

**Acceptance evidence:** baseline adapter and browser checks pass; consumer filtering works visibly; root build and Sites checks preserve their baseline; restarting the controller retains the run.

**Failure rule:** if the baseline is not passing at minute 60, concentrate on that failure. Do not begin model repair against an unproven application.

## Goal 2 — Break the integration and capture trustworthy evidence

**Window: minute 60–100. Checkpoint at minute 100.**

- Implement immutable field-rename and pagination variants plus the combined version.
- Add the additive, outage, and ambiguous-status variants as small isolated fixtures.
- Wire Introduce change, Reset baseline, and Run checks to the private harness.
- Confirm a failing workflow twice against the same pinned identities.
- Persist sanitized previous/current responses, contract changes, failed assertions, affected adapter path, and browser captures.
- Deduplicate repeated failures and enforce one active job per integration.
- Separate scenario/evaluator information from the agent-visible evidence manifest.

**Acceptance evidence:** the unchanged consumer passes v1 and fails rename/pagination checks against the changed versions; switching back to v1 restores success. Azelf Lab shows the recorded failure and evidence without invented progress.

**Failure rule:** a schema diff or HTTP `200` alone cannot establish the behavioral result. Repair eligibility depends on the meaningful check and evidence sufficiency.

## Goal 3 — Produce a real bounded Codex repair

**Window: minute 100–150. Checkpoint at minute 150.**

- Implement the executor interface and exercise a fake result only to test orchestration.
- Export a fresh consumer-only workspace from the pinned baseline.
- Prove the runner cannot access evaluation answers, host canaries, publisher credentials, or unrelated network destinations.
- Start a live Codex repair with an approved usage ceiling and wall-clock deadline.
- Permit changes only to the consumer adapter; keep dependencies, UI, policy, fixtures, and protected checks outside its authority.
- Extract the actual diff, execution outcome, and unresolved questions through the trusted wrapper.
- Connect Start repair, Stop run, and live stage records to the Lab.

**Acceptance evidence:** one real runtime invocation produces an allowed nonempty patch for the rename scenario; its input manifest excludes the answer key; cancellation and timeout terminate real work and retain a reason.

**Failure rule:** do not replace this goal with hardcoded string replacement or weaken isolation to save time. If live execution is unavailable, keep the gap visible while completing verifier and Lab work.

## Goal 4 — Verify independently and reject cheating

**Window: minute 150–195. Checkpoint at minute 195.**

- Apply the candidate to a fresh baseline checkout in the trusted verifier.
- Validate paths, patch size/hash, protected-file integrity, and candidate identity.
- Run build/types, adapter checks, protected browser workflows, and alternate synthetic records.
- Exercise pagination completeness, correct fee conversion, duplicate handling, and failure visibility.
- Test negative patches that hardcode results, suppress errors, omit pages, or edit protected files.
- Run the combined rename/pagination scenario through real repair and verification.
- Display the exact diff and actual Baseline/Broken/Candidate results in the Lab.

**Acceptance evidence:** the correct candidate passes the unchanged checks; incorrect candidates fail for recorded reasons; the combined scenario retrieves all expected data with preserved semantics.

**Failure rule:** missing, skipped, errored, or flaky mandatory checks prevent verified status. A model's explanation does not override a failed assertion.

## Goal 5 — Publish the proposal and prepare the hosted handoff

**Window: minute 195–240. Checkpoint at minute 240.**

- Implement a separate trusted publisher with repository write access.
- Revalidate base, patch, candidate, policy, and verification identities before publication.
- Create a real repair branch and PR with accessible sanitized evidence.
- Make retries idempotent and reject stale verification if the base changes.
- Complete independent vendor/consumer test deployments and obtain verifiable deployment identities.
- Surface the concrete PR and test-deployment handoff for human approval as soon as it is ready.
- Keep PR publication, release authorization, and deployment health distinct in the Lab.

**Acceptance evidence:** the PR exists and contains exactly the verified changes. Test deployment inputs and identities are recorded. Human approval is requested against the actual candidate, not a speculative plan.

**Failure rule:** if repository or hosting access is blocked, retain the verified patch and report the missing prerequisite. Do not substitute a local file for a real PR or claim a hosted deployment from a URL alone.

## Goal 6 — Finish the operator workflow and restraint suite

**Window: minute 240–270. Checkpoint at minute 270.**

- Complete Baseline/Broken/Candidate/Released views with identity labels and historical captures.
- Finish the stage timeline, Agent received manifest, evidence inspector, and verification comparison.
- Prove additive changes produce no repair, outages avoid schema edits, and ambiguous statuses request a decision.
- Verify refresh/reconnect, cancellation, reset, durable history, and replay with pinned inputs.
- Make evaluation runs identifiable and distinguish fake from live execution.
- Ensure actual blocked/not-run/error states never appear green.
- Run UI checks for keyboard access, clear errors, and inert upstream HTML.

**Acceptance evidence:** a browser-driven experiment follows real events from baseline to verified proposal. Replay creates a new linked run. Old artifacts survive reset. Restraint decisions match the scenario expectations.

**Failure rule:** remove misleading UI affordances or mark unavailable functionality explicitly. Do not add decorative progress or sample results to fill missing backend data.

## Goal 7 — Prove the deployed outcome and close with evidence

**Window: minute 270–300. Final checkpoint at minute 300.**

- Incorporate the authorized human merge and test deployment when available; verify the deployed artifact corresponds to the approved candidate.
- Run original protected workflows against the hosted changed vendor and released consumer.
- Complete the configured five-minute observation window, with three checks spread across it.
- Run the relevant regression, isolation, policy, and build checks after the final changes.
- Demonstrate one rejected malicious patch and the three restraint outcomes in Azelf Lab.
- Write the actual result report and a reproducible startup/demo/cleanup runbook.
- Stop temporary services not needed for the user's review; leave the reviewable Lab preview available where appropriate.

**Acceptance evidence:** linked run, observations, model invocation, patch, verification, PR, merged candidate, deployment, and post-release results. The final report identifies every incomplete or unverified requirement.

Reserve at least the last 15 minutes for final verification and evidence. Do not begin a new feature during that interval. The observation window must actually elapse; it cannot be replaced by three immediate requests.

## Priorities when the schedule slips

Preserve the end-to-end path and its trust boundaries. Reduce presentation and convenience work first:

- Keep one excellent Lab screen instead of additional navigation or dashboards.
- Use manual capability registration instead of repository-wide discovery.
- Use polling instead of streaming infrastructure.
- Use the existing SQLite/artifact abstractions rather than deploying a production database.
- Keep manual stage progression before adding Run full experiment.
- Keep compact replay/history controls instead of charts and rich evaluation comparisons.
- Defer extra UI polish, animations, prose, and generalized configuration builders.

Do not defer real model execution, independent verification, protected acceptance criteria, actual failure reproduction, correct restraint, credential separation, or evidence integrity and still claim the requested outcome is complete.

If the full target cannot be achieved within five hours, report the actual completion level and exact remaining work. Maintain the original build requirements; do not redefine success around whichever features happen to be finished.

## Work already outside this sprint

Jev, Dot, general API generation, provider-side maintenance, multi-tenant onboarding, broad language/protocol support, automatic merge, production deployment, and autonomous rollback remain outside the initial scope established in the build guide. Show no functioning controls for them.

## Checkpoint reporting format

At each checkpoint, update `docs/implementation-status.md` with:

```text
Elapsed time:
Goal and state: passed / incomplete / blocked
Evidence: commands, run IDs, artifact references, actual results
Remaining critical path:
External action needed:
Next checkpoint:
```

Use exact elapsed time, not estimated percentage complete. Record failures as well as passes. During implementation, share concise progress updates when a meaningful finding or blocker changes the plan.

## Final deliverables

- Working source for Azelf Lab, vendor fixture, consumer, controller, executor, verifier, and publisher.
- Passing protected tests and retained results for successful and rejected repairs.
- A live run demonstrating rename repair and a second run demonstrating combined rename/pagination repair.
- Correct additive-change, outage, and ambiguous-semantics outcomes.
- A real repair PR and approved hosted result when external prerequisites are satisfied.
- `docs/implementation-status.md`, `docs/test-report.md`, and `docs/demo-runbook.md` with actual outcomes and remaining gaps.
- A final requirement-by-requirement completion audit against the main build guide, distinguishing the five-hour delivery from any still-incomplete first-version requirements.

## Codex execution instruction

```text
Implement Azelf and Azelf Lab using AZELF_FIRST_VERSION_BUILD_GUIDE.md.
Use AZELF_FIVE_HOUR_DELIVERY_GOALS.md as the five-hour execution schedule.

Start by recording the sprint start time and checking the critical execution,
repository, and hosting prerequisites. Preserve the existing landing page,
brand assets, user changes, and Sites build contract.

Build and prove the whole path: baseline -> controlled break -> confirmed
incident -> real restricted Codex patch -> independent verification -> real
repair PR -> authorized test deployment -> post-release behavior checks.

Build Azelf Lab alongside the backend so the operator can observe actual
consumer states, events, evidence, policy, code changes, and verification.

Use each timed checkpoint to report actual evidence and remaining risk.
Reduce convenience and visual scope before sacrificing correctness or
isolation. Never fabricate results or replace live execution with a fake.

Complete all authorized work you can. Keep external approvals attached to
concrete candidates. Report local, proposal, and hosted completion separately,
and identify every unmet requirement at the five-hour checkpoint.
```
