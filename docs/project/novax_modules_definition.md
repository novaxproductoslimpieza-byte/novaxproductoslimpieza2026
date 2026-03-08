# NOVAX ERP - Modules Definition

## User Interface Modules (Frontend)
1. **Catalog Module:** Product browsing, category filtering, product searching.
2. **Shopping Cart Module:** Cart management, order confirmation.
3. **Authentication Module:** Registration, Login, Profile updates.
4. **Order Tracking Module:** View status of submitted orders (Pending, Approved, Dispatched, Delivered).

## Admin Sub-System (Frontend)
1. **Product Management:** Create, Update, Delete products. Handle image uploads.
2. **Inventory Management:** Adjust stock, view out-of-stock items.
3. **Category Management:** Define hierarchy of Categories and Subcategories.
4. **Order Management:** View global orders, update order statuses to prompt fulfillment workflows.
5. **Client Management:** View client lists.

## Core API Elements (Backend)
1. **Authentication API:** Security, password handling, JSON Web Token (JWT) validation and generation.
2. **Catalog Controller:** Product reading and structured listing.
3. **Order Handler Controller:** Validates shopping cart stock levels, and securely writes transaction details.
4. **Inventory Mutator Service:** Modifies product stock dynamically.
