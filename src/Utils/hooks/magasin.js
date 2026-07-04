import { useState, useEffect, useCallback } from 'react';
import { 
  getEntreprises as fetchNasEntreprises, 
  createEntreprise, 
  updateEntreprise as updateNasEntreprise, 
  deleteEntreprise as deleteNasEntreprise 
} from '../nasApi';

export function useEntreprises() {
  const [entreprises, setEntreprises] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  // Charger toutes les entreprises
  useEffect(() => {
    async function charger() {
      setChargement(true);
      try {
        const data = await fetchNasEntreprises();
        // On trie du plus récent au plus ancien, en s'assurant qu'ils ont une date de création
        const sortedData = (data || []).sort((a, b) => {
          return new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now());
        });
        setEntreprises(sortedData);
      } catch (error) {
        setErreur(error.message);
      }
      setChargement(false);
    }
    charger();
  }, []);

  // Récupérer une entreprise par id
  const getEntreprise = useCallback(
    (id) => entreprises.find((e) => e.id.toString() === id.toString()),
    [entreprises]
  );

  // Ajouter
  const ajouterEntreprise = useCallback(async (data) => {
    try {
      const dataWithTimestamp = { ...data, created_at: new Date().toISOString() };
      const nouvelle = await createEntreprise(dataWithTimestamp);
      if (!nouvelle) throw new Error("Erreur lors de la création.");
      
      setEntreprises((prev) => [nouvelle, ...prev]);
      return nouvelle.id;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  // Modifier
  const modifierEntreprise = useCallback(async (id, data) => {
    try {
      await updateNasEntreprise(id.toString(), data);
      setEntreprises((prev) =>
        prev.map((e) => (e.id.toString() === id.toString() ? { ...e, ...data } : e))
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Supprimer
  const supprimerEntreprise = useCallback(async (id) => {
    try {
      await deleteNasEntreprise(id.toString());
      setEntreprises((prev) => prev.filter((e) => e.id.toString() !== id.toString()));
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    entreprises,
    chargement,
    erreur,
    getEntreprise,
    ajouterEntreprise,
    modifierEntreprise,
    supprimerEntreprise,
  };
}
