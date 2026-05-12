# RENTDIRECT UG - Complete System Module Architecture

## Platform Identity

RENTDIRECT UG is designed as a digital housing infrastructure platform that combines:

- PropTech
- FinTech
- GovTech
- Identity services
- Smart-city capabilities

## Core Platform Structure

- Mobile App: Tenant, Landlord, Agent dashboards
- Web Dashboard: Admin, Government dashboards
- Backend API: shared business logic and integrations
- Data Layer: PostgreSQL + Redis

## Domain Modules

1. Auth (foundation)
2. Users
3. Listings
4. Location & Map
5. Payments
6. Rental Contracts
7. Notifications
8. Chat / Messaging
9. Rent Management
10. Government Integration
11. Analytics
12. Moderation
13. Files & Uploads
14. AI Recommendations (later)
15. Blockchain Trust Layer (later)
16. Reporting
17. System Settings
18. Support & Tickets
19. Audit Logs

## Delivery Phases

### Phase 1 (MVP)

- Auth
- Users
- Listings
- Uploads
- Payments
- Notifications

### Phase 2

- Rentals
- Contracts
- Messaging
- Admin dashboard capabilities

### Phase 3

- Government integrations
- AI modules
- Blockchain modules
- Smart-city analytics

## Related documents

- **Staged methodology + MVP (Auth → Walrus → Sui):** see `MVP_STAGED_IMPLEMENTATION_SPEC.md`
- **Dashboard ↔ module communication:** see `DASHBOARD_UI_AND_MODULE_FLOWS.md`

## Architecture Rules

- Build by domain modules, not by UI pages
- Keep shared logic in backend services with role-aware APIs
- Design for multi-dashboard access per module
- Make authentication, auditability, and scalability first-class concerns
- Keep advanced modules (AI/blockchain/gov) decoupled behind integration boundaries
