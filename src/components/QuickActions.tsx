import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, MapPin, Calendar, Phone, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Calendar as CalendarUI } from "@/components/ui/calendar";

const PHONE_NUMBER = "4915754439503";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá! Vim pelo site do Pontal Sereias e gostaria de verificar disponibilidade."
);
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Rua+Córrego+do+Maceió+456,+Barra,+Fortim-CE,+62815-000";

const QuickActions = () => {
  const isMobile = useIsMobile();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>();
  const [copied, setCopied] = useState(false);

  const formatPhone = (num: string) =>
    `+${num.slice(0, 2)} (${num.slice(2, 4)}) ${num.slice(4, 9)}-${num.slice(9)}`;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(`+${PHONE_NUMBER}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppWithDates = () => {
    let msg = "Olá! Vim pelo site do Pontal Sereias e gostaria de verificar disponibilidade";
    if (selectedDates && selectedDates.length > 0) {
      const formatted = selectedDates
        .sort((a, b) => a.getTime() - b.getTime())
        .map((d) => d.toLocaleDateString("pt-BR"))
        .join(", ");
      msg += ` para as datas: ${formatted}`;
    }
    msg += ".";
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    setCalendarOpen(false);
  };

  const handlePhoneClick = () => {
    if (isMobile) {
      window.location.href = `tel:+${PHONE_NUMBER}`;
    } else {
      setPhoneOpen(true);
    }
  };

  const actions = [
    {
      icon: MessageCircle,
      label: "Reservar pelo WhatsApp",
      variant: "whatsapp" as const,
      description: "Resposta rápida",
      onClick: () =>
        window.open(`https://wa.me/${PHONE_NUMBER}?text=${WHATSAPP_MSG}`, "_blank"),
    },
    {
      icon: MapPin,
      label: "Como Chegar",
      variant: "ocean" as const,
      description: "Abrir no GPS",
      onClick: () => window.open(MAPS_URL, "_blank"),
    },
    {
      icon: Calendar,
      label: "Ver Disponibilidade",
      variant: "hero" as const,
      description: "Calendário interativo",
      onClick: () => setCalendarOpen(true),
    },
    {
      icon: Phone,
      label: "Ligar Agora",
      variant: "sunset" as const,
      description: "Atendimento direto",
      onClick: handlePhoneClick,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  // Calendar content shared between Dialog and Drawer
  const CalendarContent = () => (
    <div className="flex flex-col items-center gap-4 p-2">
      <CalendarUI
        mode="multiple"
        selected={selectedDates}
        onSelect={setSelectedDates}
        className="rounded-xl border shadow-sm"
      />
      <Button
        variant="whatsapp"
        size="lg"
        className="w-full"
        onClick={handleWhatsAppWithDates}
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        Consultar disponibilidade via WhatsApp
      </Button>
    </div>
  );

  // Phone content shared between Dialog and Drawer
  const PhoneContent = () => (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="text-2xl font-semibold tracking-wide text-foreground">
        {formatPhone(PHONE_NUMBER)}
      </p>
      <Button variant="ocean" size="lg" className="w-full" onClick={handleCopyPhone}>
        {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
        {copied ? "Copiado!" : "Copiar número"}
      </Button>
    </div>
  );

  return (
    <>
      <section className="px-6 py-8 -mt-4">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-lg mx-auto space-y-3"
        >
          {actions.map((action) => (
            <motion.div key={action.label} variants={item}>
              <Button
                variant={action.variant}
                size="xl"
                className="w-full justify-between group"
                onClick={action.onClick}
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
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Calendar: Drawer on mobile, Dialog on desktop */}
      {isMobile ? (
        <Drawer open={calendarOpen} onOpenChange={setCalendarOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Selecione suas datas</DrawerTitle>
              <DrawerDescription>Escolha as datas desejadas e consulte via WhatsApp</DrawerDescription>
            </DrawerHeader>
            <CalendarContent />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Selecione suas datas</DialogTitle>
              <DialogDescription>Escolha as datas desejadas e consulte via WhatsApp</DialogDescription>
            </DialogHeader>
            <CalendarContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Phone: Dialog on desktop only */}
      <Dialog open={phoneOpen} onOpenChange={setPhoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ligar para Pontal Sereias</DialogTitle>
            <DialogDescription>Copie o número abaixo para ligar</DialogDescription>
          </DialogHeader>
          <PhoneContent />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickActions;
