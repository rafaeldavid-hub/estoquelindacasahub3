import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navigation, Clock, AlertCircle } from "lucide-react";

interface RouteViewerProps {
  address: string;
  productName: string;
}

interface RouteInfo {
  distance: string;
  duration: string;
  latitude: number;
  longitude: number;
}

export function RouteViewer({ address, productName }: RouteViewerProps) {
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Obter localização do usuário
  const getUserLocation = () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalização não suportada neste navegador"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Erro ao obter localização: ${error.message}`));
        }
      );
    });
  };

  // Geocodificar endereço para coordenadas
  const geocodeAddress = (addr: string): Promise<{ lat: number; lng: number }> => {
    return fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addr)}&format=json&limit=1`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          throw new Error("Endereço não encontrado");
        }
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      });
  };

  // Calcular rota usando Open Route Service (alternativa ao Google Maps)
  const calculateRoute = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Obter localização do usuário
      const user = await getUserLocation();
      setUserLocation(user);

      // 2. Geocodificar o endereço
      const destination = await geocodeAddress(address);

      // 3. Calcular rota usando Open Route Service
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${user.lng},${user.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&steps=true`
      );

      if (!response.ok) {
        throw new Error("Erro ao calcular rota");
      }

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = (route.distance / 1000).toFixed(1);
        const durationMinutes = Math.round(route.duration / 60);

        setRouteInfo({
          distance: `${distanceKm} km`,
          duration: durationMinutes < 60 ? `${durationMinutes} min` : `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}min`,
          latitude: destination.lat,
          longitude: destination.lng,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao calcular rota");
    } finally {
      setLoading(false);
    }
  };

  // Iniciar navegação no Google Maps
  const startNavigation = () => {
    if (!routeInfo) return;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${routeInfo.latitude},${routeInfo.longitude}&travelmode=driving`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-3 p-3 bg-muted/20 rounded-lg border border-white/10">
      <div className="flex items-center gap-2">
        <Navigation className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Rota de Entrega</span>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-xs text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 p-2 rounded">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {routeInfo && (
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{routeInfo.duration}</span>
            </div>
            <div className="text-muted-foreground">•</div>
            <div className="text-sm text-muted-foreground">{routeInfo.distance}</div>
          </div>
          <Button
            size="sm"
            onClick={startNavigation}
            className="w-full gap-2"
          >
            <Navigation className="w-4 h-4" />
            Iniciar Navegação
          </Button>
        </div>
      )}

      {!routeInfo && !loading && !error && (
        <Button
          size="sm"
          variant="secondary"
          onClick={calculateRoute}
          className="w-full gap-2"
          disabled={loading}
        >
          <Navigation className="w-4 h-4" />
          Ver Rota
        </Button>
      )}

      {loading && (
        <div className="text-xs text-muted-foreground text-center py-2">
          Calculando rota...
        </div>
      )}
    </div>
  );
}
