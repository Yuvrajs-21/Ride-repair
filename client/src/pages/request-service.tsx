import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, AlertCircle, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertServiceRequestSchema } from "@shared/schema";
import { useCurrentLocation } from "@/lib/location";

const formSchema = insertServiceRequestSchema.extend({
  description: z.string().optional(),
});

export default function RequestService() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { location, loading: locationLoading, error: locationError } = useCurrentLocation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: 1, // In a real app, this would come from auth context
      serviceType: "",
      description: "",
      priority: "normal",
      userLatitude: location?.latitude.toString() || "",
      userLongitude: location?.longitude.toString() || "",
      userAddress: location?.address || "",
    },
  });

  // Update form when location is available
  useState(() => {
    if (location) {
      form.setValue("userLatitude", location.latitude.toString());
      form.setValue("userLongitude", location.longitude.toString());
      form.setValue("userAddress", location.address);
    }
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest("POST", "/api/service-requests", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Service Request Submitted",
        description: "We're connecting you with a nearby mechanic.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests"] });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Request Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const serviceTypes = [
    { value: "Battery Jump", label: "Battery Jump Start", price: "$45-65", icon: "🔋" },
    { value: "Towing", label: "Towing Service", price: "$85-120", icon: "🚛" },
    { value: "Tire Change", label: "Tire Change/Repair", price: "$55-75", icon: "⚙️" },
    { value: "Lockout", label: "Vehicle Lockout", price: "$65-85", icon: "🔑" },
    { value: "Fuel Delivery", label: "Fuel Delivery", price: "$40-60", icon: "⛽" },
    { value: "Engine Diagnostics", label: "Engine Diagnostics", price: "$75-100", icon: "🔧" },
  ];

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please enable location services to request assistance.",
        variant: "destructive",
      });
      return;
    }
    createRequestMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Request Service</h1>
        <p className="text-neutral-600">Get help from nearby mechanics</p>
      </div>

      {/* Location Status */}
      <Card className={locationError ? "border-red-200 bg-red-50" : location ? "border-green-200 bg-green-50" : ""}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <MapPin className={`h-5 w-5 ${locationError ? "text-red-600" : location ? "text-green-600" : "text-neutral-400"}`} />
            <div className="flex-1">
              {locationLoading ? (
                <p className="text-sm text-neutral-600">Getting your location...</p>
              ) : locationError ? (
                <div>
                  <p className="text-sm font-medium text-red-800">Location access denied</p>
                  <p className="text-xs text-red-600">Please enable location services for faster assistance</p>
                </div>
              ) : location ? (
                <div>
                  <p className="text-sm font-medium text-green-800">Location confirmed</p>
                  <p className="text-xs text-green-600">{location.address}</p>
                </div>
              ) : (
                <p className="text-sm text-neutral-600">Location not available</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Request Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Service Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>What do you need help with?</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceTypes.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            <div className="flex items-center space-x-3">
                              <span>{service.icon}</span>
                              <div>
                                <p>{service.label}</p>
                                <p className="text-xs text-neutral-500">{service.price}</p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Priority Level */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Level</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "normal", label: "Normal", desc: "Standard service", color: "bg-blue-100 text-blue-800" },
                        { value: "high", label: "Urgent", desc: "Within 30 min", color: "bg-yellow-100 text-yellow-800" },
                        { value: "emergency", label: "Emergency", desc: "ASAP", color: "bg-red-100 text-red-800" },
                      ].map((priority) => (
                        <button
                          key={priority.value}
                          type="button"
                          onClick={() => field.onChange(priority.value)}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            field.value === priority.value
                              ? "border-primary bg-primary/10"
                              : "border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          <Badge className={priority.color}>{priority.label}</Badge>
                          <p className="text-xs text-neutral-600 mt-1">{priority.desc}</p>
                        </button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe your situation (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Car won't start, battery seems dead, parked in mall parking lot level 2..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Manual Location (if GPS failed) */}
          {!location && (
            <Card>
              <CardHeader>
                <CardTitle>Your Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="userAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your current location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-lg gradient-emergency text-white"
            disabled={createRequestMutation.isPending || locationLoading}
          >
            {createRequestMutation.isPending ? (
              "Submitting Request..."
            ) : (
              <>
                <AlertCircle className="h-5 w-5 mr-2" />
                Request Emergency Service
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Service Information */}
      <Card>
        <CardHeader>
          <CardTitle>What to Expect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Quick Response</p>
              <p className="text-sm text-neutral-600">Average response time is 15-20 minutes</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <DollarSign className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Fair Pricing</p>
              <p className="text-sm text-neutral-600">Transparent pricing with no hidden fees</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Real-time Tracking</p>
              <p className="text-sm text-neutral-600">Track your mechanic's location in real-time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
