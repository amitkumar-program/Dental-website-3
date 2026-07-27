
import { motion } from 'framer-motion';

import drElena from '@/assets/images/dr_elena.jpg';
import drAdrian from '@/assets/images/dr_adrian.jpg';
import drSophia from '@/assets/images/dr_sophia.jpg';

const team = [
  {
    name: "Dr. Elena Marsh, DDS",
    role: "Founder · General & Cosmetic",
    bio: "Dr. Marsh founded Brightline with a vision to blend clinical excellence with genuine patient comfort.",
    image: drElena,
  },
  {
    name: "Dr. Adrian Cole, DMD",
    role: "Orthodontics & Invisalign",
    bio: "Dr. Cole has helped hundreds of patients achieve straighter, more confident smiles through cutting-edge aligner technology.",
    image: drAdrian,
  },
  {
    name: "Dr. Sophia Holeson, DDS",
    role: "Pediatric & Family Dentistry",
    bio: "Dr. Holeson specializes in gentle pediatric dentistry, creating a warm, joyful environment where young patients build healthy dental habits for life.",
    image: drSophia,
  }
];

function TeamMemberCard({ member, index }: { member: typeof team[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative"
    >
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-border/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
        <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-secondary relative">
          <img 
            src={member.image} 
            alt={member.name} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle blue overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="px-2 pb-2">
          <h3 className="text-xl font-serif font-medium text-foreground mb-1">
            {member.name}
          </h3>
          <p className="text-primary text-sm font-medium mb-4">
            {member.role}
          </p>
          
          <div className="relative">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {member.bio}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Team() {
  return (
    <section id="team" className="py-24 bg-secondary/30 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            The Experts Behind <span className="text-primary italic">Your Smile</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Meet the dedicated professionals committed to providing you with the highest standard of modern dental care.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <TeamMemberCard key={member.name} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
