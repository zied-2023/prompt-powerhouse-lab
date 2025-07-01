import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Search, Copy, Eye, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from '@/hooks/useTranslation';

const PromptLibrary = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  const promptExamples = [
    {
      id: 1,
      category: 'text-generation',
      title: t('blogPostGenerator'),
      description: 'Generate engaging blog posts with SEO optimization',
      prompt: `**Prompt Category**: TEXT GENERATION

**Title**: Blog Post Generator

**Description**: Generate engaging blog posts with SEO optimization

**Instructions**:
Context: Create comprehensive blog posts that engage readers and rank well in search engines
User Input: topic, target keywords, audience type, word count
Constraints: Must include H2 headings, meta description, and call-to-action
Output Format: Structured Response

**Example Usage**:
Input: [User provides topic: "Sustainable Living", keywords: "eco-friendly, green lifestyle", audience: "millennials", word count: "1200"]
Output: [Generated blog post with proper structure, SEO elements, and engaging content]

**Validation Rules**:
- Ensure topic is clearly defined
- Validate keyword relevance to topic
- Check word count is reasonable (300-3000 words)
- Verify audience type is specified`,
      tags: ['SEO', 'Content', 'Marketing']
    },
    {
      id: 2,
      category: 'image-creation',
      title: t('productImagePrompt'),
      description: 'Create detailed prompts for product photography and design',
      prompt: `**Prompt Category**: IMAGE CREATION

**Title**: Product Image Prompt

**Description**: Create detailed prompts for product photography and design

**Instructions**:
Context: Generate professional product images for e-commerce and marketing
User Input: product type, style preference, background, lighting, angle
Constraints: Must specify resolution, color scheme, and brand consistency
Output Format: Structured Response

**Example Usage**:
Input: [User provides product: "wireless headphones", style: "minimalist", background: "white studio", lighting: "soft natural", angle: "3/4 view"]
Output: [Detailed image generation prompt with technical specifications]

**Validation Rules**:
- Ensure product type is clearly specified
- Validate style preferences are achievable
- Check lighting and angle combinations make sense
- Verify resolution requirements are realistic`,
      tags: ['Photography', 'E-commerce', 'Design']
    },
    {
      id: 3,
      category: 'interactive-dialogue',
      title: t('customerSupportChatbot'),
      description: 'Design conversational flows for customer service automation',
      prompt: `**Prompt Category**: INTERACTIVE DIALOGUE

**Title**: Customer Support Chatbot

**Description**: Design conversational flows for customer service automation

**Instructions**:
Context: Create helpful and empathetic customer support interactions
User Input: issue type, product category, customer sentiment, escalation triggers
Constraints: Must maintain professional tone and provide clear solutions
Output Format: Conversational

**Example Usage**:
Input: [User provides issue: "billing question", product: "subscription service", sentiment: "frustrated", escalation: "complex billing issues"]
Output: [Conversational flow with empathetic responses and solution pathways]

**Validation Rules**:
- Ensure issue type is categorized correctly
- Validate sentiment analysis is appropriate
- Check escalation triggers are clearly defined
- Verify solution pathways are logical`,
      tags: ['Customer Service', 'Automation', 'Conversation']
    },
    {
      id: 4,
      category: 'code-generation',
      title: t('reactComponentGenerator'),
      description: 'Generate React components with TypeScript and Tailwind CSS',
      prompt: `**Prompt Category**: CODE GENERATION

**Title**: React Component Generator

**Description**: Generate React components with TypeScript and Tailwind CSS

**Instructions**:
Context: Create reusable React components following best practices
User Input: component name, functionality, props interface, styling requirements
Constraints: Must use TypeScript, Tailwind CSS, and follow React best practices
Output Format: JSON Format

**Example Usage**:
Input: [User provides component: "UserCard", functionality: "display user info with avatar", props: "user object with name, email, avatar", styling: "card layout with hover effects"]
Output: [Complete React component code with TypeScript interfaces and Tailwind styling]

**Validation Rules**:
- Ensure component name follows naming conventions
- Validate functionality requirements are clear
- Check props interface is well-defined
- Verify styling requirements are achievable with Tailwind`,
      tags: ['React', 'TypeScript', 'Frontend']
    },
    {
      id: 5,
      category: 'data-analysis',
      title: t('dataInsightsGenerator'),
      description: 'Analyze datasets and generate actionable insights',
      prompt: `**Prompt Category**: DATA ANALYSIS

**Title**: Data Insights Generator

**Description**: Analyze datasets and generate actionable insights

**Instructions**:
Context: Transform raw data into meaningful business insights
User Input: dataset description, analysis goals, key metrics, target audience
Constraints: Must provide statistical significance and confidence levels
Output Format: Bullet Points

**Example Usage**:
Input: [User provides dataset: "e-commerce sales data", goals: "identify growth opportunities", metrics: "revenue, conversion rate, customer segments", audience: "executive team"]
Output: [Structured analysis with key findings, trends, and recommendations]

**Validation Rules**:
- Ensure dataset is properly described
- Validate analysis goals are measurable
- Check metrics are relevant to goals
- Verify target audience is specified`,
      tags: ['Analytics', 'Business Intelligence', 'Insights']
    },
    {
      id: 6,
      category: 'creative-writing',
      title: t('storyConceptGenerator'),
      description: 'Create compelling story concepts and character development',
      prompt: `**Prompt Category**: CREATIVE WRITING

**Title**: Story Concept Generator

**Description**: Create compelling story concepts and character development

**Instructions**:
Context: Develop engaging narratives with well-rounded characters
User Input: genre, setting, main conflict, character archetypes, themes
Constraints: Must include character motivations and story arc structure
Output Format: Step by Step

**Example Usage**:
Input: [User provides genre: "science fiction", setting: "space station", conflict: "alien first contact", characters: "reluctant leader, curious scientist", themes: "communication, understanding"]
Output: [Detailed story concept with character profiles and plot structure]

**Validation Rules**:
- Ensure genre conventions are understood
- Validate setting is well-established
- Check conflict creates meaningful tension
- Verify characters have clear motivations`,
      tags: ['Creative Writing', 'Storytelling', 'Character Development']
    }
  ];

  const categories = [
    { value: 'all', label: t('allCategories') },
    { value: 'text-generation', label: t('textGeneration') },
    { value: 'image-creation', label: t('imageCreation') },
    { value: 'interactive-dialogue', label: t('interactiveDialogue') },
    { value: 'code-generation', label: t('codeGeneration') },
    { value: 'data-analysis', label: t('dataAnalysis') },
    { value: 'creative-writing', label: t('creativeWriting') }
  ];

  const filteredPrompts = promptExamples.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: t('copied'),
      description: t('promptCopied'),
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>{t('promptTemplateLibrary')}</CardTitle>
          <CardDescription>
            {t('browsePromptTemplates')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('searchPrompts')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prompt Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((prompt) => (
          <Card key={prompt.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{prompt.title}</CardTitle>
                  <CardDescription className="mt-2">{prompt.description}</CardDescription>
                </div>
                <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700 border-purple-200">
                  {categories.find(cat => cat.value === prompt.category)?.label || prompt.category.replace('-', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPrompt(prompt)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t('preview')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyPrompt(prompt.prompt)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Prompt Preview Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[80vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedPrompt.title}</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedPrompt(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 border">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {selectedPrompt.prompt}
                </pre>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setSelectedPrompt(null)}>
                  {t('close')}
                </Button>
                <Button onClick={() => copyPrompt(selectedPrompt.prompt)}>
                  <Copy className="h-4 w-4 mr-2" />
                  {t('copyTemplate')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {filteredPrompts.length === 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">{t('noPromptsFound')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromptLibrary;
