import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ThemeRenderer from './components/themes/ThemeRenderer';
import Configurator from './components/layout/Configurator';
import FavoritesModal from './components/modals/FavoritesModal';

function App() {
  return (
    <AppProvider>
      <div className="app-container">
        <Configurator />
        <FavoritesModal />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ThemeRenderer />} />
            {/* You can add more routes here, e.g., /admin, /about, etc. */}
          </Routes>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
