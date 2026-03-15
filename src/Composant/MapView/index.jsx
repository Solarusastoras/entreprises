import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { iconeParSecteur } from "../../Utils/hooks/helpers.js";
import "./mapview.scss";

// Fix icônes Leaflet avec Webpack/CRA
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CENTRE_DEFAUT = [44.5, -0.5];
const ZOOM_DEFAUT = 7;

export default function MapView({ entreprises, hauteur = "420px" }) {
  const avecCoords = entreprises.filter(
    (e) => e.coordonnees?.lat && e.coordonnees?.lng,
  );

  return (
    <div className="wrapper" style={{ height: hauteur }}>
      <MapContainer
        center={CENTRE_DEFAUT}
        zoom={ZOOM_DEFAUT}
        style={{ height: "100%", width: "100%" }}
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
                <Link to={`/entreprise/${e.id}`} className="popupLien">
                  Voir la fiche →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
