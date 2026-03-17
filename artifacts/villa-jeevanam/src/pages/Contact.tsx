import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Phone, Mail, MapPin, CheckCircle2, Info } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ─── TYPES & DATA ─────────────────────────────────────────────────────────────

const PLANS = {
  EP: { label: "EP", fullName: "European Plan", desc: "Room Only", price: 2300 },
  CP: { label: "CP", fullName: "Continental Plan", desc: "+ Breakfast", price: 2800 },
  MAP: { label: "MAP", fullName: "Modified American Plan", desc: "+ B&D", price: 3500 },
  AP: { label: "AP", fullName: "American Plan", desc: "All Meals", price: 4000 },
};
type PlanKey = keyof typeof PLANS;

const EXTRA_BED: Record<PlanKey, number> = { EP: 900, CP: 1120, MAP: 1400, AP: 1600 };
const CHILD_NO_BED: Record<PlanKey, number> = { EP: 500, CP: 700, MAP: 1000, AP: 1200 };

function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  const n = Math.round(diff / 86400000);
  return n > 0 ? n : 0;
}

function calcEstimate(plan: PlanKey, extraBed: string, nights: number): number {
  const base = PLANS[plan].price;
  const extra =
    extraBed === "extra_bed" ? EXTRA_BED[plan] :
    extraBed === "child_no_bed" ? CHILD_NO_BED[plan] : 0;
  return (base + extra) * nights;
}

// ─── FORM SCHEMA ──────────────────────────────────────────────────────────────

const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  guests: z.string().min(1, "Number of guests is required"),
  plan: z.enum(["EP", "CP", "MAP", "AP"], { required_error: "Please select a plan" }),
  extraBed: z.enum(["none", "extra_bed", "child_no_bed"]).default("none"),
  requests: z.string().optional(),
});
type BookingFormValues = z.infer<typeof bookingSchema>;

const selectCls =
  "flex h-12 w-full rounded-md border border-border/50 bg-input/50 px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

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
    await new Promise(r => setTimeout(r, 1200));
    console.log("Booking:", data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 8000);
  };

  return (
    <Layout>
      {/* Page Hero */}
      <div className="pt-32 pb-16 px-4 bg-background text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-primary text-sm tracking-[0.2em] uppercase mb-3">Reach Out</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4">Contact &amp; Booking</h1>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Send a reservation request or get in touch with our team — we're happy to help plan your stay.
          </p>
        </motion.div>
      </div>

      {/* ── CONTACT CARDS ── */}
      <section className="py-8 px-4 bg-background">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Phone,
              title: "Call Us",
              value: "+91 97979 82421",
              sub: "Mon–Sun, 7 AM – 10 PM",
              href: "tel:+919797982421",
            },
            {
              icon: Mail,
              title: "Email Us",
              value: "villajeevanam@gmail.com",
              sub: "We reply within 24 hours",
              href: "mailto:villajeevanam@gmail.com",
            },
            {
              icon: MapPin,
              title: "Location",
              value: "Hill Station Road",
              sub: "Valley District, Kerala 685565",
              href: null,
            },
          ].map((card, i) => {
            const Icon = card.icon;
            const inner = (
              <motion.div
                {...fadeUp(i * 0.1)}
                className={`group p-6 bg-card border border-border/50 rounded-xl flex items-start gap-4 transition-all duration-300 ${card.href ? "hover:border-primary/50 cursor-pointer" : ""}`}
              >
                <div className="p-3 bg-secondary rounded-lg group-hover:bg-primary/20 transition-colors shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-serif text-lg mb-0.5 group-hover:text-primary transition-colors">{card.title}</h4>
                  <p className="text-foreground/80 text-sm font-medium">{card.value}</p>
                  <p className="text-foreground/45 text-xs mt-0.5">{card.sub}</p>
                </div>
              </motion.div>
            );
            return card.href ? <a key={card.title} href={card.href}>{inner}</a> : <div key={card.title}>{inner}</div>;
          })}
        </div>
      </section>

      {/* ── BOOKING FORM + MAP ── */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Form */}
          <motion.div {...fadeUp(0)}>
            <SectionHeading title="Book Your Stay" subtitle="Reservations" centered={false} />

            <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-xl relative overflow-hidden">
              <AnimatePresence mode="wait">
                {submitted ? (
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
                    <h3 className="text-3xl font-serif mb-3">Request Sent!</h3>
                    <p className="text-foreground/70 max-w-sm text-sm leading-relaxed">
                      Thank you for choosing Villa Jeevanam. Our team will contact you shortly to confirm your dates and arrange the advance payment.
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Full Name</label>
                        <Input placeholder="Your name" {...register("name")} />
                        {errors.name && <span className="text-destructive text-xs">{errors.name.message}</span>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Phone</label>
                        <Input placeholder="+91 98765 43210" {...register("phone")} />
                        {errors.phone && <span className="text-destructive text-xs">{errors.phone.message}</span>}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Email <span className="text-foreground/40">(optional)</span></label>
                      <Input placeholder="you@example.com" type="email" {...register("email")} />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Guests</label>
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
                      <p className="text-foreground/40 text-xs">Children below 5 years complimentary.</p>
                    </div>

                    {/* Estimated Total */}
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

                    {/* Requests */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Special Requests <span className="text-foreground/40">(optional)</span></label>
                      <Textarea placeholder="Any specific requirements or preferences..." {...register("requests")} />
                    </div>

                    <Button type="submit" className="w-full text-base" disabled={isSubmitting}>
                      {isSubmitting ? "Sending Request..." : "Submit Booking Request"}
                    </Button>

                    <div className="flex items-start gap-2 bg-secondary/40 rounded-lg p-3">
                      <Info size={14} className="text-primary shrink-0 mt-0.5" />
                      <p className="text-foreground/50 text-xs leading-relaxed">
                        50% advance required to confirm your booking. Our team will call you to arrange payment.
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Map + WhatsApp */}
          <motion.div {...fadeUp(0.1)} className="flex flex-col gap-6">
            <SectionHeading title="Find Us" subtitle="Location" centered={false} />

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919797982421"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-5 bg-[#25D366]/10 border border-[#25D366]/25 rounded-xl hover:border-[#25D366]/50 transition-all duration-300"
            >
              <div className="p-3 bg-[#25D366]/20 rounded-lg group-hover:bg-[#25D366]/30 transition-colors">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#25D366]" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <h4 className="text-[#25D366] font-serif text-lg mb-0.5 group-hover:opacity-80 transition-opacity">Chat on WhatsApp</h4>
                <p className="text-foreground/60 text-sm">Quick response — usually within minutes</p>
              </div>
            </a>

            {/* Map */}
            <div className="flex-grow min-h-[420px] rounded-xl overflow-hidden border border-border/50 relative group">
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

            {/* Address */}
            <div className="flex items-start gap-3 p-4 bg-card border border-border/50 rounded-xl">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground/80 text-sm font-medium">Hill Station Road, Valley District</p>
                <p className="text-foreground/50 text-sm">Kerala – 685565, India</p>
                <p className="text-foreground/40 text-xs mt-1">Check-in from 08:00 AM · Check-out by 08:00 AM</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
