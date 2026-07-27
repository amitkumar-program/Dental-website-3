import { useState, useEffect } from "react";

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

import beforeAfter1 from '@/assets/images/before_after_1.jpg';
import beforeAfter2 from '@/assets/images/before_after_2.jpg';

// In a real app we'd have 4 distinct images, here we'll reuse the two generated ones
// to demonstrate the carousel functionality
const gallery = [
  {
    id: 1,
    image: beforeAfter1,
    title: "Cosmetic Veneers",
  },
  {
    id: 2,
    image: beforeAfter2,
    title: "Professional Whitening",
  },
  {
    id: 3,
    image: beforeAfter1,
    title: "Invisalign Treatment",
  },
  {
    id: 4,
    image: beforeAfter2,
    title: "Dental Implants",
  }
];

const FALLBACK_GALLERY = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop';

// Reusable Image Slider Component for Before/After
// (Note: The prompt generated a single image containing both before/after for each, 
// so we will display them cleanly rather than building an interactive divider 
// which requires two separate images)
function GalleryCard({ item }: { item: typeof gallery[0] }) {
  const [imgSrc, setImgSrc] = useState(item.image);
  return (
    <div className="relative group rounded-3xl overflow-hidden bg-white border border-border/50 shadow-sm">
      <div className="aspect-[4/3] relative overflow-hidden bg-secondary">
        <img 
          src={imgSrc} 
          onError={() => setImgSrc(FALLBACK_GALLERY)}
          alt={item.title} 
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        {/* We assume the AI image generated a side-by-side. 
            If we had separate before/after, we'd use a clip-path slider here. */}
      </div>
      <div className="p-6 bg-white relative z-10">
        <h3 className="text-lg font-serif font-medium text-foreground">{item.title}</h3>
      </div>
    </div>
  );
}

export function Gallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    loop: false,
    dragFree: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setPrevBtnEnabled(emblaApi.canScrollPrev());
      setNextBtnEnabled(emblaApi.canScrollNext());
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section id="gallery" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              Real Smiles, <span className="text-primary italic">Real Results</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              See the difference modern, thoughtful dentistry can make.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-4"
          >
            <button 
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              className={`w-12 h-12 rounded-full border border-border flex items-center justify-center transition-all
                ${prevBtnEnabled ? 'hover:bg-secondary hover:border-primary/30 text-foreground cursor-pointer' : 'opacity-50 cursor-not-allowed text-muted-foreground'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              className={`w-12 h-12 rounded-full border border-border flex items-center justify-center transition-all
                ${nextBtnEnabled ? 'hover:bg-secondary hover:border-primary/30 text-foreground cursor-pointer' : 'opacity-50 cursor-not-allowed text-muted-foreground'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Carousel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="embla overflow-hidden -mx-6 px-6" 
          ref={emblaRef}
        >
          <div className="embla__container flex">
            {gallery.map((item) => (
              <div 
                key={item.id} 
                className="embla__slide flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_35%] min-w-0 pr-6"
              >
                <GalleryCard item={item} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
