import { it,expect } from 'vitest';import { requireLiveBudget,type BudgetCapability } from '../../services/executor/src/usage-gate.ts';
const supported:BudgetCapability={model:'gpt-6.1-sol',preRequestInputAccounting:true,serverOutputReservation:true,countsCachedInput:true,retriesShareReservation:true,credentialBrokerCanaryPassed:true,internalEgressCanaryPassed:true};
it.each(['preRequestInputAccounting','serverOutputReservation','countsCachedInput','retriesShareReservation','credentialBrokerCanaryPassed','internalEgressCanaryPassed'] as const)('blocks incomplete live boundary %s',key=>{expect(()=>requireLiveBudget({...supported,[key]:false})).toThrow();});
it('rejects silent model substitutions',()=>expect(()=>requireLiveBudget({...supported,model:'another-model'})).toThrow('Exact approved'));
it('accepts only the complete declared capability set (not proof itself)',()=>expect(()=>requireLiveBudget(supported)).not.toThrow());
