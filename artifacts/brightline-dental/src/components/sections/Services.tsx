
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Sparkles, 
  Smile, 
  Baby, 
  HeartPulse, 
  Settings2,
  Wind
} from 'lucide-react';

const services = [
  {
    title: "General Checkups & Cleanings",
    description: "Preventive care to keep your smile healthy year-round.",
    icon: Stethoscope,
  },
  {
    title: "Cosmetic Dentistry",
    description: "Whitening, veneers, and smile makeovers tailored to you.",
    icon: Sparkles,
  },
  {
    title: "Invisalign & Aligners",
    description: "Straight teeth without the brackets — discreet and effective.",
    icon: Smile,
  },
  {
    title: "Pediatric Dental Care",
    description: "Gentle, fun care designed specifically for young smiles.",
    icon: Baby,
  },
  {
    title: "Emergency Dental Visits",
    description: "Same-day care when you need it most. We're here for you.",
    icon: HeartPulse,
  },
  {
    title: "Dental Implants",
    description: "Permanent, natural-looking tooth replacements that last.",
    icon: Settings2,
  },
  {
    title: "Sedation Dentistry",
    description: "Stress-free, comfortable dental care for anxious patients.",
    icon: Wind,
  }
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            Everything Your <span className="text-primary italic">Smile Needs</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From routine maintenance to complete makeovers, we offer comprehensive care under one roof.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            // Make the last item span 2 cols on tablet, 3 on desktop if needed to center,
            // or just let it sit in the grid normally.
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                // Perspective container for 3D tilt
                className="group [perspective:1000px]"
              >
                <div 
                  className="bg-white rounded-3xl p-8 h-full border border-border shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,161,0.15)] group-hover:border-primary/30"
                  // Subtle 3D tilt on hover via CSS transform (simplified version, real 3d tilt requires JS tracking mouse, 
                  // but we'll use a clean CSS upward lift + shadow for elegance)
                >
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white text-primary transition-colors duration-300 group-hover:scale-110">
                    <Icon className="w-6 h-6 transition-transform" />
                  </div>
                  
                  <h3 className="text-xl font-medium text-foreground mb-3 font-serif">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
