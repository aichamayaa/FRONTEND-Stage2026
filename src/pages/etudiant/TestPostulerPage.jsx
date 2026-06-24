import { CandidatureForm } from '../../components/candidatures/CandidatureForm';

export function TestPostulerPage() {
  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1>Test — Postuler (US-18)</h1>
      <CandidatureForm offreId={5} />
    </main>
  );
}
