import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, X, Settings, LogIn, LogOut, Heart } from 'lucide-react';

export default function Header({ onShowAdmin, onShowClientLogin, onAdd, onManage, isAdding, isEditing }) {
  const {
    currentStyle, setCurrentStyle,
    isClientConnected, setIsClientConnected,
    setIsAdminConnected,
    siteData, isRestaurant,
    favorites, setIsFavoritesModalOpen
  } = useApp();

  const handleLogout = () => {
    setIsClientConnected(false);
    setIsAdminConnected(false);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Accueil', id: 'home' },
    { label: 'Notre Histoire', id: 'about' },
    { label: 'Collections', id: 'services' },
    { label: 'Nous Contacter', id: 'contact' }
  ];

  const styleNames = isRestaurant
    ? ["Premium", "Classique", "Moderne", "Rustique", "Bistro"]
    : ["Luxe", "Vintage", "Minimal", "Moderne", "Eco"];

  const getHeaderStyles = () => {
    switch (currentStyle) {
      case 1: return { 
        '--h-bg': 'rgba(10, 10, 10, 0.98)', 
        '--h-text': '#fff', 
        '--h-accent': '#c5a059', 
        '--h-l1-border': '1px solid rgba(197, 160, 89, 0.2)', 
        '--h-btn-bg': '#c5a059', 
        '--h-btn-text': '#000',
        '--h-selector-bg': 'rgba(255,255,255,0.1)',
        '--h-selector-text': 'rgba(255,255,255,0.5)',
        '--h-active-text': '#000'
      };
      case 2: return { 
        '--h-bg': 'rgba(252, 245, 230, 0.98)', 
        '--h-text': '#3d2b1f', 
        '--h-accent': '#8b5a2b', 
        '--h-l1-border': '2px solid #3d2b1f', 
        '--h-btn-bg': '#3d2b1f', 
        '--h-btn-text': '#fff',
        '--h-selector-bg': '#f5f5f5',
        '--h-selector-text': '#888',
        '--h-active-text': '#fff'
      };
      case 3: return { 
        '--h-bg': 'rgba(255, 255, 255, 0.98)', 
        '--h-text': '#000', 
        '--h-accent': '#000', 
        '--h-l1-border': '1px solid #000', 
        '--h-btn-bg': '#000', 
        '--h-btn-text': '#fff',
        '--h-selector-bg': '#f5f5f5',
        '--h-selector-text': '#888',
        '--h-active-text': '#fff'
      };
      case 4: return { 
        '--h-bg': 'rgba(15, 15, 15, 0.98)', 
        '--h-text': '#fff', 
        '--h-accent': '#fff', 
        '--h-l1-border': '2px solid #fff', 
        '--h-btn-bg': '#fff', 
        '--h-btn-text': '#000',
        '--h-selector-bg': 'rgba(255,255,255,0.1)',
        '--h-selector-text': 'rgba(255,255,255,0.5)',
        '--h-active-text': '#000'
      };
      case 5: return { 
        '--h-bg': 'rgba(240, 244, 238, 0.98)', 
        '--h-text': '#2d5a27', 
        '--h-accent': '#2d5a27', 
        '--h-l1-border': '1px solid rgba(45, 90, 39, 0.4)', 
        '--h-btn-bg': '#2d5a27', 
        '--h-btn-text': '#fff',
        '--h-selector-bg': '#f5f5f5',
        '--h-selector-text': '#888',
        '--h-active-text': '#fff'
      };
      default: return {};
    }
  };

  const cssVars = getHeaderStyles();

  return (
    <header className="permanent-header" style={cssVars}>
      <div className="header-l1">
        <div className="left-side">
          <button onClick={onShowAdmin} className="admin-toggle">
            <Settings size={20} />
          </button>
        </div>

        <div className="universe-selector desktop-only">
          {[1, 2, 3, 4, 5].map((s, i) => (
            <button
              key={s}
              onClick={() => setCurrentStyle(s)}
              className={currentStyle === s ? 'active' : ''}
            >
              {styleNames[i].toUpperCase()}
            </button>
          ))}
        </div>

        <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>

        <div className="spacer desktop-only"></div>
      </div>

      <div className="header-l2 desktop-only">
        <div className="store-status">
          <div className="status-dot"></div>
          <span className="status-text">OUVERT</span>
        </div>

        <nav>
          {navItems.map((item) => (
            <a key={item.label} href={`#${item.id}`}>{item.label}</a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="btn-favorites-trigger"
            onClick={() => setIsFavoritesModalOpen(true)}
          >
            <Heart size={20} fill={favorites.length > 0 ? 'var(--h-accent)' : 'transparent'} />
            {favorites.length > 0 && <span className="fav-badge">{favorites.length}</span>}
          </button>

          <div className="btn-connexion" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {!isClientConnected ? (
              <button onClick={onShowClientLogin}>CONNEXION 🔐</button>
            ) : (
              <>
                <button onClick={onAdd} style={{ background: 'var(--h-accent)', color: '#000', border: 'none', padding: '8px 15px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>➕ AJOUTER</button>
                <button onClick={handleLogout} className="btn-logout">DECO. ✕</button>
              </>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <nav>
            {navItems.map((item) => (
              <a key={item.label} href={`#${item.id}`} onClick={() => setMobileMenuOpen(false)}>{item.label}</a>
            ))}
          </nav>
          <div className="mobile-universe-selector">
            <p>THÈMES</p>
            <div className="grid">
              {[1, 2, 3, 4, 5].map((s, i) => (
                <button 
                  key={s} 
                  onClick={() => { setCurrentStyle(s); setMobileMenuOpen(false); }} 
                  className={currentStyle === s ? 'active' : ''}
                >
                  {styleNames[i]}
                </button>
              ))}
            </div>
          </div>
          {!isClientConnected ? (
            <button className="mobile-login" onClick={() => { onShowClientLogin?.(); setMobileMenuOpen(false); }}>CONNEXION</button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', padding: '0 20px', gap: '10px' }}>
              <button className="mobile-login" style={{ background: 'var(--h-accent)', color: '#000', margin: 0 }} onClick={() => { onAdd(); setMobileMenuOpen(false); }}>➕ AJOUTER</button>
              <button className="mobile-login" style={{ background: '#ff4444', color: '#fff', margin: 0 }} onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>DÉCONNEXION</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
