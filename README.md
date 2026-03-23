# Ticket Support System — Frontend

Plataforma de gestión de tickets de soporte al cliente basada en roles, construida con **React 18**, **TypeScript** y **Vite**. La aplicación proporciona una interfaz completa para gestionar tickets de soporte, clientes, usuarios y sucesos, con vistas diferenciadas según el rol del usuario (Administrador, Agente, Cliente).

---

## Tabla de contenido

- [Descripción general](#descripción-general)
- [Tecnologías](#tecnologías)
- [Funcionalidades](#funcionalidades)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y uso](#instalación-y-uso)
- [Acceso por roles](#acceso-por-roles)
- [Scripts disponibles](#scripts-disponibles)

---

## Descripción general

Esta aplicación frontend sirve como interfaz de usuario para un sistema de tickets de soporte. Implementa un dashboard completo con interacciones en tiempo real, validación de formularios, gestión de archivos y una jerarquía multinivel de eventos (sucesos), todo construido sin una librería de componentes UI externa, utilizando CSS-in-JS con variables CSS para garantizar un tema consistente en modo claro y oscuro.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Framework | React 18 |
| Lenguaje | TypeScript 5 |
| Herramienta de build | Vite 5 + SWC |
| Enrutamiento | React Router v6 |
| Gestión de estado | Context API + `useState` |
| Cliente HTTP | Axios |
| Gráficas | Chart.js + react-chartjs-2 |
| Exportación PDF | jsPDF + html2canvas |
| Alertas | SweetAlert2 |
| Estilos | Variables CSS + estilos en línea (CSS-in-JS) |
| Linting | ESLint 9 + TypeScript-ESLint |

---

## Funcionalidades

### Autenticación
- Inicio de sesión con validación de credenciales
- Persistencia de sesión mediante `localStorage`
- Rutas protegidas (redirección al login si no está autenticado)
- Modal de perfil: visualización y actualización de correo electrónico y teléfono
- Modal de cambio de contraseña con validación de reglas en tiempo real:
  - Mínimo 8 caracteres
  - Al menos una letra mayúscula
  - Al menos una letra minúscula
  - Al menos un número
  - Al menos un carácter especial

### Dashboard
- Dashboards específicos por rol: **Administrador**, **Agente** y **Cliente**
- Tarjetas KPI de resumen (tickets abiertos, en progreso, resueltos, urgentes)
- Tabla de tickets con badges de estado e indicadores de prioridad
- Navegación directa al detalle del ticket desde cualquier fila del dashboard

### Gestión de tickets
- Página de detalle de ticket (`/tickets/:id`) con:
  - Metadata del ticket: categoría, canal, prioridad, estado y agente asignado
  - Hilo de comentarios cronológico con rol del autor, fecha/hora y archivos adjuntos por comentario
  - Sección de comentarios con scroll y desplazamiento automático al último mensaje
  - Zona de carga de archivos con drag-and-drop a nivel de ticket y de comentario
  - Formulario para agregar comentarios con adjunto de archivos en línea

### Gestión de usuarios *(solo Administrador)*
- Tabla de usuarios con búsqueda y filtros
- Modal de edición: actualizar nombre, correo, teléfono y cliente asignado
- Botón de activar / inactivar usuario por fila

### Gestión de clientes *(solo Administrador)*
- Tabla de clientes con búsqueda y filtros
- Modal de edición: actualizar correo, teléfono e ingeniero asignado (el nombre es de solo lectura)
- Botón de activar / inactivar cliente por fila

### Sucesos
- Árbol jerárquico de eventos con hasta 5 niveles
- Indentación visual y badges de nivel con código de colores
- Modal de creación con selección dinámica de padre según el nivel elegido
- Botón de activar / inactivar suceso por fila

### Reportes y estadísticas
- Páginas dedicadas a visualización de datos con Chart.js
- Exportación a PDF mediante jsPDF + html2canvas

---

## Estructura del proyecto

```
src/
├── features/
│   ├── auth/
│   │   ├── context/        # AuthContext — estado global de autenticación
│   │   └── services/       # authService — lógica de login simulada
│   ├── theme/              # Contexto de tema (modo claro/oscuro)
│   └── tickets/
│       └── data/           # ticketsData.ts — datos mock compartidos de tickets
│
├── layouts/
│   └── Navbar.tsx          # Navegación superior + modales de perfil y contraseña
│
├── pages/
│   ├── auth/               # LoginPage, RegisterPage
│   ├── clients/            # ClientsPage
│   ├── dashboard/          # DashboardPage (router), Admin/Agent/ClientDashboard
│   ├── estadisticas/       # EstadisticasPage
│   ├── reportes/           # ReportesPage
│   ├── sucesos/            # SucesosPage
│   ├── tickets/            # TicketDetailPage
│   └── users/              # UsersPage
│
├── types/
│   └── users.types.ts      # Interfaces TypeScript compartidas
│
├── App.tsx                 # Definición de rutas
├── main.tsx                # Punto de entrada de React
└── styles/
    └── index.css           # Variables CSS y reset global
```

---

## Instalación y uso

### Requisitos previos

- Node.js 18+
- npm 9+

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd tickets-frontend

# Instalar dependencias
npm install
```

### Servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Build para producción

```bash
npm run build
```

El resultado se generará en la carpeta `dist/`.

### Vista previa del build de producción

```bash
npm run preview
```

---

## Acceso por roles

La aplicación soporta tres roles de usuario, cada uno con un dashboard dedicado y acceso acotado a funcionalidades:

| Rol | Dashboard | Tickets | Usuarios | Clientes | Sucesos | Reportes |
|---|---|---|---|---|---|---|
| **Administrador** | KPIs completos | Ver todos | Gestionar | Gestionar | Gestionar | Sí |
| **Agente** | Tickets asignados | Cola propia | — | — | — | Sí |
| **Cliente** | Solo sus tickets | Sus tickets | — | — | — | — |

El rol se determina en el inicio de sesión y se almacena en el contexto de autenticación. La protección de rutas se gestiona mediante un componente `PrivateRoute` en `App.tsx`.

---

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo de Vite con HMR |
| `npm run build` | Verifica tipos y genera el build de producción |
| `npm run preview` | Sirve el build de producción de forma local |
| `npm run lint` | Ejecuta ESLint en todo el árbol de código fuente |

---

## Decisiones de diseño

- **Sin librería de componentes externa** — todos los componentes están construidos desde cero utilizando estilos en línea y variables CSS, garantizando control total sobre el tema y el layout sin dependencias adicionales.
- **Variables CSS para el tema** — variables como `--bg-card`, `--text-primary` y `--border` se definen globalmente y se consumen en línea, permitiendo el cambio entre modo claro y oscuro con un simple toggle de clase.
- **Modales co-localizados** — los componentes modales (edición, creación, cambio de contraseña) viven en el mismo archivo que la página que los gestiona, reduciendo la complejidad de importaciones y manteniendo la lógica relacionada junta.
- **Context API en lugar de Redux** — dado el alcance de la aplicación, Context API con `useState` ofrece la gestión de estado necesaria sin el boilerplate de una librería dedicada.
