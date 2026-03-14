import { motion } from "framer-motion";
import { XCircle, Home, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ReservaCancelada = () => {
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
          <XCircle className="w-20 h-20 mx-auto text-destructive" />
        </motion.div>

        <h1 className="text-3xl font-bold text-foreground">Reserva Cancelada</h1>
        <p className="text-muted-foreground text-lg">
          O pagamento não foi concluído. Não se preocupe, nenhum valor foi cobrado.
        </p>

        <div className="space-y-3 pt-4">
          <Link to="/" className="block">
            <Button variant="hero" size="lg" className="w-full">
              <Calendar className="w-5 h-5 mr-2" />
              Tentar novamente
            </Button>
          </Link>

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

export default ReservaCancelada;
