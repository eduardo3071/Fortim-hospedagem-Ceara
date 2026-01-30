import { motion } from "framer-motion";
import { Users, BedDouble, Wifi, Car, Waves, Coffee } from "lucide-react";

const highlights = [
  { icon: Users, label: "Até 8 pessoas", description: "Espaço confortável" },
  { icon: BedDouble, label: "3 quartos", description: "Todos com ar" },
  { icon: Wifi, label: "Wi-Fi rápido", description: "Trabalhe remotamente" },
  { icon: Car, label: "Estacionamento", description: "Vaga privativa" },
  { icon: Waves, label: "Beira-mar", description: "50m da praia" },
  { icon: Coffee, label: "Cozinha completa", description: "Tudo incluso" },
];

const PropertyHighlights = () => {
  return (
    <section className="px-6 py-8">
      <div className="max-w-lg mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl font-semibold text-foreground mb-4 text-center"
        >
          O Que Oferecemos
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-3"
        >
          {highlights.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-xl p-3 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-ocean-light/50 flex items-center justify-center mx-auto mb-2">
                <item.icon className="w-5 h-5 text-ocean-deep" />
              </div>
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PropertyHighlights;
