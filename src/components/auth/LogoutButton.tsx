import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LogoutButton = () => {
  const { toast } = useToast();

  const handleLogout = () => {
    // Logique de déconnexion ici
    toast({
      title: "Déconnecté",
      description: "Vous avez été déconnecté avec succès",
      variant: "default"
    });
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleLogout}
      className="flex items-center space-x-2"
    >
      <LogOut className="h-4 w-4" />
      <span>Se déconnecter</span>
    </Button>
  );
};