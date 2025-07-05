
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";

interface FormData {
  category: string;
  subcategory: string;
  description: string;
  objective: string;
  targetAudience: string;
  format: string;
  tone: string;
  length: string;
}

interface PromptFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  categories: any[];
  subcategories: any;
  outputFormats: any[];
  toneOptions: any[];
  lengthOptions: any[];
}

const PromptForm: React.FC<PromptFormProps> = ({
  formData,
  setFormData,
  categories,
  subcategories,
  outputFormats,
  toneOptions,
  lengthOptions
}) => {
  const { t } = useTranslation();

  const getSubcategories = (categoryValue: string) => {
    return subcategories[categoryValue as keyof typeof subcategories] || [];
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
      subcategory: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Catégorie principale */}
      <div className="space-y-3">
        <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
          {t('mainCategory')} {t('required')}
        </Label>
        <Select value={formData.category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
            <SelectValue placeholder={t('selectDomain')} />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-xl z-50 max-h-80">
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value} className="font-medium py-3 px-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex flex-col">
                  <div className="font-semibold text-gray-800">{cat.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{cat.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sous-catégorie */}
      {formData.category && getSubcategories(formData.category).length > 0 && (
        <div className="space-y-3">
          <Label htmlFor="subcategory" className="text-sm font-semibold text-gray-700">
            {t('subcategory')} {t('optional')}
          </Label>
          <Select value={formData.subcategory} onValueChange={(value) => setFormData({...formData, subcategory: value})}>
            <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
              <SelectValue placeholder={t('chooseSpecialization')} />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-xl z-50 max-h-80">
              {getSubcategories(formData.category).map((subcat) => (
                <SelectItem key={subcat.value} value={subcat.value} className="font-medium py-2 px-4 hover:bg-gray-50 cursor-pointer">
                  <div className="text-gray-800">{subcat.label}</div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Description principale */}
      <div className="space-y-3">
        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
          {t('taskDescription')} {t('required')}
        </Label>
        <Textarea
          id="description"
          placeholder={t('taskDescriptionPlaceholder')}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="animated-border hover:shadow-lg transition-all duration-200 font-medium resize-none min-h-[100px] bg-white"
          rows={4}
        />
      </div>

      {/* Objectif */}
      <div className="space-y-3">
        <Label htmlFor="objective" className="text-sm font-semibold text-gray-700">
          {t('mainObjective')} {t('optional')}
        </Label>
        <Input
          id="objective"
          placeholder={t('mainObjectivePlaceholder')}
          value={formData.objective}
          onChange={(e) => setFormData({...formData, objective: e.target.value})}
          className="animated-border hover:shadow-lg transition-all duration-200 bg-white"
        />
      </div>

      {/* Public cible */}
      <div className="space-y-3">
        <Label htmlFor="targetAudience" className="text-sm font-semibold text-gray-700">
          {t('targetAudience')} {t('optional')}
        </Label>
        <Input
          id="targetAudience"
          placeholder={t('targetAudiencePlaceholder')}
          value={formData.targetAudience}
          onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
          className="animated-border hover:shadow-lg transition-all duration-200 bg-white"
        />
      </div>

      {/* Format de sortie */}
      <div className="space-y-3">
        <Label htmlFor="format" className="text-sm font-semibold text-gray-700">
          {t('outputFormat')} {t('optional')}
        </Label>
        <Select value={formData.format} onValueChange={(value) => setFormData({...formData, format: value})}>
          <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
            <SelectValue placeholder={t('chooseFormat')} />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-xl z-50">
            {outputFormats.map((format) => (
              <SelectItem key={format.value} value={format.value} className="font-medium py-2 px-4 hover:bg-gray-50 cursor-pointer">
                {format.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ton/Style */}
      <div className="space-y-3">
        <Label htmlFor="tone" className="text-sm font-semibold text-gray-700">
          {t('toneStyle')} {t('optional')}
        </Label>
        <Select value={formData.tone} onValueChange={(value) => setFormData({...formData, tone: value})}>
          <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
            <SelectValue placeholder={t('chooseTone')} />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-xl z-50">
            {toneOptions.map((tone) => (
              <SelectItem key={tone.value} value={tone.value} className="font-medium py-2 px-4 hover:bg-gray-50 cursor-pointer">
                {tone.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Longueur */}
      <div className="space-y-3">
        <Label htmlFor="length" className="text-sm font-semibold text-gray-700">
          {t('approximateLength')} {t('optional')}
        </Label>
        <Select value={formData.length} onValueChange={(value) => setFormData({...formData, length: value})}>
          <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
            <SelectValue placeholder={t('chooseLength')} />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-xl z-50">
            {lengthOptions.map((length) => (
              <SelectItem key={length.value} value={length.value} className="font-medium py-2 px-4 hover:bg-gray-50 cursor-pointer">
                {length.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PromptForm;
