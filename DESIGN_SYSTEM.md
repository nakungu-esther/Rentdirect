# RentDirect UG - Premium Design System

## Overview

A production-grade, premium dark navy + emerald green design system built with Next.js 16, Tailwind CSS, and semantic design tokens. The system features glassmorphism effects, smooth transitions, and investor-ready aesthetics.

## Color Palette

**Exactly 5 colors** as per design guidelines:

### Primary Colors
- **Background**: Dark Navy (`hsl(222 42% 7%)`) - Primary dark surface
- **Primary**: Emerald Green (`hsl(160 84% 39%)`) - CTAs, highlights, accents
- **Card**: Darker Navy (`hsl(222 37% 11%)`) - Card backgrounds
- **Secondary**: Navy Gray (`hsl(222 30% 16%)`) - Secondary surfaces

### Text Colors
- **Foreground**: Light Cyan (`hsl(210 40% 98%)`) - Primary text
- **Muted-foreground**: Slate Gray (`hsl(210 20% 55%)`) - Secondary text

## Typography

- **Font Family**: Poppins (via `@next/font/google`)
- **Weights**: 400, 500, 600, 700, 800
- **Line Height**: 1.4-1.6 for body text
- **Semantic Classes**: `font-sans` applied throughout

## Component System

### Premium Utilities (in globals.css)

```css
.glass-card          /* Glassmorphism with backdrop blur */
.glass-card-elevated /* Enhanced glass with hover effects */
.gradient-text       /* Emerald gradient text */
.focus-ring          /* Accessible focus states */
.transition-smooth   /* Consistent 300ms transitions */
.btn-premium         /* Premium button styling */
```

### Tailwind Extensions

**Shadow System**:
- `shadow-glass` - Subtle glass effect
- `shadow-glass-lg` - Enhanced glass shadow
- `shadow-glass-hover` - Interactive shadow

**Border Radius**: 
- Default: `0.75rem` (rounded-lg)
- All components use consistent rounding

## Implementation Details

### Design Token Application

All components use semantic tokens instead of hardcoded colors:

```tsx
// ✗ Avoid hardcoded colors
className="bg-[#00C853] text-[#0B111B]"

// ✓ Use semantic tokens
className="bg-primary text-primary-foreground"
```

### Glass Card Pattern

```tsx
import { rdGlassCard } from "@/components/dashboard/rd/rd-dashboard-tokens"

<div className={rdGlassCard}>
  {/* Premium content */}
</div>
```

### Navigation Components

**DashboardSidebar**:
- Emerald green accent borders
- Active state with primary color + shadow
- Responsive collapse/expand
- Mobile overlay support

**DashboardTopbar**:
- Search input with primary focus ring
- Premium buttons with shadow effects
- Icon buttons with emerald hover

## Dashboard Structure

### Roles & Dashboards

1. **Tenant** (22 pages)
   - Dashboard overview
   - Search & saved properties
   - Applications & contracts
   - Payments & wallet
   - Messages & notifications

2. **Landlord** (26 pages)
   - Revenue analytics
   - Property management
   - Tenant management
   - Payment tracking
   - Reports & insights

3. **Agent** (15 pages)
   - Leads pipeline (Kanban)
   - Commission tracking
   - Client management
   - Deal tracking

4. **Admin** (22 pages)
   - User management
   - Listings moderation
   - Payment monitoring
   - Fraud detection
   - Audit logs

5. **Government** (8 pages)
   - Housing analytics
   - Compliance tracking
   - Tax reporting
   - District syncing

## Animation & Transitions

- **Transition Duration**: 300ms (ease-out)
- **Hover Effects**: Subtle border and shadow changes
- **Active States**: Primary color + shadow elevation
- **Focus States**: 2px ring with primary color

## Responsive Design

Built with mobile-first approach:
- Base styles: Mobile (360px+)
- `sm:` breakpoint (640px)
- `md:` breakpoint (768px)
- `lg:` breakpoint (1024px)
- `xl:` breakpoint (1280px)

## Accessibility

- **Contrast**: WCAG AA compliant (minimum 4.5:1)
- **Focus Management**: Visible focus rings on all interactive elements
- **Keyboard Navigation**: Full keyboard support via Radix UI
- **Semantic HTML**: Proper heading hierarchy and ARIA attributes
- **Screen Readers**: `sr-only` class for hidden text content

## File Structure

```
apps/web/
├── app/
│   ├── globals.css           # Design tokens & utilities
│   ├── layout.tsx            # Root layout with fonts
│   ├── (auth)/               # Authentication pages
│   ├── tenant/               # Tenant dashboard (22 pages)
│   ├── landlord/             # Landlord dashboard (26 pages)
│   ├── agent/                # Agent dashboard (15 pages)
│   ├── admin/                # Admin dashboard (22 pages)
│   └── government/           # Government console (8 pages)
│
├── components/
│   ├── dashboard/
│   │   ├── DashboardShell.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardTopbar.tsx
│   │   ├── DashboardUtilityRail.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── ModulePlaceholder.tsx
│   │   └── overview/
│   │       ├── TenantOverview.tsx
│   │       ├── LandlordOverview.tsx
│   │       ├── AgentOverview.tsx
│   │       └── GovernmentOverview.tsx
│   └── auth/
│       ├── AuthSplitLayout.tsx
│       └── auth-split.module.css
│
├── tailwind.config.ts        # Tailwind extensions
└── next.config.js            # Next.js configuration
```

## Recent Updates

### Design System Implementation (4 commits)

1. **Implement premium dark navy + emerald green design system**
   - Updated `globals.css` with semantic design tokens
   - Added glassmorphism utilities
   - Extended `tailwind.config.ts` with premium shadows

2. **Update all dashboard overviews with premium design tokens**
   - Applied tokens to Tenant, Landlord, Agent dashboards
   - Updated Government console
   - Enhanced chart styling with dynamic theme colors

3. **Update dashboard sidebar and topbar with premium theme**
   - Applied primary/background/foreground tokens
   - Enhanced active states with shadows
   - Improved button styling

4. **Apply premium design tokens to all feature components**
   - Updated RdStatStrip, NotificationCenter, ModulePlaceholder
   - Improved text contrast and hover states
   - Applied glassmorphic styling throughout

## How to Use

### Adding New Components

1. **Use semantic tokens** instead of hardcoded colors
2. **Apply the glass-card class** for card-like components
3. **Use transition-smooth** for consistent animations
4. **Leverage primary color** for CTAs and highlights

### Customizing Colors

Update `app/globals.css` CSS variables:

```css
:root {
  --primary: 160 84% 39%;         /* Emerald green */
  --background: 222 42% 7%;       /* Dark navy */
  --foreground: 210 40% 98%;      /* Light cyan */
  /* ... other tokens ... */
}
```

### Extending Tailwind

Add custom utilities in `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: { /* ... */ },
    boxShadow: { /* ... */ },
    /* Add extensions here */
  }
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Performance Notes

- All transitions: 300ms for smooth 60fps animations
- Backdrop blur: Uses hardware acceleration (GPU)
- Responsive images: Native Next.js Image component
- Bundle optimized: Tree-shaken unused styles

## Next Steps

- Connect backend APIs for real data
- Implement WebSocket for real-time updates
- Add blockchain integration (Sui, Walrus)
- Enable dark mode toggle (optional - currently always dark)
- Integrate AI insights and recommendations

## Credits

Built with:
- Next.js 16 (App Router)
- React 19.2
- Tailwind CSS 3.4
- Radix UI (primitives)
- Recharts (data visualization)
- Framer Motion (animations)
- Lucide Icons
