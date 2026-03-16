import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useEntreprises } from "../../Utils/hooks/magasin.js";
import {
  validerEmail, validerTelephone, JOURS_SEMAINE,
  STATUTS_PROSPECTION, STATUTS_SITE,
} from "../../Utils/hooks/helpers.js";
import "./form.scss";

const SECTEURS = [
  "Boulangerie","Pâtisserie","Boucherie","Épicerie","Traiteur","Restaurant",
  "Restaurant japonais","Café / Bar","Coiffure","Pharmacie","Optique",
  "Kinésithérapie","Vétérinaire","Garage automobile","Plomberie","Électricité",
  "Menuiserie","Immobilier","Auto-école","Pressing","Librairie","Fleuriste",
  "Bijouterie","Magasin de sport","École de musique","Autre",
];

const HORAIRE_VIDE = { lundi:"",mardi:"",mercredi:"",jeudi:"",vendredi:"",samedi:"",dimanche:"" };

function champVide() {
  return {
    nom:"",secteur:"",description:"",adresse:"",telephone:"",email:"",
    horaires:{...HORAIRE_VIDE},coordonnees:{lat:"",lng:""},
    statut_prospection:"prospect",statut_site:"",
    contact_nom:"",contrat_type:"",date_contact:"",date_relance:"",note:"",
  };
}

