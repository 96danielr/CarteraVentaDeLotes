import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const colors = {
  primary: '#10b981',
  secondary: '#0ea5e9',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  dark: '#0f172a',
  gray: '#64748b',
  grayLight: '#94a3b8',
  white: '#ffffff',
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  cover: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
  },
  coverTitle: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: colors.dark,
    marginBottom: 10,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 3,
    marginBottom: 40,
  },
  coverInfo: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 8,
    textAlign: 'center',
  },
  coverVersion: {
    fontSize: 10,
    color: colors.grayLight,
    marginTop: 60,
    textAlign: 'center',
    lineHeight: 1.6,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: colors.dark,
  },
  headerSubtitle: {
    fontSize: 9,
    color: colors.gray,
  },

  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: colors.dark,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sectionNumber: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    marginRight: 8,
  },

  subsection: {
    marginBottom: 12,
    marginLeft: 8,
  },
  subsectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors.dark,
    marginBottom: 6,
  },

  paragraph: {
    fontSize: 9,
    color: colors.dark,
    lineHeight: 1.6,
    marginBottom: 8,
    textAlign: 'justify',
  },

  bulletList: {
    marginLeft: 12,
    marginBottom: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bullet: {
    width: 12,
    fontSize: 9,
    color: colors.primary,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: colors.dark,
    lineHeight: 1.5,
  },

  numberedItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 5,
  },
  numberBullet: {
    width: 18,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
  },

  table: {
    width: '100%',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.dark,
    padding: 6,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableCell: {
    flex: 1,
    fontSize: 8,
    color: colors.dark,
  },
  tableCellBold: {
    flex: 1,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.dark,
  },
  tableCellCenter: {
    flex: 1,
    fontSize: 8,
    color: colors.dark,
    textAlign: 'center',
  },
  checkMark: {
    flex: 1,
    fontSize: 9,
    color: colors.primary,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  crossMark: {
    flex: 1,
    fontSize: 9,
    color: colors.danger,
    textAlign: 'center',
  },

  box: {
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  boxTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.dark,
    marginBottom: 5,
  },
  boxContent: {
    fontSize: 8,
    color: colors.gray,
    lineHeight: 1.5,
  },

  highlight: {
    backgroundColor: '#f0fdf4',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  highlightText: {
    fontSize: 9,
    color: '#166534',
  },

  warning: {
    backgroundColor: '#fef3c7',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  warningText: {
    fontSize: 8,
    color: '#92400e',
  },

  danger: {
    backgroundColor: '#fef2f2',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  dangerText: {
    fontSize: 8,
    color: '#991b1b',
  },

  flowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    flexWrap: 'wrap',
  },
  flowBox: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginHorizontal: 3,
    marginVertical: 2,
  },
  flowText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
    textAlign: 'center',
  },
  flowArrow: {
    fontSize: 10,
    color: colors.gray,
    marginHorizontal: 3,
  },

  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 7,
    color: colors.grayLight,
  },

  twoCol: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },

  roleBox: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  roleTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: 8,
    color: colors.gray,
    lineHeight: 1.5,
  },
});

