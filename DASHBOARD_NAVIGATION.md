# RentDirect UG - Dashboard Navigation Guide

## Quick Access

### Entry Point
- **Homepage/Landing**: `http://localhost:3000/`
- **Login**: `http://localhost:3000/login`
- **Register**: `http://localhost:3000/register`

---

## Direct Dashboard Access

### 1. Tenant Dashboard
**Path**: `/tenant`
- **URL**: `http://localhost:3000/tenant`
- **Pages Available**:
  - `/tenant` - Overview & Welcome
  - `/tenant/search` - Property Search
  - `/tenant/applications` - Applications
  - `/tenant/contracts` - Lease Contracts
  - `/tenant/payments` - Payment History
  - `/tenant/payments/new` - Make Payment
  - `/tenant/wallet` - Wallet & Balance
  - `/tenant/profile` - User Profile
  - `/tenant/messages` - Messages & Inbox
  - `/tenant/notifications` - Notifications
  - And 12+ more pages for complete tenant experience

### 2. Landlord Dashboard
**Path**: `/landlord`
- **URL**: `http://localhost:3000/landlord`
- **Pages Available**:
  - `/landlord` - Overview & Portfolio
  - `/landlord/listings` - Properties List
  - `/landlord/listings/new` - Add Property
  - `/landlord/applications` - Tenant Applications
  - `/landlord/tenants` - Manage Tenants
  - `/landlord/contracts` - Lease Agreements
  - `/landlord/payments` - Revenue & Transactions
  - `/landlord/analytics` - Performance Metrics
  - `/landlord/wallet` - Escrow & Wallet
  - `/landlord/messages` - Communication
  - `/landlord/support` - Support Tickets
  - And 15+ more pages for property management

### 3. Agent Dashboard
**Path**: `/agent`
- **URL**: `http://localhost:3000/agent`
- **Pages Available**:
  - `/agent` - Overview & Pipeline
  - `/agent/leads` - Lead Management
  - `/agent/listings` - Property Listings
  - `/agent/commissions` - Commission Tracking
  - `/agent/deals` - Active Deals
  - `/agent/contracts` - Documents
  - `/agent/messages` - Messages
  - `/agent/schedule` - Calendar
  - `/agent/referrals` - Referral Program
  - And 6+ more pages for agent operations

### 4. Admin / Government Dashboard
**Path**: `/admin` or `/government`
- **URL**: `http://localhost:3000/admin`
- **Pages Available**:
  - `/admin` - Platform Overview
  - `/admin/users` - User Management
  - `/admin/listings` - Moderation Queue
  - `/admin/payments` - Payment Monitoring
  - `/admin/fraud` - Fraud Detection
  - `/admin/analytics` - Analytics & Reports
  - `/admin/settings` - System Settings
  - `/admin/support` - Support Center
  - And 14+ more pages for platform administration

**Alternative Path**: `/government`
- `/government` - Government Console
- `/government/housing` - Housing Analytics
- `/government/compliance` - KYC Verification
- `/government/reports` - Export & Reports

---

## Authentication Flow

### Step 1: Login
1. Go to `http://localhost:3000/login`
2. Enter credentials (see test accounts below)
3. Click "Sign in"

### Step 2: Role Selection (if first login)
If you haven't selected a role yet, you'll see the role selection screen:
- **Tenant** - Rent properties
- **Landlord** - List & manage properties
- **Agent** - Buy/sell properties
- **Admin** - Manage platform

### Step 3: Dashboard Access
After login, you'll be automatically redirected to your role's dashboard based on your user role.

---

## Test Accounts

The system uses mock data for demonstration. You can use any email/password combination. The backend will validate credentials.

### Example Test Users:
- **Tenant**: `tenant@example.com` / any password
- **Landlord**: `landlord@example.com` / any password
- **Agent**: `agent@example.com` / any password
- **Admin**: `admin@example.com` / any password

*Note: These are example emails. The actual backend authentication system handles real credential validation.*

---

## Key Features by Dashboard

### Tenant Features
- Property search with filters
- Browse and apply to listings
- Sign lease contracts
- Make rent payments
- Track wallet balance
- Communicate with landlords
- View notifications

### Landlord Features
- Add and manage properties
- Review tenant applications
- Create and sign contracts
- Track rental income
- Monitor tenant payments
- Access analytics and reports
- Manage support tickets

### Agent Features
- Manage sales pipeline
- Track leads and deals
- Monitor commissions
- Schedule viewings
- Manage documents
- Access referral program
- Real-time messaging

### Admin Features
- User account management
- Content moderation
- Payment monitoring
- Fraud detection
- Platform analytics
- System configuration
- Support management

---

## Design System Features

All dashboards feature:
- **Dark Navy Theme** - Professional appearance with `#0f172a` background
- **Emerald Green Accents** - Primary color at `#10b981` for CTAs and highlights
- **Glassmorphism Cards** - Premium UI with backdrop blur effects
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Smooth Animations** - 300ms transitions on all interactive elements
- **Accessibility** - WCAG AA compliant with proper contrast ratios

---

## Sidebar Navigation

Each dashboard has a collapsible sidebar with:
- **Logo & Role Label** - Current user role
- **Primary Modules** - Main navigation sections
- **Quick Actions** - Common tasks
- **Settings & Profile** - User management

### Sidebar Actions:
- Click items to navigate
- Use collapse button (left sidebar) to minimize
- Mobile: Swipe to open/close navigation

---

## Topbar Features

All dashboards include a sticky topbar with:
- **Search** - Quick property/user search
- **Notifications** - Real-time alerts
- **Messages** - Conversation inbox
- **User Profile** - Account settings
- **Add Property** (Landlord only) - Quick listing creation

---

## Quick Navigation Tips

1. **Back to Home**: Click logo in sidebar
2. **Switch Role**: Go to settings to change role
3. **View Profile**: Click avatar in topbar
4. **Notifications**: Bell icon in topbar
5. **Messages**: Envelope icon in topbar
6. **Search**: Use magnifying glass icon in topbar

---

## URLs Reference

```
Home:        http://localhost:3000/
Login:       http://localhost:3000/login
Register:    http://localhost:3000/register

Tenant:      http://localhost:3000/tenant
Landlord:    http://localhost:3000/landlord
Agent:       http://localhost:3000/agent
Admin:       http://localhost:3000/admin
Government:  http://localhost:3000/government
```

---

## Need Help?

- **Design Questions**: See `DESIGN_SYSTEM.md`
- **Component Details**: Check `components/dashboard/`
- **API Integration**: See `lib/api.ts`
- **Session Management**: See `lib/session.ts`

---

*Last updated: RentDirect UG Platform - Complete Dashboard Implementation*
