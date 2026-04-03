import React, { useState, useEffect, useRef } from "react";
import "./transports.scss";

// Configuration de l'API IDELIS depuis les variables d'environnement
const API_URL = process.env.REACT_APP_IDELIS_URL;
const API_TOKEN = process.env.REACT_APP_IDELIS_TOKEN;

// Permet de mettre en cache les résultats et gérer le throttle de 10s
const cacheArrets = new Map();
const cachePassages = new Map();

export default function Transports({ coordonnees }) {
  const [arrets, setArrets] = useState([]);
  const [passages, setPassages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);

  // Garder la trace du dernier appel pour respecter la limite des 10 secondes
  const dernierAppelRef = useRef(0);

  useEffect(() => {
    if (!coordonnees?.lat || !coordonnees?.lng) return;

    async function chargerDonnees() {
      // 1. On empêche de requêter si pas de token ou URL
      if (!API_URL || !API_TOKEN) {
        setErreur("Configuration IDELIS manquante (.env)");
        return;
      }

      setLoading(true);
      try {
        // --- ETAPE 1 : AroundMe ---
        const cacheKeyArrets = `${coordonnees.lat},${coordonnees.lng}`;
        let arretProche = cacheArrets.get(cacheKeyArrets);

        if (!arretProche) {
          // On tente un GET, en passant les paramètres directement dans l'URL (car un GET avec Body est bloqué)
          const params = new URLSearchParams({
             latitude: coordonnees.lat,
             longitude: coordonnees.lng
          });
          const resAround = await fetch(`${API_URL}/AroundMe?${params.toString()}`, {
            method: "GET",
            headers: {
              "X-AUTH-TOKEN": API_TOKEN,
            }
          });
          
          if (!resAround.ok) throw new Error("Erreur de l'API AroundMe");
          const dataAround = await resAround.json();
          
          if (dataAround && dataAround.length > 0) {
            // On prend l'arrêt le plus proche (le premier ou on trie par distance)
            const trie = dataAround.sort((a,b) => parseFloat(a.distance) - parseFloat(b.distance));
            arretProche = trie[0];
            cacheArrets.set(cacheKeyArrets, arretProche);
            setArrets([arretProche]);
          } else {
            setErreur("Aucun arrêt à proximité.");
            setLoading(false);
            return;
          }
        } else {
          setArrets([arretProche]);
        }

        // --- ETAPE 2 : GetStopMonitoring (Prochains passages) ---
        // Vérification de la limitation de 10 secondes (Article 10)
        const maintenant = Date.now();
        if (maintenant - dernierAppelRef.current < 10000) {
          if (cachePassages.has(arretProche.hastus)) {
            setPassages(cachePassages.get(arretProche.hastus));
          }
          setLoading(false);
          return; // On bloque et on affiche le cache
        }
        dernierAppelRef.current = maintenant;

        const paramsStop = new URLSearchParams({
           code: arretProche.hastus,
           next: "3"
        });
        const resStop = await fetch(`${API_URL}/GetStopMonitoring?${paramsStop.toString()}`, {
          method: "GET",
          headers: {
            "X-AUTH-TOKEN": API_TOKEN,
          }
        });

        if (!resStop.ok) throw new Error("Erreur de l'API GetStopMonitoring");
        const dataStop = await resStop.json();
        
        // Extraction de l'objet dynamique renvoyé par l'API (clé dynamique type "SIRI_IDELIS_...")
        const passagesTrouves = [];
        for (const key in dataStop) {
          if (key.startsWith("SIRI_IDELIS")) {
            const ligne = dataStop[key];
            if (ligne.passages) {
              passagesTrouves.push({
                ligneNom: ligne.ligne,
                destination: ligne.destination,
                horaires: ligne.passages.map(p => p.arrivee) // ex: "29min" ou "12:33"
              });
            }
          }
        }

        cachePassages.set(arretProche.hastus, passagesTrouves);
        setPassages(passagesTrouves);

      } catch (err) {
        console.error("Erreur IDELIS:", err);
        setErreur("Service IDELIS temporairement indisponible.");
      } finally {
        setLoading(false);
      }
    }

    chargerDonnees();
  }, [coordonnees]);

  if (!API_URL || !API_TOKEN) {
    return (
      <div className="transportsBloc none">
        <p>⚙️ L'API IDELIS n'est pas configurée. Ajoutez votre Token dans le fichier .env.</p>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="transportsBloc error">
        <span className="icone">⚠️</span>
        <p>{erreur}</p>
      </div>
    );
  }

  if (loading && arrets.length === 0) {
    return <div className="transportsBloc loading">Chargement des horaires IDELIS...</div>;
  }

  if (arrets.length === 0) return null;

  return (
    <div className="transportsBloc">
      <div className="tHeader">
        <img src="https://www.idelis.fr/fileadmin/templates/images/logo.png" alt="IDELIS" className="idelisLogo" />
        <h3 className="tTitre">Arrêts à proximité</h3>
      </div>
      
      <div className="arretConteneur">
        <div className="arretInfo">
          <div className="arretIcone">🚏</div>
          <div>
            <span className="arretLigne">{arrets[0].ligne}</span>
            <span className="arretNom">{arrets[0].libelle}</span>
            <span className="arretDistance">à {Math.round(parseFloat(arrets[0].distance) * 1000)}m</span>
          </div>
        </div>

        {passages.length > 0 ? (
          <div className="passagesGrille">
            {passages.map((p, idx) => (
              <div key={idx} className="passageLigne">
                <div className="passageDest">
                  <strong>{p.ligneNom}</strong> vers <em>{p.destination}</em>
                </div>
                <div className="passageTemps">
                  {p.horaires.map((heure, i) => (
                    <span key={i} className={heure.includes("min") ? "tempsImminent" : "tempsFixe"}>
                      {heure}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="aucunPassage">Aucun passage prévu récemment.</div>
        )}
      </div>
    </div>
  );
}
