import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { PageLayout } from '../components/PageLayout';
import { PageHero } from '../components/PageHero';
import { Gallery } from '../components/sections/Gallery';

export default function GalleryPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Before & After"
        title="Real Smiles,"
        titleAccent="Real Results."
        subtitle="Every smile in our gallery belongs to a real Brightline patient. These transformations speak for themselves — see the difference modern, thoughtful dentistry makes."
      />
      <Gallery />

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
              Ready to start your own transformation?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Your before & after could be next. Book a consultation and let's talk about your smile goals.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
            >
              Book Your Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
