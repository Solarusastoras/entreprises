import React from 'react';
import './ThemeRestoClassique.scss';
import { Wine, UtensilsCrossed } from 'lucide-react';
import { PROFESSIONS } from '../../professions';
import FavoriteButton from '../../components/common/FavoriteButton';

export default function ThemeRestoClassique({ siteData, products, isEditable, onEditProduct }) {
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
    <div className="theme-resto-classique">
      <header className="resto-top-header">
        <span>{siteData.nomEntreprise}</span>
      </header>

      <header className="resto-main-header">
        <h1>{siteData.nomEntreprise}</h1>
        <p className="subtitle">Une tradition culinaire d'exception</p>
      </header>

      <section className="classique-hero">
        <div className={`img-box ${isEditable ? 'editable' : ''}`} onClick={() => isEditable && platDuJour && onEditProduct(platDuJour)}>
          <img src={(platDuJour?.img || platDuJour?.image_url) || products[0]?.img || products[0]?.image_url} alt="Resto" />
          {platDuJour && <FavoriteButton productId={platDuJour.id} />}
          {isEditable && platDuJour && <div className="edit-overlay">✏️ Modifier</div>}
        </div>
        <div className="hero-content">
          <span className="special-tag">{platDuJour ? "PLAT DU JOUR" : "BIENVENUE"}</span>
          <h2>{platDuJour ? (platDuJour.nom || platDuJour.name) : siteData.descriptionCourte}</h2>
          <p>{platDuJour ? (platDuJour.desc || platDuJour.description) : siteData.descriptionLongue}</p>
          <div className="reservation-box">
            <span className="phone">RÉSERVEZ : {siteData.telephone}</span>
          </div>
        </div>
      </section>

      <section className="carte-section">
        <div className="section-header">
          <h2>La Carte</h2>
          <UtensilsCrossed size={30} className="icon" />
        </div>

        <div className="carte-container">
          {categories.map(cat => grouped[cat] && (
            <div key={cat} className="cat-section">
              <h3>{cat}s</h3>
              <div className="menu-items">
                {grouped[cat].map((p, i) => (
                    <div 
                      key={i} 
                      className={`menu-item ${isEditable ? 'editable' : ''}`}
                      onClick={() => isEditable && onEditProduct(p)}
                    >
                      <div className="item-img-container">
                        <div className="item-img">
                          <img src={p.image_url || p.img} alt={p.nom || p.name} />
                        </div>
                        <FavoriteButton productId={p.id} className="item-favorite" />
                      </div>

                      <div className="item-info">
                        <div className="item-header">
                          <h4>{p.nom || p.name}</h4>
                          {isEditable && <span className="edit-icon">✏️</span>}
                          {p.tag && (
                            <span className="tag">{p.tag}</span>
                          )}
                        </div>
                        <p>{p.desc || p.description}</p>
                      </div>
                      <div className="price">{p.prix || "22"}€</div>
                    </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="info-box">
          <h2>Heures d'Ouverture</h2>
          <div className="horaires-list">
            {Object.entries(siteData.horaires).map(([day, hours]) => (
              <div key={day} className="horaire-item">
                <span className="day">{day}</span>
                <span className="hours">{hours}</span>
              </div>
            ))}
          </div>
          <p className="address">{siteData.adresse}</p>
          <p className="note">Réservations recommandées</p>
        </div>
        <div className="map-container">
          <iframe src={siteData.mapsIframeUrl} width="100%" height="100%" loading="lazy"></iframe>
        </div>
      </section>
    </div>

  );
}
