import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import smileLabImg from '@/assets/images/smile_lab_interior.jpg';

const FALLBACK_LAB = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop';
import {
  Hammer,
  Sparkles,
  ArrowRight,
  Clock,
  Settings,
  AlertTriangle,
  Layers,
  Shield,
  Activity,
  RotateCcw,
  Smile,
  HelpCircle
} from 'lucide-react';

import { PageLayout } from '../components/PageLayout';
import { PageHero } from '../components/PageHero';

interface Station {
  id: string;
  name: string;
  metaphor: string;
  dentalRealitity: string;
  icon: any;
  coordinates: { x: string; y: string };
  crewCount: number;
  equipment: string[];
}

const STATIONS: Station[] = [
  {
    id: 'scaffolding',
    name: 'Scaffolding Division',
    metaphor: 'Establishing high-tech scaffold structures and cranes around the enamel peak to prepare the workspace safely.',
    dentalRealitity: 'Precision tooth preparation and custom-fit isolation. We shape the enamel edges micro-conservatively, retaining as much healthy natural tooth as possible.',
    icon: Shield,
    coordinates: { x: '22%', y: '48%' },
    crewCount: 4,
    equipment: ['Miniature Scaffolds', 'Stabilizing Jacks', 'Precision Anchors'],
  },
  {
    id: 'isolation',
    name: 'Moisture Barrier Crew',
    metaphor: 'Wrapping the entire site boundary in yellow "CAUTION" isolation tape to lock out hazardous environmental moisture.',
    dentalRealitity: 'Rubber dam isolation. Absolute dry-field control is vital. Composite resin bonding requires a 100% moisture-free environment to achieve its maximum life-long adhesive strength.',
    icon: AlertTriangle,
    coordinates: { x: '18%', y: '84%' },
    crewCount: 2,
    equipment: ['High-Vis Caution Tape', 'Anchor Pegs', 'Boundary Seals'],
  },
  {
    id: 'clearing',
    name: 'Cavity Excavation Unit',
    metaphor: 'Operating heavy machinery inside the cavernous cavity, clearing out soft decayed organic matter to expose structural bedrock.',
    dentalRealitity: 'Gentle, state-of-the-art air abrasion and high-speed caries removal. We disinfect the inner dentin layer thoroughly using specialized biomimetic primers to ensure no bacteria remain.',
    icon: Hammer,
    coordinates: { x: '58%', y: '44%' },
    crewCount: 3,
    equipment: ['Debris Shovels', 'Precision Chisels', 'Site Disinfectant Spray'],
  },
  {
    id: 'mixer',
    name: 'Concrete Mixing Lab',
    metaphor: 'Operating a high-powered cement mixer, blending a custom, shade-matched composite compound that cures into ultra-durable stone.',
    dentalRealitity: 'Mixing and warming micro-hybrid composite ceramic resins. Using our shade-matching guide (e.g., VITA Classical shades), we blend monomers that mimic the exact translucency, hue, and wear-resistance of your natural teeth.',
    icon: RotateCcw,
    coordinates: { x: '33%', y: '88%' },
    crewCount: 2,
    equipment: ['High-Viscosity Mixer', 'Shade-Matching Spectrometer', 'Polymerizing Compound'],
  },
  {
    id: 'conveyor',
    name: 'Conveyor Transport Team',
    metaphor: 'Manning a heavy conveyor belt that transfers cargo layers of pristine white tooth compound up into the active restoration zone.',
    dentalRealitity: 'Incremental layer-by-layer direct composite placement. Resin is placed in ultra-precise 2mm increments to avoid polymerization shrinkage, ensuring a perfectly sealed marginal bond.',
    icon: Layers,
    coordinates: { x: '72%', y: '78%' },
    crewCount: 3,
    equipment: ['Motorized Belt', 'Loading Spatulas', 'Layer Compacting Rigs'],
  },
  {
    id: 'inspection',
    name: 'Clinical Quality Inspectors',
    metaphor: 'Senior site engineers performing microscopic checks of the bite margins, polishing the finished surface to a perfect high-gloss sheen.',
    dentalRealitity: 'Occlusion adjustment and cosmetic finishing. We use premium multi-step polishing discs to recreate natural anatomy and shine, ensuring your bite feels perfectly balanced and smooth to your tongue.',
    icon: Sparkles,
    coordinates: { x: '86%', y: '84%' },
    crewCount: 2,
    equipment: ['Micro-abrasion Buffers', 'Bite Alignment Paper', 'Optical Shine Gauges'],
  },
];

