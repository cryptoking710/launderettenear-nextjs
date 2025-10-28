import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { auth } from "@/lib/firebase";
import { apiRequest } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Launderette } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, Zap, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function AdminListings() {
  const [user, loading] = useAuthState(auth);
  const [, setLocation] = useLocation();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: launderettes = [] } = useQuery<Launderette[]>({
    queryKey: ["/api/launderettes"],
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/launderettes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/launderettes"] });
      toast({
        title: "Listing deleted",
        description: "The launderette listing has been removed",
      });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message || "Could not delete the listing",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/admin/login");
    }
  }, [user, loading, setLocation]);

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const sortedLaunderettes = [...launderettes].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-heading mb-2">
            Manage Listings
          </h1>
          <p className="text-muted-foreground">
            Add, edit, or remove launderette listings
          </p>
        </div>
        
        <Button
          onClick={() => setLocation("/admin/listings/new")}
          size="default"
          data-testid="button-add-listing"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Listing
        </Button>
      </div>

      {sortedLaunderettes.length === 0 ? (
        <Card className="p-12">
          <div className="text-center" data-testid="empty-state">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No listings yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by adding your first launderette listing
            </p>
            <Button
              onClick={() => setLocation("/admin/listings/new")}
              data-testid="button-add-first-listing"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Listing
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sortedLaunderettes.map((listing) => (
            <Card key={listing.id} className="p-6" data-testid={`card-listing-${listing.id}`}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                    <span className="truncate">{listing.name}</span>
                    {listing.isPremium && (
                      <Zap className="w-5 h-5 text-primary fill-primary flex-shrink-0" />
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {listing.address}
                  </p>
                  {listing.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {listing.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setLocation(`/admin/listings/edit/${listing.id}`)}
                    data-testid={`button-edit-${listing.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeleteId(listing.id)}
                    data-testid={`button-delete-${listing.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The listing will be permanently removed from the directory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
