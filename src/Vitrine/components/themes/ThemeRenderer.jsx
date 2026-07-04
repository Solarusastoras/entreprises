import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { THEME_MATRIX } from '../../themes';

// Gastronomy Themes
import ThemeRestoPremium from '../../themes/restaurant/ThemeRestoPremium';
import ThemeRestoClassique from '../../themes/restaurant/ThemeRestoClassique';
import ThemeRestoModerne from '../../themes/restaurant/ThemeRestoModerne';
import ThemeRestoRustique from '../../themes/restaurant/ThemeRestoRustique';
import ThemeRestoBistro from '../../themes/restaurant/ThemeRestoBistro';

// Boulangerie Themes
import ThemeBoulangerieLuxe from '../../themes/boulangerie/ThemeBoulangerieLuxe';
import ThemeBoulangerieVintage from '../../themes/boulangerie/ThemeBoulangerieVintage';
import ThemeBoulangerieMinimal from '../../themes/boulangerie/ThemeBoulangerieMinimal';
import ThemeBoulangerieModerne from '../../themes/boulangerie/ThemeBoulangerieModerne';
import ThemeBoulangerieEco from '../../themes/boulangerie/ThemeBoulangerieEco';

// Vetements Themes
import ThemeVetementLuxe from '../../themes/vetements/ThemeVetementLuxe';
import ThemeVetementVintage from '../../themes/vetements/ThemeVetementVintage';
import ThemeVetementMinimal from '../../themes/vetements/ThemeVetementMinimal';
import ThemeVetementModerne from '../../themes/vetements/ThemeVetementModerne';
import ThemeVetementEco from '../../themes/vetements/ThemeVetementEco';

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

  const isVetement = category && (category.toLowerCase().includes('vêtement') || category.toLowerCase().includes('vetement') || category.toLowerCase().includes('mode') || category.toLowerCase().includes('habit'));
  if (isVetement) {
    switch(currentStyle) {
      case 1: return <ThemeVetementLuxe {...themeProps} />;
      case 2: return <ThemeVetementVintage {...themeProps} />;
      case 3: return <ThemeVetementMinimal {...themeProps} />;
      case 4: return <ThemeVetementModerne {...themeProps} />;
      case 5: return <ThemeVetementEco {...themeProps} />;
      default: return <ThemeVetementMinimal {...themeProps} />;
    }
  }

  switch(currentStyle) {
    case 1: return <ThemeBoulangerieLuxe {...themeProps} />;
    case 2: return <ThemeBoulangerieVintage {...themeProps} />;
    case 3: return <ThemeBoulangerieMinimal {...themeProps} />;
    case 4: return <ThemeBoulangerieModerne {...themeProps} />;
    case 5: return <ThemeBoulangerieEco {...themeProps} />;
    default: return <ThemeBoulangerieMinimal {...themeProps} />;
  }
}
