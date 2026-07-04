import React, { useState } from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';
import FavoriteButton from '../components/common/FavoriteButton';

export default function ThemeVintage({ siteData, products }) {
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
      <div className="theme-vintage">
         {/* La texture est maintenant gérée par le background CSS de la classe .theme-vintage */}

         <section className="vintage-hero-section">
            <div className="hero-header">
               <h1>{siteData.nomEntreprise}</h1>
               <div className="est-tag">EST. 1985 • ARTISAN {siteData.metier.toUpperCase()}</div>
            </div>
            <div className="v-polaroid-container">
               <div className="v-polaroid">
                  <img src={products[0]?.img || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80'} alt="Vintage Hero" />
                  <FavoriteButton productId={products[0]?.id} />
                  <div className="polaroid-caption">
                     Authenticité & Savoir-faire
                  </div>
               </div>
            </div>
            <div className="about-text">
               <h2>À Propos</h2>
               <p>
                  {siteData.descriptionLongue}
               </p>
            </div>
         </section>

         <section className="vintage-reference-section">
            <div className="section-title-box">
               <h3>~ Nos Articles de Référence ~</h3>
            </div>
            <div className="reference-grid">
               {products.map((p, i) => (
                  <div key={i} className="article-card">
                     <div className="img-wrapper">
                        <img src={p.img || p.image_url} alt={p.nom} />
                        <FavoriteButton productId={p.id} />
                        {p.tag && (
                           <div className="tag-circle">
                              {p.tag.toUpperCase()}
                           </div>
                        )}
                     </div>
                     <h4>{p.nom}</h4>
                     <p>{p.desc || p.description}</p>
                  </div>
               ))}
            </div>
         </section>

         <section className="vintage-almanach-section">
            <div className="v-gazette-border">
               <div className="almanach-header">
                  <span>ÉDITION SPÉCIALE • 2026</span>
                  <h2>L'ALMANACH DE LA BOUTIQUE</h2>
                  <div className="divider"></div>
               </div>

               <div className="almanach-grid">
                  <div className="col-left">
                     <h3>NOTRE COMPTOIR</h3>
                     <p className="address">
                        📍 {siteData.adresse}
                     </p>
                     <p className="desc">
                        Venez nous rendre visite pour découvrir nos pièces rares et accessoires d'époque.
                     </p>
                     <div className="itinerary-box">
                        <h4>~ CALCULER MON ITINÉRAIRE ~</h4>
                        <div className="input-group">
                           <button 
                             onClick={handleGeolocate}
                             className="btn-loc"
                           >
                              <MapPin size={18} color="#fff" />
                           </button>
                           <input 
                             type="text" 
                             placeholder="D'où partez-vous ?"
                             value={userAddress}
                             onChange={(e) => setUserAddress(e.target.value)}
                           />
                        </div>
                        <button 
                           onClick={handleItinerary}
                           className="btn-itinerary"
                        >
                           ITINÉRAIRE
                        </button>
                     </div>

                     <div className="map-frame">
                        <iframe src={mapUrl} width="100%" height="100%" loading="lazy"></iframe>
                     </div>
                  </div>
                  <div className="col-right">
                     <h3>SERVICES & HEURES</h3>
                     <ul className="horaires-list">
                        {Object.entries(siteData.horaires).map(([day, hours]) => (
                           <li key={day}>
                              <strong>{day} :</strong> {hours}
                           </li>
                        ))}
                     </ul>
                     <div className="stamp-box">
                        <div className="stamp">APPROUVÉ</div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <footer>
            <p>{siteData.nomEntreprise.toUpperCase()} • DEPUIS 1985 • {siteData.metier.toUpperCase()}</p>
         </footer>
      </div>
   );
}
