//const API_BASE = 'http://localhost:3001';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

export async function submitEvaluation(payload) {
  const r = await fetch(`${API_BASE}/api/evaluations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!r.ok) {
    let details = null;
    try { details = await r.json(); } catch {}
    const msg = details?.message || details?.error || `HTTP ${r.status}`;
    throw Object.assign(new Error(msg), { status: r.status, details });
  }

  return r.json();
}