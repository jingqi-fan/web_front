# CreditLife Hub Frontend

A **Vue 3 + TypeScript** frontend for a credit-based lifestyle platform covering rental, hospital, parking, shopping, user credit, and public-good activity scenarios.

This project builds a large, modular frontend for multi-role users (citizens, doctors, administrators) with authenticated flows, domain-driven routing, and data-rich UI experiences.

## Highlights

- Built as a **multi-domain super-app frontend**.
- Supports **end-to-end business flows**: login/registration, profile completion, credit scoring, booking, ordering, payment-like processes, and admin management.
- Implements **role-specific experiences** (user, doctor, admin) with route-level access control.
- Uses **typed API layers + centralized state management** for maintainability at scale.

## Core Features

### 1. Identity, Session, and Access Control
- Account registration and login flows.
- JWT-based token session handling with refresh-token strategy.
- Axios interceptors for auth header injection, token refresh, and global error handling.
- Route guards with whitelist and profile-completion checks before entering protected modules.

### 2. Credit-Driven Consumer Services
- Credit commerce module with:
  - product browsing and detail pages,
  - housing rental browsing and details,
  - order confirmation and order list management,
  - hotel listing/detail/reservation-related flows.
- Personal center with user profile and credit score visualization.

### 3. Credit Life Services
- Hospital service flows:
  - department-based pre-ordering,
  - quick/AI-assisted appointment path,
  - order detail and payment-related pages.
- Parking service flows:
  - lot list, space selection,
  - pre-order confirmation,
  - personal parking order and fee detail pages.
- Library/medical-check style flows:
  - borrowing, my orders, payment pages,
  - doctor-side check list and drug list pages.

### 4. Admin and Operations Console
- Dedicated manager login and admin workspace.
- Back-office modules for:
  - prosocial behavior taxonomy/item management,
  - book management,
  - hospital department/doctor management,
  - parking management,
  - approval/review workflows.

### 5. Data & Visualization
- Dashboard-style pages with charting and map/weather visualization.
- Rich media and animation support for interactive UX.

## Technical Stack

### Frontend Framework
- Vue 3
- TypeScript
- Vite
- Vue Router 4
- Pinia + pinia-plugin-persistedstate

### UI & Interaction
- Element Plus
- Less / Sass
- Lottie animations

### Data & Networking
- Axios (with request/response interceptors)
- JWT refresh workflow
- Query-string utilities

### Visualization & Utilities
- ECharts + vue-echarts + Recharts
- Day.js
- UUID
- QRCode generation
- Marked + Highlight.js + DOMPurify (content rendering/sanitization)

### Tooling
- vue-tsc
- @vitejs/plugin-vue
- @vitejs/plugin-vue-jsx
- vite-svg-loader

## Project Structure (High Level)

```text
src/
  api/            # domain-based API modules (user, hotel, house, parking, hospital, etc.)
  entity/         # typed request/response/domain models
  stores/         # Pinia stores for token, user info, credit score, device/session states
  router/         # route definitions + route guard configuration
  plugins/        # axios client and global integrations
  views/          # feature pages (home, login, personal, business, life, manager)
  components/     # shared UI components
public/
  hoteldata/      # static media datasets used by booking-related pages
```

## Local Development

### Prerequisites
- Node.js 18+ (recommended)
- npm

### Install and Run

```bash
npm install
npm run dev
```

Default dev server:
- Frontend: `http://localhost:5174`
- API proxy: `/api` -> `http://localhost:8081` (configured in `vite.config.ts`)

### Build for Production

```bash
npm run build
npm run preview
```
