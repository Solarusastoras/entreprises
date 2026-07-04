import React, { useState } from 'react';
import { Leaf, Map, Compass, MapPin } from 'lucide-react';
import FavoriteButton from '../components/common/FavoriteButton';

export default function ThemeEco({ siteData, products }) {
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
      <div className="theme-eco">

         <section className="eco-hero-section">
            <div className="e-hero-img-box">
               <img src={products[0]?.img || 'https://images.unsplash.com/photo-1515343483120-f4991f21b3f5?w=1200&q=80'} alt="Eco Hero" />
            </div>
            <div>
               <h1>Naturellement<br />{siteData.nomEntreprise}</h1>
               <p>{siteData.descriptionCourte}</p>
               <button className="eco-btn">
                  Découvrir Notre Univers
               </button>
            </div>
         </section>

         <section id="about" className="eco-about-section">
            <div className="about-content">
               <Leaf size={40} className="eco-icon" />
               <h2>Engagement {siteData.metier}</h2>
               <p>
                  {siteData.descriptionLongue}
               </p>
            </div>
         </section>

         <section id="products" className="eco-products-section">
            <div className="section-header">
               <h2>Sélection Responsable</h2>
               <p>Cultivé avec soin, partagé avec passion.</p>
            </div>
            <div className="products-grid">
               {products.map((p, i) => (
                  <div key={i} className="product-card">
                     <div className="img-wrapper">
                        <img src={p.img || p.image_url} alt={p.nom} />
                        <FavoriteButton productId={p.id} />
                        {p.tag && (
                           <div className="product-tag">{p.tag}</div>
                        )}
                     </div>
                     <h3>{p.nom}</h3>
                     <p>{p.desc || p.description}</p>
                  </div>
               ))}
            </div>
         </section>

         <section id="contact" className="eco-contact-section">
            <div className="contact-card">
               <div>
                  <div className="title-box">
                     <Leaf size={24} style={{ color: 'var(--eco-primary)' }} />
                     <h2>Notre Écrin</h2>
                  </div>
                  <p className="address"><Map size={20} /> {siteData.adresse}</p>

                  <div className="info-block">
                     <h4>HORAIRES</h4>
                     <div className="horaires-list">
                        {Object.entries(siteData.horaires).map(([day, hours]) => (
                           <div key={day} className="horaire-item">
                              <span>{day}</span>
                              <strong>{hours}</strong>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="itinerary-box">
                     <h4>VOTRE CHEMIN</h4>
                     <div className="input-group">
                        <button
                           onClick={handleGeolocate}
                           className="btn-loc"
                        >
                           <MapPin size={20} color="#fff" />
                        </button>
                        <input
                           type="text"
                           placeholder="Départ..."
                           value={userAddress}
                           onChange={(e) => setUserAddress(e.target.value)}
                        />
                     </div>
                     <button
                        onClick={handleItinerary}
                        className="btn-itinerary"
                     >
                        <Compass size={18} /> ITINÉRAIRE
                     </button>
                  </div>

                  <div className="map-frame">
                     <iframe src={mapUrl} width="100%" height="100%" loading="lazy"></iframe>
                  </div>
               </div>
            </div>
         </section>

         <footer>
            <div className="footer-logo">{siteData.nomEntreprise}</div>
            <p>Respect de la terre • Engagement quotidien • 2026</p>
         </footer>
      </div>
   );
}
