
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Settings, Zap, Link, Copy, CheckCircle, AlertCircle } from "lucide-react";

const IntegrationPanel = () => {
  const [apiConfig, setApiConfig] = useState({
    endpoint: 'https://api.promptpowerhouse.dev/v1/generate',
    apiKey: '',
    enableAuth: true,
    rateLimit: 100,
    timeout: 30
  });

  const [widgetCode, setWidgetCode] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const generateWidgetCode = () => {
    const code = `<!-- Prompt Powerhouse Widget -->
<div id="prompt-powerhouse-widget"></div>
<script>
  (function() {
    const config = {
      apiEndpoint: '${apiConfig.endpoint}',
      apiKey: '${apiConfig.apiKey}',
      theme: 'default',
      categories: ['text-generation', 'image-creation'],
      autoInit: true
    };
    
    const script = document.createElement('script');
    script.src = 'https://cdn.promptpowerhouse.dev/widget.js';
    script.onload = function() {
      PromptPowerhouse.init('prompt-powerhouse-widget', config);
    };
    document.head.appendChild(script);
  })();
</script>`;

    setWidgetCode(code);
    toast({
      title: "Widget Code Generated",
      description: "Embed code is ready for your no-code platform."
    });
  };

  const testConnection = () => {
    setConnectionStatus('testing');
    
    // Simulate API test
    setTimeout(() => {
      if (apiConfig.apiKey && apiConfig.endpoint) {
        setConnectionStatus('connected');
        toast({
          title: "Connection Successful",
          description: "API connection established successfully."
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: "Connection Failed",
          description: "Please check your API configuration.",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard."
    });
  };

  const integrationMethods = [
    {
      title: 'REST API',
      description: 'Direct API integration for custom applications',
      endpoint: 'POST /api/v1/prompts/generate',
      example: `curl -X POST "${apiConfig.endpoint}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "category": "text-generation",
    "title": "Blog Post Generator",
    "userInput": "topic, keywords, audience",
    "constraints": "1000 words, SEO optimized"
  }'`
    },
    {
      title: 'JavaScript SDK',
      description: 'Easy integration for web applications',
      endpoint: 'npm install @promptpowerhouse/js-sdk',
      example: `import { PromptPowerhouse } from '@promptpowerhouse/js-sdk';

const client = new PromptPowerhouse({
  apiKey: '${apiConfig.apiKey}',
  endpoint: '${apiConfig.endpoint}'
});

const prompt = await client.generatePrompt({
  category: 'text-generation',
  title: 'Product Description',
  userInput: 'product name, features, target audience'
});`
    },
    {
      title: 'Webhook Integration',
      description: 'Real-time prompt generation notifications',
      endpoint: 'POST /api/v1/webhooks/register',
      example: `{
  "url": "https://your-app.com/webhook/prompts",
  "events": ["prompt.generated", "prompt.updated"],
  "secret": "your-webhook-secret"
}`
    }
  ];

  return (
    <div className="space-y-6">
      {/* API Configuration */}
      <Card className="bg-card border border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-card-foreground">
            <Settings className="h-5 w-5 text-primary" />
            <span>API Configuration</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Configure your API settings for no-code platform integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="endpoint">API Endpoint</Label>
              <Input
                id="endpoint"
                value={apiConfig.endpoint}
                onChange={(e) => setApiConfig({...apiConfig, endpoint: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={apiConfig.apiKey}
                onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableAuth">Enable Authentication</Label>
              <Switch
                id="enableAuth"
                checked={apiConfig.enableAuth}
                onCheckedChange={(checked) => setApiConfig({...apiConfig, enableAuth: checked})}
              />
            </div>
            <div>
              <Label htmlFor="rateLimit">Rate Limit (requests/hour)</Label>
              <Input
                id="rateLimit"
                type="number"
                value={apiConfig.rateLimit}
                onChange={(e) => setApiConfig({...apiConfig, rateLimit: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="timeout">Timeout (seconds)</Label>
              <Input
                id="timeout"
                type="number"
                value={apiConfig.timeout}
                onChange={(e) => setApiConfig({...apiConfig, timeout: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={testConnection} disabled={connectionStatus === 'testing'}>
              {connectionStatus === 'testing' ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Testing...
                </>
              ) : (
                <>
                  <Link className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            
            {connectionStatus === 'connected' && (
              <Badge className="bg-green-500/10 text-green-700 border-green-500/20 dark:bg-green-400/10 dark:text-green-300 dark:border-green-400/20">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
            
            {connectionStatus === 'error' && (
              <Badge className="bg-red-500/10 text-red-700 border-red-500/20 dark:bg-red-400/10 dark:text-red-300 dark:border-red-400/20">
                <AlertCircle className="h-3 w-3 mr-1" />
                Error
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Widget Generator */}
      <Card className="bg-card border border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-card-foreground">
            <Zap className="h-5 w-5 text-primary" />
            <span>No-Code Widget Generator</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Generate embed code for your no-code platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={generateWidgetCode} className="w-full md:w-auto">
            <Zap className="h-4 w-4 mr-2" />
            Generate Widget Code
          </Button>

          {widgetCode && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Embed Code</Label>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(widgetCode)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="bg-muted rounded-lg p-4 border border-border">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
                  {widgetCode}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {integrationMethods.map((method, index) => (
          <Card key={index} className="bg-card border border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground">{method.title}</CardTitle>
              <CardDescription className="text-muted-foreground">{method.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Endpoint/Install</Label>
                <code className="block text-sm bg-muted text-muted-foreground p-2 rounded mt-1 break-all">
                  {method.endpoint}
                </code>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Example</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(method.example)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="bg-muted rounded-lg p-3 border border-border">
                  <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                    {method.example}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Instructions */}
      <Card className="bg-card border border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-card-foreground">Integration Guide</CardTitle>
          <CardDescription className="text-muted-foreground">
            Step-by-step instructions for integrating with popular no-code platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-card-foreground">Lovable Integration</h4>
              <ol className="text-sm space-y-1 text-muted-foreground">
                <li>1. Copy the generated widget code</li>
                <li>2. Add it to your Lovable project's index.html</li>
                <li>3. Configure the widget settings</li>
                <li>4. Test the prompt generation functionality</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-card-foreground">Webflow Integration</h4>
              <ol className="text-sm space-y-1 text-muted-foreground">
                <li>1. Add an HTML embed element</li>
                <li>2. Paste the widget code</li>
                <li>3. Style the widget container</li>
                <li>4. Publish and test</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-card-foreground">Bubble Integration</h4>
              <ol className="text-sm space-y-1 text-muted-foreground">
                <li>1. Use the API Connector plugin</li>
                <li>2. Configure the REST API endpoints</li>
                <li>3. Set up data types and workflows</li>
                <li>4. Connect to UI elements</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-card-foreground">Zapier Integration</h4>
              <ol className="text-sm space-y-1 text-muted-foreground">
                <li>1. Set up webhook triggers</li>
                <li>2. Configure prompt generation actions</li>
                <li>3. Map input/output data</li>
                <li>4. Test automation workflows</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationPanel;
