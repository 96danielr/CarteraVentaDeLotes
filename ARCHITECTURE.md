# ARCHITECTURE.md - Sistema de Gestión de Cartera Inmobiliaria

> **DOCUMENTO DE REFERENCIA OBLIGATORIO**
> Este documento define la arquitectura oficial del sistema. Toda implementación debe alinearse con estas especificaciones.

---

## 1. VISIÓN DEL PRODUCTO

Sistema de gestión integral para desarrollos inmobiliarios de lotes, que permite:
- Administrar proyectos, etapas, manzanas y lotes
- Gestionar ventas con planes de pago flexibles
- Dar seguimiento a cobranza y morosidad
- Calcular y rastrear comisiones de vendedores
- Ofrecer portal de autoservicio para clientes

**Modelo de negocio:** Single-tenant (una instalación por empresa)

---

## 2. JERARQUÍA DE ENTIDADES

```
EMPRESA (tenant)
    └── PROYECTO (desarrollo inmobiliario)
            └── ETAPA (fase del desarrollo)
                    └── MANZANA (agrupación física)
                            └── LOTE (unidad de venta)
```

### 2.1 Proyecto
Desarrollo inmobiliario completo (ej: "Residencial Los Álamos").

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| name | string | Nombre del proyecto |
| description | string | Descripción general |
| location | string | Ubicación/dirección |
| coordinates | {lat, lng} | Geolocalización (opcional) |
| status | enum | `planning`, `active`, `sold_out`, `completed` |
| defaultPricePerM2 | number | Precio base por m² |
| images | string[] | Galería de imágenes |
| documents | Document[] | Planos, permisos, etc. |
| createdAt | date | Fecha de creación |
| updatedAt | date | Última actualización |

### 2.2 Etapa
Fase de desarrollo dentro de un proyecto (ej: "Etapa 1", "Fase Norte").

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| projectId | string | FK al proyecto |
| name | string | Nombre de la etapa |
| description | string | Descripción |
| status | enum | `planning`, `in_development`, `selling`, `sold_out` |
| order | number | Orden de visualización |
| pricePerM2 | number | Precio por m² (override del proyecto) |
| startDate | date | Fecha inicio de ventas |
| estimatedCompletion | date | Fecha estimada de entrega |

### 2.3 Manzana
Agrupación física de lotes (ej: "Manzana A", "Manzana 15").

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| stageId | string | FK a la etapa |
| name | string | Identificador (A, B, 1, 2, etc.) |
| totalLots | number | Cantidad de lotes |
| polygon | coordinates[] | Polígono del área (para mapas) |

### 2.4 Lote
Unidad de venta individual.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| blockId | string | FK a la manzana |
| number | string | Número de lote (ej: "01", "15-A") |
| area | number | Superficie en m² |
| pricePerM2 | number | Precio por m² (override) |
| totalPrice | number | Precio total calculado/fijo |
| status | enum | `available`, `reserved`, `sold`, `blocked` |
| lotType | enum | `regular`, `corner`, `irregular`, `premium` |
| dimensions | {front, depth} | Medidas frente x fondo |
| features | string[] | Características especiales |
| notes | string | Notas internas |

**Estados del Lote:**
- `available`: Disponible para venta
- `reserved`: Apartado con anticipo, en proceso de venta
- `sold`: Vendido, contrato firmado
- `blocked`: No disponible (legal, técnico, etc.)

---

## 3. SISTEMA DE VENTAS

### 3.1 Venta (Sale)
Representa la transacción de venta de un lote.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| lotId | string | FK al lote |
| clientId | string | FK al cliente |
| sellerId | string | FK al vendedor |
| paymentPlanId | string | FK al plan de pago |
| saleDate | date | Fecha de la venta |
| agreedPrice | number | Precio acordado |
| status | enum | `active`, `completed`, `cancelled` |
| contractNumber | string | Número de contrato |
| documents | Document[] | Contrato, identificaciones, etc. |
| notes | string | Observaciones |

### 3.2 Plan de Pago (PaymentPlan)
Esquema de financiamiento configurable.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| name | string | Nombre del plan (ej: "12 meses sin intereses") |
| description | string | Descripción para cliente |
| downPaymentPercent | number | % de enganche requerido |
| downPaymentFixed | number | Monto fijo de enganche (alternativo) |
| financingMonths | number | Plazo en meses |
| interestRate | number | Tasa de interés mensual (0 = sin intereses) |
| annualPayments | AnnualPayment[] | Pagos anuales obligatorios |
| isActive | boolean | Disponible para nuevas ventas |
| applicableTo | enum[] | Tipos de lote donde aplica |

