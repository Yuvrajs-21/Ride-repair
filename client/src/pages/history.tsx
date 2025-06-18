import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, DollarSign } from "lucide-react";
import type { ServiceHistory } from "@shared/schema";

export default function History() {
  const { data: history, isLoading } = useQuery<ServiceHistory[]>({
    queryKey: ["/api/service-history/user/1"],
  });

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-500 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Service History</h1>
        <p className="text-neutral-600">Your past roadside assistance services</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32" />
                      <div className="h-3 bg-gray-200 rounded w-24" />
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-40" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : history?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No service history</h3>
            <p className="text-neutral-600 mb-4">You haven't used our services yet</p>
            <Button>Request Service Now</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history?.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-neutral-900">{service.serviceType}</h3>
                    <p className="text-sm text-neutral-600">Service Provider</p>
                    {service.description && (
                      <p className="text-sm text-neutral-500 mt-1">{service.description}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-sm text-neutral-600">
                    <span>{formatDate(service.completedAt)}</span>
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {service.price}
                    </span>
                  </div>
                  {service.rating && renderStars(service.rating)}
                </div>

                {service.review && (
                  <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
                    <p className="text-sm text-neutral-700">"{service.review}"</p>
                  </div>
                )}

                <div className="flex space-x-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    Request Again
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Contact Provider
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {history && history.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-neutral-900 mb-3">Your Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{history.length}</p>
                <p className="text-sm text-neutral-600">Services</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  ${history.reduce((sum, h) => sum + parseFloat(h.price), 0).toFixed(0)}
                </p>
                <p className="text-sm text-neutral-600">Total Spent</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {history.filter(h => h.rating).length > 0 
                    ? (history.reduce((sum, h) => sum + (h.rating || 0), 0) / history.filter(h => h.rating).length).toFixed(1)
                    : "N/A"
                  }
                </p>
                <p className="text-sm text-neutral-600">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
