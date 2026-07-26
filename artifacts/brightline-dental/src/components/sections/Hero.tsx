import { Link } from 'wouter';
import { motion, Variants } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import heroBg from '@/assets/images/hero-bg.jpg';
import heroVideo from '@/assets/images/Heo-video.mp4';

export function Hero() {
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.12,
        duration: 0.85,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    }),
  };

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-[#0D1117]"
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        poster={heroBg}
      >
        <source src={heroVideo} type="video/mp4" />
        <source src="/Heo-video.mp4" type="video/mp4" />
      </video>
      {/* ── Overlays ───────────────────────────────────────────────── */}
      {/* Dark vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 pointer-events-none" />
      {/* Bottom fade to white for seamless scroll transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
      {/* Subtle primary-colour tint at bottom-left */}
      <div className="absolute bottom-0 left-0 w-[640px] h-[360px] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 max-w-7xl relative z-10 pt-28 pb-32">
        {/* Eyebrow pill */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
          Brightline Dental Studio
        </motion.div>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.05] text-white mb-6 max-w-3xl"
        >
          Your Smile,<br />
          <span className="text-primary italic drop-shadow-lg">Reimagined.</span>
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-lg md:text-xl text-white/75 mb-12 max-w-xl leading-relaxed"
        >
          Modern care, gentle touch. Experience a new standard of dentistry
          designed for your comfort and confidence.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/contact"
            className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-2xl hover:shadow-primary/30 active:scale-95 text-center"
          >
            Book a Visit
          </Link>
          <Link
            href="/about"
            className="bg-white/15 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-full font-medium hover:bg-white/25 transition-all active:scale-95 text-center"
          >
            Meet Our Team
          </Link>
        </motion.div>
      </div>

      {/* ── Scroll cue ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
