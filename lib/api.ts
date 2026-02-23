import { API_BASE_URL } from '@/constants/config';
import type { TimetableEvent, ArtistListItem, ArtistProfileResponse } from './types';

export async function fetchTimetable(
  start: string,
  end: string,
): Promise<TimetableEvent[]> {
  const res = await fetch(
    `${API_BASE_URL}/api/timetable/public?start=${start}&end=${end}`,
  );
  if (!res.ok) throw new Error(`Timetable fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchArtists(): Promise<ArtistListItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/artists`);
  if (!res.ok) throw new Error(`Artists fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchArtist(
  username: string,
): Promise<ArtistProfileResponse> {
  const res = await fetch(`${API_BASE_URL}/api/artists/${username}`);
  if (!res.ok) throw new Error(`Artist fetch failed: ${res.status}`);
  return res.json();
}
