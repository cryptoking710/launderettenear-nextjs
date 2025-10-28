import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Review, InsertReview } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Loader2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ReviewListProps {
  launderetteId: string;
}

interface ReviewFormProps {
  launderetteId: string;
  onSuccess?: () => void;
}

export function ReviewList({ launderetteId }: ReviewListProps) {
  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/launderettes", launderetteId, "reviews"],
    queryFn: async () => {
      const response = await fetch(`/api/launderettes/${launderetteId}/reviews`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8" data-testid="loading-reviews">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8" data-testid="text-no-reviews">
        No reviews yet. Be the first to review!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="p-4" data-testid={`card-review-${review.id}`}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-foreground" data-testid="text-reviewer-name">
                {review.userName}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                    data-testid={`icon-star-${i}`}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs text-muted-foreground" data-testid="text-review-date">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed" data-testid="text-review-comment">
            {review.comment}
          </p>
        </Card>
      ))}
    </div>
  );
}

export function ReviewForm({ launderetteId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();

  const createReviewMutation = useMutation({
    mutationFn: async (data: InsertReview) => {
      return await apiRequest<Review>("POST", "/api/reviews", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/launderettes", launderetteId, "reviews"] });
      setUserName("");
      setComment("");
      setRating(5);
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Failed to submit review",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    createReviewMutation.mutate({
      launderetteId,
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rating">Rating</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
                data-testid={`button-rating-${star}`}
              >
                <Star
                  className={`w-8 h-8 cursor-pointer transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="userName">Your Name</Label>
          <Input
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            required
            data-testid="input-reviewer-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment">Review</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            required
            data-testid="input-review-comment"
          />
        </div>

        <Button
          type="submit"
          disabled={createReviewMutation.isPending}
          className="w-full"
          data-testid="button-submit-review"
        >
          {createReviewMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </form>
    </Card>
  );
}

// Helper function to calculate average rating
export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
}

// Component to display star rating
interface StarRatingProps {
  rating: number;
  count?: number;
}

export function StarRating({ rating, count }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < fullStars
              ? "fill-primary text-primary"
              : i === fullStars && hasHalfStar
              ? "fill-primary/50 text-primary"
              : "text-muted-foreground"
          }`}
        />
      ))}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground ml-1">
          ({count} {count === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
}
