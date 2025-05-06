import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAppSelector, useAppDispatch } from '@/hooks/useAppSelector';
import { fetchTrucks } from '@/store/trucksSlice';

// Define a proper type for our truck data
interface TruckData {
  id: number;
  lngLat: [number, number];
  name: string;
  status: string;
  lastUpdate: string;
}

const TruckLocationMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(localStorage.getItem('mapbox_token') || '');
  const [showTokenInput, setShowTokenInput] = useState(!mapboxToken);
  const [isUsingStaticData, setIsUsingStaticData] = useState(true); // Toggle for static vs API data
  
  const dispatch = useAppDispatch();
  const { trucks, loading, error } = useAppSelector(state => state.trucks);

  // Sample static truck data
  const sampleTrucks: TruckData[] = [
    {
      id: 1,
      lngLat: [-73.935242, 40.730610],
      name: "Truck 001",
      status: "En Route",
      lastUpdate: "10:30 AM"
    },
    {
      id: 2,
      lngLat: [-87.623177, 41.881832],
      name: "Truck 002",
      status: "Delivering",
      lastUpdate: "10:45 AM"
    },
    {
      id: 3,
      lngLat: [-122.419416, 37.774929],
      name: "Truck 003",
      status: "Returning",
      lastUpdate: "11:00 AM"
    },
    {
      id: 4,
      lngLat: [-96.7970, 32.7767],
      name: "Truck 004",
      status: "Loading",
      lastUpdate: "11:15 AM"
    }
  ];

  // Load trucks from API
  useEffect(() => {
    if (!isUsingStaticData) {
      dispatch(fetchTrucks());
    }
  }, [dispatch, isUsingStaticData]);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-96, 37.8], // Center of US
        zoom: 3
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Only add markers once map has loaded
      map.current.on('load', () => {
        // Determine which data source to use
        const truckData = isUsingStaticData ? sampleTrucks : transformTrucksData(trucks);
        
        // Add truck markers
        truckData.forEach(truck => {
          // Create custom marker element
          const el = document.createElement('div');
          el.className = 'truck-marker';
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234f46e5"><path d="M8.965 18a3.5 3.5 0 0 1-6.93 0H1a1 1 0 0 1-1-1v-5.5a1 1 0 0 1 1-1h.75V9.232a3 3 0 0 1 1.537-2.616l3.823-2.201a3 3 0 0 1 2.6-.133l8.59 3.016a3 3 0 0 1 1.7 1.748V10.5h.75a1 1 0 0 1 1 1V17a1 1 0 0 1-1 1h-1.035a3.5 3.5 0 0 1-6.93 0h-3.82ZM16.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM5.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/></svg>')`;
          el.style.backgroundSize = '100%';
          el.style.cursor = 'pointer';

          // Create popup with more detailed information
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold;">${truck.name}</h3>
                <p style="margin: 4px 0;">Status: ${truck.status}</p>
                <p style="margin: 4px 0;">Last Updated: ${truck.lastUpdate}</p>
              </div>
            `);

          // Add marker to map
          new mapboxgl.Marker(el)
            .setLngLat(truck.lngLat)
            .setPopup(popup)
            .addTo(map.current!);
        });
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setShowTokenInput(true);
    }
  };

  // Transform API truck data to the format needed for the map
  const transformTrucksData = (apiTrucks: any[]): TruckData[] => {
    return apiTrucks.filter(truck => truck.currentLocation?.lat && truck.currentLocation?.lng)
      .map(truck => ({
        id: parseInt(truck.id),
        name: `${truck.model} (${truck.plateNumber})`,
        lngLat: [truck.currentLocation.lng, truck.currentLocation.lat],
        status: truck.status,
        lastUpdate: new Date().toLocaleTimeString()
      }));
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('mapbox_token', mapboxToken);
    setShowTokenInput(false);
    initializeMap();
  };

  const toggleDataSource = () => {
    setIsUsingStaticData(!isUsingStaticData);
    // Re-initialize map with new data source
    if (map.current) {
      map.current.remove();
      map.current = null;
      initializeMap();
    }
  };

  useEffect(() => {
    if (!showTokenInput && mapboxToken) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [showTokenInput, isUsingStaticData, trucks]);

  if (showTokenInput) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Mapbox Token Required</AlertTitle>
          <AlertDescription>
            Please enter your Mapbox public token to view the map. You can find this in your Mapbox account dashboard.
          </AlertDescription>
        </Alert>
        <form onSubmit={handleTokenSubmit} className="flex gap-2">
          <Input
            type="text"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            placeholder="Enter your Mapbox public token"
            className="flex-1"
          />
          <Button type="submit">Save Token</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Truck Locations</h2>
        <Button 
          variant="outline" 
          onClick={toggleDataSource} 
          disabled={!isUsingStaticData && loading}
        >
          {loading ? "Loading..." : isUsingStaticData ? "Use API Data" : "Use Static Data"}
        </Button>
      </div>
      
      {!isUsingStaticData && error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}. Using static data instead.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-border">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
    </div>
  );
};

export default TruckLocationMap;
