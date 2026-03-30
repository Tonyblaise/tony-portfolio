import { useState, useEffect } from 'react';
import { Terminal, ArrowDown } from 'lucide-react';
import heroImage from '@/assets/hero-space-terminal.jpg';

export const TerminalHero = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = '> > Tony· Full-stack Developer & Bubble.io Specialist';

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [fullText]);

  return (
		<section className='relative min-h-screen flex items-center justify-center overflow-hidden pt-16'>
			{/* Background image */}
			<div
				className='absolute inset-0 bg-cover bg-center opacity-20'
				style={{ backgroundImage: `url(${heroImage})` }}
			/>

			{/* Overlays */}
			<div className='absolute inset-0 bg-background/70' />
			<div className='absolute inset-0 bg-background/40' />

			<div className='container relative z-10 mx-auto px-4 text-center'>
				{/* Status badge */}
				<div
					className='inline-flex items-center gap-2 mb-8 px-4 py-2 border border-primary/30 rounded-full bg-primary/5 backdrop-blur animate-slide-up'
					style={{ animationDelay: '0ms' }}>
					<span className='w-2 h-2 rounded-full bg-secondary animate-pulse' />
					<Terminal className='w-3.5 h-3.5 text-primary' />
					<span className='text-xs terminal-text font-mono tracking-widest'>
						SYSTEM ONLINE
					</span>
				</div>

				{/* Main heading */}
				<h1
					className='text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight tracking-tight font-mono animate-slide-up'
					style={{ animationDelay: '150ms' }}>
					<span className='text-primary'>NO-CODE & FULLSTACK</span>
					<br />
					<span className='text-foreground/90'>ENGINEER</span>
				</h1>

				{/* Typing line */}
				<div
					className='max-w-2xl mx-auto mb-10 animate-slide-up'
					style={{ animationDelay: '300ms' }}>
					<p className='text-base md:text-lg text-muted-foreground font-mono mb-3 min-h-[1.75rem]'>
						{displayText}
						<span className='cursor inline-block w-2 h-5 bg-primary ml-0.5 align-middle' />
					</p>
					<p className='text-sm text-muted-foreground/70 font-sans tracking-wide'>
						7+ years building across the stack — Bubble.io · React · Next.js ·
						TypeScript · Bubble.io · Node.js · Cloudflare Workers
					</p>
				</div>

				{/* CTAs */}
				<div
					className='flex gap-4 justify-center flex-wrap animate-slide-up'
					style={{ animationDelay: '450ms' }}>
					<a
						href='#journey'
						className='px-7 py-3 font-mono font-semibold text-sm rounded bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300'>
						View My Work
					</a>
					<a
						href='#contact'
						className='px-7 py-3 border border-primary/40 text-primary rounded font-mono font-semibold text-sm hover:bg-primary/10 hover:border-primary/70 transition-all duration-300'>
						Get In Touch
					</a>
				</div>
			</div>

			{/* Scroll indicator */}
			<div className='absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-float opacity-60'>
				<span className='font-mono text-xs text-muted-foreground tracking-widest'>
					SCROLL
				</span>
				<ArrowDown className='w-4 h-4 text-primary' />
			</div>
		</section>
	);
};
