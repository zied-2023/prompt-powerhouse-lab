# PromptCraft

Une plateforme sophistiquée de génération et d'amélioration de prompts IA avec support multi-langues et intégration base de données.

## 🚀 Fonctionnalités

- **Génération de prompts IA** - Créez des prompts optimisés avec l'assistance de l'IA
- **Amélioration de prompts** - Améliorez vos prompts existants
- **Générateur avancé** - Architecture experte en 15 sections pour la formulation complexe
- **Bibliothèque de templates** - Parcourez et gérez vos templates de prompts
- **Support multi-langues** - Français, Anglais, Arabe avec support RTL
- **Authentification** - Système d'authentification email/mot de passe sécurisé
- **Base de données** - Intégration PostgreSQL complète
- **Thèmes** - Mode sombre/clair

## 🛠️ Technologies

### Frontend
- React 18 avec TypeScript
- Vite pour le développement
- Tailwind CSS + Shadcn/ui
- TanStack Query pour la gestion d'état serveur
- Wouter pour le routing

### Backend
- Express.js avec TypeScript
- PostgreSQL avec Drizzle ORM
- Passport.js pour l'authentification
- Session management avec connect-pg-simple

## 🏗️ Architecture

```
├── client/          # Frontend React
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/       # Pages de l'application
│   │   ├── hooks/       # Hooks personnalisés
│   │   ├── contexts/    # Contextes React
│   │   └── translations/ # Fichiers de traduction
├── server/          # Backend Express
│   ├── auth.ts      # Authentification
│   ├── storage.ts   # Couche de stockage
│   └── routes.ts    # Routes API
├── shared/          # Code partagé
│   └── schema.ts    # Schémas de base de données
```

## 🚦 Installation

1. Clonez le repository
```bash
git clone [URL_DU_REPO]
cd promptcraft
```

2. Installez les dépendances
```bash
npm install
```

3. Configurez les variables d'environnement
```bash
cp .env.example .env
# Ajoutez vos variables d'environnement
```

4. Configurez la base de données
```bash
npm run db:push
```

5. Démarrez l'application
```bash
npm run dev
```

## 📝 Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run start` - Démarre le serveur de production
- `npm run db:push` - Synchronise le schéma de base de données
- `npm run check` - Vérifie les types TypeScript

## 🌍 Support multi-langues

L'application supporte actuellement :
- 🇫🇷 Français
- 🇬🇧 Anglais
- 🇸🇦 Arabe (avec support RTL)

## 🗄️ Base de données

Le schéma de base de données comprend :
- **users** - Gestion des utilisateurs
- **categories** - Catégories de prompts
- **prompts** - Stockage des prompts
- **prompt_sessions** - Sessions de création de prompts
- **sessions** - Gestion des sessions utilisateur

## 🔐 Authentification

Système d'authentification local avec :
- Hachage sécurisé des mots de passe (scrypt)
- Gestion des sessions avec PostgreSQL
- Middleware d'authentification
- Protection des routes

## 📚 Composants principaux

### Générateur de prompts
Interface intuitive pour créer des prompts avec sélection de catégories et intégration IA.

### Amélioration de prompts
Outil pour améliorer les prompts existants avec l'assistance de l'IA.

### Générateur avancé
Architecture experte en 15 sections pour la formulation complexe de prompts.

### Bibliothèque de templates
Parcourez et gérez vos templates de prompts sauvegardés.

## 🎨 Personnalisation

- **Thèmes** - Mode sombre/clair
- **Langues** - Changement de langue dynamique
- **UI** - Interface moderne avec Shadcn/ui

## 📄 Licence

Ce projet est sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.