import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./header.scss";

export default function Header() {
  const { pathname } = useLocation();
  const [menuOuvert, setMenuOuvert] = useState(false);

  return (
    <header className="header">
      <div className="headerInner">

        <Link to="/" className="logo">
          <span className="logoIcone">🏪</span>
          <span className="logoTexte">
            Commerces<em>Locaux</em>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="nav">
          <Link
            to="/"
            className={`navLink${pathname === "/" ? " actif" : ""}`}
          >
            Accueil
          </Link>
          <Link
            to="/liste"
            className={`navLink${pathname === "/liste" ? " actif" : ""}`}
          >
            Annuaire
          </Link>
          <Link to="/ajouter" className="navBtnAjouter">
            + Ajouter
          </Link>
        </nav>

        {/* Burger mobile */}
        <button
          className={`burger${menuOuvert ? " burgerOuvert" : ""}`}
          onClick={() => setMenuOuvert((v) => !v)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Menu mobile */}
      {menuOuvert && (
        <nav className="navMobile" onClick={() => setMenuOuvert(false)}>
          <Link to="/" className={`navMobileLink${pathname === "/" ? " actif" : ""}`}>
            Accueil
          </Link>
          <Link to="/liste" className={`navMobileLink${pathname === "/liste" ? " actif" : ""}`}>
            Annuaire
          </Link>
          <Link to="/ajouter" className="navMobileBtnAjouter">
            + Ajouter un commerce
          </Link>
        </nav>
      )}
    </header>
  );
}
