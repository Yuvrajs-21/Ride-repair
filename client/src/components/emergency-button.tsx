import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function EmergencyButton() {
  const [, setLocation] = useLocation();

  const handleEmergencyRequest = () => {
    setLocation("/request-service?priority=emergency");
  };

  return (
    <Button
      onClick={handleEmergencyRequest}
      className="bg-white text-secondary font-bold py-4 px-8 rounded-full text-xl shadow-emergency hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full"
    >
      <AlertCircle className="h-6 w-6 mr-3" />
      Request Service Now
    </Button>
  );
}
