import React from "react";
import "./searchbar.scss";

export default function SearchBar({
  query,
  setQuery,
  secteurs,
  secteurActif,
  setSecteurActif,
  total,
}) {
  return (
    <div className="searchWrapper">

      {/* Champ texte */}
      <div className="inputWrapper">
        <span className="searchIcon">🔍</span>
        <input
          type="text"
          className="input"
          placeholder="Rechercher un commerce, un secteur, une ville…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="clearBtn" onClick={() => setQuery("")}>
            ✕
          </button>
        )}
      </div>

      {/* Filtres secteur */}
      <div className="filtres">
        <span className="filtresLabel">Secteur :</span>
        <div className="tags">
          {secteurs.map((s) => (
            <button
              key={s || "tous"}
              className={`tag${secteurActif === s ? " tagActif" : ""}`}
              onClick={() => setSecteurActif(s)}
            >
              {s || "Tous"}
            </button>
          ))}
        </div>
      </div>

      {/* Compteur */}
      <p className="compte">
        <strong>{total}</strong> commerce{total > 1 ? "s" : ""} trouvé
        {total > 1 ? "s" : ""}
      </p>

    </div>
  );
}
