import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Layout } from "@/components/Layout";
import { cn } from "@/lib/utils";

const galleryItems = [
  { src: "/images/exterior/20250530_172546.jpg", label: "Exterior" },
  {
    src: "/images/interior/20250530_173159.jpg",
    label: "Outside",
  },
  {
    src: "/images/exterior/20250530_173057.jpg",
    label: "Outside",
  },
  {
    src: "/images/exterior/20250530_174806.jpg",
    label: "Exterior",
  },
  {
    src: "/images/exterior/20250530_175656.jpg",
    label: "Exterior",
  },
  {
    src: "/images/exterior/20250530_172546.jpg",
    label: "View",
  },
  {
    src: "/images/interior/20250530_174349.jpg",
    label: "Family Suite",
  },
  {
    src: "/images/interior/20250530_173605.jpg",
    label: "Deluxe",
  },
  {
    src: "/images/interior/20250530_174540(1).jpg",
    label: "Bathroom",
  },
  {
    src: "/images/interior/20250530_173034.jpg",
    label: "Lobby",
  },
  {
    src: "/images/interior/20250530_175624.jpg",
    label: "Lobby",
  },
  {
    src: "/images/interior/20250530_175033.jpg",
    label: "View",
  },
  {
    src: "/images/interior/20250530_173848.jpg",
    label: "Bathroom",
  },
  {
    src: "/images/interior/20250530_174540(1).jpg",
    label: "Reception",
  },
];

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected !== null) setSelected((selected + 1) % galleryItems.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected !== null)
      setSelected((selected - 1 + galleryItems.length) % galleryItems.length);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (selected === null) return;
    if (e.key === "ArrowRight")
      setSelected((selected + 1) % galleryItems.length);
    if (e.key === "ArrowLeft")
      setSelected((selected - 1 + galleryItems.length) % galleryItems.length);
    if (e.key === "Escape") setSelected(null);
  };

  return (
    <Layout>
      {/* Page Hero */}
      <div className="pt-32 pb-16 px-4 bg-background text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 bg-cover bg-center"
          style={{ backgroundImage: `url('${galleryItems[0].src}')` }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <p className="text-primary text-sm tracking-[0.2em] uppercase mb-3">
            Visual Journey
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4">
            Photo Gallery
          </h1>
          <p className="text-foreground/60 max-w-xl mx-auto">
            A glimpse into life at Villa Jeevanam — from the elegant interiors
            to the breathtaking landscapes.
          </p>
        </motion.div>
      </div>

      {/* ── GALLERY GRID ── */}
      <section
        className="py-12 px-4 bg-background"
        onKeyDown={handleKey}
        tabIndex={-1}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[220px]">
            {galleryItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: (i % 8) * 0.05 }}
                className={cn(
                  "relative rounded-xl overflow-hidden cursor-pointer group",
                  i === 0 ? "col-span-2 row-span-2" : "",
                  i === 5 ? "md:col-span-2" : "",
                  i === 9 ? "col-span-2" : "",
                )}
                onClick={() => setSelected(i)}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-background/20 group-hover:bg-background/0 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-end justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-medium bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                    {item.label}
                  </span>
                  <span className="p-2 bg-background/60 backdrop-blur-sm rounded-full border border-white/10 text-white">
                    <ZoomIn size={14} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/97 backdrop-blur-xl"
            onClick={() => setSelected(null)}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10">
              <div className="flex items-center gap-3">
                <span className="font-serif text-primary">
                  {galleryItems[selected]?.label}
                </span>
                <span className="text-foreground/40 text-sm">
                  {selected + 1} / {galleryItems.length}
                </span>
              </div>
              <button
                className="p-2 text-foreground/60 hover:text-primary transition-colors"
                onClick={() => setSelected(null)}
              >
                <X size={28} />
              </button>
            </div>

            {/* Nav Arrows */}
            <button
              className="absolute left-4 md:left-8 p-4 text-foreground/40 hover:text-primary transition-colors z-10"
              onClick={prev}
            >
              <ChevronLeft size={48} strokeWidth={1} />
            </button>

            <motion.img
              key={selected}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3 }}
              src={galleryItems[selected]?.src}
              alt={galleryItems[selected]?.label}
              className="max-w-[88vw] max-h-[82vh] object-contain rounded-xl shadow-2xl border border-border/30"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="absolute right-4 md:right-8 p-4 text-foreground/40 hover:text-primary transition-colors z-10"
              onClick={next}
            >
              <ChevronRight size={48} strokeWidth={1} />
            </button>

            {/* Thumbnail strip */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 px-4 py-4 overflow-x-auto">
              {galleryItems.map((item, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(i);
                  }}
                  className={cn(
                    "w-14 h-10 rounded-md overflow-hidden border-2 transition-all shrink-0",
                    i === selected
                      ? "border-primary scale-110"
                      : "border-transparent opacity-50 hover:opacity-80",
                  )}
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
