import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { GoogleMap, Marker, Polyline, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { Navigation, MapPin, Locate, Clock, ExternalLink, RotateCcw, Search, Compass } from "lucide-react";
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

const formatDuree = (secondes) => {
  if (!secondes && secondes !== 0) return "";
  const minutes = Math.round(secondes / 60);
  if (minutes < 60) return `${minutes} min`;
  const heures = Math.floor(minutes / 60);
  const minsRestantes = minutes % 60;
  return `${heures}h ${minsRestantes > 0 ? `${minsRestantes}min` : ""}`;
};

const formatDistance = (metres) => {
  if (!metres && metres !== 0) return "";
  if (metres < 1000) return `${Math.round(metres)} m`;
  return `${(metres / 1000).toFixed(1)} km`;
};

export default function MapView({ entreprises, hauteur = "450px" }) {
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
  const cibleParDefaut = isSingleMode ? avecCoords[0] : null;

  const [destinationId, setDestinationId] = useState(cibleParDefaut ? cibleParDefaut.id : (avecCoords[0]?.id || null));
  const [adresseDepart, setAdresseDepart] = useState("");
  const [departLabel, setDepartLabel] = useState("");
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null); // { distance, duration }
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  const [userPos, setUserPos] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const mapRef = useRef(null);

  // Synchroniser la cible si la liste change
  useEffect(() => {
    if (cibleParDefaut) {
      setDestinationId(cibleParDefaut.id);
    } else if (!destinationId && avecCoords.length > 0) {
      setDestinationId(avecCoords[0].id);
    }
  }, [cibleParDefaut, avecCoords, destinationId]);

  const cibleActive = useMemo(() => {
    return avecCoords.find((e) => e.id === destinationId) || cibleParDefaut || avecCoords[0] || null;
  }, [avecCoords, destinationId, cibleParDefaut]);

  const allMapPoints = useMemo(() => {
    if (routeCoords.length > 0) {
      return routeCoords;
    }
    return avecCoords.map((e) => ({ lat: e.coordonnees.lat, lng: e.coordonnees.lng }));
  }, [avecCoords, routeCoords]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!mapRef.current || allMapPoints.length === 0) return;
    const bounds = new window.google.maps.LatLngBounds();
    allMapPoints.forEach((pos) => bounds.extend(pos));
    mapRef.current.fitBounds(bounds, { padding: 40 });
  }, [allMapPoints]);

  const fetchItineraire = async (startLat, startLng, labelDepart = "Départ") => {
    if (!cibleActive || !cibleActive.coordonnees) {
      setErreur("Veuillez sélectionner un commerce de destination.");
      return;
    }

    setLoading(true);
    setErreur("");

    try {
      const destLat = cibleActive.coordonnees.lat;
      const destLng = cibleActive.coordonnees.lng;

      // Calcul de l'itinéraire le plus rapide via OSRM (mode driving)
      const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
        throw new Error("Impossible de calculer l'itinéraire.");
      }

      const route = data.routes[0];
      const coords = route.geometry.coordinates
        .map((c) => ({ lat: Number(c[1]), lng: Number(c[0]) }))
        .filter((pos) => Number.isFinite(pos.lat) && Number.isFinite(pos.lng));

      setRouteCoords(coords);
      setRouteInfo({
        distance: route.distance, // en mètres
        duration: route.duration, // en secondes
        destinationName: cibleActive.nom,
        destinationAddress: cibleActive.adresse,
        departLabel: labelDepart,
        startLat,
        startLng,
        destLat,
        destLng,
      });

      setUserPos({ lat: Number(startLat), lng: Number(startLng) });
      setDepartLabel(labelDepart);
      setActiveMarker(null);
    } catch (err) {
      console.error(err);
      setErreur("Erreur lors du calcul de l'itinéraire le plus rapide. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Géolocalisation de l'utilisateur
  const handleUtiliserGeoloc = () => {
    if (!navigator.geolocation) {
      setErreur("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setLoading(true);
    setErreur("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        fetchItineraire(lat, lng, "Ma position actuelle");
      },
      (error) => {
        console.warn("Erreur geoloc", error);
        let msg = "Impossible d'obtenir votre position actuelle.";
        if (error.code === 1) msg = "Accès à la géolocalisation refusé.";
        else if (error.code === 2) msg = "Position indisponible.";
        else if (error.code === 3) msg = "Délai de géolocalisation dépassé.";
        setErreur(msg);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Géocodage d'une adresse de départ
  const handleRechercheAdresse = async (e) => {
    if (e) e.preventDefault();
    if (!adresseDepart.trim()) {
      setErreur("Veuillez saisir une adresse de départ.");
      return;
    }

    setLoading(true);
    setErreur("");

    // 1. Essai avec Google Geocoder si chargé
    if (window.google && window.google.maps && window.google.maps.Geocoder) {
      try {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: adresseDepart }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const loc = results[0].geometry.location;
            fetchItineraire(loc.lat(), loc.lng(), results[0].formatted_address || adresseDepart);
          } else {
            fallbackNominatim(adresseDepart);
          }
        });
        return;
      } catch (err) {
        console.warn("Erreur Google Geocoder, passage à Nominatim", err);
      }
    }

    fallbackNominatim(adresseDepart);
  };

  const fallbackNominatim = async (query) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      const res = await fetch(url);
      const data = await res.json();

      if (data && data.length > 0) {
        const result = data[0];
        fetchItineraire(parseFloat(result.lat), parseFloat(result.lon), result.display_name.split(",")[0] || query);
      } else {
        setErreur("Adresse de départ introuvable. Veuillez préciser la ville.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setErreur("Erreur lors de la recherche de l'adresse.");
      setLoading(false);
    }
  };

  const handleResetItineraire = () => {
    setRouteCoords([]);
    setRouteInfo(null);
    setUserPos(null);
    setAdresseDepart("");
    setDepartLabel("");
    setErreur("");
  };

  const handleMarkerClick = (ent) => {
    setActiveMarker(ent.id);
    if (!isSingleMode) {
      setDestinationId(ent.id);
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
      {/* Panneau d'itinéraire & Calcul */}
      <div className="routingPanel">
        <div className="routingHeader">
          <div className="routingTitre">
            <Compass size={20} className="icon-title" />
            <span>Itinéraire le plus rapide</span>
          </div>
          {routeInfo && (
            <button onClick={handleResetItineraire} className="btnReset" title="Effacer l'itinéraire">
              <RotateCcw size={14} />
              <span>Effacer</span>
            </button>
          )}
        </div>

        {/* Sélection de destination si plusieurs commerces */}
        {!isSingleMode && avecCoords.length > 1 && (
          <div className="routingDestSelect">
            <label htmlFor="destination-select">
              <MapPin size={16} /> Destination :
            </label>
            <select
              id="destination-select"
              value={destinationId || ""}
              onChange={(e) => {
                setDestinationId(Number(e.target.value) || e.target.value);
                if (userPos) {
                  // Recalcul automatique si une position de départ est déjà définie
                  const selected = avecCoords.find(ent => ent.id === (Number(e.target.value) || e.target.value));
                  if (selected) {
                    // Délai court pour laisser le state se mettre à jour
                    setTimeout(() => {
                      fetchItineraire(userPos.lat, userPos.lng, departLabel || "Départ");
                    }, 50);
                  }
                }
              }}
              disabled={loading}
            >
              {avecCoords.map((ent) => (
                <option key={ent.id} value={ent.id}>
                  {ent.nom} ({ent.secteur || "Commerce"}) — {ent.adresse}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Formulaire de départ (Géolocalisation ou Adresse) */}
        <div className="routingInputsContainer">
          <button 
            type="button" 
            onClick={handleUtiliserGeoloc} 
            disabled={loading} 
            className="btnGeoloc"
          >
            <Locate size={18} />
            <span>{loading ? "Localisation..." : "Me géolocaliser"}</span>
          </button>

          <div className="routingSeparator">OU</div>

          <form onSubmit={handleRechercheAdresse} className="routingForm">
            <div className="inputWithIcon">
              <Search size={16} className="searchIcon" />
              <input
                type="text"
                placeholder="Entrez une adresse de départ..."
                value={adresseDepart}
                onChange={(e) => setAdresseDepart(e.target.value)}
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading || !adresseDepart.trim()} className="btnSubmitRoute">
              <Navigation size={16} />
              <span>{loading ? "..." : "Calculer"}</span>
            </button>
          </form>
        </div>

        {/* Erreurs éventuelles */}
        {erreur && <div className="routingErreur">{erreur}</div>}

        {/* Résultat d'itinéraire : Durée & Distance */}
        {routeInfo && (
          <div className="routeResultCard">
            <div className="routeStats">
              <div className="statItem">
                <Clock size={20} className="statIcon timeIcon" />
                <div className="statText">
                  <span className="statLabel">Temps estimé</span>
                  <strong className="statValue highlight">{formatDuree(routeInfo.duration)}</strong>
                </div>
              </div>
              <div className="statDivider" />
              <div className="statItem">
                <Navigation size={20} className="statIcon distIcon" />
                <div className="statText">
                  <span className="statLabel">Distance</span>
                  <strong className="statValue">{formatDistance(routeInfo.distance)}</strong>
                </div>
              </div>
            </div>

            <div className="routeAddresses">
              <p className="routeStep">
                <span className="dot startDot" />
                <strong>Départ :</strong> {routeInfo.departLabel}
              </p>
              <p className="routeStep">
                <span className="dot endDot" />
                <strong>Arrivée :</strong> {routeInfo.destinationName} ({routeInfo.destinationAddress})
              </p>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${routeInfo.startLat},${routeInfo.startLng}&destination=${routeInfo.destLat},${routeInfo.destLng}&travelmode=driving`}
              target="_blank"
              rel="noopener noreferrer"
              className="btnGpsExternal"
            >
              <ExternalLink size={16} />
              <span>Lancer la navigation GPS Google Maps</span>
            </a>
          </div>
        )}
      </div>

      {/* Carte Google Maps */}
      <div className="mapContainerBox">
        <GoogleMap
          mapContainerStyle={{ height: hauteur, width: "100%", borderRadius: "var(--radius-md)" }}
          center={isSingleMode && cibleParDefaut ? { lat: cibleParDefaut.coordonnees.lat, lng: cibleParDefaut.coordonnees.lng } : CENTRE_DEFAUT}
          zoom={isSingleMode ? 14 : ZOOM_DEFAUT}
          onLoad={onMapLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            zoomControl: true,
            clickableIcons: false,
            restriction: {
              latLngBounds: BEARN_BOUNDS,
              strictBounds: false,
            },
          }}
        >
          {/* Marqueurs des commerces */}
          {avecCoords.map((e) => {
            const position = { lat: e.coordonnees.lat, lng: e.coordonnees.lng };
            const isSelected = e.id === destinationId;
            return (
              <Marker 
                key={e.id} 
                position={position} 
                onClick={() => handleMarkerClick(e)}
                animation={isSelected && routeCoords.length > 0 ? window.google?.maps?.Animation?.BOUNCE : null}
              />
            );
          })}

          {/* Popup d'informations au clic sur un marqueur */}
          {activeMarker && !activeMarker.toString().startsWith('bus-') && (
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
                    <div className="popupActions">
                      {!isSingleMode && (
                        <Link to={`/entreprise/${entreprise.id}`} className="popupLien">
                          Voir la fiche →
                        </Link>
                      )}
                      <button 
                        className="popupBtnItineraire"
                        onClick={() => {
                          setDestinationId(entreprise.id);
                          if (userPos) {
                            fetchItineraire(userPos.lat, userPos.lng, departLabel || "Départ");
                          } else {
                            handleUtiliserGeoloc();
                          }
                        }}
                      >
                        🚀 Itinéraire ici
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              );
            })()
          )}

          {/* Marqueur de départ de l'utilisateur */}
          {userPos && (
            <Marker 
              position={userPos} 
              title="Votre point de départ"
              icon={{
                path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                scale: 8,
                fillColor: "#2563eb",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 3,
              }}
            />
          )}

          {/* Tracé de l'itinéraire */}
          {routeCoords.length > 0 && (
            <Polyline
              path={routeCoords}
              options={{
                strokeColor: "#2563eb",
                strokeOpacity: 0.85,
                strokeWeight: 6,
              }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
