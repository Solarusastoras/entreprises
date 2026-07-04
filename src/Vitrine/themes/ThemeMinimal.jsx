import React, { useState } from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';
import FavoriteButton from '../components/common/FavoriteButton';

export default function ThemeMinimal({ siteData, products }) {
  const [userAddress, setUserAddress] = useState('');
  const [mapUrl, setMapUrl] = useState(siteData?.mapsIframeUrl);
  if (!siteData) return null;

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserAddress(`${latitude},${longitude}`);
        alert("📍 Position détectée !");
      });
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  const handleItinerary = () => {
    if (!userAddress) {
      alert("Veuillez entrer une adresse ou utiliser la géolocalisation.");
      return;
    }
    const newUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(userAddress)}&daddr=${encodeURIComponent(siteData.adresse)}&output=embed`;
    setMapUrl(newUrl);
  };

  return (
    <div className="theme-minimal">

      <section className="minimal-hero-section">
        <div className="hero-content">
          <h1>{siteData.nomEntreprise}</h1>
          <p>{siteData.descriptionCourte}</p>
          <button className="btn-minimal">EXPLORER</button>
        </div>
        <div className="hero-img-box">
          <img src={products[0]?.img || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&q=80'} alt="Hero" />
        </div>
      </section>

      <section id="about" className="minimal-about-section">
        <div className="about-content">
          <div className="minimal-divider"></div>
          <h2>Une Approche Pure</h2>
          <p>
            {siteData.descriptionLongue}
          </p>
        </div>
      </section>

      <section id="services" className="minimal-services-section">
        <h2 className="section-tag">NOS SERVICES</h2>
        <div className="services-grid">
          {products.map((p, i) => (
            <div key={i} className="service-card">
              <div className="img-wrapper">
                <img src={p.img || p.image_url} alt={p.nom} />
                <FavoriteButton productId={p.id} />
                {p.tag && <div className="product-tag">{p.tag}</div>}
              </div>
              <div className="card-body">
                <h3>{p.nom}</h3>
                <p>{p.desc || p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="minimal-contact-section">
        <div className="contact-layout">
          <div className="contact-header">
            <div className="address-box">
              <h3>Nous Trouver</h3>
              <p>{siteData.adresse}</p>
            </div>
            <div className="horaires-box">
              <h3>Horaires</h3>
              <ul>
                {Object.entries(siteData.horaires).map(([day, hours]) => (
                  <li key={day}>
                    <span>{day}</span>
                    <strong>{hours}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="itinerary-box">
            <h4>ITINÉRAIRE</h4>
            <div className="input-group">
              <button
                onClick={handleGeolocate}
                className="btn-loc"
              >
                <MapPin size={18} color="#fff" />
              </button>
              <input
                type="text"
                placeholder="Votre adresse de départ"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
              />
            </div>
            <button
              onClick={handleItinerary}
              className="btn-calculate"
            >
              CALCULER LE TRAJET
            </button>
          </div>

          <div className="map-container">
            <iframe src={mapUrl} width="100%" height="100%" loading="lazy"></iframe>
          </div>
        </div>
      </section>

    </div>

  );
}
