const ACCENT = '#F09010';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: ACCENT,
    tabIconDefault: '#ccc',
    tabIconSelected: ACCENT,
  },
  dark: {
    text: '#fff',
    background: '#0D0A07',
    tint: ACCENT,
    tabIconDefault: '#6A6460',
    tabIconSelected: ACCENT,
  },
};

export const PC = {
  bg: '#0D0A07',
  card: '#1C1815',
  cardBorder: '#2A2420',
  accent: '#F09010',
  accentDanger: '#3A1808',
  text: '#FFFFFF',
  textMuted: '#8A8078',
  textSecondary: '#C0B8B0',
  separator: '#2A2420',
  instructor: '#DC2626',
  instagram: '#E1306C',
  purple: '#A855F7',
} as const;

const EVENT_BORDER_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
export function getEventBorderColor(id: number): string {
  return EVENT_BORDER_COLORS[id % EVENT_BORDER_COLORS.length];
}

const AVATAR_BG_COLORS = ['#7B2020', '#8B7020', '#5B3A8B', '#2B7B5A', '#8B3A30', '#2B7B7B', '#6B4050', '#4A5B30'];
export function getAvatarBgColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_BG_COLORS[Math.abs(hash) % AVATAR_BG_COLORS.length];
}
