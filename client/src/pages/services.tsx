import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Filter } from "lucide-react";
import MechanicCard from "@/components/mechanic-card";
import type { Mechanic } from "@shared/schema";

export default function Services() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: mechanics, isLoading } = useQuery<Mechanic[]>({
    queryKey: ["/api/mechanics"],
  });

  const filteredMechanics = mechanics?.filter((mechanic) => {
    const matchesSearch = mechanic.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mechanic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mechanic.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === "all" || mechanic.availability === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const serviceCategories = [
    { id: "battery", name: "Battery Service", count: mechanics?.filter(m => m.services.includes("Battery")).length || 0 },
    { id: "towing", name: "Towing", count: mechanics?.filter(m => m.services.includes("Towing")).length || 0 },
    { id: "tire", name: "Tire Service", count: mechanics?.filter(m => m.services.includes("Tire Service")).length || 0 },
    { id: "lockout", name: "Lockout", count: mechanics?.filter(m => m.services.includes("Lockout")).length || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Find Services</h1>
        <p className="text-neutral-600">Connect with verified mechanics near you</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
          <Input
            placeholder="Search mechanics, services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
            className="whitespace-nowrap"
          >
            All
          </Button>
          <Button
            variant={filterStatus === "available" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("available")}
            className="whitespace-nowrap"
          >
            Available
          </Button>
          <Button
            variant={filterStatus === "busy" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("busy")}
            className="whitespace-nowrap"
          >
            Busy
          </Button>
        </div>
      </div>

      {/* Service Categories */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-neutral-900">Service Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {serviceCategories.map((category) => (
            <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <h3 className="font-medium text-neutral-900">{category.name}</h3>
                <p className="text-sm text-neutral-600">{category.count} mechanics</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mechanics List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Available Mechanics ({filteredMechanics?.length || 0})
          </h2>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Sort by Distance
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                      <div className="flex space-x-2">
                        <div className="h-6 bg-gray-200 rounded w-16" />
                        <div className="h-6 bg-gray-200 rounded w-16" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredMechanics?.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No mechanics found</h3>
              <p className="text-neutral-600">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMechanics?.map((mechanic) => (
              <MechanicCard key={mechanic.id} mechanic={mechanic} showFullDetails />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
