import React, { Suspense, lazy, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../../Composant/SearchBar";
import EntrepriseCard from "../../Composant/Card/index.jsx";
import { useEntreprises } from "../../Utils/hooks/magasin";
import { useSearch } from "../../Utils/hooks/search";
import "./liste.scss";

const MapView = lazy(() => import("../../Composant/MapView/index.jsx"));

export default function Liste() {
  const { entreprises } = useEntreprises();
  const {
    query,
    setQuery,
    secteurActif,
    setSecteurActif,
    villeActif,
    setVilleActif,
    secteurs,
    villes,
    resultats,
  } = useSearch(entreprises);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const s = searchParams.get("secteur");
    if (s) setSecteurActif(decodeURIComponent(s));
    
    const v = searchParams.get("ville");
    if (v) setVilleActif(decodeURIComponent(v));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // on veut volontairement ne déclencher qu'au montage

  const [vue, setVue] = React.useState("grille");

  return (
    <>
      <main className="list_main">
        <div className="listheader">
          <h1 className="list_titre">Annuaire des commerces</h1>
          <p className="list_sous">
            Découvrez les commerces locaux sans site web de votre région.
          </p>
        </div>

        <SearchBar
          query={query}
          setQuery={setQuery}
          secteurs={secteurs}
          secteurActif={secteurActif}
          setSecteurActif={setSecteurActif}
          villes={villes}
          villeActif={villeActif}
          setVilleActif={setVilleActif}
          total={resultats.length}
        />

        <div className="vueToggle">
          <button
            className={`vueBtn${vue === "grille" ? " vueBtnActif" : ""}`}
            onClick={() => setVue("grille")}
          >
            🗂 Grille
          </button>
          <button
            className={`vueBtn${vue === "carte" ? " vueBtnActif" : ""}`}
            onClick={() => setVue("carte")}
          >
            🗺 Carte
          </button>
        </div>

        {vue === "grille" ? (
          resultats.length === 0 ? (
            <div className="vide">
              <span>🔍</span>
              <p>Aucun commerce trouvé pour cette recherche.</p>
            </div>
          ) : (
            <div className="grille">
              {resultats.map((e) => (
                <EntrepriseCard key={e.id} entreprise={e} />
              ))}
            </div>
          )
        ) : (
          <Suspense fallback={<div className="mapLoader">Chargement…</div>}>
            <MapView entreprises={resultats} hauteur="560px" />
          </Suspense>
        )}
      </main>
    </>
  );
}
