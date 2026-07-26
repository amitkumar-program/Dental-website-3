import { useState, useEffect } from "react";
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Smile Lab', href: '/construction' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (href: string) =>
    href === '/' ? location === '/' : location.startsWith(href);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/97 backdrop-blur-md shadow-sm py-3'
            : 'bg-black/50 backdrop-blur-md py-5 border-b border-white/10'
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between gap-8 lg:gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-1.5 group cursor-pointer">
            <span className={`font-serif text-2xl font-semibold transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`}>
              Brightline
            </span>
            <span className={`font-sans text-xs font-medium tracking-widest uppercase transition-colors ${isScrolled ? 'text-primary/70' : 'text-white/70'}`}>
              Dental Studio
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-12">
            <ul className="flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors relative group ${
                      isScrolled
                        ? isActive(link.href) ? 'text-primary' : 'text-foreground hover:text-primary'
                        : isActive(link.href) ? 'text-white' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                        isScrolled ? 'bg-primary' : 'bg-white'
                      } ${isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'}`}
                    />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Auth area */}
            {user ? (
              <div className="flex items-center gap-3 lg:gap-4 ml-4">
                <Link
                  href="/portal"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isScrolled
                      ? 'text-primary hover:bg-primary/10'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Portal
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isScrolled
                        ? 'text-primary hover:bg-primary/10'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isScrolled
                      ? 'text-foreground/70 hover:text-foreground hover:bg-secondary/60'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 lg:gap-6 ml-4">
                <Link
                  href="/login"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isScrolled
                      ? 'text-foreground/70 hover:text-primary'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href="/contact"
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-lg active:scale-95 ${
                    isScrolled
                      ? 'bg-primary text-white hover:bg-primary/90 hover:shadow-primary/20'
                      : 'bg-white text-primary hover:bg-white/90 hover:shadow-white/20'
                  }`}
                >
                  Book Appointment
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            className={`lg:hidden p-2 transition-colors ${isScrolled ? 'text-foreground' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 lg:hidden flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-border">
                <span className="font-serif text-xl text-primary">Brightline</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-foreground/70 hover:text-foreground bg-secondary/50 rounded-full"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-1 px-4 py-6 flex-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-left text-xl font-serif px-4 py-3 rounded-xl transition-colors ${
                      isActive(link.href)
                        ? 'text-primary bg-secondary/50'
                        : 'text-foreground hover:text-primary hover:bg-secondary/30'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {user && (
                  <>
                    <div className="border-t border-border my-2" />
                    <Link
                      href="/portal"
                      className="flex items-center gap-2 text-left text-lg px-4 py-3 rounded-xl text-primary hover:bg-secondary/30 transition-colors"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      My Portal
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 text-left text-lg px-4 py-3 rounded-xl text-primary hover:bg-secondary/30 transition-colors"
                      >
                        <ShieldCheck className="w-5 h-5" />
                        Admin
                      </Link>
                    )}
                  </>
                )}
              </div>

              <div className="px-8 pb-10 space-y-3">
                {user ? (
                  <button
                    onClick={() => signOut()}
                    className="flex items-center justify-center gap-2 w-full border border-border text-foreground/70 px-6 py-3 rounded-full font-medium active:scale-95 transition-transform"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full border border-border text-foreground px-6 py-3 rounded-full font-medium active:scale-95 transition-transform"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
                <Link
                  href="/contact"
                  className="block w-full bg-primary text-white px-6 py-4 rounded-full text-center font-medium active:scale-95 transition-transform"
                >
                  Book Appointment
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
