import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";

export interface FilterOptions {
  selectedFeatures: string[];
  priceRange: string | null;
  openNow: boolean;
}

interface FilterPanelProps {
  availableFeatures: string[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export function FilterPanel({
  availableFeatures,
  filters,
  onFilterChange,
  onClearFilters,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.selectedFeatures.includes(feature)
      ? filters.selectedFeatures.filter((f) => f !== feature)
      : [...filters.selectedFeatures, feature];
    onFilterChange({ ...filters, selectedFeatures: newFeatures });
  };

  const hasActiveFilters =
    filters.selectedFeatures.length > 0 ||
    filters.priceRange !== null ||
    filters.openNow;

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"
          data-testid="button-toggle-filters"
        >
          <Filter className="w-5 h-5" />
          <span className="font-semibold">Filters</span>
          {hasActiveFilters && (
            <Badge variant="default" className="ml-2">
              {filters.selectedFeatures.length +
                (filters.priceRange ? 1 : 0) +
                (filters.openNow ? 1 : 0)}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-clear-filters"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-6 pt-4 border-t">
          {/* Price Range Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Price Range</Label>
            <Select
              value={filters.priceRange || "all"}
              onValueChange={(value) =>
                onFilterChange({
                  ...filters,
                  priceRange: value === "all" ? null : value,
                })
              }
            >
              <SelectTrigger data-testid="select-price-range">
                <SelectValue placeholder="Any price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any price</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Open Now Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="open-now"
              checked={filters.openNow}
              onCheckedChange={(checked) =>
                onFilterChange({ ...filters, openNow: checked as boolean })
              }
              data-testid="checkbox-open-now"
            />
            <Label
              htmlFor="open-now"
              className="text-sm font-medium cursor-pointer"
            >
              Open Now
            </Label>
          </div>

          {/* Features Filter */}
          {availableFeatures.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Features & Amenities</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature}`}
                      checked={filters.selectedFeatures.includes(feature)}
                      onCheckedChange={() => toggleFeature(feature)}
                      data-testid={`checkbox-feature-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                    />
                    <Label
                      htmlFor={`feature-${feature}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
