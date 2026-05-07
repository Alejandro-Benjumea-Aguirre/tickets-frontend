// ── Chart data builders ───────────────────────────────────────────────────────

import { SERIES_COLORS } from "../data/estadisticasConstant";
import { DataSets } from "../types/estadisticas.types";

export function buildBarData(data: DataSets, labels: string[]) {
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

export function buildLineData(data: DataSets, labels: string[]) {
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

export function buildDonutData(data: DataSets) {
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

export function kpiTotals(data: DataSets) {
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  return [
    { label: 'Abiertos',   val: sum(data.abiertos),   dot: '#1D9E75' },
    { label: 'Cerrados',   val: sum(data.cerrados),   dot: '#888780' },
    { label: 'Pendientes', val: sum(data.pendientes), dot: '#EF9F27' },
    { label: 'En espera',  val: sum(data.enEspera),   dot: '#378ADD' },
  ];
}
