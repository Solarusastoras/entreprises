import React, { useState } from 'react';
import Modal from 'react-modal';
import { useApp } from '../../context/AppContext';
import { PROFESSIONS } from '../../professions';
import { X } from 'lucide-react';

export default function AdminPanel({ isOpen, onClose }) {
  const {
    currentMetier, setCurrentMetier,
    selectedEnterprise, setSelectedEnterprise,
    isAdminConnected, setIsAdminConnected,
    isClientConnected, setIsClientConnected,
    entreprises
  } = useApp();

  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Gagnoa0+') {
      setIsAdminConnected(true);
      setIsClientConnected(true);
      onClose();
      setPassword('');
    } else {
      alert("Code incorrect.");
    }
  };

  const handleLogout = () => {
    setIsAdminConnected(false);
    setIsClientConnected(false);
    onClose();
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
      width: '90%',
      maxWidth: '500px',
      padding: '60px',
      borderRadius: '50px',
      border: 'none',
      background: '#111',
      color: '#fff',
      overflowY: 'auto',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      textAlign: 'center',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="modal-overlay"
      className="modal-content"
      contentLabel="Authentification"
    >
      <button onClick={onClose} className="btn-close-circle">
        <X size={24} />
      </button>

      {!isAdminConnected && !isClientConnected ? (
        <form onSubmit={handleLogin} className="admin-login-form">
          <h2>Connexion Espace</h2>
          <p style={{ opacity: 0.5, marginBottom: '40px', fontSize: '0.9rem' }}>Veuillez entrer votre code d'accès</p>
          <div className="input-group">
            <input
              type="password" 
              placeholder="Code secret..."
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-save btn-full">ACCÉDER</button>
          </div>
        </form>
      ) : (
        <div className="admin-panel">
          <h2 className="title-admin">PANNEAU ADMIN</h2>

          <div className="form-grid">
            <div className="input-group">
              <label>1. MÈTIER</label>
              <select 
                value={currentMetier} 
                onChange={(e) => setCurrentMetier(e.target.value)}
              >
                {PROFESSIONS.map(p => <option key={p.name} value={p.name} style={{ color: '#000' }}>{p.name}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>2. CLIENTS (BDD)</label>
              <select
                value={selectedEnterprise?.id || ''}
                onChange={(e) => setSelectedEnterprise(entreprises.find(ent => ent.id === Number(e.target.value)))}
              >
                {entreprises.map(e => <option key={e.id} value={e.id} style={{ color: '#000' }}>{e.nom}</option>)}
              </select>
            </div>
            <div className="modal-actions">
              <button 
                onClick={handleLogout} 
                className="btn-full btn-danger"
              >
                DÉCONNEXION GLOBALE
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
