import { motion } from "framer-motion";
import { MessageCircle, MapPin, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  {
    icon: MessageCircle,
    label: "Reservar pelo WhatsApp",
    variant: "whatsapp" as const,
    href: "https://wa.me/5585999999999?text=Ol%C3%A1%2C%20vi%20o%20an%C3%BAncio%20no%20Instagram%20e%20gostaria%20de%20verificar%20a%20disponibilidade%20do%20Pontal%20Sereias.",
    description: "Resposta rápida",
  },
  {
    icon: MapPin,
    label: "Como Chegar",
    variant: "ocean" as const,
    href: "https://maps.google.com/?q=Pontal+de+Maceio+Fortim+CE",
    description: "Abrir no GPS",
  },
  {
    icon: Calendar,
    label: "Ver Disponibilidade",
    variant: "hero" as const,
    href: "#disponibilidade",
    description: "Calendário atualizado",
  },
  {
    icon: Phone,
    label: "Ligar Agora",
    variant: "sunset" as const,
    href: "tel:+5585999999999",
    description: "Atendimento direto",
  },
];

const QuickActions = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="px-6 py-8 -mt-4">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-lg mx-auto space-y-3"
      >
        {actions.map((action, index) => (
          <motion.a
            key={action.label}
            href={action.href}
            target={action.href.startsWith("http") ? "_blank" : undefined}
            rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
            variants={item}
            className="block"
          >
            <Button
              variant={action.variant}
              size="xl"
              className="w-full justify-between group"
            >
              <div className="flex items-center gap-3">
                <action.icon className="w-5 h-5" />
                <div className="text-left">
                  <span className="block font-semibold">{action.label}</span>
                  <span className="block text-xs opacity-80 font-normal">
                    {action.description}
                  </span>
                </div>
              </div>
              <motion.span
                className="text-lg"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </Button>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
};

export default QuickActions;
