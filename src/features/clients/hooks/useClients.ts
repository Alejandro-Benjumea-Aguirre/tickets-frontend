// hooks/useClients.ts
import { useState, useMemo } from 'react';
import { Client, ClientFilters, CreateClientForm, EditClientForm } from '../types/clients.types';
import { MOCK_CLIENTS, EMPTY_FILTERS } from '../data/clientsConstant';

export const useClients = () => {
  const [filters, setFilters] = useState<ClientFilters>(EMPTY_FILTERS);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);

  // Memorizamos el filtrado para evitar cálculos innecesarios
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const f = filters;
      if (f.name && !c.name.toLowerCase().includes(f.name.toLowerCase())) return false;
      if (f.email && !c.email.toLowerCase().includes(f.email.toLowerCase())) return false;
      if (f.phone && !c.phone.includes(f.phone)) return false;
      if (f.engineer && !c.engineer.toLowerCase().includes(f.engineer.toLowerCase())) return false;
      if (f.status && c.status !== f.status) return false;
      if (f.fechaDesde && c.createdAt < f.fechaDesde) return false;
      if (f.fechaHasta && c.createdAt > f.fechaHasta) return false;
      return true;
    });
  }, [clients, filters]);

  const setFilter = (key: keyof ClientFilters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  const handleToggleStatus = (id: number) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
      )
    );
  };

  const handleSave = (form: CreateClientForm) => {
    const newClient: Client = {
      id: clients.length + 1,
      name: form.name,
      email: form.email,
      phone: form.phone || '—',
      engineer: form.engineer || '—',
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setClients((prev) => [newClient, ...prev]);
    setShowModal(false);
  };

  const handleEditSave = (id: number, form: EditClientForm) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, email: form.email, phone: form.phone || '—', engineer: form.engineer || '—' }
          : c
      )
    );
    setEditClient(null);
  };

  return {
    clients: filteredClients,
    totalCount: filteredClients.length,
    filters,
    setFilter,
    clearFilters,
    showModal,
    setShowModal,
    editClient,
    setEditClient,
    handleToggleStatus,
    handleSave,
    handleEditSave,
    hasActiveFilters: Object.values(filters).some((v) => v !== ''),
  };
};