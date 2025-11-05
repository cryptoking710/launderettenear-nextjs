# Migration Notes

## Week 2 Status
✅ Static pages migrated (About, Contact, Privacy, Terms)
⏳ Laundry Symbols page - requires image migration
⏳ Cities page - requires data fetching setup

## TODO for Complete Migration

### Images
- Copy laundry symbol images from `attached_assets/generated_images/` to `nextjs-app/public/laundry-symbols/`
- Copy city images from `attached_assets/generated_images/` to `nextjs-app/public/city-images/`
- Update import paths to use `/laundry-symbols/filename.png` format

### Data Fetching
- Cities page needs to fetch launderette data from Firestore
- Implement SSG with revalidation for cities list

### Components Still Needed
- Additional shadcn/ui components (Input, Textarea, Badge, Separator, etc.)
- Footer component
- SEO Tags component (for metadata injection)

### API Routes
- Contact form API (/api/contact) - ✅ Created
- Additional API routes as needed

## Week 3 Preview
- City pages with SSG + ISR
- Dynamic routes for `/city/[cityName]`
- Map integration with React Leaflet
