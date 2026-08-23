import React from 'react';
import './ThemeRestoPremium.scss';
import { Utensils, Clock, MapPin, Star } from 'lucide-react';
import { PROFESSIONS } from '../../professions';
import FavoriteButton from '../../components/common/FavoriteButton';

export default function ThemeRestoPremium({ siteData, products, isEditable, onEditProduct }) {
  if (!siteData) return null;

  const professionInfo = PROFESSIONS.find(p => p.name === siteData.metier);
  const allCategories = professionInfo?.productCategories || [...new Set(products.map(p => p.category))];
  const categories = allCategories.filter(c => c !== "Plat du jour");

  const grouped = products.reduce((acc, p) => {
    const cat = p.category || "Inconnu";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const platDuJour = products.find(p => p.category === "Plat du jour");

  return (
    <div className="theme-resto-premium">

      {/* Header */}
      <header>
        <div className="logo">{siteData.nomEntreprise}</div>
        <nav>
          <a href="#menu">La Carte</a>
          <a href="#about">L'Expérience</a>
          <a href="#contact">Réservation</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="premium-hero">
        <div className="hero-content">
          <span className="tag">PLAT DU JOUR</span>
          <h1>{platDuJour ? (platDuJour.nom || platDuJour.name) : "Bienvenue à notre table"}</h1>
          <p>{platDuJour ? (platDuJour.desc || platDuJour.description) : siteData.descriptionCourte}</p>
          {platDuJour && <div className="price">{platDuJour.prix}€</div>}
          <button className="btn-reserve">RÉSERVER UNE TABLE</button>
        </div>
        <div className={`hero-img-box ${isEditable ? 'editable' : ''}`} onClick={() => isEditable && platDuJour && onEditProduct(platDuJour)}>
          <div className="img-wrapper">
            {platDuJour ? (
              <img src={platDuJour.img || platDuJour.image_url} alt="Plat du jour" />
            ) : (
              <div className="placeholder-img">Sélectionnez un Plat du Jour</div>
            )}
            {platDuJour && <FavoriteButton productId={platDuJour.id} />}
            {isEditable && platDuJour && <div className="edit-overlay">✏️ Modifier</div>}
          </div>
          <div className="review-badge">
            <div className="stars">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
            </div>
            <div className="review-text">"Une explosion de saveurs"</div>
            <div className="guide-name">- Guide Gastronomique 2026</div>
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section id="menu" className="menu-section">
        <div className="section-header">
          <span>NOTRE CARTE</span>
          <h2>Découvrez nos saveurs</h2>
        </div>

        {categories.map(cat => grouped[cat] && (
          <div key={cat} className="category-group">
            <h3>{cat}s</h3>
            <div className="menu-grid">
              {grouped[cat].map((p, i) => (
                <div 
                  key={i} 
                  className={`resto-card ${isEditable ? 'editable' : ''}`}
                  onClick={() => isEditable && onEditProduct(p)}
                >
                  <div className="img-box">
                    <img src={p.img || p.image_url} alt={p.nom} />
                    <FavoriteButton productId={p.id} />
                    {isEditable && <div className="edit-overlay">✏️</div>}
                    {p.tag && (
                      <span className="tag">{p.tag.toUpperCase()}</span>
                    )}
                    <span className="price-badge">{p.prix || "18"}€</span>
                  </div>
                  <div className="card-body">
                    <h4>{p.nom || p.name}</h4>
                    <p>{p.desc || p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Info Sections */}
      <section id="contact" className="info-section">
        <div className="info-card">
          <h2>Horaires & Expérience</h2>
          <div className="horaires-list">
            {Object.entries(siteData.horaires).map(([day, hours]) => (
              <div key={day} className="horaire-item">
                <span>{day}</span>
                <strong>{hours}</strong>
              </div>
            ))}
          </div>
          <div className="location-box">
            <MapPin size={30} color="var(--primary)" />
            <div className="loc-text">
              <strong>Localisation Premium</strong><br />
              {siteData.adresse}
            </div>
          </div>
        </div>
        <div className="map-box">
          <iframe src={siteData.mapsIframeUrl} width="100%" height="100%" loading="lazy"></iframe>
        </div>
      </section>
    </div>

  );
}
