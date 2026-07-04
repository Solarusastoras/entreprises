import React, { useState } from 'react';
import './ThemeRestoBistro.scss';
import { Calendar, Info, X } from 'lucide-react';
import { PROFESSIONS } from '../../professions';
import FavoriteButton from '../../components/common/FavoriteButton';

export default function ThemeRestoBistro({ siteData, products, isEditable, onEditProduct }) {
  const [selectedImg, setSelectedImg] = useState(null);
  
  if (!siteData) return null;

  const professionInfo = PROFESSIONS.find(p => p.name === siteData.metier);
  // We exclude "Plat du jour" from the main card categories to avoid duplication
  const allCategories = professionInfo?.productCategories || [...new Set(products.map(p => p.category))];
  const categories = allCategories.filter(c => c !== "Plat du jour");

  const grouped = products.reduce((acc, p) => {
    const cat = p.category || "Inconnu";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  // Find ONLY the dish marked with the "Plat du jour" category
  const platDuJour = products.find(p => p.category === "Plat du jour");

  const handleItemClick = (p) => {
    if (isEditable && onEditProduct) {
      onEditProduct(p);
    } else {
      setSelectedImg(p.image_url || p.img);
    }
  };

  return (
    <div className={`theme-resto-bistro ${isEditable ? 'admin-mode' : ''}`}>
      <header className="bistro-nav">
        <div className="logo">{siteData.nomEntreprise}</div>
        <div className="phone">{siteData.telephone}</div>
      </header>

      <header className="bistro-header">
        <h1>{siteData.nomEntreprise}</h1>
        <p className="subtitle">Simplicité & Partage</p>
      </header>

      <section className="concept-grid">
        <div className="concept-card ardoise-style">
          <h2>Le Concept</h2>
          <p>{siteData.descriptionCourte}</p>
        </div>
        <div className="reservation-card ardoise-style">
          <Calendar size={40} className="icon-calendar" />
          <h2>RÉSERVEZ : {siteData.telephone}</h2>
        </div>
        <div className="hero-img" style={{ backgroundImage: `url(${products[2]?.img || products[2]?.image_url})` }}></div>
      </section>

      <section className="ardoise-container">
        <div className="grande-ardoise">
          {/* PLAT DU JOUR */}
          <div className="section-header">
            <h2 className="title-main">Plat du jour</h2>
            {platDuJour && (
              <div 
                className={`plat-du-jour-item ${isEditable ? 'editable' : ''}`} 
                onClick={() => handleItemClick(platDuJour)}
              >
                <div className="item-img">
                  <img src={platDuJour.image_url || platDuJour.img} alt={platDuJour.nom || platDuJour.name} />
                  <FavoriteButton productId={platDuJour.id} />
                  {isEditable && <div className="edit-overlay"><span>✏️ MODIFIER</span></div>}
                </div>
                <div className="item-info">
                  <span className="name">{platDuJour.nom || platDuJour.name}</span>
                </div>
              </div>
            )}
          </div>

          <div className="section-header secondary">
            <h2 className="title-secondary">A la Carte</h2>
          </div>

          <div className="ardoise-categories">
            {categories.map(cat => grouped[cat] && (
              <div key={cat} className="ardoise-cat-block">
                <h3 className="cat-title">{cat}S</h3>
                <div className="items-list">
                  {grouped[cat].map((p, i) => (
                    <div 
                      key={i} 
                      className={`ardoise-item ${isEditable ? 'editable' : ''}`} 
                      onClick={() => handleItemClick(p)}
                    >
                      <div className="item-img">
                        <img src={p.image_url || p.img} alt={p.nom || p.name} />
                        <FavoriteButton productId={p.id} />
                        {isEditable && <div className="edit-overlay"><span>✏️</span></div>}
                      </div>
                      <div className="item-name">
                        <span>{p.nom || p.name}</span>
                      </div>
                      <div className="item-price">
                        <span>{p.prix || "14"}€</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMAGE MODAL */}
      {selectedImg && (
        <div className="image-modal" onClick={() => setSelectedImg(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedImg(null)}><X size={32} /></button>
            <img src={selectedImg} alt="Menu Item Full Size" />
          </div>
        </div>
      )}

      <section id="contact" className="contact-grid-section">
        <div className="horaires-ardoise">
          <h2>L'Ardoise des Horaires</h2>
          <div className="horaires-list">
            {Object.entries(siteData.horaires).map(([day, hours]) => (
              <div key={day} className="horaire-item">
                <span className="day">{day}</span>
                <span className="hours">{hours}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="address-map-card">
          <h2>Où nous trouver ?</h2>
          <p className="address-text">📍 {siteData.adresse}</p>
          <div className="map-container">
            <iframe src={siteData.mapsIframeUrl} width="100%" height="100%" loading="lazy"></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
