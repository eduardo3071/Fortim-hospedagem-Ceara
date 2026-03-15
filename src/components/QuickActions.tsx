import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, MapPin, Calendar, Phone, Copy, Check, CreditCard, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
import { type DateRange } from "react-day-picker";
import {
  calculatePricing,
  SEASON_LABELS,
  CLEANING_FEE,
  type PricingBreakdown,
} from "@/lib/pricing";

const PHONE_NUMBER = "5511930782906";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá! Vim pelo site do Pontal Sereias e gostaria de verificar disponibilidade."
);
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Rua+Córrego+do+Maceió+456,+Barra,+Fortim-CE,+62815-000";

const QuickActions = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [copied, setCopied] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const formatPhone = (num: string) =>
    `+${num.slice(0, 2)} (${num.slice(2, 4)}) ${num.slice(4, 9)}-${num.slice(9)}`;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(`+${PHONE_NUMBER}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pricing: PricingBreakdown | null =
    dateRange?.from && dateRange?.to
      ? calculatePricing(dateRange.from, dateRange.to)
      : null;

  const handlePayment = async () => {
    if (!pricing || pricing.nights.length < 1) {
      toast({
        title: "Selecione as datas",
        description: "Escolha a data de check-in e check-out.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPayment(true);
    const checkin = dateRange!.from!.toLocaleDateString("pt-BR");
    const checkout = dateRange!.to!.toLocaleDateString("pt-BR");

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          nights: pricing.nights.length,
          checkin,
          checkout,
          amount: pricing.total,
          subtotal: pricing.subtotal,
          cleaningFee: pricing.cleaningFee,
          couponCode: couponCode.trim() || undefined,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de pagamento não recebida");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast({
        title: "Erro ao processar pagamento",
        description: "Tente novamente ou entre em contato via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleWhatsAppWithDates = () => {
    let msg = "Olá! Vim pelo site do Pontal Sereias e gostaria de verificar disponibilidade";
    if (dateRange?.from && dateRange?.to) {
      const checkin = dateRange.from.toLocaleDateString("pt-BR");
      const checkout = dateRange.to.toLocaleDateString("pt-BR");
      msg += ` para o período de ${checkin} a ${checkout}`;
      if (pricing) {
        msg += ` (${pricing.nights.length} diária${pricing.nights.length > 1 ? "s" : ""}, total R$${pricing.total.toLocaleString("pt-BR")})`;
      }
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

  // Group nights by season for the breakdown summary
  const seasonSummary = pricing
    ? pricing.nights.reduce(
        (acc, n) => {
          if (!acc[n.season]) acc[n.season] = { count: 0, total: 0, price: n.price };
          acc[n.season].count++;
          acc[n.season].total += n.price;
          return acc;
        },
        {} as Record<string, { count: number; total: number; price: number }>
      )
    : null;

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
      icon: CreditCard,
      label: "Reservar e Pagar Online",
      variant: "hero" as const,
      description: "Pagamento seguro via Stripe",
      onClick: () => setCalendarOpen(true),
    },
    {
      icon: MapPin,
      label: "Como Chegar",
      variant: "ocean" as const,
      description: "Abrir no GPS",
      onClick: () => window.open(MAPS_URL, "_blank"),
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

  const CalendarContent = () => (
    <div className="flex flex-col items-center gap-4 p-2">
      <CalendarUI
        mode="range"
        selected={dateRange}
        onSelect={setDateRange}
        month={calendarMonth}
        onMonthChange={setCalendarMonth}
        disabled={{ before: new Date() }}
        numberOfMonths={isMobile ? 1 : 2}
        className="rounded-xl border shadow-sm pointer-events-auto"
      />

      {pricing && pricing.nights.length > 0 && (
        <div className="w-full rounded-xl bg-muted p-4 space-y-2">
          {seasonSummary &&
            Object.entries(seasonSummary).map(([season, data]) => (
              <div key={season} className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {data.count} diária{data.count > 1 ? "s" : ""} — Temporada{" "}
                  {SEASON_LABELS[season as keyof typeof SEASON_LABELS]} (R${data.price})
                </span>
                <span>R${data.total.toLocaleString("pt-BR")}</span>
              </div>
            ))}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Taxa de limpeza</span>
            <span>R${CLEANING_FEE}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-2xl font-bold text-foreground">
              R${pricing.total.toLocaleString("pt-BR")}
            </span>
          </div>
        </div>
      )}

      <div className="w-full space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cupom de desconto"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={handlePayment}
          disabled={!pricing || pricing.nights.length < 1 || isProcessingPayment}
        >
          {isProcessingPayment ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <CreditCard className="w-5 h-5 mr-2" />
          )}
          {isProcessingPayment ? "Processando..." : "Pagar agora"}
        </Button>
        <Button
          variant="whatsapp"
          size="lg"
          className="w-full"
          onClick={handleWhatsAppWithDates}
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Consultar via WhatsApp
        </Button>
      </div>
    </div>
  );

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

      {isMobile ? (
        <Drawer open={calendarOpen} onOpenChange={setCalendarOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Selecione suas datas</DrawerTitle>
              <DrawerDescription>Escolha check-in e check-out</DrawerDescription>
            </DrawerHeader>
            <CalendarContent />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Selecione suas datas</DialogTitle>
              <DialogDescription>Escolha check-in e check-out</DialogDescription>
            </DialogHeader>
            <CalendarContent />
          </DialogContent>
        </Dialog>
      )}

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
