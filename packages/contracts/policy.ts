import { createHash } from 'node:crypto';
export const policy = Object.freeze({version:'1',mode:'propose',allowedPaths:['src/integrations/permits.ts'],maxAttempts:1,maxPatchBytes:102400,maxPages:20,executorDeadlineSeconds:600,verifierDeadlineSeconds:600,maxOutputBytes:1048576,autoMerge:false,productionDeploy:false,model:null,usageCeiling:null});
export const hash=(data:string|Buffer)=>createHash('sha256').update(data).digest('hex');
export const policyHash=hash(JSON.stringify(policy));
