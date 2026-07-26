
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "I used to be terrified of the dentist. Dr. Marsh made me feel completely at ease — I actually look forward to my visits now.",
    author: "Sarah T.",
    type: "Cosmetic Patient"
  },
  {
    quote: "Dr. Cole transformed my smile with Invisalign in just 9 months. The results are beyond what I expected.",
    author: "James R.",
    type: "Invisalign Patient"
  },
  {
    quote: "Bringing my kids here is a joy. Dr. Nandan is incredible with children — my son actually asks when we can go back!",
    author: "Maria L.",
    type: "Pediatric Parent"
  },
  {
    quote: "The emergency appointment process was so smooth. They saw me the same day and had me pain-free within an hour.",
    author: "Kevin D.",
    type: "Emergency Patient"
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-secondary/50 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            What Our <span className="text-primary italic">Patients Say</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it. Hear from the people whose smiles we care for every day.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex gap-1 mb-6 text-[#F59E0B]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-current" />
                ))}
              </div>
              
              <p className="text-lg text-foreground font-serif leading-relaxed mb-8">
                "{t.quote}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-medium">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{t.author}</h4>
                  <p className="text-sm text-muted-foreground">{t.type}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
