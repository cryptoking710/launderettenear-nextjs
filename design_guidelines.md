# LaunderetteNear.me Design Guidelines

## Design Approach
**Hybrid Reference-Based Approach**: Drawing from Airbnb's location-based search patterns and Google Maps' functional clarity, combined with Material Design principles for structured information display.

**Rationale**: As a utility-focused directory service, the design prioritizes rapid information discovery and location-based functionality while maintaining a modern, trustworthy appearance. Reference leaders like Airbnb (for search UX), Google Maps (for geolocation interfaces), and Yelp (for listing cards) provide proven patterns for location-based services.

## Core Design Principles
1. **Search-First Architecture**: The search interface is the primary entry point
2. **Distance-Driven Hierarchy**: Visual weight corresponds to proximity/relevance
3. **Scan-ability**: Users should instantly identify key information (distance, features, premium status)
4. **Trust & Clarity**: Clean, professional presentation that builds confidence in the directory
5. **Admin Separation**: Distinct visual treatment for administrative interfaces

---

## Typography System

### Font Families
- **Primary**: Inter (Google Fonts) - Clean, modern sans-serif for UI elements and body text
- **Accent**: Manrope (Google Fonts) - Geometric sans-serif for headings and emphasis

### Type Scale & Hierarchy

**Display Headings** (Brand/Hero)
- text-4xl md:text-5xl, font-extrabold, tracking-tight
- Use Manrope for brand elements

**Section Headings**
- text-2xl md:text-3xl, font-bold
- Use Manrope

**Card Titles**
- text-xl, font-bold
- Use Inter

**Body Text**
- text-base, font-normal, leading-relaxed
- Use Inter

**Metadata/Labels**
- text-sm, font-medium
- Use Inter

**Micro Copy**
- text-xs, font-normal
- Use Inter

---

## Layout System

### Tailwind Spacing Primitives
**Core Spacing Set**: 2, 4, 6, 8, 12, 16, 20, 24

**Application**:
- Component padding: p-4, p-6, p-8
- Section spacing: mt-8, mb-12, py-16, py-20
- Grid gaps: gap-4, gap-6, gap-8
- Container margins: mx-4, mx-8

### Responsive Containers
- Mobile: px-4, max-w-full
- Tablet: px-6, max-w-4xl mx-auto
- Desktop: px-8, max-w-6xl mx-auto

### Grid Systems
- Listing Grid: grid-cols-1 gap-6
- Admin Grid: grid-cols-1 md:grid-cols-2 gap-6
- Feature Tags: flex flex-wrap gap-2

---

## Component Library

### 1. Header & Navigation

**Public Header**:
- Prominent brand lockup with MapPin icon
- Sticky positioning (sticky top-0 z-50)
- Padding: py-4 px-6
- Shadow: shadow-lg
- Contains: Logo, tagline, user location indicator

**Admin Header**:
- Distinct administrative styling
- Navigation tabs for: Dashboard, Listings, Analytics
- User profile/logout controls
- Breadcrumb navigation for deep pages

### 2. Search Interface

**Hero Search Bar** (Primary):
- Full-width container with max-w-3xl mx-auto
- Prominent elevation: shadow-2xl
- Rounded: rounded-2xl
- Structure: Input field + prominent search button
- Input placeholder: "Enter Postcode or City (e.g., SW1A 0AA)"
- Geolocation trigger button (optional, integrated)
- Padding: p-2 with inner elements p-3

**Search States**:
- Default: Clean, inviting
- Focused: Enhanced shadow, subtle scale transform
- Loading: Spinner icon in button
- Results: Transition to compact header version

### 3. Listing Cards

**Standard Listing Card**:
- Structure: White background, rounded-xl, shadow-lg
- Padding: p-6
- Border: border border-gray-100
- Hover state: shadow-2xl, subtle translate-y transform

**Card Layout**:
```
┌─────────────────────────────────┐
│ Title + Icons        Distance   │
│ Address              (large)    │
│ ─────────────────────────────   │
│ [Feature] [Feature] [Feature]   │
└─────────────────────────────────┘
```

**Distance Display**:
- Positioned: top-right
- Size: text-3xl font-extrabold for number
- Unit: text-xs below number
- Visual weight: Highest emphasis

**Premium Listing Card**:
- Enhanced border: border-4 border-yellow-400
- Premium badge: Zap icon (lucide-react) with fill
- Subtle background treatment
- Priority placement in results

**Feature Tags**:
- Inline-flex, flex-wrap, gap-2
- Individual tags: px-3 py-1, text-xs font-medium, rounded-full
- Examples: "Self-Service", "Free WiFi", "24/7 Access", "Service Wash"

### 4. Map Integration (Future Phase)

**Map Container**:
- Height: h-96 md:h-[500px]
- Rounded: rounded-xl
- Shadow: shadow-xl
- Margin: my-8
- Markers for all visible listings
- Info windows on click

