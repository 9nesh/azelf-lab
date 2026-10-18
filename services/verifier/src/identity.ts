import { readFileSync } from 'node:fs';import { hash } from '../../../packages/contracts/policy.ts';
const evaluatorFiles=['evaluation/contracts/permits.ts','evaluation/contracts/alternate.ts','evaluation/acceptance/checks.ts','evaluation/scenarios/alternate-vendor.mjs','services/verifier/src/verifier.ts','services/verifier/src/runner.ts','services/verifier/src/patch.ts','runner/consumer-entry.mjs','runner/vendor-entry.mjs','runner/preview-relay.mjs'];
export function evaluatorBundleHash(){return hash(JSON.stringify(evaluatorFiles.map(path=>({path,sha256:hash(readFileSync(path))}))));}
