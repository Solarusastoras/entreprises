import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setChargement(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const connexion = async (email, motDePasse) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse });
    if (error) throw error;
  };

  const deconnexion = async () => {
    await supabase.auth.signOut();
  };

  return {
    session,
    user: session?.user ?? null,
    estConnecte: !!session,
    chargement,
    connexion,
    deconnexion,
  };
}
