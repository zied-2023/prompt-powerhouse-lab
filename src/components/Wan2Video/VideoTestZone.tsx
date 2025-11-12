import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, TestTube, Video, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VideoTestZoneProps {
  initialPrompt?: string;
}

interface VideoGenerationResponse {
  success: boolean;
  taskId?: string;
  status?: string;
  videoUrl?: string;
  error?: string;
}

const VideoTestZone: React.FC<VideoTestZoneProps> = ({ initialPrompt = '' }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [duration, setDuration] = useState('3s');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [seed, setSeed] = useState(-1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskId, setTaskId] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'pending' | 'processing' | 'completed' | 'failed'>('idle');
  const [errorDetails, setErrorDetails] = useState<string>('');

  React.useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const generateVideo = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un prompt",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('pending');
    setVideoUrl('');
    setTaskId('');
    setErrorDetails('');

    try {
      console.log('🎬 Génération vidéo via Edge Function (Runway API):', { prompt, duration, aspectRatio });

      const requestBody = {
        action: 'generate',
        prompt: prompt.trim(),
        duration: parseInt(duration.replace('s', '')),
        quality: '720p',
        aspectRatio: aspectRatio,
        waterMark: ''
      };

      console.log('📤 Request body:', requestBody);

      const { data, error } = await supabase.functions.invoke('runway-video-proxy', {
        body: requestBody
      });

      console.log('📥 Edge Function response:', { data, error });

      if (error) {
        throw new Error(error.message || 'Erreur lors de l\'appel à l\'Edge Function');
      }

      if (data.code === 200 && data.data?.taskId) {
        const taskId = data.data.taskId;
        setTaskId(taskId);
        setGenerationStatus('processing');

        toast({
          title: "Génération lancée",
          description: `Task ID: ${taskId}. Les vidéos prennent 1-3 minutes.`,
        });

        pollVideoStatus(taskId);
      } else {
        throw new Error(data.msg || data.message || data.error || 'Erreur lors de la génération');
      }

    } catch (error: any) {
      console.error('❌ Erreur génération vidéo:', error);
      setGenerationStatus('failed');

      let errorMessage = error.message || "Impossible de générer la vidéo";

      if (error.message === 'Failed to fetch') {
        errorMessage = "Impossible de se connecter à l'API Kie.ai.";
        setErrorDetails("Erreur CORS ou réseau. Vérifiez votre connexion internet.");
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = "Clé API invalide ou expirée";
        setErrorDetails("Vérifiez que votre clé API Kie.ai est correcte et active.");
      } else if (error.message.includes('429')) {
        errorMessage = "Limite de requêtes atteinte";
        setErrorDetails("Vous avez dépassé la limite de requêtes. Attendez quelques instants.");
      } else if (error.message.includes('400')) {
        errorMessage = "Requête invalide";
        setErrorDetails("Le format de la requête ou les paramètres sont incorrects. Vérifiez votre prompt.");
      }

      toast({
        title: "Erreur de génération",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const pollVideoStatus = async (taskId: string) => {
    const maxAttempts = 60;
    let attempts = 0;

    const checkStatus = async () => {
      try {
        console.log('🔍 Checking status for taskId:', taskId);

        const { data, error } = await supabase.functions.invoke('runway-video-proxy', {
          body: {
            action: 'status',
            taskId: taskId
          }
        });

        console.log('📊 Status check:', { data, error });

        if (error) {
          throw new Error(error.message || 'Erreur lors de la vérification du statut');
        }

        if (data.code === 200 && data.data) {
          const status = data.data.status;

          if (status === 'SUCCESS' && data.data.videoUrl) {
            const videoUrl = data.data.videoUrl;
            setVideoUrl(videoUrl);
            setGenerationStatus('completed');

            toast({
              title: "Vidéo générée avec succès",
              description: "Votre vidéo est prête",
            });

            return;
          } else if (status === 'FAILED' || status === 'ERROR') {
            setGenerationStatus('failed');
            setErrorDetails(data.data.error || data.msg || 'Erreur inconnue');

            toast({
              title: "Échec de génération",
              description: data.data.error || data.msg || "La génération a échoué",
              variant: "destructive"
            });

            return;
          } else if (status === 'PENDING' || status === 'PROCESSING') {
            attempts++;

            if (attempts < maxAttempts) {
              setTimeout(checkStatus, 5000);
            } else {
              setGenerationStatus('failed');
              toast({
                title: "Timeout",
                description: "La génération a pris trop de temps",
                variant: "destructive"
              });
            }
          }
        } else {
          throw new Error(data.msg || 'Format de réponse inattendu');
        }

      } catch (error: any) {
        console.error('❌ Erreur vérification statut:', error);
        attempts++;

        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000);
        } else {
          setGenerationStatus('failed');
          setErrorDetails(error.message);
        }
      }
    };

    checkStatus();
  };

  const getStatusBadge = () => {
    switch (generationStatus) {
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Terminé</Badge>;
      case 'failed':
        return <Badge className="bg-red-500" variant="destructive">Échec</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-purple-600" />
          Zone de Test - Kie.ai (Runway Gen-3)
        </CardTitle>
        <CardDescription>
          Testez vos prompts avec l'API Kie.ai Runway Gen-3 en temps réel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Cette zone de test utilise l'API Kie.ai (modèle Runway Gen-3) pour générer des vidéos réelles.
            La génération peut prendre 1-3 minutes selon la durée.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="test-prompt">Prompt</Label>
          <Textarea
            id="test-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Entrez votre prompt WAN-2.2..."
            className="min-h-24 font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">{prompt.length} / 200 caractères</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="test-duration">Durée</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="test-duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3s">3 secondes</SelectItem>
                <SelectItem value="5s">5 secondes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-aspect">Aspect Ratio</Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger id="test-aspect">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9 (Paysage)</SelectItem>
                <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                <SelectItem value="1:1">1:1 (Carré)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-seed">Seed</Label>
            <Input
              id="test-seed"
              type="number"
              value={seed}
              onChange={(e) => setSeed(parseInt(e.target.value) || -1)}
              placeholder="-1 (Random)"
            />
          </div>
        </div>

        <Button
          onClick={generateVideo}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Video className="h-4 w-4 mr-2" />
              Générer la Vidéo
            </>
          )}
        </Button>

        {generationStatus !== 'idle' && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Statut de génération:</span>
              {getStatusBadge()}
            </div>

            {taskId && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Task ID</Label>
                <p className="text-xs font-mono bg-white dark:bg-gray-800 p-2 rounded border">
                  {taskId}
                </p>
              </div>
            )}

            {generationStatus === 'processing' && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription className="text-xs">
                  Génération en cours... Cela peut prendre 1-3 minutes
                </AlertDescription>
              </Alert>
            )}

            {generationStatus === 'completed' && videoUrl && (
              <div className="space-y-3">
                <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-xs text-green-700 dark:text-green-300">
                    Vidéo générée avec succès!
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label className="text-sm">Vidéo générée</Label>
                  <video
                    src={videoUrl}
                    controls
                    className="w-full rounded-lg border"
                    style={{ maxHeight: '400px' }}
                  >
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(videoUrl, '_blank')}
                >
                  Ouvrir dans un nouvel onglet
                </Button>
              </div>
            )}

            {generationStatus === 'failed' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs space-y-2">
                  <p>La génération a échoué. Veuillez réessayer.</p>
                  {errorDetails && (
                    <p className="text-xs bg-red-900/20 p-2 rounded border border-red-700 mt-2">
                      <strong>Détails:</strong> {errorDetails}
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 space-y-2">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Note:</strong> Cette zone utilise l'API Kie.ai (Runway Gen-3) via Supabase Edge Function.
            Les vidéos sont générées sur les serveurs Kie.ai et peuvent prendre 1-3 minutes.
          </p>
          <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
            <p><strong>Configuration actuelle:</strong></p>
            <p>• Edge Function: runway-video-proxy</p>
            <p>• Model: Runway Gen-3 Alpha Turbo (Text-to-Video)</p>
            <p>• Pas de problème CORS grâce au proxy</p>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
            <p className="text-xs text-orange-700 dark:text-orange-300 font-semibold">
              🔍 Débogage: Vérifiez la console du navigateur (F12) pour voir les détails de la requête et de la réponse.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoTestZone;
