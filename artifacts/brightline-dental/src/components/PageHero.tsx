import { motion } from 'framer-motion';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
}

export function PageHero({ eyebrow, title, titleAccent, subtitle }: PageHeroProps) {
  return (
    <section className="pt-36 pb-20 bg-secondary/30 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute -right-48 -top-48 w-[600px] h-[600px] rounded-full bg-primary/5 pointer-events-none" />
      <div className="absolute -left-20 bottom-0 w-64 h-64 rounded-full bg-primary/3 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <span className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-4 px-3 py-1 rounded-full bg-primary/10">
            {eyebrow}
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-foreground mt-2 mb-5 leading-tight">
            {title}{' '}
            <span className="text-primary italic">{titleAccent}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
