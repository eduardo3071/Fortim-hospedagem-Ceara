import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Utensils, Waves, ChevronRight, Camera, ChevronDown } from "lucide-react";
import { useState } from "react";
import PlaceGallery from "./PlaceGallery";
import pontalMaceio1 from "@/assets/pontal-maceio-1.png";
import pontalMaceio2 from "@/assets/pontal-maceio-2.png";
import pontalMaceio3 from "@/assets/pontal-maceio-3.png";
import pontalMaceio4 from "@/assets/pontal-maceio-4.png";
import pontalMaceio5 from "@/assets/pontal-maceio-5.png";
import canoaQuebrada1 from "@/assets/canoa-quebrada-1.png";
import canoaQuebrada2 from "@/assets/canoa-quebrada-2.png";
import canoaQuebrada3 from "@/assets/canoa-quebrada-3.png";
import canoaQuebrada4 from "@/assets/canoa-quebrada-4.png";
import canoaQuebrada5 from "@/assets/canoa-quebrada-5.png";
import canoaQuebrada6 from "@/assets/canoa-quebrada-6.png";
import cantoBarra1 from "@/assets/canto-barra-1.png";
import cantoBarra2 from "@/assets/canto-barra-2.png";
import cantoBarra3 from "@/assets/canto-barra-3.png";
import cantoBarra4 from "@/assets/canto-barra-4.png";
import cumbuco1 from "@/assets/cumbuco-1.png";
import cumbuco2 from "@/assets/cumbuco-2.png";
import cumbuco3 from "@/assets/cumbuco-3.png";
import cumbuco4 from "@/assets/cumbuco-4.png";
import cumbuco5 from "@/assets/cumbuco-5.png";

type Category = "praias" | "restaurantes" | "passeios";

interface PlaceImage {
  url: string;
  caption?: string;
}

interface Place {
  name: string;
  description: string;
  distance: string;
  rating?: number;
  images: PlaceImage[];
}

const INITIAL_ITEMS = 4;

