import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useScrollReveal, useScrollRevealStagger } from '@/hooks/use-scroll-reveal';
import { AUTOMATION_PROJECTS, PRODUCT_PROJECTS, TOOL_META } from '@/data/automationProjects';

const FILTERS = [
  'All', 'n8n', 'Zapier', 'Make',
  'Next.js', 'NestJS', 'Mastra', 'MCP', 'Postgres',
  'Claude Code', 'Claude Design', 'CopilotKit AG-UI',
  'React Native', 'Expo',
] as const;

// Normalize tags/labels so "Next.js" matches "Nextjs", "Nest js" matches "NestJS", etc.
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const AutomationPage = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [query, setQuery] = useState('');

  const headerRef = useScrollReveal();
  const filterRef = useScrollReveal();
  const gridRef = useScrollRevealStagger<HTMLDivElement>(80);
  const gridRevealedRef = useRef(false);

  // Mark once the grid has been scroll-revealed for the first time
  useEffect(() => {
    const container = gridRef.current;
    if (!container) return;
    const mo = new MutationObserver(() => {
      if (Array.from(container.children).some((c) => c.classList.contains('is-visible'))) {
        gridRevealedRef.current = true;
      }
    });
    mo.observe(container, { subtree: true, attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);

  // Re-reveal cards after filter/search changes (stagger hook disconnects after first fire)
  useEffect(() => {
    if (!gridRevealedRef.current) return;
    const container = gridRef.current;
    if (!container) return;
    Array.from(container.children).forEach((child, i) => {
      (child as HTMLElement).classList.remove('is-visible');
      setTimeout(() => (child as HTMLElement).classList.add('is-visible'), i * 80);
    });
  }, [activeFilter, query]);

  // Unified card list — case studies first (flagship builds lead), then product cards.
  // Each card carries a tag set (for filtering) and a lowercase search haystack.
  const allCards = useMemo(() => {
    const AUTOMATION_TOOLS = ['n8n', 'Zapier', 'Make'];
    const caseStudies = AUTOMATION_PROJECTS.map((project) => ({
      kind: 'automation' as const,
      project,
      tags: project.tags ?? [project.tool],
      haystack: `${project.name} ${project.short} ${project.tool} ${(project.tags ?? []).join(' ')}`.toLowerCase(),
    }));
    const products = PRODUCT_PROJECTS.map((product) => ({
      kind: 'product' as const,
      product,
      tags: product.technologies,
      haystack: `${product.title} ${product.description} ${product.technologies.join(' ')}`.toLowerCase(),
    }));
    // Framework/product work (Next.js, NestJS, Bubble.io, mobile) leads; automation
    // workflows (n8n / Zapier / Make) go last.
    const flagship = caseStudies.filter((c) => !AUTOMATION_TOOLS.includes(c.project.tool));
    const automations = caseStudies.filter((c) => AUTOMATION_TOOLS.includes(c.project.tool));
    return [...flagship, ...products, ...automations];
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: allCards.length };
    for (const f of FILTERS) {
      if (f === 'All') continue;
      const nf = norm(f);
      c[f] = allCards.filter((card) => card.tags.some((t) => norm(t) === nf)).length;
    }
    return c;
  }, [allCards]);

  const q = query.toLowerCase();
  const activeNorm = norm(activeFilter);
  const displayCards = allCards.filter((card) => {
    if (activeFilter !== 'All' && !card.tags.some((t) => norm(t) === activeNorm)) return false;
    if (!query) return true;
    return card.haystack.includes(q);
  });

  const totalCount = allCards.length;

  return (
    <div className="min-h-screen relative">
      <StarField />
      <div className="fixed inset-0 bg-background/80 pointer-events-none -z-[5]" />
      <Navbar />

      <main>
        <div className="container mx-auto px-4 pt-32 pb-32 max-w-5xl">

          {/* Header */}
          <div ref={headerRef} className="text-center mb-16 reveal reveal-up">
            <div className="inline-flex items-center gap-2 border border-primary/35 rounded-full px-4 py-1.5 mb-6 text-xs font-mono tracking-widest text-primary">
              <span className="auto-live-dot" />
              <span>{'>_'}</span>
              <span>PORTFOLIO.LOG</span>
            </div>
            <p className="text-xs font-mono text-primary/60 tracking-[0.3em] uppercase mb-3">
              // workflows
            </p>
            <h1 className="text-5xl md:text-7xl font-bold font-mono mb-4 terminal-text tracking-tight leading-none">
              Selected <span className="text-foreground/70">Work</span>
            </h1>
            <p className="text-muted-foreground font-mono text-sm max-w-xl mx-auto leading-relaxed">
              Products and automation pipelines I've shipped — full web platforms
              built on Bubble, Next.js and NestJS, plus Zapier and n8n
              integrations, AI content generation, and QA workflows.
            </p>
          </div>

          {/* Filter bar */}
          <div ref={filterRef} className="reveal reveal-up mb-10">
            <div className="flex items-center justify-between flex-wrap gap-4 border border-border/30 bg-card/60 backdrop-blur rounded-lg px-5 py-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground/50">
                  filter ::
                </span>
                <div className="flex flex-wrap gap-2">
                  {FILTERS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveFilter(t)}
                      className={`font-mono text-xs px-3 py-1.5 rounded border transition-all duration-200 inline-flex items-center gap-2 ${
                        activeFilter === t
                          ? 'border-primary/70 bg-primary/8 text-primary'
                          : 'border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      }`}
                    >
                      <span>{t === 'All' ? 'all' : t}</span>
                      <span className="text-muted-foreground/50 text-[11px]">[{counts[t] ?? 0}]</span>
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="$ grep ..."
                className="bg-background border border-border/40 text-foreground placeholder-muted-foreground/40 text-xs font-mono px-3 py-1.5 rounded focus:outline-none focus:border-primary/60 w-48 transition-colors"
              />
            </div>
          </div>

          {/* Grid */}
          {displayCards.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border/30 rounded-lg">
              <div className="font-mono text-muted-foreground/60 text-sm">// no projects matched</div>
              <div className="font-mono text-muted-foreground/40 text-xs mt-1">try a different filter or search term</div>
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {displayCards.map((card, idx) => {
                const num = String(idx + 1).padStart(2, '0');

                // Product build — links out to the live site (no detail page).
                if (card.kind === 'product') {
                  const prod = card.product;
                  return (
                    <a
                      href={prod.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={`product-${prod.title}`}
                      className="auto-card portal-glow bg-card/60 backdrop-blur border border-border/30 rounded-lg p-7 flex flex-col group relative overflow-hidden reveal reveal-up transition-all duration-200 hover:border-primary/40 hover:bg-card/80"
                    >
                      {/* Top border gradient on hover */}
                      <span className="auto-card-top-line" aria-hidden="true" />

                      <div className="flex items-start justify-between mb-5">
                        <span className="font-mono text-3xl font-bold text-primary/15 leading-none select-none">
                          {num}
                        </span>
                        <svg
                          width="20" height="20" viewBox="0 0 20 20" fill="none"
                          className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                        >
                          <path d="M6 14 L14 6 M9 6 L14 6 L14 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>

                      <h3 className="font-mono font-semibold text-primary text-lg mb-1 group-hover:text-primary transition-colors leading-tight">
                        {prod.title}
                      </h3>

                      <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                        {prod.description}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        {prod.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center border border-secondary/25 bg-secondary/10 rounded px-2 py-0.5 text-xs font-mono text-secondary/80"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </a>
                  );
                }

                // Automation case study — internal detail page.
                const p = card.project;
                return (
                  <Link
                    to={`/portfolio/${p.id}`}
                    key={p.id}
                    className="auto-card portal-glow bg-card/60 backdrop-blur border border-border/30 rounded-lg p-7 flex flex-col group relative overflow-hidden reveal reveal-up transition-all duration-200 hover:border-primary/40 hover:bg-card/80"
                  >
                    {/* Top border gradient on hover */}
                    <span className="auto-card-top-line" aria-hidden="true" />

                    <div className="flex items-start justify-between mb-5">
                      <span className="font-mono text-3xl font-bold text-primary/15 leading-none select-none">
                        {num}
                      </span>
                      <svg
                        width="20" height="20" viewBox="0 0 20 20" fill="none"
                        className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <path d="M6 14 L14 6 M9 6 L14 6 L14 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>

                    <h3 className="font-mono font-semibold text-primary text-lg mb-1 group-hover:text-primary transition-colors leading-tight">
                      {p.name}
                    </h3>

                    <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                      {p.short}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="inline-flex items-center gap-1.5 border border-border/40 rounded px-2 py-0.5 text-xs font-mono"
                        style={{ color: TOOL_META[p.tool]?.color ?? 'hsl(var(--primary))' }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: TOOL_META[p.tool]?.color ?? 'hsl(var(--primary))' }}
                        />
                        {p.tool}
                      </span>
                      <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs text-secondary/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" style={{ boxShadow: '0 0 5px hsl(var(--secondary))' }} />
                        {p.status}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-16 pt-6 border-t border-border/20 flex justify-between font-mono text-xs text-muted-foreground/40 tracking-widest">
            <span>{'>_'} TONY.351 :: portfolio.log</span>
            <span>// {displayCards.length} of {totalCount} projects</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AutomationPage;
