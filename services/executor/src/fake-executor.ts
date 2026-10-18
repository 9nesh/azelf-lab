import type { Executor,RepairRequest,RepairResult } from './runtime-executor.ts';
export class FakeExecutor implements Executor {
 constructor(private outcome:'failed'|'insufficient_evidence'|'cancelled'='insufficient_evidence'){}
 async execute(_request:RepairRequest,signal:AbortSignal):Promise<RepairResult>{return {executor:'fake',outcome:signal.aborted?'cancelled':this.outcome,summary:'Deterministic orchestration fixture; no model invoked and no verified patch produced.',unresolvedQuestions:[]};}
}
