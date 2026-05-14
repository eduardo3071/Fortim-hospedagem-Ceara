import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Home } from "lucide-react";
import img1 from "@/assets/maanaim-1.png";
import img2 from "@/assets/maanaim-2.png";
import img3 from "@/assets/maanaim-3.png";
import img4 from "@/assets/maanaim-4.png";
import img5 from "@/assets/maanaim-5.png";

const images = [
  { src: img2, caption: "Sol, mar e boas vibrações" },
  { src: img1, caption: "Regras da Casa" },
  { src: img5, caption: "Mais regras e Wi-Fi" },
  { src: img3, caption: "Cuide de si e do meio ambiente" },
  { src: img4, caption: "Prevenir é preciso" },
];

const CasaMaanaim = () => {
  const [index, setIndex] = useState<number | null>(null);

  const close = () => setIndex(null);
  const next = () => setIndex((i) => (i === null ? null : (i + 1) % images.length));
  const prev = () => setIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));

  return (
    <section className="px-6 py-10 bg-sand-light/30">
      <div className="max-w-lg mx-auto md:max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <Home className="w-7 h-7 mx-auto mb-2 text-ocean-medium" />
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Casa Maanaim
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Boas-vindas, regras e dicas para sua estadia
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {images.map((image, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setIndex(i)}
              className="relative overflow-hidden rounded-xl aspect-square group shadow-sm"
            >
              <img
                src={image.src}
                alt={image.caption}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/95 flex items-center justify-center"
            onClick={close}
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
            >
              <X className="w-6 h-6 text-background" />
            </button>
            <div className="absolute top-4 left-4 z-10 text-background/70 text-sm">
              {index + 1} / {images.length}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 z-10 p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-background" />
            </button>
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[index].src}
                alt={images[index].caption}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <p className="text-background/70 text-sm mt-3">{images[index].caption}</p>
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 z-10 p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-background" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CasaMaanaim;