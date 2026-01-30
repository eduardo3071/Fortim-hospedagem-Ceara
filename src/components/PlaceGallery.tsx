import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface PlaceGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  place: {
    name: string;
    description: string;
    distance: string;
    rating?: number;
    images: { url: string; caption?: string }[];
  } | null;
}

const PlaceGallery = ({ isOpen, onClose, place }: PlaceGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!place) return null;

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh] bg-background">
        <DrawerHeader className="text-left pb-2">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="font-serif text-xl text-foreground">
                {place.name}
              </DrawerTitle>
              <DrawerDescription className="text-muted-foreground">
                {place.description}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <button className="p-2 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </DrawerClose>
          </div>
          {place.rating && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm bg-sunset-gold/20 text-sunset-coral px-3 py-1 rounded-full font-medium">
                ⭐ {place.rating}
              </span>
              <span className="text-sm text-ocean-medium font-medium">
                📍 {place.distance}
              </span>
            </div>
          )}
        </DrawerHeader>

        <div className="px-4 pb-8">
          {place.images.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {place.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl"
                    >
                      <img
                        src={image.url}
                        alt={image.caption || `${place.name} - Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <p className="text-white text-sm font-medium">
                            {image.caption}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {place.images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 bg-white/90 hover:bg-white border-none shadow-lg" />
                  <CarouselNext className="right-2 bg-white/90 hover:bg-white border-none shadow-lg" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="aspect-[4/3] bg-muted rounded-xl flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                📷 Fotos em breve...
              </p>
            </div>
          )}

          {/* Image counter */}
          {place.images.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {place.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex
                      ? "bg-ocean-medium"
                      : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-muted-foreground">
              💡 Pergunte ao anfitrião sobre dicas exclusivas!
            </p>
          </motion.div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PlaceGallery;
