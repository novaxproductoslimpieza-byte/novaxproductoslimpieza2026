# NOVAX ERP - API Data Contracts

## 1. Authentication Endpoints

### POST /api/auth/register
**Request Body:**
```json
{
  "nombre": "Juan Perez",
  "ci": "1234567",
  "telefono": "77766655",
  "direccion": "Av. Principal 123",
  "correo": "juan@example.com",
  "password": "securepassword123"
}
```
**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "token": "jwt.token.string"
}
```

### POST /api/auth/login
**Request Body:**
```json
{
  "ci_or_correo": "1234567",
  "password": "securepassword123"
}
```
**Response:** `200 OK`
```json
{
  "token": "jwt.token.string",
  "user": {
    "id": 1,
    "nombre": "Juan Perez",
    "rol": "cliente"
  }
}
```

## 2. Catalog Endpoints

### GET /api/categories
**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "nombre": "Hogar",
    "descripcion": "Productos de limpieza para el hogar",
    "subcategorias": [
      {
        "id": 1,
        "nombre": "Lavavajillas"
      }
    ]
  }
]
```

### GET /api/products
**Query Params:** `?category_id=1`, `?search=detergente`
**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "nombre": "Detergente Ropa",
    "precio_minorista": 25.50,
    "precio_mayorista": 20.00,
    "imagen": "/images/prod1.png",
    "stock": 150
  }
]
```

## 3. Order Endpoints

### POST /api/orders
**Authorization:** Required (Cliente/Administrador)
**Request Body:**
```json
{
  "productos": [
    {
      "producto_id": 1,
      "cantidad": 2,
      "precio": 25.50
    }
  ]
}
```
**Response:** `201 Created`
```json
{
  "message": "Order created",
  "pedido_id": 105
}
```

### GET /api/orders
**Authorization:** Required
Returns orders specific to user role.

## 4. Admin Endpoints
- `PUT /api/orders/:id/status`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
