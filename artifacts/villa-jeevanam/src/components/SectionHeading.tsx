import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeading({ title, subtitle, centered = true }: SectionHeadingProps) {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? "text-center" : "text-left"}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className={`flex items-center gap-4 mb-4 ${centered ? "justify-center" : "justify-start"}`}>
          <div className="h-[1px] w-12 bg-primary/50" />
          <span className="text-primary font-medium tracking-widest uppercase text-xs md:text-sm">
            {subtitle || "Explore"}
          </span>
          <div className="h-[1px] w-12 bg-primary/50" />
        </div>
        <h2 className="text-3xl md:text-5xl font-serif text-foreground capitalize">
          {title}
        </h2>
      </motion.div>
    </div>
  );
}
