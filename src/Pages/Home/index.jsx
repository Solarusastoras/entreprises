import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { useEntreprises } from "../../Utils/hooks/magasin";
import { useSearch } from "../../Utils/hooks/search";
import EntrepriseCard from "../../Composant/Card/index.jsx";
import "./home.scss";

const MapView = lazy(() => import("../../Composant/MapView/index.jsx"));

export default function Home() {
  const { entreprises } = useEntreprises();
  const { resultats } = useSearch(entreprises);
  const recents = resultats.slice(0, 6);

  const secteurs = [...new Set(entreprises.map((e) => e.secteur))].slice(0, 8);

  return (
    <>
      <main className="main">
        {/* Hero */}
        <section className="hero">
          <div className="heroContent">
            <p className="heroSurtitle">Annuaire local</p>
            <h1 className="heroTitre">
              Les commerces de
              <br />
              <em>votre quartier</em>
            </h1>
            <p className="heroDesc">
              Retrouvez tous les commerces locaux sans site web — boulangeries,
              artisans, services de proximité — réunis en un seul endroit.
            </p>
            <div className="heroCta">
              <Link to="/liste" className="btnPrimaire">
                Parcourir l'annuaire
              </Link>
              <Link to="/ajouter" className="btnSecondaire">
                + Référencer un commerce
              </Link>
            </div>
            <p className="heroStats">
              <strong>{entreprises.length}</strong> commerces référencés
            </p>
          </div>
          <div className="heroDecor">
            <span>🥖</span>
            <span>✂️</span>
            <span>🌸</span>
            <span>🔧</span>
            <span>📚</span>
            <span>🍽️</span>
          </div>
        </section>

        {/* Secteurs rapides */}
        <section className="section">
          <h2 className="sectionTitre">Parcourir par secteur</h2>
          <div className="secteurGrid">
            {secteurs.map((s) => (
              <Link
                key={s}
                to={`/liste?secteur=${encodeURIComponent(s)}`}
                className="secteurCard"
              >
                <span className="secteurIcone">
                  {s === "Boulangerie"
                    ? "🥖"
                    : s === "Coiffure"
                      ? "✂️"
                      : s === "Restaurant"
                        ? "🍴"
                        : s === "Pharmacie"
                          ? "💊"
                          : s === "Garage automobile"
                            ? "🔧"
                            : s === "Librairie"
                              ? "📚"
                              : s === "Fleuriste"
                                ? "🌸"
                                : "🏪"}
                </span>
                <span>{s}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Derniers ajouts */}
        <section className="section">
          <div className="sectionHeader">
            <h2 className="sectionTitre">Commerces référencés</h2>
            <Link to="/liste" className="voirTout">
              Voir tout →
            </Link>
          </div>
          <div className="cardsGrid">
            {recents.map((e) => (
              <EntrepriseCard key={e.id} entreprise={e} />
            ))}
          </div>
        </section>

        {/* Carte */}
        <section className="section">
          <h2 className="sectionTitre">Carte des commerces</h2>
          <Suspense
            fallback={<div className="mapLoader">Chargement de la carte…</div>}
          >
            <MapView entreprises={entreprises} hauteur="400px" />
          </Suspense>
        </section>

        {/* CTA Ajout */}
        <section className="ctaBanner">
          <div>
            <h2>Un commerce sans site web ?</h2>
            <p>Aidez-le à être visible en le référençant gratuitement.</p>
          </div>
          <Link to="/ajouter" className="btnPrimaire">
            Référencer maintenant
          </Link>
        </section>
      </main>
    </>
  );
}
