export type RepairResult={outcome:'candidate'|'insufficient_evidence'|'failed'|'cancelled'|'blocked';executor:'fake'|'codex';summary:string;unresolvedQuestions:string[];patch?:string};
export type RepairRequest={taskId:string;baseCommit:string;inputManifestHash:string;policyHash:string;workspacePath:string;evidencePath:string;allowedPaths:string[];deadline:string};
export interface Executor {execute(request:RepairRequest,signal:AbortSignal):Promise<RepairResult>}
// Fail closed until the broker, resource policy, network allowlist and canary report
// are wired to an actual runner. Host runtime exec is deliberately never a fallback.
export class RuntimeExecutor implements Executor {
 async execute(_request:RepairRequest,signal:AbortSignal):Promise<RepairResult>{return {outcome:signal.aborted?'cancelled':'blocked',executor:'codex',summary:'Live execution unavailable: credential-isolated model transport, enforced egress, canary proof and operator-approved model usage ceiling are required.',unresolvedQuestions:['Select model and usage ceiling','Configure credential broker and validate isolated runner']};}
}
