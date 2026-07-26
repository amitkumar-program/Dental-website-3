import { ReactNode } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Navbar } from './sections/Navbar';
import { Footer } from './sections/Footer';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="relative bg-white text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
