
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Search, Plus, Zap, Brain, Settings, Copy, Download } from "lucide-react";
import PromptGenerator from "@/components/PromptGenerator";
import PromptLibrary from "@/components/PromptLibrary";
import CategoryManager from "@/components/CategoryManager";
import IntegrationPanel from "@/components/IntegrationPanel";

const Index = () => {
  const [activeTab, setActiveTab] = useState("generator");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Prompt Powerhouse Lab
                </h1>
                <p className="text-sm text-gray-600">Automate prompt creation with no-code simplicity</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Zap className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="generator" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Generator</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Library</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Integration</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <PromptGenerator />
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <PromptLibrary />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <IntegrationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
