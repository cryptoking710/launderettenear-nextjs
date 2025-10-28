import { useState } from "react";
import { Search, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  onUseLocation?: () => void;
}

export function SearchBar({ onSearch, isLoading, onUseLocation }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex gap-2 bg-card rounded-2xl shadow-2xl p-2 border border-card-border">
        <div className="flex-1 flex items-center gap-2 px-2">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <Input
            type="text"
            placeholder="Enter Postcode or City (e.g., SW1A 0AA)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            disabled={isLoading}
            data-testid="input-search"
          />
        </div>
        
        <div className="flex gap-2">
          {onUseLocation && (
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={onUseLocation}
              disabled={isLoading}
              className="flex-shrink-0"
              data-testid="button-use-location"
            >
              <MapPin className="w-5 h-5" />
              <span className="hidden sm:inline ml-2">Use Location</span>
            </Button>
          )}
          
          <Button
            type="submit"
            size="default"
            disabled={isLoading || !query.trim()}
            className="flex-shrink-0"
            data-testid="button-search"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span className="hidden sm:inline ml-2">Search</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
