export const DEFAULT_PRODUCTS = {
  "FOOD": [
    { nom: "Sélection du Chef", desc: "Produits frais et de saison préparés avec passion.", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80" },
    { nom: "Spécialité Maison", desc: "Notre recette signature, un voyage gustatif inoubliable.", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80" },
    { nom: "Plateau Découverte", desc: "Un assortiment de nos meilleures saveurs à partager.", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80" }
  ],
  "SANTE": [
    { nom: "Consultation Complète", desc: "Bilan global personnalisé pour votre bien-être.", img: "https://images.unsplash.com/photo-1505751172107-1eb7df5ae891?w=800&q=80" },
    { nom: "Soin Spécifique", desc: "Traitement ciblé utilisant les dernières technologies.", img: "https://images.unsplash.com/photo-1576091160550-217359f4ecf8?w=800&q=80" },
    { nom: "Conseil & Prévention", desc: "Accompagnement sur mesure pour une santé durable.", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80" }
  ],
  "ARTISAN": [
    { nom: "Création sur Mesure", desc: "Pièce unique réalisée selon vos envies et besoins.", img: "https://images.unsplash.com/photo-1542295669297-4d352b042bca?w=800&q=80" },
    { nom: "Restauration", desc: "Redonnez vie à vos objets avec un savoir-faire traditionnel.", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80" },
    { nom: "Matériaux Nobles", desc: "Une sélection rigoureuse pour une qualité d'exception.", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80" }
  ],
  "SERVICES": [
    { nom: "Audit & Analyse", desc: "Évaluation précise pour optimiser votre performance.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" },
    { nom: "Accompagnement Premium", desc: "Un expert à vos côtés pour atteindre vos objectifs.", img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80" },
    { nom: "Solution Clé en Main", desc: "Gagnez du temps avec notre approche intégrée.", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80" }
  ],
  "CREATIF": [
    { nom: "Œuvre Originale", desc: "Émotion et créativité capturées dans un format unique.", img: "https://images.unsplash.com/photo-1460661419201-fd4cecea8f82?w=800&q=80" },
    { nom: "Atelier Créatif", desc: "Développez votre talent lors d'une session immersive.", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80" },
    { nom: "Design & Style", desc: "L'esthétique au service de votre identité visuelle.", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80" }
  ]
};

export const METIER_SPECIFIC_PRODUCTS = {
  "Boulangerie": [
    // Gâteaux (5)
    { category: "Gâteaux", nom: "Éclair au Chocolat", desc: "Crème pâtissière onctueuse et glaçage brillant.", img: "/images/products/eclair.png" },
    { category: "Gâteaux", nom: "Tartelette aux Fruits", desc: "Fruits frais de saison sur crème amandine.", img: "/images/products/tartelette.png" },
    { category: "Gâteaux", nom: "Paris-Brest", desc: "Choux léger, crème pralinée et amandes effilées.", img: "/images/products/paris_brest.png" },
    { category: "Gâteaux", nom: "Mille-Feuille", desc: "Trois couches de feuilletage et crème vanille intense.", img: "/images/products/mille_feuille.png" },
    { category: "Gâteaux", nom: "Le Framboisier", desc: "Génoise légère et crème mousseline aux framboises.", img: "/images/products/framboisier.png" },
    // Viennoiseries (5)
    { category: "Viennoiserie", nom: "Croissant Maison", desc: "Pur beurre de baratte, croustillant et fondant.", img: "/images/products/croissant.png" },
    { category: "Viennoiserie", nom: "Pain au Chocolat", desc: "Deux barres de chocolat dans un feuilletage d'exception.", img: "/images/products/pain_chocolat.png" },
    { category: "Viennoiserie", nom: "Brioche Sucre", desc: "Mie filante et gros grains de sucre croquants.", img: "/images/products/brioche.png" },
    { category: "Viennoiserie", nom: "Chausson aux Pommes", desc: "Compote maison de pommes acidulées.", img: "/images/products/chausson.png" },
    { category: "Viennoiserie", nom: "Pain aux Raisins", desc: "Crème pâtissière et raisins secs marinés.", img: "/images/products/pain_raisins.png" },
    // Sandwiches (5)
    { category: "Sandwich", nom: "Le Parisien", desc: "Jambon blanc supérieur, beurre AOP et cornichons.", img: "/images/products/parisien.png" },
    { category: "Sandwich", nom: "Poulet Curry", desc: "Crestes de poulet, crudités et sauce curry secrète.", img: "/images/products/poulet_curry.png" },
    { category: "Sandwich", nom: "Le Thon-Crudités", desc: "Mélange de thon, œufs, tomates et salade fraîche.", img: "/images/products/thon.png" },
    { category: "Sandwich", nom: "Le Végétarien", desc: "Légumes grillés, feta et houmous maison.", img: "/images/products/vegetarien.png" },
    { category: "Sandwich", nom: "Le Pan Bagnat", desc: "Saveurs du sud, huile d'olive et légumes croquants.", img: "/images/products/pan_bagnat.png" }
  ],
  "Boucherie": [
    { nom: "Côte de Bœuf Maturée", desc: "Sélectionnée avec soin et maturée en cave pour une tendreté absolue.", img: "/images/products/boucherie/cote_boeuf.png" },
    { nom: "Saucisserie Maison", desc: "Recettes traditionnelles sans additifs, hachées chaque matin.", img: "/images/products/boucherie/saucisses.png" },
    { nom: "Volaille Fermière", desc: "Élevée en plein air, une qualité incomparable pour vos repas.", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80" }
  ],
  "Podologue": [
    { nom: "Semelles Orthopédiques", desc: "Conception sur mesure après bilan podologique complet.", img: "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=800&q=80" },
    { nom: "Soin de Pédicurie", desc: "Traitement des affections de la peau et des ongles du pied.", img: "https://images.unsplash.com/photo-1519415510236-85592ada72c8?w=800&q=80" },
    { nom: "Bilan Postural", desc: "Analyse dynamique et statique de votre marche et posture.", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80" }
  ],
  "Garage": [
    { nom: "Entretien Complet", desc: "Révision constructeur préservant votre garantie.", img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80" },
    { nom: "Diagnostic Électronique", desc: "Lecture et analyse pointue des systèmes de bord.", img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80" },
    { nom: "Pneumatiques", desc: "Large choix de marques et montage professionnel.", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80" }
  ],
  "Coiffure": [
    { nom: "Coupe & Coiffage", desc: "Techniques de pointe pour sublimer votre visage.", img: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80" },
    { nom: "Coloration Expert", desc: "Nuances sur mesure et respectueuses de vos cheveux.", img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80" },
    { nom: "Soin Rituel", desc: "Moment de détente et soin profond pour votre cuir chevelu.", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80" }
  ],
  "Restaurant": [
    // Plat du jour
    { category: "Plat du jour", nom: "L'Entrecôte Gourmande", desc: "Une pièce de bœuf d'exception accompagnée de frites maison et notre sauce secrète.", prix: "22", img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80" },
    // Entrées
    { category: "Entrée", nom: "Foie Gras Maison", desc: "Foie gras de canard mi-cuit, chutney de figues et brioche toastée.", prix: "18", img: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=800&q=80" },
    { category: "Entrée", nom: "Carpaccio de Saint-Jacques", desc: "Noix de Saint-Jacques marinées aux agrumes et baies roses.", prix: "16", img: "https://images.unsplash.com/photo-1533642954103-6cb669fc9e32?w=800&q=80" },
    // Plats
    { category: "Plat", nom: "Filet de Boeuf aux Morilles", desc: "Tendre filet de bœuf, sauce crémeuse et pommes grenailles.", prix: "28", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80" },
    { category: "Plat", nom: "Risotto aux Gambas", desc: "Risotto crémeux au safran et gambas snackées à la plancha.", prix: "24", img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80" },
    // Desserts
    { category: "Dessert", nom: "Millefeuille Vanille", desc: "Pâte feuilletée légère et crème diplomate à la vanille bourbon.", prix: "11", img: "https://images.unsplash.com/photo-1510629954389-c1e0da47d415?w=800&q=80" },
    { category: "Dessert", nom: "Fondant Chocolat", desc: "Cœur coulant au chocolat Valrhona, glace stracciatella.", prix: "10", img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80" },
    // Boissons
    { category: "Boisson", nom: "Vin Rouge - Bordeaux", desc: "Verre de Bordeaux, slection du sommelier.", prix: "7", img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80" },
    { category: "Boisson", nom: "Bière Artisanale", desc: "Bière blonde locale brassée à l'ancienne.", prix: "6", img: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80" },
    { category: "Boisson", nom: "Limonade Maison", desc: "Limonade fraîche au citron bio et menthe du jardin.", prix: "5", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80" }
  ],
  "Vendeur de vêtements": [
    { nom: "Veste de Saison", desc: "Coupe moderne et matières nobles pour un style affirmé.", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80" },
    { nom: "Robe Élégante", desc: "Design raffiné et tombé parfait pour vos grandes occasions.", img: "https://images.unsplash.com/photo-1539008835657-9e8e9680fe0a?w=800&q=80" },
    { nom: "Collection Denim", desc: "Large gamme de coupes et de délavages éco-responsables.", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80" },
    { nom: "Sneakers Premium", desc: "Le confort d'une chaussure de sport avec une finition luxe.", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80" },
    { nom: "Accessoires & Maroquinerie", desc: "La touche finale indispensable à votre tenue du jour.", img: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&q=80" }
  ]
};

export const getPlaceholderProducts = (category, metier) => {
  const isRestaurant = ["restaurant", "bistro", "café", "brasserie", "auberge"].some(word => metier.toLowerCase().includes(word));
  
  let baseProducts = [];

  if (isRestaurant && METIER_SPECIFIC_PRODUCTS["Restaurant"]) {
    baseProducts = METIER_SPECIFIC_PRODUCTS["Restaurant"];
  } else if (metier) {
    const matchedMetier = Object.keys(METIER_SPECIFIC_PRODUCTS).find(m => m.toLowerCase() === metier.toLowerCase());
    if (matchedMetier) {
      baseProducts = METIER_SPECIFIC_PRODUCTS[matchedMetier];
    } else {
      baseProducts = DEFAULT_PRODUCTS[category] || DEFAULT_PRODUCTS["SERVICES"];
    }
  } else {
    baseProducts = DEFAULT_PRODUCTS[category] || DEFAULT_PRODUCTS["SERVICES"];
  }

  // Prefix local image paths with PUBLIC_URL
  const publicUrl = process.env.PUBLIC_URL || "";
  return baseProducts.map((p, index) => ({
    ...p,
    id: p.id || `placeholder-${index}`,
    img: (p.img && p.img.startsWith('/images/')) 
      ? `${publicUrl}${p.img}` 
      : p.img
  }));
};
