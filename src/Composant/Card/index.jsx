import React from "react";
import { Link } from "react-router-dom";
import {
  iconeParSecteur,
  STATUTS_PROSPECTION,
  STATUTS_SITE,
  indexStatutProspection,
  indexStatutSite,
  statutRelance,
  estOuvert,
} from "../../Utils/hooks/helpers";
import "./card.scss";

export default function Card({ entreprise }) {
  const {
    id, nom, secteur, adresse,
    statut_prospection, statut_site,
    contact_nom, contrat_type, date_contact, date_relance, note, horaires
  } = entreprise;

  const icone = iconeParSecteur(secteur);
  const isOpen = estOuvert(horaires);
  let statusClass = "";
  if (isOpen === true) statusClass = " status-ouvert";
  else if (isOpen === false) statusClass = " status-ferme";
  const idxProsp = indexStatutProspection(statut_prospection || 'prospect');
  const idxSite  = indexStatutSite(statut_site);
  const relance  = statutRelance(date_relance);
  const estSigne = statut_prospection === 'signe';

  return (
    <Link to={`/entreprise/${id}`} className={`card${statusClass}`}>

      {/* En-tête */}
      <div className="cardTop">
        <div className="cardIcone">{icone}</div>
        <div className="cardTitreBloc">
          <h3 className="cardNom">{nom}</h3>
          <span className="cardSecteur">{secteur}</span>
        </div>
      </div>

      {/* Barre prospection */}
      <div className="progBloc">
        <span className="progTitre">Prospection</span>
        <div className="progSteps">
          {STATUTS_PROSPECTION.map((s, i) => (
            <div
              key={s.value}
              className={`progStep ${i <= idxProsp ? s.value : 'inactif'}`}
            />
          ))}
        </div>
        <div className="progLabels">
          {STATUTS_PROSPECTION.map((s, i) => (
            <span key={s.value} className={`progLabel${i === idxProsp ? ' actif' : ''}`}>
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Barre site — uniquement si signé */}
      {estSigne && (
        <div className="progBloc">
          <span className="progTitre">Avancement site</span>
          <div className="progSteps">
            {STATUTS_SITE.map((s, i) => (
              <div
                key={s.value}
                className={`progStep ${idxSite >= 0 && i <= idxSite ? s.value : 'inactif'}`}
              />
            ))}
          </div>
          <div className="progLabels">
            {STATUTS_SITE.map((s, i) => (
              <span key={s.value} className={`progLabel${i === idxSite ? ' actif' : ''}`}>
                {s.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Infos */}
      <div className="cardInfos">
        {contact_nom   && <div className="infoRow"><span className="infoLabel">Contact</span><span className="infoVal">{contact_nom}</span></div>}
        {contrat_type  && <div className="infoRow"><span className="infoLabel">Contrat</span><span className="infoVal">{contrat_type}</span></div>}
        {date_contact  && <div className="infoRow"><span className="infoLabel">Dernier contact</span><span className="infoVal">{new Date(date_contact).toLocaleDateString('fr-FR')}</span></div>}
        {!contact_nom && !contrat_type && <div className="infoRow"><span className="infoLabel">Adresse</span><span className="infoVal">{adresse}</span></div>}
      </div>

      {/* Relance */}
      {relance && (
        <div className={`relance ${relance.type}`}>
          <span className="relanceDot" />
          {relance.label}
        </div>
      )}

      {/* Note */}
      {note && <p className="cardNote">"{note}"</p>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="voirPlus">Voir la fiche →</span>
        <button 
          onClick={(e) => {
            e.preventDefault(); // Empêche de cliquer sur la Link de la carte
            window.open(`#/vitrine?id=${id}`, '_blank'); // Ouvre la vitrine dans un nouvel onglet
          }}
          style={{
            background: 'var(--primary-color, #4A90E2)',
            color: 'white',
            border: 'none',
            padding: '4px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          Voir sa vitrine 🎨
        </button>
      </div>
    </Link>
  );
}
