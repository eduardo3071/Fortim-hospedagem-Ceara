import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Fortim, CE coordinates
const LAT = -4.47;
const LON = -37.71;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch current weather from Open-Meteo (free, no API key)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=America/Fortaleza`;

    // Fetch marine data (wave height as proxy for tide activity)
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LON}&daily=wave_height_max,wave_period_max&current=wave_height,wave_period&timezone=America/Fortaleza`;

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
    };

    return new Response(JSON.stringify(result), {
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
