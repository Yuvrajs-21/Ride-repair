import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Clock, MapPin } from "lucide-react";
import type { ServiceRequest, Mechanic } from "@shared/schema";

interface ServiceRequestCardProps {
  request: ServiceRequest;
}

export default function ServiceRequestCard({ request }: ServiceRequestCardProps) {
  const { data: mechanic } = useQuery<Mechanic>({
    queryKey: [`/api/mechanics/${request.mechanicId}`],
    enabled: !!request.mechanicId,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Finding Mechanic";
      case "assigned":
        return "Mechanic Assigned";
      case "in_progress":
        return "Service in Progress";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const formatTime = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card className="border-l-4 border-l-primary bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Service Request</h3>
          <Badge className={getStatusColor(request.status)}>
            {getStatusText(request.status)}
          </Badge>
        </div>

        <div className="space-y-3">
          <div>
            <p className="font-medium text-neutral-900">{request.serviceType}</p>
            {request.description && (
              <p className="text-sm text-neutral-600">{request.description}</p>
            )}
          </div>

          {mechanic && (
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">{mechanic.name}</p>
                <p className="text-sm text-neutral-600">
                  {mechanic.businessName} • ⭐ {mechanic.rating}
                </p>
              </div>
              <Button size="sm" asChild>
                <a href={`tel:${mechanic.phone}`}>
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </a>
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600">
            {request.estimatedArrival && (
              <div>
                <p className="font-medium">Estimated arrival:</p>
                <p className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(request.estimatedArrival)}
                </p>
              </div>
            )}
            <div>
              <p className="font-medium">Location:</p>
              <p className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {request.userAddress}
              </p>
            </div>
          </div>

          {request.estimatedPrice && (
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="font-medium">Estimated Price:</span>
              <span className="text-lg font-bold text-primary">${request.estimatedPrice}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
