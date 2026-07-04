import { useState } from 'react';

export function useAuth() {
  const [session, setSession] = useState({ user: { email: 'admin@nas.local' } });

  const connexion = async (email, motDePasse) => {
    // Connexion automatique sans vérification (NAS local)
    setSession({ user: { email } });
  };

  const deconnexion = async () => {
    setSession(null);
  };

  return {
    session,
    user: session?.user ?? null,
    estConnecte: !!session,
    chargement: false,
    connexion,
    deconnexion,
  };
}
