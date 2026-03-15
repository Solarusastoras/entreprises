import React, { Suspense, lazy } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEntreprises } from "../../Utils/hooks/magasin";
import {
  iconeParSecteur,
  estOuvert,
  JOURS_SEMAINE,
  jourActuel,
} from "../../Utils/hooks/helpers";
import "./entreprise.scss";

const MapView = lazy(() => import("../../Composant/MapView/index.jsx"));

export default function Entreprise() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEntreprise, supprimerEntreprise } = useEntreprises();
  const e = getEntreprise(id);

  if (!e) {
    return (
      <>
        <div className="notFound">
          <span>🏪</span>
          <h2>Commerce introuvable</h2>
          <Link to="/liste">← Retour à l'annuaire</Link>
        </div>
      </>
    );
  }

  const ouvert = estOuvert(e.horaires);
  const jourAuj = jourActuel();
  const icone = iconeParSecteur(e.secteur);

  function handleSupprimer() {
    if (window.confirm(`Supprimer "${e.nom}" de l'annuaire ?`)) {
      supprimerEntreprise(e.id);
      navigate("/liste");
    }
  }

  return (
    <>
      <main className="main">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Accueil</Link>
          <span>/</span>
          <Link to="/liste">Annuaire</Link>
          <span>/</span>
          <span>{e.nom}</span>
        </nav>

        <div className="layout">
          {/* Colonne principale */}
          <div className="col">
            {/* En-tête */}
            <div className="entete">
              <span className="icone">{icone}</span>
              <div>
                <p className="secteur">{e.secteur}</p>
                <h1 className="nom">{e.nom}</h1>
                {ouvert !== null && (
                  <span className={ouvert ? "ouvert" : "ferme"}>
                    {ouvert ? "● Ouvert maintenant" : "● Fermé maintenant"}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {e.description && (
              <div className="bloc">
                <h2 className="blocTitre">À propos</h2>
                <p className="description">{e.description}</p>
              </div>
            )}

            {/* Horaires */}
            {e.horaires && Object.keys(e.horaires).length > 0 && (
              <div className="bloc">
                <h2 className="blocTitre">Horaires</h2>
                <div className="horairesGrid">
                  {JOURS_SEMAINE.map((jour) => (
                    <div
                      key={jour}
                      className={`horairesRow} ${jour === jourAuj ? "horaireAujourd" : ""}`}
                    >
                      <span className="jourLabel">
                        {jour.charAt(0).toUpperCase() + jour.slice(1)}
                      </span>
                      <span
                        className={
                          e.horaires[jour]?.toLowerCase() === "fermé"
                            ? "hFerme"
                            : "hOuvert"
                        }
                      >
                        {e.horaires[jour] || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Carte mini */}
            {e.coordonnees?.lat && (
              <div className="bloc">
                <h2 className="blocTitre">Localisation</h2>
                <Suspense
                  fallback={<div className="mapLoader">Chargement…</div>}
                >
                  <MapView entreprises={[e]} hauteur="260px" />
                </Suspense>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sideCard">
              <h3 className="sideCardTitre">Coordonnées</h3>

              {e.adresse && (
                <div className="coordItem">
                  <span className="coordIcone">📍</span>
                  <div>
                    <p className="coordLabel">Adresse</p>
                    <p>{e.adresse}</p>
                  </div>
                </div>
              )}

              {e.telephone && (
                <div className="coordItem">
                  <span className="coordIcone">📞</span>
                  <div>
                    <p className="coordLabel">Téléphone</p>
                    <a href={`tel:${e.telephone}`} className="lienContact">
                      {e.telephone}
                    </a>
                  </div>
                </div>
              )}

              {e.email && (
                <div className="coordItem">
                  <span className="coordIcone">✉️</span>
                  <div>
                    <p className="coordLabel">Email</p>
                    <a href={`mailto:${e.email}`} className="lienContact">
                      {e.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="sideActions">
              <Link to={`/ajouter?modifier=${e.id}`} className="btnModifier">
                ✏️ Modifier la fiche
              </Link>
              <button className="btnSupprimer" onClick={handleSupprimer}>
                🗑 Supprimer
              </button>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
