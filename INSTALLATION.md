# 🚀 Guide d'installation — Commerces Locaux

## 1. Installer les dépendances

Dans le terminal VS Code (Ctrl+ù), à la racine du projet `entreprises/` :

```bash
npm install react-router-dom react-leaflet leaflet
```

---

## 2. Structure des fichiers à créer/remplacer

Voici TOUS les fichiers générés et où les placer :

```
src/
├── App.js                          ← Remplacer
├── App.css                         ← Remplacer
│
├── data/
│   └── entreprises.json            ← Coller le JSON fourni
│
├── Utils/
│   ├── helpers.js                  ← Nouveau
│   └── hooks/
│       ├── magasin.js              ← Remplace useEntreprises
│       ├── search.js               ← Remplace useSearch
│       └── useGeolocation.js       ← Déjà existant, remplacer
│
├── Composant/
│   ├── Navbar/
│   │   ├── index.jsx               ← Nouveau
│   │   └── Navbar.module.css       ← Nouveau
│   ├── EntrepriseCard/
│   │   ├── index.jsx               ← Nouveau
│   │   └── EntrepriseCard.module.css
│   ├── SearchBar/
│   │   ├── index.jsx               ← Nouveau (remplace l'existant)
│   │   └── SearchBar.module.css
│   └── MapView/
│       ├── index.jsx               ← Nouveau (remplace l'existant)
│       └── MapView.module.css
│
└── Pages/
    ├── Home/
    │   ├── index.jsx               ← Remplacer
    │   └── home.module.css         ← Remplacer
    ├── Liste/
    │   ├── index.jsx               ← Remplacer
    │   └── liste.module.css        ← Remplacer
    ├── Entreprise/
    │   ├── index.jsx               ← Remplacer
    │   └── entrepris.module.css    ← Nouveau
    └── Formulaire/
        ├── index.jsx               ← Nouveau
        └── Formulaire.module.css   ← Nouveau
```

---

## 3. Supprimer les anciens fichiers inutiles

Si tu as des fichiers `.scss` dans `Pages/Home/` ou `Pages/Liste/`,
tu peux les supprimer — tout est maintenant en CSS Modules (`.module.css`).

---

## 4. Lancer le projet

```bash
npm start
```

---

## 5. Pages disponibles

| URL                     | Description              |
|-------------------------|--------------------------|
| `/`                     | Page d'accueil           |
| `/liste`                | Annuaire + recherche     |
| `/liste?secteur=Coiffure` | Filtré par secteur     |
| `/entreprise/1`         | Fiche détail             |
| `/ajouter`              | Ajouter un commerce      |
| `/ajouter?modifier=1`   | Modifier la fiche n°1    |

---

## 6. Fonctionnalités incluses

- ✅ Recherche textuelle (nom, secteur, ville, description)
- ✅ Filtre par secteur (tags cliquables)
- ✅ Vue grille + vue carte (Leaflet / OpenStreetMap)
- ✅ Fiche détail avec horaires, coordonnées, carte mini
- ✅ Formulaire ajout + modification avec validation
- ✅ Suppression avec confirmation
- ✅ Indicateur ouvert/fermé (basé sur le jour actuel)
- ✅ Persistance localStorage (les ajouts survivent au rechargement)
- ✅ Design responsive mobile

---

## 7. En cas de problème avec Leaflet

Si la carte affiche une erreur d'icônes, c'est normal avec CRA.
Le fix est déjà inclus dans `MapView/index.jsx` (lignes `delete L.Icon...`).

Si la carte ne s'affiche pas du tout, vérifier que leaflet est bien installé :

```bash
npm list leaflet react-leaflet
```
