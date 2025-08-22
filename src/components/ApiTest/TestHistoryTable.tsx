import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  ExternalLink
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TestResult {
  id: number;
  provider: string;
  success: boolean;
  message: string;
  details?: any;
  keyPreview: string;
  timestamp: string;
}

interface TestHistoryTableProps {
  tests: TestResult[];
}

const API_PROVIDER_INFO: Record<string, { name: string; icon: string }> = {
  openai: { name: 'OpenAI', icon: '🤖' },
  stripe: { name: 'Stripe', icon: '💳' },
  anthropic: { name: 'Anthropic', icon: '🧠' },
  sendgrid: { name: 'SendGrid', icon: '📧' },
  github: { name: 'GitHub', icon: '🐙' }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const TestHistoryTable: React.FC<TestHistoryTableProps> = ({ tests }) => {
  const exportToCSV = () => {
    const headers = ['Date', 'Fournisseur', 'Clé', 'Statut', 'Message'];
    const csvContent = [
      headers.join(','),
      ...tests.map(test => [
        formatTimestamp(test.timestamp),
        API_PROVIDER_INFO[test.provider]?.name || test.provider,
        test.keyPreview,
        test.success ? 'Succès' : 'Échec',
        `"${test.message.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `api-tests-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(tests, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `api-tests-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (tests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">Aucun test effectué</p>
        <p className="text-sm">Vos tests d'API apparaîtront ici</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Export Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{tests.length} test{tests.length > 1 ? 's' : ''}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-emerald-500" />
              <span>
                {tests.filter(t => t.success).length} succès
              </span>
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToCSV}
                  className="h-8"
                >
                  <Download className="h-3 w-3 mr-1" />
                  CSV
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exporter en CSV</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToJSON}
                  className="h-8"
                >
                  <Download className="h-3 w-3 mr-1" />
                  JSON
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exporter en JSON</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Tests Table */}
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Fournisseur
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Clé
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tests.map((test) => {
                  const providerInfo = API_PROVIDER_INFO[test.provider];
                  return (
                    <tr key={test.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                        {formatTimestamp(test.timestamp)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{providerInfo?.icon || '🔑'}</span>
                          <span className="text-sm font-medium">
                            {providerInfo?.name || test.provider}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {test.keyPreview}
                        </code>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge 
                          variant={test.success ? "default" : "destructive"}
                          className="flex items-center space-x-1"
                        >
                          {test.success ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          <span>{test.success ? 'Succès' : 'Échec'}</span>
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-xs">
                          <p className="text-sm text-foreground truncate" title={test.message}>
                            {test.message}
                          </p>
                          {test.details && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground mt-1"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Voir détails
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-md">
                                <pre className="text-xs whitespace-pre-wrap">
                                  {typeof test.details === 'string' 
                                    ? test.details 
                                    : JSON.stringify(test.details, null, 2)
                                  }
                                </pre>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Show only last 10 notice */}
        {tests.length >= 20 && (
          <div className="text-center text-xs text-muted-foreground bg-muted/30 rounded p-2">
            Seuls les 20 derniers tests sont affichés. 
            <span className="font-medium"> Passez au Premium</span> pour un historique complet.
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default TestHistoryTable;