### 5. Admin Interface Components

**Admin Dashboard**:
- Card-based layout with stats
- Grid: grid-cols-1 md:grid-cols-3 gap-6
- Stat cards: Large numbers, descriptive labels, trend indicators

**Listing Management Table**:
- Alternating row backgrounds for scan-ability
- Actions column: Edit, Delete, Toggle Premium
- Sortable headers
- Pagination controls
- Search/filter bar above table

**Add/Edit Listing Form**:
- Two-column layout on desktop: grid-cols-1 md:grid-cols-2
- Form sections: Basic Info, Location, Features, Premium Settings
- Input groups with labels above fields
- Helper text below inputs
- Validation states with clear error messaging
- Action buttons: Primary (Save), Secondary (Cancel)

### 6. State Displays

**Loading State**:
- Centered: flex items-center justify-center min-h-screen
- Spinner: Loader2 icon (lucide-react) with animate-spin
- Loading text below spinner
- Padding: p-6

**Empty State**:
- Centered content
- Icon: MapPin or Search (lucide-react), large size
- Heading: "No launderettes found"
- Subtext: Helpful suggestions for refining search
- Call-to-action button

**Error State**:
- Alert styling with rounded corners
- Icon indicator
- Clear error message
- Retry action if applicable

### 7. Buttons & Interactive Elements

**Primary Button**:
- Padding: px-6 py-3
- Rounded: rounded-lg
- Font: text-base font-semibold
- Icon support with mr-2 spacing

**Secondary Button**:
- Similar structure, visual distinction
- Used for Cancel, alternative actions

**Icon Buttons**:
- Size: w-10 h-10
- Rounded: rounded-full
- Icon centered with p-2

**Search Button**:
- Integrated with search bar
- Icon: Search (lucide-react)
- Responsive text: Hidden on mobile, visible on tablet+

### 8. Forms

**Input Fields**:
- Padding: px-4 py-3
- Rounded: rounded-lg
- Border: border
- Focus state: Enhanced border, shadow-sm

**Input Layout**:
- Label: text-sm font-medium, mb-2
- Input field
- Helper/error text: text-xs, mt-1

**Select Dropdowns**:
- Same styling as input fields
- Chevron icon for dropdown indicator

### 9. Icons

**Icon Library**: Lucide React (already in use)
**Common Icons**:
- MapPin: Location/brand
- Search: Search functionality
- Zap: Premium indicator
- Loader2: Loading states
- ChevronDown: Dropdowns
- Plus: Add new
- Edit: Edit action
- Trash: Delete action

**Icon Sizing**:
- Small: w-4 h-4
- Medium: w-5 h-5
- Large: w-6 h-6
- Hero: w-8 h-8 or larger

---

## Images

**Hero Section Background** (Public Landing Version):
- Image: Modern, bright launderette interior with clean washing machines
- Treatment: Subtle overlay for text legibility
- Placement: Full-width hero section behind search bar
- Alt approach: Clean gradient if image not available

**Admin Dashboard**: No hero image, focus on functionality

**Listing Cards**: Optionally support launderette photos (future enhancement)
- Aspect ratio: 16:9 or 4:3
- Placement: Top of card
- Rounded corners matching card: rounded-t-xl

---

## Responsive Behavior

**Mobile (<768px)**:
- Single column layouts
- Simplified navigation (hamburger if needed)
- Full-width search bar
- Stacked distance display on cards
- Reduced padding: p-4 instead of p-6

**Tablet (768px-1024px)**:
- Two-column admin grids
- Enhanced search bar width
- Comfortable padding: p-6

**Desktop (>1024px)**:
- Three-column admin grids where appropriate
- Maximum container widths enforced
- Generous spacing: p-8
- Side-by-side layouts in admin forms

---

## Admin Interface Specific Guidelines

**Authentication Gate**:
- Clean login form, centered
- Firebase Auth integration
- "Admin Portal" clear labeling

**Color-Coding** (Structure Only):
- Admin areas have distinct header treatment
- Status indicators for listings (active/inactive)
- Premium toggle switches with visual states

**Data Tables**:
- Zebra striping for rows
- Hover states on rows
- Fixed header on scroll for long tables
- Responsive: Horizontal scroll on mobile

---

## Animations & Transitions

**Minimal Animation Approach**:
- Card hover: transform duration-200 ease-in-out
- Button interactions: opacity/scale on active state
- Loading spinners: animate-spin utility
- Page transitions: Fade only, no elaborate animations
- Search results: Simple fade-in, no stagger delays

**Avoid**: Excessive scroll animations, parallax effects, elaborate micro-interactions

---

## Accessibility Considerations

- All interactive elements have focus states
- Form inputs have associated labels
- Sufficient contrast for all text
- Screen reader friendly icons (aria-labels)
- Keyboard navigation support
- Skip links for main content