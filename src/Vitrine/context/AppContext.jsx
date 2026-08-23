import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEntreprises } from '../../Utils/nasApi';
import { PROFESSIONS } from '../professions';
import { getPlaceholderProducts } from '../productsData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentStyle, setCurrentStyle] = useState(1);
  const [currentMetier, setCurrentMetier] = useState('Boulangerie');
  const [selectedEnterprise, setSelectedEnterprise] = useState(null);
  const [products, setProducts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAdminConnected, setIsAdminConnected] = useState(false);
  const [isClientConnected, setIsClientConnected] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('site_favoris');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const isFav = prev.includes(productId);
      const next = isFav ? prev.filter(id => id !== productId) : [...prev, productId];
      localStorage.setItem('site_favoris', JSON.stringify(next));
      return next;
    });
  };

  const professionData = PROFESSIONS.find(p => currentMetier.toLowerCase().includes(p.name.toLowerCase())) || { category: "SERVICES" };
  const category = professionData.category;
  const isRestaurant = ["restaurant", "bistro", "café", "brasserie", "auberge"].some(word => currentMetier.toLowerCase().includes(word));

  const fetchProducts = async () => {
    // 1. On charge les placeholders par défaut
    let baseProducts = getPlaceholderProducts(category, currentMetier);
    
    // 2. S'il y a des produits personnalisés pour cette entreprise sur le NAS, on les ajoute !
    if (selectedEnterprise && selectedEnterprise.produits) {
      try {
        const customProducts = JSON.parse(selectedEnterprise.produits);
        const newCustomProducts = [];
        
        customProducts.forEach(cp => {
          const index = baseProducts.findIndex(bp => bp.id === cp.id);
          if (index >= 0) {
            baseProducts[index] = { ...baseProducts[index], ...cp };
          } else {
            newCustomProducts.push(cp);
          }
        });
        
        baseProducts = [...newCustomProducts, ...baseProducts];
      } catch (err) {
        console.error("Erreur de lecture des produits personnalisés", err);
      }
    }
    
    setProducts(baseProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedEnterprise, category, currentMetier, refreshTrigger]);

  // Fetch enterprises whenever the profession (metier) changes
  useEffect(() => {
    async function fetchEntreprises() {
      if (!currentMetier) return;
      setLoading(true);
      
      try {
        // On va chercher directement dans le NAS via l'API unifiée
        const allEntreprises = await getEntreprises();
        if (!allEntreprises) throw new Error("Erreur de récupération NAS");
        // Filtrer localement par secteur
        const filtered = allEntreprises.filter(e => 
          e.secteur && e.secteur.toLowerCase().includes(currentMetier.toLowerCase())
        );
        
        setEntreprises(filtered);
        
        // Extraction de l'ID (compatible avec HashRouter '#/vitrine?id=91')
        let urlId = null;
        if (window.location.hash.includes('?')) {
          const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
          urlId = hashParams.get('id');
        } else {
          const searchParams = new URLSearchParams(window.location.search);
          urlId = searchParams.get('id');
        }
        
        if (urlId) {
          const specificEnterprise = allEntreprises.find(e => e.id && e.id.toString() === urlId.toString());
          if (specificEnterprise) {
            setSelectedEnterprise(specificEnterprise);
            setCurrentMetier(specificEnterprise.secteur); // Mets à jour le métier
          }
        } else if (filtered.length > 0) {
          setSelectedEnterprise(filtered[0]);
        } else {
          setSelectedEnterprise(null);
        }
      } catch (err) {
        console.error(err);
      }
      
      setLoading(false);
    }
    fetchEntreprises();
  }, [currentMetier]);

  const ORDRE_JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  const ordonnerHoraires = (rawHoraires) => {
    if (!rawHoraires) return {};
    let parsed = rawHoraires;
    try {
      if (typeof rawHoraires === 'string') parsed = JSON.parse(rawHoraires);
    } catch {
      return {};
    }
    if (!parsed || typeof parsed !== 'object') return {};

    const sorted = {};
    ORDRE_JOURS.forEach((jour) => {
      const key = Object.keys(parsed).find(k => k.toLowerCase() === jour);
      if (key && parsed[key]) {
        sorted[jour] = parsed[key];
      }
    });

    Object.keys(parsed).forEach((k) => {
      if (!ORDRE_JOURS.includes(k.toLowerCase()) && parsed[k]) {
        sorted[k] = parsed[k];
      }
    });

    return sorted;
  };

  const siteData = selectedEnterprise ? {
    ...selectedEnterprise,
    selectedStyle: currentStyle,
    nomEntreprise: selectedEnterprise.nom,
    metier: selectedEnterprise.secteur,
    category: category,
    descriptionCourte: selectedEnterprise.description_courte || 
                       (selectedEnterprise.secteur === 'Boulangerie' ? "L'excellence artisanale au service de votre gourmandise." : "Votre professionnel de confiance."),
    descriptionLongue: selectedEnterprise.description || "Bienvenue sur notre site vitrine premium.",
    horaires: ordonnerHoraires(selectedEnterprise.horaires),
    mapsIframeUrl: `https://maps.google.com/maps?q=${selectedEnterprise.adresse}&z=15&output=embed`,
    telephone: selectedEnterprise.telephone,
    email: selectedEnterprise.email,
    adresse: selectedEnterprise.adresse
  } : null;

  const value = {
    currentStyle, setCurrentStyle,
    currentMetier, setCurrentMetier,
    selectedEnterprise, setSelectedEnterprise,
    products, setProducts,
    refreshTrigger, setRefreshTrigger,
    isAdminConnected, setIsAdminConnected,
    isClientConnected, setIsClientConnected,
    editingProduct, setEditingProduct,
    entreprises, loading,
    favorites, toggleFavorite,
    isFavoritesModalOpen, setIsFavoritesModalOpen,
    category, isRestaurant, professionData, siteData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
