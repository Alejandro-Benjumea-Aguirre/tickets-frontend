// src/features/users/hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { getUsers, setUser, updateUser, updateStatus } from '../services/userService';
import { User, UserFilters, CreateUserForm, EditUserForm } from '../types/users.types';
import { MOCK_USERS, EMPTY_FILTERS } from '../data/usersConstant';
import Swal from 'sweetalert2';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const useUsers = () => {
  const [users, setUsers]       = useState<User[]>([]);
  const [filters, setFilters]   = useState<UserFilters>(EMPTY_FILTERS);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const fetchUsers = async (): Promise<void> => {
    if (USE_MOCK) { setUsers(MOCK_USERS); return; }
    try {
      const data = await getUsers();
      setUsers(data.data.body ?? []);
    } catch {
      Swal.fire({ title: 'Error', text: 'No se pudieron cargar los usuarios.', icon: 'error', confirmButtonColor: '#1D9E75' });
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const setFilter = (key: keyof UserFilters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleToggleStatus = async (id: number, currentStatus: string | undefined) => {
    if (USE_MOCK) {
      setUsers((prev) => prev.map((u) =>
        u.id === id ? { ...u, status: currentStatus === 'active' ? 'inactive' : 'active' } : u
      ));
      return;
    }
    try {
      await updateStatus(id, currentStatus === 'active' ? 2 : 1);
      await fetchUsers();
    } catch {
      Swal.fire({ title: 'Error', text: 'No se pudo cambiar el estado.', icon: 'error', confirmButtonColor: '#1D9E75' });
    }
  };

  const handleEditSave = async (id: number, form: EditUserForm) => {
    if (USE_MOCK) {
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, ...form } : u));
      setEditUser(null);
      return;
    }
    try {
      const target = users.find((u) => u.id === id);
      if (!target) return;
      await updateUser(id, { ...target, ...form });
      await fetchUsers();
      setEditUser(null);
    } catch {
      Swal.fire({ title: 'Error', text: 'No se pudo guardar los cambios.', icon: 'error', confirmButtonColor: '#1D9E75' });
    }
  };

  const handleSave = async (form: CreateUserForm) => {
    const newUser: User = {
      id:         USE_MOCK ? (users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1) : 0,
      name:       form.name,
      username:   form.name.split(' ').map((w) => w[0]).join('').toLowerCase(),
      email:      form.email,
      phone:      form.phone,
      rol_id:     Number(form.rol_id),
      rol:        ({ '1': 'Administrador', '2': 'Agente', '3': 'Cliente' } as Record<string, string>)[form.rol_id] ?? '',
      client:     form.client,
      password:   form.password,
      status:     'active',
      created_at: new Date().toISOString().slice(0, 10),
    };
    if (USE_MOCK) { setUsers((prev) => [newUser, ...prev]); setShowModal(false); return; }
    try {
      await setUser(newUser);
      await fetchUsers();
      setShowModal(false);
    } catch {
      Swal.fire({ title: 'Error', text: 'No se pudo crear el usuario.', icon: 'error', confirmButtonColor: '#1D9E75' });
    }
  };

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  return {
    users, filters, showModal, editUser,
    setFilter, setShowModal, setEditUser,
    handleToggleStatus, handleEditSave, handleSave,
    clearFilters,
    hasActiveFilters: Object.values(filters).some((v) => v !== ''),
  };
};