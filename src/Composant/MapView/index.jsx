import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { iconeParSecteur } from "../../Utils/hooks/helpers.js";
import "./mapview.scss";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CENTRE_DEFAUT = [44.5, -0.5];
const ZOOM_DEFAUT = 7;

// Petit composant pour adapter la carte à l'itinéraire
function RoutingFitter({ routeCoords }) {
  const map = useMap();
  useEffect(() => {
    if (routeCoords && routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [routeCoords, map]);
  return null;
}

export default function MapView({ entreprises, hauteur = "420px" }) {
  const avecCoords = entreprises.filter(
    (e) => e.coordonnees?.lat && e.coordonnees?.lng
  );

  const isSingleMode = avecCoords.length === 1;
  const cible = isSingleMode ? avecCoords[0] : null;

  const [adresseDepart, setAdresseDepart] = useState("");
  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  const [userPos, setUserPos] = useState(null);

  // Fonction pour récupérer l'itinéraire via OSRM
  const fetchItineraire = async (startLat, startLng) => {
    if (!cible) return;
    setLoading(true);
    setErreur("");
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${cible.coordonnees.lng},${cible.coordonnees.lat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.code !== "Ok") throw new Error("Impossible de calculer l'itinéraire");
      
      // OSRM renvoie des coordonnées au format [lng, lat], Leaflet attend [lat, lng]
      const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
      setRouteCoords(coords);
      setUserPos([startLat, startLng]);
    } catch (err) {
      console.error(err);
      setErreur("Erreur du calcul d'itinéraire.");
    } finally {
      setLoading(false);
    }
  };

  const handleUtiliserGeoloc = () => {
    if (!navigator.geolocation) {
      setErreur("Géolocalisation non supportée par votre navigateur.");
      return;
    }
    setLoading(true);
    setErreur("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchItineraire(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setErreur("Impossible d'obtenir votre position.");
        setLoading(false);
      }
    );
  };

  const handleRechercheAdresse = async (e) => {
    e.preventDefault();
    if (!adresseDepart.trim()) return;
    setLoading(true);
    setErreur("");
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresseDepart)}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        fetchItineraire(parseFloat(result.lat), parseFloat(result.lon));
      } else {
        setErreur("Adresse introuvable.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setErreur("Erreur recherche d'adresse.");
      setLoading(false);
    }
  };

  return (
    <div className="mapWrapper" style={{ height: hauteur }}>
      {isSingleMode && (
        <div className="routingPanel">
          <p className="routingTitre">🗺️ Itinéraire vers ce commerce</p>
          <div className="routingActions">
            <button
              onClick={handleUtiliserGeoloc}
              disabled={loading}
              className="btnGeoloc"
            >
              📍 Utiliser ma position
            </button>
            <div className="routingSeparator">OU</div>
            <form onSubmit={handleRechercheAdresse} className="routingForm">
              <input
                type="text"
                placeholder="Adresse de départ..."
                value={adresseDepart}
                onChange={(e) => setAdresseDepart(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading}>
                {loading ? "..." : "Go"}
              </button>
            </form>
          </div>
          {erreur && <div className="routingErreur">{erreur}</div>}
        </div>
      )}

      <MapContainer
        center={isSingleMode ? [cible.coordonnees.lat, cible.coordonnees.lng] : CENTRE_DEFAUT}
        zoom={isSingleMode ? 14 : ZOOM_DEFAUT}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {avecCoords.map((e) => (
          <Marker key={e.id} position={[e.coordonnees.lat, e.coordonnees.lng]}>
            <Popup>
              <div className="popup">
                <span className="popupIcone">{iconeParSecteur(e.secteur)}</span>
                <strong>{e.nom}</strong>
                <span className="popupSecteur">{e.secteur}</span>
                <span>{e.adresse}</span>
                {!isSingleMode && (
                  <Link to={`/entreprise/${e.id}`} className="popupLien">
                    Voir la fiche →
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {userPos && (
          <Marker position={userPos}>
            <Popup>Votre point de départ</Popup>
          </Marker>
        )}

        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="var(--c-accent)" weight={5} opacity={0.7} />
        )}

        {routeCoords.length > 0 && <RoutingFitter routeCoords={routeCoords} />}
      </MapContainer>
    </div>
  );
}
