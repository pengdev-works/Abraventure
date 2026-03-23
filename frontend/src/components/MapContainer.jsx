import { useEffect, useRef } from 'react';

/**
 * A reusable Map component that uses the Leaflet library from index.html CDN.
 * @param {Array} markers - Array of objects { id, lat, lng, name, type }
 * @param {Object} center - { lat, lng } for the initial center
 * @param {number} zoom - Initial zoom level
 * @param {string} height - CSS height (e.g. '400px')
 * @param {boolean} interactive - Whether markers should be clickable
 */
const MapContainer = ({ markers = [], center = { lat: 17.5995, lng: 120.6200 }, zoom = 10, height = '400px', interactive = true }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    // If Leaflet is not loaded yet, wait or return
    if (!window.L) return;

    // Initialize map if not already done
    if (!mapInstance.current) {
      mapInstance.current = window.L.map(mapRef.current).setView([center.lat, center.lng], zoom);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);
    } else {
      // Update center and zoom if they change
      mapInstance.current.setView([center.lat, center.lng], zoom);
    }

    // Clear existing markers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof window.L.Marker) {
        mapInstance.current.removeLayer(layer);
      }
    });

    // Add new markers
    markers.forEach(marker => {
      if (marker.latitude && marker.longitude) {
        const leafletMarker = window.L.marker([marker.latitude, marker.longitude])
          .addTo(mapInstance.current)
          .bindPopup(`
            <div style="font-family: 'Inter', sans-serif; padding: 5px;">
              <h4 style="margin: 0 0 5px 0; font-weight: 700;">${marker.name}</h4>
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">${marker.location || 'Tourist Spot'}</p>
              ${interactive ? `<a href="/spots/${marker.id}" style="display: block; background: #166534; color: white; text-align: center; padding: 5px 10px; border-radius: 5px; text-decoration: none; font-size: 12px; font-weight: 600;">View Details</a>` : ''}
            </div>
          `);
        
        // If it's a single marker (SpotDetails mode), open popup by default
        if (markers.length === 1) {
          leafletMarker.openPopup();
        }
      }
    });

    // Simple cleanup
    return () => {
      // We don't necessarily want to destroy the map instance every time if just markers change,
      // but Vite HMR can cause issues, so an explicit cleanup is safer if the component unmounts.
    };
  }, [markers, center, zoom, interactive]);

  // Handle Resize (Leaflet needs manual invalidateSize if container size changes)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [height]);

  return (
    <div 
      ref={mapRef} 
      className="bg-gray-200 rounded-2xl shadow-inner border border-gray-100 overflow-hidden"
      style={{ height, width: '100%', zIndex: 10 }}
    ></div>
  );
};

export default MapContainer;
