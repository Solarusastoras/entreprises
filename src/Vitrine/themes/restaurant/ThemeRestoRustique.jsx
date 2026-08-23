import React from 'react';
import './ThemeRestoRustique.scss';
import { Coffee, Map } from 'lucide-react';
import { PROFESSIONS } from '../../professions';
import FavoriteButton from '../../components/common/FavoriteButton';

export default function ThemeRestoRustique({ siteData, products, isEditable, onEditProduct }) {
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
    <div className="theme-resto-rustique">
      <header>
        <div className="logo">{siteData.nomEntreprise}</div>
        <div className="nav-links">
          <span>LA CARTE</span>
          <span>RÉSERVATION</span>
        </div>
      </header>

      <header className="rustique-top-header">
        <div className="tag">TERROIR & SAVEURS</div>
        <h1>{siteData.nomEntreprise}</h1>
        <div className="divider"></div>
      </header>

      <section className="rustique-hero">
        <div 
          className={`img-col ${isEditable && platDuJour ? 'editable' : ''}`}
          onClick={() => isEditable && platDuJour && onEditProduct(platDuJour)}
        >
          <img src={(platDuJour?.img || platDuJour?.image_url) || products[1]?.img || products[1]?.image_url} alt="Ambiance" />
          {platDuJour && <FavoriteButton productId={platDuJour.id} />}
          {isEditable && platDuJour && <div className="edit-overlay">✏️ MODIFIER</div>}
        </div>
        <div className="text-col">
          <h2>{platDuJour ? (platDuJour.nom || platDuJour.name) : "Cuisine de Saison"}</h2>
          <p>{platDuJour ? (platDuJour.desc || platDuJour.description) : siteData.descriptionLongue}</p>
          {platDuJour && <p className="price-tag">{platDuJour.prix}€</p>}
        </div>
      </section>

      <section className="rustique-table-section">
        <div className="section-title-box">
          <h2>La Table de Saison</h2>
        </div>

        <div className="table-grid">
          {categories.map(cat => grouped[cat] && (
            <div key={cat} className="rustique-cat-group">
              <h3 className="rustique-cat-title">{cat}s</h3>
              <div className="rustique-items">
                {grouped[cat].map((p, i) => (
                  <div 
                    key={i} 
                    className={`table-item ${isEditable ? 'editable' : ''}`}
                    onClick={() => isEditable && onEditProduct(p)}
                  >
                    <div className="img-wrapper">
                      <img src={p.img || p.image_url} alt={p.nom || p.name} />
                      <FavoriteButton productId={p.id} />
                      {p.tag && <span className="rustique-tag">{p.tag}</span>}
                      {isEditable && <div className="edit-overlay">✏️ Modifier</div>}
                    </div>
                    <div className="item-details">
                      <div className="title-price-row">
                        <h4>{p.nom || p.name}</h4>
                        <span className="price">{p.prix || "21"}€</span>
                      </div>
                      {(p.desc || p.description) && (
                        <p className="desc">{p.desc || p.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="info-box">
          <h2>Passer nous voir</h2>
          <div className="horaires-list">
            {Object.entries(siteData.horaires).map(([day, hours]) => (
              <div key={day} className="horaire-item">
                <span className="day">{day}</span>
                <span className="hours">{hours}</span>
              </div>
            ))}
          </div>
          <div className="address-tag">
            <strong>NOTRE ADRESSE</strong>
            {siteData.adresse}
          </div>
        </div>
        <div className="map-wrapper">
          <iframe src={siteData.mapsIframeUrl} width="100%" height="100%" loading="lazy"></iframe>
        </div>
      </section>
    </div>
  );
}
