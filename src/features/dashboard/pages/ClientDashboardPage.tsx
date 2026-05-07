import { useState, useContext } from 'react';
import CreateTicketModal from '../../tickets/components/CreateTicketModal';
import { AuthContext } from '../../auth/context/AuthContext';
import { Navbar } from '../../../layouts/Navbar';
import { clientKpis, myTickets } from '../data/dashboardConstant';
import { TicketsTable } from '../../tickets/components/TicketsTable';
import { s } from '../styles/DashboardPage.styles';

// ── Component ─────────────────────────────────────────────────────────────────

const ClientDashboardPage = () => {
  const authContext = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  if (!authContext) return <div>Error: AuthContext no está disponible</div>;

  const { user, logoutUser } = authContext;

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
            <span style={s.appTitle}>Mis solicitudes de soporte</span>
            <button style={s.addBtn} onClick={() => setShowModal(true)}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nuevo ticket
            </button>
          </div>
          <span style={s.greeting}>Bienvenido, {user?.name ?? 'Cliente'}</span>
        </div>

        {/* KPIs */}
        <div style={s.kpis}>
          {clientKpis.map((k) => (
            <div key={k.label} style={s.kpi}>
              <div style={s.kpiLabel}><span style={{ ...s.kpiDot, background: k.dot }} />{k.label}</div>
              <div style={s.kpiVal}>{k.val}</div>
              <div style={s.kpiSub}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Tickets table + filters */}
        <TicketsTable
          allTickets={myTickets}
          title="Mis tickets"
          closedLabel="Resuelto"
          showPrioridadFilter={false}
          showEnEsperaFilter={false}
        />
      </div>
    </>
  );
};

export default ClientDashboardPage;
