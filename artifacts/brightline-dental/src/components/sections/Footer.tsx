import { Link } from 'wouter';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Smile Lab', href: '/construction' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Testimonials', href: '/testimonials' },
];

const services = [
  'General Checkups',
  'Cosmetic Dentistry',
  'Invisalign',
  'Pediatric Care',
  'Dental Implants',
  'Sedation Dentistry',
];

export function Footer() {
  return (
    <footer className="bg-[#0D1117] text-white pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-baseline gap-1.5 mb-6 cursor-pointer">
              <span className="font-serif text-2xl font-semibold text-white">Brightline</span>
              <span className="font-sans text-xs font-medium tracking-wide text-white/70 uppercase">Dental Studio</span>
            </Link>
            <p className="text-white/60 leading-relaxed mb-8 text-sm">
              Modern care, gentle touch. Experience a new standard of dentistry designed for your comfort and confidence.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white hover:text-[#0D1117] transition-all"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6">Services</h4>
            <ul className="space-y-3">
              {services.map((svc) => (
                <li key={svc}>
                  <Link
                    href="/services"
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {svc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6">Contact</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              <li className="leading-relaxed">
                214 Maple Grove Ave, Ste 3B<br />Ashford Heights
              </li>
              <li>
                <a href="tel:5550238890" className="hover:text-white transition-colors">(555) 023-8890</a>
              </li>
              <li>
                <a href="mailto:hello@brightlinedental.com" className="hover:text-white transition-colors">
                  hello@brightlinedental.com
                </a>
              </li>
              <li className="text-white/40 text-xs">
                Mon–Fri: 8am–6pm · Sat: 9am–2pm
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>© {new Date().getFullYear()} Brightline Dental Studio. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
