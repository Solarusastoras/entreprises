import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../Utils/hooks/useAuth";
import "./header.scss";

export default function Header() {
  const { pathname } = useLocation();
  const { estConnecte, deconnexion } = useAuth();
  const [menuOuvert, setMenuOuvert] = useState(false);

  return (
    <header className="header">
      <div className="headerInner">

        <Link to="/" className="logo">
          <img src="/entreprises.png" alt="Entreprise" className="logoImage" />
          <span className="logoTexte">Entreprises</span>
        </Link>

        <nav className="nav">
          <Link to="/" className={`navLink${pathname === "/" ? " actif" : ""}`}>Accueil</Link>
          <Link to="/liste" className={`navLink${pathname === "/liste" ? " actif" : ""}`}>Annuaire</Link>
          {estConnecte ? (
            <>
              <Link to="/ajouter" className="navBtnAjouter">+ Ajouter</Link>
              <button className="navBtnDeconnexion" onClick={deconnexion}>Déconnexion</button>
            </>
          ) : (
            <Link to="/login" className="navBtnAjouter">Connexion</Link>
          )}
        </nav>

        <button
          className={`burger${menuOuvert ? " burgerOuvert" : ""}`}
          onClick={() => setMenuOuvert((v) => !v)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {menuOuvert && (
        <nav className="navMobile" onClick={() => setMenuOuvert(false)}>
          <Link to="/" className={`navMobileLink${pathname === "/" ? " actif" : ""}`}>Accueil</Link>
          <Link to="/liste" className={`navMobileLink${pathname === "/liste" ? " actif" : ""}`}>Annuaire</Link>
          {estConnecte ? (
            <>
              <Link to="/ajouter" className="navMobileBtnAjouter">+ Ajouter un commerce</Link>
              <button className="navMobileBtnDeconnexion" onClick={deconnexion}>Déconnexion</button>
            </>
          ) : (
            <Link to="/login" className="navMobileBtnAjouter">Se connecter</Link>
          )}
        </nav>
      )}
    </header>
  );
}
