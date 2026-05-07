// ── Types ──────────────────────────────────────────────────────────────────────

import { DataSets, Entity, Period, ChartType } from "../types/estadisticas.types";

// ── Agents & clients lists ────────────────────────────────────────────────────

export const AGENTS = [
  { id: 'ag1', name: 'Carlos Ramírez',  initials: 'CR', color: '#1D9E75' },
  { id: 'ag2', name: 'Laura Méndez',    initials: 'LM', color: '#378ADD' },
  { id: 'ag3', name: 'Pedro Gutiérrez', initials: 'PG', color: '#EF9F27' },
  { id: 'ag4', name: 'Sofía Herrera',   initials: 'SH', color: '#9B59B6' },
];

export const CLIENTS = [
  { id: 'cl1', name: 'TechCorp S.A.',       initials: 'TC' },
  { id: 'cl2', name: 'Grupo Innova',         initials: 'GI' },
  { id: 'cl3', name: 'Distribuidora Norte',  initials: 'DN' },
  { id: 'cl4', name: 'Soluciones Alfa',      initials: 'SA' },
  { id: 'cl5', name: 'Constructora Beta',    initials: 'CB' },
];

// ── Mock data ─────────────────────────────────────────────────────────────────

export const LABELS: Record<Period, string[]> = {
  mes:       ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
  trimestre: ['Mes 1', 'Mes 2', 'Mes 3'],
  semestre:  ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6'],
  anual:     ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
};

export const TOTALS: Record<Entity, Record<Period, DataSets>> = {
  agentes: {
    mes:       { abiertos: [12,18,14,20],       cerrados: [8,11,13,16],        pendientes: [4,6,5,7],          enEspera: [3,5,4,6]           },
    trimestre: { abiertos: [38,52,47],           cerrados: [30,44,39],          pendientes: [14,18,16],         enEspera: [10,14,12]          },
    semestre:  { abiertos: [38,52,47,60,55,70],  cerrados: [30,44,39,50,48,62], pendientes: [14,18,16,22,19,25],enEspera: [10,14,12,16,14,18] },
    anual:     { abiertos: [20,25,18,30,22,28,35,32,40,38,42,45], cerrados: [15,20,14,25,18,22,28,26,32,30,36,40], pendientes: [8,10,7,12,9,11,14,13,16,15,18,20], enEspera: [5,7,5,8,6,8,10,9,11,10,12,14] },
  },
  clientes: {
    mes:       { abiertos: [8,14,10,16],         cerrados: [6,9,8,12],          pendientes: [3,5,4,6],          enEspera: [2,3,3,5]           },
    trimestre: { abiertos: [28,40,35],            cerrados: [22,33,28],          pendientes: [10,14,12],         enEspera: [7,10,9]            },
    semestre:  { abiertos: [28,40,35,48,43,55],   cerrados: [22,33,28,40,37,49], pendientes: [10,14,12,17,15,20],enEspera: [7,10,9,12,11,14]   },
    anual:     { abiertos: [15,19,14,24,18,22,28,26,33,30,36,40], cerrados: [12,16,11,20,15,18,23,21,27,25,30,35], pendientes: [6,8,5,10,7,9,12,11,14,13,16,18], enEspera: [4,5,4,7,5,6,8,7,9,8,10,12] },
  },
};

