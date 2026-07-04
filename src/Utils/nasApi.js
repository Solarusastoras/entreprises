// IP locale du Mini PC / NAS (réseau maison)
const NAS_LOCAL_IP = '192.168.1.27';
const NAS_PORT = 5001;

// Clé utilisée pour la sauvegarde locale
const LOCAL_STORAGE_KEY = 'entreprises_db';

/**
 * Détermine si l'utilisateur est sur le réseau local (maison).
 */
// Tunnel HTTPS actif (localhost.run vers le Mini PC)
const API_BASE_URL = 'https://api.solarusweb.ovh';

/**
 * Helper avec un timeout pour éviter que l'UI ne gèle si le NAS est éteint
 */
async function fetchWithTimeout(url, options = {}, timeout = 2500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Lit les données de sauvegarde en local (localStorage)
 */
function getLocalEntreprises() {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Erreur parsing localStorage', e);
      return [];
    }
  }
  return [];
}

/**
 * Enregistre les données en local (localStorage)
 */
function saveLocalEntreprises(entreprises) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entreprises));
}


// ==========================================
// MÉTHODES CRUD POUR LES ENTREPRISES
// ==========================================

/**
 * LIRE : Récupère la liste de toutes les entreprises
 */
export async function getEntreprises() {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/entreprises`, {}, 2500);
    if (!response.ok) {
      throw new Error('Erreur NAS (status: ' + response.status + ')');
    }
    const data = await response.json();
    
    // On met à jour la sauvegarde locale si le NAS répond
    saveLocalEntreprises(data);
    return data;
    
  } catch (error) {
    console.warn("Connexion NAS impossible, chargement des entreprises depuis le localStorage...", error);
    // Mode "Hors-Ligne" : on retourne les données sauvegardées
    return getLocalEntreprises();
  }
}

/**
 * CRÉER : Ajoute une nouvelle entreprise
 */
export async function createEntreprise(entreprise) {
  // 1. Sauvegarde locale immédiate (optimiste)
  const localData = getLocalEntreprises();
  const newEntreprise = { 
    id: Date.now().toString(), // Génération d'un ID temporaire/unique
    ...entreprise 
  };
  localData.push(newEntreprise);
  saveLocalEntreprises(localData);

  // 2. Tentative d'envoi au NAS
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/entreprises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntreprise),
    }, 2500);
    
    if (!response.ok) throw new Error("Erreur NAS création");
    return await response.json();
  } catch (error) {
    console.warn("Création NAS impossible, entreprise sauvegardée localement.", error);
    return newEntreprise;
  }
}

/**
 * METTRE À JOUR : Modifie une entreprise existante
 */
export async function updateEntreprise(id, entrepriseUpdate) {
  // 1. Sauvegarde locale immédiate
  const localData = getLocalEntreprises();
  const updatedData = localData.map(e => e.id === id ? { ...e, ...entrepriseUpdate } : e);
  saveLocalEntreprises(updatedData);

  // 2. Tentative d'envoi au NAS
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/entreprises/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entrepriseUpdate),
    }, 2500);
    
    if (!response.ok) throw new Error("Erreur NAS modification");
    return await response.json();
  } catch (error) {
    console.warn("Modification NAS impossible, entreprise mise à jour localement.", error);
    return { id, ...entrepriseUpdate };
  }
}

/**
 * SUPPRIMER : Efface une entreprise
 */
export async function deleteEntreprise(id) {
  // 1. Sauvegarde locale immédiate
  const localData = getLocalEntreprises();
  const filteredData = localData.filter(e => e.id.toString() !== id.toString());
  saveLocalEntreprises(filteredData);

  // 2. Tentative d'envoi au NAS
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/entreprises/${id}`, {
      method: 'DELETE',
    }, 2500);
    
    if (!response.ok) throw new Error("Erreur NAS suppression");
    return await response.json();
  } catch (error) {
    console.warn("Suppression NAS impossible, entreprise effacée localement.", error);
    return { id };
  }
}
