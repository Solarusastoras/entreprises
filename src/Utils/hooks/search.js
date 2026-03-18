import { useState, useMemo } from 'react';

export const extraireVille = (adresse) => {
  if (!adresse) return '';
  const match = adresse.match(/\d{5}\s+(.+)$/);
  if (match) return match[1].trim();
  const parts = adresse.split(',');
  return parts[parts.length - 1].trim();
};

export function useSearch(entreprises) {
  const [query, setQuery] = useState('');
  const [secteurActif, setSecteurActif] = useState('');
  const [villeActif, setVilleActif] = useState('');

  const secteurs = useMemo(() => {
    const set = new Set(entreprises.map((e) => e.secteur).filter(Boolean));
    return ['', ...Array.from(set).sort()];
  }, [entreprises]);

  const villes = useMemo(() => {
    const set = new Set(entreprises.map((e) => extraireVille(e.adresse)).filter(Boolean));
    return ['', ...Array.from(set).sort()];
  }, [entreprises]);

  const resultats = useMemo(() => {
    const q = query.toLowerCase().trim();
    return entreprises.filter((e) => {
      const matchQuery =
        !q ||
        (e.nom && e.nom.toLowerCase().includes(q)) ||
        (e.secteur && e.secteur.toLowerCase().includes(q)) ||
        (e.adresse && e.adresse.toLowerCase().includes(q)) ||
        (e.description && e.description.toLowerCase().includes(q));
      
      const matchSecteur = !secteurActif || e.secteur === secteurActif;
      
      const v = extraireVille(e.adresse);
      const matchVille = !villeActif || v === villeActif;

      return matchQuery && matchSecteur && matchVille;
    });
  }, [entreprises, query, secteurActif, villeActif]);

  const reinitFiltres = () => {
    setQuery('');
    setSecteurActif('');
    setVilleActif('');
  };

  return {
    query,
    setQuery,
    secteurActif,
    setSecteurActif,
    villeActif,
    setVilleActif,
    secteurs,
    villes,
    resultats,
    reinitFiltres,
  };
}
