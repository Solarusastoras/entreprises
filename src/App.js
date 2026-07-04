import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './Vitrine/context/AppContext';
import ThemeRenderer from './Vitrine/components/themes/ThemeRenderer';
import Configurator from './Vitrine/components/layout/Configurator';
import FavoritesModal from './Vitrine/components/modals/FavoritesModal';
import Header from './Composant/Header';
import ProtectedRoute from './Composant/ProtectedRoute';
import Home from './Pages/Home/index.jsx';
import Liste from './Pages/Liste/index.jsx';
import Entreprise from './Pages/Entreprise/index.jsx';
import Formulaire from './Pages/Formulaire/index.jsx';
import Login from './Pages/Login/index.jsx';
import './App.css';
import './Vitrine/styles/main.scss';

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <FavoritesModal />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Route pour le générateur de site vitrine */}
          <Route path="/vitrine" element={
            <div className="app-container">
              <Configurator />
              <main className="main-content">
                <ThemeRenderer />
              </main>
            </div>
          } />

          {/* Routes de l'annuaire CRM (existantes) */}
          <Route path="/*" element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/liste" element={<Liste />} />
                <Route path="/entreprise/:id" element={<Entreprise />} />
                <Route path="/ajouter" element={
                  <ProtectedRoute><Formulaire /></ProtectedRoute>
                } />
              </Routes>
            </>
          } />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
