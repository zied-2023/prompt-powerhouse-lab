#!/usr/bin/env node

// Script de migration de Neon vers Supabase
// Usage: node migrate-to-supabase.js

import 'dotenv/config';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔄 MIGRATION NEON → SUPABASE');
console.log('================================\n');

// Configuration
const config = {
  // Ces variables seront définies dans le .env
  neonUrl: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL,
  supabaseUrl: process.env.SUPABASE_DATABASE_URL,
  dumpFile: 'neon_backup.sql',
  timestamp: new Date().toISOString().replace(/[:.]/g, '-')
};

// Vérifications préliminaires
function checkPrerequisites() {
  console.log('🔍 Vérification des prérequis...');
  
  // Vérifier que pg_dump et psql sont installés
  try {
    execSync('pg_dump --version', { stdio: 'pipe' });
    execSync('psql --version', { stdio: 'pipe' });
    console.log('✅ pg_dump et psql sont installés');
  } catch (error) {
    console.error('❌ Erreur: pg_dump ou psql non trouvés');
    console.log('💡 Installez PostgreSQL client tools:');
    console.log('   - Ubuntu/Debian: sudo apt install postgresql-client');
    console.log('   - macOS: brew install postgresql');
    console.log('   - Windows: Téléchargez depuis postgresql.org');
    process.exit(1);
  }
  
  // Vérifier les variables d'environnement
  if (!config.neonUrl) {
    console.error('❌ Erreur: DATABASE_URL (Neon) non définie');
    process.exit(1);
  }
  
  if (!config.supabaseUrl) {
    console.error('❌ Erreur: SUPABASE_DATABASE_URL non définie');
    console.log('💡 Ajoutez votre URL Supabase dans le fichier .env');
    process.exit(1);
  }
  
  console.log('✅ Configuration validée\n');
}

// Exporter la base de données Neon
function exportFromNeon() {
  console.log('📤 Exportation depuis Neon...');
  
  const dumpCommand = [
    'pg_dump',
    `"${config.neonUrl}"`,
    '--clean',
    '--if-exists', 
    '--quote-all-identifiers',
    '--no-owner',
    '--no-privileges',
    '--verbose',
    `--file=${config.dumpFile}`
  ].join(' ');
  
  try {
    console.log('⏳ Création du dump...');
    execSync(dumpCommand, { stdio: 'inherit' });
    
    // Vérifier que le fichier a été créé
    if (fs.existsSync(config.dumpFile)) {
      const stats = fs.statSync(config.dumpFile);
      console.log(`✅ Dump créé: ${config.dumpFile} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    } else {
      throw new Error('Fichier dump non créé');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'exportation:', error.message);
    process.exit(1);
  }
}

// Importer vers Supabase
function importToSupabase() {
  console.log('\n📥 Importation vers Supabase...');
  
  const importCommand = [
    'psql',
    `"${config.supabaseUrl}"`,
    '--file', config.dumpFile,
    '--verbose'
  ].join(' ');
  
  try {
    console.log('⏳ Restauration des données...');
    execSync(importCommand, { stdio: 'inherit' });
    console.log('✅ Données importées vers Supabase');
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error.message);
    console.log('💡 Vérifiez votre URL Supabase et vos permissions');
    process.exit(1);
  }
}

// Vérifier la migration
function verifyMigration() {
  console.log('\n🔍 Vérification de la migration...');
  
  try {
    // Compter les tables dans Supabase
    const countTablesCommand = `psql "${config.supabaseUrl}" -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';"`;
    const tableCount = execSync(countTablesCommand, { encoding: 'utf-8' }).trim();
    
    console.log(`✅ Nombre de tables migrées: ${tableCount}`);
    
    // Lister les tables principales
    const listTablesCommand = `psql "${config.supabaseUrl}" -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"`;
    const tables = execSync(listTablesCommand, { encoding: 'utf-8' }).trim().split('\n');
    
    console.log('📋 Tables migrées:');
    tables.forEach(table => {
      if (table.trim()) {
        console.log(`   - ${table.trim()}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  }
}

// Nettoyer les fichiers temporaires
function cleanup() {
  console.log('\n🧹 Nettoyage...');
  
  try {
    if (fs.existsSync(config.dumpFile)) {
      // Créer une sauvegarde avec timestamp
      const backupFile = `backup_${config.timestamp}_${config.dumpFile}`;
      fs.renameSync(config.dumpFile, backupFile);
      console.log(`✅ Dump sauvegardé: ${backupFile}`);
    }
  } catch (error) {
    console.log('⚠️  Impossible de nettoyer:', error.message);
  }
}

// Fonction principale
async function main() {
  try {
    checkPrerequisites();
    exportFromNeon();
    importToSupabase();
    verifyMigration();
    cleanup();
    
    console.log('\n🎉 MIGRATION TERMINÉE AVEC SUCCÈS !');
    console.log('================================');
    console.log('✅ Vos données ont été migrées de Neon vers Supabase');
    console.log('💡 N\'oubliez pas de:');
    console.log('   1. Mettre à jour votre .env avec l\'URL Supabase');
    console.log('   2. Tester votre application');
    console.log('   3. Supprimer l\'ancienne base Neon si tout fonctionne');
    
  } catch (error) {
    console.error('\n❌ ERREUR DE MIGRATION:', error.message);
    process.exit(1);
  }
}

// Lancer la migration
main();