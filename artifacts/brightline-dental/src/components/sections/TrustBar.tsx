import { useState, useEffect, useRef } from "react";

import { motion, useInView } from 'framer-motion';

const stats = [
  { label: 'Smiles Transformed', value: 2400, prefix: '', suffix: '+' },
  { label: 'Years of Excellence', value: 15, prefix: '', suffix: '' },
  { label: 'Board-Certified Dentists', value: 3, prefix: '', suffix: '' },
  { label: 'Patient Satisfaction', value: 98, prefix: '', suffix: '%' },
];

function Counter({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      // let start = 0;
      const end = value;
      // Duration varies slightly based on the number magnitude
      const duration = 2000; 
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function (easeOutQuart)
        const ease = 1 - Math.pow(1 - progress, 4);
        
        setCount(Math.floor(ease * end));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [isInView, value]);

  // Format large numbers with commas
  const formattedCount = count.toLocaleString('en-US');

  return (
    <span ref={ref} className="font-serif text-4xl md:text-5xl font-medium text-primary mb-2 block">
      {prefix}{formattedCount}{suffix}
    </span>
  );
}

export function TrustBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-white py-16 border-b border-border">
      <div className="container mx-auto px-6 max-w-7xl" ref={ref}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-x-0 md:divide-x divide-border">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center px-4"
            >
              <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
