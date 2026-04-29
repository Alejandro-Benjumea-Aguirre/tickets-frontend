// ── Shared ticket data ─────────────────────────────────────────────────────────
// Fuente de verdad para el detalle de tickets. Los dashboards usan su propio
// subconjunto; esta lista provee la información completa para TicketDetailPage.

export interface TicketComment {
  id: string;
  autor: string;
  autorInitials: string;
  autorColor: string;
  rol: string;
  texto: string;
  fecha: string;        // dd/mm/yyyy — hh:mm
  files?: TicketFile[];
}

export interface TicketFile {
  id: string;
  nombre: string;
  tipo: string;   // 'image' | 'pdf' | 'doc' | 'other'
  tamaño: string;
  fecha: string;
}

export interface TicketDetail {
  id: string;
  asunto: string;
  descripcion: string;
  prio: string;
  estado: string;
  cliente: string;
  agente: string;
  agColor: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  enEspera: boolean;
  categoria: string;
  canal: string;
  comments: TicketComment[];
  files: TicketFile[];
}

export const TICKETS_DETAIL: Record<string, TicketDetail> = {
  '#1042': {
    id: '#1042',
    asunto: 'No puedo iniciar sesión',
    descripcion:
      'El usuario reporta que al intentar ingresar con sus credenciales habituales recibe el mensaje "Usuario o contraseña incorrectos". Ha intentado restablecer la contraseña dos veces sin éxito. El problema comenzó luego de la actualización de la plataforma del día 18/03.',
    prio: 'Alta',
    estado: 'open',
    cliente: 'Ana Torres',
    agente: 'Carlos Ramírez',
    agColor: '#1D9E75',
    fechaCreacion: '19/03/2026 — 08:14',
    fechaActualizacion: '19/03/2026 — 08:45',
    enEspera: false,
    categoria: 'Acceso / Autenticación',
    canal: 'Portal web',
    comments: [
      {
        id: 'c1',
        autor: 'Carlos Ramírez',
        autorInitials: 'CR',
        autorColor: '#1D9E75',
        rol: 'Administrador',
        texto: 'Buen día Ana, estamos revisando el problema. ¿Podría indicarnos el navegador que utiliza y si el error aparece en todos los dispositivos?',
        fecha: '19/03/2026 — 08:45',
      },
      {
        id: 'c2',
        autor: 'Ana Torres',
        autorInitials: 'AT',
        autorColor: '#378ADD',
        rol: 'Cliente',
        texto: 'Hola Carlos, uso Chrome en mi laptop Windows 11. También lo intenté desde el celular y el mismo error aparece.',
        fecha: '19/03/2026 — 08:52',
        files: [
          { id: 'f-c2-1', nombre: 'captura_error.png', tipo: 'image', tamaño: '124 KB', fecha: '19/03/2026' },
        ],
      },
    ],
    files: [],
  },

  '#1041': {
    id: '#1041',
    asunto: 'Error al generar factura',
    descripcion:
      'Al intentar generar la factura del mes de marzo, el sistema devuelve un error 500. El proceso se inició desde el módulo de Facturación > Generar comprobante. Se adjunta captura de pantalla con el mensaje de error completo.',
    prio: 'Alta',
    estado: 'prog',
    cliente: 'Juan Mesa',
    agente: 'Laura Méndez',
    agColor: '#378ADD',
    fechaCreacion: '19/03/2026 — 07:42',
    fechaActualizacion: '19/03/2026 — 09:10',
    enEspera: true,
    categoria: 'Facturación',
    canal: 'Correo electrónico',
    comments: [
      {
        id: 'c1',
        autor: 'Laura Méndez',
        autorInitials: 'LM',
        autorColor: '#378ADD',
        rol: 'Agente',
        texto: 'Hemos escalado el incidente al equipo de backend. Esperamos respuesta en las próximas 2 horas.',
        fecha: '19/03/2026 — 09:10',
        files: [
          { id: 'f-c1-1', nombre: 'error_factura.png', tipo: 'image', tamaño: '98 KB',  fecha: '19/03/2026' },
          { id: 'f-c1-2', nombre: 'datos_factura.pdf', tipo: 'pdf',   tamaño: '210 KB', fecha: '19/03/2026' },
        ],
      },
    ],
    files: [],
  },

  '#1040': {
    id: '#1040',
    asunto: 'Cambio de plan de servicio',
    descripcion:
      'La cliente solicita migrar del plan Básico al plan Profesional a partir del próximo ciclo de facturación (01/04/2026). Requiere confirmación del nuevo precio y las funcionalidades adicionales que se habilitan.',
    prio: 'Media',
    estado: 'prog',
    cliente: 'Sara López',
    agente: 'Carlos Ramírez',
    agColor: '#1D9E75',
    fechaCreacion: '19/03/2026 — 06:55',
    fechaActualizacion: '19/03/2026 — 07:30',
    enEspera: false,
    categoria: 'Planes y precios',
    canal: 'Portal web',
    comments: [],
    files: [],
  },

  '#1039': {
    id: '#1039',
    asunto: 'Reembolso pendiente',
    descripcion:
      'El cliente realizó un pago duplicado el 15/03/2026 por un valor de $120.000. Solicita el reembolso del cobro adicional. Adjunta comprobantes de ambas transacciones.',
    prio: 'Alta',
    estado: 'urgent',
    cliente: 'Pedro Ríos',
    agente: '—',
    agColor: '#888',
    fechaCreacion: '18/03/2026 — 14:22',
    fechaActualizacion: '19/03/2026 — 08:00',
    enEspera: true,
    categoria: 'Pagos y reembolsos',
    canal: 'Teléfono',
    comments: [],
    files: [
      { id: 'f1', nombre: 'comprobante_1.pdf', tipo: 'pdf', tamaño: '88 KB',  fecha: '18/03/2026' },
      { id: 'f2', nombre: 'comprobante_2.pdf', tipo: 'pdf', tamaño: '91 KB',  fecha: '18/03/2026' },
    ],
  },

  '#1038': {
    id: '#1038',
    asunto: 'Consulta sobre términos',
    descripcion:
      'La cliente solicita aclaración sobre la cláusula 4.2 de los términos de servicio vigentes, específicamente en relación con la política de cancelación anticipada de contratos anuales.',
    prio: 'Baja',
    estado: 'closed',
    cliente: 'Mónica Gil',
    agente: 'Laura Méndez',
    agColor: '#378ADD',
    fechaCreacion: '18/03/2026 — 10:05',
    fechaActualizacion: '18/03/2026 — 16:30',
    enEspera: false,
    categoria: 'Legal / Contratos',
    canal: 'Chat',
    comments: [
      {
        id: 'c1',
        autor: 'Laura Méndez',
        autorInitials: 'LM',
        autorColor: '#378ADD',
        rol: 'Agente',
        texto: 'Estimada Mónica, la cláusula 4.2 establece que en contratos anuales la cancelación anticipada conlleva un cargo equivalente al 20% del valor restante del período. Se adjunta el documento con el texto completo.',
        fecha: '18/03/2026 — 14:15',
        files: [
          { id: 'f-c1-1', nombre: 'terminos_v3.pdf', tipo: 'pdf', tamaño: '340 KB', fecha: '18/03/2026' },
        ],
      },
      {
        id: 'c2',
        autor: 'Mónica Gil',
        autorInitials: 'MG',
        autorColor: '#EF9F27',
        rol: 'Cliente',
        texto: 'Perfecto, muchas gracias por la aclaración.',
        fecha: '18/03/2026 — 16:28',
      },
    ],
    files: [],
  },

  '#1037': {
    id: '#1037',
    asunto: 'Actualizar datos de contacto',
    descripcion:
      'El cliente solicita actualizar su número de teléfono y correo electrónico de contacto en el sistema. Los nuevos datos son: tel. +57 315 000 1234, email: carlos.vera@nuevodomain.com.',
    prio: 'Baja',
    estado: 'closed',
    cliente: 'Carlos Vera',
    agente: 'Carlos Ramírez',
    agColor: '#1D9E75',
    fechaCreacion: '17/03/2026 — 09:15',
    fechaActualizacion: '17/03/2026 — 11:00',
    enEspera: false,
    categoria: 'Gestión de cuenta',
    canal: 'Portal web',
    comments: [
      {
        id: 'c1',
        autor: 'Carlos Ramírez',
        autorInitials: 'CR',
        autorColor: '#1D9E75',
        rol: 'Administrador',
        texto: 'Datos actualizados correctamente en el sistema. El cliente recibirá confirmación al correo registrado.',
        fecha: '17/03/2026 — 10:58',
      },
    ],
    files: [],
  },

  '#1035': {
    id: '#1035',
    asunto: 'Problema con facturación',
    descripcion:
      'Se generó un cobro incorrecto en la factura de febrero. El monto cobrado fue $250.000 cuando debería ser $180.000 según el plan contratado.',
    prio: 'Alta',
    estado: 'closed',
    cliente: 'Ana Torres',
    agente: 'Laura Méndez',
    agColor: '#378ADD',
    fechaCreacion: '17/03/2026 — 08:00',
    fechaActualizacion: '17/03/2026 — 15:45',
    enEspera: false,
    categoria: 'Facturación',
    canal: 'Portal web',
    comments: [],
    files: [{ id: 'f1', nombre: 'factura_feb.pdf', tipo: 'pdf', tamaño: '155 KB', fecha: '17/03/2026' }],
  },

  '#1030': {
    id: '#1030',
    asunto: 'Consulta de producto',
    descripcion:
      'El cliente solicita información sobre las características del módulo de reportes avanzados y si es compatible con su plan actual.',
    prio: 'Baja',
    estado: 'closed',
    cliente: 'Ana Torres',
    agente: 'Carlos Ramírez',
    agColor: '#1D9E75',
    fechaCreacion: '14/03/2026 — 11:30',
    fechaActualizacion: '14/03/2026 — 14:00',
    enEspera: false,
    categoria: 'Consulta comercial',
    canal: 'Chat',
    comments: [],
    files: [],
  },

  '#1025': {
    id: '#1025',
    asunto: 'Error en descarga de reporte',
    descripcion:
      'Al intentar descargar el reporte mensual en formato Excel, el archivo descargado aparece corrupto y no puede abrirse.',
    prio: 'Media',
    estado: 'open',
    cliente: 'Ana Torres',
    agente: '—',
    agColor: '#888',
    fechaCreacion: '12/03/2026 — 16:10',
    fechaActualizacion: '12/03/2026 — 16:10',
    enEspera: true,
    categoria: 'Reportes',
    canal: 'Portal web',
    comments: [],
    files: [],
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FileItem {
  id: string;
  file: File;
  preview?: string;
  error?: string;
}

export interface FileListProps {
  files: FileItem[];
  onRemove: (id: string) => void;
  formatSize: (bytes: number) => string;
  s: Record<string, React.CSSProperties>; // Pasamos los estilos
}

export interface CreateTicketModalProps {
  onClose: () => void;
}
