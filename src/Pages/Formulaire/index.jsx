import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useEntreprises } from "../../Utils/hooks/magasin.js";
import {
  validerEmail,
  validerTelephone,
  JOURS_SEMAINE,
} from "../../Utils/hooks/helpers.js";
import "./form.scss";

const SECTEURS = [
  "Boulangerie",
  "Pâtisserie",
  "Boucherie",
  "Épicerie",
  "Traiteur",
  "Restaurant",
  "Restaurant japonais",
  "Café / Bar",
  "Coiffure",
  "Pharmacie",
  "Optique",
  "Kinésithérapie",
  "Vétérinaire",
  "Garage automobile",
  "Plomberie",
  "Électricité",
  "Menuiserie",
  "Immobilier",
  "Auto-école",
  "Pressing",
  "Librairie",
  "Fleuriste",
  "Bijouterie",
  "Magasin de sport",
  "École de musique",
  "Autre",
];

const HORAIRE_VIDE = {
  lundi: "",
  mardi: "",
  mercredi: "",
  jeudi: "",
  vendredi: "",
  samedi: "",
  dimanche: "",
};

function champVide() {
  return {
    nom: "",
    secteur: "",
    description: "",
    adresse: "",
    telephone: "",
    email: "",
    horaires: { ...HORAIRE_VIDE },
    coordonnees: { lat: "", lng: "" },
  };
}