export const AGENT_DATA: Record<string, Record<Period, DataSets>> = {
  ag1: {
    mes:       { abiertos: [4,6,5,7],            cerrados: [3,4,5,6],           pendientes: [1,2,1,2],          enEspera: [1,2,1,2]           },
    trimestre: { abiertos: [12,18,15],            cerrados: [10,14,12],          pendientes: [4,6,5],            enEspera: [3,5,4]             },
    semestre:  { abiertos: [12,18,15,20,18,24],   cerrados: [10,14,12,16,15,20], pendientes: [4,6,5,7,6,8],      enEspera: [3,5,4,5,4,6]       },
    anual:     { abiertos: [6,8,6,10,7,9,11,10,13,12,14,15], cerrados: [5,6,5,8,6,7,9,8,10,9,12,13], pendientes: [2,3,2,4,3,3,5,4,5,5,6,7], enEspera: [1,2,1,3,2,2,3,3,4,3,4,5] },
  },
  ag2: {
    mes:       { abiertos: [3,5,4,6],             cerrados: [2,3,4,5],           pendientes: [1,2,2,2],          enEspera: [1,1,1,2]           },
    trimestre: { abiertos: [10,15,13],             cerrados: [8,12,10],           pendientes: [3,5,4],            enEspera: [3,4,3]             },
    semestre:  { abiertos: [10,15,13,18,16,22],    cerrados: [8,12,10,14,13,18],  pendientes: [3,5,4,6,5,7],      enEspera: [3,4,3,5,4,5]       },
    anual:     { abiertos: [5,7,5,8,6,8,10,9,12,11,13,14], cerrados: [4,5,4,7,5,6,8,7,9,8,10,12], pendientes: [2,3,2,3,2,3,4,3,4,4,5,6], enEspera: [2,2,2,2,2,3,3,3,3,3,4,4] },
  },
  ag3: {
    mes:       { abiertos: [3,4,3,5],             cerrados: [2,2,3,3],           pendientes: [1,1,1,2],          enEspera: [0,1,1,1]           },
    trimestre: { abiertos: [8,11,10],              cerrados: [6,9,8],             pendientes: [3,4,4],            enEspera: [2,3,3]             },
    semestre:  { abiertos: [8,11,10,13,12,16],     cerrados: [6,9,8,11,10,14],    pendientes: [3,4,4,5,5,6],      enEspera: [2,3,3,4,3,4]       },
    anual:     { abiertos: [5,6,4,7,5,6,8,7,9,8,9,10], cerrados: [3,4,3,5,4,5,6,5,7,6,8,9], pendientes: [2,2,1,3,2,3,3,3,4,3,4,5], enEspera: [1,1,1,2,1,2,2,2,2,2,3,3] },
  },
  ag4: {
    mes:       { abiertos: [2,3,2,2],             cerrados: [1,2,1,2],           pendientes: [1,1,1,1],          enEspera: [1,1,1,1]           },
    trimestre: { abiertos: [8,8,9],                cerrados: [6,9,9],             pendientes: [4,3,3],            enEspera: [2,2,2]             },
    semestre:  { abiertos: [8,8,9,9,9,8],          cerrados: [6,9,9,9,10,10],     pendientes: [4,3,3,4,3,4],      enEspera: [2,2,2,2,3,3]       },
    anual:     { abiertos: [4,4,3,5,4,5,6,6,6,7,6,6], cerrados: [3,5,2,5,3,4,5,6,6,7,6,6], pendientes: [2,2,2,2,2,2,2,3,3,3,3,2], enEspera: [1,2,1,1,1,1,2,1,2,2,1,2] },
  },
};

