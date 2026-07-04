import React from 'react';
import Modal from 'react-modal';
import { useApp } from '../../context/AppContext';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';

export default function FavoritesModal() {
  const { 
    isFavoritesModalOpen, 
    setIsFavoritesModalOpen, 
    favorites, 
    toggleFavorite, 
    products,
    siteData 
  } = useApp();

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 100000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      position: 'relative',
      inset: 'auto',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '80vh',
      padding: '40px',
      borderRadius: '30px',
      border: 'none',
      background: '#fff',
      overflowY: 'auto',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    },
  };

  return (
    <Modal
      isOpen={isFavoritesModalOpen}
      onRequestClose={() => setIsFavoritesModalOpen(false)}
      style={customStyles}
      contentLabel="Mes Favoris"
    >
      <div className="favorites-modal-header">
        <div className="title-area">
          <Heart className="heart-icon-filled" fill="#ff4d4d" color="#ff4d4d" />
          <h2>Mes Favoris</h2>
        </div>
        <button className="btn-close-modal" onClick={() => setIsFavoritesModalOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <div className="favorites-list">
        {favoriteProducts.length === 0 ? (
          <div className="empty-favorites">
            <ShoppingBag size={60} strokeWidth={1} />
            <p>Votre liste est vide pour le moment.</p>
            <button className="btn-start-shopping" onClick={() => setIsFavoritesModalOpen(false)}>
              Parcourir la carte
            </button>
          </div>
        ) : (
          favoriteProducts.map((product) => (
            <div key={product.id} className="fav-item-row">
              <div className="fav-item-img">
                <img src={product.img || product.image_url} alt={product.nom} />
              </div>
              <div className="fav-item-info">
                <h4>{product.nom || product.name}</h4>
                <p className="price">{product.prix || "---"}€</p>
              </div>
              <button 
                className="btn-remove-fav" 
                onClick={() => toggleFavorite(product.id)}
                title="Retirer des favoris"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      {favoriteProducts.length > 0 && (
        <div className="favorites-modal-footer">
          <p>{favoriteProducts.length} produit{favoriteProducts.length > 1 ? 's' : ''} dans votre sélection</p>
        </div>
      )}
    </Modal>
  );
}
