# SEO Testing Guide for LaunderetteNear.me

## Overview
This guide provides step-by-step instructions for testing all SEO implementations, including Schema.org structured data, Open Graph tags, sitemap, and robots.txt.

---

## 1. Sitemap Testing

### Accessibility Test
✅ **Status**: Verified working

**URL**: https://launderettenear.me/sitemap.xml

**What to verify**:
- Sitemap is accessible and returns valid XML
- All URL types are included:
  - Homepage (priority 1.0)
  - Cities index page (priority 0.8)
  - All 79 city pages (priority 0.9)
  - All 1,057 launderette listings (priority 0.7)
  - All 12 blog posts (priority 0.6)
  - Static pages: About, Contact, Privacy, Terms, Laundry Symbols (priority 0.5)

**Expected structure**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://launderettenear.me/</loc>
    <lastmod>2025-11-03T...</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ...
</urlset>
```

**Testing tools**:
- [Google Search Console Sitemap Tester](https://search.google.com/search-console)
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

---

## 2. Robots.txt Testing

### Accessibility Test
✅ **Status**: Verified working

**URL**: https://launderettenear.me/robots.txt

**What to verify**:
- File is accessible
- Sitemap reference is correct
- Admin section is disallowed
- All public content is allowed

**Expected content**:
```
User-agent: *
Allow: /
Sitemap: https://launderettenear.me/sitemap.xml
Crawl-delay: 1
Disallow: /admin
```

**Testing tools**:
- [Google Robots.txt Tester](https://www.google.com/webmasters/tools/robots-testing-tool)

---

## 3. Schema.org Structured Data Testing

### 3.1 Homepage Schema

**Schemas to test**:
1. **Organization Schema** - Brand identity
2. **WebSite Schema** - Sitelinks search box
3. **ItemList Schema** - Featured launderettes

**Test URL**: https://launderettenear.me/

**How to test**:
1. Visit homepage
2. View page source (Ctrl+U or Cmd+Option+U)
3. Search for `application/ld+json`
4. Copy each JSON-LD script content
5. Test with [Google Rich Results Test](https://search.google.com/test/rich-results)

**Expected Organization Schema properties**:
- @type: Organization
- name: LaunderetteNear.me
- url, logo, description
- areaServed: United Kingdom
- knowsAbout: Launderettes, Laundry Services, etc.

**Expected WebSite Schema properties**:
- @type: WebSite
- name: LaunderetteNear.me
- potentialAction: SearchAction with urlTemplate
- inLanguage: en-GB
- audience: UK geographic area

**Expected ItemList Schema properties**:
- @type: ItemList
- numberOfItems: up to 100 featured launderettes
- itemListElement: Array of ListItem with Laundromat objects

---

### 3.2 Launderette Detail Page Schema

**Schema to test**: LocalBusiness (Laundromat)

**Test URLs** (examples):
- https://launderettenear.me/launderette/[any-id]

**How to test**:
1. Visit any launderette detail page
2. View page source
3. Find the `application/ld+json` script with @type: "Laundromat"
4. Copy JSON content
5. Test with [Google Rich Results Test](https://search.google.com/test/rich-results)

**Expected Laundromat Schema properties**:
- @type: Laundromat
- name, description, image
- address: PostalAddress with streetAddress, addressLocality, addressCountry (GB)
- geo: GeoCoordinates with latitude and longitude
- telephone, email, url
- priceRange (e.g., "££")
- openingHoursSpecification: Array with dayOfWeek, opens, closes (24-hour format)
- aggregateRating: AggregateRating with ratingValue, reviewCount (if reviews exist)
- amenityFeature: Array of LocationFeatureSpecification for features

**Critical checks**:
- Opening hours are in 24-hour format (HH:MM)
- Address has proper GB country code
- Geo coordinates are valid UK coordinates
- Aggregate rating only appears if reviews exist

---

### 3.3 City Page Schema

**Schema to test**: FAQPage

**Test URLs** (examples):
- https://launderettenear.me/city/London
- https://launderettenear.me/city/Manchester

**How to test**:
1. Visit any city page
2. View page source
3. Find the `application/ld+json` script with @type: "FAQPage"
4. Test with [Google Rich Results Test](https://search.google.com/test/rich-results)

**Expected FAQPage Schema properties**:
- @type: FAQPage
- mainEntity: Array of Question objects
- Each Question has:
  - @type: Question
  - name: The question text
  - acceptedAnswer: Answer object with text

---

### 3.4 Blog Post Schema

**Schema to test**: Article

**Test URLs** (examples):
- https://launderettenear.me/blog/how-to-use-a-laundrette
- https://launderettenear.me/blog/complete-guide-to-washing-symbols

**How to test**:
1. Visit any blog post
2. View page source
3. Find the `application/ld+json` script with @type: "Article"
4. Test with [Google Rich Results Test](https://search.google.com/test/rich-results)

**Expected Article Schema properties**:
- @type: Article
- headline, description, image
- author: Organization (LaunderetteNear.me)
- publisher: Organization with logo
- datePublished, dateModified
- articleBody: Full article text

---

## 4. Open Graph & Twitter Card Testing

### 4.1 Manual Testing

**Current Limitation**: Open Graph tags are set client-side via JavaScript, so they may not be visible in initial HTML source.

**How to test**:
1. Visit any page
2. Open browser DevTools (F12)
3. Go to Elements/Inspector tab
4. Find `<head>` section
5. Look for meta tags with `property="og:*"` and `name="twitter:*"`

**Expected tags on all pages**:
```html
<!-- Open Graph -->
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:url" content="https://launderettenear.me/..." />
<meta property="og:image" content="..." />
<meta property="og:type" content="website|article|business.business" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
```

**Article-specific tags on blog posts**:
```html
<meta property="article:published_time" content="2025-..." />
<meta property="article:modified_time" content="2025-..." />
<meta property="article:author" content="LaunderetteNear.me" />
```

**City pages** should use AI-generated landmark images as og:image.

---

### 4.2 Social Media Preview Testing

**Tools**:
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) - Note: May not work with CSR
- [Twitter Card Validator](https://cards-dev.twitter.com/validator) - Note: May not work with CSR
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) - Note: May not work with CSR

**⚠️ Known Issue**: Current implementation uses client-side rendering. Social media crawlers may not execute JavaScript and therefore may not see the dynamic Open Graph tags. This will be resolved in Phase 2 with Next.js SSR/SSG migration.

**Workaround for testing**: 
1. Use browser DevTools to verify tags are present after page load
2. Plan for Next.js migration (Phase 2) for proper SSR support

---

## 5. Google Rich Results Test

### Testing Process

**Tool**: [Google Rich Results Test](https://search.google.com/test/rich-results)

**Pages to test**:

1. **Homepage**: https://launderettenear.me/
   - Expected: Organization, WebSite, ItemList schemas

2. **City Page**: https://launderettenear.me/city/London
   - Expected: FAQPage schema

3. **Launderette Detail**: https://launderettenear.me/launderette/[any-id]
   - Expected: Laundromat (LocalBusiness) schema
   - With reviews: AggregateRating should appear

4. **Blog Post**: https://launderettenear.me/blog/how-to-use-a-laundrette
   - Expected: Article schema

**What to check**:
- ✅ "Valid schema" or "Valid rich result" message
- ✅ No errors or critical warnings
- ⚠️ Minor warnings are okay (e.g., "recommended field missing")
- ❌ Any "Invalid" or error messages need fixing

**Common issues to watch for**:
- Invalid date formats
- Missing required fields
- Incorrect @type values
- Invalid geo coordinates
- Opening hours not in proper format

---

## 6. Google Search Console Setup

### Submitting Sitemap

**Steps**:
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: launderettenear.me
3. Verify ownership (DNS or HTML file)
4. Navigate to Sitemaps section
5. Submit sitemap URL: `https://launderettenear.me/sitemap.xml`
6. Monitor indexing status

