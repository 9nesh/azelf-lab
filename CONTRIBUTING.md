# Contributing to Azelf

Azelf is a research prototype for evidence-led API maintenance. Useful contributions include reproducible bug reports, clearer documentation, bounded integration handling, and independent verification improvements.

## Before changing code

Check the working tree and preserve unrelated work. Keep local planning notes and experiment journals out of commits.

Keep UI changes in `src/`, brand vectors in `public/assets/`, and retain the Sites packaging files. Use the pinned Node version and `npm ci`.

## Validation

For application changes, run checks appropriate to the affected behavior:

```sh
npm run lab:typecheck
npm run lab:test:unit
npm run lab:test:acceptance
npm run build
npm run test:sites
```

Browser acceptance requires Playwright Chromium. Execution-boundary changes also require the Docker isolation checks documented in the [README](README.md#development-and-validation).

Documentation-only changes should verify relative links, command names, and factual claims against current code and evidence.

## Pull requests

Explain the problem, resulting behavior, validation performed, and remaining limits. Attach reproducible evidence where useful. Preserve failed outcomes and original artifacts; record new evidence additively rather than rewriting old experiments.

Never describe a fake/reference patch as a native repair, local tests as hosted proof, or exposed development as an unseen research result. Candidate-controlled output cannot establish a trusted verdict.

Do not include credentials, `.env` files, local SQLite databases, raw private runtime transcripts, or `.azelf/` archives in a PR. Use sanitized, intentional evidence exports.

Merge, deployment, and new live model invocations require the applicable explicit human authorization. A passing test suite alone does not grant it.

## Reporting bugs

Include the source revision, Node version, command or UI steps, expected behavior, actual behavior, and sanitized logs. State whether Docker and browser dependencies were available. Avoid attaching local evidence archives wholesale.

No repository license has been selected. Discuss reuse and contribution terms with the owner before contributing substantial material.
