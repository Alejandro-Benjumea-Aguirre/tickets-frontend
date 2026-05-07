// Hooks de React
import { useState, useContext } from 'react';

// Librerías de terceros
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Funcionalidades externas (Cross-feature imports)
import CreateTicketModal from '../../tickets/components/CreateTicketModal';
import { TicketsTable } from '../../tickets/components/TicketsTable';
import { AuthContext } from '../../auth/context/AuthContext';

// Componentes Globales / Layouts
import { Navbar } from '../../../layouts/Navbar';

// Recursos propios de esta Feature (Dashboard)
import { lineData, adminKpis, allTickets, lineOptions, donutItems, donutData, donutOptions } from '../data/dashboardConstant';
import { s } from '../styles/DashboardPage.styles';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip);

// ── Component ─────────────────────────────────────────────────────────────────

const AdminDashboardPage = () => {
  const authContext = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  if (!authContext) return <div>Error: AuthContext no está disponible</div>;

  const { user, logoutUser } = authContext;
  const kpis = adminKpis;

  return (
    <>
      <Navbar user={user} logoutUser={logoutUser} />
      {showModal && <CreateTicketModal onClose={() => setShowModal(false)} />}

      <div style={s.db}>
        {/* Topbar */}
        <div style={s.topbar}>
          <div style={s.topbarLeft}>
            <div style={s.logoIcon}>
              <svg viewBox="0 0 24 24" width={16} height={16} fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-9 11H7v-2h4v2zm6 0h-4v-2h4v2zm0-4H7V7h10v2z" />
              </svg>
            </div>
            <span style={s.appTitle}>Tickets — atención al cliente</span>
            <button style={s.addBtn} onClick={() => setShowModal(true)}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Adicionar ticket
            </button>
          </div>
          <div />
        </div>

        {/* KPIs */}
        <div style={s.kpis}>
          {kpis.map((k) => (
            <div key={k.label} style={s.kpi}>
              <div style={s.kpiLabel}><span style={{ ...s.kpiDot, background: k.dot }} />{k.label}</div>
              <div style={s.kpiVal}>{k.val}</div>
              <div style={s.kpiSub}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={s.mid}>
          <div style={s.card}>
            <div style={s.cardTitle}>Tickets por semana</div>
            <div style={s.legend}>
              {[{ color: '#1D9E75', label: 'Abiertos' }, { color: '#378ADD', label: 'En progreso' }, { color: '#888780', label: 'Cerrados' }].map((l) => (
                <div key={l.label} style={s.legItem}><div style={{ ...s.legSq, background: l.color }} />{l.label}</div>
              ))}
            </div>
            <div style={{ position: 'relative', height: 180 }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
          <div style={s.card}>
            <div style={s.cardTitle}>Distribución por estado</div>
            <div style={s.donutWrap}>
              <div style={{ position: 'relative', width: 120, height: 120 }}>
                <Doughnut data={donutData} options={donutOptions} />
              </div>
              <div style={s.donutLabels}>
                {donutItems.map((d) => (
                  <div key={d.label} style={s.dlRow}>
                    <div style={{ ...s.legSq, background: d.color }} />{d.label}
                    <span style={s.dlVal}>{d.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tickets table + filters */}
        <TicketsTable
          allTickets={allTickets}
          title="Tickets recientes"
          showCliente
          showAgente
          showAgenteFilter
          agentesOptions={['CR', 'LM']}
        />
      </div>
    </>
  );
};

export default AdminDashboardPage;
