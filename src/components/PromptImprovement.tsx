
import React from 'react';
import { usePromptImprovement } from "@/hooks/usePromptImprovement";
import ImprovementForm from "./PromptImprovement/ImprovementForm";
import ImprovementResult from "./PromptImprovement/ImprovementResult";

const PromptImprovement = () => {
  const {
    originalPrompt,
    setOriginalPrompt,
    improvementObjective,
    setImprovementObjective,
    improvedPrompt,
    improvements,
    isImproving,
    improvePromptWithAI,
    copyToClipboard
  } = usePromptImprovement();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ImprovementForm
        originalPrompt={originalPrompt}
        setOriginalPrompt={setOriginalPrompt}
        improvementObjective={improvementObjective}
        setImprovementObjective={setImprovementObjective}
        onImprove={improvePromptWithAI}
        isImproving={isImproving}
      />
      
      <ImprovementResult
        improvedPrompt={improvedPrompt}
        improvements={improvements}
        onCopy={copyToClipboard}
      />
    </div>
  );
};

export default PromptImprovement;