export default function Formulaire() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modifierId = searchParams.get("modifier");

  const { ajouterEntreprise, modifierEntreprise, getEntreprise } =
    useEntreprises();

  const [form, setForm] = useState(champVide());
  const [erreurs, setErreurs] = useState({});
  const [succes, setSucces] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (modifierId) {
      const e = getEntreprise(modifierId);
      if (e) {
        setForm({
          nom: e.nom || "",
          secteur: e.secteur || "",
          description: e.description || "",
          adresse: e.adresse || "",
          telephone: e.telephone || "",
          email: e.email || "",
          horaires: { ...HORAIRE_VIDE, ...e.horaires },
          coordonnees: {
            lat: e.coordonnees?.lat || "",
            lng: e.coordonnees?.lng || "",
          },
        });
      }
    }
  }, [modifierId]); // on veut volontairement ne déclencher qu'au montage

  function set(champ, valeur) {
    setForm((prev) => ({ ...prev, [champ]: valeur }));
    setErreurs((prev) => ({ ...prev, [champ]: "" }));
  }

  function setHoraire(jour, valeur) {
    setForm((prev) => ({
      ...prev,
      horaires: { ...prev.horaires, [jour]: valeur },
    }));
  }

  function setCoord(champ, valeur) {
    setForm((prev) => ({
      ...prev,
      coordonnees: { ...prev.coordonnees, [champ]: valeur },
    }));
  }

  function valider() {
    const e = {};
    if (!form.nom.trim()) e.nom = "Le nom est requis.";
    if (!form.secteur) e.secteur = "Choisissez un secteur.";
    if (!form.adresse.trim()) e.adresse = "L'adresse est requise.";
    if (form.telephone && !validerTelephone(form.telephone))
      e.telephone = "Numéro de téléphone invalide.";
    if (form.email && !validerEmail(form.email))
      e.email = "Adresse email invalide.";
    if (form.coordonnees.lat && isNaN(Number(form.coordonnees.lat)))
      e.lat = "Latitude invalide (ex: 44.8400).";
    if (form.coordonnees.lng && isNaN(Number(form.coordonnees.lng)))
      e.lng = "Longitude invalide (ex: -0.5700).";
    setErreurs(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!valider()) return;

    const data = {
      ...form,
      coordonnees: {
        lat: form.coordonnees.lat ? Number(form.coordonnees.lat) : null,
        lng: form.coordonnees.lng ? Number(form.coordonnees.lng) : null,
      },
    };

    if (modifierId) {
      modifierEntreprise(modifierId, data);
      setSucces(true);
      setTimeout(() => navigate(`/entreprise/${modifierId}`), 1200);
    } else {
      const newId = ajouterEntreprise(data);
      setSucces(true);
      setTimeout(() => navigate(`/entreprise/${newId}`), 1200);
    }
  }

  const estModif = Boolean(modifierId);

  return (
    <>
      <main className="main">
        <nav className="breadcrumb">
          <Link to="/">Accueil</Link>
          <span>/</span>
          <Link to="/liste">Annuaire</Link>
          <span>/</span>
          <span>{estModif ? "Modifier la fiche" : "Ajouter un commerce"}</span>
        </nav>

        <div className="header">
          <h1 className="titre">
            {estModif ? "✏️ Modifier la fiche" : "🏪 Référencer un commerce"}
          </h1>
          <p className="sous">
            {estModif
              ? "Mettez à jour les informations de ce commerce."
              : "Ajoutez un commerce local qui n'a pas encore de site web."}
          </p>
        </div>

        {succes && (
          <div className="succes">
            ✅{" "}
            {estModif ? "Fiche mise à jour !" : "Commerce ajouté avec succès !"}{" "}
            Redirection…
          </div>
        )}

        <form onSubmit={handleSubmit} className="form" noValidate>
          <fieldset className="fieldset">
            <legend className="legend">Informations principales</legend>
            <div className="row2">
              <div className="champ">
                <label className="label">
                  Nom du commerce <span className="requis">*</span>
                </label>
                <input
                  className={`input${erreurs.nom ? " inputErreur" : ""}`}
                  type="text"
                  placeholder="ex : Boulangerie du Marché"
                  value={form.nom}
                  onChange={(e) => set("nom", e.target.value)}
                />
                {erreurs.nom && <p className="erreur">{erreurs.nom}</p>}
              </div>
              <div className="champ">
                <label className="label">
                  Secteur d'activité <span className="requis">*</span>
                </label>
                <select
                  className={`input${erreurs.secteur ? " inputErreur" : ""}`}
                  value={form.secteur}
                  onChange={(e) => set("secteur", e.target.value)}
                >
                  <option value="">— Choisir un secteur —</option>
                  {SECTEURS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {erreurs.secteur && <p className="erreur">{erreurs.secteur}</p>}
              </div>
            </div>
            <div className="champ">
              <label className="label">Description courte</label>
              <textarea
                className="textarea"
                rows={3}
                placeholder="Décrivez le commerce en quelques mots…"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="legend">Coordonnées</legend>
            <div className="champ">
              <label className="label">
                Adresse <span className="requis">*</span>
              </label>
              <input
                className={`input${erreurs.adresse ? " inputErreur" : ""}`}
                type="text"
                placeholder="12 rue du Marché, 64000 Pau"
                value={form.adresse}
                onChange={(e) => set("adresse", e.target.value)}
              />
              {erreurs.adresse && <p className="erreur">{erreurs.adresse}</p>}
            </div>
            <div className="row2">
              <div className="champ">
                <label className="label">Téléphone</label>
                <input
                  className={`input${erreurs.telephone ? " inputErreur" : ""}`}
                  type="tel"
                  placeholder="05 59 12 34 56"
                  value={form.telephone}
                  onChange={(e) => set("telephone", e.target.value)}
                />
                {erreurs.telephone && (
                  <p className="erreur">{erreurs.telephone}</p>
                )}
              </div>
              <div className="champ">
                <label className="label">Email</label>
                <input
                  className={`input${erreurs.email ? " inputErreur" : ""}`}
                  type="email"
                  placeholder="contact@exemple.fr"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                {erreurs.email && <p className="erreur">{erreurs.email}</p>}
              </div>
            </div>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="legend">Horaires d'ouverture</legend>
            <p className="aide">
              Exemples : <code>07h00 - 19h30</code>,{" "}
              <code>08h00 - 12h00 / 14h00 - 18h00</code>, <code>Fermé</code>
            </p>
            <div className="horairesGrid">
              {JOURS_SEMAINE.map((jour) => (
                <div key={jour} className="horaireRow">
                  <label className="jourLabel">
                    {jour.charAt(0).toUpperCase() + jour.slice(1)}
                  </label>
                  <input
                    className="inputHoraire"
                    type="text"
                    placeholder="Fermé"
                    value={form.horaires[jour]}
                    onChange={(e) => setHoraire(jour, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="legend">
              Localisation GPS <span className="optionnel">(optionnel)</span>
            </legend>
            <p className="aide">
              Trouvez les coordonnées sur{" "}
              <a
                href="https://www.openstreetmap.org/"
                target="_blank"
                rel="noreferrer"
                className="lienAide"
              >
                OpenStreetMap
              </a>{" "}
              en faisant un clic droit sur la carte.
            </p>
            <div className="row2">
              <div className="champ">
                <label className="label">Latitude</label>
                <input
                  className={`input${erreurs.lat ? " inputErreur" : ""}`}
                  type="text"
                  placeholder="ex : 44.8400"
                  value={form.coordonnees.lat}
                  onChange={(e) => setCoord("lat", e.target.value)}
                />
                {erreurs.lat && <p className="erreur">{erreurs.lat}</p>}
              </div>
              <div className="champ">
                <label className="label">Longitude</label>
                <input
                  className={`input${erreurs.lng ? " inputErreur" : ""}`}
                  type="text"
                  placeholder="ex : -0.5700"
                  value={form.coordonnees.lng}
                  onChange={(e) => setCoord("lng", e.target.value)}
                />
                {erreurs.lng && <p className="erreur">{erreurs.lng}</p>}
              </div>
            </div>
          </fieldset>

          <div className="actions">
            <Link
              to={estModif ? `/entreprise/${modifierId}` : "/liste"}
              className="btnAnnuler"
            >
              Annuler
            </Link>
            <button type="submit" className="btnSubmit">
              {estModif
                ? "💾 Enregistrer les modifications"
                : "✅ Ajouter le commerce"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
