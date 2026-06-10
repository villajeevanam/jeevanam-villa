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
    date: "March 2025",
    rating: 5,
    stay: "Honeymoon Stay · EP Plan",
    text: "Absolutely magical experience! The room was immaculate, the views breathtaking, and the staff went above and beyond to make our honeymoon unforgettable. The personalized service made all the difference. We'll be back every anniversary.",
    initials: "AM",
    color: "bg-rose-800",
  },
  {
    name: "Rajesh Pillai",
    location: "Bangalore, Karnataka",
    date: "April 2025",
    rating: 5,
    stay: "Weekend Getaway · AP Plan",
    text: "A truly world-class experience at a very reasonable price. The all-meals plan was fantastic — the home-style Kerala food was exceptional. The staff remembered our preferences from day one. Highly recommend the Deluxe Plus room.",
    initials: "RP",
    color: "bg-amber-800",
  },
  {
    name: "Suresh & Family",
    location: "Chennai, Tamil Nadu",
    date: "October 2024",
    rating: 5,
    stay: "Family Vacation · MAP Plan",
    text: "We stayed in the Deluxe Plus Comfort Room and it was perfect. Spacious, clean, and the kids loved the greenery and fresh air. The management was incredibly helpful with everything. Will be bringing the whole family again!",
    initials: "SF",
    color: "bg-emerald-800",
  },
  {
    name: "Priya Menon",
    location: "Hyderabad, Telangana",
    date: "September 2024",
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
  {
    name: "Kavitha & Rajan Nambiar",
    location: "Calicut, Kerala",
    date: "May 2025",
    rating: 5,
    stay: "Couple's Retreat · MAP Plan",
    text: "We have stayed at many resorts across Kerala but nothing comes close to Villa Jeevanam. The rooms are tastefully designed, the food is home-style and hearty, and the surroundings are so calming. We left feeling completely refreshed.",
    initials: "KR",
    color: "bg-pink-800",
  },
  {
    name: "Sanjay Verma",
    location: "Delhi, NCR",
    date: "June 2025",
    rating: 5,
    stay: "Family Stay · AP Plan",
    text: "Brought my parents here for their retirement celebration and it was the best decision. The staff treated them like royalty — arranging comfortable seating, ensuring the food suited their dietary preferences. Cannot thank the team enough.",
    initials: "SV",
    color: "bg-sky-800",
  },
  {
    name: "Nisha & Deepak Iyer",
    location: "Mumbai, Maharashtra",
    date: "April 2024",
    rating: 5,
    stay: "Honeymoon · EP Plan",
    text: "We were looking for something offbeat and intimate for our honeymoon. Villa Jeevanam was perfect — cozy, private, and genuinely luxurious. The staff is discreet yet always available. Waking up to the misty hills every morning was priceless.",
    initials: "ND",
    color: "bg-fuchsia-800",
  },
  {
    name: "George Mathew",
    location: "Kottayam, Kerala",
    date: "March 2024",
    rating: 5,
    stay: "Weekend Getaway · CP Plan",
    text: "As a Keralite, I've seen many homestays and resorts. Villa Jeevanam stands out for its genuine warmth and the quality of everything — the linen, the food, the service. It feels like a home away from home, but much more beautiful.",
    initials: "GM",
    color: "bg-cyan-800",
  },
  {
    name: "Lakshmi & Venkat Rao",
    location: "Vijayawada, Andhra Pradesh",
    date: "May 2024",
    rating: 4,
    stay: "Family Trip · MAP Plan",
    text: "A lovely property in a serene setting. The rooms were very clean and comfortable. The food was good, though we'd love a bit more variety in the lunch menu. The staff was very courteous and the check-in process was smooth. Would visit again.",
    initials: "LV",
    color: "bg-lime-800",
  },
  {
    name: "Fathima & Shahid",
    location: "Malappuram, Kerala",
    date: "June 2024",
    rating: 5,
    stay: "Anniversary Stay · AP Plan",
    text: "Celebrated our first wedding anniversary here and it was more than we imagined. The staff surprised us with flower arrangements in the room. The food on the all-meals plan was absolutely outstanding — every dish was fresh and flavorful.",
    initials: "FS",
    color: "bg-red-800",
  },
  {
    name: "Rohan Sharma",
    location: "Jaipur, Rajasthan",
    date: "July 2024",
    rating: 5,
    stay: "Solo Trip · EP Plan",
    text: "I travel a lot for leisure and Villa Jeevanam is one of the finest stays I've had anywhere in India. The silence, the greenery, the quality of the room — outstanding. I spent two mornings just sitting on the balcony watching the mist roll in.",
    initials: "RS",
    color: "bg-yellow-800",
  },
  {
    name: "Bindu & Sunil Nair",
    location: "Thrissur, Kerala",
    date: "August 2024",
    rating: 5,
    stay: "Couple's Getaway · MAP Plan",
    text: "Our third visit and still every bit as wonderful as the first time. The housekeeping is impeccable, the food keeps getting better, and the team always remembers us. This place has become our go-to escape from the city every season.",
    initials: "BS",
    color: "bg-green-800",
  },
  {
    name: "Manu Jose",
    location: "Abu Dhabi, UAE",
    date: "May 2024",
    rating: 5,
    stay: "Vacation · AP Plan",
    text: "Every time I come back to Kerala on holiday, I make sure Villa Jeevanam is on the itinerary. The comfort is unmatched, the value is incredible, and the staff treats every guest like a VIP. The views from the Deluxe Plus room are stunning.",
    initials: "MJ",
    color: "bg-purple-800",
  },
  {
    name: "Smitha & Ajith Chandran",
    location: "Kannur, Kerala",
    date: "September 2025",
    rating: 5,
    stay: "Weekend Stay · CP Plan",
    text: "A beautifully run property. The attention to detail in every corner — from the fresh flowers in the room to the perfectly ironed linen — shows how much the owners care. The breakfast was fresh and filling. We had a wonderful two nights.",
    initials: "SA",
    color: "bg-slate-700",
  },
  {
    name: "Krishnapriya Unni",
    location: "Palakkad, Kerala",
    date: "October 2025",
    rating: 5,
    stay: "Solo Retreat · EP Plan",
    text: "Needed a quiet place to recharge and found Villa Jeevanam through a friend's recommendation. It was the perfect choice — peaceful surroundings, a comfortable room, and staff who respect your need for solitude. I'll be back next season for sure.",
    initials: "KU",
    color: "bg-stone-700",
  },
  {
    name: "Prasad & Usha Warrier",
    location: "Ernakulam, Kerala",
    date: "June 2025",
    rating: 5,
    stay: "Family Vacation · AP Plan",
    text: "We brought our children and elderly parents together — a multigenerational trip. The staff handled every need with patience and warmth. The food was excellent across all three meals and accommodated my mother's restricted diet without any fuss.",
    initials: "PU",
    color: "bg-amber-700",
  },
  {
    name: "Arjun & Sreeja",
    location: "Bangalore, Karnataka",
    date: "July 2025",
    rating: 4,
    stay: "Couple's Trip · MAP Plan",
    text: "Gorgeous property with excellent food and lovely views. The room was very comfortable and clean. We would have loved a bit more outdoor seating but that's a minor point. The dinner on the MAP plan was the highlight — rich Kerala flavours all the way.",
    initials: "AS",
    color: "bg-teal-700",
  },
  {
    name: "Reema & Ajay Koshy",
    location: "Kochi, Kerala",
    date: "August 2025",
    rating: 5,
    stay: "Anniversary · EP Plan",
    text: "Came here for our anniversary on a recommendation and I'm so glad we did. The staff made the stay feel incredibly special without us having to ask for anything. The room was beautifully appointed and the views at sunrise were something else.",
    initials: "RK",
    color: "bg-rose-700",
  },
  {
    name: "Naveen Thomas",
    location: "Sharjah, UAE",
    date: "April 2025",
    rating: 5,
    stay: "Vacation · AP Plan",
    text: "Visited with my family during our annual India trip. Every meal was outstanding — especially the breakfast spread. The kids loved the open surroundings and the fresh air. The management is hands-on and genuinely invested in every guest's experience.",
    initials: "NT",
    color: "bg-blue-700",
  },
  {
    name: "Geetha & Mohan Pillai",
    location: "Kollam, Kerala",
    date: "March 2024",
    rating: 5,
    stay: "Leisure Stay · MAP Plan",
    text: "We chose Villa Jeevanam for a quiet three-night break and it exceeded every expectation. The rooms are spotless, the food is soul-satisfying, and the estate is beautiful to walk around. The management team is always present and very professional.",
    initials: "GP",
    color: "bg-violet-700",
  },
  {
    name: "Salman & Rabia Khan",
    location: "Kozhikode, Kerala",
    date: "October 2025",
    rating: 5,
    stay: "Family Getaway · AP Plan",
    text: "Absolutely love this place. We've been recommending it to everyone we know. The all-meals plan is a must — the food is prepared fresh and with so much care. The property itself is stunning and the staff is the best part of the whole experience.",
    initials: "SR",
    color: "bg-orange-700",
  },
  {
    name: "Vivek Chandrasekaran",
    location: "Chennai, Tamil Nadu",
    date: "September 2025",
    rating: 4,
    stay: "Solo Trip · CP Plan",
    text: "A tranquil escape from city life. The room was clean and well-maintained, and the breakfast was fresh and generous. The location is peaceful — exactly what I needed. Would be five stars if there was a wider range of activities available nearby.",
    initials: "VC",
    color: "bg-indigo-700",
  },
  {
    name: "Meenu & Biju George",
    location: "Pathanamthitta, Kerala",
    date: "May 2025",
    rating: 5,
    stay: "Couple's Retreat · AP Plan",
    text: "Every single thing about this stay was perfect. From the moment we arrived to the warm send-off when we left, the team at Villa Jeevanam treated us like family. The food was simply exceptional. This is our new favourite place in Kerala.",
    initials: "MB",
    color: "bg-emerald-700",
  },
  {
    name: "Rithika Suresh",
    location: "Mysuru, Karnataka",
    date: "June 2024",
    rating: 5,
    stay: "Solo Wellness Trip · CP Plan",
    text: "I chose Villa Jeevanam for a self-care trip and it was a wonderful decision. Mornings with misty hill views, fresh breakfasts, and a room that felt like a sanctuary. The staff were warm without being intrusive. Exactly what the soul needed.",
    initials: "RS",
    color: "bg-cyan-700",
  },
  {
    name: "Prakash & Anu Menon",
    location: "Trivandrum, Kerala",
    date: "August 2025",
    rating: 5,
    stay: "Family Stay · MAP Plan",
    text: "A wonderful family holiday. The property is well-maintained and feels premium throughout. The food on the MAP plan was hearty and flavourful — the lunch was particularly impressive. Our children were well looked after. We will definitely return.",
    initials: "PA",
    color: "bg-sky-700",
  },
  {
    name: "Ashwin & Pooja Nair",
    location: "Bangalore, Karnataka",
    date: "March 2026",
    rating: 5,
    stay: "Couple's Getaway · MAP Plan",
    text: "The perfect start to the season. We arrived to a beautifully prepared room, and the service throughout was impeccable. The misty mornings and the freshly cooked breakfast made every day feel special. Already planning our next visit in June.",
    initials: "AP",
    color: "bg-rose-600",
  },
  {
    name: "Sajeev & Lekha Kurup",
    location: "Thrissur, Kerala",
    date: "March 2026",
    rating: 5,
    stay: "Family Vacation · AP Plan",
    text: "We came with our extended family — eight of us in total — and the team handled everything seamlessly. The all-meals plan was brilliant value and every dish was fresh and delicious. The kids couldn't stop talking about the views. Outstanding hospitality.",
    initials: "SK",
    color: "bg-amber-600",
  },
  {
    name: "Rahul Menon",
    location: "Kochi, Kerala",
    date: "April 2026",
    rating: 5,
    stay: "Solo Retreat · EP Plan",
    text: "Took a few days off to decompress and Villa Jeevanam was exactly the right choice. Quiet, clean, and absolutely beautiful surroundings. The staff respected my need for privacy while still being warm and attentive. Left feeling completely recharged.",
    initials: "RM",
    color: "bg-emerald-600",
  },
  {
    name: "Nithya & Kiran Babu",
    location: "Chennai, Tamil Nadu",
    date: "April 2026",
    rating: 5,
    stay: "Honeymoon · EP Plan",
    text: "We chose Villa Jeevanam for our honeymoon after seeing it recommended online and it completely lived up to the hype. The room was romantic and well-appointed, the staff was warm and thoughtful, and the scenery was absolutely breathtaking. Highly recommend.",
    initials: "NK",
    color: "bg-violet-600",
  },
  {
    name: "Jismon & Ancy Varghese",
    location: "Pathanamthitta, Kerala",
    date: "April 2026",
    rating: 4,
    stay: "Weekend Stay · CP Plan",
    text: "A very pleasant stay overall. The room was spotless and the breakfast was delicious and filling. The property is in a beautiful location and the staff is friendly. We'd have liked a bit more evening entertainment options, but the peace and quiet was also welcome.",
    initials: "JV",
    color: "bg-teal-600",
  },
  {
    name: "Deepa & Sreekanth Pillai",
    location: "Kollam, Kerala",
    date: "May 2026",
    rating: 5,
    stay: "Anniversary Stay · AP Plan",
    text: "Celebrated our tenth anniversary here and every moment was magical. The team went above and beyond — the room was decorated on arrival and they arranged a special dinner for us. The food across all three meals was exceptional. We cannot thank them enough.",
    initials: "DS",
    color: "bg-pink-600",
  },
  {
    name: "Muhammed & Shirin Basheer",
    location: "Kozhikode, Kerala",
    date: "May 2026",
    rating: 5,
    stay: "Family Trip · MAP Plan",
    text: "Brought the whole family here for a long weekend and everyone — from grandparents to toddlers — had a wonderful time. The food is incredibly good, the rooms are very comfortable, and the surroundings are peaceful and green. Truly a special property.",
    initials: "MB",
    color: "bg-blue-600",
  },
  {
    name: "Arya Krishnan",
    location: "Calicut, Kerala",
    date: "May 2026",
    rating: 5,
    stay: "Solo Trip · CP Plan",
    text: "A serene little paradise. I stayed for three nights and didn't want to leave. The room had everything I needed, the breakfast was fresh and filling each morning, and the staff were genuinely lovely. Exactly the kind of place you want to keep to yourself.",
    initials: "AK",
    color: "bg-indigo-600",
  },
  {
    name: "Sunil & Rekha Thomas",
    location: "Ernakulam, Kerala",
    date: "June 2026",
    rating: 5,
    stay: "Couple's Retreat · AP Plan",
    text: "Our second visit to Villa Jeevanam and it keeps getting better. The new season felt as fresh and welcoming as ever. The all-meals plan is genuinely outstanding — every dish is made with care and quality ingredients. The staff remembered us from last year, which was a lovely touch.",
    initials: "SR",
    color: "bg-orange-600",
  },
  {
    name: "Govind & Mala Nambiar",
    location: "Kannur, Kerala",
    date: "June 2026",
    rating: 5,
    stay: "Family Stay · MAP Plan",
    text: "Just returned from a three-night stay and we are still talking about it. The attention to detail in this property is remarkable — the cleanliness, the food, the views, the warmth of the staff. It's the kind of place that makes you feel genuinely cared for. Already booked for October.",
    initials: "GN",
    color: "bg-cyan-600",
  },
];

const overallRating = 4.9;
const totalReviews = reviews.length;
const ratingBreakdown = [
  { stars: 5, count: 33 },
  { stars: 4, count: 5 },
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
