import { motion } from "framer-motion";
import { CheckCircle, Home, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PHONE_NUMBER = "5511930782906";

const ReservaConfirmada = () => {
  const whatsappMsg = encodeURIComponent(
    "Olá! Acabei de realizar o pagamento da minha reserva no Pontal Sereias. Gostaria de confirmar os detalhes."
  );

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <CheckCircle className="w-20 h-20 mx-auto text-[#25D366]" />
        </motion.div>

        <h1 className="text-3xl font-bold text-foreground">Reserva Confirmada!</h1>
        <p className="text-muted-foreground text-lg">
          Seu pagamento foi realizado com sucesso. Em breve entraremos em contato para confirmar todos os detalhes da sua estadia.
        </p>

        <div className="space-y-3 pt-4">
          <Button
            variant="whatsapp"
            size="lg"
            className="w-full"
            onClick={() =>
              window.open(`https://wa.me/${PHONE_NUMBER}?text=${whatsappMsg}`, "_blank")
            }
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Confirmar detalhes via WhatsApp
          </Button>

          <Link to="/" className="block">
            <Button variant="outline" size="lg" className="w-full">
              <Home className="w-5 h-5 mr-2" />
              Voltar ao início
            </Button>
          </Link>
        </div>
      </motion.div>
    </main>
  );
};

export default ReservaConfirmada;
