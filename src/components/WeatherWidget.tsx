import { motion } from "framer-motion";
import { Sun, Wind, Droplets, Thermometer, Cloud, CloudRain, CloudLightning, CloudDrizzle, CloudFog } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  feelsLike: number;
  marine: { waveHeight: number; wavePeriod: number } | null;
}

const fetchWeather = async (): Promise<WeatherData> => {
  const { data, error } = await supabase.functions.invoke("weather");
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};

const iconMap: Record<string, React.ElementType> = {
  sun: Sun,
  cloud: Cloud,
  "cloud-sun": Cloud,
  "cloud-rain": CloudRain,
  "cloud-drizzle": CloudDrizzle,
  "cloud-lightning": CloudLightning,
  "cloud-fog": CloudFog,
};

const WeatherWidget = () => {
  const { data: weather, isLoading, error } = useQuery({
    queryKey: ["weather-fortim"],
    queryFn: fetchWeather,
    staleTime: 1000 * 60 * 15, // 15 min cache
    retry: 1,
  });

  // Fallback mock data
  const weatherData = weather || {
    temperature: 31,
    condition: "Ensolarado",
    icon: "sun",
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

  const WeatherIcon = iconMap[weatherData.icon] || Sun;
  const isLive = !!weather && !error;

  return (
    <section className="px-6 py-8">
      <div className="max-w-lg mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl font-semibold text-foreground mb-4 text-center"
        >
          Clima em Fortim - Hoje
          {isLive && (
            <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              ao vivo
            </span>
          )}
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
                <WeatherIcon className="w-8 h-8 text-white" />
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

      </div>
    </section>
  );
};

export default WeatherWidget;
