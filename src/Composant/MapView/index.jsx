import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { GoogleMap, Marker, Polyline, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { iconeParSecteur } from "../../Utils/hooks/helpers.js";
import "./mapview.scss";

const CENTRE_DEFAUT = { lat: 44.5, lng: -0.5 };
const ZOOM_DEFAUT = 7;
const LIBRARIES = ["places"];

export default function MapView({ entreprises, hauteur = "420px" }) {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || "",
    libraries: LIBRARIES,
  });

  const avecCoords = useMemo(
    () => entreprises.filter((e) => e.coordonnees?.lat && e.coordonnees?.lng),
    [entreprises]
  );

  const isSingleMode = avecCoords.length === 1;
  const cible = isSingleMode ? avecCoords[0] : null;

  const [adresseDepart, setAdresseDepart] = useState("");
  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  const [userPos, setUserPos] = useState(null);
  const [transportMode, setTransportMode] = useState("TRANSIT");
  const [activeMarker, setActiveMarker] = useState(null);
  const mapRef = useRef(null);

  const allMapPoints = useMemo(() => {
    if (routeCoords.length > 0) {
      return routeCoords;
    }
    return avecCoords.map((e) => ({ lat: e.coordonnees.lat, lng: e.coordonnees.lng }));
  }, [avecCoords, routeCoords]);

  useEffect(() => {
    if (!mapRef.current || allMapPoints.length === 0) return;
    const bounds = new window.google.maps.LatLngBounds();
    allMapPoints.forEach((pos) => bounds.extend(pos));
    mapRef.current.fitBounds(bounds, { padding: 40 });
  }, [allMapPoints]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const fetchItineraire = async (startLat, startLng) => {
    if (!cible) return;
    if (!window.google?.maps) {
      setErreur("Impossible d'accéder à l'API Google Maps.");
      return;
    }

    setLoading(true);
    setErreur("");
    const directionsService = new window.google.maps.DirectionsService();

    const request = {
      origin: { lat: startLat, lng: startLng },
      destination: { lat: cible.coordonnees.lat, lng: cible.coordonnees.lng },
      travelMode: window.google.maps.TravelMode[transportMode],
      provideRouteAlternatives: false,
    };

    if (transportMode === "TRANSIT") {
      request.transitOptions = {
        modes: [window.google.maps.TransitMode.BUS],
      };
    }

    directionsService.route(request, (result, status) => {
      if (status !== window.google.maps.DirectionsStatus.OK || !result.routes?.[0]) {
        console.error("DirectionsService status", status, result);
        setErreur(
          transportMode === "TRANSIT"
            ? "Aucun itinéraire en bus trouvé. Essayez la voiture."
            : "Erreur du calcul d'itinéraire."
        );
        setLoading(false);
        return;
      }

      const coords = result.routes[0].overview_path.map((p) => ({ lat: p.lat(), lng: p.lng() }));
      setRouteCoords(coords);
      setUserPos({ lat: startLat, lng: startLng });
      setActiveMarker(null);
      setLoading(false);
    });
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
      {isSingleMode && (
        <div className="routingPanel">
          <p className="routingTitre">🗺️ Itinéraire vers ce commerce</p>
          <div className="transportModeSelector">
            <label>
              <input
                type="radio"
                name="transportMode"
                value="TRANSIT"
                checked={transportMode === "TRANSIT"}
                onChange={() => setTransportMode("TRANSIT")}
                disabled={loading}
              />
              Bus
            </label>
            <label>
              <input
                type="radio"
                name="transportMode"
                value="DRIVING"
                checked={transportMode === "DRIVING"}
                onChange={() => setTransportMode("DRIVING")}
                disabled={loading}
              />
              Voiture
            </label>
          </div>
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
        }}
      >
        {avecCoords.map((e) => {
          const position = { lat: e.coordonnees.lat, lng: e.coordonnees.lng };
          return (
            <Marker key={e.id} position={position} onClick={() => setActiveMarker(e.id)} />
          );
        })}

        {activeMarker && (
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
