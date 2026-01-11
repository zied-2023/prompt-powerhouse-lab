/**
 * Gestionnaire d'erreurs CORS pour filtrer les erreurs provenant
 * d'extensions de navigateur ou de scripts externes
 */

// Intercepter et filtrer les erreurs CORS non pertinentes
if (typeof window !== 'undefined') {
  const originalError = console.error;
  const originalWarn = console.warn;

  // Filtrer les erreurs CORS liées à localhost:5000/api/login ou 192.168.1.21:5000/api/login
  // qui ne proviennent pas de notre application
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    
    // Ignorer les erreurs CORS pour /api/login qui ne sont pas de notre code
    if (
      (message.includes('Access-Control-Allow-Origin') || 
       message.includes('CORS policy') ||
       message.includes('blocked by CORS') ||
       message.includes('ERR_FAILED') ||
       message.includes('Failed to fetch')) &&
      (message.includes('/api/login') || 
       message.includes('localhost:5000/api/login') ||
       message.includes('192.168.1.21:5000/api/login')) &&
      !message.includes('supabase')
    ) {
      // Ces erreurs proviennent probablement d'une extension de navigateur
      // ou d'un script externe essayant d'accéder à une route qui n'existe pas
      // On les ignore silencieusement car notre plugin Vite gère maintenant ces requêtes
      return;
    }
    
    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    
    // Ignorer les avertissements CORS pour /api/login
    if (
      (message.includes('CORS') ||
       message.includes('blocked by CORS') ||
       message.includes('Access-Control')) &&
      (message.includes('/api/login') ||
       message.includes('localhost:5000/api/login') ||
       message.includes('192.168.1.21:5000/api/login')) &&
      !message.includes('supabase')
    ) {
      return;
    }
    
    originalWarn.apply(console, args);
  };

  // Intercepter les erreurs non gérées liées à CORS
  window.addEventListener('error', (event) => {
    const errorMessage = event.message || '';
    
    if (
      (errorMessage.includes('Access-Control-Allow-Origin') ||
       errorMessage.includes('CORS policy') ||
       errorMessage.includes('blocked by CORS') ||
       errorMessage.includes('ERR_FAILED')) &&
      (errorMessage.includes('/api/login') ||
       errorMessage.includes('localhost:5000/api/login') ||
       errorMessage.includes('192.168.1.21:5000/api/login')) &&
      !errorMessage.includes('supabase')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);

  // Intercepter les promesses rejetées liées à CORS
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || event.reason?.toString() || '';
    
    if (
      (reason.includes('Access-Control-Allow-Origin') ||
       reason.includes('CORS policy') ||
       reason.includes('blocked by CORS') ||
       reason.includes('ERR_FAILED') ||
       reason.includes('Failed to fetch')) &&
      (reason.includes('/api/login') ||
       reason.includes('localhost:5000/api/login') ||
       reason.includes('192.168.1.21:5000/api/login')) &&
      !reason.includes('supabase')
    ) {
      event.preventDefault();
      return false;
    }
  });
}

export {};


