import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

import heroImage from "@/assets/hero-property.png";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";
import hero5 from "@/assets/hero-5.jpg";
import hero6 from "@/assets/hero-6.jpg";
import hero7 from "@/assets/hero-7.jpg";
import hero8 from "@/assets/hero-8.jpg";
import hero9 from "@/assets/hero-9.jpg";
import hero10 from "@/assets/hero-10.jpg";
import hero11 from "@/assets/hero-11.jpg";
import hero12 from "@/assets/hero-12.png";
import hero13 from "@/assets/hero-13.png";
import hero14 from "@/assets/hero-14.png";
import hero15 from "@/assets/hero-15.png";

const galleryImages = [
  { src: heroImage, caption: "Vista frontal do Pontal Sereias" },
  { src: hero1, caption: "Área externa" },
  { src: hero2, caption: "Espaço de lazer" },
  { src: hero3, caption: "Acomodações" },
  { src: hero4, caption: "Vista privilegiada" },
  { src: hero5, caption: "Área de convivência" },
  { src: hero6, caption: "Detalhes do imóvel" },
  { src: hero7, caption: "Ambientes internos" },
  { src: hero8, caption: "Conforto e natureza" },
  { src: hero9, caption: "Experiência completa" },
  { src: hero10, caption: "Área gourmet" },
  { src: hero12, caption: "Lavabo" },
  { src: hero13, caption: "WC suíte" },
  { src: hero14, caption: "Mezanino" },
  { src: hero15, caption: "Varanda namoradeira" },
  { src: hero11, caption: "Pôr do sol" },
];

const PhotoGallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
  };

  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <section className="px-6 py-10">
      <div className="max-w-lg mx-auto md:max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <Camera className="w-7 h-7 mx-auto mb-2 text-ocean-medium" />
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Conheça o Espaço
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Toque nas fotos para ver em tela cheia
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {galleryImages.map((image, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
              onClick={() => openLightbox(index)}
              className={`relative overflow-hidden rounded-xl group ${
                index === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-square"
              }`}
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
            >
              <X className="w-6 h-6 text-background" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 z-10 text-background/70 text-sm">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-3 z-10 p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-background" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages[lightboxIndex].src}
                alt={galleryImages[lightboxIndex].caption}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <p className="text-background/70 text-sm mt-3">
                {galleryImages[lightboxIndex].caption}
              </p>
            </motion.div>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
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

export default PhotoGallery;
