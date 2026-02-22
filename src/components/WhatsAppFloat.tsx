import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const PHONE_NUMBER = "4915754439503";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá! Vim pelo site do Pontal Sereias e gostaria de mais informações."
);

const WhatsAppFloat = () => {
  return (
    <motion.a
      href={`https://wa.me/${PHONE_NUMBER}?text=${WHATSAPP_MSG}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 flex items-center justify-center hover:shadow-xl hover:shadow-[#25D366]/40 transition-shadow"
      aria-label="Conversar no WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </motion.a>
  );
};

export default WhatsAppFloat;
