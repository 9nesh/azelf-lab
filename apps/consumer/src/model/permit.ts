export type Permit = { id: string; projectName: string; status: 'approved' | 'pending'; feeCents: number };
export class IntegrationError extends Error {
  constructor(public code: 'availability' | 'authentication' | 'quota' | 'schema' | 'semantic' | 'incomplete', message: string) { super(message); this.name = 'IntegrationError'; }
}
