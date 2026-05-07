// ── PDF generator ─────────────────────────────────────────────────────────────

import jsPDF from 'jspdf';
import { DataSets } from "../types/estadisticas.types";
import { kpiTotals } from "../utils/chartHelpers";

export function buildPDF(
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