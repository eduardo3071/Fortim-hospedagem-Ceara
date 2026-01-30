import { motion } from "framer-motion";
import { Instagram, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="px-6 py-8 bg-ocean-deep text-white">
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* Logo */}
          <h3 className="font-serif text-xl font-semibold mb-2">
            Pontal Sereias
          </h3>
          <p className="text-white/70 text-sm mb-6">
            Seu paraíso em Fortim, Ceará
          </p>

          {/* Social */}
          <a
            href="https://instagram.com/pontal.sereias"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors mb-6"
          >
            <Instagram className="w-5 h-5" />
            <span className="text-sm font-medium">@pontal.sereias</span>
          </a>

          {/* Divider */}
          <div className="border-t border-white/20 pt-6">
            <p className="text-xs text-white/50 flex items-center justify-center gap-1">
              Feito com <Heart className="w-3 h-3 text-sunset-coral fill-sunset-coral" /> para hóspedes especiais
            </p>
            <p className="text-xs text-white/40 mt-2">
              © 2025 Pontal Sereias. Todos os direitos reservados.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
