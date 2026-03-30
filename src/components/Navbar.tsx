import { useState, useEffect } from 'react';
import { Terminal, Menu, X } from 'lucide-react';

const links = [
  { label: 'Tech', href: '#tech' },
  { label: 'Journey', href: '#journey' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      const sections = links.map((l) => l.href.replace('#', ''));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection('');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('nav')) setMenuOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-border/40'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a
          href="#"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          <Terminal className="w-4 h-4 text-primary" />
          <span className="font-mono font-bold text-sm tracking-widest text-primary">
            TONY<span className="text-accent">.254</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.href}
                href={link.href}
                className={`font-mono text-sm transition-colors relative pb-0.5 ${
                  isActive
                    ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href="#contact"
            className="font-mono text-sm px-4 py-2 border border-primary/40 text-primary rounded hover:bg-primary/10 hover:border-primary transition-all duration-200"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary p-2 rounded hover:bg-primary/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        } bg-background/95 backdrop-blur-md border-b border-border/40`}
      >
        <div className="px-4 pb-4 pt-1 space-y-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block font-mono text-sm text-muted-foreground hover:text-primary py-2.5 border-b border-border/20 last:border-0 transition-colors"
            >
              {`> ${link.label}`}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="block font-mono text-sm text-primary py-2.5 mt-1"
          >
            {'> Hire Me →'}
          </a>
        </div>
      </div>
    </nav>
  );
};
