import { Card } from './ui/card';
import { ExternalLink } from 'lucide-react';
import { useScrollReveal, useScrollRevealStagger } from '@/hooks/use-scroll-reveal';

const projects = [
	{
		title: 'Proline',
		description:
			'ProLine is a CRM built specifically for roofers — it automates sales follow-ups, quotes, invoicing, and scheduling to help them close more jobs with less admin work.',
		technologies: ['Bubble.io', 'Cloudflare workers'],
		github: 'https://useproline.com/',
	},
	{
		title: 'MortgageBloc V1',
		description:
			'MGB.ai (MortgageBloc) is an AI-powered underwriting automation platform for mortgage lenders. It uses Open Banking and AI to automatically gather and verify applicant financial data, giving underwriters a complete picture of every applicant without manually chasing documents or re-entering data',
		technologies: ['Bubble'],
		github: 'https://www.mgb.ai/',
	},
	{
		title: 'MortgageBloc V2',
		description: 'Rebuilt the mgb platform in Next js',
		technologies: ['Nestjs', 'Nextjs'],
		github: 'https://www.mgb.ai/',
	},
	{
		title: 'Watatu Travel',
		description:
			'Watatu is an adventure travel marketplace connecting travellers and hikers through individual and group experiences. It offers curated tour packages with various destinations, pricing, timelines, and stay options — covering everything from mountain hikes to hotel experiences across global properties.',
		technologies: ['Bubble', 'Airtable'],
		github: 'https://book.watatutravel.com/',
	},
	{
		title: 'Reziliant GRC',
		description:
			'Reziliant GRC is a  fully integrated Governance, Risk and Compliance solution which replaces conventional manual risk and compliance processes with an automated platform.',
		technologies: ['Bubble'],
		github: 'https://reziliant.io/',
	},
	{
		title: 'DonatePlus',
		description:
			'DonatePlus connects donors and schools through campaigns and streamlines content. I built the application using Adalo and the landing page using bubble.',
		technologies: ['Bubble', 'Glide'],
		github: 'https://donateplus.co/',
	},
];

export const Projects = () => {
  const headingRef = useScrollReveal();
  const gridRef = useScrollRevealStagger<HTMLDivElement>(90);

  return (
    <section id="projects" className="py-24 relative bg-muted/10">
      <div className="container mx-auto px-4">
        <div ref={headingRef} className="text-center mb-16 reveal reveal-up">
          <p className="text-xs font-mono text-primary/60 tracking-[0.3em] uppercase mb-3">Work</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 terminal-text font-mono">
            Projects
          </h2>
          <p className="text-muted-foreground font-sans text-sm">
            A selection of systems built across the digital frontier
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <Card
              key={project.title}
              className="portal-glow bg-card/60 backdrop-blur border-border/50 p-6 group flex flex-col reveal reveal-up"
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-4">
                <span className="font-mono text-3xl font-bold text-primary/15 leading-none select-none">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                  aria-label="Open project"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <h3 className="text-base font-bold font-mono text-foreground mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>

              <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-4 flex-1">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-xs bg-secondary/10 border border-secondary/25 rounded font-mono text-secondary/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
