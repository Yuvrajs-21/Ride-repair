import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { MapPin, Clock, Star, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EmergencyButton from "@/components/emergency-button";
import ServiceRequestCard from "@/components/service-request-card";
import MechanicCard from "@/components/mechanic-card";
import type { Mechanic, ServiceRequest } from "@shared/schema";

export default function Dashboard() {
  const { data: mechanics, isLoading: mechanicsLoading } = useQuery<Mechanic[]>({
    queryKey: ["/api/mechanics"],
  });

  const { data: activeRequests, isLoading: requestsLoading } = useQuery<ServiceRequest[]>({
    queryKey: ["/api/service-requests/user/1"],
  });

  const activeRequest = activeRequests?.find(r => r.status !== "completed" && r.status !== "cancelled");

  const services = [
    { id: "battery", name: "Battery Jump", icon: "🔋", price: "$45-65" },
    { id: "towing", name: "Towing", icon: "🚛", price: "$85-120" },
    { id: "tire", name: "Tire Change", icon: "⚙️", price: "$55-75" },
    { id: "lockout", name: "Lockout", icon: "🔑", price: "$65-85" },
  ];

  return (
    <div className="space-y-6">
      {/* Emergency Action */}
      <div className="gradient-emergency p-6 text-white text-center rounded-xl">
        <h2 className="text-2xl font-bold mb-2">Need Help Now?</h2>
        <p className="mb-4 text-lg">Get roadside assistance in minutes</p>
        <EmergencyButton />
      </div>

      {/* Active Request */}
      {activeRequest && (
        <ServiceRequestCard request={activeRequest} />
      )}

      {/* Quick Services */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-neutral-900">Common Services</h3>
        <div className="grid grid-cols-2 gap-3">
          {services.map((service) => (
            <Link key={service.id} href={`/request-service?type=${service.id}`}>
              <Card className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-primary">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{service.icon}</div>
                  <p className="font-medium text-neutral-900">{service.name}</p>
                  <p className="text-sm text-neutral-600">{service.price}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Nearby Mechanics */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Nearby Mechanics</h3>
          <Link href="/services">
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </Link>
        </div>
        
        {mechanicsLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {mechanics?.slice(0, 2).map((mechanic) => (
              <MechanicCard key={mechanic.id} mechanic={mechanic} />
            ))}
          </div>
        )}
      </div>

      {/* Map View */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-neutral-900">Your Location</h3>
        <Card className="h-48 bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
          <CardContent className="p-0 h-full flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-8 w-8 text-secondary mx-auto" />
              <p className="font-medium text-neutral-900">You are here</p>
              <p className="text-sm text-neutral-600">123 Main Street, Downtown</p>
              <Button size="sm" className="mt-2">
                <MapPin className="h-4 w-4 mr-2" />
                View Full Map
              </Button>
            </div>
            {/* Mock mechanic markers */}
            <div className="absolute top-6 left-8 w-3 h-3 bg-green-500 rounded-full animate-pulse-slow" />
            <div className="absolute bottom-8 right-12 w-3 h-3 bg-green-500 rounded-full animate-pulse-slow" />
            <div className="absolute top-12 right-6 w-3 h-3 bg-yellow-500 rounded-full animate-pulse-slow" />
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contacts */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-3 text-red-900">Emergency Contacts</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button className="bg-red-600 hover:bg-red-700 text-white h-auto py-3 flex-col" asChild>
              <a href="tel:911">
                <Phone className="h-5 w-5 mb-1" />
                911 Emergency
              </a>
            </Button>
            <Button className="bg-primary hover:bg-blue-700 text-white h-auto py-3 flex-col" asChild>
              <a href="tel:+1234567890">
                <Phone className="h-5 w-5 mb-1" />
                24/7 Support
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