export const CLIENT_DATA: Record<string, Record<Period, DataSets>> = {
  cl1: {
    mes:       { abiertos: [3,5,4,6],  cerrados: [2,3,3,4],  pendientes: [1,2,1,2],  enEspera: [1,1,1,2] },
    trimestre: { abiertos: [10,14,12], cerrados: [8,11,9],   pendientes: [3,5,4],    enEspera: [2,4,3]   },
    semestre:  { abiertos: [10,14,12,16,14,18], cerrados: [8,11,9,13,12,16], pendientes: [3,5,4,5,4,6], enEspera: [2,4,3,4,4,5] },
    anual:     { abiertos: [5,7,5,9,6,8,10,9,11,10,12,14], cerrados: [4,5,4,7,5,6,8,7,9,8,10,12], pendientes: [2,3,2,3,2,3,4,3,4,4,5,6], enEspera: [1,2,1,2,2,2,3,2,3,3,3,4] },
  },
  cl2: {
    mes:       { abiertos: [2,3,2,4],  cerrados: [1,2,2,3],  pendientes: [1,1,1,1],  enEspera: [0,1,1,1] },
    trimestre: { abiertos: [6,10,8],   cerrados: [5,8,6],    pendientes: [2,3,3],    enEspera: [1,3,2]   },
    semestre:  { abiertos: [6,10,8,11,9,13], cerrados: [5,8,6,9,8,11], pendientes: [2,3,3,4,3,4], enEspera: [1,3,2,3,2,3] },
    anual:     { abiertos: [3,4,3,5,4,5,7,6,8,7,9,10], cerrados: [2,3,2,4,3,4,5,5,6,6,7,8], pendientes: [1,2,1,2,1,2,3,2,3,3,4,4], enEspera: [1,1,1,1,1,1,2,1,2,2,2,3] },
  },
  cl3: {
    mes:       { abiertos: [1,2,2,3],  cerrados: [1,2,1,2],  pendientes: [0,1,1,1],  enEspera: [0,0,1,1] },
    trimestre: { abiertos: [5,7,6],    cerrados: [4,6,5],    pendientes: [2,2,2],    enEspera: [1,1,2]   },
    semestre:  { abiertos: [5,7,6,9,8,10], cerrados: [4,6,5,7,6,9], pendientes: [2,2,2,3,3,4], enEspera: [1,1,2,2,2,3] },
    anual:     { abiertos: [2,3,2,4,3,4,5,4,6,5,7,8], cerrados: [2,2,2,3,3,3,4,4,5,4,5,6], pendientes: [1,1,1,1,1,2,2,2,2,2,3,3], enEspera: [0,1,0,1,1,1,1,1,1,2,2,2] },
  },
  cl4: {
    mes:       { abiertos: [1,2,1,2],  cerrados: [1,1,1,2],  pendientes: [0,1,1,1],  enEspera: [0,1,0,1] },
    trimestre: { abiertos: [4,6,5],    cerrados: [3,5,4],    pendientes: [1,2,2],    enEspera: [1,1,1]   },
    semestre:  { abiertos: [4,6,5,7,6,8], cerrados: [3,5,4,6,5,7], pendientes: [1,2,2,3,2,3], enEspera: [1,1,1,2,2,2] },
    anual:     { abiertos: [2,2,2,3,2,3,4,4,5,4,6,6], cerrados: [1,2,1,2,2,3,3,3,4,4,5,5], pendientes: [1,1,0,1,1,1,2,1,2,2,2,3], enEspera: [0,0,1,1,0,1,1,1,1,1,1,2] },
  },
  cl5: {
    mes:       { abiertos: [1,2,1,1],  cerrados: [1,1,1,1],  pendientes: [1,0,1,1],  enEspera: [1,0,0,0] },
    trimestre: { abiertos: [3,3,4],    cerrados: [2,3,4],    pendientes: [2,2,1],    enEspera: [2,1,1]   },
    semestre:  { abiertos: [3,3,4,5,6,6], cerrados: [2,3,4,5,6,6], pendientes: [2,2,1,2,2,3], enEspera: [2,1,1,1,1,1] },
    anual:     { abiertos: [2,3,2,3,3,2,4,3,3,4,2,2], cerrados: [2,4,2,4,2,2,3,2,3,3,3,4], pendientes: [0,1,1,3,2,2,1,3,2,2,2,2], enEspera: [1,1,1,2,1,1,1,2,2,2,2,1] },
  },
};

export const SERIES_COLORS = [
  { label: 'Abiertos',   color: '#1D9E75', bg: 'rgba(29,158,117,0.15)'  },
  { label: 'Cerrados',   color: '#888780', bg: 'rgba(136,135,128,0.15)' },
  { label: 'Pendientes', color: '#EF9F27', bg: 'rgba(239,159,39,0.15)'  },
  { label: 'En espera',  color: '#378ADD', bg: 'rgba(55,138,221,0.15)'  },
];

export const PERIOD_OPTS: { value: Period; label: string }[] = [
  { value: 'mes',       label: 'Mes'       },
  { value: 'trimestre', label: 'Trimestre' },
  { value: 'semestre',  label: 'Semestre'  },
  { value: 'anual',     label: 'Anual'     },
];

export const CHART_OPTS: { value: ChartType; label: string; icon: React.ReactNode }[] = [
  { value: 'barras', label: 'Barras', icon: (
    <svg viewBox="0 0 20 20" width={16} height={16} fill="currentColor">
      <rect x="2" y="10" width="4" height="8" rx="1"/><rect x="8" y="6" width="4" height="12" rx="1"/><rect x="14" y="2" width="4" height="16" rx="1"/>
    </svg>
  )},
  { value: 'lineal', label: 'Lineal', icon: (
    <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,14 7,8 12,11 18,4"/>
    </svg>
  )},
  { value: 'torta', label: 'Torta', icon: (
    <svg viewBox="0 0 20 20" width={16} height={16} fill="currentColor">
      <path d="M10 2a8 8 0 1 0 8 8H10V2z" opacity=".4"/><path d="M12 2.3A8 8 0 0 1 18 10h-6V2.3z"/>
    </svg>
  )},
];