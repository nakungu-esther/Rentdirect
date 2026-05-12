# RENTDIRECT UG - How To Actually Build (Coding Flow)

This document converts the product vision into an execution sequence for engineering.

## Stage 1 - Define the Business System

Primary users:

- Tenant: find and pay for rentals, manage contracts
- Landlord: create listings, manage tenants and payments
- Agent: assist discovery, onboarding, and transactions
- Admin: run platform operations and moderation
- Government: oversee analytics, compliance, and verification

Problems solved:

- fake listings
- payment trust gaps
- rental fraud
- paper contract limitations
- disconnected housing records and systems

## Stage 2 - Design End-to-End Platform Flows

### Auth flow

Open app -> choose role -> register/login -> OTP verification -> profile completion -> dashboard access

### Listing flow

Landlord creates listing -> uploads photos -> adds location -> submits -> moderation review -> approval -> public visibility

### Payment flow

Tenant selects property -> chooses pay -> MTN/Airtel selection -> payment request -> transaction proof -> landlord notification

### Contract flow

Landlord drafts lease -> tenant reviews -> both sign -> contract stored in Walrus -> immutable reference/proof

## Stage 3 - Define Module Connections

Critical dependencies:

- Listings -> Users, Uploads, Location/Map, Payments, Contracts
- Payments -> Users, Contracts, Notifications, Blockchain
- Contracts -> Users, Listings, Payments, Files, Blockchain
- Notifications -> all major modules
- Moderation -> Users, Listings, Files, Audit logs

## Stage 4 - MVP Boundary (Build Only This First)

MVP modules:

- Auth: register/login, roles, OTP, token/session base
- Listings: create and browse listings
- Payments: simulate/integrate MoMo
- Contracts: simple digital lease flow
- Walrus integration: contract/image storage
- Sui proof: transaction verification reference

Out of MVP:

- AI recommendation engine
- deep government API integrations
- advanced analytics platform
- complex smart-contract automation

## Stage 5 - Dashboard Capability Definition

Tenant mobile:

- home, search, property detail, payments, contracts, notifications, profile

Landlord mobile:

- dashboard, listings, payments, contracts, tenant management, analytics

Admin web:

- users, moderation, payments, reports, audit logs, settings

Government web:

- rental analytics, tax/compliance reports, verification views

## Stage 6 - UX/Journey Mapping Before Coding

Define user journeys in Figma, Excalidraw, or Whimsical.

Reference journey:

Open app -> search apartment -> property detail -> pay deposit -> sign contract -> move in

## Stage 7 - Data Model Design

Core entities:

- users
- listings
- payments
- contracts
- notifications
- messages
- reviews
- transactions

Key relationships:

- one landlord -> many listings
- one tenant -> many payments
- one contract -> one listing (plus tenant and landlord references)

## Stage 8 - Stack Lock

- Backend: NestJS
- Database: PostgreSQL + Redis
- Mobile: React Native (Expo)
- Web: Next.js
- Blockchain: Sui
- Decentralized storage: Walrus
- Payments: MTN MoMo + Airtel Money

## Stage 9 - Hackathon Story

Pitch statement:

RENTDIRECT UG transforms rental housing into programmable financial infrastructure using Sui blockchain, enabling secure digital rent payments, verifiable lease contracts, and decentralized housing records for emerging markets.

## Stage 10 - 4 Week Build Plan

Week 1:

- architecture finalization
- UX flows and Figma
- auth baseline
- initial schema design

Week 2:

- listings
- uploads
- payments

Week 3:

- contracts
- Walrus integration
- Sui transaction proof integration

Week 4:

- QA and hardening
- demo polish
- deployment
- pitch and presentation

## Implementation Rule

For every coded feature, confirm:

1. Which user problem does this solve?
2. Which module owns this logic?
3. Which end-to-end flow does it improve?
4. How will we demo it clearly?
