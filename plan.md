# Native Plant Nursery Web App — Implementation Plan

## Overview
A full-stack web application for a native plant nursery. The backend manages plant inventory; the frontend lets customers browse plants, add them to a cart with quantities, view a running total, and submit an order for nursery processing.

---

## Tech Stack

| Layer       | Technology                        | Rationale                                      |
|-------------|-----------------------------------|-------------------------------------------------|
| **Backend** | Node.js + Express                 | Lightweight, fast to build REST APIs            |
| **Database**| SQLite (via `better-sqlite3`)     | Zero-config, file-based, perfect for small inventory |
| **Frontend**| React 18 + Vite                   | Fast dev server, modern tooling, component model |
| **Styling** | Plain CSS (clean, no framework)   | Keeps dependencies minimal                      |

---

## Data Model

### `plants` table
| Column           | Type    | Description                                  |
|------------------|---------|----------------------------------------------|
| `id`             | INTEGER | Primary key, auto-increment                  |
| `plant_name`     | TEXT    | Scientific / botanical name                  |
| `common_name`    | TEXT    | Common name customers recognize              |
| `availability_date` | TEXT | Date the plant will be available (ISO 8601)  |
| `container_size` | TEXT    | e.g. "1 gallon", "4-inch pot", "bare root"   |
| `price`          | REAL    | Price in USD                                 |

### `orders` table
| Column       | Type    | Description                              |
|--------------|---------|------------------------------------------|
| `id`         | INTEGER | Primary key, auto-increment              |
| `created_at` | TEXT    | Timestamp of order submission            |
| `total`      | REAL    | Order total in USD                       |
| `status`     | TEXT    | "pending", "processing", "completed"     |

### `order_items` table
| Column     | Type    | Description                            |
|------------|---------|----------------------------------------|
| `id`       | INTEGER | Primary key, auto-increment            |
| `order_id` | INTEGER | Foreign key → orders.id                |
| `plant_id` | INTEGER | Foreign key → plants.id                |
| `quantity`  | INTEGER | Number of units ordered                |
| `unit_price`| REAL   | Price at time of order                 |

---

## Backend API Endpoints

| Method | Route              | Purpose                                  |
|--------|--------------------|------------------------------------------|
| GET    | `/api/plants`      | List all plants (with optional filters)  |
| GET    | `/api/plants/:id`  | Get a single plant's details             |
| POST   | `/api/orders`      | Submit a new order (cart → order)        |
| GET    | `/api/orders`      | List all orders (for nursery staff)      |
| GET    | `/api/orders/:id`  | Get order details including line items   |

---

## Frontend Pages / Views

### 1. Plant Catalog (Home Page)
- Displays all available plants in a card grid
- Each card shows: common name, scientific name, container size, price, availability date
- "Add to Cart" button with a quantity selector on each card
- Search/filter bar at the top

### 2. Shopping Cart (side panel or dedicated page)
- Lists selected plants with quantities
- Shows line totals (price × quantity) and a grand total
- Allows adjusting quantities or removing items
- "Submit Order" button

### 3. Order Confirmation
- Displays order summary after submission
- Shows order number for reference

### 4. Orders Dashboard (Nursery Staff View)
- Lists all submitted orders with status
- Click into an order to see line-item details
- Allows updating order status (pending → processing → completed)

---

## Project Structure

```
native-plant-nursery/
├── server/
│   ├── index.js              # Express app entry point
│   ├── db.js                 # SQLite connection + schema init
│   ├── routes/
│   │   ├── plants.js         # /api/plants routes
│   │   └── orders.js         # /api/orders routes
│   ├── seed.js               # Seed script with sample native plants
│   └── package.json
├── client/
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx          # React entry point
│   │   ├── App.jsx           # Router + layout
│   │   ├── components/
│   │   │   ├── PlantCard.jsx
│   │   │   ├── PlantCatalog.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── OrderConfirmation.jsx
│   │   │   └── OrdersDashboard.jsx
│   │   ├── context/
│   │   │   └── CartContext.jsx   # Cart state management
│   │   └── styles/
│   │       └── App.css
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Implementation Steps

### Step 1 — Backend setup
- Initialize `server/package.json` with dependencies (express, better-sqlite3, cors)
- Create `server/db.js`: open SQLite database, create `plants`, `orders`, and `order_items` tables if they don't exist
- Create `server/index.js`: Express app with JSON body parsing, CORS, and route mounting

### Step 2 — Backend API routes
- `server/routes/plants.js`: GET `/api/plants` (list all), GET `/api/plants/:id` (single)
- `server/routes/orders.js`: POST `/api/orders` (create order with items), GET `/api/orders` (list), GET `/api/orders/:id` (detail with items)

### Step 3 — Seed data
- `server/seed.js`: populate database with ~15 sample native plants (e.g., California Poppy, Purple Coneflower, Black-Eyed Susan, etc.) with realistic prices and container sizes

### Step 4 — Frontend scaffolding
- Initialize React + Vite project in `client/`
- Set up `CartContext` for managing cart state (add, remove, update quantity, clear)
- Set up `App.jsx` with client-side routing (react-router-dom)

### Step 5 — Plant Catalog page
- `PlantCatalog.jsx`: fetch plants from API, render as card grid
- `PlantCard.jsx`: display plant info, quantity input, add-to-cart button

### Step 6 — Shopping Cart
- `Cart.jsx`: display cart items, line totals, grand total, submit button
- On submit: POST to `/api/orders`, then navigate to confirmation

### Step 7 — Order Confirmation & Dashboard
- `OrderConfirmation.jsx`: show submitted order summary
- `OrdersDashboard.jsx`: list orders for nursery staff, update status

### Step 8 — Styling & polish
- Clean, nature-themed CSS (greens, earth tones)
- Responsive layout for mobile and desktop
- Loading and empty states

### Step 9 — Vite proxy + run scripts
- Configure Vite to proxy `/api` requests to the Express backend
- Add npm scripts for running both servers during development
