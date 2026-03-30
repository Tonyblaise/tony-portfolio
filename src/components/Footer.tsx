import { Terminal } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/10 py-10 bg-card/20 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-bold text-primary tracking-widest">
              TONY<span className="text-accent">.254</span>
            </span>
          </div>

          <div className="font-sans text-xs text-muted-foreground/60">
            © {currentYear} Tony Blaise. Built with React & TypeScript.
          </div>

          <div className="font-mono text-xs text-primary/50 tracking-widest">
            [END_OF_TRANSMISSION]
          </div>
        </div>
      </div>
    </footer>
  );
};
