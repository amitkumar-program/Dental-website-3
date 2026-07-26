import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { PageLayout } from '../components/PageLayout';
import { PageHero } from '../components/PageHero';
import { Services } from '../components/sections/Services';
import { Insurance } from '../components/sections/Insurance';

export default function ServicesPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="What We Offer"
        title="Everything Your"
        titleAccent="Smile Needs."
        subtitle="From routine preventive care to full cosmetic transformations — we provide comprehensive dentistry for patients of every age and every need."
      />
      <Services />
      <Insurance />

      {/* CTA */}
      <section className="py-20 bg-white border-t border-border">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
              Not sure which service is right for you?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Book a consultation and our team will guide you to the best treatment plan for your smile.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
            >
              Book a Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
