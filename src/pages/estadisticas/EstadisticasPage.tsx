import { useState, useContext, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { Navbar } from '../../layouts/Navbar';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

// ── Types ──────────────────────────────────────────────────────────────────────

type Entity    = 'agentes' | 'clientes';
type Period    = 'mes' | 'trimestre' | 'semestre' | 'anual';
type ChartType = 'barras' | 'lineal' | 'torta';

interface DataSets {
  abiertos:   number[];
  cerrados:   number[];
  pendientes: number[];
  enEspera:   number[];
}

// ── Agents & clients lists ────────────────────────────────────────────────────

const AGENTS = [
  { id: 'ag1', name: 'Carlos Ramírez',  initials: 'CR', color: '#1D9E75' },
  { id: 'ag2', name: 'Laura Méndez',    initials: 'LM', color: '#378ADD' },
  { id: 'ag3', name: 'Pedro Gutiérrez', initials: 'PG', color: '#EF9F27' },
  { id: 'ag4', name: 'Sofía Herrera',   initials: 'SH', color: '#9B59B6' },
];

const CLIENTS = [
  { id: 'cl1', name: 'TechCorp S.A.',       initials: 'TC' },
  { id: 'cl2', name: 'Grupo Innova',         initials: 'GI' },
  { id: 'cl3', name: 'Distribuidora Norte',  initials: 'DN' },
  { id: 'cl4', name: 'Soluciones Alfa',      initials: 'SA' },
  { id: 'cl5', name: 'Constructora Beta',    initials: 'CB' },
];

// ── Mock data ─────────────────────────────────────────────────────────────────

const LABELS: Record<Period, string[]> = {
  mes:       ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
  trimestre: ['Mes 1', 'Mes 2', 'Mes 3'],
  semestre:  ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6'],
  anual:     ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
};

const TOTALS: Record<Entity, Record<Period, DataSets>> = {
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

const AGENT_DATA: Record<string, Record<Period, DataSets>> = {
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

const CLIENT_DATA: Record<string, Record<Period, DataSets>> = {
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

const SERIES_COLORS = [
  { label: 'Abiertos',   color: '#1D9E75', bg: 'rgba(29,158,117,0.15)'  },
  { label: 'Cerrados',   color: '#888780', bg: 'rgba(136,135,128,0.15)' },
  { label: 'Pendientes', color: '#EF9F27', bg: 'rgba(239,159,39,0.15)'  },
  { label: 'En espera',  color: '#378ADD', bg: 'rgba(55,138,221,0.15)'  },
];

const PERIOD_OPTS: { value: Period; label: string }[] = [
  { value: 'mes',       label: 'Mes'       },
  { value: 'trimestre', label: 'Trimestre' },
  { value: 'semestre',  label: 'Semestre'  },
  { value: 'anual',     label: 'Anual'     },
];

const CHART_OPTS: { value: ChartType; label: string; icon: React.ReactNode }[] = [
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

// ── Chart data builders ───────────────────────────────────────────────────────

function buildBarData(data: DataSets, labels: string[]) {
  const values = [data.abiertos, data.cerrados, data.pendientes, data.enEspera];
  return {
    labels,
    datasets: SERIES_COLORS.map((s, i) => ({
      label: s.label,
      data: values[i],
      backgroundColor: s.color,
      borderRadius: 4,
      barPercentage: 0.65,
      categoryPercentage: 0.75,
    })),
  };
}

function buildLineData(data: DataSets, labels: string[]) {
  const values = [data.abiertos, data.cerrados, data.pendientes, data.enEspera];
  return {
    labels,
    datasets: SERIES_COLORS.map((s, i) => ({
      label: s.label,
      data: values[i],
      borderColor: s.color,
      backgroundColor: s.bg,
      tension: 0.4,
      pointRadius: 4,
      borderWidth: 2,
      fill: i === 0,
    })),
  };
}

function buildDonutData(data: DataSets) {
  const totals = [
    data.abiertos.reduce((a, b) => a + b, 0),
    data.cerrados.reduce((a, b) => a + b, 0),
    data.pendientes.reduce((a, b) => a + b, 0),
    data.enEspera.reduce((a, b) => a + b, 0),
  ];
  return {
    labels: SERIES_COLORS.map((s) => s.label),
    datasets: [{ data: totals, backgroundColor: SERIES_COLORS.map((s) => s.color), borderWidth: 0, hoverOffset: 6 }],
  };
}

// Options for visible charts
const barOpts   = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 11 } } } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#888' } }, y: { grid: { color: 'rgba(128,128,128,0.1)' }, ticks: { font: { size: 11 }, color: '#888' }, beginAtZero: true } } };
const lineOpts  = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 11 } } } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#888' } }, y: { grid: { color: 'rgba(128,128,128,0.1)' }, ticks: { font: { size: 11 }, color: '#888' }, beginAtZero: true } } };
const donutOpts = { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 11 } } } } };