**Expected results** (after 1-2 weeks):
- All pages discovered
- Most pages indexed (check Coverage report)
- Rich results appearing in search

---

## 7. Bing Webmaster Tools Setup

**Steps**:
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add site: launderettenear.me
3. Verify ownership
4. Submit sitemap: `https://launderettenear.me/sitemap.xml`
5. Monitor indexing status

---

## 8. Testing Checklist

### Pre-Launch Checks
- [ ] Sitemap accessible at /sitemap.xml
- [ ] Robots.txt accessible and correct
- [ ] Homepage Organization schema valid
- [ ] Homepage WebSite schema valid (with SearchAction)
- [ ] Homepage ItemList schema valid
- [ ] Launderette detail page Laundromat schema valid
- [ ] City page FAQPage schema valid
- [ ] Blog post Article schema valid
- [ ] Open Graph tags present on all pages (via DevTools)
- [ ] Twitter Card tags present on all pages
- [ ] Article-specific OG tags only on blog posts
- [ ] City pages use correct landmark images for og:image

### Post-Launch Monitoring
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Monitor indexing progress
- [ ] Check for rich results in search
- [ ] Monitor for any Schema.org errors in Search Console
- [ ] Track organic search traffic

---

## 9. Phase 2 Improvements (Next.js SSR/SSG)

**Current limitations to address**:
1. Open Graph tags are client-side rendered (crawlers may miss them)
2. No server-side rendering for initial HTML
3. Social media previews may not work

**Next.js migration will provide**:
- Server-side rendering (SSR) for dynamic pages
- Static site generation (SSG) for city pages and listings
- Proper meta tags in initial HTML
- Better crawler support
- Improved social media sharing

---

## 10. Resources

**Testing Tools**:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

**Documentation**:
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

**Phase 2 Planning**:
- See `docs/nextjs-migration-plan.md` for detailed Next.js migration strategy