export default function Formulaire() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modifierId = searchParams.get("modifier");
  const { ajouterEntreprise, modifierEntreprise, getEntreprise } = useEntreprises();
  const [form, setForm] = useState(champVide());
  const [erreurs, setErreurs] = useState({});
  const [succes, setSucces] = useState(false);

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    if (modifierId) {
      const e = getEntreprise(modifierId);
      if (e) setForm({
        nom:e.nom||"",secteur:e.secteur||"",description:e.description||"",
        adresse:e.adresse||"",telephone:e.telephone||"",email:e.email||"",
        horaires:{...HORAIRE_VIDE,...e.horaires},
        coordonnees:{lat:e.coordonnees?.lat||"",lng:e.coordonnees?.lng||""},
        statut_prospection:e.statut_prospection||"prospect",statut_site:e.statut_site||"",
        contact_nom:e.contact_nom||"",contrat_type:e.contrat_type||"",
        date_contact:e.date_contact||"",date_relance:e.date_relance||"",note:e.note||"",
      });
    }
  }, [modifierId]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (c,v) => { setForm(p=>({...p,[c]:v})); setErreurs(p=>({...p,[c]:""})); };
  const setHoraire = (j,v) => setForm(p=>({...p,horaires:{...p.horaires,[j]:v}}));
  const setCoord = (c,v) => setForm(p=>({...p,coordonnees:{...p.coordonnees,[c]:v}}));

  function valider() {
    const e = {};
    if (!form.nom.trim()) e.nom="Le nom est requis.";
    if (!form.secteur) e.secteur="Choisissez un secteur.";
    if (!form.adresse.trim()) e.adresse="L'adresse est requise.";
    if (form.telephone&&!validerTelephone(form.telephone)) e.telephone="Numéro invalide.";
    if (form.email&&!validerEmail(form.email)) e.email="Email invalide.";
    if (form.coordonnees.lat&&isNaN(Number(form.coordonnees.lat))) e.lat="Latitude invalide.";
    if (form.coordonnees.lng&&isNaN(Number(form.coordonnees.lng))) e.lng="Longitude invalide.";
    setErreurs(e);
    return Object.keys(e).length===0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!valider()) return;
    const data = {
      ...form,
      statut_site: form.statut_site||null,
      coordonnees: {
        lat: form.coordonnees.lat ? Number(form.coordonnees.lat) : null,
        lng: form.coordonnees.lng ? Number(form.coordonnees.lng) : null,
      },
    };
    if (modifierId) {
      await modifierEntreprise(modifierId, data);
      setSucces(true);
      setTimeout(()=>navigate(`/entreprise/${modifierId}`),1200);
    } else {
      const newId = await ajouterEntreprise(data);
      setSucces(true);
      setTimeout(()=>navigate(`/entreprise/${newId}`),1200);
    }
  }

  const estModif = Boolean(modifierId);
  const estSigne = form.statut_prospection === "signe";

  return (
    <main className="main">
      <nav className="breadcrumb">
        <Link to="/">Accueil</Link><span>/</span>
        <Link to="/liste">Annuaire</Link><span>/</span>
        <span>{estModif?"Modifier":"Ajouter un commerce"}</span>
      </nav>
      <div className="header">
        <h1 className="titre">{estModif?"✏️ Modifier la fiche":"🏪 Référencer un commerce"}</h1>
        <p className="sous">{estModif?"Mettez à jour les informations.":"Ajoutez un commerce sans site web."}</p>
      </div>
      {succes&&<div className="succes">✅ {estModif?"Fiche mise à jour !":"Commerce ajouté !"} Redirection…</div>}

      <form onSubmit={handleSubmit} className="form" noValidate>

        <fieldset className="fieldset">
          <legend className="legend">Informations principales</legend>
          <div className="row2">
            <div className="champ">
              <label className="label">Nom <span className="requis">*</span></label>
              <input className={`input${erreurs.nom?" inputErreur":""}`} type="text"
                placeholder="Boulangerie du Marché" value={form.nom}
                onChange={(e)=>set("nom",e.target.value)}/>
              {erreurs.nom&&<p className="erreur">{erreurs.nom}</p>}
            </div>
            <div className="champ">
              <label className="label">Secteur <span className="requis">*</span></label>
              <select className={`input${erreurs.secteur?" inputErreur":""}`}
                value={form.secteur} onChange={(e)=>set("secteur",e.target.value)}>
                <option value="">— Choisir —</option>
                {SECTEURS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              {erreurs.secteur&&<p className="erreur">{erreurs.secteur}</p>}
            </div>
          </div>
          <div className="champ">
            <label className="label">Description</label>
            <textarea className="textarea" rows={2} placeholder="Quelques mots…"
              value={form.description} onChange={(e)=>set("description",e.target.value)}/>
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="legend">Coordonnées</legend>
          <div className="champ">
            <label className="label">Adresse <span className="requis">*</span></label>
            <input className={`input${erreurs.adresse?" inputErreur":""}`} type="text"
              placeholder="12 rue du Marché, 64000 Pau" value={form.adresse}
              onChange={(e)=>set("adresse",e.target.value)}/>
            {erreurs.adresse&&<p className="erreur">{erreurs.adresse}</p>}
          </div>
          <div className="row2">
            <div className="champ">
              <label className="label">Téléphone</label>
              <input className={`input${erreurs.telephone?" inputErreur":""}`} type="tel"
                placeholder="05 59 12 34 56" value={form.telephone}
                onChange={(e)=>set("telephone",e.target.value)}/>
              {erreurs.telephone&&<p className="erreur">{erreurs.telephone}</p>}
            </div>
            <div className="champ">
              <label className="label">Email</label>
              <input className={`input${erreurs.email?" inputErreur":""}`} type="email"
                placeholder="contact@exemple.fr" value={form.email}
                onChange={(e)=>set("email",e.target.value)}/>
              {erreurs.email&&<p className="erreur">{erreurs.email}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="legend">Suivi commercial</legend>
          <div className="row2">
            <div className="champ">
              <label className="label">Statut prospection</label>
              <select className="input" value={form.statut_prospection}
                onChange={(e)=>set("statut_prospection",e.target.value)}>
                {STATUTS_PROSPECTION.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="champ">
              <label className="label">Contact chez l'entreprise</label>
              <input className="input" type="text" placeholder="Nom du gérant"
                value={form.contact_nom} onChange={(e)=>set("contact_nom",e.target.value)}/>
            </div>
          </div>
          <div className="row2">
            <div className="champ">
              <label className="label">Type de contrat visé</label>
              <input className="input" type="text" placeholder="Site vitrine, e-commerce…"
                value={form.contrat_type} onChange={(e)=>set("contrat_type",e.target.value)}/>
            </div>
            <div className="champ">
              <label className="label">Dernier contact</label>
              <input className="input" type="date" value={form.date_contact}
                onChange={(e)=>set("date_contact",e.target.value)}/>
            </div>
          </div>
          <div className="row2">
            <div className="champ">
              <label className="label">Date de relance</label>
              <input className="input" type="date" value={form.date_relance}
                onChange={(e)=>set("date_relance",e.target.value)}/>
            </div>
            <div className="champ">
              <label className="label">Note</label>
              <input className="input" type="text" placeholder="Suite à donner…"
                value={form.note} onChange={(e)=>set("note",e.target.value)}/>
            </div>
          </div>
        </fieldset>

        {estSigne&&(
          <fieldset className="fieldset">
            <legend className="legend">Avancement du site</legend>
            <div className="champ">
              <label className="label">Étape en cours</label>
              <select className="input" value={form.statut_site}
                onChange={(e)=>set("statut_site",e.target.value)}>
                <option value="">— Non démarré —</option>
                {STATUTS_SITE.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </fieldset>
        )}

        <fieldset className="fieldset">
          <legend className="legend">Horaires</legend>
          <p className="aide">Ex : <code>07h00 - 19h30</code> ou <code>Fermé</code></p>
          <div className="horairesGrid">
            {JOURS_SEMAINE.map(jour=>(
              <div key={jour} className="horaireRow">
                <label className="jourLabel">{jour.charAt(0).toUpperCase()+jour.slice(1)}</label>
                <input className="inputHoraire" type="text" placeholder="Fermé"
                  value={form.horaires[jour]} onChange={(e)=>setHoraire(jour,e.target.value)}/>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="legend">GPS <span className="optionnel">(optionnel)</span></legend>
          <div className="row2">
            <div className="champ">
              <label className="label">Latitude</label>
              <input className={`input${erreurs.lat?" inputErreur":""}`} type="text"
                placeholder="44.8400" value={form.coordonnees.lat}
                onChange={(e)=>setCoord("lat",e.target.value)}/>
              {erreurs.lat&&<p className="erreur">{erreurs.lat}</p>}
            </div>
            <div className="champ">
              <label className="label">Longitude</label>
              <input className={`input${erreurs.lng?" inputErreur":""}`} type="text"
                placeholder="-0.5700" value={form.coordonnees.lng}
                onChange={(e)=>setCoord("lng",e.target.value)}/>
              {erreurs.lng&&<p className="erreur">{erreurs.lng}</p>}
            </div>
          </div>
        </fieldset>

        <div className="actions">
          <Link to={estModif?`/entreprise/${modifierId}`:"/liste"} className="btnAnnuler">Annuler</Link>
          <button type="submit" className="btnSubmit">
            {estModif?"💾 Enregistrer":"✅ Ajouter le commerce"}
          </button>
        </div>
      </form>
    </main>
  );
}
