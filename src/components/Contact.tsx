import { useState } from 'react';
import { Card } from './ui/card';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Mail, Github, Linkedin, Twitter, Send } from 'lucide-react';
import { toast } from 'sonner';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const headingRef = useScrollReveal();
  const formRef = useScrollReveal<HTMLDivElement>();
  const socialRef = useScrollReveal<HTMLDivElement>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('> Message transmitted successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
		<section
			id='contact'
			className='py-24 relative'>
			<div className='container mx-auto px-4 max-w-4xl'>
				<div ref={headingRef} className='text-center mb-16 reveal reveal-up'>
					<p className='text-xs font-mono text-primary/60 tracking-[0.3em] uppercase mb-3'>
						Contact
					</p>
					<h2 className='text-4xl md:text-5xl font-bold mb-4 terminal-text font-mono'>
						Get In Touch
					</h2>
					<p className='text-muted-foreground font-sans text-sm'>
						Open to freelance, contract, and full-time opportunities
					</p>
				</div>

				<div className='grid md:grid-cols-2 gap-8'>
					{/* Contact form */}
					<Card ref={formRef} className='portal-glow bg-card/50 backdrop-blur border-primary/20 p-6 reveal reveal-left'>
						<form
							onSubmit={handleSubmit}
							className='space-y-4'>
							<div>
								<label className='block text-xs font-mono text-primary/70 mb-1.5 tracking-widest uppercase'>
									Name
								</label>
								<Input
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									className='bg-background/50 border-primary/30 font-mono'
									placeholder='Enter your name...'
									required
								/>
							</div>

							<div>
								<label className='block text-xs font-mono text-primary/70 mb-1.5 tracking-widest uppercase'>
									Email
								</label>
								<Input
									type='email'
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									className='bg-background/50 border-primary/30 font-mono'
									placeholder='your.email@domain.com'
									required
								/>
							</div>

							<div>
								<label className='block text-xs font-mono text-primary/70 mb-1.5 tracking-widest uppercase'>
									Message
								</label>
								<Textarea
									value={formData.message}
									onChange={(e) =>
										setFormData({ ...formData, message: e.target.value })
									}
									className='bg-background/50 border-primary/30 font-mono min-h-32'
									placeholder='Transmit your message...'
									required
								/>
							</div>

							<Button
								type='submit'
								className='w-full bg-primary text-primary-foreground hover:opacity-90 hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)] transition-all duration-300 font-mono text-sm'>
								<Send className='w-4 h-4 mr-2' />
								Send Message
							</Button>
						</form>
					</Card>

					{/* Social links */}
					<div ref={socialRef} className='space-y-4 reveal reveal-right'>
						<Card className='portal-glow bg-card/50 backdrop-blur border-primary/20 p-6'>
							<h3 className='text-base font-bold mb-4 font-mono text-foreground'>
								Social Links
							</h3>
							<div className='space-y-3'>
								<a
									href='mailto:tonyblaise790@gmail.com'
									className='flex items-center gap-3 p-3 hover:bg-primary/10 rounded transition-colors group'>
									<Mail className='w-5 h-5 text-primary' />
									<span className='font-mono text-sm group-hover:text-primary transition-colors'>
										tonyblaise790@gmail.com
									</span>
								</a>
								<a
									href='https://github.com/iamtonyblaise'
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center gap-3 p-3 hover:bg-primary/10 rounded transition-colors group'>
									<Github className='w-5 h-5 text-primary' />
									<span className='font-mono text-sm group-hover:text-primary transition-colors'>
										github.com/iamtonyblaise
									</span>
								</a>
								<a
									href='https://www.linkedin.com/in/tonyblaise/'
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center gap-3 p-3 hover:bg-primary/10 rounded transition-colors group'>
									<Linkedin className='w-5 h-5 text-primary' />
									<span className='font-mono text-sm group-hover:text-primary transition-colors'>
										linkedin.com/in/tonyblaise/
									</span>
								</a>
							</div>
						</Card>

						<Card className='portal-glow bg-card/50 backdrop-blur border-primary/20 p-6'>
							<h3 className='text-base font-bold mb-4 font-mono text-foreground'>
								Availability
							</h3>
							<div className='space-y-2 font-mono text-sm'>
								<div className='flex justify-between'>
									<span className='text-muted-foreground'>Response Time:</span>
									<span className='text-primary'>{'<24h'}</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-muted-foreground'>Availability:</span>
									<span className='text-secondary'>99.9%</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-muted-foreground'>Status:</span>
									<span className='text-primary animate-pulse'>● ONLINE</span>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</section>
	);
};