// Options for hidden (PDF) charts — no animation, not responsive
const pdfBarOpts   = { ...barOpts,   responsive: false, animation: false as const };
const pdfLineOpts  = { ...lineOpts,  responsive: false, animation: false as const };
const pdfDonutOpts = { ...donutOpts, responsive: false, animation: false as const };

function kpiTotals(data: DataSets) {
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  return [
    { label: 'Abiertos',   val: sum(data.abiertos),   dot: '#1D9E75' },
    { label: 'Cerrados',   val: sum(data.cerrados),   dot: '#888780' },
    { label: 'Pendientes', val: sum(data.pendientes), dot: '#EF9F27' },
    { label: 'En espera',  val: sum(data.enEspera),   dot: '#378ADD' },
  ];
}

// ── PDF generator ─────────────────────────────────────────────────────────────

function buildPDF(
  barImg:    string,
  lineImg:   string,
  donutImg:  string,
  title:     string,
  period:    string,
  scope:     string,
  data:      DataSets,
) {
  const kpis = kpiTotals(data);
  const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W    = doc.internal.pageSize.getWidth();
  const ml   = 14;
  const cw   = W - ml * 2;
  let   y    = 0;

  // ── Header ──────────────────────────────────────────────────────────────────
  doc.setFillColor(29, 158, 117);
  doc.rect(0, 0, W, 22, 'F');
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Estadísticas de Tickets', ml, 14);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const dateStr = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`Generado el ${dateStr}`, W - ml, 14, { align: 'right' });
  y = 30;

  // ── Title ────────────────────────────────────────────────────────────────────
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text(title, ml, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text(`Período: ${period}   ·   Alcance: ${scope}`, ml, y);
  y += 8;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(ml, y, W - ml, y);
  y += 6;

  // ── KPIs ─────────────────────────────────────────────────────────────────────
  const kpiW = (cw - 6) / 4;
  const kpiColors: [number, number, number][] = [
    [29, 158, 117], [136, 135, 128], [239, 159, 39], [55, 138, 221],
  ];
  kpis.forEach((k, i) => {
    const x = ml + i * (kpiW + 2);
    doc.setFillColor(245, 247, 246);
    doc.roundedRect(x, y, kpiW, 18, 2, 2, 'F');
    doc.setFillColor(...kpiColors[i]);
    doc.roundedRect(x, y, 3, 18, 1, 1, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(k.label, x + 5, y + 5.5);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(String(k.val), x + 5, y + 13);
  });
  y += 24;

  // ── Chart helper ─────────────────────────────────────────────────────────────
  const addChart = (imgData: string, sectionTitle: string, imgH: number) => {
    if (y + imgH + 16 > 282) { doc.addPage(); y = 16; }
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(ml, y, cw, 7, 1.5, 1.5, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text(sectionTitle, ml + 4, y + 4.8);
    y += 10;
    // strip data-URL prefix so jsPDF always gets raw base64
    const base64 = imgData.includes(',') ? imgData.split(',')[1] : imgData;
    doc.addImage(base64, 'PNG', ml, y, cw, imgH);
    y += imgH + 8;
  };

  addChart(barImg,   'Diagrama de Barras', 62);
  addChart(lineImg,  'Diagrama Lineal',    62);
  addChart(donutImg, 'Diagrama de Torta',  72);

  // ── Footer ────────────────────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 180, 180);
    doc.text(`Página ${p} de ${pageCount}`, W / 2, 292, { align: 'center' });
    doc.text('Sistema de Tickets — Estadísticas', ml, 292);
  }

  const filename = `estadisticas_${title.replace(/\s+—\s+|\s+/g, '_').toLowerCase()}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

// ── Component ─────────────────────────────────────────────────────────────────

const EstadisticasPage = () => {
  const authContext = useContext(AuthContext);

  const [activeEntity,   setActiveEntity]   = useState<Entity | null>(null);
  const [selectedAgent,  setSelectedAgent]  = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [period,         setPeriod]         = useState<Period>('mes');
  const [chartType,      setChartType]      = useState<ChartType>('barras');
  const [downloading,    setDownloading]    = useState(false);

  // Refs to hidden charts used for PDF image capture
  const pdfBarRef   = useRef<ChartJS<'bar'>>(null);
  const pdfLineRef  = useRef<ChartJS<'line'>>(null);
  const pdfDonutRef = useRef<ChartJS<'doughnut'>>(null);

  if (!authContext) return null;
  const { user, logoutUser } = authContext;

  // ── Derived ──────────────────────────────────────────────────────────────────

  function getActiveData(): DataSets | null {
    if (!activeEntity) return null;
    if (activeEntity === 'agentes')
      return selectedAgent ? AGENT_DATA[selectedAgent][period] : TOTALS.agentes[period];
    return selectedClient ? CLIENT_DATA[selectedClient][period] : TOTALS.clientes[period];
  }

  function getChartTitle() {
    if (!activeEntity) return '';
    if (activeEntity === 'agentes') {
      const name = selectedAgent ? AGENTS.find((a) => a.id === selectedAgent)?.name : null;
      return name ? `Tickets — ${name}` : 'Tickets — Todos los agentes';
    }
    const name = selectedClient ? CLIENTS.find((c) => c.id === selectedClient)?.name : null;
    return name ? `Tickets — ${name}` : 'Tickets — Todos los clientes';
  }

  function getScopeBadge() {
    if (!activeEntity) return '';
    if (activeEntity === 'agentes') return selectedAgent ? 'Agente seleccionado' : 'Totales';
    return selectedClient ? 'Cliente seleccionado' : 'Totales';
  }

  const activeData  = getActiveData();
  const labels      = LABELS[period];
  const kpis        = activeData ? kpiTotals(activeData) : [];
  const activeColor = activeEntity === 'agentes' ? '#1D9E75' : '#378ADD';
  const periodLabel = PERIOD_OPTS.find((p) => p.value === period)?.label ?? '';

  function handleEntityClick(key: Entity) {
    if (activeEntity === key) { setActiveEntity(null); setSelectedAgent(''); setSelectedClient(''); }
    else                      { setActiveEntity(key);  setSelectedAgent(''); setSelectedClient(''); }
  }

  async function handleDownload() {
    if (!activeData) return;
    setDownloading(true);
    try {
      // Give React one extra frame to ensure hidden charts are rendered
      await new Promise((r) => setTimeout(r, 120));
      const barImg   = pdfBarRef.current?.toBase64Image('image/png', 1)   ?? '';
      const lineImg  = pdfLineRef.current?.toBase64Image('image/png', 1)  ?? '';
      const donutImg = pdfDonutRef.current?.toBase64Image('image/png', 1) ?? '';
      if (!barImg || !lineImg || !donutImg) throw new Error('Charts not ready');
      buildPDF(barImg, lineImg, donutImg, getChartTitle(), periodLabel, getScopeBadge(), activeData);
    } catch (err) {
      console.error('PDF error:', err);
    } finally {
      setDownloading(false);
    }
  }

  const entityCards = [
    {
      key: 'agentes' as Entity,
      label: 'Agentes',
      desc: 'Estadísticas de tickets gestionados por agentes',
      color: '#1D9E75', bg: '#E1F5EE',
      icon: (
        <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="#1D9E75" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      key: 'clientes' as Entity,
      label: 'Clientes',
      desc: 'Estadísticas de tickets generados por clientes',
      color: '#378ADD', bg: '#E6F1FB',
      icon: (
        <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="#378ADD" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <Navbar user={user} logoutUser={logoutUser} />

      <div style={s.page}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>Estadísticas</h1>
          <p style={s.pageSubtitle}>Visualiza el comportamiento de tickets por agente o cliente</p>
        </div>

        {/* ── Entity cards ─────────────────────────────────────────────────── */}
        <div style={s.entityRow}>
          {entityCards.map((card) => {
            const active = activeEntity === card.key;
            return (
              <button
                key={card.key}
                style={{ ...s.entityCard, border: active ? `1.5px solid ${card.color}` : '1px solid var(--border)', boxShadow: active ? `0 0 0 3px ${card.color}22` : 'none' }}
                onClick={() => handleEntityClick(card.key)}
              >
                <div style={{ ...s.entityIconWrap, background: card.bg }}>{card.icon}</div>
                <div style={s.entityInfo}>
                  <div style={{ ...s.entityLabel, color: active ? card.color : 'var(--text-primary)' }}>{card.label}</div>
                  <div style={s.entityDesc}>{card.desc}</div>
                </div>
                {active && <div style={{ ...s.entityActiveDot, background: card.color }} />}
              </button>
            );
          })}
        </div>

        {/* ── Selector bar ─────────────────────────────────────────────────── */}
        {activeEntity && (
          <div style={{ ...s.selectorBar, borderColor: activeColor + '55' }}>
            <div style={s.selectorLeft}>
              <svg viewBox="0 0 20 20" width={15} height={15} fill="none" stroke={activeColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="9" r="6"/><path d="M15 15l3 3"/>
              </svg>
              <span style={{ ...s.selectorLabel, color: activeColor }}>
                {activeEntity === 'agentes' ? 'Filtrar por agente' : 'Filtrar por cliente'}
              </span>
            </div>

            {activeEntity === 'agentes' ? (
              <div style={s.selectorRight}>
                <select
                  style={{ ...s.entitySelect, borderColor: selectedAgent ? activeColor : 'var(--border-input)' }}
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                >
                  <option value="">Todos los agentes</option>
                  {AGENTS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                <div style={s.chipRow}>
                  {AGENTS.map((a) => (
                    <button key={a.id} title={a.name}
                      style={{ ...s.chip, background: selectedAgent === a.id ? a.color : 'var(--bg-filter)', color: selectedAgent === a.id ? '#fff' : 'var(--text-secondary)', border: `1.5px solid ${selectedAgent === a.id ? a.color : 'var(--border)'}` }}
                      onClick={() => setSelectedAgent(selectedAgent === a.id ? '' : a.id)}
                    >{a.initials}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={s.selectorRight}>
                <select
                  style={{ ...s.entitySelect, borderColor: selectedClient ? activeColor : 'var(--border-input)' }}
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  <option value="">Todos los clientes</option>
                  {CLIENTS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div style={s.chipRow}>
                  {CLIENTS.map((c) => (
                    <button key={c.id} title={c.name}
                      style={{ ...s.chip, background: selectedClient === c.id ? activeColor : 'var(--bg-filter)', color: selectedClient === c.id ? '#fff' : 'var(--text-secondary)', border: `1.5px solid ${selectedClient === c.id ? activeColor : 'var(--border)'}` }}
                      onClick={() => setSelectedClient(selectedClient === c.id ? '' : c.id)}
                    >{c.initials}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Stats panel ──────────────────────────────────────────────────── */}
        {activeEntity && activeData ? (
          <>
            {/* Controls */}
            <div style={s.controls}>
              <div style={s.controlGroup}>
                <span style={s.controlLabel}>Período</span>
                <div style={s.toggleRow}>
                  {PERIOD_OPTS.map((p) => (
                    <button key={p.value}
                      style={{ ...s.toggleBtn, ...(period === p.value ? s.toggleBtnActive : {}) }}
                      onClick={() => setPeriod(p.value)}
                    >{p.label}</button>
                  ))}
                </div>
              </div>

              <div style={s.controlGroup}>
                <span style={s.controlLabel}>Tipo de gráfica</span>
                <div style={s.toggleRow}>
                  {CHART_OPTS.map((c) => (
                    <button key={c.value}
                      style={{ ...s.chartTypeBtn, ...(chartType === c.value ? s.chartTypeBtnActive : {}) }}
                      onClick={() => setChartType(c.value)}
                    >{c.icon}{c.label}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ ...s.scopeBadge, background: activeColor + '18', color: activeColor, border: `1px solid ${activeColor}44` }}>
                  {getScopeBadge()}
                </span>
                <button
                  style={{ ...s.downloadBtn, opacity: downloading ? 0.72 : 1, cursor: downloading ? 'wait' : 'pointer' }}
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading ? (
                    <>
                      <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" style={{ animation: 'espin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
                      </svg>
                      Generando…
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Descargar estadística
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* KPIs */}
            <div style={s.kpiRow}>
              {kpis.map((k) => (
                <div key={k.label} style={s.kpiCard}>
                  <div style={s.kpiTop}>
                    <span style={{ ...s.kpiDot, background: k.dot }} />
                    <span style={s.kpiLabel}>{k.label}</span>
                  </div>
                  <div style={s.kpiVal}>{k.val}</div>
                  <div style={s.kpiSub}>total del período</div>
                </div>
              ))}
            </div>

            {/* Visible chart */}
            <div style={s.chartCard}>
              <div style={s.chartHeader}>
                <span style={s.chartTitle}>{getChartTitle()} · {periodLabel}</span>
                <span style={s.chartTypeBadge}>{CHART_OPTS.find((c) => c.value === chartType)?.label}</span>
              </div>
              <div style={s.chartWrap}>
                {chartType === 'barras' && <Bar  data={buildBarData(activeData, labels)}  options={barOpts}  />}
                {chartType === 'lineal' && <Line data={buildLineData(activeData, labels)} options={lineOpts} />}
                {chartType === 'torta'  && (
                  <div style={s.donutContainer}>
                    <div style={{ position: 'relative', width: 280, height: 280 }}>
                      <Doughnut data={buildDonutData(activeData)} options={donutOpts} />
                    </div>
                    <div style={s.donutRight}>
                      <p style={s.donutNote}>Total acumulado del período seleccionado</p>
                      {kpis.map((k) => (
                        <div key={k.label} style={s.donutRow}>
                          <span style={{ ...s.kpiDot, background: k.dot }} />
                          <span style={s.donutLabel}>{k.label}</span>
                          <span style={s.donutVal}>{k.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Hidden charts for PDF capture (always rendered, off-screen) ── */}
            <div style={{ position: 'fixed', left: '-9999px', top: 0, pointerEvents: 'none', zIndex: -1 }}>
              <div style={{ width: 900, height: 400, background: '#fff' }}>
                <Bar
                  ref={pdfBarRef}
                  data={buildBarData(activeData, labels)}
                  options={pdfBarOpts}
                  width={900}
                  height={400}
                />
              </div>
              <div style={{ width: 900, height: 400, background: '#fff' }}>
                <Line
                  ref={pdfLineRef}
                  data={buildLineData(activeData, labels)}
                  options={pdfLineOpts}
                  width={900}
                  height={400}
                />
              </div>
              <div style={{ width: 600, height: 420, background: '#fff' }}>
                <Doughnut
                  ref={pdfDonutRef}
                  data={buildDonutData(activeData)}
                  options={pdfDonutOpts}
                  width={600}
                  height={420}
                />
              </div>
            </div>
          </>
        ) : !activeEntity ? (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>
              <svg viewBox="0 0 24 24" width={36} height={36} fill="none" stroke="var(--text-tertiary)" strokeWidth={1.5}>
                <rect x="2" y="2" width="20" height="20" rx="3"/>
                <path d="M7 14l3-3 3 3 4-4"/>
              </svg>
            </div>
            <p style={s.emptyText}>Selecciona una categoría para ver las estadísticas</p>
          </div>
        ) : null}

        <style>{`@keyframes espin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page:               { padding: '1.5rem', background: 'var(--bg-page)', minHeight: 'calc(100vh - 56px)', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' },
  pageHeader:         { marginBottom: '1.5rem' },
  pageTitle:          { margin: 0, fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' },
  pageSubtitle:       { margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' },

  entityRow:          { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1rem' },
  entityCard:         { display: 'flex', alignItems: 'center', gap: 14, padding: '1.1rem 1.25rem', background: 'var(--bg-card)', borderRadius: 12, cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans', sans-serif", transition: 'box-shadow 0.15s, border 0.15s', position: 'relative' },
  entityIconWrap:     { width: 52, height: 52, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  entityInfo:         { flex: 1 },
  entityLabel:        { fontSize: 15, fontWeight: 600, marginBottom: 3, transition: 'color 0.15s' },
  entityDesc:         { fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 },
  entityActiveDot:    { width: 8, height: 8, borderRadius: '50%', position: 'absolute', top: 12, right: 12 },

  selectorBar:        { display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg-card)', border: '1px solid', borderRadius: 10, padding: '0.75rem 1.25rem', marginBottom: '1rem', flexWrap: 'wrap' },
  selectorLeft:       { display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 },
  selectorLabel:      { fontSize: 13, fontWeight: 500 },
  selectorRight:      { display: 'flex', alignItems: 'center', gap: 10, flex: 1, flexWrap: 'wrap' },
  entitySelect:       { height: 34, padding: '0 10px', border: '1.5px solid', borderRadius: 7, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', cursor: 'pointer', minWidth: 200 },
  chipRow:            { display: 'flex', gap: 6, flexWrap: 'wrap' },
  chip:               { width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s' },

  controls:           { display: 'flex', gap: 20, marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' },
  controlGroup:       { display: 'flex', alignItems: 'center', gap: 10 },
  controlLabel:       { fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.03em', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  toggleRow:          { display: 'flex', gap: 3, background: 'var(--bg-toggle)', border: '0.5px solid var(--border)', borderRadius: 8, padding: 3 },
  toggleBtn:          { padding: '5px 13px', borderRadius: 6, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' },
  toggleBtnActive:    { background: 'var(--bg-active)', color: '#1D9E75', border: '0.5px solid var(--border-input)' },
  chartTypeBtn:       { display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" },
  chartTypeBtnActive: { background: 'var(--bg-active)', color: '#378ADD', border: '0.5px solid var(--border-input)' },
  scopeBadge:         { fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20 },
  downloadBtn:        { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: '0.01em' },

  kpiRow:             { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12, marginBottom: '1.25rem' },
  kpiCard:            { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '1rem 1.25rem' },
  kpiTop:             { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 },
  kpiDot:             { width: 8, height: 8, borderRadius: '50%', flexShrink: 0, display: 'inline-block' },
  kpiLabel:           { fontSize: 12, color: 'var(--text-secondary)' },
  kpiVal:             { fontSize: 26, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 },
  kpiSub:             { fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 },

  chartCard:          { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '1.25rem' },
  chartHeader:        { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' },
  chartTitle:         { fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' },
  chartTypeBadge:     { fontSize: 11, fontWeight: 500, background: 'var(--bg-filter)', color: 'var(--text-secondary)', padding: '3px 10px', borderRadius: 20, border: '0.5px solid var(--border)' },
  chartWrap:          { position: 'relative', height: 320 },
  donutContainer:     { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', height: '100%' },
  donutRight:         { display: 'flex', flexDirection: 'column', gap: 10 },
  donutNote:          { margin: '0 0 8px', fontSize: 12, color: 'var(--text-secondary)' },
  donutRow:           { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 },
  donutLabel:         { flex: 1, color: 'var(--text-primary)' },
  donutVal:           { fontWeight: 600, color: 'var(--text-primary)', minWidth: 40, textAlign: 'right' },

  emptyState:         { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '4rem', background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 12, marginTop: 8 },
  emptyIcon:          { width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-filter)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  emptyText:          { fontSize: 13, color: 'var(--text-secondary)', margin: 0 },
};

export default EstadisticasPage;
