import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';

export function useEntreprises() {
  const [entreprises, setEntreprises] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  // Charger toutes les entreprises
  useEffect(() => {
    async function charger() {
      setChargement(true);
      const { data, error } = await supabase
        .from('entreprises')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setErreur(error.message);
      } else {
        setEntreprises(data);
      }
      setChargement(false);
    }
    charger();
  }, []);

  // Récupérer une entreprise par id
  const getEntreprise = useCallback(
    (id) => entreprises.find((e) => e.id === Number(id)),
    [entreprises]
  );

  // Ajouter
  const ajouterEntreprise = useCallback(async (data) => {
    const { data: nouvelle, error } = await supabase
      .from('entreprises')
      .insert([data])
      .select()
      .single();

    if (error) { console.error(error); return null; }
    setEntreprises((prev) => [nouvelle, ...prev]);
    return nouvelle.id;
  }, []);

  // Modifier
  const modifierEntreprise = useCallback(async (id, data) => {
    const { error } = await supabase
      .from('entreprises')
      .update(data)
      .eq('id', Number(id));

    if (error) { console.error(error); return; }
    setEntreprises((prev) =>
      prev.map((e) => (e.id === Number(id) ? { ...e, ...data } : e))
    );
  }, []);

  // Supprimer
  const supprimerEntreprise = useCallback(async (id) => {
    const { error } = await supabase
      .from('entreprises')
      .delete()
      .eq('id', Number(id));

    if (error) { console.error(error); return; }
    setEntreprises((prev) => prev.filter((e) => e.id !== Number(id)));
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
