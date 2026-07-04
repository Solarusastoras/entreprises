import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useApp } from '../../context/AppContext';
import { X, Upload } from 'lucide-react';
import { updateEntreprise } from '../../../Utils/nasApi';

export default function ProductAddModal({ isOpen, onClose, availableCategories }) {
  const { selectedEnterprise, setSelectedEnterprise, setRefreshTrigger, isRestaurant } = useApp();
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nom: '', prix: '', tag: '', desc: '', category: availableCategories[0], file: null, preview: null
  });

  const handleAddProduct = async () => {
    if (!newProduct.nom || !newProduct.prix) return alert("Veuillez remplir le nom et le prix.");
    if (!selectedEnterprise) return alert("Aucune entreprise sélectionnée.");
    setLoading(true);

    try {
      // 1. Convert image to base64 if it exists
      let base64Img = newProduct.preview;
      if (newProduct.file) {
        base64Img = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(newProduct.file);
        });
      }

      // 2. Create the product object
      const addedProduct = {
        id: Date.now().toString(),
        nom: newProduct.nom,
        prix: newProduct.prix,
        desc: newProduct.desc,
        category: newProduct.category,
        tag: newProduct.tag,
        img: base64Img
      };

      // 3. Retrieve existing custom products from the enterprise
      let existingProducts = [];
      try {
        if (selectedEnterprise.produits) existingProducts = JSON.parse(selectedEnterprise.produits);
      } catch(e) {}
      
      const updatedProducts = [addedProduct, ...existingProducts];

      // 4. Update the NAS
      await updateEntreprise(selectedEnterprise.id, { produits: JSON.stringify(updatedProducts) });

      // 5. Update local state
      setSelectedEnterprise({ ...selectedEnterprise, produits: JSON.stringify(updatedProducts) });
      setRefreshTrigger(prev => prev + 1);

      // 6. Reset form & close
      setNewProduct({ nom: '', prix: '', tag: '', desc: '', category: availableCategories[0], file: null, preview: null });
      onClose();
    } catch(err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement du produit.");
    } finally {
      setLoading(false);
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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="modal-overlay"
      className="modal-content"
      contentLabel="Ajouter un article"
    >
      <button onClick={onClose} className="btn-close-circle">
        <X size={20} />
      </button>

      <h2>Nouvel Article</h2>
      
      <div className="form-grid">
        <div className="img-upload-box" style={{ position: 'relative' }}>
          {newProduct.preview ? (
            <>
              <img src={newProduct.preview} alt="Preview" />
              {newProduct.tag && (
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: 'var(--h-accent, #c5a059)', color: '#000',
                  padding: '5px 15px', fontSize: '0.75rem', fontWeight: 'bold',
                  letterSpacing: '2px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                  zIndex: 10
                }}>
                  {newProduct.tag.toUpperCase()}
                </div>
              )}
            </>
          ) : (
            <div className="placeholder">
              <Upload size={40} />
              <span>PHOTO PRODUIT</span>
            </div>
          )}
          <input
            type="file" accept="image/*" capture="environment"
            onChange={(e) => {
              const f = e.target.files[0];
              if (f) setNewProduct({ ...newProduct, file: f, preview: URL.createObjectURL(f) });
            }}
          />
        </div>

        <div className="input-group">
          <label>Titre</label>
          <input 
            placeholder="Ex: Croissant au Beurre" 
            value={newProduct.nom} 
            onChange={(e) => setNewProduct({ ...newProduct, nom: e.target.value })} 
          />
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>Prix (€)</label>
            <input 
              placeholder="0.00" 
              type="number" 
              value={newProduct.prix} 
              onChange={(e) => setNewProduct({ ...newProduct, prix: e.target.value })} 
            />
          </div>
          <div className="input-group">
            <label>Catégorie</label>
            <select 
              value={newProduct.category} 
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            >
              {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="input-group">
          <label>Tag (Badge)</label>
          <input 
            placeholder="Ex: -50%" 
            className="input-tag"
            value={newProduct.tag} 
            onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })} 
          />
        </div>

        <div className="input-group">
          <label>Description</label>
          <textarea
            placeholder="Plus de détails sur l'article..."
            value={newProduct.desc}
            onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
          />
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">ANNULER</button>
          <button onClick={handleAddProduct} className="btn-save">
            {loading ? 'ENREGISTREMENT...' : 'ENREGISTRER'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
