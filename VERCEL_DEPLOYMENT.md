# Guide de Déploiement sur Vercel

## Étapes pour déployer sur Vercel

### 1. Préparer le projet

Le projet est déjà configuré avec :
- ✅ `vercel.json` - Configuration des rewrites pour React Router
- ✅ `.env.example` - Template des variables d'environnement

### 2. Variables d'environnement à configurer sur Vercel

Dans les paramètres de votre projet Vercel, ajoutez ces variables d'environnement :

```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltbnlyc2NtY2NmZ3h2dGh4eHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzkwMDgsImV4cCI6MjA3MTExNTAwOH0.wwLnNL0SxUF0bOGr2ROEHX-YR0Y579H2BA5_6VR4Pyc
VITE_SUPABASE_URL=https://imnyrscmccfgxvthxxxn.supabase.co
```

### 3. Configuration du Build sur Vercel

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Déployer

#### Option A : Via l'interface Vercel
1. Connectez-vous à [vercel.com](https://vercel.com)
2. Cliquez sur "New Project"
3. Importez votre repository Git
4. Ajoutez les variables d'environnement
5. Cliquez sur "Deploy"

#### Option B : Via Vercel CLI
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Ou déployer en production directement
vercel --prod
```

### 5. Vérifications après déploiement

- ✅ La page d'accueil se charge correctement
- ✅ Le routing fonctionne (navigation entre les pages)
- ✅ Les variables d'environnement Supabase sont accessibles
- ✅ L'authentification fonctionne

### Résolution des problèmes courants

#### Page blanche
- Vérifiez que les variables d'environnement sont bien configurées
- Vérifiez que `vercel.json` est présent à la racine
- Consultez les logs de build dans Vercel

#### Erreur 404 sur les routes
- Le fichier `vercel.json` doit être présent avec la configuration des rewrites
- Vérifiez que le routing est basé sur BrowserRouter (pas HashRouter)

#### Erreur Supabase
- Vérifiez que les variables VITE_SUPABASE_* sont correctement définies
- Les variables doivent commencer par `VITE_` pour être accessibles côté client

### Support

Pour plus d'informations, consultez :
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Vite](https://vitejs.dev/guide/static-deploy.html)
