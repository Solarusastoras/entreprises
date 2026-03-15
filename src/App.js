import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Composant/Header';
import Home from './Pages/Home/index.jsx';
import Liste from './Pages/Liste/index.jsx';
import Entreprise from './Pages/Entreprise/index.jsx';
import Formulaire from './Pages/Formulaire/index.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/liste" element={<Liste />} />
        <Route path="/entreprise/:id" element={<Entreprise />} />
        <Route path="/ajouter" element={<Formulaire />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
