import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Wifi, Car, Wind, Coffee, Users, Shield, Droplets, Utensils,
  MapPin, Phone, Mail, CheckCircle2, ChevronLeft, ChevronRight, X,
  AlertTriangle, Info, Clock, CreditCard, Ban, CloudLightning, CalendarX
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const rooms = [
  {
    id: 1,
    title: "Deluxe Comfort Room",
    description: "Perfect for solo travelers or couples seeking a cozy, elegant space with premium bedding and city views.",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
    features: ["Queen Bed", "En-suite Bathroom", "City View"],
  },
  {
    id: 2,
    title: "Premium Executive Suite",
    description: "Spacious and luxurious, featuring a separate seating area, deep soaking tub, and panoramic views.",
    image: "https://images.unsplash.com/photo-1582719478250-c89fae46583b?w=800&q=80",
    features: ["King Bed", "Living Area", "Mini Bar"],
  },
  {
    id: 3,
    title: "Family Haven Suite",
    description: "Designed for families, offering two adjoining rooms, ample space, and amenities for all ages.",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    features: ["Two Double Beds", "Spacious", "Balcony"],
  },
];

const amenities = [
  { icon: Wifi, title: "High-Speed WiFi" },
  { icon: Car, title: "Secure Parking" },
  { icon: Wind, title: "Air Conditioning" },
  { icon: Droplets, title: "24/7 Hot Water" },
  { icon: Coffee, title: "Room Service" },
  { icon: Shield, title: "24/7 Security" },
  { icon: Utensils, title: "In-house Dining" },
  { icon: Users, title: "Concierge" },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1542314831-c6a420325142?w=1000&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1000&q=80",
  "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=1000&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&q=80",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1000&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&q=80",
];

// ─── TARIFF DATA ──────────────────────────────────────────────────────────────

const PLANS = {
  EP: { label: "EP", fullName: "European Plan", desc: "Room only", price: 2300 },
  CP: { label: "CP", fullName: "Continental Plan", desc: "Room + Breakfast", price: 2800 },
  MAP: { label: "MAP", fullName: "Modified American Plan", desc: "Room + Breakfast + Dinner", price: 3500 },
  AP: { label: "AP", fullName: "American Plan", desc: "All Meals Included", price: 4000 },
};

type PlanKey = keyof typeof PLANS;

const EXTRA_BED: Record<PlanKey, number> = { EP: 900, CP: 1120, MAP: 1400, AP: 1600 };
const CHILD_NO_BED: Record<PlanKey, number> = { EP: 500, CP: 700, MAP: 1000, AP: 1200 };

const cancellationPolicies = [
  {
    icon: CreditCard,
    title: "Advance Payment",
    text: "50% advance payment is required at the time of booking. This amount is non-refundable.",
  },
  {
    icon: Clock,
    title: "Balance Payment",
    text: "The remaining 50% must be paid at least 8 days prior to arrival date.",
  },
  {
    icon: CalendarX,
    title: "Cancellation > 7 Days",
    text: "Cancellations made more than 7 days before arrival will incur a 50% cancellation charge.",
  },
  {
    icon: Ban,
    title: "Cancellation ≤ 7 Days",
    text: "Cancellations made within 7 days of arrival will be charged 100% of the booking amount.",
  },
  {
    icon: AlertTriangle,
    title: "No Refund for Early Departure",
    text: "No refund will be provided for early check-out or unused services during the stay.",
  },
  {
    icon: CloudLightning,
    title: "External Circumstances",
    text: "No refund for cancellations due to external factors such as weather conditions, road blockages, or natural events.",
  },
  {
    icon: Info,
    title: "Payment Deadline",
    text: "Villa Jeevanam reserves the right to cancel a booking if full payment is not received within the stipulated timeframe.",
  },
];

// ─── BOOKING FORM ─────────────────────────────────────────────────────────────

