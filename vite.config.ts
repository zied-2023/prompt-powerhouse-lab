import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Plugin Vite pour gérer les requêtes CORS vers /api/login
const corsHandlerPlugin = () => {
  return {
    name: 'cors-handler',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Intercepter les requêtes vers /api/login et renvoyer une réponse CORS valide
        if (req.url && req.url.startsWith('/api/login')) {
          // Gérer les requêtes OPTIONS (preflight)
          if (req.method === 'OPTIONS') {
            res.writeHead(200, {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              'Access-Control-Max-Age': '86400'
            });
            res.end();
            return;
          }
          
          // Gérer les autres requêtes
          res.writeHead(404, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify({ 
            error: 'This endpoint does not exist. This application uses Supabase for authentication.',
            message: 'Please use Supabase authentication endpoints instead.'
          }));
          return;
        }
        next();
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: ['.replit.dev'],
    hmr: {
      overlay: true
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    corsHandlerPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@radix-ui/react-label',
      '@radix-ui/react-select',
      '@radix-ui/react-slot',
      '@radix-ui/react-collapsible',
      'lucide-react',
      'clsx',
      'tailwind-merge'
    ]
  }
}));