import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { PageLayout } from '../components/PageLayout';
import { PageHero } from '../components/PageHero';
import { Testimonials } from '../components/sections/Testimonials';

export default function TestimonialsPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Patient Stories"
        title="What Our"
        titleAccent="Patients Say."
        subtitle="Don't just take our word for it. Hear from the hundreds of families who trust Brightline Dental Studio with their smiles every day."
      />
      <Testimonials />

      {/* Rating summary strip */}
      <section className="py-16 bg-white border-t border-b border-border">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { value: '4.9 / 5', label: 'Average Rating', sub: 'across all platforms' },
              { value: '500+',    label: 'Five-Star Reviews', sub: 'and counting' },
              { value: '98%',     label: 'Patient Satisfaction', sub: 'on post-visit surveys' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="text-4xl font-serif text-primary font-semibold mb-1">{stat.value}</p>
                <p className="font-medium text-foreground">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
              Experience it for yourself.
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join our growing family of happy patients. Book your first visit today — new patients are always welcome.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
            >
              Book an Appointment <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
