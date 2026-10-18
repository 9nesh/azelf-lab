import { useEffect, useRef, useState } from 'react';
const stages = [
  { name: 'Detect', title: 'An upstream change. A clear signal.', text: 'A new pagination contract means the first response no longer contains every record. Azelf identifies the integration and the behavior at risk.' },
  { name: 'Repair', title: 'A small patch. The same promise.', text: 'The adapter follows each page while keeping your application’s internal contract intact. Changes stay inside the scope you approve.' },
  { name: 'Verify', title: 'All the records. All the evidence.', text: 'Independent checks compare the patch against your application’s original expectations. A passing response is only the beginning.' },
];
const checks = ['Retrieves all 120 records', 'No duplicate identifiers', 'Preserves the application contract', 'Stays within approved files'];
function Arrow() { return <span aria-hidden="true" className="arrow">↗</span>; }
function Brand({ footer = false }) { return <a href="#" className={`brand ${footer ? 'brand-footer' : ''}`} aria-label="Azelf home"><img src="/assets/azelf-mark.svg" alt="" width="44" height="40" /><span>Azelf</span></a>; }
function CodeDemo({ stage }) {
  return <div className={`code-demo stage-${stage}`} aria-label="Illustrative pagination repair">
    <div className="code-eyebrow">VENDOR UPDATE <span>/</span> <em>PAGINATION</em></div>
    <div className="code-lines">
      <div className="code-line"><span className="line-number">1</span><code>const response = await api.listUsers({'{'}</code></div>
      <div className="code-line"><span className="line-number">2</span><code>   page, limit,</code></div>
      <div className="code-line"><span className="line-number">3</span><code>{'}'});</code></div>
      <div className="code-line removed"><span className="line-number">4</span><code><span className="diff-sign">−</span> return response.data;</code></div>
      <div className="code-line added"><span className="line-number">5</span><code><span className="diff-sign">+</span> return collectPages(response);</code></div>
      <div className="code-line added"><span className="line-number">6</span><code><span className="diff-sign">+</span> assertComplete(records);</code></div>
    </div>
    <div className="code-status" aria-live="polite">{stage === 0 ? 'Change detected · incomplete results' : stage === 1 ? 'Adapter patched · ready for verification' : '4 checks passed · ready for review'}</div>
  </div>;
}
function Modal({ type, onClose }) {
  const dialog = useRef(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [saved, setSaved] = useState(false);
  const [email, setEmail] = useState('');
  useEffect(() => {
    const el = dialog.current;
    el.showModal();
    const close = () => onClose();
    el.addEventListener('close', close);
    return () => el.removeEventListener('close', close);
  }, [onClose]);
  useEffect(() => {
    if (!playing || step >= 3) return;
    const timer = setTimeout(() => setStep(v => v + 1), 1150);
    return () => clearTimeout(timer);
  }, [playing, step]);
  function submit(e) { e.preventDefault(); setSaved(true); }
  return <dialog ref={dialog} className={`modal ${type === 'demo' ? 'demo-modal' : ''}`} aria-labelledby="modal-title" onClick={e => { if (e.target === dialog.current) onClose(); }}>
    <button className="modal-close" aria-label="Close dialog" onClick={onClose}>×</button>
    {type === 'demo' ? <>
      <span className="eyebrow">THE MAINTENANCE LOOP / INTERACTIVE DEMO</span>
      <h2 id="modal-title">A change.<br />A verified repair.</h2>
      <p className="modal-intro">A vendor adds pagination. Your app still needs every record.</p>
      <ol className="demo-timeline">{['Upstream change detected', 'Scoped adapter patch prepared', 'Protected verification passed', 'Repair ready for human review'].map((label, i) => <li key={label} className={step >= i && playing ? 'complete' : ''}><span className="timeline-dot">{step >= i && playing ? '✓' : `0${i + 1}`}</span><span>{label}</span>{step >= i && playing && <small>{i === 3 ? 'PR ready' : 'Complete'}</small>}</li>)}</ol>
      {step >= 2 && playing && <div className="demo-checks" aria-live="polite">{checks.map(c => <span key={c}>✓ {c}</span>)}</div>}
      <div className="modal-bottom"><span>Illustrative example · no repository is modified</span><button className="button button-dark" disabled={playing && step < 3} onClick={() => { setStep(0); setPlaying(true); }}>{!playing ? 'Run the demo' : step < 3 ? 'Running…' : 'Replay demo'} <Arrow /></button></div>
    </> : saved ? <div className="signup-success">
      <span className="success-icon">✓</span><span className="eyebrow">PREVIEW COMPLETE</span><h2 id="modal-title">You’re ahead<br />of the change.</h2><p>The signup preview is complete for <strong>{email}</strong>. No email was sent and no registration was created.</p><button className="button button-dark" onClick={onClose}>Back to Azelf <Arrow /></button>
    </div> : <>
      <span className="eyebrow">AZELF / EARLY ACCESS</span><h2 id="modal-title">Keep your code<br />moving forward.</h2><p className="modal-intro">Be part of a better way to maintain the APIs your application depends on.</p>
      <form onSubmit={submit}><label htmlFor="email">Work email</label><input id="email" type="email" name="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" maxLength={254} />
        {type === 'connect' && <><label htmlFor="repository">Repository URL <span>(optional)</span></label><input id="repository" type="url" name="repository" placeholder="https://github.com/your-team/your-project" /></>}
        <button className="button button-dark signup-submit" type="submit">Preview early-access request <Arrow /></button><p className="form-note">This is a preview. Your details are not sent or stored, and no repository access is requested.</p>
      </form>
    </>}
  </dialog>;
}
export function App() {
  const [stage, setStage] = useState(1);
  const [modal, setModal] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const closeModal = () => setModal(null);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header page-width"><Brand /><nav aria-label="Main navigation"><a href="#overview">Overview</a><a href="#developers">Developers</a><a href="/lab">Azelf Lab</a></nav><button className="text-button access-link" onClick={() => setModal('access')}>Get early access <Arrow /></button></header>
    <main id="main">
      <section className="hero page-width" id="overview" aria-labelledby="hero-title"><h1 id="hero-title"><span>Change is inevitable.</span><span>Maintenance isn’t.</span></h1><p className="hero-subtitle">APIs that adapt. Code that keeps up.</p>
        <div className="repair-visual"><CodeDemo stage={stage} /><img className="hero-mark" src="/assets/azelf-mark.svg" alt="Azelf — a black, arching mark with a red center" width="400" height="350" /><svg className="connection-line" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true"><path d="M 469 298 C 591 288 673 179 793 176" /></svg></div>
        <div className="process-tabs" aria-label="Explore the maintenance process">{stages.map((s, i) => <button key={s.name} className={`process-tab ${stage === i ? 'active' : ''}`} onClick={() => { setStage(i); setShowDetails(true); }} aria-expanded={stage === i && showDetails} aria-controls="stage-detail"><span className="process-number">0{i + 1}</span><span className="process-name">{s.name}</span><span className="process-indicator" /></button>)}</div>
        {showDetails && <div id="stage-detail" className="stage-detail" role="region" aria-live="polite"><h3>{stages[stage].title}</h3><p>{stages[stage].text}</p><button className="text-button" onClick={() => setShowDetails(false)} aria-label="Collapse process details">Close ×</button></div>}
      </section>
      <section className="verification page-width" aria-labelledby="verify-title"><h2 id="verify-title">Verified against your application.</h2><p>The change. The patch. The proof.</p><div className="cta-row"><button className="button button-dark connect-button" onClick={() => setModal('connect')}>Connect your repository</button><button className="watch-button" onClick={() => setModal('demo')}>Watch it work <Arrow /></button></div></section>
      <section className="built-section" id="developers" aria-labelledby="built-title"><h2 id="built-title">Built to keep going.</h2><div className="developer-content page-width"><div className="developer-heading"><span className="eyebrow">MAINTAIN THE CAPABILITY. KEEP THE PROMISE.</span><h3>Your dependencies change.<br />Your intent shouldn’t.</h3></div><div className="developer-copy"><p>Azelf connects upstream changes to the code and workflows that depend on them. Every proposed repair comes with the context to understand it and the evidence to review it.</p><button className="watch-button" onClick={() => setModal('demo')}>Explore the maintenance loop <Arrow /></button></div><div className="principles"><article><span className="eyebrow">01 / BOUNDED CHANGES</span><h4>A precise patch.</h4><p>Scoped to the integration. Guided by your application’s existing contract.</p></article><article><span className="eyebrow">02 / INDEPENDENT CHECKS</span><h4>Proof before release.</h4><p>Original expectations. Protected checks. Visible uncertainty.</p></article><article><span className="eyebrow">03 / YOUR AUTHORITY</span><h4>You set the limits.</h4><p>Start with proposals. Review the evidence. Decide what ships.</p></article></div></div></section>
      <section className="closing page-width"><span className="eyebrow">A SELF-MAINTAINING API PLATFORM</span><h2>Keep building.<br />We’ll watch for change.</h2><button className="button button-dark" onClick={() => setModal('access')}>Get early access <Arrow /></button></section>
    </main>
    <footer className="site-footer page-width"><Brand footer /><span>Build APIs. Keep them working.</span><a href="/assets/azelf-mark.svg" download="azelf-mark.svg">Download the mark <Arrow /></a><span className="copyright">© {new Date().getFullYear()} Azelf</span></footer>
    {modal && <Modal type={modal} onClose={closeModal} />}
  </>;
}
