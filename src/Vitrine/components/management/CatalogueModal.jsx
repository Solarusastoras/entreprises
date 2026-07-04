import React, { useState } from 'react';
import Modal from 'react-modal';
import { useApp } from '../../context/AppContext';
import { X, Trash2, Camera } from 'lucide-react';
import { updateEntreprise } from '../../../Utils/nasApi';

export default function CatalogueModal({ isOpen, onClose, availableCategories }) {
  const { selectedEnterprise, products, setRefreshTrigger } = useApp();
  const [uploadingId, setUploadingId] = useState(null);

  const handleProductUpdate = async (productId, field, value) => {
    try {
      const existingProducts = selectedEnterprise.produits ? JSON.parse(selectedEnterprise.produits) : [];
      let updatedProducts = [...existingProducts];
      const productIndex = updatedProducts.findIndex(p => p.id === productId);

      if (productIndex >= 0) {
        updatedProducts[productIndex] = { ...updatedProducts[productIndex], [field]: value };
      } else {
        const placeholder = products.find(p => p.id === productId);
        if (placeholder) {
          updatedProducts.push({ ...placeholder, [field]: value });
        }
      }

      await updateEntreprise(selectedEnterprise.id, { produits: JSON.stringify(updatedProducts) });
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification.");
    }
  };

  const handlePhotoUpload = async (productId, file) => {
    if (!file) return;
    setUploadingId(productId);
    try {
      const base64Img = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      const existingProducts = selectedEnterprise.produits ? JSON.parse(selectedEnterprise.produits) : [];
      let updatedProducts = [...existingProducts];
      const productIndex = updatedProducts.findIndex(p => p.id === productId);

      if (productIndex >= 0) {
        updatedProducts[productIndex] = { ...updatedProducts[productIndex], img: base64Img };
      } else {
        const placeholder = products.find(p => p.id === productId);
        if (placeholder) {
          updatedProducts.push({ ...placeholder, img: base64Img });
        }
      }

      await updateEntreprise(selectedEnterprise.id, { produits: JSON.stringify(updatedProducts) });
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload de l'image.");
    } finally {
      setUploadingId(null);
    }
  };

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
      width: '95%',
      maxWidth: '1100px',
      maxHeight: '90vh',
      padding: '40px',
      borderRadius: '40px',
      border: 'none',
      background: '#fff',
      overflowY: 'auto',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="modal-overlay"
      className="modal-content modal-wide"
      contentLabel="Catalogue"
    >
      <button onClick={onClose} className="btn-close-pill">
        Fermer
      </button>

      <h2 className="title-huge">
        Catalogue de {selectedEnterprise?.nom}
      </h2>

      <div className="products-list">
        {products.map(p => (
          <div key={p.id} className="product-row">
            <div className="img-col">
              <div className="img-preview">
                <img src={p.image_url || p.img} alt={p.nom} />
              </div>
              <label className={`btn-photo-label ${uploadingId === p.id ? 'loading' : ''}`}>
                {uploadingId === p.id ? '...' : 'PHOTOS'}
                <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload(p.id, e.target.files[0])} />
              </label>
            </div>

            <div className="fields-col">
              <div className="input-group">
                <label>Nom</label>
                <input
                  defaultValue={p.nom}
                  onBlur={(e) => handleProductUpdate(p.id, 'nom', e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Prix</label>
                  <input
                    type="number"
                    defaultValue={p.prix}
                    onBlur={(e) => handleProductUpdate(p.id, 'prix', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Catégorie</label>
                  <select
                    defaultValue={p.category}
                    onChange={(e) => handleProductUpdate(p.id, 'category', e.target.value)}
                  >
                    {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Tag</label>
                  <input
                    defaultValue={p.tag}
                    placeholder="-"
                    className="input-tag"
                    onBlur={(e) => handleProductUpdate(p.id, 'tag', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="desc-col">
              <label>Description</label>
              <textarea
                defaultValue={p.desc || p.description}
                onBlur={(e) => handleProductUpdate(p.id, 'desc', e.target.value)}
              />
            </div>

            <div className="delete-col">
              <button
                className="btn-delete"
                onClick={async () => {
                  if (window.confirm("Supprimer définitivement cet article ?")) {
                    try {
                      const existingProducts = selectedEnterprise.produits ? JSON.parse(selectedEnterprise.produits) : [];
                      const filteredProducts = existingProducts.filter(ep => ep.id !== p.id);
                      await updateEntreprise(selectedEnterprise.id, { produits: JSON.stringify(filteredProducts) });
                      setRefreshTrigger(prev => prev + 1);
                    } catch (err) {
                      console.error(err);
                      alert("Erreur lors de la suppression.");
                    }
                  }
                }}
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
