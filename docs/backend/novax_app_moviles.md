Se desarrolla el **Módulo 1: App móvil para repartidores**, diseñado para operación real en campo (entregas, estados, geolocalización).

---

# 1. ENFOQUE TECNOLÓGICO

**Recomendación (sólida y realista):**

| Opción      | Tecnología   | Motivo                             |
| ----------- | ------------ | ---------------------------------- |
| Recomendada | React Native | Un solo código para Android/iOS    |
| Alternativa | Flutter      | Alto rendimiento, pero curva mayor |

Se continúa con **React Native** (alineado con tu frontend JS).

---

# 2. FUNCIONALIDAD CLAVE (OPERACIÓN REAL)

| Módulo            | Función               |
| ----------------- | --------------------- |
| Login             | Acceso del repartidor |
| Pedidos asignados | Lista de entregas     |
| Detalle pedido    | Cliente + ubicación   |
| Cambio de estado  | en_ruta / entregado   |
| Geolocalización   | Ruta en mapa          |
| Confirmación      | Evidencia de entrega  |

---

# 3. ESTRUCTURA DEL PROYECTO

```plaintext
mobile/
│── src/
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── PedidosScreen.js
│   │   ├── DetallePedido.js
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── components/
│   └── navigation/
│
│── App.js
```

---

# 4. INSTALACIÓN

```bash
npx react-native init NovaxDelivery
cd NovaxDelivery

npm install axios
npm install @react-navigation/native
npm install @react-navigation/stack
npm install react-native-maps
npm install react-native-geolocation-service
```

---

# 5. CONEXIÓN API

```js
// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://TU_IP:4000/api",
});

export const setToken = (token) => {
  API.defaults.headers.common["Authorization"] = token;
};

export default API;
```

---

# 6. LOGIN REPARTIDOR

```js
// src/screens/LoginScreen.js
import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import API, { setToken } from "../services/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await API.post("/auth/login", { email, password });
    setToken(res.data.token);
    navigation.replace("Pedidos");
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Ingresar" onPress={login} />
    </View>
  );
}
```

---

# 7. LISTA DE PEDIDOS ASIGNADOS

## Backend necesario (ajuste)

```js
// obtener pedidos del repartidor
exports.getPedidosRepartidor = async (req, res) => {
  const userId = req.user.id;

  const result = await pool.query(
    `
    SELECT d.*, p.total, c.nombre, c.direccion, c.latitud, c.longitud
    FROM distribucion d
    JOIN pedidos p ON p.id = d.pedido_id
    JOIN clientes c ON c.id = p.cliente_id
    WHERE d.repartidor_id = $1
    ORDER BY d.id DESC
  `,
    [userId],
  );

  res.json(result.rows);
};
```

---

## Frontend

```js
// src/screens/PedidosScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import API from "../services/api";

export default function PedidosScreen({ navigation }) {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    const res = await API.get("/distribucion/repartidor");
    setPedidos(res.data);
  };

  return (
    <FlatList
      data={pedidos}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>{item.nombre}</Text>
          <Text>{item.direccion}</Text>
          <Button
            title="Ver"
            onPress={() => navigation.navigate("Detalle", { pedido: item })}
          />
        </View>
      )}
    />
  );
}
```

---

# 8. DETALLE + MAPA

```js
// src/screens/DetallePedido.js
import React from "react";
import { View, Text, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import API from "../services/api";

export default function DetallePedido({ route }) {
  const { pedido } = route.params;

  const cambiarEstado = async (estado) => {
    await API.put(`/distribucion/${pedido.id}`, { estado });
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: pedido.latitud,
          longitude: pedido.longitud,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: pedido.latitud,
            longitude: pedido.longitud,
          }}
          title={pedido.nombre}
        />
      </MapView>

      <Text>{pedido.nombre}</Text>
      <Text>{pedido.direccion}</Text>

      <Button title="En Ruta" onPress={() => cambiarEstado("en_ruta")} />
      <Button title="Entregado" onPress={() => cambiarEstado("entregado")} />
    </View>
  );
}
```

---

# 9. GEOLOCALIZACIÓN (REPARTIDOR)

```js
import Geolocation from "react-native-geolocation-service";

Geolocation.getCurrentPosition(
  (position) => {
    console.log(position.coords);
  },
  (error) => console.log(error),
  { enableHighAccuracy: true },
);
```

---

# 10. FLUJO OPERATIVO REAL

```plaintext
1. Repartidor inicia sesión
2. Ve pedidos asignados
3. Abre pedido → ve mapa
4. Marca "En Ruta"
5. Llega → marca "Entregado"
6. Sistema registra operación
```

---

# 11. MEJORAS CRÍTICAS (RECOMENDADO)

**Sugerencias técnicas (alto impacto):**

| Mejora                           | Beneficio              |
| -------------------------------- | ---------------------- |
| Guardar ubicación en tiempo real | Control total de rutas |
| Foto de entrega                  | Evidencia              |
| Firma digital cliente            | Validación             |
| Modo offline                     | No depende de internet |

---

# 12. DECISIÓN ESTRATÉGICA

Este módulo convierte tu sistema en:

```plaintext
ERP + Sistema logístico real en campo
```

---
