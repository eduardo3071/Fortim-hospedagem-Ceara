import { motion } from "framer-motion";
import { Sun, Wind, Droplets, Thermometer } from "lucide-react";

const WeatherWidget = () => {
  // Mock data - em produção seria via API
  const weatherData = {
    temperature: 31,
    condition: "Ensolarado",
    humidity: 65,
    wind: 18,
    feelsLike: 33,
  };

  const tideData = [
    { time: "05:42", height: "0.3m", type: "Baixa" },
    { time: "11:58", height: "2.4m", type: "Alta" },
    { time: "18:15", height: "0.4m", type: "Baixa" },
    { time: "23:47", height: "2.2m", type: "Alta" },
  ];

  return (
    <section className="px-6 py-8">
      <div className="max-w-lg mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl font-semibold text-foreground mb-4 text-center"
        >
          Clima em Fortim Agora
        </motion.h2>

        {/* Weather Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-6 mb-4"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full ocean-gradient flex items-center justify-center">
                <Sun className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-4xl font-bold text-foreground">
                  {weatherData.temperature}°C
                </p>
                <p className="text-muted-foreground">{weatherData.condition}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-3 rounded-xl bg-ocean-light/30">
              <Thermometer className="w-5 h-5 text-ocean-deep mb-1" />
              <span className="text-xs text-muted-foreground">Sensação</span>
              <span className="font-semibold text-foreground">{weatherData.feelsLike}°</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-ocean-light/30">
              <Droplets className="w-5 h-5 text-ocean-deep mb-1" />
              <span className="text-xs text-muted-foreground">Umidade</span>
              <span className="font-semibold text-foreground">{weatherData.humidity}%</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-ocean-light/30">
              <Wind className="w-5 h-5 text-ocean-deep mb-1" />
              <span className="text-xs text-muted-foreground">Vento</span>
              <span className="font-semibold text-foreground">{weatherData.wind}km/h</span>
            </div>
          </div>
        </motion.div>

        {/* Tide Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            Tábua de Marés - Hoje
          </h3>
          
          <div className="space-y-3">
            {tideData.map((tide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  tide.type === "Alta" 
                    ? "bg-ocean-light/40 border-l-4 border-ocean-medium" 
                    : "bg-sand-light border-l-4 border-sand-warm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{tide.type === "Alta" ? "⬆️" : "⬇️"}</span>
                  <span className="font-medium text-foreground">{tide.type}</span>
                </div>
                <div className="text-right">
                  <span className="block font-semibold text-foreground">{tide.time}</span>
                  <span className="text-sm text-muted-foreground">{tide.height}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            Dados aproximados • Atualizado em tempo real
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WeatherWidget;
