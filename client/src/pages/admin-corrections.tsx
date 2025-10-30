import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { auth } from "@/lib/firebase";
import { apiRequest } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Correction } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

export default function AdminCorrections() {
  const [user, loading] = useAuthState(auth);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/admin/login");
    }
  }, [user, loading, setLocation]);

  const { data: corrections = [], isLoading: isLoadingCorrections } = useQuery<Correction[]>({
    queryKey: ["/api/corrections"],
    enabled: !!user,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest<Correction>("PUT", `/api/corrections/${id}/approve`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/corrections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/launderettes"] });
      toast({
        title: "Correction approved",
        description: "The listing has been updated with the corrected information",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Approval failed",
        description: error.message || "Could not approve the correction",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest<Correction>("PUT", `/api/corrections/${id}/reject`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/corrections"] });
      toast({
        title: "Correction rejected",
        description: "The correction has been marked as rejected",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Rejection failed",
        description: error.message || "Could not reject the correction",
        variant: "destructive",
      });
    },
  });

  if (loading || isLoadingCorrections) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const pendingCorrections = corrections.filter((c) => c.status === "pending");
  const reviewedCorrections = corrections.filter((c) => c.status !== "pending");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight font-heading mb-2">
          Corrections
        </h1>
        <p className="text-muted-foreground">
          Review and manage user-submitted corrections to launderette listings
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-yellow-500/10">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold" data-testid="stat-pending">
                {pendingCorrections.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-green-500/10">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold" data-testid="stat-approved">
                {corrections.filter((c) => c.status === "approved").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-red-500/10">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold" data-testid="stat-rejected">
                {corrections.filter((c) => c.status === "rejected").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Corrections */}
      {pendingCorrections.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Pending Review</h2>
          <div className="space-y-4">
            {pendingCorrections.map((correction) => (
              <Card key={correction.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold" data-testid={`correction-name-${correction.id}`}>
                        {correction.launderetteName}
                      </h3>
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Submitted by {correction.submitterName} ({correction.submitterEmail})
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(correction.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocation(`/launderette/${correction.launderetteId}`)}
                    data-testid={`button-view-listing-${correction.id}`}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Listing
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-semibold mb-2 text-muted-foreground">Field</p>
                    <Badge variant="secondary">{correction.fieldName}</Badge>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2 text-muted-foreground">Current Value</p>
                    <p className="text-sm" data-testid={`current-value-${correction.id}`}>
                      {correction.currentValue}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2 text-muted-foreground">Proposed Value</p>
                    <p className="text-sm font-semibold text-primary" data-testid={`proposed-value-${correction.id}`}>
                      {correction.proposedValue}
                    </p>
                  </div>
                </div>

                {correction.additionalNotes && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <p className="text-sm font-semibold mb-2 text-muted-foreground">Additional Notes</p>
                      <p className="text-sm" data-testid={`notes-${correction.id}`}>
                        {correction.additionalNotes}
                      </p>
                    </div>
                  </>
                )}

                <Separator className="my-4" />

                <div className="flex gap-3">
                  <Button
                    onClick={() => approveMutation.mutate(correction.id)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    data-testid={`button-approve-${correction.id}`}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => rejectMutation.mutate(correction.id)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    data-testid={`button-reject-${correction.id}`}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pendingCorrections.length === 0 && (
        <Card className="p-12 text-center mb-8">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
          <p className="text-muted-foreground">
            There are no pending corrections to review at the moment.
          </p>
        </Card>
      )}

      {/* Recently Reviewed */}
      {reviewedCorrections.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Recently Reviewed</h2>
          <div className="space-y-4">
            {reviewedCorrections.slice(0, 10).map((correction) => (
              <Card key={correction.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {correction.launderetteName}
                      </h3>
                      <Badge
                        variant={correction.status === "approved" ? "default" : "outline"}
                        className={
                          correction.status === "approved"
                            ? "bg-green-500/10 text-green-700 border-green-200"
                            : "bg-red-500/10 text-red-700 border-red-200"
                        }
                      >
                        {correction.status === "approved" ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {correction.status.charAt(0).toUpperCase() + correction.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {correction.fieldName}: {correction.currentValue} → {correction.proposedValue}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reviewed {correction.reviewedAt ? format(new Date(correction.reviewedAt), "MMM dd, yyyy") : "recently"}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
