
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import interiorImg from '@/assets/images/clinic_interior.jpg';

const FALLBACK_INTERIOR = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop';

export function About() {
  const [imgSrc, setImgSrc] = useState(interiorImg);
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-8">
              Care That Goes <br className="hidden md:block"/>
              <span className="text-primary italic">Beyond the Chair.</span>
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground mb-10">
              <p>
                We believe that a visit to the dentist shouldn't be something you dread. At Brightline Dental Studio, we've completely reimagined the dental experience to be warm, human, and deeply reassuring.
              </p>
              <p>
                From the moment you walk through our doors, you'll notice the difference. No clinical smells, no harsh lighting, and no rushed appointments. Just exceptional care delivered with a genuinely gentle touch.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 bg-secondary/50 p-8 rounded-2xl border border-secondary">
              <div>
                <div className="flex items-center gap-2 text-primary font-medium mb-2">
                  <MapPin className="w-5 h-5" />
                  <h3>Location</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  214 Maple Grove Avenue<br />
                  Suite 3B<br />
                  Ashford Heights
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-primary font-medium mb-2">
                  <Clock className="w-5 h-5" />
                  <h3>Hours</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Mon–Fri: 8:00 AM – 6:00 PM<br />
                  Sat: 9:00 AM – 2:00 PM<br />
                  Sun: Closed
                </p>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-secondary rounded-[2.5rem] -z-10 transform rotate-3 scale-105" />
            <div className="absolute -inset-4 bg-primary/10 rounded-[2.5rem] -z-10 transform -rotate-2 scale-105" />
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white aspect-[4/5] lg:aspect-square">
              {/* Note: In a real app this would use the generated image, but since Vite needs to bundle it,
                  and we generated it dynamically, we use an img tag with the imported path. */}
              <img 
                src={imgSrc} 
                onError={() => setImgSrc(FALLBACK_INTERIOR)}
                alt="Brightline Dental Studio Interior" 
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
              />
              
              {/* Decorative overlay */}
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl" />
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
