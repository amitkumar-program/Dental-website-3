import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, X, Maximize2, Sparkles, Video, Image as ImageIcon } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

import beforeAfter1 from '@/assets/images/before_after_1.jpg';
import beforeAfter2 from '@/assets/images/before_after_2.jpg';
import clinicInterior from '@/assets/images/clinic_interior.jpg';
import smileLab from '@/assets/images/smile_lab_interior.jpg';
import facility1 from '@/assets/images/clinic_facility_1.jpg';
import facility2 from '@/assets/images/clinic_facility_2.jpg';
import clinicScreenshot from '@/assets/images/clinic_screenshot.jpg';
import heroVideo from '@/assets/images/hero-video.mp4';
import heroBg from '@/assets/images/hero-bg.jpg';

export interface GalleryItem {
  id: string | number;
  type: 'image' | 'video';
  category: 'before_after' | 'clinic' | 'video';
  image?: string;
  publicFilename?: string;
  videoUrl?: string;
  title: string;
  description: string;
  tag?: string;
}

const galleryData: GalleryItem[] = [
  {
    id: 'video-tour',
    type: 'video',
    category: 'video',
    videoUrl: heroVideo,
    image: heroBg,
    publicFilename: 'hero-bg.jpg',
    title: "Brightline Dental Studio - Video Tour",
    description: "Take a 3D virtual look inside our modern studio, state-of-the-art operatory suites, and gentle patient lounge.",
    tag: "Studio Tour"
  },
  {
    id: 1,
    type: 'image',
    category: 'before_after',
    image: beforeAfter1,
    publicFilename: 'before_after_1.jpg',
    title: "Cosmetic Veneers Transformation",
    description: "Custom porcelain veneers crafted to complement natural facial symmetry and achieve a radiant, natural smile.",
    tag: "Cosmetic Dentistry"
  },
  {
    id: 2,
    type: 'image',
    category: 'before_after',
    image: beforeAfter2,
    publicFilename: 'before_after_2.jpg',
    title: "Professional Whitening & Alignment",
    description: "In-office laser whitening paired with subtle alignment therapy for bright, evenly spaced teeth.",
    tag: "Whitening & Aligners"
  },
  {
    id: 3,
    type: 'image',
    category: 'clinic',
    image: clinicInterior,
    publicFilename: 'clinic_interior.jpg',
    title: "Ergonomic Treatment Operatory",
    description: "Designed for ultimate patient relaxation with ceiling monitors, noise-canceling headsets, and ambient lighting.",
    tag: "Studio Interior"
  },
  {
    id: 4,
    type: 'image',
    category: 'clinic',
    image: smileLab,
    publicFilename: 'smile_lab_interior.jpg',
    title: "3D Digital Smile Design Lab",
    description: "On-site CAD/CAM milling and digital intraoral scanners for same-day crowns and precision treatment planning.",
    tag: "Digital Tech"
  },
  {
    id: 5,
    type: 'image',
    category: 'clinic',
    image: facility1,
    publicFilename: 'clinic_facility_1.jpg',
    title: "Modern Clinical Care Center",
    description: "Equipped with advanced air purification, low-radiation digital X-rays, and sterile processing centers.",
    tag: "Facility"
  },
  {
    id: 6,
    type: 'image',
    category: 'clinic',
    image: facility2,
    publicFilename: 'clinic_facility_2.jpg',
    title: "Warm Patient Reception Lounge",
    description: "A calming environment with complimentary beverages, quiet seating, and friendly concierge reception.",
    tag: "Lounge"
  },
  {
    id: 7,
    type: 'image',
    category: 'clinic',
    image: clinicScreenshot,
    publicFilename: 'clinic_screenshot.jpg',
    title: "Comprehensive Oral Health Suite",
    description: "High-definition intraoral cameras allow patients to see exactly what the doctor sees in real time.",
    tag: "Diagnostics"
  }
];

function GalleryCard({ item, onSelect }: { item: GalleryItem; onSelect: (item: GalleryItem) => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div 
      onClick={() => onSelect(item)}
      className="relative group rounded-3xl overflow-hidden bg-white border border-border/60 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      <div className="aspect-[16/10] relative overflow-hidden bg-slate-900">
        {item.type === 'video' ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={item.videoUrl}
              poster={item.image}
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                title={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white translate-x-0.5" />}
              </button>
            </div>
          </div>
        ) : (
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* Tag badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium">
          {item.type === 'video' ? <Video className="w-3 h-3 text-primary" /> : <ImageIcon className="w-3 h-3 text-primary" />}
          {item.tag || (item.category === 'before_after' ? 'Before & After' : 'Studio')}
        </div>

        <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/80 backdrop-blur-md text-foreground">
          <Maximize2 className="w-4 h-4" />
        </div>
      </div>

      <div className="p-6 bg-white flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-serif font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Gallery() {
  const [activeTab, setActiveTab] = useState<'all' | 'before_after' | 'clinic' | 'video'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = galleryData.filter(item => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

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
  }, [emblaApi, filteredItems]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section id="gallery" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Media Gallery
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              Real Smiles, <span className="text-primary italic">Real Results</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore patient transformations, 3D video studio tours, and our state-of-the-art dental care center.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-3"
          >
            <button 
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              className={`w-11 h-11 rounded-full border border-border flex items-center justify-center transition-all
                ${prevBtnEnabled ? 'hover:bg-secondary hover:border-primary/30 text-foreground cursor-pointer' : 'opacity-40 cursor-not-allowed text-muted-foreground'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              className={`w-11 h-11 rounded-full border border-border flex items-center justify-center transition-all
                ${nextBtnEnabled ? 'hover:bg-secondary hover:border-primary/30 text-foreground cursor-pointer' : 'opacity-40 cursor-not-allowed text-muted-foreground'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-border/50 pb-4">
          {[
            { id: 'all', label: 'All Showcase' },
            { id: 'video', label: 'Video Studio Tour' },
            { id: 'before_after', label: 'Before & After' },
            { id: 'clinic', label: 'Clinic & Tech' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                  : 'bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Carousel / Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="embla overflow-hidden -mx-6 px-6" 
          ref={emblaRef}
        >
          <div className="embla__container flex py-2">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="embla__slide flex-[0_0_88%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pr-6"
              >
                <GalleryCard item={item} onSelect={(i) => setSelectedItem(i)} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="bg-slate-900 relative flex items-center justify-center overflow-hidden max-h-[60vh]">
                {selectedItem.type === 'video' ? (
                  <video
                    src={selectedItem.videoUrl}
                    poster={selectedItem.image}
                    controls
                    autoPlay
                    className="w-full max-h-[60vh] object-contain"
                  />
                ) : (
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full max-h-[60vh] object-contain"
                  />
                )}
              </div>

              <div className="p-6 sm:p-8 bg-white flex-1 overflow-y-auto">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                  {selectedItem.tag || 'Gallery Detail'}
                </div>
                <h3 className="text-2xl font-serif text-foreground mb-3">{selectedItem.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-base">{selectedItem.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

