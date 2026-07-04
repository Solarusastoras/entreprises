import React, { useState } from 'react';
import { MapPin, Navigation, ArrowRight, ArrowDown } from 'lucide-react';
import FavoriteButton from '../components/common/FavoriteButton';

export default function ThemeModerne({ siteData, products }) {
   const [userAddress, setUserAddress] = useState('');
   const [mapUrl, setMapUrl] = useState(siteData?.mapsIframeUrl);
   if (!siteData) return null;

   const handleItinerary = () => {
      if (!userAddress) return;
      const newUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(userAddress)}&daddr=${encodeURIComponent(siteData.adresse)}&output=embed`;
      setMapUrl(newUrl);
   };

   return (
      <div className="theme-moderne">

         {/* 📐 HERO - MAGAZINE STYLE */}
         <section className="moderne-hero-section">
            <div className="hero-content">
               <span className="m-section-num">01</span>
               <div className="m-slide" style={{ animationDelay: '0.1s' }}>
                  <h1 className="m-hero-title">
                     {siteData.nomEntreprise.split(' ')[0]}<br />
                     <span className="m-accent-blue">{siteData.nomEntreprise.split(' ')[1] || ''}</span>
                  </h1>
                  <p className="hero-desc">
                     {siteData.descriptionCourte}
                  </p>
                  <button className="m-btn-black">Explorer le Projet <ArrowRight size={20} style={{ marginLeft: '10px' }} /></button>
               </div>
            </div>
            <div className="m-slide hero-img-col" style={{ animationDelay: '0.4s' }}>
               <div className="img-wrapper">
                  <img src={products[0]?.img || 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&q=80'} alt="Hero" />
               </div>
            </div>
         </section>

         {/* 📦 SELECTION - MODULAR GRID */}
         <section id="products" className="moderne-products-section">
            <div className="section-header m-slide">
               <div className="header-title">
                  <span>SELECTED ITEMS</span>
                  <h2>DESIGN <span className="m-accent-blue">STRIKE</span></h2>
               </div>
               <ArrowDown size={48} className="m-accent-blue" />
            </div>

            <div className="products-grid">
               {products.map((p, i) => (
                  <div key={i} className="product-card m-slide" style={{ animationDelay: `${0.2 * i}s` }}>
                     <div className="img-wrapper">
                        <img src={p.img || p.image_url} alt={p.nom} />
                        <FavoriteButton productId={p.id} />
                     </div>
                     <div className="card-body">
                        <span className="card-num">0{i + 1}</span>
                        <h3>{p.nom}</h3>
                        <p>{p.desc || p.description}</p>
                        <div className="card-footer">
                           <span className="price">{p.prix || '---'}</span>
                           <button className="btn-add">ADD</button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* 🗺️ CONTACT & MAP - ARCHITECTURAL BLOCK */}
         <section id="contact" className="moderne-contact-section">
            <div className="contact-grid">
               <div className="contact-info">
                  <h3>STATION <span className="m-accent-blue">{siteData.adresse.split(' ')[0]}</span></h3>

                  <div className="address-block">
                     <p className="address">{siteData.adresse}</p>
                     <p className="desc">Notre emplacement stratégique au cœur de la ville.</p>
                  </div>

                  <div className="horaires-box">
                     <h4>OPERATING HOURS</h4>
                     {Object.entries(siteData.horaires).map(([day, hours]) => (
                        <div key={day} className="horaire-item">
                           <span className="day">{day}</span>
                           <span className="hours">{hours}</span>
                        </div>
                     ))}
                  </div>

                  <div className="itinerary-box">
                     <input type="text" placeholder="Origine du trajet..." value={userAddress} onChange={(e) => setUserAddress(e.target.value)} />
                     <button onClick={handleItinerary} className="m-btn-black" style={{ width: '100%' }}>Lancer le Guidage</button>
                  </div>
               </div>

               <div className="map-col">
                  <iframe src={mapUrl} width="100%" height="100%" loading="lazy"></iframe>
                  <div className="map-badge">SIGNAL DÉTECTÉ</div>
               </div>
            </div>
         </section>
      </div>

   );
}
