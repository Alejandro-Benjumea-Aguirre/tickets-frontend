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
import { AuthContext } from '../../auth/context/AuthContext';
import { Navbar } from '../../../layouts/Navbar/pages/Navbar';
import { DataSets, Entity, Period, ChartType } from '../types/estadisticas.types';
import { s } from '../styles/EstadisticasPage.style';
import { AGENT_DATA, AGENTS, CLIENTS, LABELS, TOTALS, CLIENT_DATA, PERIOD_OPTS, CHART_OPTS } from '../data/estadisticasConstant';
import { buildBarData, buildDonutData, buildLineData, kpiTotals } from '../utils/chartHelpers';
import { buildPDF } from '../services/pdfService';


ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);


// Options for visible charts
const barOpts   = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 11 } } } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#888' } }, y: { grid: { color: 'rgba(128,128,128,0.1)' }, ticks: { font: { size: 11 }, color: '#888' }, beginAtZero: true } } };
const lineOpts  = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 11 } } } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#888' } }, y: { grid: { color: 'rgba(128,128,128,0.1)' }, ticks: { font: { size: 11 }, color: '#888' }, beginAtZero: true } } };
const donutOpts = { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 11 } } } } };

// Options for hidden (PDF) charts — no animation, not responsive
const pdfBarOpts   = { ...barOpts,   responsive: false, animation: false as const };
const pdfLineOpts  = { ...lineOpts,  responsive: false, animation: false as const };
const pdfDonutOpts = { ...donutOpts, responsive: false, animation: false as const };


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

export default EstadisticasPage;
