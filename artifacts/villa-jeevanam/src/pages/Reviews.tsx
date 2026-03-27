import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";

interface Review {
  name: string;
  location: string;
  date: string;
  rating: number;
  stay: string;
  text: string;
  initials: string;
  color: string;
}

const reviews: Review[] = [
  {
    name: "Arun & Meera Nair",
    location: "Kochi, Kerala",
    date: "February 2025",
    rating: 5,
    stay: "Honeymoon Stay · EP Plan",
    text: "Absolutely magical experience! The room was immaculate, the views breathtaking, and the staff went above and beyond to make our honeymoon unforgettable. The personalized service made all the difference. We'll be back every anniversary.",
    initials: "AM",
    color: "bg-rose-800",
  },
  {
    name: "Rajesh Pillai",
    location: "Bangalore, Karnataka",
    date: "January 2025",
    rating: 5,
    stay: "Weekend Getaway · AP Plan",
    text: "A truly world-class experience at a very reasonable price. The all-meals plan was fantastic — the home-style Kerala food was exceptional. The staff remembered our preferences from day one. Highly recommend the Executive Suite.",
    initials: "RP",
    color: "bg-amber-800",
  },
  {
    name: "Suresh & Family",
    location: "Chennai, Tamil Nadu",
    date: "December 2024",
    rating: 5,
    stay: "Family Vacation · MAP Plan",
    text: "We stayed in the Family Haven Suite with our two kids and it was perfect. Spacious, clean, and the kids loved the greenery and fresh air. The management was incredibly helpful with everything. Will be bringing the whole family again!",
    initials: "SF",
    color: "bg-emerald-800",
  },
  {
    name: "Priya Menon",
    location: "Hyderabad, Telangana",
    date: "November 2024",
    rating: 5,
    stay: "Solo Retreat · CP Plan",
    text: "I came here to disconnect, and Villa Jeevanam delivered exactly that. Peaceful, private, and luxurious without being pretentious. The breakfast was fresh and delicious every morning. The staff gave me all the space I needed — perfect.",
    initials: "PM",
    color: "bg-violet-800",
  },
  {
    name: "Thomas & Anita George",
    location: "Pune, Maharashtra",
    date: "October 2024",
    rating: 5,
    stay: "Anniversary Stay · AP Plan",
    text: "We celebrated our 25th anniversary here and it was beyond our expectations. The team arranged a surprise candle-lit dinner for us without us even asking. Exceptional attention to detail from check-in to check-out.",
    initials: "TA",
    color: "bg-blue-800",
  },
  {
    name: "Hari Krishnan",
    location: "Trivandrum, Kerala",
    date: "September 2024",
    rating: 4,
    stay: "Business Trip · EP Plan",
    text: "Stayed here for a short work trip and was pleasantly surprised. The WiFi was reliable, the room was quiet, and the check-in was seamless. The location is beautiful. The only minor thing — the coffee could be stronger! Otherwise excellent.",
    initials: "HK",
    color: "bg-teal-800",
  },
  {
    name: "Divya & Sathish Kumar",
    location: "Coimbatore, Tamil Nadu",
    date: "August 2024",
    rating: 5,
    stay: "Weekend Stay · MAP Plan",
    text: "What a gem! The rooms are elegant, the food is outstanding, and the views are absolutely stunning. We loved every meal — especially the dinner. The staff is warm and attentive. This place sets the bar very high.",
    initials: "DS",
    color: "bg-orange-800",
  },
  {
    name: "Anoop Mathew",
    location: "Dubai, UAE",
    date: "July 2024",
    rating: 5,
    stay: "Vacation · AP Plan",
    text: "Flew in specifically to stay at Villa Jeevanam after a recommendation from a friend, and I wasn't disappointed. The all-inclusive plan is incredible value. The nature, the silence, the food — everything was perfect. A true escape.",
    initials: "AN",
    color: "bg-indigo-800",
  },
];

const overallRating = 4.9;
const totalReviews = reviews.length;
const ratingBreakdown = [
  { stars: 5, count: 7 },
  { stars: 4, count: 1 },
  { stars: 3, count: 0 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
];

function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={i <= rating ? "fill-primary text-primary" : "fill-transparent text-foreground/20"}
        />
      ))}
    </div>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Reviews() {
  return (
    <Layout>
      {/* Page Hero */}
      <div className="pt-32 pb-16 px-4 bg-background text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-primary text-sm tracking-[0.2em] uppercase mb-3">What Guests Say</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4">Guest Reviews</h1>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Hear from the guests who have experienced Villa Jeevanam's hospitality firsthand.
          </p>
        </motion.div>
      </div>

      {/* ── OVERALL RATING ── */}
      <section className="py-12 px-4 bg-secondary/20 border-y border-border/40">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl border border-border/50 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
            {/* Big Score */}
            <div className="text-center shrink-0">
              <p className="text-7xl md:text-8xl font-serif font-bold text-primary leading-none">{overallRating}</p>
              <StarRow rating={5} size={22} />
              <p className="text-foreground/50 text-sm mt-2">{totalReviews} verified reviews</p>
            </div>

            {/* Breakdown */}
            <div className="flex-1 w-full space-y-3">
              {ratingBreakdown.map(({ stars, count }) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm text-foreground/60 w-5 text-right">{stars}</span>
                  <Star size={12} className="fill-primary text-primary shrink-0" />
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(count / totalReviews) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                  <span className="text-sm text-foreground/60 w-4">{count}</span>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
              {[
                { label: "Service", val: "Excellent" },
                { label: "Cleanliness", val: "Spotless" },
                { label: "Food", val: "Outstanding" },
                { label: "Value", val: "Great" },
              ].map(b => (
                <div key={b.label} className="text-center bg-secondary/50 rounded-xl px-4 py-3 border border-border/40">
                  <p className="text-primary text-xs font-semibold">{b.val}</p>
                  <p className="text-foreground/50 text-xs mt-0.5">{b.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEW CARDS ── */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="What Our Guests Say" subtitle="Reviews" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.06)}
                className="bg-card border border-border/50 hover:border-primary/30 rounded-2xl p-7 flex flex-col gap-5 group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full ${review.color} flex items-center justify-center text-white text-sm font-bold font-serif shrink-0`}>
                      {review.initials}
                    </div>
                    <div>
                      <p className="font-serif text-foreground group-hover:text-primary transition-colors">{review.name}</p>
                      <p className="text-foreground/50 text-xs">{review.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StarRow rating={review.rating} size={14} />
                    <p className="text-foreground/40 text-xs mt-1">{review.date}</p>
                  </div>
                </div>

                {/* Stay Type */}
                <div>
                  <span className="inline-block text-xs px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full">
                    {review.stay}
                  </span>
                </div>

                {/* Review Text */}
                <div className="relative">
                  <Quote className="absolute -top-1 -left-1 w-5 h-5 text-primary/20" />
                  <p className="text-foreground/70 text-sm leading-relaxed pl-4">{review.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 bg-secondary/20 border-t border-border/40 text-center">
        <motion.div {...fadeUp(0)}>
          <div className="flex justify-center gap-1 mb-5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-primary text-primary" />
            ))}
          </div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-3">Ready to create your own story?</h2>
          <p className="text-foreground/60 mb-8 max-w-md mx-auto">
            Join our growing family of happy guests. Book your stay at Villa Jeevanam today.
          </p>
          <Link href="/contact">
            <Button size="lg" className="px-12">Book Your Stay</Button>
          </Link>
        </motion.div>
      </section>
    </Layout>
  );
}
