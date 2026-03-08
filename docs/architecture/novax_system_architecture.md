# NOVAX ERP - System Architecture

## 1. Overview
NOVAX is a web-based platform tailored for the manufacturing and distribution of cleaning products. The system supports three primary user roles:
- **Visitors:** Can browse the catalog and view products.
- **Registered Clients:** Can perform the visitor actions, plus manage their profile, place orders, and check order statuses.
- **Administrators:** Have full access to manage inventory, update product details, manage users (clients and suppliers), and oversee incoming orders.

## 2. Technology Stack
- **Frontend Framework:** Next.js (or React)
- **Styling:** CSS Grid, Flexbox, Responsive Design (Mobile, Tablet, Desktop)
- **Backend Framework:** Node.js 
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Future Integrations:** Google Maps API (for routing and geolocation)

## 3. High-Level Architecture
The architecture is structured as a client-server model:

1. **Client Tier (Frontend):** A responsive Single Page Application (SPA) or Server-Side Rendered (SSR) app built in React/Next.js. Handles user interface and interactions.
2. **Application Tier (Backend):** A Node.js API server exposing RESTful endpoints for the client tier to consume. Handles business logic (inventory tracking, pricing computation based on roles, etc.). 
3. **Data Tier (Database):** A PostgreSQL database storing the relational data model (Users, Products, Categories, Orders, etc.).

### 3.1 Component Diagram
```text
[ Web Browser / Mobile Device ]
            | (HTTP / REST API requests)
            v
[ Node.js Backend API ]
            | (SQL Queries)
            v
[ PostgreSQL Database ]
```

## 4. Security
- Use of JWT for secure session management and role-based access control.
- Passwords must be hashed and salted before storage in the database (e.g., using bcrypt).
- API endpoints for the Administrator panel must enforce strict role validation.
