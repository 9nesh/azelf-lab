import { it,expect } from 'vitest';import { validatePatch } from '../../services/verifier/src/patch.ts';
const valid='diff --git a/src/integrations/permits.ts b/src/integrations/permits.ts\nindex 1111111..2222222 100644\n--- a/src/integrations/permits.ts\n+++ b/src/integrations/permits.ts\n@@ -1 +1 @@\n-old\n+new\n';
it('accepts a bounded adapter-only unified patch',()=>expect(validatePatch(valid)).toMatch(/^[a-f0-9]{64}$/));
it.each(['evaluation/contracts/permits.ts','package.json','.github/workflows/test.yml','../escape','src/ui/app.js'])('rejects unauthorized file %s',path=>expect(()=>validatePatch(valid.replaceAll('src/integrations/permits.ts',path))).toThrow());
it.each(['new file mode 120000','old mode 100644\nnew mode 100755','rename from src/integrations/permits.ts','GIT binary patch','deleted file mode 100644'])('rejects metadata %s',metadata=>expect(()=>validatePatch(valid.replace('index 1111111..2222222 100644',metadata))).toThrow());
it('rejects empty and oversized candidates',()=>{expect(()=>validatePatch('')).toThrow();expect(()=>validatePatch(valid+'+'.repeat(102400))).toThrow();});
