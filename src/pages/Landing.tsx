import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { PopularTemplates } from '@/components/dashboard/popular-templates';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { FullPageLoading } from '@/components/ui/loading-skeleton';
import { useNotifications } from '@/hooks/use-notifications';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { addNotification } = useNotifications();
  const { language, isRTL } = useLanguage();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleQuickAction = (action: string) => {
    setIsActionLoading(true);
    
    // Simulate action processing
    setTimeout(() => {
      setIsActionLoading(false);
      
      switch (action) {
        case 'create-prompt':
          addNotification({
            title: language === 'ar' ? 'منشئ المطالبات' : language === 'fr' ? 'Créateur de Prompts' : 'Prompt Creator',
            message: language === 'ar' ? 'فتح أداة إنشاء المطالبات...' : language === 'fr' ? 'Ouverture de l\'outil de création...' : 'Opening prompt creation tool...',
            type: 'info',
          });
          break;
        case 'import-template':
          addNotification({
            title: language === 'ar' ? 'استيراد القالب' : language === 'fr' ? 'Import de Modèle' : 'Template Import',
            message: language === 'ar' ? 'فتح مكتبة القوالب...' : language === 'fr' ? 'Ouverture de la bibliothèque...' : 'Opening template library...',
            type: 'info',
          });
          break;
        case 'share-collection':
          addNotification({
            title: language === 'ar' ? 'مشاركة المجموعة' : language === 'fr' ? 'Partage de Collection' : 'Share Collection',
            message: language === 'ar' ? 'فتح خيارات المشاركة...' : language === 'fr' ? 'Ouverture des options de partage...' : 'Opening sharing options...',
            type: 'info',
          });
          break;
      }
    }, 1500);
  };

  const handleFloatingAction = () => {
    handleQuickAction('create-prompt');
  };

  if (loading) {
    return <FullPageLoading isVisible={true} />;
  }

  if (!user) {
    return null; // This will be handled by the auth routing in App.tsx
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Sidebar />
      <TopBar />
      
      <main className={`${isRTL ? 'mr-64' : 'ml-64'} mt-16 p-6 transition-all duration-300`}>
        <StatsCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <AnalyticsChart />
          <RecentActivity />
        </div>
        
        <PopularTemplates />
        <QuickActions onAction={handleQuickAction} />
      </main>

      <FloatingActionButton 
        onClick={handleFloatingAction}
        disabled={isActionLoading}
        className={`${isRTL ? 'left-6' : 'right-6'} transition-all duration-300`}
      />
      
      <FullPageLoading 
        isVisible={isActionLoading}
        onClose={() => setIsActionLoading(false)}
      />
    </div>
  );
}
