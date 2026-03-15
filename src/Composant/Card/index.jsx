import React from "react";
import { Link } from "react-router-dom";
import { iconeParSecteur, estOuvert } from "../../Utils/hooks/helpers";
import "./card.scss";

export default function Card({ entreprise }) {
  const { id, nom, secteur, description, adresse, telephone } = entreprise;
  const ouvert = estOuvert(entreprise.horaires);
  const icone = iconeParSecteur(secteur);

  return (
    <Link to={`/entreprise/${id}`} className="card">
      <div className="header">
        <span className="icone">{icone}</span>
        <div className="meta">
          <span className="secteur">{secteur}</span>
          {ouvert !== null && (
            <span className={ouvert ? "ouvert" : "ferme"}>
              {ouvert ? "Ouvert" : "Fermé"}
            </span>
          )}
        </div>
      </div>

      <h3 className="nom">{nom}</h3>

      {description && <p className="description">{description}</p>}

      <div className="footer">
        <span className="adresse">📍 {adresse}</span>
        {telephone && <span className="tel">📞 {telephone}</span>}
      </div>

      <span className="voirPlus">Voir la fiche →</span>
    </Link>
  );
}