const today = new Date().toLocaleDateString('es-CO', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export function BusinessLogicPDF() {
  return (
    <Document>
      {/* ==================== PORTADA ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.cover}>
          <Text style={styles.coverSubtitle}>DOCUMENTO DE ESPECIFICACIÓN FUNCIONAL</Text>
          <Text style={styles.coverTitle}>Sistema de Gestión{'\n'}de Cartera de Lotes</Text>

          <View style={{ marginTop: 30, alignItems: 'center' }}>
            <Text style={[styles.coverInfo, { fontSize: 14, fontFamily: 'Helvetica-Bold', color: colors.primary }]}>
              INVERSIONES TERRA VALORIS S.A.S
            </Text>
            <Text style={styles.coverInfo}>Documento de Lógica de Negocio y Reglas del Sistema</Text>
          </View>

          <View style={{ marginTop: 50, padding: 20, backgroundColor: '#f8fafc', borderRadius: 8, width: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 9, color: colors.gray }}>Versión:</Text>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>1.0 (POC)</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 9, color: colors.gray }}>Fecha:</Text>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>{today}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 9, color: colors.gray }}>Estado:</Text>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: colors.warning }}>En Revisión</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 9, color: colors.gray }}>Páginas:</Text>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>12</Text>
            </View>
          </View>

          <Text style={styles.coverVersion}>
            Este documento describe las reglas de negocio, flujos operativos y especificaciones{'\n'}
            funcionales del sistema. Por favor revisar y enviar correcciones o sugerencias.
          </Text>

          <View style={{ marginTop: 40, padding: 15, backgroundColor: '#fef3c7', borderRadius: 6, width: '80%' }}>
            <Text style={{ fontSize: 9, color: '#92400e', textAlign: 'center', fontFamily: 'Helvetica-Bold' }}>
              DOCUMENTO CONFIDENCIAL - SOLO PARA USO INTERNO
            </Text>
          </View>
        </View>
      </Page>

      {/* ==================== ÍNDICE ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tabla de Contenido</Text>
        </View>

        <View style={styles.section}>
          {[
            { num: '1', title: 'Resumen Ejecutivo', page: '3' },
            { num: '2', title: 'Arquitectura del Sistema', page: '3' },
            { num: '3', title: 'Modelo de Datos - Jerarquía', page: '4' },
            { num: '4', title: 'Entidad: Lote (Detalle Completo)', page: '4' },
            { num: '5', title: 'Sistema de Roles y Permisos', page: '5' },
            { num: '6', title: 'Matriz de Permisos Detallada', page: '6' },
            { num: '7', title: 'Estados del Lote y Transiciones', page: '7' },
            { num: '8', title: 'Flujo de Venta Completo', page: '7' },
            { num: '9', title: 'Sistema de Pagos', page: '8' },
            { num: '10', title: 'Planes de Financiamiento', page: '8' },
            { num: '11', title: 'Sistema de Comisiones', page: '9' },
            { num: '12', title: 'Cálculo de Comisiones', page: '9' },
            { num: '13', title: 'Sistema de Alertas', page: '10' },
            { num: '14', title: 'Reglas de Negocio Críticas', page: '10' },
            { num: '15', title: 'Validaciones del Sistema', page: '11' },
            { num: '16', title: 'Preguntas Pendientes', page: '11' },
            { num: '17', title: 'Glosario de Términos', page: '12' },
          ].map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
              <Text style={{ fontSize: 10, color: colors.dark }}>
                <Text style={{ fontFamily: 'Helvetica-Bold', color: colors.primary }}>{item.num}.</Text> {item.title}
              </Text>
              <Text style={{ fontSize: 10, color: colors.gray }}>{item.page}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.highlight, { marginTop: 20 }]}>
          <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#166534', marginBottom: 4 }}>
            Cómo usar este documento:
          </Text>
          <Text style={styles.highlightText}>
            1. Revisar cada sección y validar que la lógica descrita coincide con las necesidades del negocio.{'\n'}
            2. Marcar con color rojo o comentarios las secciones que requieren cambios.{'\n'}
            3. Responder las preguntas pendientes de la sección 16.{'\n'}
            4. Enviar el documento con las correcciones al equipo de desarrollo.
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Terra Valoris - Especificación Funcional v1.0</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>

      {/* ==================== PÁGINA 3: RESUMEN Y ARQUITECTURA ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Resumen Ejecutivo y Arquitectura</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>1.</Text> Resumen Ejecutivo
          </Text>
          <Text style={styles.paragraph}>
            El Sistema de Gestión de Cartera de Lotes es una plataforma web integral diseñada para
            administrar el ciclo completo de venta de lotes en desarrollos inmobiliarios. Permite
            gestionar proyectos, controlar inventario de lotes, administrar clientes, procesar pagos,
            dar seguimiento a la cobranza y calcular comisiones de vendedores.
          </Text>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Objetivos Principales</Text>
                <Text style={styles.boxContent}>
                  • Centralizar información de proyectos y lotes{'\n'}
                  • Automatizar el proceso de venta{'\n'}
                  • Controlar la cartera de cobranza{'\n'}
                  • Calcular comisiones automáticamente{'\n'}
                  • Generar reportes ejecutivos{'\n'}
                  • Permitir pagos en línea a clientes
                </Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Beneficios Esperados</Text>
                <Text style={styles.boxContent}>
                  • Reducción de errores manuales{'\n'}
                  • Visibilidad en tiempo real{'\n'}
                  • Mejor control de cartera vencida{'\n'}
                  • Transparencia en comisiones{'\n'}
                  • Autoservicio para clientes{'\n'}
                  • Toma de decisiones informada
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>2.</Text> Arquitectura del Sistema
          </Text>

          <View style={styles.box}>
            <Text style={styles.boxTitle}>Modelo de Despliegue: Single-Tenant</Text>
            <Text style={styles.boxContent}>
              Cada instalación del sistema es independiente para cada empresa constructora/desarrolladora.
              Esto significa que los datos de cada cliente están completamente aislados y pueden
              personalizarse las configuraciones según las necesidades específicas de cada empresa.
            </Text>
          </View>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Tecnología Frontend</Text>
                <Text style={styles.boxContent}>
                  • React 18 con TypeScript{'\n'}
                  • Tailwind CSS para estilos{'\n'}
                  • React Router para navegación{'\n'}
                  • Context API para estado global{'\n'}
                  • React-PDF para documentos
                </Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Backend (Futuro)</Text>
                <Text style={styles.boxContent}>
                  • Supabase (PostgreSQL){'\n'}
                  • Autenticación integrada{'\n'}
                  • Row Level Security (RLS){'\n'}
                  • Storage para documentos{'\n'}
                  • Edge Functions
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.warning}>
            <Text style={styles.warningText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>NOTA IMPORTANTE:</Text> Actualmente el sistema
              funciona como POC (Prueba de Concepto) con datos en memoria. En producción se conectará
              a una base de datos real con persistencia y seguridad completa.
            </Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Terra Valoris - Especificación Funcional v1.0</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>

      {/* ==================== PÁGINA 4: MODELO DE DATOS ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Modelo de Datos</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>3.</Text> Jerarquía del Sistema
          </Text>
          <Text style={styles.paragraph}>
            El sistema organiza los lotes en una estructura jerárquica de 4 niveles que permite
            una gestión ordenada y escalable de grandes desarrollos inmobiliarios:
          </Text>

          <View style={styles.flowContainer}>
            <View style={[styles.flowBox, { backgroundColor: colors.primary }]}>
              <Text style={styles.flowText}>PROYECTO</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={[styles.flowBox, { backgroundColor: colors.secondary }]}>
              <Text style={styles.flowText}>ETAPA</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={[styles.flowBox, { backgroundColor: colors.purple }]}>
              <Text style={styles.flowText}>MANZANA</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={[styles.flowBox, { backgroundColor: colors.warning }]}>
              <Text style={styles.flowText}>LOTE</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Entidad</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2.5 }]}>Descripción</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Ejemplo</Text>
            </View>
            {[
              ['PROYECTO', 'Desarrollo inmobiliario completo. Contiene toda la información general del fraccionamiento.', 'Residencial Los Pinos'],
              ['ETAPA', 'Fase de desarrollo. Permite ventas escalonadas y precios diferenciados por fase.', 'Etapa 1, Etapa 2'],
              ['MANZANA', 'Agrupación física de lotes. Identificada por letra para facilitar ubicación.', 'Manzana A, Manzana B'],
              ['LOTE', 'Unidad de venta. Contiene área, precio, estado y datos del comprador.', 'Lote A-01, Lote B-15'],
            ].map((row, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCellBold, { flex: 1.2 }]}>{row[0]}</Text>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>{row[1]}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{row[2]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>4.</Text> Entidad: Lote (Detalle Completo)
          </Text>
          <Text style={styles.paragraph}>
            El lote es la entidad central del sistema. A continuación se detallan todos sus atributos:
          </Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 1.3 }]}>Campo</Text>
              <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Tipo</Text>
              <Text style={[styles.tableHeaderCell, { flex: 0.6 }]}>Req.</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2.3 }]}>Descripción</Text>
            </View>
            {[
              ['id', 'String', 'Sí', 'Identificador único del sistema'],
              ['projectId', 'String', 'Sí', 'Referencia al proyecto padre'],
              ['number', 'String', 'Sí', 'Número visible del lote (ej: A-01)'],
              ['block', 'String', 'No', 'Manzana a la que pertenece'],
              ['area', 'Number', 'Sí', 'Superficie en metros cuadrados (m²)'],
              ['price', 'Number', 'Sí', 'Precio total de venta en COP'],
              ['status', 'Enum', 'Sí', 'Estado: available, reserved, sold'],
              ['clientId', 'String', 'No', 'ID del cliente comprador'],
              ['salesPersonId', 'String', 'No', 'ID del vendedor que realizó la venta'],
              ['downPayment', 'Number', 'No', 'Monto del enganche acordado'],
              ['monthlyPayment', 'Number', 'No', 'Monto de la mensualidad'],
              ['totalMonths', 'Number', 'No', 'Plazo total en meses'],
              ['startDate', 'Date', 'No', 'Fecha de inicio del plan de pagos'],
              ['saleDate', 'Date', 'No', 'Fecha en que se concretó la venta'],
              ['reservationDate', 'Date', 'No', 'Fecha en que se apartó el lote'],
              ['notes', 'String', 'No', 'Notas o comentarios adicionales'],
            ].map((row, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCellBold, { flex: 1.3 }]}>{row[0]}</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>{row[1]}</Text>
                <Text style={[styles.tableCellCenter, { flex: 0.6 }]}>{row[2]}</Text>
                <Text style={[styles.tableCell, { flex: 2.3 }]}>{row[3]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Terra Valoris - Especificación Funcional v1.0</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>

      {/* ==================== PÁGINA 5: ROLES ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sistema de Roles y Permisos</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>5.</Text> Descripción de Roles
          </Text>
          <Text style={styles.paragraph}>
            El sistema implementa 4 roles con diferentes niveles de acceso. Cada usuario tiene
            exactamente un rol asignado que determina qué puede ver y hacer en el sistema:
          </Text>

          <View style={[styles.roleBox, { backgroundColor: '#fef3c7', borderColor: colors.warning }]}>
            <Text style={[styles.roleTitle, { color: '#92400e' }]}>ROL: MASTER (Super Administrador)</Text>
            <Text style={styles.roleDesc}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>Descripción:</Text> Control total del sistema.
              Es el único que puede gestionar usuarios, eliminar registros y pagar comisiones.{'\n\n'}
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>Responsabilidades típicas:</Text>{'\n'}
              • Configuración inicial del sistema{'\n'}
              • Gestión de usuarios y roles{'\n'}
              • Aprobación final y pago de comisiones{'\n'}
              • Eliminación de registros erróneos{'\n'}
              • Acceso a reportes ejecutivos completos{'\n'}
              • Resolución de casos excepcionales
            </Text>
          </View>

          <View style={[styles.roleBox, { backgroundColor: '#f3e8ff', borderColor: colors.purple }]}>
            <Text style={[styles.roleTitle, { color: '#7c3aed' }]}>ROL: ADMIN (Administrador)</Text>
            <Text style={styles.roleDesc}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>Descripción:</Text> Administrador operativo
              del día a día. Gestiona proyectos, lotes, clientes y aprueba comisiones.{'\n\n'}
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>Responsabilidades típicas:</Text>{'\n'}
              • Crear y modificar proyectos{'\n'}
              • Gestionar inventario de lotes{'\n'}
              • Supervisar ventas y cobranza{'\n'}
              • Aprobar comisiones de vendedores{'\n'}
              • Generar reportes ejecutivos{'\n'}
              • Atender casos de clientes escalados
            </Text>
          </View>

          <View style={[styles.roleBox, { backgroundColor: '#f0fdf4', borderColor: colors.primary }]}>
            <Text style={[styles.roleTitle, { color: '#166534' }]}>ROL: COMERCIAL (Vendedor)</Text>
            <Text style={styles.roleDesc}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>Descripción:</Text> Personal de ventas.
              Atiende clientes, realiza ventas y registra pagos. Solo ve proyectos asignados.{'\n\n'}
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>Responsabilidades típicas:</Text>{'\n'}
              • Atender prospectos y clientes{'\n'}
              • Mostrar lotes disponibles{'\n'}
              • Realizar reservas y ventas{'\n'}
              • Registrar pagos de clientes{'\n'}
              • Dar seguimiento a su cartera{'\n'}
              • Consultar sus comisiones
            </Text>
          </View>

          <View style={[styles.roleBox, { backgroundColor: '#f0f9ff', borderColor: colors.secondary }]}>
            <Text style={[styles.roleTitle, { color: '#0369a1' }]}>ROL: CLIENTE (Comprador)</Text>
            <Text style={styles.roleDesc}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>Descripción:</Text> Comprador de lote(s).
              Acceso limitado exclusivamente a su información personal.{'\n\n'}
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>Puede hacer:</Text>{'\n'}
              • Ver estado de cuenta de sus lotes{'\n'}
              • Consultar historial de pagos{'\n'}
              • Realizar pagos en línea{'\n'}
              • Descargar recibos y estados de cuenta{'\n'}
              • Ver fechas de próximos pagos
            </Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Terra Valoris - Especificación Funcional v1.0</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>

      {/* ==================== PÁGINA 6: MATRIZ DE PERMISOS ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Matriz de Permisos Detallada</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>6.</Text> Permisos por Módulo y Rol
          </Text>

          <Text style={[styles.paragraph, { fontFamily: 'Helvetica-Bold', marginBottom: 4 }]}>
            Módulo: PROYECTOS
          </Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 2.5 }]}>Acción</Text>
              <Text style={styles.tableHeaderCell}>Master</Text>
              <Text style={styles.tableHeaderCell}>Admin</Text>
              <Text style={styles.tableHeaderCell}>Comercial</Text>
              <Text style={styles.tableHeaderCell}>Cliente</Text>
            </View>
            {[
              ['Ver todos los proyectos', 'SI', 'SI', 'Asignados', 'NO'],
              ['Crear proyecto nuevo', 'SI', 'SI', 'NO', 'NO'],
              ['Editar proyecto existente', 'SI', 'SI', 'NO', 'NO'],
              ['Eliminar proyecto', 'SI', 'NO', 'NO', 'NO'],
              ['Ver detalle de proyecto', 'SI', 'SI', 'Asignados', 'NO'],
            ].map((row, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>{row[0]}</Text>
                <Text style={row[1] === 'SI' ? styles.checkMark : row[1] === 'NO' ? styles.crossMark : styles.tableCellCenter}>{row[1]}</Text>
                <Text style={row[2] === 'SI' ? styles.checkMark : row[2] === 'NO' ? styles.crossMark : styles.tableCellCenter}>{row[2]}</Text>
                <Text style={row[3] === 'SI' ? styles.checkMark : row[3] === 'NO' ? styles.crossMark : styles.tableCellCenter}>{row[3]}</Text>
                <Text style={row[4] === 'SI' ? styles.checkMark : row[4] === 'NO' ? styles.crossMark : styles.tableCellCenter}>{row[4]}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.paragraph, { fontFamily: 'Helvetica-Bold', marginBottom: 4, marginTop: 10 }]}>
            Módulo: LOTES
          </Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 2.5 }]}>Acción</Text>
              <Text style={styles.tableHeaderCell}>Master</Text>
              <Text style={styles.tableHeaderCell}>Admin</Text>
              <Text style={styles.tableHeaderCell}>Comercial</Text>
              <Text style={styles.tableHeaderCell}>Cliente</Text>
            </View>
            {[
              ['Ver todos los lotes', 'SI', 'SI', 'Asignados', 'Propios'],
              ['Crear lote nuevo', 'SI', 'SI', 'NO', 'NO'],
              ['Editar información de lote', 'SI', 'SI', 'NO', 'NO'],
              ['Eliminar lote', 'SI', 'NO', 'NO', 'NO'],
              ['Reservar lote (asignar cliente)', 'SI', 'SI', 'SI', 'NO'],
              ['Vender lote (cambiar a vendido)', 'SI', 'SI', 'SI', 'NO'],
              ['Cancelar reserva/venta', 'SI', 'SI', 'NO', 'NO'],
            ].map((row, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>{row[0]}</Text>
                <Text style={row[1] === 'SI' ? styles.checkMark : row[1] === 'NO' ? styles.crossMark : styles.tableCellCenter}>{row[1]}</Text>
                <Text style={row[2] === 'SI' ? styles.checkMark : row[2] === 'NO' ? styles.crossMark : styles.tableCellCenter}>{row[2]}</Text>
                <Text style={row[3] === 'SI' ? styles.checkMark : row[3] === 'NO' ? styles.crossMark : styles.tableCellCenter}>{row[3]}</Text>
                <Text style={row[4] === 'SI' ? styles.checkMark : row[4] === 'NO' ? styles.crossMark : styles.tableCellCenter}>{row[4]}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.paragraph, { fontFamily: 'Helvetica-Bold', marginBottom: 4, marginTop: 10 }]}>
            Módulo: PAGOS
          </Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 2.5 }]}>Acción</Text>
              <Text style={styles.tableHeaderCell}>Master</Text>
              <Text style={styles.tableHeaderCell}>Admin</Text>
              <Text style={styles.tableHeaderCell}>Comercial</Text>
              <Text style={styles.tableHeaderCell}>Cliente</Text>
            </View>
            {[
              ['Ver todos los pagos', 'SI', 'SI', 'Propios', 'Propios'],
              ['Registrar pago de cliente', 'SI', 'SI', 'SI', 'NO'],
              ['Realizar pago en línea', 'NO', 'NO', 'NO', 'SI'],
              ['Anular/cancelar pago', 'SI', 'NO', 'NO', 'NO'],
              ['Descargar recibo', 'SI', 'SI', 'SI', 'SI'],
            ].map((row, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>{row[0]}</Text>
                <Text style={row[1] === 'SI' ? styles.checkMark : row[1] === 'NO' ? styles.crossMark : styles.tableCellCenter}>{row[1]}</Text>
                <Text style={row[2] === 'SI' ? styles.checkMark : row[2] === 'NO' ? styles.crossMark : styles.tableCellCenter}>{row[2]}</Text>
                <Text style={row[3] === 'SI' ? styles.checkMark : row[3] === 'NO' ? styles.crossMark : styles.tableCellCenter}>{row[3]}</Text>
                <Text style={row[4] === 'SI' ? styles.checkMark : row[4] === 'NO' ? styles.crossMark : styles.tableCellCenter}>{row[4]}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.paragraph, { fontFamily: 'Helvetica-Bold', marginBottom: 4, marginTop: 10 }]}>
            Módulo: COMISIONES
          </Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 2.5 }]}>Acción</Text>
              <Text style={styles.tableHeaderCell}>Master</Text>
              <Text style={styles.tableHeaderCell}>Admin</Text>
              <Text style={styles.tableHeaderCell}>Comercial</Text>
              <Text style={styles.tableHeaderCell}>Cliente</Text>
            </View>
            {[
              ['Ver todas las comisiones', 'SI', 'SI', 'NO', 'NO'],
              ['Ver comisiones propias', 'SI', 'SI', 'SI', 'NO'],
              ['Aprobar comisión', 'SI', 'SI', 'NO', 'NO'],
              ['Marcar comisión como pagada', 'SI', 'NO', 'NO', 'NO'],
              ['Cancelar comisión', 'SI', 'SI', 'NO', 'NO'],
            ].map((row, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>{row[0]}</Text>
                <Text style={row[1] === 'SI' ? styles.checkMark : row[1] === 'NO' ? styles.crossMark : styles.tableCellCenter}>{row[1]}</Text>
                <Text style={row[2] === 'SI' ? styles.checkMark : row[2] === 'NO' ? styles.crossMark : styles.tableCellCenter}>{row[2]}</Text>
                <Text style={row[3] === 'SI' ? styles.checkMark : row[3] === 'NO' ? styles.crossMark : styles.tableCellCenter}>{row[3]}</Text>
                <Text style={row[4] === 'SI' ? styles.checkMark : row[4] === 'NO' ? styles.crossMark : styles.tableCellCenter}>{row[4]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Terra Valoris - Especificación Funcional v1.0</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>

      {/* ==================== PÁGINA 7: ESTADOS Y FLUJO DE VENTA ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Estados del Lote y Flujo de Venta</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>7.</Text> Estados del Lote
          </Text>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <View style={[styles.box, { borderLeftWidth: 4, borderLeftColor: colors.primary }]}>
                <Text style={[styles.boxTitle, { color: colors.primary }]}>DISPONIBLE (available)</Text>
                <Text style={styles.boxContent}>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>Significado:</Text> El lote está libre y puede ser vendido a cualquier cliente.{'\n\n'}
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>Características:</Text>{'\n'}
                  • Visible en catálogo público{'\n'}
                  • Cualquier comercial puede ofrecerlo{'\n'}
                  • No tiene cliente asignado{'\n'}
                  • No tiene plan de pagos
                </Text>
              </View>
              <View style={[styles.box, { borderLeftWidth: 4, borderLeftColor: colors.warning }]}>
                <Text style={[styles.boxTitle, { color: colors.warning }]}>RESERVADO (reserved)</Text>
                <Text style={styles.boxContent}>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>Significado:</Text> Cliente pagó enganche, lote apartado temporalmente.{'\n\n'}
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>Características:</Text>{'\n'}
                  • No disponible para otros clientes{'\n'}
                  • Tiene cliente y vendedor asignado{'\n'}
                  • En proceso de firma de contrato{'\n'}
                  • Comisión en estado "pendiente"
                </Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={[styles.box, { borderLeftWidth: 4, borderLeftColor: colors.danger }]}>
                <Text style={[styles.boxTitle, { color: colors.danger }]}>VENDIDO (sold)</Text>
                <Text style={styles.boxContent}>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>Significado:</Text> Venta completada, contrato firmado.{'\n\n'}
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>Características:</Text>{'\n'}
                  • Contrato firmado vigente{'\n'}
                  • Plan de pagos activo{'\n'}
                  • Cliente tiene derechos legales{'\n'}
                  • Comisión puede ser aprobada
                </Text>
              </View>
              <View style={[styles.box, { borderLeftWidth: 4, borderLeftColor: colors.gray }]}>
                <Text style={[styles.boxTitle, { color: colors.gray }]}>BLOQUEADO (blocked)</Text>
                <Text style={styles.boxContent}>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>Significado:</Text> Lote no disponible por razones especiales.{'\n\n'}
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>Razones posibles:</Text>{'\n'}
                  • Problema legal pendiente{'\n'}
                  • Uso interno de la empresa{'\n'}
                  • Error de registro a corregir{'\n'}
                  • Reserva especial directiva
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>8.</Text> Flujo de Venta Completo
          </Text>

          <View style={styles.flowContainer}>
            <View style={[styles.flowBox, { backgroundColor: colors.primary }]}>
              <Text style={styles.flowText}>DISPONIBLE</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={[styles.flowBox, { backgroundColor: colors.secondary }]}>
              <Text style={styles.flowText}>CLIENTE{'\n'}INTERESADO</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={[styles.flowBox, { backgroundColor: colors.purple }]}>
              <Text style={styles.flowText}>PLAN DE{'\n'}PAGO</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={[styles.flowBox, { backgroundColor: '#f97316' }]}>
              <Text style={styles.flowText}>PAGO{'\n'}ENGANCHE</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={[styles.flowBox, { backgroundColor: colors.warning }]}>
              <Text style={styles.flowText}>RESERVADO</Text>
            </View>
          </View>

          <View style={styles.flowContainer}>
            <View style={[styles.flowBox, { backgroundColor: colors.warning }]}>
              <Text style={styles.flowText}>RESERVADO</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={[styles.flowBox, { backgroundColor: colors.purple }]}>
              <Text style={styles.flowText}>FIRMA{'\n'}CONTRATO</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={[styles.flowBox, { backgroundColor: colors.danger }]}>
              <Text style={styles.flowText}>VENDIDO</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={[styles.flowBox, { backgroundColor: colors.secondary }]}>
              <Text style={styles.flowText}>CALENDARIO{'\n'}PAGOS</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={[styles.flowBox, { backgroundColor: colors.primary }]}>
              <Text style={styles.flowText}>COMISIÓN{'\n'}GENERADA</Text>
            </View>
          </View>

          <View style={styles.bulletList}>
            {[
              { step: '1', desc: 'Comercial identifica cliente interesado en un lote disponible' },
              { step: '2', desc: 'Se presenta opciones de plan de pago (enganche, plazo, mensualidad)' },
              { step: '3', desc: 'Cliente acepta términos y realiza pago de enganche' },
              { step: '4', desc: 'Sistema cambia estado a "RESERVADO", asigna vendedor y cliente' },
              { step: '5', desc: 'Se genera contrato y se agenda firma con el cliente' },
              { step: '6', desc: 'Al firmar contrato, estado cambia a "VENDIDO"' },
              { step: '7', desc: 'Sistema genera calendario de pagos según plan acordado' },
              { step: '8', desc: 'Se crea comisión automática para el vendedor (estado: pendiente)' },
            ].map((item, i) => (
              <View key={i} style={styles.numberedItem}>
                <Text style={styles.numberBullet}>{item.step}.</Text>
                <Text style={styles.bulletText}>{item.desc}</Text>
              </View>
            ))}
          </View>

          <View style={styles.warning}>
            <Text style={styles.warningText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>IMPORTANTE:</Text> Si la reserva no se concreta
              (cliente no firma contrato en tiempo acordado), el lote puede volver a estado "DISPONIBLE"
              y la comisión pendiente se cancela.
            </Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Terra Valoris - Especificación Funcional v1.0</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>

      {/* ==================== PÁGINA 8: SISTEMA DE PAGOS ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sistema de Pagos</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>9.</Text> Tipos de Pago
          </Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Tipo</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Descripción</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1.8 }]}>Comportamiento en Sistema</Text>
            </View>
            {[
              ['ENGANCHE\n(down_payment)', 'Pago inicial obligatorio para reservar el lote. Generalmente 20% del valor total.', 'Cambia estado a "reservado".\nAsigna cliente y vendedor.\nGenera comisión pendiente.'],
              ['MENSUALIDAD\n(monthly)', 'Pago regular según calendario. Monto fijo acordado al inicio del plan.', 'Actualiza saldo pendiente.\nGenera recibo automático.\nActualiza estado de cuenta.'],
              ['PAGO ANUAL\n(annual)', 'Pago obligatorio una vez al año (si aplica según plan). Monto fijo o porcentaje.', 'Abona directamente a capital.\nPuede reducir plazo total.\nOpcional según configuración.'],
              ['EXTRA\n(extra)', 'Pago voluntario adicional. Cliente decide monto y momento. Sin obligación.', 'Abona directo a capital.\nReduce saldo pendiente.\nNo afecta monto de mensualidad.'],
            ].map((row, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCellBold, { flex: 1.2 }]}>{row[0]}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{row[1]}</Text>
                <Text style={[styles.tableCell, { flex: 1.8 }]}>{row[2]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>10.</Text> Plan de Financiamiento
          </Text>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Métodos de Pago Aceptados</Text>
                <Text style={styles.boxContent}>
                  • <Text style={{ fontFamily: 'Helvetica-Bold' }}>Efectivo (cash):</Text> Pago en oficina{'\n'}
                  • <Text style={{ fontFamily: 'Helvetica-Bold' }}>Transferencia (transfer):</Text> Bancaria o SPEI{'\n'}
                  • <Text style={{ fontFamily: 'Helvetica-Bold' }}>Tarjeta (card):</Text> Crédito o débito{'\n'}
                  • <Text style={{ fontFamily: 'Helvetica-Bold' }}>Cheque (check):</Text> A nombre de la empresa
                </Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Recibos de Pago</Text>
                <Text style={styles.boxContent}>
                  Cada pago genera automáticamente:{'\n'}
                  • Número de recibo único{'\n'}
                  • Formato: REC-YYYYMMDD-XXXX{'\n'}
                  • PDF descargable{'\n'}
                  • Registro en historial
                </Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={[styles.box, { backgroundColor: '#f0fdf4', borderColor: colors.primary }]}>
                <Text style={[styles.boxTitle, { color: '#166534' }]}>Ejemplo de Plan de Pago</Text>
                <Text style={[styles.boxContent, { color: '#166534' }]}>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>Lote A-01</Text>{'\n'}
                  Precio total: $700,000 COP{'\n'}
                  Enganche (20%): $140,000 COP{'\n'}
                  Saldo a financiar: $560,000 COP{'\n'}
                  Plazo: 60 meses{'\n'}
                  Mensualidad: $9,333 COP{'\n'}
                  Tasa de interés: 0%{'\n\n'}
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>Financiamiento directo sin intereses</Text>
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.danger}>
            <Text style={styles.dangerText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>REGLA DE PAGOS EXTRA:</Text> Los pagos adicionales
              (extra) abonan directamente al capital pendiente. Esto reduce el número de mensualidades
              restantes pero NO modifica el monto de la mensualidad acordada. El cliente sigue pagando
              la misma cantidad hasta liquidar.
            </Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Estado de Pago</Text>
              <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Descripción</Text>
            </View>
            {[
              ['PENDIENTE (pending)', 'Pago programado en calendario, aún no llega la fecha de vencimiento'],
              ['PAGADO (paid)', 'Pago realizado completo y a tiempo'],
              ['PARCIAL (partial)', 'Se realizó un pago menor al monto esperado, queda saldo'],
              ['VENCIDO (overdue)', 'Fecha de vencimiento pasó y no se ha recibido el pago completo'],
            ].map((row, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={styles.tableCellBold}>{row[0]}</Text>
                <Text style={[styles.tableCell, { flex: 3 }]}>{row[1]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Terra Valoris - Especificación Funcional v1.0</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>

      {/* ==================== PÁGINA 9: COMISIONES ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sistema de Comisiones</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>11.</Text> Ciclo de Vida de una Comisión
          </Text>

          <View style={styles.flowContainer}>
            <View style={[styles.flowBox, { backgroundColor: colors.gray }]}>
              <Text style={styles.flowText}>VENTA{'\n'}REALIZADA</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={[styles.flowBox, { backgroundColor: colors.warning }]}>
              <Text style={styles.flowText}>PENDIENTE</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={[styles.flowBox, { backgroundColor: colors.secondary }]}>
              <Text style={styles.flowText}>APROBADA</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={[styles.flowBox, { backgroundColor: colors.primary }]}>
              <Text style={styles.flowText}>PAGADA</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Estado</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Descripción</Text>
              <Text style={styles.tableHeaderCell}>Quién Cambia</Text>
              <Text style={styles.tableHeaderCell}>Qué se Registra</Text>
            </View>
            {[
              ['PENDIENTE', 'Comisión generada automáticamente al registrar venta. Esperando revisión.', 'Sistema (auto)', 'Fecha creación'],
              ['APROBADA', 'Comisión verificada y lista para pago. Venta confirmada correctamente.', 'Admin o Master', 'Quién y cuándo aprobó'],
              ['PAGADA', 'Comisión pagada al vendedor. Proceso completado.', 'Solo Master', 'Quién y cuándo pagó'],
              ['CANCELADA', 'Comisión anulada por venta cancelada, error u otra razón.', 'Admin o Master', 'Motivo de cancelación'],
            ].map((row, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={styles.tableCellBold}>{row[0]}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{row[1]}</Text>
                <Text style={styles.tableCell}>{row[2]}</Text>
                <Text style={styles.tableCell}>{row[3]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>12.</Text> Cálculo de Comisiones
          </Text>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Fórmula de Cálculo</Text>
                <Text style={[styles.boxContent, { fontFamily: 'Helvetica-Bold', fontSize: 10 }]}>
                  Comisión = Precio de Venta × Tasa%
                </Text>
                <Text style={[styles.boxContent, { marginTop: 6 }]}>
                  Ejemplo:{'\n'}
                  Precio: $700,000 COP{'\n'}
                  Tasa: 3%{'\n'}
                  Comisión: $700,000 × 0.03 = $21,000 COP
                </Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Momento de Generación (Trigger)</Text>
                <Text style={styles.boxContent}>
                  La comisión se genera cuando:{'\n\n'}
                  • <Text style={{ fontFamily: 'Helvetica-Bold' }}>on_down_payment:</Text> Al pagar enganche{'\n'}
                  • <Text style={{ fontFamily: 'Helvetica-Bold' }}>on_sale:</Text> Al firmar contrato{'\n'}
                  • <Text style={{ fontFamily: 'Helvetica-Bold' }}>on_completion:</Text> Al liquidar lote
                </Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Datos Registrados por Comisión</Text>
                <Text style={styles.boxContent}>
                  • ID único de comisión{'\n'}
                  • ID del vendedor{'\n'}
                  • ID del lote vendido{'\n'}
                  • Nombre del cliente{'\n'}
                  • Nombre del proyecto{'\n'}
                  • Monto de la venta{'\n'}
                  • Tasa de comisión aplicada{'\n'}
                  • Monto de comisión calculado{'\n'}
                  • Estado actual{'\n'}
                  • Fecha de creación{'\n'}
                  • Fecha y usuario que aprobó{'\n'}
                  • Fecha y usuario que pagó{'\n'}
                  • Notas adicionales
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Proyecto</Text>
              <Text style={styles.tableHeaderCell}>Tasa Estándar</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Observaciones</Text>
            </View>
            {[
              ['Residencial Los Pinos', '3.0%', 'Tasa estándar para lotes residenciales regulares'],
              ['Hacienda del Valle', '3.5%', 'Tasa mayor por lotes de mayor valor y exclusividad'],
            ].map((row, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={styles.tableCellBold}>{row[0]}</Text>
                <Text style={[styles.tableCell, { fontFamily: 'Helvetica-Bold', color: colors.primary }]}>{row[1]}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{row[2]}</Text>
              </View>
            ))}
          </View>

          <View style={styles.warning}>
            <Text style={styles.warningText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>PREGUNTA PENDIENTE:</Text> ¿Las tasas de comisión
              deben variar según el tipo de lote (esquina, irregular, premium)? ¿Hay bonos por volumen
              de ventas mensuales?
            </Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Terra Valoris - Especificación Funcional v1.0</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>

      {/* ==================== PÁGINA 10: ALERTAS Y REGLAS ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Alertas y Reglas de Negocio</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>13.</Text> Sistema de Alertas Automáticas
          </Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Tipo de Alerta</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Cuándo se Dispara</Text>
              <Text style={styles.tableHeaderCell}>Destinatario</Text>
              <Text style={styles.tableHeaderCell}>Canal</Text>
            </View>
            {[
              ['Recordatorio de pago', '5 días antes de vencer', 'Cliente', 'App, Email'],
              ['Pago vence hoy', 'Día del vencimiento', 'Cliente, Comercial', 'App, Email'],
              ['Mora 1 día', '1 día después de vencer', 'Cliente, Admin', 'App, Email'],
              ['Mora 7 días', '7 días de atraso', 'Admin, Master', 'App, Email'],
              ['Mora 15 días', '15 días de atraso', 'Admin, Master', 'App, Email, SMS'],
              ['Mora 30 días', '30 días de atraso', 'Master', 'App, Email, SMS'],
              ['Pago recibido', 'Al registrar pago', 'Cliente', 'App, Email'],
              ['Venta completada', 'Al firmar contrato', 'Comercial, Admin', 'App'],
              ['Comisión aprobada', 'Al aprobar comisión', 'Comercial', 'App, Email'],
              ['Comisión pagada', 'Al pagar comisión', 'Comercial', 'App, Email'],
            ].map((row, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCellBold, { flex: 1.5 }]}>{row[0]}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{row[1]}</Text>
                <Text style={styles.tableCell}>{row[2]}</Text>
                <Text style={styles.tableCell}>{row[3]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>14.</Text> Reglas de Negocio Críticas
          </Text>

          <View style={styles.highlight}>
            <Text style={[styles.highlightText, { fontFamily: 'Helvetica-Bold' }]}>
              Estas reglas son OBLIGATORIAS y el sistema las valida automáticamente:
            </Text>
          </View>

          <View style={styles.bulletList}>
            {[
              'Un lote SOLO puede venderse si su estado actual es "DISPONIBLE"',
              'Al pagar enganche, el lote cambia AUTOMÁTICAMENTE a "RESERVADO"',
              'Al firmar contrato, el lote cambia a "VENDIDO" y se activa calendario de pagos',
              'Los pagos tipo "EXTRA" abonan DIRECTAMENTE a capital (no a mensualidades futuras)',
              'Las comisiones REQUIEREN aprobación de Admin/Master antes de poder pagarse',
              'SOLO el Master puede marcar una comisión como "PAGADA"',
              'Un cliente SOLO puede ver información de SUS PROPIOS lotes y pagos',
              'Un comercial SOLO puede vender lotes de proyectos que tiene ASIGNADOS',
              'Las alertas de morosidad ESCALAN automáticamente: 1→7→15→30 días',
              'Cada pago genera un recibo con NÚMERO ÚNICO no repetible',
              'NO se pueden eliminar pagos una vez registrados (solo Master puede anular)',
              'Todo cambio de estado de lote queda registrado con fecha, hora y usuario',
            ].map((item, i) => (
              <View key={i} style={styles.numberedItem}>
                <Text style={styles.numberBullet}>{i + 1}.</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Terra Valoris - Especificación Funcional v1.0</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>

      {/* ==================== PÁGINA 11: VALIDACIONES Y PREGUNTAS ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Validaciones y Preguntas Pendientes</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>15.</Text> Validaciones del Sistema
          </Text>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Al Crear/Editar Lote</Text>
                <Text style={styles.boxContent}>
                  • Número de lote único por proyecto{'\n'}
                  • Área mayor a 0 m²{'\n'}
                  • Precio mayor a 0{'\n'}
                  • Estado válido del enum{'\n'}
                  • ProjectId existente
                </Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Al Registrar Pago</Text>
                <Text style={styles.boxContent}>
                  • Monto mayor a 0{'\n'}
                  • Lote existente{'\n'}
                  • Cliente existente{'\n'}
                  • Tipo de pago válido{'\n'}
                  • Método de pago válido{'\n'}
                  • Fecha no futura
                </Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Al Reservar/Vender Lote</Text>
                <Text style={styles.boxContent}>
                  • Lote en estado "disponible"{'\n'}
                  • Cliente válido seleccionado{'\n'}
                  • Vendedor válido asignado{'\n'}
                  • Enganche mayor a 0{'\n'}
                  • Mensualidad mayor a 0{'\n'}
                  • Plazo mayor a 0 meses{'\n'}
                  • Fecha inicio válida
                </Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Al Aprobar Comisión</Text>
                <Text style={styles.boxContent}>
                  • Comisión en estado "pendiente"{'\n'}
                  • Usuario con rol Admin o Master{'\n'}
                  • Venta asociada válida
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>16.</Text> Preguntas Pendientes para el Cliente
          </Text>

          <View style={styles.danger}>
            <Text style={[styles.dangerText, { fontFamily: 'Helvetica-Bold', marginBottom: 4 }]}>
              IMPORTANTE: Estas preguntas requieren respuesta para completar la especificación:
            </Text>
          </View>

          <Text style={[styles.paragraph, { fontFamily: 'Helvetica-Bold', marginTop: 8 }]}>Sobre Planes de Pago:</Text>
          <View style={styles.bulletList}>
            {[
              '¿Se manejan tasas de interés en el financiamiento o siempre es 0%?',
              '¿Cuál es el porcentaje MÍNIMO de enganche aceptado? (¿15%, 20%, otro?)',
              '¿Cuál es el plazo MÁXIMO de financiamiento? (¿48, 60, 72 meses?)',
              '¿Se requieren pagos anuales obligatorios además de las mensualidades?',
              '¿Qué sucede si el cliente quiere liquidar anticipadamente? ¿Hay descuento?',
            ].map((item, i) => (
              <View key={i} style={styles.bulletItem}>
                <Text style={styles.bullet}>?</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.paragraph, { fontFamily: 'Helvetica-Bold', marginTop: 8 }]}>Sobre Comisiones:</Text>
          <View style={styles.bulletList}>
            {[
              '¿Las tasas varían por proyecto, etapa, tipo de lote o vendedor?',
              '¿La comisión se genera al reservar (enganche) o al firmar contrato?',
              '¿Existen bonos adicionales por volumen de ventas mensual/trimestral?',
              '¿Hay comisiones especiales para ventas de contado?',
              '¿Quién puede modificar las tasas de comisión?',
            ].map((item, i) => (
              <View key={i} style={styles.bulletItem}>
                <Text style={styles.bullet}>?</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.paragraph, { fontFamily: 'Helvetica-Bold', marginTop: 8 }]}>Sobre Morosidad:</Text>
          <View style={styles.bulletList}>
            {[
              '¿Se cobran intereses moratorios? ¿Cuál es la tasa mensual?',
              '¿Después de cuántos días de mora se considera CANCELAR la venta?',
              '¿Cuál es el proceso para recuperar un lote por incumplimiento de pago?',
              '¿Se devuelve dinero al cliente si se cancela? ¿Qué porcentaje?',
              '¿Hay penalizaciones adicionales por mora prolongada?',
            ].map((item, i) => (
              <View key={i} style={styles.bulletItem}>
                <Text style={styles.bullet}>?</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Terra Valoris - Especificación Funcional v1.0</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>

      {/* ==================== PÁGINA 12: GLOSARIO ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Glosario de Términos</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>17.</Text> Definiciones
          </Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Término</Text>
              <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Definición</Text>
            </View>
            {[
              ['Lote', 'Unidad de terreno individual disponible para venta dentro de un proyecto inmobiliario'],
              ['Manzana', 'Agrupación de lotes contiguos dentro de un proyecto, identificada por letra'],
              ['Etapa', 'Fase de desarrollo de un proyecto que permite ventas y entregas escalonadas'],
              ['Enganche', 'Pago inicial obligatorio para reservar un lote, generalmente porcentaje del precio total'],
              ['Mensualidad', 'Pago periódico fijo acordado en el plan de financiamiento'],
              ['Reserva', 'Estado del lote cuando cliente pagó enganche pero no ha firmado contrato'],
              ['Cartera', 'Conjunto de cuentas por cobrar de clientes con financiamiento activo'],
              ['Mora', 'Situación cuando un pago no se realiza en la fecha acordada'],
              ['Comisión', 'Pago al vendedor por concepto de venta realizada, calculado como porcentaje'],
              ['Estado de Cuenta', 'Documento que muestra pagos realizados, saldo pendiente y próximos vencimientos'],
              ['POC', 'Proof of Concept - Prueba de concepto para validar funcionalidad antes de producción'],
              ['Single-tenant', 'Modelo donde cada cliente tiene su propia instancia aislada del sistema'],
              ['RLS', 'Row Level Security - Seguridad a nivel de fila en base de datos'],
              ['Trigger', 'Evento que dispara una acción automática en el sistema'],
            ].map((row, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCellBold, { flex: 1.2 }]}>{row[0]}</Text>
                <Text style={[styles.tableCell, { flex: 3 }]}>{row[1]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { marginTop: 20 }]}>
          <View style={[styles.box, { backgroundColor: '#f0fdf4', borderColor: colors.primary, borderWidth: 2 }]}>
            <Text style={[styles.boxTitle, { color: colors.primary, fontSize: 11, textAlign: 'center' }]}>
              Solicitud de Retroalimentación
            </Text>
            <Text style={[styles.boxContent, { color: '#166534', textAlign: 'center', marginTop: 8 }]}>
              Por favor revisar este documento completo y enviar sus comentarios,{'\n'}
              correcciones o respuestas a las preguntas pendientes.{'\n\n'}
              Cualquier ajuste a la lógica de negocio debe comunicarse{'\n'}
              ANTES de continuar con el desarrollo para evitar retrabajo.
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 30, alignItems: 'center' }}>
          <Text style={{ fontSize: 9, color: colors.gray, marginBottom: 6 }}>
            Documento generado el {today}
          </Text>
          <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: colors.primary }}>
            INVERSIONES TERRA VALORIS S.A.S
          </Text>
          <Text style={{ fontSize: 9, color: colors.gray, marginTop: 4 }}>
            Sistema de Gestión de Cartera de Lotes
          </Text>
          <Text style={{ fontSize: 8, color: colors.grayLight, marginTop: 2 }}>
            POC v0.1.0 - Documento de Especificación Funcional
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Terra Valoris - Especificación Funcional v1.0</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
