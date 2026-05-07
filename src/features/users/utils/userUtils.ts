// ── Filter logic ──────────────────────────────────────────────────────────────

import { User, UserFilters } from "../types/users.types";

export function applyFilters(users: User[], f: UserFilters): User[] {
  return users.filter((u) => {
    if (f.name   && !u.name.toLowerCase().includes(f.name.toLowerCase())) return false;
    if (f.rol_id && String(u.rol_id) !== f.rol_id)                         return false;
    if (f.status && u.status !== f.status)                                  return false;
    if (f.fechaDesde && u.created_at < f.fechaDesde)                        return false;
    if (f.fechaHasta && u.created_at > f.fechaHasta)                        return false;
    return true;
  });
}