const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  guests: z.string().min(1, "Number of guests is required"),
  plan: z.enum(["EP", "CP", "MAP", "AP"], { required_error: "Please select a plan" }),
  extraBed: z.enum(["none", "extra_bed", "child_no_bed"]).default("none"),
  requests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  const nights = Math.round(diff / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

function calcEstimate(plan: PlanKey, extraBed: string, nights: number): number {
  const base = PLANS[plan].price;
  let extra = 0;
  if (extraBed === "extra_bed") extra = EXTRA_BED[plan];
  if (extraBed === "child_no_bed") extra = CHILD_NO_BED[plan];
  return (base + extra) * nights;
}

// ─── SELECT STYLE ─────────────────────────────────────────────────────────────

const selectCls =
  "flex h-12 w-full rounded-md border border-border/50 bg-input/50 px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all";

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isBookingSubmitted, setIsBookingSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { extraBed: "none" },
  });

  const watchedPlan = useWatch({ control, name: "plan" });
  const watchedCheckIn = useWatch({ control, name: "checkIn" });
  const watchedCheckOut = useWatch({ control, name: "checkOut" });
  const watchedExtraBed = useWatch({ control, name: "extraBed" });

  const nights = useMemo(
    () => nightsBetween(watchedCheckIn || "", watchedCheckOut || ""),
    [watchedCheckIn, watchedCheckOut]
  );

  const estimatedTotal = useMemo(() => {
    if (!watchedPlan || nights === 0) return null;
    return calcEstimate(watchedPlan as PlanKey, watchedExtraBed || "none", nights);
  }, [watchedPlan, watchedExtraBed, nights]);

  const onSubmit = async (data: BookingFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    console.log("Booking Request:", data);
    setIsBookingSubmitted(true);
    reset();
    setTimeout(() => setIsBookingSubmitted(false), 6000);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) setSelectedImage((selectedImage + 1) % galleryImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null)
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <main className="relative bg-background min-h-screen">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542314831-c6a420325142?w=1920&q=80')` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/80 via-background/60 to-background/95" />

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <h2 className="text-primary tracking-[0.2em] uppercase text-sm md:text-base font-medium mb-6">
              Welcome to Luxury
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground font-bold mb-6 text-glow leading-tight">
              Villa Jeevanam
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              A comfortable and premium stay. Experience a sanctuary of hospitality in the heart of nature.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#booking">
                <Button size="lg" className="w-full sm:w-auto text-lg px-10">Book Your Stay</Button>
              </a>
              <a href="#tariff">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 bg-background/20 backdrop-blur-sm border-primary/50 hover:border-primary">
                  View Tariff
                </Button>
              </a>
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

      {/* ── ROOMS ───────────────────────────────────────────────────────────── */}
      <section id="rooms" className="py-24 md:py-32 px-4 bg-background relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeading title="Our Rooms" subtitle="Accommodations" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group rounded-xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 box-glow"
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img
                    src={room.image}
                    alt={room.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 z-20 bg-background/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary/20">
                    <span className="text-primary font-medium text-sm">
                      from ₹2,300 <span className="text-xs text-foreground/60">/night</span>
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-serif text-foreground mb-3 group-hover:text-primary transition-colors">{room.title}</h3>
                  <p className="text-foreground/70 text-sm mb-6 line-clamp-3 leading-relaxed">{room.description}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {room.features.map(feat => (
                      <span key={feat} className="text-xs px-3 py-1 bg-secondary rounded-full text-foreground/80 border border-border">{feat}</span>
                    ))}
                  </div>
                  <a href="#booking" className="block">
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      Reserve Room
                    </Button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AMENITIES ───────────────────────────────────────────────────────── */}
      <section id="amenities" className="py-24 md:py-32 px-4 bg-secondary/30 border-y border-border/50 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeading title="Premium Amenities" subtitle="Facilities" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {amenities.map((amenity, i) => {
              const Icon = amenity.icon;
              return (
                <motion.div
                  key={amenity.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-card p-6 md:p-8 rounded-xl border border-border/50 hover:border-primary/50 flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">{amenity.title}</h4>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TARIFF & PLANS ──────────────────────────────────────────────────── */}
      <section id="tariff" className="py-24 md:py-32 px-4 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/4 rounded-full blur-[80px]" />

        <div className="max-w-6xl mx-auto relative z-10">
          <SectionHeading title="Tariff & Plans" subtitle="Pricing" />

          {/* Plan Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {(Object.values(PLANS) as typeof PLANS[PlanKey][]).map((plan, i) => (
              <motion.div
                key={plan.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card border border-border/50 hover:border-primary/40 rounded-xl p-5 text-center group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-block bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest px-3 py-1 rounded-full mb-3 uppercase">
                  {plan.label}
                </div>
                <p className="text-foreground font-serif text-lg mb-1">{plan.fullName}</p>
                <p className="text-foreground/50 text-xs mb-4">{plan.desc}</p>
                <p className="text-primary text-2xl font-bold font-serif">₹{plan.price.toLocaleString()}</p>
                <p className="text-foreground/40 text-xs mt-1">per night</p>
              </motion.div>
            ))}
          </div>

          {/* Tariff Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden border border-border/50 shadow-xl"
          >
            <div className="bg-card/80 px-6 py-4 border-b border-border/50 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <h3 className="font-serif text-lg text-foreground">Standard Room — Single / Double Occupancy</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left px-6 py-4 text-foreground/60 font-medium tracking-wide uppercase text-xs">Category</th>
                    <th className="px-6 py-4 text-center text-primary font-semibold">EP<span className="block text-foreground/40 text-[10px] font-normal normal-case">Room Only</span></th>
                    <th className="px-6 py-4 text-center text-primary font-semibold">CP<span className="block text-foreground/40 text-[10px] font-normal normal-case">+ Breakfast</span></th>
                    <th className="px-6 py-4 text-center text-primary font-semibold">MAP<span className="block text-foreground/40 text-[10px] font-normal normal-case">+ B&amp;D</span></th>
                    <th className="px-6 py-4 text-center text-primary font-semibold">AP<span className="block text-foreground/40 text-[10px] font-normal normal-case">All Meals</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  <tr className="bg-card hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-foreground font-medium">Room Rate</td>
                    <td className="px-6 py-4 text-center text-foreground/90">₹2,300</td>
                    <td className="px-6 py-4 text-center text-foreground/90">₹2,800</td>
                    <td className="px-6 py-4 text-center text-foreground/90">₹3,500</td>
                    <td className="px-6 py-4 text-center text-foreground/90">₹4,000</td>
                  </tr>
                  <tr className="bg-card/60 hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-foreground/80">
                      Extra Bed
                      <span className="block text-foreground/40 text-xs">Child 5–12 yrs</span>
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/80">₹900</td>
                    <td className="px-6 py-4 text-center text-foreground/80">₹1,120</td>
                    <td className="px-6 py-4 text-center text-foreground/80">₹1,400</td>
                    <td className="px-6 py-4 text-center text-foreground/80">₹1,600</td>
                  </tr>
                  <tr className="bg-card hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-foreground/80">
                      Child Without Bed
                      <span className="block text-foreground/40 text-xs">5–12 yrs</span>
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/80">₹500</td>
                    <td className="px-6 py-4 text-center text-foreground/80">₹700</td>
                    <td className="px-6 py-4 text-center text-foreground/80">₹1,000</td>
                    <td className="px-6 py-4 text-center text-foreground/80">₹1,200</td>
                  </tr>
                  <tr className="bg-card/60 hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-foreground/80">
                      Child Below 5 Yrs
                    </td>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full border border-primary/20">
                        Complimentary
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Notes */}
            <div className="bg-secondary/30 border-t border-border/50 px-6 py-5 flex flex-col sm:flex-row gap-4 sm:gap-8 text-xs text-foreground/60">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-primary shrink-0" />
                <span>Applicable GST extra on all rates</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-primary shrink-0" />
                <span>Check-in / Check-out: 08:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard size={14} className="text-primary shrink-0" />
                <span>Valid ID proof required (Aadhar, Passport, etc.)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CANCELLATION POLICY ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-secondary/20 border-y border-border/50 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/4 rounded-full blur-[80px]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <SectionHeading title="Cancellation Policy" subtitle="Important" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cancellationPolicies.map((policy, i) => {
              const Icon = policy.icon;
              return (
                <motion.div
                  key={policy.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="bg-card border border-border/50 hover:border-primary/30 rounded-xl p-6 group transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h4 className="font-serif text-base text-foreground group-hover:text-primary transition-colors">{policy.title}</h4>
                  </div>
                  <p className="text-foreground/60 text-sm leading-relaxed">{policy.text}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 p-5 rounded-xl bg-primary/5 border border-primary/15 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-foreground/70 text-sm leading-relaxed">
              By proceeding with a booking, guests acknowledge and agree to the above cancellation and payment terms. 
              For special circumstances, please contact us directly at <span className="text-primary">+91 99999 99999</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────────────────────────────────────── */}
      <section id="gallery" className="py-24 md:py-32 px-4 bg-background relative">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="A Glimpse Inside" subtitle="Gallery" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[250px]">
            {galleryImages.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={cn(
                  "relative rounded-xl overflow-hidden cursor-pointer group",
                  i === 0 ? "md:col-span-2 md:row-span-2" : "",
                  i === 3 ? "lg:col-span-2" : ""
                )}
                onClick={() => setSelectedImage(i)}
              >
                <div className="absolute inset-0 bg-background/30 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                  src={src}
                  alt={`Gallery image ${i + 1}`}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button className="absolute top-6 right-6 text-foreground/70 hover:text-primary transition-colors p-2" onClick={() => setSelectedImage(null)}>
                <X size={32} />
              </button>
              <button className="absolute left-4 md:left-10 text-foreground/50 hover:text-primary transition-colors p-4" onClick={prevImage}>
                <ChevronLeft size={48} strokeWidth={1} />
              </button>
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                src={galleryImages[selectedImage]}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl shadow-black/50 border border-border"
                onClick={(e) => e.stopPropagation()}
              />
              <button className="absolute right-4 md:right-10 text-foreground/50 hover:text-primary transition-colors p-4" onClick={nextImage}>
                <ChevronRight size={48} strokeWidth={1} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── BOOKING & CONTACT ───────────────────────────────────────────────── */}
      <section id="booking" className="py-24 md:py-32 px-4 bg-secondary/20 border-t border-border/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading title="Book Your Stay" subtitle="Reservations" centered={false} />

            <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-xl relative overflow-hidden">
              <AnimatePresence mode="wait">
                {isBookingSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-card z-20 flex flex-col items-center justify-center text-center p-8"
                  >
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-3xl font-serif mb-3">Booking Request Sent!</h3>
                    <p className="text-foreground/70 max-w-sm text-sm leading-relaxed">
                      Your booking request has been received. Our team will contact you shortly to confirm details and arrange the 50% advance payment.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    {/* Name + Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Full Name</label>
                        <Input placeholder="Your Name" {...register("name")} />
                        {errors.name && <span className="text-destructive text-xs">{errors.name.message}</span>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Phone Number</label>
                        <Input placeholder="+91 98765 43210" {...register("phone")} />
                        {errors.phone && <span className="text-destructive text-xs">{errors.phone.message}</span>}
                      </div>
                    </div>

                    {/* Check-in / Check-out */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Check-in</label>
                        <Input type="date" className="[color-scheme:dark]" {...register("checkIn")} />
                        {errors.checkIn && <span className="text-destructive text-xs">{errors.checkIn.message}</span>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Check-out</label>
                        <Input type="date" className="[color-scheme:dark]" {...register("checkOut")} />
                        {errors.checkOut && <span className="text-destructive text-xs">{errors.checkOut.message}</span>}
                      </div>
                    </div>

                    {/* Guests + Plan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Number of Guests</label>
                        <select className={selectCls} {...register("guests")}>
                          <option value="" disabled className="bg-card">Select guests</option>
                          <option value="1" className="bg-card">1 Adult</option>
                          <option value="2" className="bg-card">2 Adults</option>
                          <option value="3" className="bg-card">3 Adults</option>
                          <option value="4+" className="bg-card">4+ Adults</option>
                        </select>
                        {errors.guests && <span className="text-destructive text-xs">{errors.guests.message}</span>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Meal Plan</label>
                        <select className={selectCls} {...register("plan")}>
                          <option value="" disabled className="bg-card">Select plan</option>
                          <option value="EP" className="bg-card">EP — Room Only (₹2,300)</option>
                          <option value="CP" className="bg-card">CP — + Breakfast (₹2,800)</option>
                          <option value="MAP" className="bg-card">MAP — + B&D (₹3,500)</option>
                          <option value="AP" className="bg-card">AP — All Meals (₹4,000)</option>
                        </select>
                        {errors.plan && <span className="text-destructive text-xs">{errors.plan.message}</span>}
                      </div>
                    </div>

                    {/* Extra Bed */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Additional Occupant</label>
                      <select className={selectCls} {...register("extraBed")}>
                        <option value="none" className="bg-card">No extra occupant</option>
                        <option value="extra_bed" className="bg-card">Child with Extra Bed (5–12 yrs)</option>
                        <option value="child_no_bed" className="bg-card">Child without Bed (5–12 yrs)</option>
                      </select>
                      <p className="text-foreground/40 text-xs">Children below 5 years stay complimentary.</p>
                    </div>

                    {/* Estimated Cost */}
                    <AnimatePresence>
                      {estimatedTotal !== null && estimatedTotal > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="rounded-xl bg-primary/8 border border-primary/20 p-4 overflow-hidden"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-foreground/60 text-xs uppercase tracking-wider mb-1">Estimated Total</p>
                              <p className="text-foreground/50 text-xs">
                                {nights} night{nights > 1 ? "s" : ""} · {watchedPlan ? PLANS[watchedPlan as PlanKey]?.fullName : ""}
                                {watchedExtraBed !== "none" ? " · +child" : ""}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-primary text-2xl font-bold font-serif">₹{estimatedTotal.toLocaleString()}</p>
                              <p className="text-foreground/40 text-xs">+ applicable GST</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Special Requests */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Special Requests (Optional)</label>
                      <Textarea placeholder="Any specific requirements or preferences..." {...register("requests")} />
                    </div>

                    <Button type="submit" className="w-full text-base mt-2" disabled={isSubmitting}>
                      {isSubmitting ? "Sending Request..." : "Submit Booking Request"}
                    </Button>

                    <p className="text-center text-foreground/40 text-xs">
                      50% advance required to confirm booking · Subject to availability
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Contact + Map */}
          <motion.div
            id="contact"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col h-full"
          >
            <SectionHeading title="Get In Touch" subtitle="Contact" centered={false} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <a href="tel:+919999999999" className="group p-6 bg-card border border-border/50 rounded-xl hover:border-primary/50 transition-colors flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-serif text-lg mb-1 group-hover:text-primary transition-colors">Call Us</h4>
                  <p className="text-foreground/70 text-sm">+91 99999 99999</p>
                </div>
              </a>

              <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="group p-6 bg-card border border-border/50 rounded-xl hover:border-[#25D366]/50 transition-colors flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg group-hover:bg-[#25D366]/20 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#25D366]" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-serif text-lg mb-1 group-hover:text-[#25D366] transition-colors">WhatsApp</h4>
                  <p className="text-foreground/70 text-sm">Chat with us instantly</p>
                </div>
              </a>

              <a href="mailto:info@villajeevanam.com" className="group p-6 bg-card border border-border/50 rounded-xl hover:border-primary/50 transition-colors flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-serif text-lg mb-1 group-hover:text-primary transition-colors">Email Us</h4>
                  <p className="text-foreground/70 text-sm">info@villajeevanam.com</p>
                </div>
              </a>

              <div className="group p-6 bg-card border border-border/50 rounded-xl flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-serif text-lg mb-1">Location</h4>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    Hill Station Road<br />Valley District, Kerala 685565
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-grow min-h-[300px] rounded-xl overflow-hidden border border-border/50 relative group">
              <div className="absolute inset-0 bg-primary/5 pointer-events-none group-hover:bg-transparent transition-colors z-10" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125322.44173111456!2d76.95317934676103!3d10.08882046849884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0799794d099a6d%3A0x63250e5553c7e0c!2sMunnar%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(80%)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Location Map"
                className="absolute inset-0"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="bg-background border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="font-serif text-2xl text-primary font-bold mb-1">Villa Jeevanam</h2>
            <p className="text-foreground/50 text-sm">A comfortable and premium stay.</p>
          </div>
          <div className="flex gap-6 text-sm text-foreground/50">
            <a href="#rooms" className="hover:text-primary transition-colors">Rooms</a>
            <a href="#tariff" className="hover:text-primary transition-colors">Tariff</a>
            <a href="#booking" className="hover:text-primary transition-colors">Booking</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-foreground/40 text-sm">&copy; {new Date().getFullYear()} Villa Jeevanam</p>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP ───────────────────────────────────────────────── */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-[0_0_24px_rgba(37,211,102,0.5)] transition-all duration-300"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </main>
  );
}
