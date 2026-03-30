import { StarField } from '@/components/StarField';
import { Navbar } from '@/components/Navbar';
import { TerminalHero } from '@/components/TerminalHero';
import { TechStack } from '@/components/TechStack';
import { Journey } from '@/components/Journey';
import { Projects } from '@/components/Projects';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <StarField />
      <Navbar />

      <main>
        <TerminalHero />
        <TechStack />
        <Journey />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
