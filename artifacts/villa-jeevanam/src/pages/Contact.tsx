import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Phone, Mail, MapPin, CheckCircle2, Info,
  MessageCircle, Send, BedDouble, Users, CalendarCheck
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = "919797982421";

const PLANS = {
  EP:  { label: "EP",  fullName: "European Plan",          desc: "Room Only",                  price: 2300 },
  CP:  { label: "CP",  fullName: "Continental Plan",       desc: "Room + Breakfast",           price: 2800 },
  MAP: { label: "MAP", fullName: "Modified American Plan", desc: "Room + Breakfast + Dinner",  price: 3500 },
  AP:  { label: "AP",  fullName: "American Plan",          desc: "All Meals Included",         price: 4000 },
} as const;
type PlanKey = keyof typeof PLANS;

const EXTRA_BED_RATE: Record<PlanKey, number>  = { EP: 900,  CP: 1120, MAP: 1400, AP: 1600 };
const CHILD_NO_BED_RATE: Record<PlanKey, number> = { EP: 500,  CP: 700,  MAP: 1000, AP: 1200 };

const ROOM_TYPES = [
  "Deluxe Comfort Room",
  "Premium Executive Suite",
  "Family Haven Suite",
];

// ─── SCHEMA ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name:           z.string().min(2,  "Name is required"),
  phone:          z.string().min(10, "Valid phone number required"),
  email:          z.string().email("Valid email required").optional().or(z.literal("")),
  roomType:       z.string().min(1,  "Please select a room type"),
  plan:           z.enum(["EP","CP","MAP","AP"], { required_error: "Please select a meal plan" }),
  numRooms:       z.string().min(1,  "Required"),
  adults:         z.string().min(1,  "Required"),
  children512:    z.string().default("0"),
  childrenBelow5: z.string().default("0"),
  extraBed:       z.enum(["yes","no"]).default("no"),
  checkIn:        z.string().min(1,  "Check-in date required"),
  checkOut:       z.string().min(1,  "Check-out date required"),
  requests:       z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function nightsBetween(a: string, b: string) {
  if (!a || !b) return 0;
  const n = Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
  return n > 0 ? n : 0;
}

function fmtDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function buildWhatsAppUrl(d: FormValues, nights: number): string {
  const plan = d.plan ? PLANS[d.plan] : null;
  const planLabel = plan ? `${plan.label} - ${plan.fullName} (${plan.desc})` : (d.plan || "-");

  const message = `🏨 New Booking Request - Villa Jeevanam

👤 Name: ${d.name || "-"}
📞 Phone: ${d.phone || "-"}
📧 Email: ${d.email || "-"}

🛏️ Room Type: ${d.roomType || "-"}
🍽️ Plan: ${planLabel}
🏘️ Rooms: ${d.numRooms || "-"}

👨‍👩‍👧 Adults: ${d.adults || "-"}
🧒 Children (5-12): ${d.children512 || "0"}
👶 Children (<5): ${d.childrenBelow5 || "0"}
🛌 Extra Bed: ${d.extraBed === "yes" ? "Yes" : "No"}

📅 Check-in: ${fmtDate(d.checkIn)}
📅 Check-out: ${fmtDate(d.checkOut)}${nights > 0 ? `\n🌙 Duration: ${nights} night${nights > 1 ? "s" : ""}` : ""}

📝 Special Request: ${d.requests || "-"}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function calcEstimate(plan: PlanKey, numRooms: number, extraBed: string, children512: number, nights: number) {
  const base = PLANS[plan].price * numRooms;
  const bedCost = extraBed === "yes" ? EXTRA_BED_RATE[plan] : 0;
  const childCost = CHILD_NO_BED_RATE[plan] * children512;
  return (base + bedCost + childCost) * nights;
}

// ─── SELECT STYLE ─────────────────────────────────────────────────────────────

const selectCls =
  "flex h-12 w-full rounded-md border border-border/50 bg-input/50 px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { extraBed: "no", children512: "0", childrenBelow5: "0" },
  });

  const plan         = useWatch({ control, name: "plan" });
  const checkIn      = useWatch({ control, name: "checkIn" });
  const checkOut     = useWatch({ control, name: "checkOut" });
  const extraBed     = useWatch({ control, name: "extraBed" });
  const numRooms     = useWatch({ control, name: "numRooms" });
  const children512  = useWatch({ control, name: "children512" });

  const nights = useMemo(() => nightsBetween(checkIn || "", checkOut || ""), [checkIn, checkOut]);

  const estimatedTotal = useMemo(() => {
    if (!plan || nights === 0) return null;
    const rooms = parseInt(numRooms || "1") || 1;
    const ch = parseInt(children512 || "0") || 0;
    return calcEstimate(plan as PlanKey, rooms, extraBed || "no", ch, nights);
  }, [plan, numRooms, extraBed, children512, nights]);

  const onSubmit = async (data: FormValues) => {
    setStatus("submitting");
    try {
      await fetch("/api/send-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn("Email delivery failed (non-blocking):", e);
    }

    const waUrl = buildWhatsAppUrl(data, nights);
    setStatus("success");
    reset();

    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 1200);
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="pt-32 pb-16 px-4 bg-background text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-primary text-sm tracking-[0.2em] uppercase mb-3">Reach Out</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4">Contact &amp; Booking</h1>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Fill the form and we'll get in touch — your details are also sent directly via WhatsApp for instant response.
          </p>
        </motion.div>
      </div>
      {/* Contact Cards */}
      <section className="py-4 px-4 bg-background">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Phone, title: "Call Us",    value: "+91 97979 82421",       sub: "Mon–Sun, 7 AM – 10 PM",     href: "tel:+919797982421" },
            { icon: Mail,  title: "Email Us",   value: "villajeevanam@gmail.com", sub: "We reply within 24 hours", href: "mailto:villajeevanam@gmail.com" },
            { icon: MapPin, title: "Location",  value: "Hill Station Road",      sub: "Valley District, Kerala 685565", href: null },
          ].map((card, i) => {
            const Icon = card.icon;
            const inner = (
              <motion.div
                {...fadeUp(i * 0.1)}
                className={cn(
                  "group p-6 bg-card border border-border/50 rounded-xl flex items-start gap-4 transition-all duration-300",
                  card.href ? "hover:border-primary/50 cursor-pointer" : ""
                )}
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
            return card.href
              ? <a key={card.title} href={card.href}>{inner}</a>
              : <div key={card.title}>{inner}</div>;
          })}
        </div>
      </section>
      {/* Booking Form + Map */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* ── FORM ── */}
          <motion.div {...fadeUp(0)} className="lg:col-span-3">
            <SectionHeading title="Book Your Stay" subtitle="Reservations" centered={false} />

            <div className="bg-card border border-border/50 rounded-2xl shadow-2xl relative overflow-hidden">
              <AnimatePresence mode="wait">

                {/* SUCCESS STATE */}
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center p-12 min-h-[400px]"
                  >
                    <div className="w-20 h-20 bg-primary/15 rounded-full flex items-center justify-center mb-6 border border-primary/30">
                      <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-3xl font-serif mb-3">Booking Request Sent!</h3>
                    <p className="text-foreground/65 max-w-sm text-sm leading-relaxed mb-6">
                      Your booking details have been received. WhatsApp is opening with your details — our team will confirm shortly.
                    </p>
                    <div className="flex items-center gap-2 text-[#25D366] text-sm font-medium">
                      <MessageCircle size={16} />
                      Opening WhatsApp...
                    </div>

                    <div className="flex gap-3 mt-2">
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/40">
                        <Mail size={13} className="text-primary shrink-0" />
                        <p className="text-foreground/65 text-xs">Email sent to hotel</p>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366]/10 border border-[#25D366]/25">
                        <MessageCircle size={13} className="text-[#25D366] shrink-0" />
                        <p className="text-foreground/65 text-xs">WhatsApp opens with details</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-4 text-foreground/40 text-xs hover:text-primary transition-colors underline underline-offset-2"
                    >
                      Submit another booking
                    </button>
                  </motion.div>

                ) : (

                  /* FORM STATE */
                  (<motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-8 space-y-6"
                  >
                    {/* Section: Guest */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Users size={14} className="text-primary" />
                        <p className="text-primary text-xs font-semibold tracking-widest uppercase">Guest Information</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-foreground/80">Full Name <span className="text-primary">*</span></label>
                          <Input placeholder="Your full name" {...register("name")} />
                          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-foreground/80">Phone Number <span className="text-primary">*</span></label>
                          <Input placeholder="+91 98765 43210" {...register("phone")} />
                          {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-sm font-medium text-foreground/80">Email <span className="text-foreground/40">(optional)</span></label>
                          <Input placeholder="you@example.com" type="email" {...register("email")} />
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-border/40" />
                    {/* Section: Room */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <BedDouble size={14} className="text-primary" />
                        <p className="text-primary text-xs font-semibold tracking-widest uppercase">Room &amp; Plan</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-foreground/80">Room Type <span className="text-primary">*</span></label>
                          <select className={selectCls} {...register("roomType")}>
                            <option value="" disabled className="bg-card">Select room type</option>
                            {ROOM_TYPES.map(r => <option key={r} value={r} className="bg-card">{r}</option>)}
                          </select>
                          {errors.roomType && <p className="text-destructive text-xs">{errors.roomType.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-foreground/80">Meal Plan <span className="text-primary">*</span></label>
                          <select className={selectCls} {...register("plan")}>
                            <option value="" disabled className="bg-card">Select meal plan</option>
                            <option value="EP"  className="bg-card">EP — Room Only (₹2,300/night)</option>
                            <option value="CP"  className="bg-card">CP — + Breakfast (₹2,800/night)</option>
                            <option value="MAP" className="bg-card">MAP — + Breakfast &amp; Dinner (₹3,500/night)</option>
                            <option value="AP"  className="bg-card">AP — All Meals (₹4,000/night)</option>
                          </select>
                          {errors.plan && <p className="text-destructive text-xs">{errors.plan.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-foreground/80">Number of Rooms <span className="text-primary">*</span></label>
                          <select className={selectCls} {...register("numRooms")}>
                            <option value="" disabled className="bg-card">Select</option>
                            {[1,2,3,4,5].map(n => <option key={n} value={String(n)} className="bg-card">{n} Room{n > 1 ? "s" : ""}</option>)}
                          </select>
                          {errors.numRooms && <p className="text-destructive text-xs">{errors.numRooms.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-foreground/80">Adults <span className="text-primary">*</span></label>
                          <select className={selectCls} {...register("adults")}>
                            <option value="" disabled className="bg-card">Select</option>
                            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={String(n)} className="bg-card">{n} Adult{n > 1 ? "s" : ""}</option>)}
                          </select>
                          {errors.adults && <p className="text-destructive text-xs">{errors.adults.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-foreground/80">Children (5–12 yrs)</label>
                          <select className={selectCls} {...register("children512")}>
                            {[0,1,2,3,4,5].map(n => <option key={n} value={String(n)} className="bg-card">{n}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-foreground/80">Children (below 5 yrs)</label>
                          <select className={selectCls} {...register("childrenBelow5")}>
                            {[0,1,2,3,4,5].map(n => <option key={n} value={String(n)} className="bg-card">{n}</option>)}
                          </select>
                          <p className="text-foreground/35 text-xs">Below 5 — complimentary</p>
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-sm font-medium text-foreground/80">Extra Bed Required?</label>
                          <div className="flex gap-3">
                            {(["no", "yes"] as const).map(v => (
                              <label key={v} className={cn(
                                "flex-1 flex items-center justify-center gap-2 h-12 rounded-md border cursor-pointer text-sm font-medium transition-all duration-200",
                                (extraBed || "no") === v
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border/50 bg-input/30 text-foreground/60 hover:border-primary/40"
                              )}>
                                <input type="radio" value={v} {...register("extraBed")} className="sr-only" />
                                {v === "yes" ? "Yes, add extra bed" : "No extra bed"}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-border/40" />
                    {/* Section: Dates */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <CalendarCheck size={14} className="text-primary" />
                        <p className="text-primary text-xs font-semibold tracking-widest uppercase">Dates</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-foreground/80">Check-in Date <span className="text-primary">*</span></label>
                          <Input type="date" className="[color-scheme:dark]" {...register("checkIn")} />
                          {errors.checkIn && <p className="text-destructive text-xs">{errors.checkIn.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-foreground/80">Check-out Date <span className="text-primary">*</span></label>
                          <Input type="date" className="[color-scheme:dark]" {...register("checkOut")} />
                          {errors.checkOut && <p className="text-destructive text-xs">{errors.checkOut.message}</p>}
                        </div>
                      </div>
                    </div>
                    {/* Live Estimate */}
                    <AnimatePresence>
                      {estimatedTotal !== null && estimatedTotal > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="rounded-xl bg-primary/8 border border-primary/25 p-4 flex items-center justify-between">
                            <div>
                              <p className="text-foreground/55 text-xs uppercase tracking-wider mb-1">Estimated Total</p>
                              <p className="text-foreground/45 text-xs">
                                {nights} night{nights > 1 ? "s" : ""} · {plan ? PLANS[plan as PlanKey]?.fullName : ""}
                                {extraBed === "yes" ? " · +extra bed" : ""}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-primary text-2xl font-bold font-serif">₹{estimatedTotal.toLocaleString("en-IN")}</p>
                              <p className="text-foreground/35 text-xs">+ applicable GST</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/* Special Requests */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground/80">Special Requests <span className="text-foreground/40">(optional)</span></label>
                      <Textarea placeholder="Dietary needs, accessibility requirements, celebration arrangements..." {...register("requests")} className="min-h-[80px]" />
                    </div>
                    {/* Submit */}
                    <div className="space-y-3">
                      <Button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full h-13 text-base font-semibold gap-2"
                      >
                        {status === "submitting" ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                            />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Send Booking Request
                          </>
                        )}
                      </Button>

                      <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30">
                        <Info size={13} className="text-primary shrink-0 mt-0.5" />
                        <p className="text-foreground/45 text-xs leading-relaxed">
                          50% advance required to confirm. Our team will contact you shortly to complete the reservation.
                        </p>
                      </div>
                    </div>
                  </motion.form>)
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── SIDEBAR: WhatsApp + Map ── */}
          <motion.div {...fadeUp(0.1)} className="lg:col-span-2 flex flex-col gap-6 lg:sticky lg:top-28">

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-5 bg-[#25D366]/8 border border-[#25D366]/25 rounded-xl hover:border-[#25D366]/60 hover:bg-[#25D366]/12 transition-all duration-300"
            >
              <div className="p-3 bg-[#25D366]/15 rounded-xl group-hover:bg-[#25D366]/25 transition-colors shrink-0">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#25D366]" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <h4 className="text-[#25D366] font-serif text-lg leading-tight group-hover:opacity-80 transition-opacity">Chat on WhatsApp</h4>
                <p className="text-foreground/55 text-sm mt-0.5">Quick response — usually within minutes</p>
                <p className="text-foreground/35 text-xs mt-1">+91 97979 82421</p>
              </div>
            </a>

            {/* Map */}
            <div>
              <h3 className="font-serif text-lg text-foreground mb-3">Find Us</h3>
              <div className="h-[300px] rounded-xl overflow-hidden border border-border/50 relative group">
                <div className="absolute inset-0 bg-primary/5 pointer-events-none group-hover:bg-transparent transition-colors z-10" />
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125322.44173111456!2d76.95317934676103!3d10.08882046849884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0799794d099a6d%3A0x63250e5553c7e0c!2sMunnar%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%" height="100%"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(80%)" }}
                  allowFullScreen={false} loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hotel Location Map"
                  className="absolute inset-0"
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3 p-4 bg-card border border-border/50 rounded-xl">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground/80 text-sm font-medium">Jeevanam Villa Leh</p>
                <p className="text-foreground/50 text-sm">Leh, Ladakh, 194101, India</p>
                <p className="text-foreground/35 text-xs mt-1">Check-in & Check-out: 09:00 AM</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
