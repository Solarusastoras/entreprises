import { useState, useMemo } from 'react';

export function useSearch(entreprises) {
  const [query, setQuery] = useState('');
  const [secteurActif, setSecteurActif] = useState('');

  const secteurs = useMemo(() => {
    const set = new Set(entreprises.map((e) => e.secteur));
    return ['', ...Array.from(set).sort()];
  }, [entreprises]);

  const resultats = useMemo(() => {
    const q = query.toLowerCase().trim();
    return entreprises.filter((e) => {
      const matchQuery =
        !q ||
        e.nom.toLowerCase().includes(q) ||
        e.secteur.toLowerCase().includes(q) ||
        e.adresse.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q));
      const matchSecteur = !secteurActif || e.secteur === secteurActif;
      return matchQuery && matchSecteur;
    });
  }, [entreprises, query, secteurActif]);

  const reinitFiltres = () => {
    setQuery('');
    setSecteurActif('');
  };

  return {
    query,
    setQuery,
    secteurActif,
    setSecteurActif,
    secteurs,
    resultats,
    reinitFiltres,
  };
}
