import { motion } from "framer-motion";
import { MapPin, Utensils, Waves, ChevronRight } from "lucide-react";
import { useState } from "react";

type Category = "praias" | "restaurantes" | "passeios";

interface Place {
  name: string;
  description: string;
  distance: string;
  rating?: number;
}

const guideData: Record<Category, Place[]> = {
  praias: [
    { name: "Praia de Pontal de Maceió", description: "A mais bela do Ceará, com dunas e coqueirais", distance: "50m", rating: 5 },
    { name: "Praia de Canoa Quebrada", description: "Famosa pela falésias coloridas", distance: "25km", rating: 4.8 },
    { name: "Praia de Fortim", description: "Tranquila e perfeita para banho", distance: "3km", rating: 4.5 },
    { name: "Praia de Cumbuco", description: "Paraíso do kitesurf", distance: "80km", rating: 4.7 },
  ],
  restaurantes: [
    { name: "Barraca do Zé", description: "Frutos do mar frescos à beira-mar", distance: "200m", rating: 4.9 },
    { name: "Sabor de Fortim", description: "Culinária regional autêntica", distance: "2km", rating: 4.6 },
    { name: "Cabana do Sol", description: "Drinks e petiscos com vista", distance: "500m", rating: 4.7 },
    { name: "Restaurante Mangue", description: "Especialidade em caranguejo", distance: "4km", rating: 4.8 },
  ],
  passeios: [
    { name: "Passeio de Buggy", description: "Dunas, lagoas e adrenalina", distance: "Saída local", rating: 5 },
    { name: "Kitesurf em Fortim", description: "Aulas e aluguel de equipamentos", distance: "1km", rating: 4.9 },
    { name: "Passeio de Lancha", description: "Conheça as praias por mar", distance: "3km", rating: 4.7 },
    { name: "Pôr do Sol nas Dunas", description: "Experiência inesquecível", distance: "2km", rating: 5 },
  ],
};

const categories = [
  { id: "praias" as Category, label: "Praias", icon: Waves, emoji: "🏖️" },
  { id: "restaurantes" as Category, label: "Restaurantes", icon: Utensils, emoji: "🍽️" },
  { id: "passeios" as Category, label: "Passeios", icon: MapPin, emoji: "🎯" },
];

const TouristGuide = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("praias");

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
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeCategory === category.id
                  ? "ocean-gradient text-white shadow-md"
                  : "bg-white text-foreground hover:bg-ocean-light/30"
              }`}
            >
              <span>{category.emoji}</span>
              <span className="font-medium">{category.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Places List */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {guideData[activeCategory].map((place, index) => (
            <motion.div
              key={place.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{place.name}</h3>
                  {place.rating && (
                    <span className="text-xs bg-sunset-gold/20 text-sunset-coral px-2 py-0.5 rounded-full font-medium">
                      ⭐ {place.rating}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{place.description}</p>
                <span className="text-xs text-ocean-medium font-medium mt-1 inline-block">
                  📍 {place.distance}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-ocean-medium transition-colors" />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          💡 Dica: Pergunte sobre roteiros personalizados!
        </motion.p>
      </div>
    </section>
  );
};

export default TouristGuide;
