import { motion } from "framer-motion";
import { Sun, Wind, Droplets, Thermometer, Cloud, CloudRain, CloudLightning, CloudDrizzle, CloudFog, Waves } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
}

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  feelsLike: number;
  marine: { waveHeight: number; wavePeriod: number } | null;
  forecast: ForecastDay[];
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

const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const getDayName = (dateStr: string) => {
  const date = new Date(dateStr + "T12:00:00");
  return dayNames[date.getDay()];
};

const WeatherWidget = () => {
  const { data: weather, isLoading, error } = useQuery({
    queryKey: ["weather-fortim"],
    queryFn: fetchWeather,
    staleTime: 1000 * 60 * 15,
    retry: 1,
  });

  const weatherData = weather || {
    temperature: 31,
    condition: "Ensolarado",
    icon: "sun",
    humidity: 65,
    wind: 18,
    feelsLike: 33,
    marine: null,
    forecast: [],
  };

  const WeatherIcon = iconMap[weatherData.icon] || Sun;
  const isLive = !!weather && !error;

  return (
    <section className="px-6 py-10">
      <div className="max-w-lg mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl font-semibold text-foreground mb-6 text-center"
        >
          Clima em Fortim
          {isLive && (
            <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-palm-green">
              <span className="w-2 h-2 rounded-full bg-palm-green animate-pulse" />
              ao vivo
            </span>
          )}
        </motion.h2>

        {/* Main Weather Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl p-6 mb-4 ocean-gradient text-primary-foreground"
        >
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary-foreground/10 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-primary-foreground/5 blur-xl" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium opacity-80">Fortim, CE</p>
                <p className="text-5xl font-bold tracking-tight mt-1">
                  {weatherData.temperature}°
                </p>
                <p className="text-sm opacity-80 mt-1">{weatherData.condition}</p>
              </div>
              <motion.div
                animate={{ rotate: weatherData.icon === "sun" ? [0, 10, -10, 0] : 0 }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <WeatherIcon className="w-16 h-16 opacity-90" />
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="flex flex-col items-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm py-3 px-2">
                <Thermometer className="w-4 h-4 mb-1 opacity-80" />
                <span className="text-[10px] opacity-70">Sensação</span>
                <span className="text-sm font-semibold">{weatherData.feelsLike}°</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm py-3 px-2">
                <Droplets className="w-4 h-4 mb-1 opacity-80" />
                <span className="text-[10px] opacity-70">Umidade</span>
                <span className="text-sm font-semibold">{weatherData.humidity}%</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm py-3 px-2">
                <Wind className="w-4 h-4 mb-1 opacity-80" />
                <span className="text-[10px] opacity-70">Vento</span>
                <span className="text-sm font-semibold">{weatherData.wind}km/h</span>
              </div>
            </div>

            {/* Marine data */}
            {weatherData.marine && (
              <div className="mt-3 flex items-center justify-center gap-4 text-xs opacity-80">
                <span className="flex items-center gap-1">
                  <Waves className="w-3 h-3" />
                  Ondas: {weatherData.marine.waveHeight}m
                </span>
                <span>Período: {weatherData.marine.wavePeriod}s</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Forecast Card */}
        {weatherData.forecast.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-5"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Próximos dias</h3>
            <div className="space-y-3">
              {weatherData.forecast.map((day, index) => {
                const DayIcon = iconMap[day.icon] || Sun;
                return (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-foreground w-10">
                      {getDayName(day.date)}
                    </span>
                    <div className="flex items-center gap-2 flex-1 justify-center">
                      <DayIcon className="w-4 h-4 text-ocean-medium" />
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {day.condition}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-foreground">{day.tempMax}°</span>
                      <span className="text-muted-foreground">{day.tempMin}°</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default WeatherWidget;
