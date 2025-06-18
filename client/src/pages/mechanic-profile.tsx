import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Phone, MessageCircle, Star, MapPin, Clock, Shield, Award } from "lucide-react";
import type { Mechanic } from "@shared/schema";

export default function MechanicProfile() {
  const { id } = useParams<{ id: string }>();
  
  const { data: mechanic, isLoading, error } = useQuery<Mechanic>({
    queryKey: [`/api/mechanics/${id}`],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !mechanic) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Mechanic not found</h3>
            <p className="text-neutral-600 mb-4">The mechanic profile you're looking for doesn't exist.</p>
            <Link href="/services">
              <Button>Back to Services</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(numRating) ? "text-yellow-500 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-neutral-600">{rating}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/services">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-neutral-900">Mechanic Profile</h1>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {mechanic.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">{mechanic.businessName}</h2>
                  <p className="text-neutral-600">{mechanic.name}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {renderStars(mechanic.rating || "0")}
                    <span className="text-sm text-neutral-600">({mechanic.reviewCount} reviews)</span>
                  </div>
                </div>
                <Badge className={getAvailabilityColor(mechanic.availability)}>
                  {mechanic.availability.charAt(0).toUpperCase() + mechanic.availability.slice(1)}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 mt-3 text-sm text-neutral-600">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {mechanic.address}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  ~{mechanic.responseTime} min
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle>Services Offered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {mechanic.services.map((service, index) => (
              <Badge key={index} variant="outline">
                {service}
              </Badge>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-neutral-900">Price Range</p>
              <p className="text-neutral-600">{mechanic.priceRange}</p>
            </div>
            <div>
              <p className="font-medium text-neutral-900">Availability</p>
              <p className="text-neutral-600">{mechanic.is24x7 ? "24/7 Service" : "Business Hours"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button className="h-12" asChild>
          <a href={`tel:${mechanic.phone}`}>
            <Phone className="h-5 w-5 mr-2" />
            Call Now
          </a>
        </Button>
        <Button variant="outline" className="h-12">
          <MessageCircle className="h-5 w-5 mr-2" />
          Message
        </Button>
      </div>

      {/* Request Service */}
      <Link href={`/request-service?mechanicId=${mechanic.id}`}>
        <Button className="w-full h-12 text-lg gradient-emergency text-white">
          Request Service
        </Button>
      </Link>

      {/* Verification & Trust */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Verification & Trust
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-neutral-900">Identity Verified</p>
              <p className="text-sm text-neutral-600">Government ID confirmed</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Award className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-neutral-900">Licensed Professional</p>
              <p className="text-sm text-neutral-600">Valid mechanic certification</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-neutral-900">Background Checked</p>
              <p className="text-sm text-neutral-600">Clean criminal background</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-neutral-600">2 days ago</span>
              </div>
              <p className="text-sm text-neutral-700">"Excellent service! Fixed my battery issue quickly and professionally. Highly recommended!"</p>
              <p className="text-xs text-neutral-500 mt-1">- Sarah M.</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                  <Star className="h-4 w-4 text-gray-300" />
                </div>
                <span className="text-sm text-neutral-600">1 week ago</span>
              </div>
              <p className="text-sm text-neutral-700">"Good service, arrived on time. Price was fair for the tire change."</p>
              <p className="text-xs text-neutral-500 mt-1">- Mike R.</p>
            </div>
          </div>
          
          <Button variant="outline" className="w-full">
            View All Reviews
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
