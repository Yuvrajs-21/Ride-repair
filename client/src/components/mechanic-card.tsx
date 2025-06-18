import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Phone, User } from "lucide-react";
import type { Mechanic } from "@shared/schema";

interface MechanicCardProps {
  mechanic: Mechanic;
  showFullDetails?: boolean;
}

export default function MechanicCard({ mechanic, showFullDetails = false }: MechanicCardProps) {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    return (
      <div className="flex items-center">
        <Star className="h-4 w-4 text-yellow-500 fill-current" />
        <span className="ml-1 text-sm">{rating}</span>
      </div>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Profile Image */}
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-8 w-8 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-neutral-900 truncate">{mechanic.businessName}</h4>
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  {renderStars(mechanic.rating || "0")}
                  <span>•</span>
                  <span>{mechanic.reviewCount} reviews</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {mechanic.address}
                </p>
              </div>
              <div className="text-right ml-2">
                <Badge className={getAvailabilityColor(mechanic.availability)}>
                  {mechanic.availability.charAt(0).toUpperCase() + mechanic.availability.slice(1)}
                </Badge>
                <p className="text-sm text-neutral-600 mt-1 flex items-center justify-end">
                  <Clock className="h-3 w-3 mr-1" />
                  ~{mechanic.responseTime} min
                </p>
              </div>
            </div>

            {/* Services */}
            <div className="flex flex-wrap gap-1 mb-3">
              {mechanic.services.slice(0, showFullDetails ? undefined : 3).map((service, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {service}
                </Badge>
              ))}
              {!showFullDetails && mechanic.services.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{mechanic.services.length - 3} more
                </Badge>
              )}
            </div>

            {/* Additional Details for Full View */}
            {showFullDetails && (
              <div className="mb-3 text-sm text-neutral-600">
                <p>Price Range: {mechanic.priceRange}</p>
                {mechanic.is24x7 && (
                  <p className="text-green-600 font-medium">24/7 Available</p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                className="flex-1"
                asChild
              >
                <a href={`tel:${mechanic.phone}`}>
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </a>
              </Button>
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href={`/mechanic/${mechanic.id}`}>
                  View Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
