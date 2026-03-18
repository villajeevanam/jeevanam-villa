import { motion } from "framer-motion";
import { Link } from "wouter";
import { Wifi, Car, Wind, Coffee, Users, Shield, Droplets, Utensils, ArrowRight, Star } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import logoWatermark from "@assets/upscaled_logo_1773827872410.png";

const highlights = [
  { icon: Wifi, title: "High-Speed WiFi" },
  { icon: Car, title: "Secure Parking" },
  { icon: Wind, title: "Air Conditioning" },
  { icon: Droplets, title: "24/7 Hot Water" },
  { icon: Coffee, title: "Room Service" },
  { icon: Shield, title: "24/7 Security" },
  { icon: Utensils, title: "In-house Dining" },
  { icon: Users, title: "Concierge" },
];

const quickLinks = [
  {
    title: "Our Rooms",
    desc: "Explore our carefully designed rooms — from cozy deluxe suites to spacious family havens.",
    href: "/rooms",
    img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
  },
  {
    title: "Photo Gallery",
    desc: "A visual journey through Villa Jeevanam — interiors, dining, views, and more.",
    href: "/gallery",
    img: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80",
  },
  {
    title: "Guest Reviews",
    desc: "Hear what our guests have to say about their stay at Villa Jeevanam.",
    href: "/reviews",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Home() {
  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542314831-c6a420325142?w=1920&q=80')` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/80 via-background/55 to-background/96" />

        {/* Logo watermark — behind text, above gradient */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ zIndex: 15 }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={logoWatermark}
            alt=""
            draggable={false}
            style={{
              width: "min(65vw, 580px)",
              opacity: 0.07,
              filter: "blur(1.5px) brightness(1.4)",
              mixBlendMode: "screen",
              userSelect: "none",
            }}
          />
        </motion.div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-primary tracking-[0.25em] uppercase text-sm md:text-base font-medium mb-5">Welcome to Leh</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground font-bold mb-6 leading-tight text-glow">
              Villa Jeevanam
            </h1>
            <p className="text-lg md:text-xl text-foreground/75 mb-10 max-w-2xl mx-auto font-light leading-relaxed">A premium 20-room retreat nestled in the hills of Ladakh — where nature meets refined hospitality.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto text-lg px-10">Book Your Stay</Button>
              </Link>
              <Link href="/rooms">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 bg-background/20 backdrop-blur-sm border-primary/50 hover:border-primary">
                  Explore Rooms
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-primary/70 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary/70 to-transparent" />
        </motion.div>
      </section>
      {/* ── ABOUT STRIP ── */}
      <section className="py-16 px-4 bg-secondary/30 border-y border-border/40">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { value: "20", label: "Premium Rooms" },
            { value: "4+", label: "Meal Plans" },
            { value: "5★", label: "Guest Rating" },
          ].map((stat, i) => (
            <motion.div key={stat.label} {...fadeUp(i * 0.1)} className="flex flex-col items-center gap-1">
              <span className="text-4xl md:text-5xl font-serif font-bold text-primary">{stat.value}</span>
              <span className="text-foreground/60 text-sm tracking-wider uppercase">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>
      {/* ── ABOUT TEXT ── */}
      <section className="py-24 md:py-32 px-4 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp(0)}>
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">Our Story</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6 leading-tight">
              A sanctuary designed for comfort &amp; calm
            </h2>
            <p className="text-foreground/65 leading-relaxed mb-6">We travels, some of us forever to seek others states, others lives, other souls." -ANAIS NIN
            We heartly welcome you to our villa. If you choose to spend your holidays with us then we promise you that you will have a life time memory.</p>
            <p className="text-foreground/65 leading-relaxed mb-8">The Jeevanam Villa waits for explorers and travellers to experience the mystifying land and the people of Ladakh.
            Located at just 5 minutes away from the Airport and 1.5 km from the Main Leh Market, we welcome you to experience and enjoy the local hospitality and simplicity.</p>
            <Link href="/rooms">
              <Button variant="outline" className="group">
                View Our Rooms
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1582719478250-c89fae46583b?w=600&q=80"
              alt="Room interior"
              className="rounded-2xl object-cover w-full h-64 md:h-80 shadow-2xl"
            />
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80"
              alt="Pool view"
              className="rounded-2xl object-cover w-full h-64 md:h-80 shadow-2xl mt-8"
            />
          </motion.div>
        </div>
      </section>
      {/* ── AMENITIES ── */}
      <section className="py-20 px-4 bg-secondary/20 border-y border-border/40 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeading title="Premium Amenities" subtitle="Facilities" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  {...fadeUp(i * 0.05)}
                  className="bg-card p-6 rounded-xl border border-border/50 hover:border-primary/50 flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-serif text-base text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {/* ── QUICK NAV CARDS ── */}
      <section className="py-24 md:py-32 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="Explore Villa Jeevanam" subtitle="Discover" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickLinks.map((card, i) => (
              <motion.div key={card.href} {...fadeUp(i * 0.1)}>
                <Link href={card.href} className="group block rounded-2xl overflow-hidden border border-border/50 hover:border-primary/40 bg-card transition-all duration-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                  <div className="relative h-52 overflow-hidden">
                    <div className="absolute inset-0 bg-background/30 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors mb-2">{card.title}</h3>
                    <p className="text-foreground/60 text-sm leading-relaxed mb-4">{card.desc}</p>
                    <span className="inline-flex items-center text-primary text-sm font-medium gap-1.5 group-hover:gap-3 transition-all duration-300">
                      Explore <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ── TESTIMONIAL STRIP ── */}
      <section className="py-16 px-4 bg-secondary/20 border-y border-border/40">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp(0)}>
            <div className="flex justify-center gap-1 mb-5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="font-serif text-xl md:text-2xl text-foreground/90 italic mb-6 leading-relaxed">
              "An absolutely magical experience. The rooms are immaculate, the food is incredible, 
              and the staff makes you feel like family. Will definitely return."
            </blockquote>
            <p className="text-primary font-medium text-sm tracking-wide">— Arun &amp; Meera, Honeymoon Guests</p>
            <Link href="/reviews">
              <Button variant="outline" className="mt-6 group">
                Read More Reviews
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* ── CTA ── */}
      <section className="py-24 px-4 bg-background text-center">
        <motion.div {...fadeUp(0)} className="max-w-2xl mx-auto">
          <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">Ready to visit?</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6 leading-tight">
            Book your stay at Villa Jeevanam
          </h2>
          <p className="text-foreground/60 mb-8 leading-relaxed">
            Rooms available year-round. Check our tariff page for pricing and plan details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="px-10">Make a Reservation</Button>
            </Link>
            <Link href="/rooms">
              <Button size="lg" variant="outline" className="px-10">View Tariff &amp; Plans</Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}