export default function ConstructionPage() {
  const [activeStation, setActiveStation] = useState<Station>(STATIONS[0]);
  const [simStep, setSimStep] = useState<number>(-1);
  const [logs, setLogs] = useState<string[]>([]);
  const [isSimActive, setIsSimActive] = useState<boolean>(false);
  const [selectedMaterial, setSelectedMaterial] = useState<'composite' | 'ceramic' | 'biomimetic'>('composite');

  const startSimulator = () => {
    setIsSimActive(true);
    setSimStep(0);
    setLogs(['👷 Site Manager: "Crew assembled. Commencing Smile Restoration Project alpha."']);
  };

  const resetSimulator = () => {
    setIsSimActive(false);
    setSimStep(-1);
    setLogs([]);
  };

  useEffect(() => {
    if (!isSimActive || simStep < 0) return;

    let timer: any;

    const runSimulationStep = () => {
      switch (simStep) {
        case 0:
          setLogs((prev) => [
            ...prev,
            '🚧 PHASE 1: SITE SECURITY',
            '📼 Moisture barrier crew is rolling out high-vis yellow Caution tape.',
            '🦷 Real-world counterpart: Rubber dam isolated. Area is 100% moisture-free.'
          ]);
          timer = setTimeout(() => setSimStep(1), 3000);
          break;
        case 1:
          setLogs((prev) => [
            ...prev,
            '🚧 PHASE 2: EXCAVATION & DISINFECTION',
            '🏗️ Cranes positioned. Clearing crews are removing compromised enamel structures.',
            '🧪 Disinfectant mist is applied to neutralize latent bacterial clusters.'
          ]);
          timer = setTimeout(() => setSimStep(2), 3500);
          break;
        case 2:
          setLogs((prev) => [
            ...prev,
            '🚧 PHASE 3: COMPOSITE CONCRETE MIXING',
            '🔄 Cement mixer active. Blending modern composite resins with micro-glass fillers.',
            `🔬 Material chemistry adjusted for: ${
              selectedMaterial === 'composite'
                ? 'High-strength Micro-hybrid Composite'
                : selectedMaterial === 'ceramic'
                ? 'Ultra-aesthetic Porcelain Hybrid'
                : 'Biomimetic Stress-reducing Co-polymers'
            }.`
          ]);
          timer = setTimeout(() => setSimStep(3), 3500);
          break;
        case 3:
          setLogs((prev) => [
            ...prev,
            '🚧 PHASE 4: TRANSPORT & LAYER PLACEMENT',
            '🪵 Conveyor belt running! Transferring white filler paste into the cavity site.',
            '⚡ UV UV-photo-curing light beams are active. Hardening layer 1 of 3...'
          ]);
          timer = setTimeout(() => setSimStep(4), 4000);
          break;
        case 4:
          setLogs((prev) => [
            ...prev,
            '🚧 PHASE 5: QUALITY CONTROLS',
            '✨ Inspectors are hand-polishing margins and buffing the surface.',
            '🎯 Adjusting occlusion forces to 100% perfect balance.',
            '🎉 Restored tooth is certified strong, seamless, and fully ready for action!'
          ]);
          setIsSimActive(false);
          break;
        default:
          break;
      }
    };

    runSimulationStep();

    return () => clearTimeout(timer);
  }, [simStep, isSimActive, selectedMaterial]);

  // Auto-scroll logs terminal
  useEffect(() => {
    const term = document.getElementById('log-terminal');
    if (term) {
      term.scrollTop = term.scrollHeight;
    }
  }, [logs]);

  return (
    <PageLayout>
      <PageHero
        eyebrow="Smile Engineering"
        title="The Smile"
        titleAccent="Construction Lab"
        subtitle="Step inside our creative tooth engineering zone. Discover how we rebuild decayed or damaged structures using high-viscosity composite science, styled after our whimsical construction crew."
      />

      {/* Main interactive segment */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Whimsical Image Map and Pin Hotspots (7 Columns) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative rounded-3xl overflow-hidden border border-border bg-slate-950 shadow-xl group">
                {/* Whimsical Tooth Construction Image */}
                <img
                  src={smileLabImg}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_LAB;
                  }}
                  alt="Smile Construction Zone"
                  className="w-full h-auto object-cover opacity-90 group-hover:scale-102 transition-transform duration-700"
                />

                {/* Pulsing Coordinates Hotspots Overlay */}
                <div className="absolute inset-0 pointer-events-none md:pointer-events-auto">
                  {STATIONS.map((station) => {
                    const isSelected = activeStation.id === station.id;
                    return (
                      <button
                        key={station.id}
                        id={`hotspot-${station.id}`}
                        onClick={() => setActiveStation(station)}
                        style={{ left: station.coordinates.x, top: station.coordinates.y }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer transition-all duration-300 pointer-events-auto z-20 group`}
                        title={station.name}
                      >
                        <span className="relative flex h-6 w-6">
                          {/* Inner pulse */}
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSelected ? 'bg-primary' : 'bg-amber-500'}`} />
                          <span className={`relative inline-flex rounded-full h-6 w-6 items-center justify-center text-[10px] font-bold text-white shadow-md ${isSelected ? 'bg-primary scale-125' : 'bg-amber-500 hover:bg-primary'}`}>
                            👷
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-2xl text-xs text-white/95 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>Interactive Map: Click the <strong>👷 hotspots</strong> on our active tooth site to inspect each division!</span>
                </div>
              </div>

              {/* Grid of quick selector cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STATIONS.map((station) => {
                  const Icon = station.icon;
                  const isSelected = activeStation.id === station.id;
                  return (
                    <button
                      key={station.id}
                      onClick={() => setActiveStation(station)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-primary/5 border-primary text-primary shadow-sm'
                          : 'bg-white border-border text-foreground hover:bg-secondary/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-secondary text-primary'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold font-serif leading-tight">{station.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Station Detail Viewer (5 Columns) */}
            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStation.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white border border-border rounded-3xl p-8 shadow-sm space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                      Active Division
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Crew size: {activeStation.crewCount} builders
                    </span>
                  </div>

                  <div>
                    <h3 className="text-3xl font-serif font-medium text-foreground mb-3 leading-tight">
                      {activeStation.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Every great smile restoration is like building a masterpiece. Let's see how our miniature builders mirror clinical dentistry.
                    </p>
                  </div>

                  {/* Metaphor Section */}
                  <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-5 space-y-2">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                      👷 The Metaphor
                    </span>
                    <p className="text-amber-900 text-sm leading-relaxed">
                      {activeStation.metaphor}
                    </p>
                  </div>

                  {/* Dental Reality Section */}
                  <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 space-y-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                      🦷 Clinical Reality
                    </span>
                    <p className="text-foreground text-sm leading-relaxed">
                      {activeStation.dentalRealitity}
                    </p>
                  </div>

                  {/* Division Equipment list */}
                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">
                      Division Assets & Tools
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeStation.equipment.map((eq) => (
                        <span key={eq} className="text-xs bg-secondary text-primary font-medium px-3 py-1.5 rounded-xl border border-border/60">
                          ⚙️ {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Simulator Section */}
      <section className="py-24 bg-secondary/30 border-t border-border">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-widest">Interactive Laboratory</span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mt-2 mb-4">
              Restoration <span className="text-primary italic">Simulator</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose your high-grade filling compound material, launch the construction program, and track the miniature crew dispatch logs in real-time.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch">
            
            {/* Control Dashboard (5 columns) */}
            <div className="lg:col-span-5 bg-white border border-border rounded-3xl p-8 shadow-sm flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-serif font-medium text-foreground mb-1">1. Choose Filling Material</h3>
                  <p className="text-xs text-muted-foreground">Select the physical properties of the building mix</p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'composite',
                      name: 'Micro-Hybrid Composite',
                      desc: 'Universal high strength, perfect natural polish.',
                      durability: '⭐⭐⭐⭐',
                      aesthetic: '⭐⭐⭐⭐⭐'
                    },
                    {
                      id: 'ceramic',
                      name: 'Porcelain Nano-Ceramic',
                      desc: 'Premium glass-matrix ceramic. Zero staining.',
                      durability: '⭐⭐⭐⭐⭐',
                      aesthetic: '⭐⭐⭐⭐⭐'
                    },
                    {
                      id: 'biomimetic',
                      name: 'Biomimetic Co-Polymer',
                      desc: 'Mimics the flexible elasticity of healthy dentin.',
                      durability: '⭐⭐⭐⭐⭐',
                      aesthetic: '⭐⭐⭐⭐'
                    }
                  ].map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => !isSimActive && setSelectedMaterial(mat.id as any)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all ${
                        selectedMaterial === mat.id
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border bg-white hover:bg-secondary/20'
                      } ${isSimActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-sm font-semibold font-serif text-foreground block">{mat.name}</span>
                          <span className="text-xs text-muted-foreground leading-snug mt-0.5 block">{mat.desc}</span>
                        </div>
                        {selectedMaterial === mat.id && (
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Selected</span>
                        )}
                      </div>
                      <div className="flex gap-4 mt-3 pt-3 border-t border-dashed border-border text-[10px] text-muted-foreground">
                        <span>Durability: <span className="text-amber-500 font-sans">{mat.durability}</span></span>
                        <span>Aesthetic: <span className="text-primary font-sans">{mat.aesthetic}</span></span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-border mt-8 flex gap-4">
                {simStep < 0 ? (
                  <button
                    onClick={startSimulator}
                    className="flex-1 bg-primary text-white text-sm font-semibold py-3.5 px-6 rounded-full hover:bg-primary/90 transition-all text-center flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                  >
                    <Activity className="w-4 h-4 animate-pulse" /> Launch Crew Dispatch
                  </button>
                ) : (
                  <button
                    onClick={resetSimulator}
                    className="flex-1 border border-border text-foreground hover:bg-secondary/40 text-sm font-semibold py-3.5 px-6 rounded-full transition-all text-center flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset Simulation
                  </button>
                )}
              </div>
            </div>

            {/* Terminal Log Screen (7 columns) */}
            <div className="lg:col-span-7 bg-[#0D1117] text-slate-300 rounded-3xl p-6 shadow-xl flex flex-col justify-between border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-mono text-slate-500 ml-2">smile_restoration_firmware.sh</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-mono text-slate-400">
                    {isSimActive ? 'SIMULATION RUNNING' : 'SYSTEM READY'}
                  </span>
                </div>
              </div>

              {/* Logs terminal container */}
              <div
                id="log-terminal"
                className="font-mono text-xs overflow-y-auto space-y-2.5 flex-1 min-h-[280px] max-h-[360px] pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
              >
                {simStep < 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 text-center px-6">
                    <Smile className="w-10 h-10 text-slate-600 animate-bounce" />
                    <p className="max-w-xs leading-relaxed">
                      Terminal idle. Select a composite material formula and click <strong>Launch Crew Dispatch</strong> to view live microscopic logs.
                    </p>
                  </div>
                ) : (
                  logs.map((log, index) => {
                    const isPhaseHeader = log.startsWith('🚧');
                    const isDentalNote = log.startsWith('🦷') || log.startsWith('🔬');
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`leading-relaxed ${
                          isPhaseHeader
                            ? 'text-amber-400 font-bold border-b border-dashed border-slate-800 pb-1 mt-4 first:mt-0'
                            : isDentalNote
                            ? 'text-cyan-400 pl-4'
                            : 'text-slate-200'
                        }`}
                      >
                        {log}
                      </motion.div>
                    );
                  })
                )}
                {isSimActive && (
                  <div className="flex items-center gap-2 text-amber-500 animate-pulse pl-4 mt-2">
                    <span className="inline-block border-2 border-amber-500 border-t-transparent animate-spin w-3 h-3 rounded-full" />
                    <span>Crew actively engineering site...</span>
                  </div>
                )}
              </div>

              {/* Stats Bar */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500 font-mono">
                <span>Phase: {simStep < 0 ? '0' : simStep + 1}/5</span>
                <span>Active Material: {selectedMaterial.toUpperCase()}</span>
                <span>Enamel Bonding: {simStep === 4 ? '100%' : simStep >= 2 ? '78%' : '0%'}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ or Educational Metaphor breakdown */}
      <section className="py-24 bg-white border-t border-border">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-primary font-medium text-sm uppercase tracking-widest">Deep Science</span>
              <h3 className="text-3xl md:text-4xl font-serif text-foreground leading-tight">
                Why we use Whimsical <span className="text-primary italic">Metaphors</span>
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Dentistry is highly technical, and for many, it can be intimidating. By explaining dental crown prep, polymer resin chemistry, and rubber-dam isolation using a colorful, micro-construction site analogy:
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: 'Demystifying the process',
                    desc: 'Knowing exactly what the "construction crew" is doing relieves clinical anxiety.'
                  },
                  {
                    title: 'Biomimetic principles',
                    desc: 'We treat teeth as structural architectural wonders. Replacing enamel with composite and dentin with softer, shock-absorbing materials mirrors nature.'
                  },
                  {
                    title: 'Engagement for all ages',
                    desc: 'Both younger patients and technical engineers appreciate the mechanical alignment checks and precise chemistry formulas we employ.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm font-serif">{item.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-secondary/40 border border-border rounded-3xl p-8 space-y-6">
              <h4 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" /> Common Restorations QA
              </h4>

              <div className="space-y-4 divide-y divide-border/60">
                {[
                  {
                    q: 'How long does a composite tooth construction last?',
                    a: 'With perfect isolation (Caution Tape team) and high-quality resins (Concrete Mixers), direct restorations last 7-10+ years. Excellent brushing and routine team checkups help extend their structural warranty indefinitely!'
                  },
                  {
                    q: 'Does tooth excavation hurt?',
                    a: 'Not at all. Just like structural engineering, safety comes first. We ensure the local site is fully anesthetized and isolated before the clearing crews begin work. Many patients read, relax, or listen to music during construction.'
                  },
                  {
                    q: 'What is Biomimetic Dentistry?',
                    a: 'It is "Nature-copying" engineering. Traditional dentistry often grinds down entire teeth for crowns. We conserve 90%+ of your tooth, bonding layers using co-polymers that expand, contract, and flex identical to natural teeth.'
                  }
                ].map((faq, idx) => (
                  <div key={idx} className={`pt-4 ${idx === 0 ? 'pt-0' : ''}`}>
                    <h5 className="font-serif font-medium text-foreground text-sm">{faq.q}</h5>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rebuild CTA Banner */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: 'radial-gradient(circle at 10% 30%, rgba(255,255,255,0.4) 0%, transparent 60%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.25) 0%, transparent 50%)'
        }} />
        <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif text-white max-w-2xl mx-auto leading-tight">
            Schedule Your <span className="italic font-light">Custom Restoration Crew</span> Today
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto leading-relaxed">
            Ready to repair decayed areas, replace older metals, or craft a stunning smile transformation? Our clinical engineers are standing by.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-primary px-8 py-4 rounded-full font-medium hover:bg-white/95 transition-all hover:shadow-xl active:scale-95 text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              Book an Appointment <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/services"
              className="border border-white/40 text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-all active:scale-95 text-center cursor-pointer"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
