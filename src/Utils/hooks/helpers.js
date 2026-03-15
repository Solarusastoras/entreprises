export function formaterTelephone(tel) {
  if (!tel) return '';
  return tel.replace(/\s/g, '').replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

export function slugifier(texte) {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
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
  'Boulangerie':        '🥖',
  'Pâtisserie':         '🍰',
  'Boucherie':          '🥩',
  'Épicerie':           '🛒',
  'Traiteur':           '🍽️',
  'Restaurant':         '🍴',
  'Restaurant japonais':'🍣',
  'Café / Bar':         '☕',
  'Coiffure':           '✂️',
  'Pharmacie':          '💊',
  'Optique':            '👓',
  'Kinésithérapie':     '🏥',
  'Vétérinaire':        '🐾',
  'Garage automobile':  '🔧',
  'Plomberie':          '🚿',
  'Électricité':        '⚡',
  'Menuiserie':         '🪚',
  'Immobilier':         '🏠',
  'Auto-école':         '🚗',
  'Pressing':           '👔',
  'Librairie':          '📚',
  'Fleuriste':          '🌸',
  'Bijouterie':         '💍',
  'Magasin de sport':   '🏄',
  'École de musique':   '🎵',
};

export function iconeParSecteur(secteur) {
  return ICONES_SECTEUR[secteur] || '🏪';
}
