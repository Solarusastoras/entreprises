import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Edit } from 'lucide-react';
import FavoriteButton from '../../components/common/FavoriteButton';

export default function ThemeBoulangerieLuxe({ siteData, products, isEditable, onEditProduct }) {
  const [userAddress, setUserAddress] = useState('');
  const [mapUrl, setMapUrl] = useState(siteData?.mapsIframeUrl);
  const [activeCategory, setActiveCategory] = useState('Tous');
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
    // Mise à jour de l'URL pour un affichage in-situ
    const newUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(userAddress)}&daddr=${encodeURIComponent(siteData.adresse)}&output=embed`;
    setMapUrl(newUrl);
  };

  return (
    <div className="theme-boulangerie-luxe">
      <div className="l-border-frame"></div>

      {/* 1. HERO ÉDITORIAL ASYMÉTRIQUE */}
      <section id="home" className="l-hero">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${products[0]?.img || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2000'})` }}
        ></div>

        <div className="l-hero-inner reveal">
          <span className="l-gold-text hero-tag">MAISON DE HAUTE PÂTISSERIE</span>
          <h1>
            {siteData.nomEntreprise.split(' ').map((word, i) => (
              <div key={i}>{word}</div>
            ))}
          </h1>
          <p>
            {siteData.descriptionCourte}
          </p>
          <a href="#services" className="l-btn-elegant">DÉCOUVRIR</a>
        </div>
      </section>

      {/* 2. SECTION HISTOIRE LOOKBOOK */}
      <section id="about" className="l-about-section">
        <div className="about-grid">
          <div className="about-img-box">
            <img src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?q=80&w=1200" alt="Work" />
            <div className="about-overlay">
              <h3>SAVOIR-FAIRE</h3>
              <p>Une exigence de chaque instant pour des pains et pâtisseries d'exception.</p>
            </div>
          </div>
          <div className="about-text reveal">
            <h2>L'Artisanat <br />Boulanger</h2>
            <p>
              {siteData.descriptionLongue}
            </p>
          </div>
        </div>
      </section>

      {/* 3. SHOWROOM PRODUITS (ASPECT DÉFILÉ) */}
      <section id="services" className="l-gallery-section">
        <div className="section-header">
          <h2>COLLECTION</h2>
          <h3>Pièces de Signature</h3>
        </div>

        <div className="l-category-filter" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '60px', flexWrap: 'wrap', padding: '0 20px' }}>
          {['Tous', ...new Set(products.map(p => p.category).filter(Boolean))].map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? '#c5a059' : 'transparent',
                color: activeCategory === cat ? '#000' : '#fff',
                border: '1px solid #c5a059',
                padding: '8px 25px',
                borderRadius: '30px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="l-product-gallery">
          {(activeCategory === 'Tous' ? products : products.filter(p => p.category === activeCategory)).map((p, i) => (
            <div key={i} className={i % 2 === 0 ? 'l-card-large reveal' : 'l-card-small reveal'}>
              <div className="img-container">
                <img
                  src={p.img || p.image_url}
                  alt={p.nom}
                  style={{ height: i % 2 === 0 ? '600px' : '450px' }}
                  className="l-img-hover"
                />
                <FavoriteButton productId={p.id} />
                {p.tag && <div className="p-tag-badge">{p.tag.toUpperCase()}</div>}
                {isEditable && (
                  <button 
                    onClick={() => onEditProduct(p)}
                    style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', color: '#000', border: 'none', padding: '15px', borderRadius: '50%', cursor: 'pointer', zIndex: 15, boxShadow: '0 4px 20px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Modifier l'article"
                  >
                    <Edit size={24} />
                  </button>
                )}
              </div>
              <div className="card-footer">
                <div>
                  <h4>{p.nom}</h4>
                </div>
                <div className="price">{p.prix}€</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CONTACT MINIMALISTE */}
      <section id="contact" className="l-contact-section">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Visitez Notre <span className="l-gold-text">Maison</span></h2>
            <p className="address">{siteData.adresse}</p>

            <div className="horaires-grid">
              {Object.entries(siteData.horaires).map(([day, hours]) => (
                <div key={day} className="horaire-item">
                  <span>{day}</span>
                  <div className="hours">{hours}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="itinerary-container">
            {/* BLOC ITINERAIRE LUXE */}
            <div className="itinerary-box">
              <h4>VOTRE PARCOURS D'EXCEPTION</h4>
              <div className="input-group">
                <button
                  onClick={handleGeolocate}
                  title="Utiliser ma position"
                  className="btn-loc"
                >
                  <MapPin size={20} color="#000" />
                </button>
                <input
                  type="text"
                  placeholder="Entrez votre adresse de départ..."
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                />
              </div>
              <button
                onClick={handleItinerary}
                className="btn-itinerary"
              >
                <Compass size={16} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> ITINÉRAIRE
              </button>
            </div>

            {/* MAP VISIBLE ET CLAIRE */}
            <div className="map-frame">
              <iframe src={mapUrl} width="100%" height="100%" loading="lazy"></iframe>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-copy">© 2026 {siteData.nomEntreprise.toUpperCase()}</div>
      </footer>
    </div>
  );
}
