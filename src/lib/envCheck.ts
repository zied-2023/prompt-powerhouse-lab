export const checkEnvironmentVariables = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');

    return {
      valid: false,
      message: 'Configuration Supabase manquante. Veuillez configurer les variables d\'environnement.'
    };
  }

  return {
    valid: true,
    message: 'Configuration Supabase OK'
  };
};

export const logEnvironmentInfo = () => {
  console.log('=== Environment Check ===');
  console.log('Mode:', import.meta.env.MODE);
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing');
  console.log('Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configured' : 'Missing');
  console.log('========================');
};
