
import { apiConfigManager } from './apiConfig';

export const generatePromptWithAI = async (formData: any, categories: any[], outputFormats: any[], toneOptions: any[], lengthOptions: any[]) => {
  try {
    console.log('Génération de prompt via API...');
    
    const config = apiConfigManager.getConfig();
    
    if (!apiConfigManager.hasValidKey()) {
      throw new Error('Clé API manquante. Veuillez configurer votre clé API OpenRouter.');
    }
    
    const categoryLabel = categories.find(cat => cat.value === formData.category)?.label || formData.category;
    const subcategoryLabel = formData.subcategory ? 
      getSubcategoriesForCategory(formData.category).find(sub => sub.value === formData.subcategory)?.label : '';

    const systemPrompt = `Tu es un expert en création de prompts pour l'intelligence artificielle. Crée un prompt détaillé et structuré.

Format requis:
**RÔLE**: [rôle expert spécialisé]
**MISSION**: [mission précise et claire]
**OBJECTIFS**: [objectifs détaillés et mesurables]
**MÉTHODOLOGIE**: [approche structurée]
**CONTRAINTES**: [contraintes techniques et contextuelles]
**LIVRABLES**: [résultats attendus avec format spécifique]
**STYLE**: [ton et style de communication]`;

    let userPrompt = `Crée un prompt expert pour:
- Domaine: ${categoryLabel}
${subcategoryLabel ? `- Spécialisation: ${subcategoryLabel}` : ''}
- Description: ${formData.description}`;

    if (formData.objective) userPrompt += `\n- Objectif: ${formData.objective}`;
    if (formData.targetAudience) userPrompt += `\n- Public cible: ${formData.targetAudience}`;
    if (formData.format) userPrompt += `\n- Format souhaité: ${outputFormats.find(f => f.value === formData.format)?.label}`;
    if (formData.tone) userPrompt += `\n- Ton: ${toneOptions.find(t => t.value === formData.tone)?.label}`;
    if (formData.length) userPrompt += `\n- Longueur: ${lengthOptions.find(l => l.value === formData.length)?.label}`;

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Prompt Generator Lab'
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 402) {
        throw new Error('La clé API n\'a plus de crédits disponibles. Veuillez recharger votre compte OpenRouter ou utiliser une autre clé API.');
      }
      
      throw new Error(`Erreur API: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('Réponse API reçue:', data);

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Format de réponse API inattendu');
    }
  } catch (error) {
    console.error('Erreur lors de la génération du prompt:', error);
    throw error;
  }
};

// Helper function to get subcategories
const getSubcategoriesForCategory = (categoryValue: string) => {
  const subcategories = {
    'content-creation': [
      { value: 'writing', label: 'Rédaction' },
      { value: 'artistic-creation', label: 'Création artistique' },
      { value: 'video-audio', label: 'Vidéo & Audio' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'literature', label: 'Littérature' }
    ],
    'business-professional': [
      { value: 'strategy', label: 'Stratégie' },
      { value: 'communication', label: 'Communication' },
      { value: 'hr', label: 'Ressources Humaines' },
      { value: 'sales', label: 'Ventes' },
      { value: 'management', label: 'Management' }
    ],
    'education-training': [
      { value: 'courses', label: 'Cours' },
      { value: 'evaluation', label: 'Évaluation' },
      { value: 'research', label: 'Recherche' },
      { value: 'pedagogy', label: 'Pédagogie' },
      { value: 'professional-training', label: 'Formation professionnelle' }
    ],
    'technology-development': [
      { value: 'programming', label: 'Programmation' },
      { value: 'data-science', label: 'Science des données' },
      { value: 'cybersecurity', label: 'Cybersécurité' },
      { value: 'architecture', label: 'Architecture' },
      { value: 'devops', label: 'DevOps' }
    ],
    'analysis-research': [
      { value: 'data-analysis', label: 'Analyse de données' },
      { value: 'academic-research', label: 'Recherche académique' },
      { value: 'competitive-intelligence', label: 'Veille concurrentielle' },
      { value: 'audit-evaluation', label: 'Audit et évaluation' },
      { value: 'forecasting', label: 'Prévisions' }
    ],
    'problem-solving': [
      { value: 'diagnosis', label: 'Diagnostic' },
      { value: 'brainstorming', label: 'Brainstorming' },
      { value: 'decision-making', label: 'Prise de décision' },
      { value: 'optimization', label: 'Optimisation' },
      { value: 'innovation', label: 'Innovation' }
    ],
    'communication-relations': [
      { value: 'customer-relations', label: 'Relations client' },
      { value: 'internal-communication', label: 'Communication interne' },
      { value: 'negotiation', label: 'Négociation' },
      { value: 'presentation', label: 'Présentation' },
      { value: 'public-relations', label: 'Relations publiques' }
    ]
  };
  
  return subcategories[categoryValue as keyof typeof subcategories] || [];
};
