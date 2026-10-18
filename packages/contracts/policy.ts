import { createHash } from 'node:crypto';
export const policy = Object.freeze({version:'2',mode:'propose',allowedPaths:['src/integrations/permits.ts'],maxAttempts:1,maxPatchBytes:102400,maxPages:20,executorDeadlineSeconds:600,verifierDeadlineSeconds:600,maxOutputBytes:1048576,autoMerge:false,productionDeploy:false,model:'gpt-6.1-sol',usageCeiling:{totalTokensPerAttempt:60000,countCachedInput:true,maxLiveDemonstrations:2,totalDemonstrationTokens:120000}});
export const hash=(data:string|Buffer)=>createHash('sha256').update(data).digest('hex');
export const policyHash=hash(JSON.stringify(policy));
