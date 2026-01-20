# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **IMPORTANTE:** Este documento contiene un resumen ejecutivo. Para especificaciones detalladas de tipos y campos, consultar `ARCHITECTURE.md`.

---

## Commands

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # TypeScript check + production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

---

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **Routing:** React Router v6 (nested routes under Layout)
- **State:** Context API (AuthContext, DataContext)
- **PDF:** @react-pdf/renderer for statements and receipts
- **Backend (futuro):** Supabase (PostgreSQL + Auth + Storage + RLS)

---

## Domain Model - Jerarquía de 4 Niveles

```
PROYECTO (desarrollo inmobiliario)
    └── ETAPA (fase del desarrollo)
            └── MANZANA (agrupación física)
                    └── LOTE (unidad de venta)
```

### Estados del Lote
- `available` - Disponible para venta
- `reserved` - Apartado con anticipo, en proceso
- `sold` - Vendido, contrato firmado
- `blocked` - No disponible (legal/técnico)

### Tipos de Lote
- `regular`, `corner`, `irregular`, `premium`

---

## Sistema de Ventas

### Flujo de Venta
```
Lote disponible → Cliente interesado → Seleccionar plan de pago
→ Pagar enganche → Lote "reserved" → Contrato firmado
→ Lote "sold" → Calendario de pagos activo → Comisión calculada
```

### Plan de Pago (PaymentPlan)
Esquemas de financiamiento configurables:
- Enganche (% o monto fijo)
- Plazo en meses
- Tasa de interés (0 = sin intereses)
- Pagos anuales opcionales

### Tipos de Pago
- `down_payment` - Enganche inicial
- `monthly` - Mensualidad regular
- `annual` - Pago anual obligatorio
- `extra` - Pago adelantado (abona a capital)

### Estados de Pago
- `pending`, `paid`, `partial`, `overdue`

---

## Sistema de Roles y Permisos

| Rol | Código | Capacidades Principales |
|-----|--------|------------------------|
| Super Admin | `master` | Control total, gestión usuarios, eliminar |
| Administrador | `admin` | Gestión operativa, sin eliminar |
| Comercial | `comercial` | Ventas, cobranza, ver comisiones propias |
| Cliente | `cliente` | Solo ver su información |

### Permisos Clave
- **master/admin:** CRUD proyectos, modificar lotes/pagos, ver todo
- **comercial:** Reservar/vender lotes, registrar pagos, ver clientes
- **cliente:** Ver estado de cuenta propio, descargar documentos

---

## Sistema de Comisiones

- Esquemas configurables: `percentage`, `fixed`, `tiered`
- Trigger de pago: `on_sale`, `on_down_payment`, `on_completion`
- Estados: `pending` → `approved` → `paid`

---

## Sistema de Alertas

| Tipo | Trigger |
|------|---------|
| `payment_reminder` | 5 días antes del vencimiento |
| `payment_due` | Día del vencimiento |
| `payment_overdue` | 1, 7, 15, 30 días de atraso |
| `payment_received` | Al registrar pago |
| `sale_completed` | Al completar venta |
| `commission_approved` | Al aprobar comisión |

Canales: `in_app`, `email`, `sms`

---

## Asistente de IA (Chat)

Consultas en lenguaje natural con acceso a datos según rol:
- **master:** Todo el sistema
- **admin:** Todo excepto configuración
- **comercial:** Sus ventas, clientes asignados, comisiones propias
- **cliente:** Solo su información

Ejemplos de consultas:
- "¿Cuántos lotes disponibles hay en Etapa 2?"
- "¿Quiénes tienen pagos vencidos esta semana?"
- "Dame el estado de cuenta de María González"

---

## Estructura de Carpetas

```
src/
├── components/
│   ├── ui/              # shadcn/ui base components
│   ├── layout/          # Layout, Sidebar, Header
│   ├── auth/            # ProtectedRoute, LoginForm
│   ├── projects/        # Project components
│   ├── lots/            # Lot components
│   ├── sales/           # Sales components
│   ├── payments/        # Payment components
│   ├── clients/         # Client components
│   ├── commissions/     # Commission components
│   ├── reports/         # Report components
│   └── chat/            # AI assistant
├── contexts/
│   ├── AuthContext.tsx  # Authentication + permissions
│   ├── DataContext.tsx  # Global data state
│   └── NotificationContext.tsx
├── hooks/               # Custom hooks (useProjects, useLots, etc.)
├── pages/
│   ├── admin/           # Admin pages
│   ├── sales/           # Sales pages
│   └── client/          # Client portal
├── types/
│   └── index.ts         # TypeScript definitions
├── utils/
│   ├── permissions.ts   # Permission logic
│   ├── formatters.ts    # Currency (COP), dates, status labels
│   └── calculations.ts  # Financial calculations
├── data/                # Mock data (development)
└── services/
    └── supabase/        # Future Supabase client
```

---

## Code Conventions

- **Path alias:** `@/` → `src/`
- **Components:** PascalCase, one per file
- **Hooks:** camelCase, `use` prefix
- **Types:** PascalCase, interfaces over types
- **Currency:** Colombian Pesos (COP)
- **Dates:** ISO format, Spanish locale for display

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/types/index.ts` | All TypeScript interfaces |
| `src/contexts/AuthContext.tsx` | Auth state + login/logout |
| `src/contexts/DataContext.tsx` | CRUD operations |
| `src/utils/permissions.ts` | Role-based permissions |
| `src/utils/formatters.ts` | Display formatting |
| `src/data/users.ts` | Mock users for development |

---

## Test Credentials

Password pattern: `{email prefix}123`

```
master@lotes.com / master123
admin@lotes.com / admin123
ventas@lotes.com / ventas123
cliente1@email.com / cliente1123
```

---

## Roadmap (Phases)

1. **Core** - Jerarquía completa, planes de pago, modelo de ventas
2. **Ventas y Cobranza** - Flujo completo, calendario pagos, recibos PDF
3. **Portal Cliente** - Dashboard, estado de cuenta, notificaciones
4. **Comisiones y Reportes** - Esquemas, cálculos, exportación
5. **Backend Supabase** - Migración, RLS, storage, emails
6. **Asistente IA** - Chat, consultas naturales, reportes por chat

---

## Important Business Rules

1. **Lote solo puede venderse si está `available`**
2. **Al pagar enganche, lote pasa a `reserved`**
3. **Al firmar contrato, lote pasa a `sold`**
4. **Pagos extra abonan directamente a capital**
5. **Comisiones requieren aprobación antes de pago**
6. **Alertas de morosidad escalan: 1→7→15→30 días**
7. **Cliente solo ve su propia información**
8. **Comercial solo ve proyectos asignados**

---

*Modelo de negocio: Single-tenant (una instalación por empresa)*
