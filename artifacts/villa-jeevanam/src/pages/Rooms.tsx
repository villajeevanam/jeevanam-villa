import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Info,
  Clock,
  CreditCard,
  AlertTriangle,
  CalendarX,
  Ban,
  CloudLightning,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";

const rooms = [
  {
    id: 1,
    title: "Deluxe Comfort Room",
    description:
      "Perfect for solo travelers or couples seeking a cozy, elegant space. Features premium bedding, en-suite bathroom, and beautiful views of the surrounding greenery.",
    image: "/images/interior/20250530_173605.jpg",
    features: ["Queen Bed", "En-suite Bathroom", "Garden View", '32" Smart TV'],
  },
  {
    id: 2,
    title: "Deluxe Plus Comfort Room",
    description:
      "Enjoy all the elegance of our Deluxe Comfort Room with the added luxury of stunning panoramic hillside views. Wake up to breathtaking scenery from your private vantage point.",
    image: "/images/interior/20250530_174349.jpg",
    features: [
      "Queen Bed",
      "En-suite Bathroom",
      "Panoramic Hill View",
      "Smart TV",
    ],
  },
];

const PLANS = [
  {
    label: "EP",
    fullName: "European Plan",
    desc: "Room only — no meals included",
    price: 2300,
  },
  {
    label: "CP",
    fullName: "Continental Plan",
    desc: "Room + Breakfast",
    price: 2800,
  },
  {
    label: "MAP",
    fullName: "Modified American Plan",
    desc: "Room + Breakfast + Dinner",
    price: 3500,
  },
  {
    label: "AP",
    fullName: "American Plan",
    desc: "Room + All Meals (Breakfast, Lunch & Dinner)",
    price: 4000,
  },
];

