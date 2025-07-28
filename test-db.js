import 'dotenv/config';
import { db } from './server/db.js';

async function testConnection() {
  try {
    console.log('🔄 Test de connexion à la base de données...');
    
    // Test simple de connexion
    const result = await db.execute('SELECT NOW() as current_time, version() as postgres_version');
    
    console.log('✅ Connexion réussie !');
    console.log('📅 Heure actuelle:', result.rows[0].current_time);
    console.log('🐘 Version PostgreSQL:', result.rows[0].postgres_version.split(' ')[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.log('\n💡 Vérifiez que:');
    console.log('   1. Votre URL Neon est correcte dans le fichier .env');
    console.log('   2. Votre projet Neon est actif');
    console.log('   3. Les paramètres de connexion sont valides');
    process.exit(1);
  }
}

testConnection();