import { Card } from './ui/card';
import { MapPin, ExternalLink } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

interface Experience {
  year: string;
  role: string;
  company: string;
  companyUrl: string;
  location: string;
  description: string;
  technologies: string[];
}

const experiences: Experience[] = [
	{
		year: 'Jun 2025 – Present',
		role: 'Software Engineer',
		company: 'ProLine',
		companyUrl: 'https://useproline.com/',
		location: 'Remote',
		description:
			'Building and maintaining software solutions at ProLine, contributing to full-stack development across web platforms.',
		technologies: ['React', 'Next.js', 'Bubble.io', 'Node.js'],
	},
	{
		year: 'Feb 2022 – May 2025',
		role: 'Senior Bubble Developer & React Engineer',
		company: 'MORTGAGEBLOC',
		companyUrl: 'https://mortgagebloc.com',
		location: 'Greater London',
		description:
			'Led development of mortgage industry web applications using Bubble.io and React/Next.js. Delivered scalable no-code and custom-code solutions for complex financial workflows over a 3+ year engagement.',
		technologies: ['React', 'Next.js', 'Bubble.io', 'TypeScript'],
	},
	{
		year: 'Jul 2022 – Feb 2023',
		role: 'Senior Bubble Developer & Plugin Developer',
		company: 'Goodspeed Studio',
		companyUrl: 'https://goodspeed.studio',
		location: 'United Kingdom',
		description:
			'Built custom Bubble.io applications and developed proprietary Bubble plugins, extending platform capabilities for client projects.',
		technologies: ['Bubble.io', 'JavaScript', 'React', 'REST APIs'],
	},
	{
		year: 'Sep 2020 – Jun 2022',
		role: 'Senior Bubble Developer',
		company: 'InnoVetted',
		companyUrl: 'https://www.linkedin.com/company/innovetted/',
		location: 'Texas, US',
		description:
			'Designed and developed web applications on Bubble.io for clients across various industries, delivering tailored no-code solutions for business automation and data management.',
		technologies: ['Bubble.io', 'Airtable', 'JavaScript', 'REST APIs'],
	},
	{
		year: 'Oct 2020 – Feb 2022',
		role: 'Web Bubble Developer',
		company: 'Onyx Ocean Technologies',
		companyUrl: 'https://onyxocean.com',
		location: 'Greensboro, NC',
		description:
			'Developed programs from the ground up using Bubble.io, delivering full web applications tailored to client specifications.',
		technologies: ['Bubble.io', 'JavaScript', 'REST APIs'],
	},
	{
		year: 'Oct 2018 – Jun 2022',
		role: 'Freelance Bubble Developer',
		company: 'Fiverr',
		companyUrl: 'https://www.fiverr.com/bubba254',
		location: 'Remote',
		description:
			'Delivered Bubble.io web applications to clients worldwide as a top-rated freelancer, building custom solutions for small businesses and startups across a wide range of industries.',
		technologies: ['Bubble.io', 'Airtable', 'FlutterFlow', 'REST APIs'],
	},
];

const locationColors: Record<string, string> = {
  Remote: 'hsl(142 71% 45%)',
  Contract: 'hsl(45 100% 60%)',
  Fellowship: 'hsl(265 100% 65%)',
  'Greater London': 'hsl(220 80% 65%)',
  'United Kingdom': 'hsl(220 80% 65%)',
  'Texas, US': 'hsl(30 90% 60%)',
  'Greensboro, NC': 'hsl(30 90% 60%)',
};

const JourneyItem = ({ exp, index }: { exp: Experience; index: number }) => {
  const cardRef = useScrollReveal();
  const dotRef = useScrollReveal({ threshold: 0.5 });
  const isEven = index % 2 === 0;

  return (
    <div
      className={`relative flex flex-col md:flex-row gap-6 items-start ${
        isEven ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* Timeline dot */}
      <div
        ref={dotRef}
        className="absolute left-8 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary ring-4 ring-background z-10 reveal reveal-scale"
      />

      {/* Card */}
      <div
        ref={cardRef}
        className={`flex-1 ml-16 md:ml-0 ${isEven ? 'md:mr-8' : 'md:ml-8'} reveal ${
          isEven ? 'reveal-right' : 'reveal-left'
        }`}
      >
        <Card className="portal-glow bg-card/60 backdrop-blur border-border/50 p-5">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-xs text-primary/80 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
              {exp.year}
            </span>
            <span
              className="flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded border"
              style={{
                color: locationColors[exp.location] ?? 'hsl(var(--muted-foreground))',
                borderColor: `${locationColors[exp.location] ?? 'hsl(var(--border))'}40`,
                backgroundColor: `${locationColors[exp.location] ?? 'transparent'}15`,
              }}
            >
              <MapPin className="w-3 h-3" />
              {exp.location}
            </span>
          </div>

          <h3 className="text-lg font-bold mb-1 font-mono text-foreground">
            {exp.role}
          </h3>

          <a
            href={exp.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary/80 hover:text-primary transition-colors mb-3 font-mono"
          >
            {exp.company}
            <ExternalLink className="w-3 h-3" />
          </a>

          <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-4">
            {exp.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {exp.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 text-xs bg-primary/8 border border-primary/20 rounded font-mono text-primary/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Spacer */}
      <div className="hidden md:block flex-1" />
    </div>
  );
};

export const Journey = () => {
  const headingRef = useScrollReveal();

  return (
    <section id="journey" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div ref={headingRef} className="text-center mb-16 reveal reveal-up">
          <p className="text-xs font-mono text-primary/60 tracking-[0.3em] uppercase mb-3">Experience</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 terminal-text font-mono">
            Career Timeline
          </h2>
          <p className="text-muted-foreground font-sans text-sm">
            5 years building products across fintech, DeFi, and blockchain infrastructure
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border/60" />

          <div className="space-y-10">
            {experiences.map((exp, index) => (
              <JourneyItem key={index} exp={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

