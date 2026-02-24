// Pure utility functions — copied from the web app (no browser/Next.js deps)
// Sources: web/lib/utils.ts + web/components/weekly-timetable.tsx

import type { TimetableEvent, TimetableData } from './types';

// ─── Timetable constants ───────────────────────────────────────────────────

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const TIME_SLOTS = [
  '11am', '12pm', '1pm', '2pm', '3pm', '4pm',
  '5pm', '6pm', '7pm', '8pm', '9pm', '10pm',
];

// ─── Date / time helpers ───────────────────────────────────────────────────

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getWeekDates(weekOffset: number): Date[] {
  const now = new Date();
  const currentDay = now.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

  const monday = new Date(now.getTime());
  monday.setDate(now.getDate() + mondayOffset + weekOffset * 7);

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday.getTime());
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }
  return dates;
}

export function getMondayOfWeek(weekOffset: number): Date {
  const now = new Date();
  const currentDay = now.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function hourToTimeSlot(hour: number): string {
  if (hour >= 12) {
    return `${hour === 12 ? 12 : hour - 12}pm`;
  }
  return `${hour}am`;
}

export function calculateDurationHours(startTime: string, endTime: string): number {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  const durationMinutes = endTotalMinutes - startTotalMinutes;
  return Math.ceil(durationMinutes / 60);
}

export function organizeEvents(events: TimetableEvent[]): TimetableData {
  const organized: TimetableData = {};

  events.forEach((event) => {
    const date = new Date(event.date);
    const dayIndex = (date.getDay() + 6) % 7;
    const dayName = DAYS[dayIndex];

    const startHour = Number.parseInt(event.startTime.split(':')[0]);
    const startTimeSlot = hourToTimeSlot(startHour);
    const durationHours = calculateDurationHours(event.startTime, event.endTime);

    if (!organized[dayName]) organized[dayName] = {};
    if (!organized[dayName][startTimeSlot]) organized[dayName][startTimeSlot] = [];

    organized[dayName][startTimeSlot].push(event);

    for (let i = 1; i < durationHours; i++) {
      const nextHour = startHour + i;
      const nextTimeSlot = hourToTimeSlot(nextHour);
      if (TIME_SLOTS.indexOf(nextTimeSlot) !== -1) {
        if (!organized[dayName][nextTimeSlot]) organized[dayName][nextTimeSlot] = [];
        organized[dayName][nextTimeSlot].push({ ...event, isBlocked: true });
      }
    }
  });

  return organized;
}

// ─── Slug helpers ──────────────────────────────────────────────────────────

function createTitleSlug(title: string | null | undefined): string {
  if (!title) return '';
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createEventSlug(
  id: number,
  title: string | null | undefined,
  instructor: string | null | undefined,
): string {
  const titleSlug = createTitleSlug(title);
  const instructorSlug = createTitleSlug(instructor);
  if (!instructorSlug) return `${id}-${titleSlug}`;
  return `${id}-${titleSlug}-${instructorSlug}`;
}

export function parseEventSlug(slug: string): number | null {
  if (!slug) return null;
  if (/^\d+$/.test(slug)) return Number.parseInt(slug, 10);
  const match = slug.match(/^(\d+)/);
  if (match) return Number.parseInt(match[1], 10);
  return null;
}

// ─── User helpers ──────────────────────────────────────────────────────────

export function getInitials(name: string): string {
  if (!name || name.trim().length === 0) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function calculateYearsOfExperience(
  startDate: string | Date | null | undefined,
): number | null {
  if (!startDate) return null;
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  if (isNaN(start.getTime())) return null;

  const today = new Date();
  let years = today.getFullYear() - start.getFullYear();
  const monthDiff = today.getMonth() - start.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < start.getDate())) {
    years--;
  }
  return years >= 0 ? years : null;
}

// ─── Event time helpers ────────────────────────────────────────────────────

const THAILAND_OFFSET_HOURS = 7;

export function isEventPast(date: string | Date, endTime: string): boolean {
  const now = new Date();

  let year: number, month: number, day: number;

  if (date instanceof Date) {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
  } else {
    const dateOnly = String(date).split('T')[0].split(' ')[0];
    const dateParts = dateOnly.split('-');
    if (dateParts.length === 3) {
      year = Number.parseInt(dateParts[0], 10);
      month = Number.parseInt(dateParts[1], 10);
      day = Number.parseInt(dateParts[2], 10);
    } else {
      const tempDate = new Date(date);
      if (isNaN(tempDate.getTime())) return false;
      year = tempDate.getFullYear();
      month = tempDate.getMonth() + 1;
      day = tempDate.getDate();
    }
  }

  const timeParts = endTime.split(':');
  if (timeParts.length < 2) return false;

  const hours = Number.parseInt(timeParts[0], 10);
  const minutes = Number.parseInt(timeParts[1], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
    return false;
  }

  const eventEndDateUTC = Date.UTC(year, month - 1, day, hours, minutes, 0, 0);
  const eventEndDate = new Date(eventEndDateUTC - THAILAND_OFFSET_HOURS * 60 * 60 * 1000);
  return now > eventEndDate;
}

// ─── Video helpers ─────────────────────────────────────────────────────────

export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId || urlOrId.trim().length === 0) return null;
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function extractVimeoId(urlOrId: string): string | null {
  if (!urlOrId || urlOrId.trim().length === 0) return null;
  const trimmed = urlOrId.trim();
  if (/^\d+$/.test(trimmed)) return trimmed;
  const patterns = [
    /(?:vimeo\.com\/)(\d+)/,
    /(?:vimeo\.com\/video\/)(\d+)/,
    /(?:player\.vimeo\.com\/video\/)(\d+)/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function getVimeoEmbedUrl(videoId: string): string {
  return `https://player.vimeo.com/video/${videoId}`;
}

// ─── Text helpers ──────────────────────────────────────────────────────────

export function sanitizeText(text: string): string {
  if (!text) return '';
  const withoutTags = text.replace(/<[^>]*>/g, '');
  return withoutTags
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