const guideData: Record<Category, Place[]> = {
  praias: [
    { 
      name: "Praia de Pontal de Maceió", 
      description: "Principal praia da região, tranquila e charmosa", 
      distance: "0 km", 
      rating: 5,
      images: [
        { url: pontalMaceio1, caption: "Vista panorâmica com coqueiros" },
        { url: pontalMaceio2, caption: "Praia com bandeiras" },
        { url: pontalMaceio3, caption: "Pôr do sol inesquecível" },
        { url: pontalMaceio4, caption: "Jangadas coloridas" },
        { url: pontalMaceio5, caption: "Vista da praia e dunas" },
      ]
    },
    { 
      name: "Praia Canto da Barra", 
      description: "Encontro do rio Jaguaribe com o mar, perfeito para pôr do sol", 
      distance: "3 km", 
      rating: 4.5,
      images: [
        { url: cantoBarra1, caption: "Barraca à beira-mar" },
        { url: cantoBarra2, caption: "Orla com barco azul" },
        { url: cantoBarra3, caption: "Vista do mar e dunas" },
        { url: cantoBarra4, caption: "Barcos ancorados" },
      ]
    },
    { 
      name: "Praia de Fortim", 
      description: "Águas calmas e clima reservado", 
      distance: "5 km", 
      rating: 4.3,
      images: [
        { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800", caption: "Praia tranquila de Fortim" },
        { url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800", caption: "Águas calmas e coqueiros" },
      ]
    },
    { 
      name: "Canoa Quebrada", 
      description: "Falésias coloridas e vida noturna famosa", 
      distance: "~30 km", 
      rating: 4.8,
      images: [
        { url: canoaQuebrada1, caption: "Vista panorâmica com parapente" },
        { url: canoaQuebrada2, caption: "Jangadas nas falésias" },
        { url: canoaQuebrada3, caption: "Praia animada com turistas" },
        { url: canoaQuebrada4, caption: "Vista aérea da orla" },
        { url: canoaQuebrada5, caption: "Passeio de buggy nas dunas" },
        { url: canoaQuebrada6, caption: "Falésias e mar cristalino" },
      ]
    },
    { 
      name: "Majorlândia", 
      description: "Mais tranquila que Canoa, muito autêntica", 
      distance: "~35 km", 
      rating: 4.4,
      images: [
        { url: "https://images.unsplash.com/photo-1504681869696-d977211a5f4c?w=800", caption: "Jangadas coloridas na areia" },
        { url: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800", caption: "Vista da praia de Majorlândia" },
      ]
    },
    { 
      name: "Praia das Fontes", 
      description: "Falésias, fontes naturais e passeios de buggy", 
      distance: "~75 km", 
      rating: 4.6,
      images: [
        { url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800", caption: "Falésias e fontes naturais" },
        { url: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800", caption: "Praia das Fontes ao entardecer" },
      ]
    },
    { 
      name: "Morro Branco", 
      description: "Labirinto de falésias e areia colorida", 
      distance: "~85 km", 
      rating: 4.7,
      images: [
        { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800", caption: "Falésias coloridas de Morro Branco" },
        { url: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800", caption: "Labirinto de falésias" },
      ]
    },
    { 
      name: "Praia do Uruaú", 
      description: "Lagoas e kitesurf", 
      distance: "~95 km", 
      rating: 4.3,
      images: [
        { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800", caption: "Lagoa do Uruaú" },
        { url: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800", caption: "Kitesurf na praia" },
      ]
    },
    { 
      name: "Prainha", 
      description: "Clássica e próxima de Fortaleza", 
      distance: "~120 km", 
      rating: 4.2,
      images: [
        { url: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800", caption: "Prainha de Aquiraz" },
        { url: "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=800", caption: "Barracas à beira-mar" },
      ]
    },
    { 
      name: "Praia do Futuro", 
      description: "Melhor infraestrutura de barracas do Ceará", 
      distance: "~135 km", 
      rating: 4.5,
      images: [
        { url: "https://images.unsplash.com/photo-1520942702018-0862200e6873?w=800", caption: "Barracas na Praia do Futuro" },
        { url: "https://images.unsplash.com/photo-1476673160081-cf065607f449?w=800", caption: "Infraestrutura à beira-mar" },
      ]
    },
    { 
      name: "Cumbuco", 
      description: "Um dos maiores destinos de kitesurf do Brasil", 
      distance: "~165 km", 
      rating: 4.7,
      images: [
        { url: cumbuco1, caption: "Passeio a cavalo na praia" },
        { url: cumbuco2, caption: "Festival de kitesurf" },
        { url: cumbuco3, caption: "Barracas e coqueiros" },
        { url: cumbuco4, caption: "Arco-íris na praia" },
        { url: cumbuco5, caption: "Letreiro Eu ❤️ Cumbuco" },
      ]
    },
    { 
      name: "Lagoinha", 
      description: "Visual cinematográfico com dunas e coqueiros", 
      distance: "~210 km", 
      rating: 4.8,
      images: [
        { url: "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=800", caption: "Dunas e coqueiros de Lagoinha" },
        { url: "https://images.unsplash.com/photo-1484821582734-6c6c9a0e3e13?w=800", caption: "Paisagem cinematográfica" },
      ]
    },
    { 
      name: "Flecheiras", 
      description: "Piscinas naturais e clima sofisticado", 
      distance: "~240 km", 
      rating: 4.5,
      images: [
        { url: "https://images.unsplash.com/photo-1437719417032-8799f6cbf1b7?w=800", caption: "Piscinas naturais de Flecheiras" },
        { url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800", caption: "Praia tranquila e sofisticada" },
      ]
    },
    { 
      name: "Icaraizinho de Amontada", 
      description: "Destino boutique, muito procurado por europeus", 
      distance: "~300 km", 
      rating: 4.6,
      images: [
        { url: "https://images.unsplash.com/photo-1498536806737-46e5c3d3cfa3?w=800", caption: "Praia deserta de Icaraizinho" },
        { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800", caption: "Vila boutique à beira-mar" },
      ]
    },
    { 
      name: "Jericoacoara", 
      description: "Uma das praias mais famosas do mundo, dunas e lagoas cristalinas", 
      distance: "~400 km", 
      rating: 5,
      images: [
        { url: "https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800", caption: "Dunas de Jericoacoara" },
        { url: "https://images.unsplash.com/photo-1495954222046-2c427ecb546d?w=800", caption: "Pôr do sol na Duna do Pôr do Sol" },
        { url: "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800", caption: "Lagoa do Paraíso" },
      ]
    },
  ],
  restaurantes: [
    { 
      name: "Barraca do Zé", 
      description: "Frutos do mar frescos à beira-mar", 
      distance: "200m", 
      rating: 4.9,
      images: [
        { url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800", caption: "Lagosta grelhada" },
        { url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800", caption: "Mesa com vista para o mar" },
      ]
    },
    { 
      name: "Sabor de Fortim", 
      description: "Culinária regional autêntica", 
      distance: "2km", 
      rating: 4.6,
      images: [
        { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800", caption: "Pratos típicos" },
      ]
    },
    { 
      name: "Cabana do Sol", 
      description: "Drinks e petiscos com vista", 
      distance: "500m", 
      rating: 4.7,
      images: [
        { url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800", caption: "Drinks tropicais" },
        { url: "https://images.unsplash.com/photo-1582106245687-cbb466a9f07f?w=800", caption: "Vista do deck" },
      ]
    },
    { 
      name: "Restaurante Mangue", 
      description: "Especialidade em caranguejo", 
      distance: "4km", 
      rating: 4.8,
      images: [
        { url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800", caption: "Caranguejo ao molho" },
      ]
    },
    { 
      name: "Peixada do Meio", 
      description: "Peixe fresco com tempero caseiro e ambiente familiar", 
      distance: "3km", 
      rating: 4.5,
      images: []
    },
    { 
      name: "Bar do Pescador", 
      description: "Petiscos e cerveja gelada com pé na areia", 
      distance: "1km", 
      rating: 4.4,
      images: []
    },
  ],
  passeios: [
    { 
      name: "Passeio de Buggy", 
      description: "Dunas, lagoas e adrenalina", 
      distance: "Saída local", 
      rating: 5,
      images: [
        { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800", caption: "Aventura nas dunas" },
        { url: "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?w=800", caption: "Lagoas escondidas" },
        { url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800", caption: "Vista de tirar o fôlego" },
      ]
    },
    { 
      name: "Kitesurf em Fortim", 
      description: "Aulas e aluguel de equipamentos", 
      distance: "1km", 
      rating: 4.9,
      images: [
        { url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800", caption: "Aulas para iniciantes" },
      ]
    },
    { 
      name: "Passeio de Lancha", 
      description: "Conheça as praias por mar", 
      distance: "3km", 
      rating: 4.7,
      images: [
        { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800", caption: "Navegando pelo litoral" },
        { url: "https://images.unsplash.com/photo-1500259571355-332da5cb07aa?w=800", caption: "Parada em praias desertas" },
      ]
    },
    { 
      name: "Pôr do Sol nas Dunas", 
      description: "Experiência inesquecível", 
      distance: "2km", 
      rating: 5,
      images: [
        { url: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800", caption: "Cores mágicas do entardecer" },
        { url: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800", caption: "Momento perfeito" },
      ]
    },
    { 
      name: "Passeio de Jangada", 
      description: "Experiência autêntica com pescadores locais", 
      distance: "Saída local", 
      rating: 4.8,
      images: []
    },
    { 
      name: "Trilha do Mangue", 
      description: "Caminhada ecológica pelo manguezal", 
      distance: "5km", 
      rating: 4.5,
      images: []
    },
  ],
};

const categories = [
  { id: "praias" as Category, label: "Praias", icon: Waves, emoji: "🏖️" },
  { id: "restaurantes" as Category, label: "Restaurantes", icon: Utensils, emoji: "🍽️" },
  { id: "passeios" as Category, label: "Passeios", icon: MapPin, emoji: "🎯" },
];

const TouristGuide = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("praias");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<Category, boolean>>({
    praias: false,
    restaurantes: false,
    passeios: false,
  });

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
    setIsGalleryOpen(true);
  };

  const handleCloseGallery = () => {
    setIsGalleryOpen(false);
    setTimeout(() => setSelectedPlace(null), 300);
  };

  const toggleExpand = () => {
    setExpandedCategories((prev) => ({
      ...prev,
      [activeCategory]: !prev[activeCategory],
    }));
  };

  const isExpanded = expandedCategories[activeCategory];
  const allPlaces = guideData[activeCategory];
  const visiblePlaces = isExpanded ? allPlaces : allPlaces.slice(0, INITIAL_ITEMS);
  const hasMore = allPlaces.length > INITIAL_ITEMS;

  return (
    <section className="px-6 py-10 bg-sand-light/50">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="text-3xl mb-2 block">🗺️</span>
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Guia de Fortim
          </h2>
          <p className="text-muted-foreground mt-1">
            Descubra o melhor da região
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                activeCategory === category.id
                  ? "ocean-gradient text-white shadow-md scale-105"
                  : "bg-white text-foreground hover:bg-ocean-light/30 hover:scale-102"
              }`}
            >
              <span>{category.emoji}</span>
              <span className="font-medium">{category.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Places List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-3"
          >
            {visiblePlaces.map((place, index) => (
              <motion.div
                key={place.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handlePlaceClick(place)}
                className="glass-card rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-all duration-300 cursor-pointer group active:scale-[0.98]"
              >
                {/* Thumbnail preview */}
                {place.images.length > 0 && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                    <img
                      src={place.images[0].url}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{place.name}</h3>
                    {place.rating && (
                      <span className="text-xs bg-sunset-gold/20 text-sunset-coral px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                        ⭐ {place.rating}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{place.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-ocean-medium font-medium">
                      📍 {place.distance}
                    </span>
                    {place.images.length > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        {place.images.length} fotos
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-ocean-medium group-hover:translate-x-1 transition-all" />
              </motion.div>
            ))}

            {/* Show more / Show less button */}
            {hasMore && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={toggleExpand}
                className="w-full py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-ocean-light/30 text-ocean-medium font-medium text-sm flex items-center justify-center gap-2 hover:bg-ocean-light/20 transition-all duration-300 active:scale-[0.98]"
              >
                <span>{isExpanded ? "Mostrar menos" : `Mostrar mais (${allPlaces.length - INITIAL_ITEMS})`}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          💡 Toque em um card para ver fotos!
        </motion.p>
      </div>

      {/* Gallery Modal */}
      <PlaceGallery
        isOpen={isGalleryOpen}
        onClose={handleCloseGallery}
        place={selectedPlace}
      />
    </section>
  );
};

export default TouristGuide;
