import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { auth } from "@/lib/firebase";
import { apiRequest } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { insertLaunderetteSchema, InsertLaunderette, Launderette } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Loader2, ArrowLeft } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function AdminListingForm() {
  const [user, loading] = useAuthState(auth);
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/listings/edit/:id");
  const { toast } = useToast();
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  const isEditMode = !!params?.id;
  const listingId = params?.id;

  const form = useForm<InsertLaunderette>({
    resolver: zodResolver(insertLaunderetteSchema),
    defaultValues: {
      name: "",
      address: "",
      lat: 0,
      lng: 0,
      features: [],
      isPremium: false,
    },
  });

  // Fetch existing listing data in edit mode
  const { data: existingListing, isLoading: isLoadingData } = useQuery<Launderette>({
    queryKey: ["/api/launderettes", listingId],
    queryFn: async () => {
      const response = await fetch(`/api/launderettes/${listingId}`);
      if (!response.ok) {
        throw new Error("Listing not found");
      }
      return response.json();
    },
    enabled: isEditMode && !!listingId && !!user,
  });

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/admin/login");
    }
  }, [user, loading, setLocation]);

  useEffect(() => {
    if (existingListing) {
      form.reset({
        name: existingListing.name,
        address: existingListing.address,
        lat: existingListing.lat,
        lng: existingListing.lng,
        features: existingListing.features || [],
        isPremium: existingListing.isPremium || false,
      });
      setFeatures(existingListing.features || []);
    }
  }, [existingListing, form]);

  const createMutation = useMutation({
    mutationFn: (data: InsertLaunderette) => 
      apiRequest<Launderette>("POST", "/api/launderettes", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/launderettes"] });
      toast({
        title: "Listing created",
        description: "New launderette listing has been added",
      });
      setLocation("/admin/listings");
    },
    onError: (error: Error) => {
      toast({
        title: "Creation failed",
        description: error.message || "Could not create the listing",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertLaunderette) => 
      apiRequest<Launderette>("PUT", `/api/launderettes/${listingId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/launderettes"] });
      toast({
        title: "Listing updated",
        description: "The launderette listing has been updated successfully",
      });
      setLocation("/admin/listings");
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Could not update the listing",
        variant: "destructive",
      });
    },
  });

  const handleGeocodeAddress = async () => {
    const address = form.getValues("address");
    if (!address.trim()) {
      toast({
        title: "Address required",
        description: "Please enter an address to geocode",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
      if (!response.ok) throw new Error("Geocoding failed");
      
      const data = await response.json();
      form.setValue("lat", data.lat);
      form.setValue("lng", data.lng);
      
      toast({
        title: "Location found",
        description: `Coordinates: ${data.lat.toFixed(6)}, ${data.lng.toFixed(6)}`,
      });
    } catch (error) {
      toast({
        title: "Geocoding failed",
        description: "Could not find coordinates for that address",
        variant: "destructive",
      });
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      const updatedFeatures = [...features, newFeature.trim()];
      setFeatures(updatedFeatures);
      form.setValue("features", updatedFeatures);
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    const updatedFeatures = features.filter(f => f !== feature);
    setFeatures(updatedFeatures);
    form.setValue("features", updatedFeatures);
  };

  const onSubmit = async (data: InsertLaunderette) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (loading || isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-8 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => setLocation("/admin/listings")}
        className="mb-6"
        data-testid="button-back"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Listings
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight font-heading mb-2">
          {isEditMode ? "Edit Listing" : "Add New Listing"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode ? "Update the launderette details" : "Add a new launderette to the directory"}
        </p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Launderette Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Wash & Go Central" 
                      {...field} 
                      data-testid="input-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="12 High Street, London, SW1A 0AA" 
                      {...field}
                      data-testid="input-address"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the complete address including postcode
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleGeocodeAddress}
                data-testid="button-geocode"
              >
                Find Coordinates
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any"
                        placeholder="51.5074" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        data-testid="input-latitude"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any"
                        placeholder="-0.1278" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        data-testid="input-longitude"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormItem>
              <FormLabel>Features</FormLabel>
              <div className="flex gap-2 mb-2">
                <Input 
                  placeholder="e.g., Free WiFi, 24/7 Access"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  data-testid="input-feature"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={addFeature}
                  data-testid="button-add-feature"
                >
                  Add
                </Button>
              </div>
              {features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, idx) => (
                    <Badge 
                      key={idx} 
                      variant="secondary"
                      className="gap-1"
                      data-testid={`badge-feature-${idx}`}
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <FormDescription>
                Add features like "Self-Service", "Drop-off", "Dry Cleaning", etc.
              </FormDescription>
            </FormItem>

            <FormField
              control={form.control}
              name="isPremium"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="checkbox-premium"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Premium Listing</FormLabel>
                    <FormDescription>
                      Premium listings appear at the top of search results with special highlighting
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isPending}
                data-testid="button-submit"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEditMode ? "Update Listing" : "Create Listing"
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/admin/listings")}
                disabled={isPending}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
