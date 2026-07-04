const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://pcuiellfuoeaeddyzhlz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjdWllbGxmdW9lYWVkZHl6aGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NzYwOTYsImV4cCI6MjA4OTE1MjA5Nn0.X0C0VzZZZInZqVExEzVOBKVJU86VSaSlpnBMHW4vgc8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  console.log("Téléchargement des entreprises depuis Supabase...");
  const { data: entreprises, error } = await supabase.from('entreprises').select('*');
  
  if (error) {
    console.error("Erreur de téléchargement :", error);
    return;
  }
  
  console.log(`✅ ${entreprises.length} entreprises trouvées dans Supabase.`);
  
  const backupFile = 'backup_supabase_entreprises.json';
  fs.writeFileSync(backupFile, JSON.stringify(entreprises, null, 2));
  console.log(`✅ Sauvegarde réussie dans le fichier : ${backupFile}`);
}

migrateData();
