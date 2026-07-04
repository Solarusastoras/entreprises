import React, { useState } from 'react';
import Modal from 'react-modal';
import { useApp } from '../../context/AppContext';
import { X, Camera, Check } from 'lucide-react';
import { updateEntreprise } from '../../../Utils/nasApi';

export default function QuickEditModal({ availableCategories }) {
  const { editingProduct, setEditingProduct, selectedEnterprise, setRefreshTrigger, products } = useApp();
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
      maxWidth: '600px',
      maxHeight: '95vh',
      padding: '40px',
      borderRadius: '40px',
      border: 'none',
      background: '#fff',
      overflowY: 'auto',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    },
  };

  if (!editingProduct) return null;

  return (
    <Modal
      isOpen={!!editingProduct}
      onRequestClose={() => setEditingProduct(null)}
      overlayClassName="modal-overlay"
      className="modal-content"
      contentLabel="Modification Rapide"
    >
      <button onClick={() => setEditingProduct(null)} className="btn-close-circle">
        <X size={20} />
      </button>

      <h2>Modifier l'article</h2>
      
      <div className="form-grid">
        <div className="img-upload-box">
          <img src={editingProduct.image_url || editingProduct.img} alt="Preview" />
          <input 
            type="file" accept="image/*" 
            onChange={(e) => handlePhotoUpload(editingProduct.id, e.target.files[0])} 
          />
          {uploadingId === editingProduct.id && (
            <div className="loader-overlay">
              CHARGEMENT...
            </div>
          )}
        </div>

        <div className="input-group">
          <label>Nom</label>
          <input 
            defaultValue={editingProduct.nom || editingProduct.name} 
            onBlur={(e) => handleProductUpdate(editingProduct.id, 'nom', e.target.value)} 
          />
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>Prix (€)</label>
            <input 
              type="number" 
              defaultValue={editingProduct.prix} 
              onBlur={(e) => handleProductUpdate(editingProduct.id, 'prix', e.target.value)} 
            />
          </div>
          <div className="input-group">
            <label>Catégorie</label>
            <select 
              defaultValue={editingProduct.category} 
              onChange={(e) => handleProductUpdate(editingProduct.id, 'category', e.target.value)}
            >
              {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="input-group">
          <label>Tag (Badge)</label>
          <input 
            defaultValue={editingProduct.tag} 
            onBlur={(e) => handleProductUpdate(editingProduct.id, 'tag', e.target.value)} 
          />
        </div>

        <div className="input-group">
          <label>Description</label>
          <textarea
            defaultValue={editingProduct.desc || editingProduct.description}
            onBlur={(e) => handleProductUpdate(editingProduct.id, 'desc', e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button onClick={() => setEditingProduct(null)} className="btn-full" style={{ background: '#000' }}>
            <Check size={20} />
            TERMINER
          </button>
        </div>
      </div>
    </Modal>
  );
}
