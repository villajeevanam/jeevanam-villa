import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Wifi, Car, Wind, Coffee, Users, Shield, Droplets, Utensils, 
  MapPin, Phone, Mail, CheckCircle2, ChevronLeft, ChevronRight, X
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// --- Data ---

const rooms = [
  {
    id: 1,
    title: "Deluxe Comfort Room",
    description: "Perfect for solo travelers or couples seeking a cozy, elegant space with premium bedding and city views.",
    price: "1,500",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
    features: ["Queen Bed", "En-suite Bathroom", "City View"],
  },
  {
    id: 2,
    title: "Premium Executive Suite",
    description: "Spacious and luxurious, featuring a separate seating area, deep soaking tub, and panoramic views.",
    price: "2,500",
    image: "https://images.unsplash.com/photo-1582719478250-c89fae46583b?w=800&q=80",
    features: ["King Bed", "Living Area", "Mini Bar"],
  },
  {
    id: 3,
    title: "Family Haven Suite",
    description: "Designed for families, offering two adjoining rooms, ample space, and amenities for all ages.",
    price: "3,500",
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

// --- Booking Form Schema ---
const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  guests: z.string().min(1, "Number of guests is required"),
  requests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isBookingSubmitted, setIsBookingSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Booking Request:", data);
    setIsBookingSubmitted(true);
    reset();
    setTimeout(() => setIsBookingSubmitted(false), 5000);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  return (
    <main className="relative bg-background min-h-screen">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Unsplash hero dark luxury hotel interior/exterior */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542314831-c6a420325142?w=1920&q=80')` }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/80 via-background/60 to-background/95" />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-primary tracking-[0.2em] uppercase text-sm md:text-base font-medium mb-6">
              Welcome to Luxury
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground font-bold mb-6 text-glow leading-tight">
              Villa Jeevanam
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Experience a sanctuary of comfort and premium hospitality. 
              Your perfect retreat from the ordinary begins here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#rooms">
                <Button size="lg" className="w-full sm:w-auto text-lg px-10">
                  Book Your Stay
                </Button>
              </a>
              <a href="#gallery">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 bg-background/20 backdrop-blur-sm border-primary/50 hover:border-primary">
                  Explore Gallery
                </Button>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-primary/70 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary/70 to-transparent" />
        </motion.div>
      </section>

      {/* --- ROOMS SECTION --- */}
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
                    <span className="text-primary font-medium text-sm">₹{room.price} <span className="text-xs text-foreground/60">/night</span></span>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-serif text-foreground mb-3 group-hover:text-primary transition-colors">{room.title}</h3>
                  <p className="text-foreground/70 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {room.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {room.features.map(feat => (
                      <span key={feat} className="text-xs px-3 py-1 bg-secondary rounded-full text-foreground/80 border border-border">
                        {feat}
                      </span>
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

      {/* --- AMENITIES SECTION --- */}
      <section id="amenities" className="py-24 md:py-32 px-4 bg-secondary/30 border-y border-border/50 relative overflow-hidden">
        {/* Decorative background element */}
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
              )
            })}
          </div>
        </div>
      </section>

      {/* --- GALLERY SECTION --- */}
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
                  "relative rounded-xl overflow-hidden cursor-pointer group cursor-zoom-in",
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

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button 
                className="absolute top-6 right-6 text-foreground/70 hover:text-primary transition-colors p-2"
                onClick={() => setSelectedImage(null)}
              >
                <X size={32} />
              </button>
              
              <button 
                className="absolute left-4 md:left-10 text-foreground/50 hover:text-primary transition-colors p-4"
                onClick={prevImage}
              >
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

              <button 
                className="absolute right-4 md:right-10 text-foreground/50 hover:text-primary transition-colors p-4"
                onClick={nextImage}
              >
                <ChevronRight size={48} strokeWidth={1} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* --- BOOKING & CONTACT SPLIT SECTION --- */}
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
                    <h3 className="text-3xl font-serif mb-4">Request Received</h3>
                    <p className="text-foreground/70 max-w-sm">
                      Thank you for choosing Villa Jeevanam. Our team will contact you shortly to confirm your reservation and payment details.
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Full Name</label>
                        <Input placeholder="John Doe" {...register("name")} />
                        {errors.name && <span className="text-destructive text-xs">{errors.name.message}</span>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Phone Number</label>
                        <Input placeholder="+91 98765 43210" {...register("phone")} />
                        {errors.phone && <span className="text-destructive text-xs">{errors.phone.message}</span>}
                      </div>
                    </div>

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

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Number of Guests</label>
                      <select 
                        className="flex h-12 w-full rounded-md border border-border/50 bg-input/50 px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                        {...register("guests")}
                      >
                        <option value="" disabled className="bg-card text-muted-foreground">Select guests</option>
                        <option value="1" className="bg-card">1 Adult</option>
                        <option value="2" className="bg-card">2 Adults</option>
                        <option value="3" className="bg-card">3 Adults</option>
                        <option value="4+" className="bg-card">4+ Adults</option>
                      </select>
                      {errors.guests && <span className="text-destructive text-xs">{errors.guests.message}</span>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Special Requests (Optional)</label>
                      <Textarea placeholder="Any specific requirements..." {...register("requests")} />
                    </div>

                    <Button type="submit" className="w-full text-lg mt-4" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Submit Reservation Request"}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Contact Information & Map */}
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
              
              <a href="mailto:info@villajeevanam.com" className="group p-6 bg-card border border-border/50 rounded-xl hover:border-primary/50 transition-colors flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-serif text-lg mb-1 group-hover:text-primary transition-colors">Email Us</h4>
                  <p className="text-foreground/70 text-sm">info@villajeevanam.com</p>
                </div>
              </a>

              <div className="sm:col-span-2 group p-6 bg-card border border-border/50 rounded-xl flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-serif text-lg mb-1">Location</h4>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    123 Luxury Avenue, Hill Station Road<br/>
                    Valley District, Kerala 685565
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Map Container */}
            <div className="flex-grow min-h-[300px] rounded-xl overflow-hidden border border-border/50 relative group">
              <div className="absolute inset-0 bg-primary/5 pointer-events-none group-hover:bg-transparent transition-colors z-10" />
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125322.44173111456!2d76.95317934676103!3d10.08882046849884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0799794d099a6d%3A0x63250e5553c7e0c!2sMunnar%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(80%)' }} 
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

      {/* --- FOOTER --- */}
      <footer className="bg-background border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="font-serif text-2xl text-primary font-bold mb-2">Villa Jeevanam</h2>
            <p className="text-foreground/50 text-sm">A comfortable and premium stay.</p>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-foreground/50 hover:text-primary text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-foreground/50 hover:text-primary text-sm transition-colors">Terms of Service</a>
          </div>
          
          <div className="text-foreground/50 text-sm text-center md:text-right">
            &copy; {new Date().getFullYear()} Villa Jeevanam. All rights reserved.
          </div>
        </div>
      </footer>

      {/* --- FLOATING WHATSAPP BUTTON --- */}
      <a 
        href="https://wa.me/919999999999" 
        target="_blank" 
        rel="norenoopener"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all duration-300 animate-bounce"
        aria-label="Chat on WhatsApp"
      >
        <svg 
          viewBox="0 0 24 24" 
          width="28" 
          height="28" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </a>

    </main>
  );
}
