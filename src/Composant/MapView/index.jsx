import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { GoogleMap, Marker, Polyline, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { iconeParSecteur } from "../../Utils/hooks/helpers.js";
import "./mapview.scss";

const CENTRE_DEFAUT = { lat: 43.15, lng: -0.6 };
const ZOOM_DEFAUT = 9;
const BEARN_BOUNDS = {
  north: 43.7,
  south: 42.4,
  west: -0.9,
  east: 0.3,
};
const LIBRARIES = ["places"];

const parsePoint = (point) => {
  if (!point) return null;
  const lat = Number(point.lat);
  const lng = Number(point.lng);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
};

export default function MapView({ entreprises, hauteur = "420px" }) {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || "",
    libraries: LIBRARIES,
  });

  const avecCoords = useMemo(
    () =>
      entreprises
        .map((e) => ({
          ...e,
          coordonnees: parsePoint(e.coordonnees),
        }))
        .filter((e) => e.coordonnees !== null),
    [entreprises]
  );

  const isSingleMode = avecCoords.length === 1;
  const cible = isSingleMode ? avecCoords[0] : null;

  const [adresseDepart, setAdresseDepart] = useState("");
  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  const [userPos, setUserPos] = useState(null);
  const [busStops, setBusStops] = useState([]);
  const [showBusStops, setShowBusStops] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const mapRef = useRef(null);

  const allMapPoints = useMemo(() => {
    if (routeCoords.length > 0) {
      return routeCoords;
    }
    return avecCoords.map((e) => ({ lat: e.coordonnees.lat, lng: e.coordonnees.lng }));
  }, [avecCoords, routeCoords]);

  const fetchBusStops = useCallback(async () => {
    if (!window.google?.maps?.places) return;

    const service = new window.google.maps.places.PlacesService(document.createElement('div'));

    const request = {
      bounds: new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(BEARN_BOUNDS.south, BEARN_BOUNDS.west),
        new window.google.maps.LatLng(BEARN_BOUNDS.north, BEARN_BOUNDS.east)
      ),
      type: 'bus_station',
      fields: ['name', 'geometry', 'place_id']
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const stops = results.map(result => ({
          id: result.place_id,
          name: result.name,
          position: {
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng()
          }
        }));
        setBusStops(stops);
      }
    });
  }, []);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (showBusStops && isLoaded) {
      fetchBusStops();
    } else {
      setBusStops([]);
    }
  }, [showBusStops, isLoaded, fetchBusStops]);

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
      const coords = data.routes[0].geometry.coordinates
        .map((c) => ({ lat: Number(c[1]), lng: Number(c[0]) }))
        .filter((pos) => Number.isFinite(pos.lat) && Number.isFinite(pos.lng));
      setRouteCoords(coords);
      setUserPos({ lat: Number(startLat), lng: Number(startLng) });
      setActiveMarker(null);
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
      () => {
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

  if (!apiKey) {
    return (
      <div className="mapWrapper mapError">
        <p>Clé Google Maps manquante.</p>
        <p>Ajoutez <strong>REACT_APP_GOOGLE_MAPS_API_KEY</strong> à votre fichier d'environnement.</p>
      </div>
    );
  }

  if (loadError) {
    return <div className="mapWrapper mapError">Erreur de chargement Google Maps.</div>;
  }

  if (!isLoaded) {
    return <div className="mapWrapper mapLoading">Chargement de la carte Google Maps...</div>;
  }

  return (
    <div className="mapWrapper">
      <div className="mapControls">
        <button
          onClick={() => setShowBusStops(!showBusStops)}
          className={`btnBusStops ${showBusStops ? 'active' : ''}`}
        >
          🚌 {showBusStops ? 'Masquer' : 'Afficher'} arrêts de bus
        </button>
      </div>

      {isSingleMode && (
        <div className="routingPanel">
          <p className="routingTitre">🗺️ Itinéraire vers ce commerce</p>
          <div className="routingActions">
            <button onClick={handleUtiliserGeoloc} disabled={loading} className="btnGeoloc">
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

      <GoogleMap
        mapContainerStyle={{ height: hauteur, width: "100%", borderRadius: "var(--radius-md)" }}
        center={isSingleMode ? { lat: cible.coordonnees.lat, lng: cible.coordonnees.lng } : CENTRE_DEFAUT}
        zoom={isSingleMode ? 14 : ZOOM_DEFAUT}
        onLoad={onMapLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: true,
          clickableIcons: false,
          restriction: {
            latLngBounds: BEARN_BOUNDS,
            strictBounds: false,
          },
        }}
      >
        {busStops.map((stop) => (
          <Marker
            key={stop.id}
            position={stop.position}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#007bff" stroke="white" stroke-width="2"/>
                  <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">🚌</text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(24, 24),
              anchor: new window.google.maps.Point(12, 24)
            }}
            onClick={() => setActiveMarker(`bus-${stop.id}`)}
          />
        ))}

        {activeMarker?.startsWith('bus-') && (
          (() => {
            const busStopId = activeMarker.replace('bus-', '');
            const busStop = busStops.find(stop => stop.id === busStopId);
            if (!busStop) return null;
            return (
              <InfoWindow
                position={busStop.position}
                onCloseClick={() => setActiveMarker(null)}
              >
                <div className="popup">
                  <span className="popupIcone">🚌</span>
                  <strong>{busStop.name}</strong>
                  <span className="popupSecteur">Arrêt de bus</span>
                </div>
              </InfoWindow>
            );
          })()
        )}

        {avecCoords.map((e) => {
          const position = { lat: e.coordonnees.lat, lng: e.coordonnees.lng };
          return (
            <Marker key={e.id} position={position} onClick={() => setActiveMarker(e.id)} />
          );
        })}

        {activeMarker && !activeMarker.startsWith('bus-') && (
          (() => {
            const entreprise = avecCoords.find((e) => e.id === activeMarker);
            if (!entreprise) return null;
            const position = { lat: entreprise.coordonnees.lat, lng: entreprise.coordonnees.lng };
            return (
              <InfoWindow position={position} onCloseClick={() => setActiveMarker(null)}>
                <div className="popup">
                  <span className="popupIcone">{iconeParSecteur(entreprise.secteur)}</span>
                  <strong>{entreprise.nom}</strong>
                  <span className="popupSecteur">{entreprise.secteur}</span>
                  <span>{entreprise.adresse}</span>
                  {!isSingleMode && (
                    <Link to={`/entreprise/${entreprise.id}`} className="popupLien">
                      Voir la fiche →
                    </Link>
                  )}
                </div>
              </InfoWindow>
            );
          })()
        )}

        {userPos && <Marker position={userPos} />}

        {routeCoords.length > 0 && (
          <Polyline
            path={routeCoords}
            options={{
              strokeColor: "#ff7a18",
              strokeOpacity: 0.7,
              strokeWeight: 5,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
