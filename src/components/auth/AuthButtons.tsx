import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogoutButton } from "./LogoutButton";

export const AuthButtons = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    return <LogoutButton />;
  }

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => navigate('/auth')}
      >
        Se connecter
      </Button>
      <Button 
        size="sm"
        className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white"
        onClick={() => navigate('/auth')}
      >
        S'inscrire
      </Button>
    </div>
  );
};