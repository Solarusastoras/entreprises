import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { THEME_MATRIX } from '../../themes';

// Gastronomy Themes
import ThemeRestoPremium from '../../themes/restaurant/ThemeRestoPremium';
import ThemeRestoClassique from '../../themes/restaurant/ThemeRestoClassique';
import ThemeRestoModerne from '../../themes/restaurant/ThemeRestoModerne';
import ThemeRestoRustique from '../../themes/restaurant/ThemeRestoRustique';
import ThemeRestoBistro from '../../themes/restaurant/ThemeRestoBistro';

// Business Themes
import ThemeLuxe from '../../themes/ThemeLuxe';
import ThemeVintage from '../../themes/ThemeVintage';
import ThemeMinimal from '../../themes/ThemeMinimal';
import ThemeModerne from '../../themes/ThemeModerne';
import ThemeEco from '../../themes/ThemeEco';

export default function ThemeRenderer() {
  const { siteData, products, isClientConnected, setEditingProduct, currentStyle, category, isRestaurant } = useApp();

  useEffect(() => {
    // Apply theme variables to root
    const theme = THEME_MATRIX[category]?.[currentStyle];
    if (!theme) return;
    
    const styleId = isRestaurant ? currentStyle + 5 : currentStyle;
    const root = document.documentElement;
    document.body.setAttribute('data-theme', styleId);
    
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [currentStyle, category, isRestaurant]);

  if (!siteData) return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Aucun commerce trouvé pour ce métier.</h2>
        <p>Essayez "Boulangerie" ou "Boucherie" pour la démonstration.</p>
      </div>
  );

  const themeProps = { 
    siteData, 
    products, 
    isEditable: isClientConnected, 
    onEditProduct: setEditingProduct 
  };

  if (isRestaurant) {
    switch(currentStyle) {
      case 1: return <ThemeRestoPremium {...themeProps} />;
      case 2: return <ThemeRestoClassique {...themeProps} />;
      case 3: return <ThemeRestoModerne {...themeProps} />;
      case 4: return <ThemeRestoRustique {...themeProps} />;
      case 5: return <ThemeRestoBistro {...themeProps} />;
      default: return <ThemeRestoPremium {...themeProps} />;
    }
  }

  switch(currentStyle) {
    case 1: return <ThemeLuxe {...themeProps} />;
    case 2: return <ThemeVintage {...themeProps} />;
    case 3: return <ThemeMinimal {...themeProps} />;
    case 4: return <ThemeModerne {...themeProps} />;
    case 5: return <ThemeEco {...themeProps} />;
    default: return <ThemeMinimal {...themeProps} />;
  }
}
