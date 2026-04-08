export function formaterTelephone(tel) {
  if (!tel) return '';
  return tel.replace(/\s/g, '').replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

export const JOURS_SEMAINE = [
  'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'
];

export function jourActuel() {
  const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  return jours[new Date().getDay()];
}

export function estOuvert(horaires) {
  if (!horaires) return null;
  const jour = jourActuel();
  const h = horaires[jour];
  if (!h || h.toLowerCase() === 'fermé') return false;
  return true;
}

export function validerEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validerTelephone(tel) {
  return /^(\+33|0)[0-9 ]{9,14}$/.test(tel.replace(/\s/g, ''));
}

export const ICONES_SECTEUR = {
  "Accordeur de pianos": "🎹",
  "Ambulancier": "🚑",
  "Archetier": "🎻",
  "Auto-école": "🚗",
  "Bijouterie": "💍",
  "Bottier": "👢",
  "Boulangerie": "🥖",
  "Boucherie": "🥩",
  "Brasseur": "🍺",
  "Café / Bar": "☕",
  "Canalisateur": "🚰",
  "Carreleur-mosaïste": "🧱",
  "Carrossier": "🚙",
  "Charcutier": "🍖",
  "Chaudronnier": "🏭",
  "Chauffagiste": "🌡️",
  "Chauffeur de taxi": "🚕",
  "Charpente": "🪵",
  "Charpentier": "🔨",
  "Chocolatier-confiseur": "🍫",
  "Coiffeur": "✂️",
  "Coiffure": "✂️",
  "Collectionneur": "🖼️",
  "Cordonnier": "👞",
  "Couturier": "🧵",
  "Couverture": "🏠",
  "Couvreur": "🛖",
  "Crêpier": "🥞",
  "Déménageur": "📦",
  "Ebéniste": "🪚",
  "Électricité": "⚡",
  "Electricien": "🔌",
  "École de musique": "🎵",
  "École de danse": "🩰",
  "Encadreur": "🖼️",
  "Épicerie": "🛒",
  "Esthéticien cosméticien": "💅",
  "Façonnier": "🏗️",
  "Facteur d'instruments de musique": "🎷",
  "Ferronnier": "⚒️",
  "Fleuriste": "🌸",
  "Fondeur": "🔥",
  "Fourreur": "🧥",
  "Garage automobile": "🔧",
  "Glacier": "🍦",
  "Graveur sur pierre": "🪨",
  "Horloger": "⌚",
  "Immobilier": "🏢",
  "Joaillier": "💎",
  "Kinésithérapie": "🏥",
  "Lapidaire": "🗿",
  "Librairie": "📚",
  "Maçonnerie": "🧱",
  "Maréchal-ferrant": "🐴",
  "Maroquinier": "👜",
  "Marqueteur": "🧩",
  "Mécanicien automobile": "🧑‍🔧",
  "Mécanicien Motocycles": "🏍️",
  "Mécanicien de maintenance des matériels d'espaces verts": "🚜",
  "Menuiserie": "🪚",
  "Métallerie": "🔩",
  "Modéliste textile": "👗",
  "Modiste": "👒",
  "Opérateur en productique mécanique": "⚙️",
  "Optique": "👓",
  "Orfèvre": "🥇",
  "Orthoprothésiste": "🦿",
  "Pâtisserie": "🍰",
  "Peintre en bâtiment": "🖌️",
  "Peintre en décor": "🎨",
  "Pharmacie": "💊",
  "Photographe": "📸",
  "Plombier": "🧰",
  "Podo-orthésiste": "🦶",
  "Podologue": "👣",
  "Poissonnier": "🐟",
  "Potier-céramiste": "🏺",
  "Pressing": "👔",
  "Prothésiste dentaire": "🦷",
  "Ramoneur": "🧹",
  "Restaurant": "🍴",
  "Restaurant japonais": "🍣",
  "Sellier": "🐎",
  "Sérigraphe": "🖨️",
  "Sertisseur": "💍",
  "Serrurerie": "🔑",
  "Tailleur": "👔",
  "Tapissier": "🪑",
  "Taxi / VTC": "🚕",
  "Tonnelier": "🛢️",
  "Traiteur": "🍽️",
  "Verrier": "🪟",
  "Vendeur de vêtements": "👕",
  "Vendeur de meubles": "🪑",
  "Vendeur articles de sport": "⚽",
  "Vétérinaire": "🐾",
  "Vitrailliste": "🪟",
  "Magasin de sport": "🏄",
  "Plomberie": "🚿",
  "Autre": "🏪"
};

export function iconeParSecteur(secteur) {
  return ICONES_SECTEUR[secteur] || '🏪';
}

// --- Prospection ---
export const STATUTS_PROSPECTION = [
  { value: 'prospect', label: 'Prospect' },
  { value: 'contact', label: 'Contact' },
  { value: 'devis', label: 'Devis' },
  { value: 'signe', label: 'Signé' },
];

export const STATUTS_SITE = [
  { value: 'maquette', label: 'Maquette' },
  { value: 'developpement', label: 'Dév.' },
  { value: 'validation', label: 'Validation' },
  { value: 'enligne', label: 'En ligne' },
  { value: 'livre', label: 'Livré' },
];

export function indexStatutProspection(statut) {
  return STATUTS_PROSPECTION.findIndex((s) => s.value === statut);
}

export function indexStatutSite(statut) {
  return STATUTS_SITE.findIndex((s) => s.value === statut);
}

// Calcul relance
export function statutRelance(date_relance) {
  if (!date_relance) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const relance = new Date(date_relance);
  relance.setHours(0, 0, 0, 0);
  const diff = Math.ceil((relance - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { type: 'urgente', label: `Relance dépassée de ${Math.abs(diff)}j !` };
  if (diff === 0) return { type: 'urgente', label: "Relance aujourd'hui !" };
  if (diff <= 3) return { type: 'bientot', label: `Relance dans ${diff} jour${diff > 1 ? 's' : ''}` };
  return { type: 'ok', label: `Relance le ${relance.toLocaleDateString('fr-FR')}` };
}
