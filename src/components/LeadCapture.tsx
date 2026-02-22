import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LeadCapture = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Preencha todos os campos",
        description: "Nome e WhatsApp são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase
      .from("leads")
      .insert({ name: name.trim(), phone: phone.trim() });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitted(true);
    toast({
      title: "Cadastro realizado! 🎉",
      description: "Redirecionando para o WhatsApp...",
    });

    const msg = encodeURIComponent(
      `Olá! Meu nome é ${name.trim()} e acabei de me cadastrar no site do Pontal Sereias. Gostaria de reivindicar meu cupom de 10% de desconto na próxima estadia! 🌴`
    );
    setTimeout(() => {
      window.open(`https://wa.me/4915754439503?text=${msg}`, "_blank");
    }, 1500);
  };

  return (
    <section className="px-6 py-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="ocean-gradient rounded-2xl p-6 text-white text-center relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            {!isSubmitted ? (
              <>
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-7 h-7" />
                </div>
                
                <h3 className="font-serif text-xl font-semibold mb-2">
                  Ganhe 10% na Próxima Estadia
                </h3>
                <p className="text-white/80 text-sm mb-6">
                  Cadastre-se e receba ofertas exclusivas direto no seu WhatsApp
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white"
                  />
                  <Input
                    type="tel"
                    placeholder="WhatsApp (com DDD)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white"
                  />
                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    {isLoading ? "Enviando..." : "Quero Meu Desconto"}
                  </Button>
                </form>

                <p className="text-xs text-white/60 mt-4">
                  🔒 Seus dados estão seguros conosco
                </p>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6"
              >
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-sunset-gold" />
                <h3 className="font-serif text-xl font-semibold mb-2">
                  Cadastro Confirmado!
                </h3>
                <p className="text-white/80">
                  Prepare-se para ofertas incríveis no seu WhatsApp 🌴
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LeadCapture;
