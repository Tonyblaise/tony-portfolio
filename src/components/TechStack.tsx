import { Card } from './ui/card';
import anchorLogo from '@/assets/anchor-logo.png';
import cosmwasmLogo from '@/assets/cosmwasm-logo.png';
import { useScrollReveal, useScrollRevealStagger } from '@/hooks/use-scroll-reveal';

const technologies = [
	{
		name: 'Bubble',
		category: 'Framework',
		logo: 'https://49291ba917ced6f25ff01e5cc5b9a691.cdn.bubble.io/f1756152387519x955902626765069400/Logo%20%281%29.svg',
		color: 'hsl(210 55% 55%)',
		description: 'Visual no code platform',
	},
	{
		name: 'N8N',
		category: 'Framework',
		logo: 'https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/integration_10_97876f19e6.svg',
		color: 'hsl(344 79% 61%)',
		description: 'Workflow automation platform',
	},
	{
		name: 'Next.js',
		category: 'Frontend',
		logo: 'https://cdn.simpleicons.org/nextdotjs/000000',
		color: 'hsl(0 0% 80%)',
		description: 'React framework',
	},

	{
		name: 'TypeScript',
		category: 'Language',
		logo: 'https://cdn.simpleicons.org/typescript/3178C6',
		color: 'hsl(211 60% 48%)',
		description: 'Type-safe development',
	},

	{
		name: 'Node.js',
		category: 'Backend',
		logo: 'https://cdn.simpleicons.org/nodedotjs/339933',
		color: 'hsl(142 71% 45%)',
		description: 'JavaScript runtime',
	},
	{
		name: 'Postgres',
		category: 'Database',
		logo: 'https://cdn.simpleicons.org/postgresql/4169E1',
		color: 'hsl(220 80% 50%)',
		description: 'Reliable data storage',
	},

	{
		name: 'Redis',
		category: 'Database',
		logo: 'https://cdn.simpleicons.org/redis/DC382D',
		color: 'hsl(6 80% 52%)',
		description: 'In-memory data store',
	},

	{
		name: 'Nest.js',
		category: 'Backend',
		logo: 'https://cdn.simpleicons.org/nestjs/E0234E',
		color: 'hsl(340 83% 47%)',
		description: 'Progressive Node.js framework',
	},
];

export const TechStack = () => {
  const headingRef = useScrollReveal();
  const gridRef = useScrollRevealStagger<HTMLDivElement>(70);

  return (
    <section id="tech" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div ref={headingRef} className="text-center mb-16 reveal reveal-up">
          <p className="text-xs font-mono text-primary/60 tracking-[0.3em] uppercase mb-3">Arsenal</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 terminal-text font-mono">
            Tech Stack
          </h2>
          <p className="text-muted-foreground font-sans text-sm">
            Technologies I've mastered across frontend and backend
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {technologies.map((tech) => (
            <Card
              key={tech.name}
              className="portal-glow bg-card/60 backdrop-blur border-border/50 overflow-hidden group cursor-pointer reveal reveal-up"
            >
              {/* Colored top accent */}
              <div
                className="h-0.5 w-full"
                style={{ backgroundColor: tech.color }}
              />

              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-background/80 transition-transform group-hover:scale-110"
                  >
                    <img
                      src={typeof tech.logo === 'string' ? tech.logo : tech.logo}
                      alt={`${tech.name} logo`}
                      className="w-6 h-6 object-contain"
                      style={{
                        filter:
                          tech.name === 'Next.js' || tech.name === 'Rust'
                            ? 'invert(1) brightness(2)'
                            : 'none',
                      }}
                    />
                  </div>

                  {/* Category badge */}
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                    style={{
                      color: tech.color,
                      borderColor: `${tech.color}40`,
                      backgroundColor: `${tech.color}10`,
                    }}
                  >
                    {tech.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-1 font-mono text-foreground group-hover:text-primary transition-colors">
                  {tech.name}
                </h3>
                <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                  {tech.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
