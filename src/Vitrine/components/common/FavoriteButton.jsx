import React from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function FavoriteButton({ productId, className = "" }) {
  const { favorites, toggleFavorite } = useApp();
  const isFav = favorites.includes(productId);

  return (
    <button
      className={`favorite-btn ${isFav ? 'active' : ''} ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(productId);
      }}
      aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart 
        size={20} 
        fill={isFav ? "currentColor" : "none"} 
        strokeWidth={isFav ? 0 : 2}
      />
    </button>
  );
}
