# RentDirect UG — Stages 1–10 & MVP implementation spec

This document is the **implementation contract** for your methodology: concept → flows → architecture → UI → code. It aligns the **full system diagram** with the **MVP cut** (auth through Sui proof) and what to **defer**.

---

## Stage 1 — Define the business system

### 1.1 Who are the users?

| User | Purpose |
|------|---------|
| **Tenant** | Find, pay for, and manage rentals |
| **Landlord** | Publish and operate properties |
| **Agent** | Help match, rent, and close deals |
| **Admin** | Operate and protect the platform |
| **Government** | Oversight, analytics, compliance (later phase) |

### 1.2 What problems are you solving?

- Fake listings  
- Payment trust  
- Rental fraud  
- Paper contracts  
- Disconnected housing systems  
- Lack of digital infrastructure  

**Product principle:** every feature maps to at least one of these.

---

## Stage 2 — Platform flows (behavior, not UI)

### Auth flow

`Open app → Select role → Register / Login → OTP verification → Profile completion → Dashboard access`

**MVP coding target:** role selection + register/login + **OTP step** (SMS or dev code) + minimal profile fields before tabs.

### Listing flow

`Landlord creates listing → Photos → Location → Submit → Moderation → Approved → Public`

**MVP coding target:** landlord **create** + **browse** for tenants; moderation can be **manual admin flag** or auto-approve for hackathon demo.

### Payment flow

`Tenant selects property → Pay → MTN / Airtel → Request sent → Blockchain receipt (proof) → Landlord notified`

**MVP coding target:** **simulate** MoMo/Airtel + persist payment record + **Sui tx digest / object id** (or placeholder hash) + **notification** stub to landlord.

### Contract flow

`Landlord creates lease → Tenant reviews → Both sign → Walrus storage → Immutable proof (Sui optional anchor)`

**MVP coding target:** **simple PDF or JSON lease** + signatures (typed name / checkbox acceptable for demo) + **Walrus blob id** on file + link from contract row.

---

## Stage 3 — Module connections (architecture)

| Module | Connects to |
|--------|-------------|
| **Listings** | Users, Files/Uploads, Location/Map, (later) Moderation, Payments, Contracts |
| **Payments** | Users, Listings, Contracts (optional), **Notifications**, **Blockchain (Sui)** |
| **Contracts** | Users, Listings, **Files (Walrus)**, Payments, **Blockchain** |
| **Notifications** | All major domains (events only; no business rules) |
| **Auth** | Users, Audit (login events) |

**Rule:** UIs only talk to the **API**; modules talk to each other **inside the backend** (services + events), not across clients.

---

## Stage 4 — MVP scope (what to implement now)

### In MVP

1. **Auth** — login, register, **roles**, **OTP**  
2. **Listings** — create (landlord), browse (tenant/public)  
3. **Payments** — **simulate** or real MoMo/Airtel webhook path (start with simulate)  
4. **Contracts** — simple digital lease lifecycle  
5. **Walrus** — store **contract + listing images** (metadata in Postgres, blob ref from Walrus)  
6. **Sui** — **one** clear proof path (e.g. payment completed → memo / object id stored on payment row)  

### Out of MVP (do not build yet)

- AI recommendation  
- Government integrations (URA/NIRA/KCCA)  
- Deep smart-contract product logic  
- Advanced analytics / heatmaps  

Government **web shell** can exist as empty routes; **no live gov APIs** in MVP.

---

## Stage 5 — Dashboards (what each UI must expose)

### Tenant mobile

Home, Search, Property detail, Payments, Contracts, Notifications, Profile  

### Landlord mobile

Dashboard, My listings, Payments, Contracts, Tenants (or “Rentals” placeholder), Analytics (minimal), Profile  

### Agent mobile

Listings, Leads, Messaging, Commissions (stub), Notifications, Profile  

### Admin web

Users, Listing moderation, Payments monitor, Reports (CSV/PDF stub), Audit logs, Settings (feature flags stub)  

### Government web

