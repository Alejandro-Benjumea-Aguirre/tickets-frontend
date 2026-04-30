export const getInitials = (name: string) =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export const getAvatarBg = (name: string) => {
  const colors = ['#1D9E75', '#378ADD', '#7C5CBF', '#EF9F27', '#E24B4A', '#0891B2'];
  return colors[name.charCodeAt(0) % colors.length];
};

export const formatDateCO = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-CO', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
};