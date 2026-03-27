import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home",     href: "/" },
  { name: "Rooms",    href: "/rooms" },
  { name: "Gallery",  href: "/gallery" },
  { name: "Reviews",  href: "/reviews" },
  { name: "Contact",  href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled]       = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <>
      {/* ── NAV BAR ── */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          isScrolled || mobileMenuOpen
            ? "bg-background/95 backdrop-blur-md border-border/50 shadow-lg py-3"
            : "bg-transparent border-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group relative z-50">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary group-hover:opacity-80 transition-opacity duration-300">
                Jeevanam Villa
              </h1>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative",
                      isActive(link.href)
                        ? "text-primary bg-primary/10"
                        : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    {link.name}
                    {isActive(link.href) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-primary rounded-full" />
                    )}
                  </Link>
                ))}
              </div>
              <Link href="/contact">
                <Button className="h-10 px-6 text-sm">Book Now</Button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden relative z-50 w-11 h-11 flex items-center justify-center rounded-lg text-foreground hover:text-primary hover:bg-primary/5 transition-all focus:outline-none"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0,  opacity: 1 }}
                    exit={{   rotate:  90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X size={26} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate:  90, opacity: 0 }}
                    animate={{ rotate:  0,  opacity: 1 }}
                    exit={{   rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Menu size={26} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

          </div>
        </div>
      </nav>

      {/* ── MOBILE FULL-SCREEN MENU ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1,  y: 0  }}
            exit={{   opacity: 0,  y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed inset-0 z-40 bg-background flex flex-col"
          >
            {/* Space for the fixed navbar */}
            <div className="h-[68px] shrink-0 border-b border-border/20" />

            {/* Links */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1,  x: 0   }}
                  transition={{ delay: i * 0.055, duration: 0.28 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between w-full px-5 py-4 rounded-xl text-lg font-medium border transition-all duration-200",
                      isActive(link.href)
                        ? "text-primary bg-primary/10 border-primary/30"
                        : "text-foreground/75 border-border/30 hover:text-primary hover:bg-primary/5 hover:border-primary/25"
                    )}
                  >
                    {link.name}
                    {isActive(link.href) && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1,  y:  0 }}
                transition={{ delay: 0.33, duration: 0.28 }}
                className="pt-4 space-y-3"
              >
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full h-14 text-base font-semibold">
                    Book Your Stay
                  </Button>
                </Link>
                <a
                  href="tel:+919797982421"
                  className="flex items-center justify-center gap-2 h-12 rounded-xl border border-border/40 text-foreground/65 hover:text-primary hover:border-primary/30 transition-all text-sm font-medium"
                >
                  <Phone size={15} />
                  +91 97979 82421
                </a>
              </motion.div>
            </div>

            {/* Footer strip */}
            <div className="px-5 py-4 border-t border-border/25 text-center">
              <p className="text-foreground/30 text-xs">Villa Jeevanam · Kerala, India</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
