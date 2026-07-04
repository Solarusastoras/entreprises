import React from 'react';
import './ThemeRestoModerne.scss';
import { Camera, Layers, Zap } from 'lucide-react';
import { PROFESSIONS } from '../../professions';
import FavoriteButton from '../../components/common/FavoriteButton';

export default function ThemeRestoModerne({ siteData, products, isEditable, onEditProduct }) {
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
    <main className="theme-resto-moderne">
      <header>
        <div className="logo">{siteData.nomEntreprise}</div>
        <nav>
          <a href="#menu">Menu</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* New Layout matching user image */}
      <div className="enterprise-hero-header">
        <h1>{siteData.nomEntreprise}</h1>
      </div>

      <section className="moderne-hero-centered">
        <h2>Plat du jour</h2>

        {platDuJour && (
          <div className="plat-main-display">
            <div
              className={`plat-img-box ${isEditable ? 'editable' : ''}`}
              onClick={() => isEditable && onEditProduct(platDuJour)}
            >
              <img src={platDuJour.img || platDuJour.image_url} alt={platDuJour.nom} />
              <FavoriteButton productId={platDuJour.id} />
              {isEditable && <div className="edit-overlay">✏️</div>}
            </div>

            <div className="plat-info-box">
              <h3 className={isEditable ? 'editable' : ''} onClick={() => isEditable && onEditProduct(platDuJour)}>
                {platDuJour.nom || platDuJour.name}
              </h3>
              <p className={isEditable ? 'editable' : ''} onClick={() => isEditable && onEditProduct(platDuJour)}>
                {platDuJour.prix || "15"}€
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="menu-section">
        {categories.map(cat => grouped[cat] && (
          <div key={cat} className="category-block">
            <h2 className="cat-title">{cat}s</h2>
            <div className="items-grid">
              {grouped[cat].map((p, i) => (
                <div
                  key={i}
                  className={`item-card ${isEditable ? 'editable' : ''}`}
                  onClick={() => isEditable && onEditProduct(p)}
                >
                  <div className="card-img">
                    <img src={p.img || p.image_url} alt={p.nom} />
                    <FavoriteButton productId={p.id} />
                    {isEditable && <div className="edit-overlay">✏️</div>}
                  </div>
                  {p.tag && (
                    <div className="tag">{p.tag}</div>
                  )}
                  <div className="card-header">
                    <h3>{p.nom || p.name}</h3>
                    <div className="price">{p.prix || "19"}€</div>
                  </div>
                  <p>{p.desc || p.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-grid">
          <div className="horaires-box">
            <h2>Nous Visiter</h2>
            <div className="horaires-content">
              {Object.entries(siteData.horaires).map(([day, hours]) => (
                <div key={day} className="horaire-item">
                  <span className="day">{day}</span>
                  <span>{hours}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="address-col">
            <div className="address-card">
              <h3>ADRESSE</h3>
              <p>{siteData.adresse}</p>
            </div>
            <div className="map-wrapper">
              <iframe src={siteData.mapsIframeUrl} width="100%" height="100%" loading="lazy"></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