Rental analytics (read-only aggregates), Tax/compliance **placeholders**, Verification overview **placeholder**  

---

## Stage 6 — UX before more code

Use **Figma / Excalidraw / Whimsical** for:

- Journey: `Open app → Search → Detail → Pay deposit → Sign contract → Home`  
- One **low-fi** screen per core section above  

**Code rule:** no new major screen without a named step in a flow.

---

## Stage 7 — Data model (entities & relationships)

**Core entities**

- Users  
- Listings  
- Payments  
- Contracts  
- Notifications  
- Messages (post-MVP or stub)  
- Reviews (post-MVP)  
- Transactions (ledger view; can map to Payments + Sui refs)  

**Relationships**

- One **landlord** → many **listings**  
- One **tenant** → many **payments**  
- One **contract** → one **listing** (plus tenant + landlord FKs)  
- One **listing** → many **payments** (deposits, rent)  

Implement in **TypeORM migrations** as you harden beyond the initial schema.

---

## Stage 8 — Tech stack (locked)

| Layer | Choice |
|-------|--------|
| API | NestJS |
| DB | PostgreSQL (+ Neon in prod) |
| Cache / sessions | Redis |
| Mobile | Expo (React Native) |
| Web | Next.js |
| Chain | Sui |
| Blob storage | Walrus (contracts + images); Cloudinary optional interim |
| Payments | MTN MoMo, Airtel Money |

---

## Stage 9 — Hackathon story (one paragraph)

> **RentDirect UG** turns informal rental housing into **programmable financial infrastructure** on **Sui**: **verifiable** rent payments, **tamper-evident** leases backed by **Walrus**, and a **single digital record** landlords and tenants can trust—built for Uganda and emerging markets.

Use this in deck / README / demo intro.

---

## Stage 10 — Four-week build roadmap

| Week | Focus |
|------|--------|
| **1** | Architecture docs (this file), Figma journeys, **Auth + DB** solid, OTP |
| **2** | **Listings** + **uploads** + **Payments** simulate + webhooks stub |
| **3** | **Contracts** + **Walrus** upload/download path + **Sui** proof on payment |
| **4** | Polish, E2E demo path, deploy, pitch rehearsal |

---

## Ordered implementation: from Auth to Sui (coding sequence)

Use this order to avoid rework:

| Step | Module | Deliverable |
|------|--------|-------------|
| 1 | **Auth** | Role in registration; JWT refresh; **OTP** endpoint + verify; guard + `@Public()` complete |
| 2 | **Users** | Profile fields; link `User` to listings/landlord |
| 3 | **Listings** | Landlord CRUD; public browse + filters; link photos URLs |
| 4 | **Uploads / Files** | Secure upload API; store file key; prepare Walrus adapter interface |
| 5 | **Walrus** | `WalrusService.put/get` implementation or stub returning deterministic dev id; persist `walrusCid` on listing + contract |
| 6 | **Payments** | Initiate + callback + **simulate** provider; idempotent webhook handler |
| 7 | **Sui** | `SuiService.recordPaymentProof(paymentId)` → store `suiTxDigest` / object id on `Payment` |
| 8 | **Contracts** | Create from listing; tenant sign; store document ref + Walrus cid; optional Sui anchor |
| 9 | **Notifications** | In-app list + emit on: listing approved, payment completed, contract signed |
| 10 | **Admin web** | Minimal pages: users list, listing approve/reject, payments table, audit tail |

**Defer:** AI module routes, gov integration routes, heavy analytics, multi-chain logic.

---

## Where this lives in the repo

- Full dashboard ↔ module flows: `docs/DASHBOARD_UI_AND_MODULE_FLOWS.md`  
- Build / run: `docs/BUILD_EXECUTION_FLOW.md`  
- DB migrations: `docs/MIGRATIONS.md`  
- Architecture list: `docs/SYSTEM_MODULE_ARCHITECTURE.md`  

**Mindset:** you are not “making pages”; you are shipping **flows** with **auditability** and **one demo path** that proves trust (payment + contract + proof).
