import { Launderette } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface ListingCardProps {
  listing: Launderette;
  distance?: number;
}

export function ListingCard({ listing, distance }: ListingCardProps) {
  return (
    <Card 
      className={`p-6 transition-all duration-200 hover:shadow-xl ${
        listing.isPremium ? "border-2 border-primary" : ""
      }`}
      data-testid={`card-listing-${listing.id}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-1">
            <span className="truncate">{listing.name}</span>
            {listing.isPremium && (
              <Zap className="w-5 h-5 text-primary fill-primary flex-shrink-0" data-testid="icon-premium" />
            )}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {listing.address}
          </p>
        </div>
        {distance !== undefined && (
          <div className="text-right flex-shrink-0" data-testid={`text-distance-${listing.id}`}>
            <div className="text-3xl font-extrabold text-primary">
              {distance.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground -mt-1">miles</div>
          </div>
        )}
      </div>
      
      {listing.features.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {listing.features.map((feature, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="text-xs font-medium"
              data-testid={`badge-feature-${index}`}
            >
              {feature}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
