import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js';
import { useEntreprises } from '../../Utils/hooks/magasin.js';
import {
  iconeParSecteur, estOuvert, JOURS_SEMAINE, jourActuel,
  STATUTS_PROSPECTION, STATUTS_SITE, indexStatutProspection, indexStatutSite, statutRelance,
} from '../../Utils/hooks/helpers.js';
import Transports from '../../Composant/Transports/index.jsx';
import './entreprise.scss';

const MapView = lazy(() => import('../../Composant/MapView/index.jsx'));

export default function Entreprise() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { supprimerEntreprise } = useEntreprises();

  const [e, setE] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    async function charger() {
      setChargement(true);
      const { data, error } = await supabase
        .from('entreprises')
        .select('*')
        .eq('id', Number(id))
        .single();
      if (!error) setE(data);
      setChargement(false);
    }
    charger();
  }, [id]);

  if (chargement) return (
    <div style={{padding:'3rem',textAlign:'center',color:'var(--c-ink3)'}}>Chargement…</div>
  );

  if (!e) return (
    <div className="notFound">
      <span>🏪</span>
      <h2>Commerce introuvable</h2>
      <Link to="/liste">← Retour à l'annuaire</Link>
    </div>
  );

  const ouvert = estOuvert(e.horaires);
  const jourAuj = jourActuel();
  const icone = iconeParSecteur(e.secteur);
  const idxProsp = indexStatutProspection(e.statut_prospection || 'prospect');
  const idxSite = indexStatutSite(e.statut_site);
  const relance = statutRelance(e.date_relance);
  const estSigne = e.statut_prospection === 'signe';

  async function handleSupprimer() {
    if (window.confirm(`Supprimer "${e.nom}" de l'annuaire ?`)) {
      await supprimerEntreprise(e.id);
      navigate('/liste');
    }
  }

  return (
    <main className="main">
      <nav className="breadcrumb">
        <Link to="/">Accueil</Link><span>/</span>
        <Link to="/liste">Annuaire</Link><span>/</span>
        <span>{e.nom}</span>
      </nav>

      <div className="layout">
        <div className="col">

          {/* En-tête */}
          <div className="entete">
            <span className="icone">{icone}</span>
            <div>
              <p className="secteur">{e.secteur}</p>
              <h1 className="nom">{e.nom}</h1>
              {ouvert !== null && (
                <span className={ouvert ? 'ouvert' : 'ferme'}>
                  {ouvert ? '● Ouvert maintenant' : '● Fermé maintenant'}
                </span>
              )}
            </div>
          </div>

          {/* Suivi prospection */}
          <div className="bloc">
            <h2 className="blocTitre">Suivi prospection</h2>
            <div className="progBloc">
              <div className="progSteps">
                {STATUTS_PROSPECTION.map((s, i) => (
                  <div key={s.value} className={`progStep ${i <= idxProsp ? s.value : 'inactif'}`}/>
                ))}
              </div>
              <div className="progLabels">
                {STATUTS_PROSPECTION.map((s, i) => (
                  <span key={s.value} className={`progLabel${i === idxProsp ? ' actif' : ''}`}>{s.label}</span>
                ))}
              </div>
            </div>
            {relance && (
              <div className={`relance ${relance.type}`}>
                <span className="relanceDot"/>{relance.label}
              </div>
            )}
          </div>

          {/* Avancement site */}
          {estSigne && (
            <div className="bloc">
              <h2 className="blocTitre">Avancement du site</h2>
              <div className="progBloc">
                <div className="progSteps">
                  {STATUTS_SITE.map((s, i) => (
                    <div key={s.value} className={`progStep ${idxSite >= 0 && i <= idxSite ? s.value : 'inactif'}`}/>
                  ))}
                </div>
                <div className="progLabels">
                  {STATUTS_SITE.map((s, i) => (
                    <span key={s.value} className={`progLabel${i === idxSite ? ' actif' : ''}`}>{s.label}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {e.description && (
            <div className="bloc">
              <h2 className="blocTitre">À propos</h2>
              <p className="description">{e.description}</p>
            </div>
          )}

          {/* Note */}
          {e.note && (
            <div className="bloc">
              <h2 className="blocTitre">Note</h2>
              <p className="description" style={{fontStyle:'italic'}}>"{e.note}"</p>
            </div>
          )}

          {/* Horaires */}
          {e.horaires && Object.keys(e.horaires).length > 0 && (
            <div className="bloc">
              <h2 className="blocTitre">Horaires</h2>
              <div className="horairesGrid">
                {JOURS_SEMAINE.map((jour) => (
                  <div key={jour} className={`horairesRow${jour === jourAuj ? ' horaireAujourd' : ''}`}>
                    <span className="jourLabel">{jour.charAt(0).toUpperCase()+jour.slice(1)}</span>
                    <span className={e.horaires[jour]?.toLowerCase()==='fermé' ? 'hFerme' : 'hOuvert'}>
                      {e.horaires[jour] || '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Carte */}
          {e.coordonnees?.lat && (
            <div className="bloc">
              <h2 className="blocTitre">Localisation</h2>
              <Suspense fallback={<div className="mapLoader">Chargement…</div>}>
                <MapView entreprises={[e]} hauteur="260px" />
              </Suspense>
            </div>
          )}

          {/* Transports en commun IDELIS */}
          {e.coordonnees?.lat && e.coordonnees?.lng && <Transports coordonnees={e.coordonnees} />}
        </div>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sideCard">
            <h3 className="sideCardTitre">Coordonnées</h3>
            {e.adresse && (
              <div className="coordItem">
                <span className="coordIcone">📍</span>
                <div><p className="coordLabel">Adresse</p><p>{e.adresse}</p></div>
              </div>
            )}
            {e.telephone && (
              <div className="coordItem">
                <span className="coordIcone">📞</span>
                <div><p className="coordLabel">Téléphone</p>
                <a href={`tel:${e.telephone}`} className="lienContact">{e.telephone}</a></div>
              </div>
            )}
            {e.email && (
              <div className="coordItem">
                <span className="coordIcone">✉️</span>
                <div><p className="coordLabel">Email</p>
                <a href={`mailto:${e.email}`} className="lienContact">{e.email}</a></div>
              </div>
            )}
            {e.contact_nom && (
              <div className="coordItem">
                <span className="coordIcone">👤</span>
                <div><p className="coordLabel">Contact</p><p>{e.contact_nom}</p></div>
              </div>
            )}
            {e.contrat_type && (
              <div className="coordItem">
                <span className="coordIcone">📄</span>
                <div><p className="coordLabel">Contrat visé</p><p>{e.contrat_type}</p></div>
              </div>
            )}
            {e.date_contact && (
              <div className="coordItem">
                <span className="coordIcone">📅</span>
                <div><p className="coordLabel">Dernier contact</p>
                <p>{new Date(e.date_contact).toLocaleDateString('fr-FR')}</p></div>
              </div>
            )}
          </div>

          <div className="sideActions">
            <Link to={`/ajouter?modifier=${e.id}`} className="btnModifier">✏️ Modifier la fiche</Link>
            <button className="btnSupprimer" onClick={handleSupprimer}>🗑 Supprimer</button>
          </div>
        </aside>
      </div>
    </main>
  );
}
