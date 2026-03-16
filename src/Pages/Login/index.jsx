import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Utils/hooks/useAuth';
import './login.scss';

export default function Login() {
  const { connexion } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(ev) {
    ev.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      await connexion(email, motDePasse);
      navigate('/');
    } catch (e) {
      setErreur('Email ou mot de passe incorrect.');
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="loginPage">
      <div className="loginCard">

        <div className="loginLogo">
          <span>🏪</span>
          <h1>CommercesLocaux</h1>
        </div>

        <p className="loginSous">Connectez-vous pour gérer l'annuaire</p>

        {erreur && <div className="loginErreur">{erreur}</div>}

        <form onSubmit={handleSubmit} className="loginForm" noValidate>
          <div className="loginChamp">
            <label className="loginLabel">Email</label>
            <input
              className="loginInput"
              type="email"
              placeholder="votre@email.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="loginChamp">
            <label className="loginLabel">Mot de passe</label>
            <input
              className="loginInput"
              type="password"
              placeholder="••••••••"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="loginBtn" disabled={chargement}>
            {chargement ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

      </div>
    </div>
  );
}
