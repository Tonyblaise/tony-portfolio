import { Link, useParams, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { StarField } from '@/components/StarField';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WorkflowDiagram } from '@/components/WorkflowDiagram';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { AUTOMATION_PROJECTS, TOOL_META } from '@/data/automationProjects';

const ROLE_BG: Record<string, string> = {
  Trigger: 'rgba(168, 255, 212, 0.15)',
  Workflow: 'rgba(0, 229, 255, 0.15)',
  Source: 'rgba(168, 255, 212, 0.15)',
  Sources: 'rgba(168, 255, 212, 0.15)',
  AI: 'rgba(199, 125, 255, 0.15)',
  Generation: 'rgba(199, 125, 255, 0.15)',
  Transcribe: 'rgba(199, 125, 255, 0.15)',
  Notify: 'rgba(255, 181, 90, 0.15)',
  Alerts: 'rgba(255, 181, 90, 0.15)',
  Storage: 'rgba(106, 169, 255, 0.15)',
  State: 'rgba(106, 169, 255, 0.15)',
  Target: 'rgba(106, 169, 255, 0.15)',
  Render: 'rgba(0, 229, 255, 0.15)',
  Deliver: 'rgba(255, 181, 90, 0.15)',
  Schedule: 'rgba(255, 181, 90, 0.15)',
  Tasks: 'rgba(106, 169, 255, 0.15)',
  Platform: 'rgba(255, 181, 90, 0.15)',
  Auth: 'rgba(199, 125, 255, 0.15)',
  Actions: 'rgba(168, 255, 212, 0.15)',
  Searches: 'rgba(0, 229, 255, 0.15)',
  Scrape: 'rgba(0, 229, 255, 0.15)',
  Research: 'rgba(106, 169, 255, 0.15)',
};

const Lightbox = ({ src, caption, onClose }: { src: string; caption: string; onClose: () => void }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-5 font-mono text-sm text-muted-foreground/60 hover:text-primary transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        [esc] close
      </button>
      <img
        src={src}
        alt={caption}
        className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg border border-border/30"
        onClick={(e) => e.stopPropagation()}
      />
      <span className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-xs text-muted-foreground/50">{caption}</span>
    </div>
  );
};

const ShotFrame = ({ caption, src, portrait = false }: { caption: string; src?: string; portrait?: boolean }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => { if (src) setOpen(true); }, [src]);

  return (
    <>
      <div
        className={`auto-shot-frame border border-border/30 rounded-lg bg-card/60 overflow-hidden relative${src ? ' cursor-zoom-in' : ''}`}
        style={{ aspectRatio: portrait ? '9 / 16' : '16/9' }}
        onClick={handleOpen}
        role={src ? 'button' : undefined}
        tabIndex={src ? 0 : undefined}
        onKeyDown={src ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleOpen(); } : undefined}
        aria-label={src ? `Zoom: ${caption}` : undefined}
      >
        {src ? (
          <img src={src} alt={caption} className="absolute inset-0 w-full h-full object-cover" style={portrait ? undefined : { top: 24 }} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ top: 24 }}>
            <span className="font-mono text-xs tracking-widest text-muted-foreground/40 uppercase">// drop screenshot</span>
          </div>
        )}
        {!portrait && <span className="absolute bottom-3 left-4 right-4 font-mono text-xs text-muted-foreground/60">{caption}</span>}
      </div>
      {open && src && <Lightbox src={src} caption={caption} onClose={() => setOpen(false)} />}
    </>
  );
};

const AutomationDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const idx = AUTOMATION_PROJECTS.findIndex((p) => p.id === projectId);
  const p = AUTOMATION_PROJECTS[idx];

  const headerRef = useScrollReveal();
  const problemRef = useScrollReveal();
  const solutionRef = useScrollReveal();
  const stackRef = useScrollReveal();
  const shotsRef = useScrollReveal();

  if (!p) return <Navigate to="/portfolio" replace />;

  const prev = AUTOMATION_PROJECTS[(idx - 1 + AUTOMATION_PROJECTS.length) % AUTOMATION_PROJECTS.length];
  const next = AUTOMATION_PROJECTS[(idx + 1) % AUTOMATION_PROJECTS.length];
  const isMobile = p.tool === 'Mobile';

  return (
    <div className="min-h-screen relative">
      <StarField />
      <div className="fixed inset-0 bg-background/80 pointer-events-none -z-[5]" />
      <Navbar />

      <main>
        <div className="container mx-auto px-4 pt-28 pb-32 max-w-4xl">

          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-primary transition-colors mb-10"
          >
            <span className="text-primary">←</span> back to portfolio
          </Link>

          {/* Header */}
          <header ref={headerRef} className="border-l-2 border-primary/60 pl-6 mb-16 reveal reveal-up">
            <div className="font-mono text-xs tracking-widest uppercase text-primary/70 mb-3 flex flex-wrap items-center gap-1">
              <span>// case {String(idx + 1).padStart(2, '0')}</span>
              <span className="text-muted-foreground/30 mx-1">·</span>
              <span className="text-muted-foreground/50">{p.tool}</span>
              <span className="text-muted-foreground/30 mx-1">·</span>
              <span className="text-secondary/80">● {p.status}</span>
            </div>
            <h1 className="font-mono font-bold text-4xl md:text-5xl text-foreground mb-4 leading-tight tracking-tight">
              {p.name}
            </h1>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {p.short}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-1.5 border border-border/40 rounded px-2.5 py-1 text-xs font-mono"
                style={{ color: TOOL_META[p.tool]?.color ?? 'hsl(var(--primary))' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: TOOL_META[p.tool]?.color ?? 'hsl(var(--primary))' }}
                />
                {p.tool}
              </span>
              {p.liveUrl && (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Visit site
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M6 14 L14 6 M9 6 L14 6 L14 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </a>
              )}
            </div>
          </header>

          {/* Problem */}
          <section ref={problemRef} className="mb-16 reveal reveal-up">
            <p className="font-mono text-xs tracking-[0.22em] uppercase text-primary/70 mb-2">
              <span className="text-foreground/40 mr-1.5">$</span>01 · problem
            </p>
            <h2 className="font-mono font-semibold text-2xl text-foreground mb-5">The business pain</h2>
            <p className="font-mono text-sm text-muted-foreground leading-[1.8] max-w-3xl">
              {p.problem}
            </p>
          </section>

          {/* Solution */}
          <section ref={solutionRef} className="mb-16 reveal reveal-up">
            <p className="font-mono text-xs tracking-[0.22em] uppercase text-primary/70 mb-2">
              <span className="text-foreground/40 mr-1.5">$</span>02 · solution
            </p>
            <h2 className="font-mono font-semibold text-2xl text-foreground mb-5">How it works</h2>
            <p className="font-mono text-sm text-muted-foreground leading-[1.8] max-w-3xl mb-8">
              {p.solution}
            </p>

            {/* Workflow diagram */}
            <div className="border border-border/30 bg-card/40 backdrop-blur rounded-lg p-6 workflow-diagram-bg">
              <WorkflowDiagram flow={p.flow} edges={p.edges} />
            </div>
          </section>

          {/* Tech stack */}
          <section ref={stackRef} className="mb-16 reveal reveal-up">
            <p className="font-mono text-xs tracking-[0.22em] uppercase text-primary/70 mb-2">
              <span className="text-foreground/40 mr-1.5">$</span>03 · stack
            </p>
            <h2 className="font-mono font-semibold text-2xl text-foreground mb-5">Tech & integrations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {p.stack.map((s, i) => {
                const bg = ROLE_BG[s.role] ?? 'rgba(0, 229, 255, 0.10)';
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 border border-border/30 bg-card/60 rounded-lg px-4 py-3"
                  >
                    <span
                      className="w-8 h-8 rounded flex-shrink-0 inline-flex items-center justify-center font-mono font-bold text-sm text-foreground/80"
                      style={{ background: bg }}
                    >
                      {s.name[0]}
                    </span>
                    <div>
                      <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/50">{s.role}</div>
                      <div className="font-mono text-sm text-foreground/80">{s.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Screenshots */}
          <section ref={shotsRef} className="mb-16 reveal reveal-up">
            <p className="font-mono text-xs tracking-[0.22em] uppercase text-primary/70 mb-2">
              <span className="text-foreground/40 mr-1.5">$</span>04 · {isMobile ? 'app screens' : 'screenshots'}
            </p>
            <h2 className="font-mono font-semibold text-2xl text-foreground mb-5">{isMobile ? 'App screens' : 'Workflow & output'}</h2>
            <div className={isMobile ? 'grid grid-cols-2 sm:grid-cols-3 gap-4' : 'grid grid-cols-1 gap-4'}>
              {p.shots.map((s, i) => (
                <ShotFrame key={i} caption={s.caption} src={s.src} portrait={isMobile} />
              ))}
            </div>
          </section>

          {/* Next / Prev */}
          <div className="mt-24 border-t border-border/20 pt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to={`/portfolio/${prev.id}`}
              className="block border border-border/30 rounded-lg bg-card/60 px-6 py-5 portal-glow hover:border-primary/40 hover:bg-card/80 transition-all duration-200"
            >
              <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/50 mb-1.5">
                ← previous
              </div>
              <div className="font-mono text-base text-primary leading-tight">{prev.name}</div>
            </Link>
            <Link
              to={`/portfolio/${next.id}`}
              className="block border border-border/30 rounded-lg bg-card/60 px-6 py-5 portal-glow hover:border-primary/40 hover:bg-card/80 transition-all duration-200 text-right"
            >
              <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/50 mb-1.5">
                next →
              </div>
              <div className="font-mono text-base text-primary leading-tight">{next.name}</div>
            </Link>
          </div>

          <div className="mt-10 pt-6 border-t border-border/20 flex justify-between font-mono text-xs text-muted-foreground/40 tracking-widest">
            <span>{'>_'} TONY.351 :: automation/{p.id}</span>
            <span>// {idx + 1} / {AUTOMATION_PROJECTS.length}</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AutomationDetail;