### 3.3 Estructura de Pagos Anuales
```typescript
interface AnnualPayment {
  month: number;        // Mes del año (1-12)
  type: 'fixed' | 'percentage';
  amount: number;       // Monto fijo o porcentaje del saldo
  description: string;  // Ej: "Pago anual diciembre"
}
```

### 3.4 Pago (Payment)
Registro de cada transacción de pago.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| saleId | string | FK a la venta |
| type | enum | `down_payment`, `monthly`, `annual`, `extra` |
| scheduledDate | date | Fecha programada |
| paidDate | date | Fecha real de pago |
| scheduledAmount | number | Monto programado |
| paidAmount | number | Monto pagado |
| paymentNumber | number | Número de pago (mensualidad #) |
| method | enum | `cash`, `transfer`, `card`, `check` |
| reference | string | Referencia bancaria |
| receiptNumber | string | Número de recibo |
| status | enum | `pending`, `paid`, `partial`, `overdue` |
| notes | string | Observaciones |
| registeredBy | string | Usuario que registró |
| createdAt | date | Fecha de registro |

**Tipos de Pago:**
- `down_payment`: Enganche inicial
- `monthly`: Mensualidad regular
- `annual`: Pago anual obligatorio
- `extra`: Pago adelantado/extra (abona a capital)

---

## 4. SISTEMA DE USUARIOS Y ROLES

### 4.1 Roles del Sistema

| Rol | Código | Descripción |
|-----|--------|-------------|
| Super Admin | `master` | Control total, configuración del sistema |
| Administrador | `admin` | Gestión operativa, sin eliminación |
| Comercial/Ventas | `comercial` | Operaciones de venta y cobranza |
| Cliente | `cliente` | Solo visualización de su información |

### 4.2 Matriz de Permisos

| Permiso | master | admin | comercial | cliente |
|---------|--------|-------|-----------|---------|
| **PROYECTOS** |
| Ver todos los proyectos | ✅ | ✅ | ✅ | ❌ |
| Crear proyecto | ✅ | ✅ | ❌ | ❌ |
| Editar proyecto | ✅ | ✅ | ❌ | ❌ |
| Eliminar proyecto | ✅ | ❌ | ❌ | ❌ |
| **LOTES** |
| Ver inventario completo | ✅ | ✅ | ✅ | ❌ |
| Modificar lotes | ✅ | ✅ | ❌ | ❌ |
| Reservar/Vender lotes | ✅ | ✅ | ✅ | ❌ |
| Cancelar ventas | ✅ | ✅ | ❌ | ❌ |
| **CLIENTES** |
| Ver todos los clientes | ✅ | ✅ | ✅ | ❌ |
| Crear/editar clientes | ✅ | ✅ | ✅ | ❌ |
| Ver solo su información | - | - | - | ✅ |
| **PAGOS** |
| Registrar pagos | ✅ | ✅ | ✅ | ❌ |
| Modificar pagos | ✅ | ✅ | ❌ | ❌ |
| Eliminar pagos | ✅ | ❌ | ❌ | ❌ |
| **COMISIONES** |
| Ver todas las comisiones | ✅ | ✅ | ❌ | ❌ |
| Ver comisiones propias | ✅ | ✅ | ✅ | ❌ |
| Marcar como pagadas | ✅ | ✅ | ❌ | ❌ |
| **REPORTES** |
| Reportes completos | ✅ | ✅ | ❌ | ❌ |
| Reportes de ventas propias | ✅ | ✅ | ✅ | ❌ |
| Estado de cuenta propio | - | - | - | ✅ |
| **CONFIGURACIÓN** |
| Gestión de usuarios | ✅ | ❌ | ❌ | ❌ |
| Planes de pago | ✅ | ✅ | ❌ | ❌ |
| Configuración general | ✅ | ❌ | ❌ | ❌ |

### 4.3 Usuario (User)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| email | string | Email (único, login) |
| name | string | Nombre completo |
| phone | string | Teléfono |
| role | enum | Rol del sistema |
| avatar | string | URL de imagen |
| isActive | boolean | Cuenta activa |
| assignedProjects | string[] | Proyectos asignados (comercial) |
| createdAt | date | Fecha de creación |
| lastLogin | date | Último acceso |

### 4.4 Cliente (Client) - Extensión de User

| Campo | Tipo | Descripción |
|-------|------|-------------|
| userId | string | FK al usuario |
| rfc | string | RFC para facturación |
| curp | string | CURP |
| address | Address | Dirección completa |
| birthDate | date | Fecha de nacimiento |
| maritalStatus | enum | Estado civil |
| occupation | string | Ocupación |
| employer | string | Empleador |
| references | Reference[] | Referencias personales |
| documents | Document[] | INE, comprobantes, etc. |

---

## 5. SISTEMA DE COMISIONES

### 5.1 Esquema de Comisión (CommissionScheme)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| name | string | Nombre del esquema |
| type | enum | `percentage`, `fixed`, `tiered` |
| basePercentage | number | % base sobre precio de venta |
| tiers | Tier[] | Escalas por volumen/monto |
| paymentTrigger | enum | `on_sale`, `on_down_payment`, `on_completion` |
| isActive | boolean | Esquema activo |

### 5.2 Comisión (Commission)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| saleId | string | FK a la venta |
| sellerId | string | FK al vendedor |
| schemeId | string | FK al esquema aplicado |
| saleAmount | number | Monto de la venta |
| commissionAmount | number | Monto de comisión calculado |
| status | enum | `pending`, `approved`, `paid`, `cancelled` |
| approvedBy | string | Usuario que aprobó |
| approvedAt | date | Fecha de aprobación |
| paidAt | date | Fecha de pago |
| paymentReference | string | Referencia del pago |
| notes | string | Observaciones |

---

## 6. ASISTENTE DE INTELIGENCIA ARTIFICIAL

### 6.1 Descripción General
Chat conversacional con IA que tiene acceso a todos los datos del sistema, permitiendo consultas en lenguaje natural.

### 6.2 Capacidades del Asistente

| Categoría | Ejemplos de Consultas |
|-----------|----------------------|
| Inventario | "¿Cuántos lotes disponibles hay en Etapa 2?" |
| Clientes | "Muéstrame los datos de Juan Pérez" |
| Morosidad | "¿Quiénes tienen pagos vencidos esta semana?" |
| Métricas | "¿Cuál fue el total de ventas del mes?" |
| Comisiones | "¿Cuánto ha ganado Roberto en comisiones?" |
| Reportes | "Genera un reporte de cobranza pendiente" |

### 6.3 Arquitectura del Chat IA

```
Usuario envía mensaje
       ↓
Frontend captura input
       ↓
Backend procesa contexto
       ↓
Consulta a base de datos (Supabase)
       ↓
Construye prompt con datos relevantes
       ↓
Envía a LLM (Claude/GPT)
       ↓
Respuesta formateada al usuario
```

### 6.4 Modelo de Datos - Chat

```typescript
interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    queryType?: string;      // tipo de consulta detectada
    entitiesFound?: string[]; // entidades mencionadas
    sqlGenerated?: string;   // query ejecutada (debug)
  };
  createdAt: date;
}

interface ChatSession {
  id: string;
  userId: string;
  title: string;           // generado del primer mensaje
  messagesCount: number;
  createdAt: date;
  lastMessageAt: date;
}
```

### 6.5 Permisos del Chat por Rol

| Rol | Acceso a Datos |
|-----|----------------|
| master | Todo el sistema |
| admin | Todo excepto configuración |
| comercial | Sus ventas, clientes asignados, comisiones propias |
| cliente | Solo su propia información |

### 6.6 Funciones del Asistente

- **Búsqueda inteligente**: Encuentra clientes, lotes, pagos por cualquier criterio
- **Cálculos en tiempo real**: Saldos, proyecciones, totales
- **Generación de reportes**: Crear reportes bajo demanda
- **Alertas proactivas**: Notificar situaciones importantes
- **Navegación asistida**: Llevar al usuario a la sección correcta

### 6.7 Consideraciones Técnicas

- Rate limiting por usuario (evitar abuso)
- Caché de consultas frecuentes
- Logging de conversaciones para mejora continua
- Fallback a búsqueda tradicional si IA no disponible
- Sanitización de queries generadas (prevenir SQL injection)

---

## 7. SISTEMA DE ALERTAS Y NOTIFICACIONES

### 7.1 Tipos de Alertas

| Tipo | Destinatario | Trigger |
|------|--------------|---------|
| `payment_reminder` | Cliente | 5 días antes del vencimiento |
| `payment_due` | Cliente | Día del vencimiento |
| `payment_overdue` | Cliente, Admin | 1, 7, 15, 30 días de atraso |
| `payment_received` | Cliente | Al registrar pago |
| `sale_completed` | Cliente, Vendedor | Al completar venta |
| `commission_approved` | Vendedor | Al aprobar comisión |
| `document_uploaded` | Cliente | Al subir documento |

### 7.2 Notificación (Notification)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| userId | string | Destinatario |
| type | enum | Tipo de alerta |
| title | string | Título |
| message | string | Contenido |
| relatedEntity | {type, id} | Entidad relacionada |
| isRead | boolean | Leída |
| createdAt | date | Fecha de creación |
| channel | enum[] | `in_app`, `email`, `sms` |

---

## 8. REPORTES Y EXPORTACIÓN

### 8.1 Reportes Disponibles

| Reporte | Descripción | Roles |
|---------|-------------|-------|
| Inventario de lotes | Disponibilidad por proyecto/etapa/manzana | admin, master |
| Ventas del período | Ventas por fecha, vendedor, proyecto | admin, master |
| Cobranza | Pagos recibidos, pendientes, vencidos | admin, master |
| Estado de cuenta | Detalle de cliente individual | todos |
| Morosidad | Clientes con pagos atrasados | admin, master |
| Comisiones | Comisiones por vendedor/período | admin, master |
| Proyección de ingresos | Pagos esperados próximos meses | admin, master |
| Comparativo de ventas | Mes actual vs anterior, año vs año | admin, master |

### 8.2 Formatos de Exportación
- **PDF**: Estados de cuenta, recibos, contratos
- **Excel**: Reportes tabulares, datos para análisis
- **CSV**: Exportación de datos masiva

---

## 9. ARQUITECTURA TÉCNICA

### 9.1 Stack Tecnológico

**Frontend (actual):**
- React 18 + TypeScript
- Vite (bundler)
- Tailwind CSS + shadcn/ui
- React Router v6
- Context API (estado local)
- @react-pdf/renderer (generación PDF)

**Backend (futuro - Supabase):**
- PostgreSQL (base de datos)
- Supabase Auth (autenticación)
- Supabase Storage (archivos)
- Row Level Security (permisos)
- Edge Functions (lógica servidor)

### 9.2 Estructura de Carpetas

```
src/
├── components/
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── layout/          # Layout, Sidebar, Header
│   ├── auth/            # ProtectedRoute, LoginForm
│   ├── projects/        # Componentes de proyectos
│   ├── lots/            # Componentes de lotes
│   ├── sales/           # Componentes de ventas
│   ├── payments/        # Componentes de pagos
│   ├── clients/         # Componentes de clientes
│   ├── commissions/     # Componentes de comisiones
│   ├── reports/         # Componentes de reportes
│   ├── notifications/   # Componentes de alertas
│   └── chat/            # Asistente IA
├── contexts/
│   ├── AuthContext.tsx  # Autenticación y permisos
│   ├── DataContext.tsx  # Estado global de datos
│   ├── NotificationContext.tsx
│   └── ChatContext.tsx  # Estado del asistente IA
├── hooks/
│   ├── useProjects.ts
│   ├── useLots.ts
│   ├── useSales.ts
│   ├── usePayments.ts
│   ├── useReports.ts
│   └── useChat.ts       # Hook para asistente IA
├── pages/
│   ├── admin/           # Páginas de administración
│   ├── sales/           # Páginas de ventas
│   └── client/          # Portal del cliente
├── services/
│   └── supabase/        # Cliente y queries de Supabase
├── types/
│   └── index.ts         # Definiciones TypeScript
├── utils/
│   ├── permissions.ts   # Lógica de permisos
│   ├── formatters.ts    # Formateo de datos
│   ├── calculations.ts  # Cálculos financieros
│   └── validators.ts    # Validaciones
├── data/                # Mock data (desarrollo)
└── lib/
    └── utils.ts         # Utilidades generales
```

### 9.3 Convenciones de Código

- **Path alias:** `@/` → `src/`
- **Componentes:** PascalCase, un componente por archivo
- **Hooks:** camelCase, prefijo `use`
- **Tipos:** PascalCase, interfaces preferidas sobre types
- **Archivos:** kebab-case para archivos, PascalCase para componentes

---

## 10. FLUJOS DE NEGOCIO PRINCIPALES

### 10.1 Flujo de Venta

```
1. Cliente interesado
   ↓
2. Vendedor selecciona lote disponible
   ↓
3. Vendedor selecciona plan de pago
   ↓
4. Sistema calcula:
   - Enganche
   - Mensualidades
   - Pagos anuales (si aplica)
   - Fecha de cada pago
   ↓
5. Cliente paga enganche
   ↓
6. Lote cambia a "reserved"
   ↓
7. Se genera contrato
   ↓
8. Lote cambia a "sold"
   ↓
9. Se activa calendario de pagos
   ↓
10. Se calcula comisión del vendedor
```

### 10.2 Flujo de Cobranza

```
1. Sistema verifica pagos del día
   ↓
2. Pagos próximos → Notificación recordatorio
   ↓
3. Pagos vencidos → Alerta de morosidad
   ↓
4. Vendedor/Admin registra pago
   ↓
5. Sistema actualiza:
   - Estado del pago
   - Saldo del cliente
   - Progreso de la venta
   ↓
6. Se genera recibo PDF
   ↓
7. Notificación al cliente
```

### 10.3 Flujo de Morosidad

```
1. Pago no recibido en fecha
   ↓
2. Día 1: Alerta interna + notificación cliente
   ↓
3. Día 7: Segunda notificación
   ↓
4. Día 15: Escalamiento a admin
   ↓
5. Día 30: Marcado como moroso crítico
   ↓
6. Acción manual (llamada, visita, etc.)
```

---

## 11. CÁLCULOS FINANCIEROS

### 11.1 Cálculo de Plan de Pago

```typescript
function calculatePaymentPlan(
  totalPrice: number,
  plan: PaymentPlan,
  startDate: Date
): ScheduledPayment[] {
  const payments: ScheduledPayment[] = [];

  // 1. Calcular enganche
  const downPayment = plan.downPaymentFixed
    || (totalPrice * plan.downPaymentPercent / 100);

  // 2. Saldo a financiar
  const financeAmount = totalPrice - downPayment;

  // 3. Mensualidad (con o sin intereses)
  const monthlyPayment = plan.interestRate > 0
    ? calculateAmortization(financeAmount, plan.interestRate, plan.financingMonths)
    : financeAmount / plan.financingMonths;

  // 4. Generar calendario
  // ... enganche + mensualidades + anuales

  return payments;
}
```

### 11.2 Estado de Cuenta

```typescript
interface AccountStatement {
  client: Client;
  sale: Sale;
  lot: Lot;
  project: Project;

  // Montos
  totalPrice: number;
  downPaymentAmount: number;
  totalPaid: number;
  totalPending: number;

  // Progreso
  paidPercentage: number;
  paymentsCompleted: number;
  paymentsRemaining: number;

  // Próximo pago
  nextPayment: {
    date: Date;
    amount: number;
    type: PaymentType;
  };

  // Estado
  isOverdue: boolean;
  daysOverdue: number;
  overdueAmount: number;

  // Historial
  payments: Payment[];
}
```

---

## 12. CONSIDERACIONES DE SEGURIDAD

- Autenticación obligatoria para todas las rutas excepto login
- Permisos verificados en frontend Y backend (Row Level Security)
- Tokens JWT con expiración
- Logs de auditoría para operaciones críticas
- Encriptación de datos sensibles (RFC, CURP)
- Validación de inputs en cliente y servidor

---

## 13. ROADMAP DE IMPLEMENTACIÓN

### Fase 1: Core (actual → próximas semanas)
- [x] Estructura base del proyecto
- [x] Sistema de autenticación mock
- [x] CRUD de proyectos básico
- [ ] Jerarquía completa: Etapas y Manzanas
- [ ] Planes de pago configurables
- [ ] Modelo de ventas completo

### Fase 2: Ventas y Cobranza
- [ ] Flujo de venta completo
- [ ] Calendario de pagos automático
- [ ] Registro de pagos
- [ ] Estados de cuenta
- [ ] Generación de recibos PDF

### Fase 3: Portal Cliente
- [ ] Dashboard del cliente
- [ ] Visualización de estado de cuenta
- [ ] Historial de pagos
- [ ] Descarga de documentos
- [ ] Sistema de notificaciones

### Fase 4: Comisiones y Reportes
- [ ] Configuración de esquemas de comisión
- [ ] Cálculo automático de comisiones
- [ ] Reportes avanzados
- [ ] Exportación Excel/PDF
- [ ] Dashboard de métricas

### Fase 5: Integración Backend
- [ ] Migración a Supabase
- [ ] Row Level Security
- [ ] Notificaciones por email
- [ ] Storage para documentos

### Fase 6: Asistente de Inteligencia Artificial
- [ ] Interfaz de chat en la aplicación
- [ ] Integración con LLM (Claude/GPT)
- [ ] Consultas en lenguaje natural a la base de datos
- [ ] Generación de reportes por chat
- [ ] Permisos de acceso a datos por rol

---

*Última actualización: Enero 2025*