const cancellationPolicies = [
  {
    icon: CreditCard,
    title: "Advance Payment",
    text: "50% advance payment is required at the time of booking. This amount is non-refundable.",
  },
  {
    icon: Clock,
    title: "Balance Payment",
    text: "The remaining 50% must be paid at least 8 days prior to your arrival date.",
  },
  {
    icon: CalendarX,
    title: "Cancellation > 7 Days",
    text: "Cancellations made more than 7 days before arrival will incur a 50% cancellation charge.",
  },
  {
    icon: Ban,
    title: "Cancellation ≤ 7 Days",
    text: "Cancellations within 7 days of arrival will be charged 100% of the booking amount.",
  },
  {
    icon: AlertTriangle,
    title: "No Refund for Early Departure",
    text: "No refund will be provided for early check-out or unused services during the stay.",
  },
  {
    icon: CloudLightning,
    title: "External Circumstances",
    text: "No refund for cancellations due to weather, road blockages, or other external factors.",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const selectCls =
  "flex h-12 w-full rounded-md border border-border/50 bg-input/50 px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all";

export default function Rooms() {
  return (
    <Layout>
      {/* Page Hero */}
      <div className="relative pt-32 pb-16 px-4 bg-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1582719478250-c89fae46583b?w=1920&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-3">
              Accommodations
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4">
              Our Rooms
            </h1>
            <p className="text-foreground/60 max-w-xl mx-auto">
              Each room is thoughtfully designed to bring comfort, elegance, and
              a touch of nature to your stay.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── ROOM CARDS ── */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto space-y-10">
          {rooms.map((room, i) => (
            <motion.div
              key={room.id}
              {...fadeUp(i * 0.1)}
              className={`flex flex-col ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-0 rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 bg-card transition-all duration-500 group`}
            >
              <div className="relative lg:w-1/2 h-72 lg:h-auto overflow-hidden">
                <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <p className="text-primary text-xs tracking-widest uppercase mb-2">
                  Room {room.id < 10 ? `0${room.id}` : room.id}
                </p>
                <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-4 group-hover:text-primary transition-colors">
                  {room.title}
                </h3>
                <p className="text-foreground/65 leading-relaxed mb-6">
                  {room.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {room.features.map((feat) => (
                    <span
                      key={feat}
                      className="text-xs px-3 py-1.5 bg-secondary rounded-full text-foreground/80 border border-border"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
                <Link href="/contact">
                  <Button className="w-full sm:w-auto">
                    Reserve This Room
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TARIFF & PLANS ── */}
      <section className="py-20 px-4 bg-secondary/20 border-y border-border/40 relative overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/4 rounded-full blur-[80px]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <SectionHeading title="Tariff & Plans" subtitle="Pricing" />

          {/* Plan Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.label}
                {...fadeUp(i * 0.08)}
                className="bg-card border border-border/50 hover:border-primary/40 rounded-xl p-5 text-center group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-block bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest px-3 py-1 rounded-full mb-3 uppercase">
                  {plan.label}
                </div>
                <p className="text-foreground font-serif text-lg mb-1">
                  {plan.fullName}
                </p>
                <p className="text-foreground/50 text-xs mb-4">{plan.desc}</p>
                <p className="text-primary text-2xl font-bold font-serif">
                  ₹{plan.price.toLocaleString()}
                </p>
                <p className="text-foreground/40 text-xs mt-1">
                  per room / night
                </p>
              </motion.div>
            ))}
          </div>

          {/* Pricing Table */}
          <motion.div
            {...fadeUp(0.1)}
            className="rounded-2xl overflow-hidden border border-border/50 shadow-xl"
          >
            <div className="bg-card/80 px-6 py-4 border-b border-border/50 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <h3 className="font-serif text-lg text-foreground">
                Standard Room — Per Night Rates
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left px-6 py-4 text-foreground/60 font-medium tracking-wide uppercase text-xs">
                      Category
                    </th>
                    <th className="px-6 py-4 text-center text-primary font-semibold">
                      EP
                      <span className="block text-foreground/40 text-[10px] font-normal normal-case">
                        Room Only
                      </span>
                    </th>
                    <th className="px-6 py-4 text-center text-primary font-semibold">
                      CP
                      <span className="block text-foreground/40 text-[10px] font-normal normal-case">
                        + Breakfast
                      </span>
                    </th>
                    <th className="px-6 py-4 text-center text-primary font-semibold">
                      MAP
                      <span className="block text-foreground/40 text-[10px] font-normal normal-case">
                        + B&amp;D
                      </span>
                    </th>
                    <th className="px-6 py-4 text-center text-primary font-semibold">
                      AP
                      <span className="block text-foreground/40 text-[10px] font-normal normal-case">
                        All Meals
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  <tr className="bg-card hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-foreground font-medium">
                      Room Rate
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/90">
                      ₹2,300
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/90">
                      ₹2,800
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/90">
                      ₹3,500
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/90">
                      ₹4,000
                    </td>
                  </tr>
                  <tr className="bg-card/60 hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-foreground/80">
                      Extra Bed{" "}
                      <span className="block text-foreground/40 text-xs">
                        Child 5–12 yrs
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/80">
                      ₹900
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/80">
                      ₹1,120
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/80">
                      ₹1,400
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/80">
                      ₹1,600
                    </td>
                  </tr>
                  <tr className="bg-card hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-foreground/80">
                      Child Without Bed{" "}
                      <span className="block text-foreground/40 text-xs">
                        5–12 yrs
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/80">
                      ₹500
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/80">
                      ₹700
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/80">
                      ₹1,000
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/80">
                      ₹1,200
                    </td>
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
                <span>Valid government ID required at check-in</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CANCELLATION POLICY ── */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="Cancellation Policy" subtitle="Important" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cancellationPolicies.map((policy, i) => {
              const Icon = policy.icon;
              return (
                <motion.div
                  key={policy.title}
                  {...fadeUp(i * 0.07)}
                  className="bg-card border border-border/50 hover:border-primary/30 rounded-xl p-6 group transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h4 className="font-serif text-base text-foreground group-hover:text-primary transition-colors">
                      {policy.title}
                    </h4>
                  </div>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    {policy.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
          <motion.div
            {...fadeUp(0.3)}
            className="mt-8 p-5 rounded-xl bg-primary/5 border border-primary/15 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-foreground/70 text-sm leading-relaxed">
              By proceeding with a booking, guests acknowledge and agree to the
              above cancellation and payment terms. For special circumstances,
              please contact us at{" "}
              <span className="text-primary">+91 97979 82421</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 bg-secondary/20 border-t border-border/40 text-center">
        <motion.div {...fadeUp(0)}>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
            Ready to book your room?
          </h2>
          <p className="text-foreground/60 mb-8 max-w-md mx-auto">
            Choose your dates and plan, and submit your reservation request
            today.
          </p>
          <Link href="/contact">
            <Button size="lg" className="px-12">
              Make a Reservation
            </Button>
          </Link>
        </motion.div>
      </section>
    </Layout>
  );
}
