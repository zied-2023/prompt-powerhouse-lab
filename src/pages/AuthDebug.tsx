import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthDebug() {
  const { user, session, loading } = useAuth();
  const [localStorageData, setLocalStorageData] = useState<string>('');
  const [sessionData, setSessionData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkLocalStorage();
    checkSession();
  }, []);

  const checkLocalStorage = () => {
    const keys = Object.keys(localStorage);
    const supabaseKeys = keys.filter(key => key.includes('supabase'));
    const data = supabaseKeys.map(key => ({
      key,
      value: localStorage.getItem(key)?.substring(0, 100) + '...'
    }));
    setLocalStorageData(JSON.stringify(data, null, 2));
  };

  const checkSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setError(error.message);
      } else {
        setSessionData(data.session);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const testConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('improved_prompts')
        .select('count')
        .limit(1);

      if (error) {
        setError(`Erreur DB: ${error.message}`);
      } else {
        alert('✅ Connexion à la base de données réussie !');
      }
    } catch (err: any) {
      setError(`Exception: ${err.message}`);
    }
  };

  const clearSession = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Diagnostic d'Authentification Supabase</CardTitle>
          <CardDescription>
            Informations de débogage pour résoudre les problèmes de connexion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* État du contexte Auth */}
          <div>
            <h3 className="font-bold mb-2">📊 État du contexte Auth</h3>
            <div className="bg-gray-100 p-4 rounded space-y-2">
              <p><strong>Loading:</strong> {loading ? '⏳ Oui' : '✅ Non'}</p>
              <p><strong>User:</strong> {user ? `✅ ${user.email}` : '❌ Null'}</p>
              <p><strong>Session:</strong> {session ? '✅ Présente' : '❌ Absente'}</p>
            </div>
          </div>

          {/* Variables d'environnement */}
          <div>
            <h3 className="font-bold mb-2">🔧 Variables d'environnement</h3>
            <div className="bg-gray-100 p-4 rounded space-y-2">
              <p><strong>VITE_SUPABASE_URL:</strong> {import.meta.env.VITE_SUPABASE_URL || '❌ Non défini'}</p>
              <p><strong>VITE_SUPABASE_ANON_KEY:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? `✅ Défini (${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...)` : '❌ Non défini'}</p>
            </div>
          </div>

          {/* Session Supabase directe */}
          <div>
            <h3 className="font-bold mb-2">🎫 Session Supabase (getSession)</h3>
            <div className="bg-gray-100 p-4 rounded">
              {sessionData ? (
                <pre className="text-xs overflow-auto max-h-40">
                  {JSON.stringify({
                    user: sessionData.user?.email,
                    expires_at: sessionData.expires_at,
                    token_type: sessionData.token_type
                  }, null, 2)}
                </pre>
              ) : (
                <p>❌ Aucune session active</p>
              )}
            </div>
          </div>

          {/* LocalStorage */}
          <div>
            <h3 className="font-bold mb-2">💾 LocalStorage Supabase</h3>
            <div className="bg-gray-100 p-4 rounded">
              <pre className="text-xs overflow-auto max-h-40">
                {localStorageData || 'Aucune donnée Supabase'}
              </pre>
            </div>
          </div>

          {/* Erreurs */}
          {error && (
            <div>
              <h3 className="font-bold mb-2 text-red-600">❌ Erreurs</h3>
              <div className="bg-red-50 border border-red-200 p-4 rounded">
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 flex-wrap">
            <Button onClick={checkSession} variant="outline">
              🔄 Recharger Session
            </Button>
            <Button onClick={checkLocalStorage} variant="outline">
              🔄 Recharger LocalStorage
            </Button>
            <Button onClick={testConnection} variant="default">
              🧪 Tester Connexion DB
            </Button>
            <Button onClick={clearSession} variant="destructive">
              🗑️ Effacer tout et recharger
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
