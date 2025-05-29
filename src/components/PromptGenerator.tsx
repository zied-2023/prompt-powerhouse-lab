
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Zap, Copy, Download, AlertCircle, CheckCircle } from "lucide-react";

const PromptGenerator = () => {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    userInput: '',
    context: '',
    constraints: '',
    outputFormat: ''
  });
  
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const categories = [
    { value: 'text-generation', label: 'Text Generation' },
    { value: 'image-creation', label: 'Image Creation' },
    { value: 'interactive-dialogue', label: 'Interactive Dialogue' },
    { value: 'code-generation', label: 'Code Generation' },
    { value: 'data-analysis', label: 'Data Analysis' },
    { value: 'creative-writing', label: 'Creative Writing' }
  ];

  const outputFormats = [
    { value: 'structured', label: 'Structured Response' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'bullet-points', label: 'Bullet Points' },
    { value: 'step-by-step', label: 'Step by Step' },
    { value: 'json', label: 'JSON Format' }
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.userInput) errors.userInput = 'User input specification is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generatePrompt = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate prompt generation
    setTimeout(() => {
      const prompt = `
**Prompt Category**: ${formData.category.replace('-', ' ').toUpperCase()}

**Title**: ${formData.title}

**Description**: ${formData.description}

**Instructions**:
${formData.context ? `Context: ${formData.context}\n` : ''}
User Input: ${formData.userInput}
${formData.constraints ? `Constraints: ${formData.constraints}\n` : ''}
${formData.outputFormat ? `Output Format: ${formData.outputFormat}\n` : ''}

**Example Usage**:
Input: [User provides their specific ${formData.userInput.toLowerCase()}]
Output: [Generated response following the specified format and constraints]

**Validation Rules**:
- Ensure all required inputs are provided
- Validate input format matches expectations
- Check for appropriate content guidelines
- Verify output meets specified constraints
      `.trim();

      setGeneratedPrompt(prompt);
      setIsGenerating(false);
      
      toast({
        title: "Prompt Generated!",
        description: "Your automated prompt has been successfully created.",
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard.",
    });
  };

  const downloadPrompt = () => {
    const blob = new Blob([generatedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.title.replace(/\s+/g, '-').toLowerCase()}-prompt.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Prompt saved to your device.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <span>Prompt Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure your automated prompt generation settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className={validationErrors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.category && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {validationErrors.category}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="outputFormat">Output Format</Label>
              <Select value={formData.outputFormat} onValueChange={(value) => setFormData({...formData, outputFormat: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {outputFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>{format.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Prompt Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Blog Post Generator"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={validationErrors.title ? 'border-red-500' : ''}
            />
            {validationErrors.title && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {validationErrors.title}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what this prompt will accomplish..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={validationErrors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {validationErrors.description && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {validationErrors.description}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="userInput">User Input Requirements *</Label>
            <Input
              id="userInput"
              placeholder="e.g., topic, keywords, target audience"
              value={formData.userInput}
              onChange={(e) => setFormData({...formData, userInput: e.target.value})}
              className={validationErrors.userInput ? 'border-red-500' : ''}
            />
            {validationErrors.userInput && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {validationErrors.userInput}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="context">Additional Context</Label>
            <Textarea
              id="context"
              placeholder="Any additional context or background information..."
              value={formData.context}
              onChange={(e) => setFormData({...formData, context: e.target.value})}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="constraints">Constraints & Guidelines</Label>
            <Textarea
              id="constraints"
              placeholder="Any specific constraints, word limits, or guidelines..."
              value={formData.constraints}
              onChange={(e) => setFormData({...formData, constraints: e.target.value})}
              rows={2}
            />
          </div>

          <Button 
            onClick={generatePrompt} 
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                Generating...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Generate Prompt
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Prompt Display */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Generated Prompt</span>
            {generatedPrompt && (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={downloadPrompt}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardTitle>
          <CardDescription>
            Your automated prompt will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedPrompt ? (
            <div className="bg-gray-50 rounded-lg p-4 border">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {generatedPrompt}
              </pre>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Fill out the form and click "Generate Prompt" to see your automated prompt here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptGenerator;
