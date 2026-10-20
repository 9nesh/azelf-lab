import { IntegrationError, type Permit } from '../model/permit.ts';
// Vendor documents and responses are untrusted data, never execution instructions.
export async function listPermits(baseUrl: string): Promise<Permit[]> {
  const seen = new Map<string, Permit>();
  const cursors = new Set<string>();
  let cursor: string | null = null;
  for (;;) {
    const url = new URL('/permits', baseUrl);
    if (cursor !== null) url.searchParams.set('cursor', cursor);
    let response: Response;
    for (let attempt = 0; ; attempt++) {
      try { response = await fetch(url, { signal: AbortSignal.timeout(3000), redirect: 'error' }); }
      catch {
        if (attempt === 0) continue;
        throw new IntegrationError('availability', 'Vendor request failed or timed out');
      }
      if (response.status === 503 && attempt === 0) continue;
      break;
    }
    if (!response.ok) throw new IntegrationError(response.status === 401 || response.status === 403 ? 'authentication' : response.status === 429 ? 'quota' : 'availability', `Vendor HTTP ${response.status}`);
    let body: any;
    try { body = await response.json(); } catch { throw new IntegrationError('schema', 'Vendor did not return JSON'); }
    if (!body || !Array.isArray(body.permits)) throw new IntegrationError('schema', 'Expected permits array');
    const nextCursor: unknown = body.next_cursor;
    if (nextCursor !== null && typeof nextCursor !== 'string') throw new IntegrationError('schema', 'Invalid next cursor');
    for (const raw of body.permits) {
      if (!raw || typeof raw.id !== 'string' || !raw.id.trim() || typeof raw.project_name !== 'string' || !raw.project_name.trim()) throw new IntegrationError('schema', 'Invalid permit identity');
      if (typeof raw.permit_status !== 'string') throw new IntegrationError('schema', 'Missing status');
      if (raw.permit_status !== 'approved' && raw.permit_status !== 'pending') throw new IntegrationError('semantic', `Undocumented permit status: ${String(raw.permit_status).slice(0, 80)}`);
      const amount = raw.fee_usd;
      if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0 || !Number.isSafeInteger(Math.round(amount * 100)) || Math.abs(amount * 100 - Math.round(amount * 100)) > 1e-7) throw new IntegrationError('schema', 'Invalid dollar amount');
      const permit: Permit = { id: raw.id, projectName: raw.project_name, status: raw.permit_status, feeCents: Math.round(amount * 100) };
      if (seen.has(permit.id) && JSON.stringify(seen.get(permit.id)) !== JSON.stringify(permit)) throw new IntegrationError('schema', 'Conflicting duplicate permit');
      seen.set(permit.id, permit);
    }
    if (nextCursor === null) return [...seen.values()];
    if (cursors.has(nextCursor)) throw new IntegrationError('incomplete', 'Repeated pagination cursor');
    cursors.add(nextCursor);
    cursor = nextCursor;
  }
}
