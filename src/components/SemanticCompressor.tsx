import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, Zap } from 'lucide-react';
import { SemanticCompressor as Compressor } from '@/lib/semanticCompressor';

export function SemanticCompressor() {
  const [inputPrompt, setInputPrompt] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCompress = () => {
    if (!inputPrompt.trim()) return;

    setLoading(true);

    setTimeout(() => {
      const compressed = Compressor.compress(inputPrompt);
      setResult(compressed);
      setLoading(false);
    }, 500);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.compressed);
    }
  };

  const getReductionColor = (rate: number) => {
    if (rate >= 40 && rate <= 60) return 'bg-green-500';
    if (rate >= 30 && rate < 40) return 'bg-yellow-500';
    if (rate > 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Compresseur Sémantique Expert
          </CardTitle>
          <CardDescription>
            Réduit vos prompts de 40-60% sans altérer structure, précision ou impact.
            Optimisé pour Mistral Large Latest.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Prompt Source
            </label>
            <Textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Collez votre prompt ici..."
              className="min-h-[200px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Tokens estimés : {Math.ceil(inputPrompt.length / 4)}
            </p>
          </div>

          <Button
            onClick={handleCompress}
            disabled={!inputPrompt.trim() || loading}
            className="w-full"
          >
            {loading ? 'Compression en cours...' : 'Compresser'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Résultat Compressé</CardTitle>
                <Badge className={getReductionColor(result.reductionRate)}>
                  {result.reductionRate}% de réduction
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {result.compressed}
                </pre>
              </div>

              <Button onClick={copyToClipboard} variant="outline" className="w-full">
                Copier le prompt compressé
              </Button>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tokens originaux</span>
                  <span className="font-semibold">{result.originalTokens}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tokens compressés</span>
                  <span className="font-semibold">{result.compressedTokens}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Économie</span>
                  <span className="font-semibold text-green-600">
                    {result.originalTokens - result.compressedTokens} tokens
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Validation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  {result.validation.structureIntact ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm">Structure intacte</span>
                </div>
                <div className="flex items-center gap-2">
                  {result.validation.precisionPreserved ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm">Précision préservée</span>
                </div>
                <div className="flex items-center gap-2">
                  {result.validation.readabilityMaintained ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm">Lisibilité maintenue</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Techniques Appliquées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.techniques.map((technique: string, idx: number) => (
                  <Badge key={idx} variant="secondary">
                    {technique}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {result.reductionRate < 40 && (
            <Alert>
              <AlertDescription>
                La réduction est inférieure à 40%. Le prompt contient probablement peu
                de contenu compressible. Considérez réviser manuellement.
              </AlertDescription>
            </Alert>
          )}

          {result.reductionRate > 60 && (
            <Alert>
              <AlertDescription>
                La réduction dépasse 60%. Vérifiez que toutes les informations critiques
                sont préservées avant utilisation.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}
