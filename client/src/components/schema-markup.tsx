import { Launderette } from "@shared/schema";
import { useEffect } from "react";

interface SchemaMarkupProps {
  launderette: Launderette;
  averageRating?: number;
  reviewCount?: number;
}

// Convert 12-hour time format to 24-hour format for Schema.org
function convertTo24Hour(time12h: string): string {
  const trimmed = time12h.trim();
  const match = trimmed.match(/(\d+):(\d+)\s*(am|pm)/i);
  
  if (!match) return trimmed;
  
  let [, hours, minutes, period] = match;
  let hour = parseInt(hours);
  
  if (period.toLowerCase() === 'pm' && hour !== 12) {
    hour += 12;
  } else if (period.toLowerCase() === 'am' && hour === 12) {
    hour = 0;
  }
  
  return `${hour.toString().padStart(2, '0')}:${minutes}`;
}

export function SchemaMarkup({ launderette, averageRating, reviewCount }: SchemaMarkupProps) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Laundromat",
      name: launderette.name,
      description: launderette.description || `Launderette in ${launderette.city} offering professional laundry services`,
      image: launderette.photoUrls?.[0],
      address: {
        "@type": "PostalAddress",
        streetAddress: launderette.address.split(',')[0],
        addressLocality: launderette.city,
        addressCountry: "GB"
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: launderette.lat,
        longitude: launderette.lng
      },
      telephone: launderette.phone,
      email: launderette.email,
      url: launderette.website || `https://launderettenear.me/launderette/${launderette.id}`,
      priceRange: launderette.priceRange,
      openingHoursSpecification: launderette.openingHours ? Object.entries(launderette.openingHours).map(([day, hours]) => {
        if (hours.toLowerCase() === 'closed') return null;
        
        const parts = hours.split('-');
        if (parts.length !== 2) return null;
        
        return {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
          opens: convertTo24Hour(parts[0]),
          closes: convertTo24Hour(parts[1])
        };
      }).filter(spec => spec !== null) : undefined,
      aggregateRating: averageRating && reviewCount ? {
        "@type": "AggregateRating",
        ratingValue: averageRating.toFixed(1),
        reviewCount: reviewCount,
        bestRating: "5",
        worstRating: "1"
      } : undefined,
      amenityFeature: launderette.features?.map(feature => ({
        "@type": "LocationFeatureSpecification",
        name: feature,
        value: true
      }))
    };

    const scriptId = `schema-${launderette.id}`;
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    
    scriptTag.textContent = JSON.stringify(schema);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [launderette, averageRating, reviewCount]);

  return null;
}

interface WebsiteSchemaProps {
  totalLaunderettes: number;
}

export function WebsiteSchema({ totalLaunderettes }: WebsiteSchemaProps) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "LaunderetteNear.me",
      alternateName: "Launderette Near Me",
      url: "https://launderettenear.me",
      description: `Find your nearest launderette in the UK. Search ${totalLaunderettes}+ launderettes across 59 UK cities with reviews, opening hours, and prices.`,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://launderettenear.me/?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      inLanguage: "en-GB",
      audience: {
        "@type": "Audience",
        geographicArea: {
          "@type": "Country",
          name: "United Kingdom"
        }
      }
    };

    const scriptId = 'website-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    
    scriptTag.textContent = JSON.stringify(schema);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [totalLaunderettes]);

  return null;
}

interface ItemListSchemaProps {
  launderettes: Launderette[];
}

export function ItemListSchema({ launderettes }: ItemListSchemaProps) {
  useEffect(() => {
    const itemsToShow = launderettes.slice(0, 100);
    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "UK Launderette Directory",
      description: "Complete directory of launderettes across the United Kingdom",
      numberOfItems: itemsToShow.length,
      itemListElement: itemsToShow.map((launderette, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Laundromat",
          "@id": `https://launderettenear.me/launderette/${launderette.id}`,
          name: launderette.name,
          description: launderette.description || `Launderette in ${launderette.city}`,
          address: {
            "@type": "PostalAddress",
            streetAddress: launderette.address.split(',')[0],
            addressLocality: launderette.city,
            addressCountry: "GB"
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: launderette.lat,
            longitude: launderette.lng
          },
          url: launderette.website || `https://launderettenear.me/launderette/${launderette.id}`,
          priceRange: launderette.priceRange
        }
      }))
    };

    const scriptId = 'itemlist-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    
    scriptTag.textContent = JSON.stringify(schema);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [launderettes]);

  return null;
}
