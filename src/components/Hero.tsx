import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import heroImage from "@/assets/hero-property.png";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Pontal Sereias - Casa de temporada em Fortim"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-lg mx-auto text-center"
        >
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-serif text-4xl md:text-5xl font-bold text-white mb-3 leading-tight"
          >
            Pontal Sereias
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-white/90 text-lg mb-4 font-light"
          >
            Seu refúgio à beira-mar em Fortim, Ceará
          </motion.p>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="inline-flex items-center gap-2 text-white/80"
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Praia de Pontal de Maceió, Fortim - CE</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60V30C240 10 480 50 720 30C960 10 1200 50 1440 30V60H0Z"
            fill="hsl(45 30% 98%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
