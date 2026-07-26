import { Link } from 'wouter';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  Stethoscope, Sparkles, Smile, Baby, HeartPulse, Settings2, Wind,
  Users, ImageIcon, MessageSquareQuote, Phone, ArrowRight, Hammer
} from 'lucide-react';

import { Navbar } from '../components/sections/Navbar';
import { Hero } from '../components/sections/Hero';
import { TrustBar } from '../components/sections/TrustBar';
import { Footer } from '../components/sections/Footer';

const exploreCards = [
  {
    href: '/about',
    icon: Users,
    label: 'About Us',
    heading: 'Our Story & Team',
    description: 'Meet the founders and the board-certified dentists who give Brightline its heart.',
    accent: 'Meet the team →',
  },
  {
    href: '/services',
    icon: Stethoscope,
    label: 'Services',
    heading: 'Everything We Offer',
    description: 'From routine cleanings to full smile makeovers — all the care you need under one roof.',
    accent: 'View all services →',
  },
  {
    href: '/construction',
    icon: Hammer,
    label: 'Smile Lab',
    heading: 'Smile Engineering Lab',
    description: 'Explore how we restore teeth using whimsical construction crew analogies and real bio-ceramics.',
    accent: 'Enter the lab →',
  },
  {
    href: '/gallery',
    icon: ImageIcon,
    label: 'Gallery',
    heading: 'Real Smiles, Real Results',
    description: 'Before & after transformations from our actual patients. See the Brightline difference.',
    accent: 'Browse gallery →',
  },
  {
    href: '/testimonials',
    icon: MessageSquareQuote,
    label: 'Testimonials',
    heading: 'What Our Patients Say',
    description: 'Hundreds of families trust us with their smiles. Read their stories.',
    accent: 'Read reviews →',
  },
  {
    href: '/contact',
    icon: Phone,
    label: 'Contact',
    heading: 'Book an Appointment',
    description: 'Ready to get started? Request your visit online — it only takes two minutes.',
    accent: 'Get in touch →',
  },
];

const featuredServices = [
  { icon: Sparkles, title: 'Cosmetic Dentistry', desc: 'Whitening, veneers & smile makeovers.' },
  { icon: Smile,    title: 'Invisalign',         desc: 'Discreet aligners, stunning results.'  },
  { icon: Baby,     title: 'Pediatric Care',      desc: 'Gentle care for young smiles.'         },
  { icon: HeartPulse, title: 'Emergency Visits', desc: 'Same-day care when you need it.'       },
  { icon: Settings2,  title: 'Dental Implants',  desc: 'Permanent, natural-looking replacements.' },
  { icon: Wind,       title: 'Sedation Dentistry', desc: 'Calm, stress-free appointments.'     },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="relative bg-white text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />

      <Navbar />

      <main>
        <Hero />
        <TrustBar />

        {/* ── Explore Hub ─────────────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto mb-14"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                Discover <span className="text-primary italic">Brightline</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about our clinic, our people, and our care.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exploreCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.href}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    whileHover={{
                      y: -14,
                      scale: 1.03,
                      boxShadow: '0 28px 56px -12px rgba(0,0,161,0.18)',
                      transition: { type: 'spring', stiffness: 420, damping: 18 },
                    }}
                    className="cursor-pointer"
                  >
                    <Link href={card.href} className="block group h-full">
                      <div className="bg-white border border-border rounded-3xl p-8 h-full group-hover:border-primary/30 transition-colors duration-200">
                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-primary uppercase tracking-widest">{card.label}</span>
                        <h3 className="text-xl font-serif text-foreground mt-1 mb-3">{card.heading}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">{card.description}</p>
                        <span className="text-primary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          {card.accent}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Services Preview Strip ───────────────────────────────────── */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-2">
                  Our <span className="text-primary italic">Services</span>
                </h2>
                <p className="text-muted-foreground">Comprehensive dental care for the whole family.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all"
                >
                  View all services <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredServices.map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <motion.div
                    key={svc.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.07 }}
                    whileHover={{
                      y: -8,
                      scale: 1.04,
                      boxShadow: '0 20px 40px -10px rgba(0,0,161,0.14)',
                      transition: { type: 'spring', stiffness: 450, damping: 20 },
                    }}
                    className="cursor-pointer"
                  >
                    <Link href="/services" className="block group">
                      <div className="bg-white rounded-2xl p-6 border border-border group-hover:border-primary/30 transition-colors duration-200 flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-1 font-serif">{svc.title}</h3>
                          <p className="text-sm text-muted-foreground">{svc.desc}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────────────────── */}
        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.5) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 40%)'
          }} />
          <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
                Ready for Your Best Smile?
              </h2>
              <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
                New patients are always welcome. Book your first visit today and experience the Brightline difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-white text-primary px-8 py-4 rounded-full font-medium hover:bg-white/90 transition-all hover:shadow-xl active:scale-95 text-center"
                >
                  Book an Appointment
                </Link>
                <Link
                  href="/about"
                  className="border border-white/40 text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-all active:scale-95 text-center"
                >
                  Meet Our Team
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
