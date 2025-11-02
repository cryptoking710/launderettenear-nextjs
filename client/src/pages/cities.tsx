import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Launderette } from "@shared/schema";
import { MapPin, Search, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { useState, useMemo, useEffect } from "react";

// UK regions for grouping
const REGIONS = {
  "Greater London": ["London", "Croydon", "Sutton", "Bromley", "Wembley", "Twickenham", "Wimbledon", "Greenwich", "Woolwich", "Catford"],
  "South East England": ["Brighton", "Oxford", "Reading", "Portsmouth", "Southampton", "Canterbury", "Maidstone", "Hastings", "Guildford", "Slough", "Basingstoke", "Crawley", "Eastbourne", "Chatham", "Ashford", "Worthing", "Gillingham"],
  "South West England": ["Bristol", "Plymouth", "Exeter", "Bournemouth", "Swindon", "Gloucester", "Cheltenham", "Taunton", "Bath", "Torquay"],
  "East of England": ["Luton", "Cambridge", "Norwich", "Ipswich", "Peterborough", "Colchester", "Southend-on-Sea", "Chelmsford", "Watford", "Stevenage", "King's Lynn", "Great Yarmouth", "Lowestoft", "Wisbech"],
  "East Midlands": ["Leicester", "Nottingham", "Derby", "Northampton", "Lincoln", "Kettering", "Corby"],
  "West Midlands": ["Birmingham", "Coventry", "Wolverhampton", "Worcester", "Stoke-on-Trent"],
  "Yorkshire and the Humber": ["Leeds", "Sheffield", "Bradford", "Hull", "York", "Doncaster", "Rotherham", "Barnsley", "Huddersfield", "Wakefield", "Halifax"],
  "North West England": ["Manchester", "Liverpool", "Preston", "Blackpool", "Bolton", "Warrington", "Oldham", "Rochdale", "Blackburn", "Burnley", "Stockport", "Wigan", "St Helens", "Salford", "Chester"],
  "North East England": ["Newcastle upon Tyne", "Sunderland", "Durham", "Middlesbrough", "Hartlepool", "Darlington"],
  "Scotland": ["Glasgow", "Edinburgh", "Aberdeen", "Dundee", "Inverness", "Perth", "Stirling", "Ayr", "Paisley", "Dumfries", "Kilmarnock", "Dunfermline", "Greenock", "Falkirk", "Kirkcaldy", "Motherwell", "Hamilton", "Livingston"],
  "Wales": ["Cardiff", "Swansea", "Newport", "Wrexham", "Barry", "Caerphilly", "Neath", "Port Talbot", "Bridgend", "Llanelli", "Merthyr Tydfil", "Rhondda"],
  "Northern Ireland": ["Belfast", "Londonderry", "Lisburn", "Newry", "Bangor", "Armagh"],
  "Cumbria": ["Carlisle", "Barrow-in-Furness"]
};

export default function Cities() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all launderettes
  const { data: launderettes = [], isLoading } = useQuery<Launderette[]>({
    queryKey: ["/api/launderettes"],
  });

  // Calculate city stats
  const cityStats = useMemo(() => {
    const stats = new Map<string, number>();
    launderettes.forEach(l => {
      if (l.city) {
        stats.set(l.city, (stats.get(l.city) || 0) + 1);
      }
    });
    return stats;
  }, [launderettes]);

  // Get all cities sorted alphabetically
  const allCities = useMemo(() => {
    return Array.from(cityStats.keys()).sort();
  }, [cityStats]);

  // Filter cities by search term
  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) return allCities;
    const term = searchTerm.toLowerCase();
    return allCities.filter(city => 
      city.toLowerCase().includes(term)
    );
  }, [allCities, searchTerm]);

  // Group cities by region
  const citiesByRegion = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    
    Object.entries(REGIONS).forEach(([region, cities]) => {
      const matchingCities = filteredCities.filter(city => 
        cities.some(regionCity => 
          regionCity.toLowerCase() === city.toLowerCase()
        )
      );
      if (matchingCities.length > 0) {
        grouped[region] = matchingCities;
      }
    });

    // Handle cities not in any region
    const uncategorized = filteredCities.filter(city =>
      !Object.values(REGIONS).flat().some(regionCity =>
        regionCity.toLowerCase() === city.toLowerCase()
      )
    );
    
    if (uncategorized.length > 0) {
      grouped["Other Cities"] = uncategorized;
    }

    return grouped;
  }, [filteredCities]);

  // Update page title for SEO
  useEffect(() => {
    document.title = "Browse UK Cities | LaunderetteNear.me - 104 Cities";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        `Browse launderettes in 104 UK cities. Find local laundromats in England, Scotland, Wales and Northern Ireland with prices, reviews and opening hours.`
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative min-h-[300px] bg-primary">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary"></div>
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center py-16">
          <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary-foreground mb-4 font-heading">
              Browse Launderettes by City
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-6 font-medium">
              {allCities.length} UK Cities • {launderettes.length} Launderettes
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <MapPin className="w-6 h-6" />
                <span className="text-xl font-bold font-heading">LaunderetteNear.me</span>
              </div>
            </Link>
            <Link href="/">
              <Button 
                variant="outline"
                size="sm"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20 text-primary-foreground"
                data-testid="button-home"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for a city..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-cities"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-muted-foreground mt-2">
              Found {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredCities.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No cities found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(citiesByRegion).map(([region, cities]) => (
              <div key={region}>
                <h2 className="text-2xl font-bold text-foreground mb-6 font-heading flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  {region}
                  <Badge variant="secondary" className="ml-2">
                    {cities.length} {cities.length === 1 ? 'city' : 'cities'}
                  </Badge>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cities.map(city => (
                    <Link key={city} href={`/city/${encodeURIComponent(city)}`}>
                      <Card className="hover-elevate active-elevate-2 cursor-pointer h-full" data-testid={`card-city-${city}`}>
                        <CardContent className="p-6">
                          <h3 className="font-bold text-lg text-foreground mb-2 font-heading">
                            {city}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{cityStats.get(city)} launderette{cityStats.get(city) === 1 ? '' : 's'}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
