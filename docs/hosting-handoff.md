# Test hosting handoff

User-authorized provider: Vercel. Projects: azelf-lab-vendor and azelf-lab-consumer under inesh-tickoos-projects. Projects are independent and have no Git auto-deployment link.

`npx tsx scripts/prepare-vercel.ts` prepares `.azelf/deployments/vendor` and `.azelf/deployments/consumer`; it performs no deployment. Supply an immutable vendor version and pin the resulting vendor deployment URL in consumer configuration. Review the exact source and manifest before deployment. The initial package is baseline preparation, not a verified repair.

No test deployment is authorized until a concrete candidate, verification report, version and environment are presented for human approval. Never use `--prod`. Never infer deployment identity from a supplied URL alone; query provider records and compare baked source/adapter identities with the approved candidate. Deployment health and permit semantics are separate checks.

After approval and merge: build packages from the exact merged candidate, verify it again if merge changed the tree, deploy the immutable vendor then consumer to preview, and record Vercel deployment IDs, source identities, configured vendor URL and approval evidence. Run protected acceptance against those URLs. Observe for five actual minutes with three checks spread across the window. Failures leave the incident open.
