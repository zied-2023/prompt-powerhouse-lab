# 🔄 GUIDE DE MIGRATION NEON → SUPABASE

Ce guide vous accompagne étape par étape pour migrer votre projet PromptCraft de Neon PostgreSQL vers Supabase.

## 🎯 **POURQUOI MIGRER VERS SUPABASE ?**

### Avantages de Supabase :
- ✅ **Real-time subscriptions** - Données en temps réel
- ✅ **Authentification intégrée** - Auth complète out-of-the-box
- ✅ **Storage intégré** - Stockage de fichiers inclus
- ✅ **Edge Functions** - Fonctions serverless
- ✅ **Dashboard avancé** - Interface de gestion complète
- ✅ **API REST automatique** - API générée automatiquement

## 🚀 **PROCÉDURE DE MIGRATION**

### **ÉTAPE 1 : Préparer Supabase**

1. **Créez un compte Supabase**
   - Allez sur https://supabase.com
   - Cliquez "Start your project"
   - Connectez-vous avec GitHub ou email

2. **Créez un nouveau projet**
   - Nom du projet : `promptcraft`
   - Mot de passe : Choisissez un mot de passe fort
   - Région : Choisissez la plus proche de vous

3. **Récupérez votre URL de connexion**
   - Dans votre projet Supabase
   - Allez dans `Settings` → `Database`
   - Section "Connection string"
   - Copiez l'URL **Session pooler** (recommandé)

### **ÉTAPE 2 : Configurer les variables d'environnement**

Modifiez votre fichier `.env` :

```env
# Votre URL Neon actuelle (ne pas changer pour l'instant)
DATABASE_URL=postgresql://votre-url-neon-actuelle

# Ajoutez votre nouvelle URL Supabase
SUPABASE_DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

# Autres variables (ne pas changer)
SESSION_SECRET=dev-secret-key-change-in-production-123456789
PORT=5000
NODE_ENV=development
```

### **ÉTAPE 3 : Lancer la migration automatique**

```bash
# Lancer le script de migration
node migrate-to-supabase.js
```

Le script va :
1. ✅ Vérifier les prérequis
2. ✅ Exporter toutes vos données depuis Neon
3. ✅ Importer les données vers Supabase
4. ✅ Vérifier l'intégrité des données
5. ✅ Créer une sauvegarde de sécurité

### **ÉTAPE 4 : Basculer vers Supabase**

Une fois la migration terminée avec succès :

1. **Mettez à jour votre `.env`** :
```env
# Commentez l'ancienne URL
# DATABASE_URL=postgresql://votre-url-neon-actuelle

# Activez la nouvelle URL Supabase
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

2. **Redémarrez votre serveur** :
```bash
npm run dev
```

3. **Testez votre application** :
   - Créez un compte utilisateur
   - Créez quelques prompts
   - Vérifiez que tout fonctionne

## 🛠️ **MIGRATION MANUELLE (Alternative)**

Si vous préférez faire la migration manuellement :

### **Exporter depuis Neon :**
```bash
pg_dump "votre-url-neon" \
  --clean \
  --if-exists \
  --quote-all-identifiers \
  --no-owner \
  --no-privileges \
  > neon_backup.sql
```

### **Importer vers Supabase :**
```bash
psql "votre-url-supabase" -f neon_backup.sql
```

## 🔍 **VÉRIFICATION POST-MIGRATION**

### **Testez ces fonctionnalités :**
- [ ] Connexion/Inscription utilisateur
- [ ] Création de prompts
- [ ] Sauvegarde de prompts
- [ ] Gestion des catégories
- [ ] Bibliothèque de templates
- [ ] Génération avancée de prompts

### **Vérifiez dans Supabase Dashboard :**
1. Allez dans votre projet Supabase
2. Section `Table Editor`
3. Vérifiez que toutes vos tables sont présentes :
   - `users`
   - `categories`
   - `prompts`
   - `prompt_sessions`
   - `sessions`

## 🎁 **BONUS : Nouvelles fonctionnalités Supabase**

Après la migration, vous pouvez activer :

### **1. Real-time subscriptions**
```javascript
// Écouter les changements en temps réel
supabase
  .channel('prompts')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'prompts' 
  }, (payload) => {
    console.log('Nouveau prompt créé !', payload)
  })
  .subscribe()
```

### **2. Authentification Supabase**
```javascript
// Remplacer votre auth actuelle par Supabase Auth
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})
```

### **3. Storage pour fichiers**
```javascript
// Stocker des fichiers (images, documents)
const { data, error } = await supabase.storage
  .from('prompt-attachments')
  .upload('file.pdf', file)
```

## 🚨 **DÉPANNAGE**

### **Erreur de connexion Supabase :**
- Vérifiez votre URL de connexion
- Assurez-vous d'utiliser le bon mot de passe
- Vérifiez que votre projet Supabase est actif

### **Erreur lors de l'import :**
- Vérifiez que pg_dump et psql sont installés
- Assurez-vous que votre base Neon est accessible
- Vérifiez les permissions Supabase

### **Données manquantes :**
- Utilisez la sauvegarde créée par le script
- Recommencez l'import si nécessaire
- Contactez le support si problème persistant

## 📞 **SUPPORT**

- **Supabase Docs** : https://supabase.com/docs
- **Supabase Discord** : https://discord.supabase.com
- **Supabase Support** : https://supabase.com/support

---

## 🎉 **FÉLICITATIONS !**

Une fois la migration terminée, vous bénéficiez de :
- ✅ Base de données PostgreSQL performante
- ✅ Authentification complète
- ✅ Real-time capabilities
- ✅ Dashboard de gestion avancé
- ✅ API REST automatique
- ✅ Storage intégré

Votre projet PromptCraft est maintenant prêt pour la prochaine étape ! 🚀