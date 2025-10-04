import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleCheck as CheckCircle2, Circle as XCircle } from "lucide-react";

interface PromptModeInfoProps {
  mode: 'free' | 'basic' | 'premium';
  compact?: boolean;
}

export const PromptModeInfo = ({ mode, compact = false }: PromptModeInfoProps) => {
  const modeConfig = {
    free: {
      title: "Mode Gratuit",
      tokens: "150 tokens",
      color: "bg-slate-500",
      rules: {
        allowed: [
          "Objectif en 1 phrase",
          "2-3 éléments maximum",
          "Instructions directes"
        ],
        forbidden: [
          "Exemples",
          "Explications du pourquoi",
          "Plus de 2 styles/références"
        ]
      }
    },
    basic: {
      title: "Mode Basique",
      tokens: "300 tokens",
      color: "bg-blue-500",
      rules: {
        allowed: [
          "Objectif précis",
          "Instructions directes",
          "Format de sortie",
          "Méthodologie intégrée"
        ],
        forbidden: [
          "Exemples complets (>50 mots)",
          "Explications du pourquoi",
          "Plus de 2 styles/références",
          "Section méthodologie séparée"
        ]
      }
    },
    premium: {
      title: "Mode Premium",
      tokens: "600 tokens",
      color: "bg-gradient-to-r from-violet-500 to-purple-500",
      rules: {
        allowed: [
          "Rôle expert spécialisé",
          "Objectif mesurable",
          "Instructions avec méthodologie intégrée",
          "2-3 éléments requis",
          "Format structuré"
        ],
        forbidden: [
          "Exemples longs (>50 mots)",
          "Explications du pourquoi",
          "Plus de 3 styles/références",
          "Section méthodologie séparée",
          "Format exemple + livrable (choisir 1 seul)"
        ]
      }
    }
  };

  const config = modeConfig[mode];

  if (compact) {
    return (
      <div className="text-xs text-muted-foreground space-y-1">
        <Badge className={config.color + " text-white"}>
          {config.title} - Max {config.tokens}
        </Badge>
      </div>
    );
  }

  return (
    <Card className="glass-card border-white/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Badge className={config.color + " text-white text-sm px-3 py-1"}>
            {config.title}
          </Badge>
          <span className="text-sm font-normal text-muted-foreground">
            Maximum {config.tokens}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Autorisé
          </h4>
          <ul className="space-y-1 text-sm">
            {config.rules.allowed.map((rule, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600" />
            Interdit
          </h4>
          <ul className="space-y-1 text-sm">
            {config.rules.forbidden.map((rule, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">✗</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
