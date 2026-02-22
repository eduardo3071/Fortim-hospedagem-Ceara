import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Fortim, CE coordinates
const LAT = -4.47;
const LON = -37.71;

// Simple in-memory cache (5 min TTL)
let cachedResponse: { data: string; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Return cached response if fresh
    if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_TTL) {
      return new Response(cachedResponse.data, {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch current weather + daily forecast from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=6&timezone=America/Fortaleza`;

    // Fetch marine data
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LON}&current=wave_height,wave_period&timezone=America/Fortaleza`;

    const [weatherRes, marineRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(marineUrl).catch(() => null),
    ]);

    if (!weatherRes.ok) {
      throw new Error(`Weather API error: ${weatherRes.status}`);
    }

    const weatherData = await weatherRes.json();
    const marineData = marineRes?.ok ? await marineRes.json() : null;

    const current = weatherData.current;
    const daily = weatherData.daily;

    // Map WMO weather codes to Portuguese descriptions and icons
    const weatherCodeMap: Record<number, { condition: string; icon: string }> = {
      0: { condition: "Céu limpo", icon: "sun" },
      1: { condition: "Predominantemente limpo", icon: "sun" },
      2: { condition: "Parcialmente nublado", icon: "cloud-sun" },
      3: { condition: "Nublado", icon: "cloud" },
      45: { condition: "Neblina", icon: "cloud-fog" },
      48: { condition: "Neblina gelada", icon: "cloud-fog" },
      51: { condition: "Garoa leve", icon: "cloud-drizzle" },
      53: { condition: "Garoa moderada", icon: "cloud-drizzle" },
      55: { condition: "Garoa intensa", icon: "cloud-drizzle" },
      61: { condition: "Chuva leve", icon: "cloud-rain" },
      63: { condition: "Chuva moderada", icon: "cloud-rain" },
      65: { condition: "Chuva forte", icon: "cloud-rain" },
      80: { condition: "Pancadas de chuva", icon: "cloud-rain" },
      81: { condition: "Pancadas moderadas", icon: "cloud-rain" },
      82: { condition: "Pancadas fortes", icon: "cloud-rain" },
      95: { condition: "Tempestade", icon: "cloud-lightning" },
    };

    const weatherInfo = weatherCodeMap[current.weather_code] || {
      condition: "Ensolarado",
      icon: "sun",
    };

    // Build forecast array (skip today = index 0, take next 5 days)
    const forecast = [];
    for (let i = 1; i < Math.min(daily.time.length, 6); i++) {
      const code = daily.weather_code[i];
      const info = weatherCodeMap[code] || { condition: "Ensolarado", icon: "sun" };
      forecast.push({
        date: daily.time[i],
        tempMax: Math.round(daily.temperature_2m_max[i]),
        tempMin: Math.round(daily.temperature_2m_min[i]),
        condition: info.condition,
        icon: info.icon,
      });
    }

    const result = {
      temperature: Math.round(current.temperature_2m),
      condition: weatherInfo.condition,
      icon: weatherInfo.icon,
      humidity: Math.round(current.relative_humidity_2m),
      wind: Math.round(current.wind_speed_10m),
      feelsLike: Math.round(current.apparent_temperature),
      marine: marineData?.current
        ? {
            waveHeight: marineData.current.wave_height,
            wavePeriod: marineData.current.wave_period,
          }
        : null,
      forecast,
    };

    const responseBody = JSON.stringify(result);
    cachedResponse = { data: responseBody, timestamp: Date.now() };

    return new Response(responseBody, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Weather fetch error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
