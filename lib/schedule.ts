import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'paradise_saved_events_v1';

export interface SavedEventSnapshot {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string | null;
  instructor: string | null;
  instructorDisplayName?: string | null;
  instructorAvatarUrl?: string | null;
  description?: string | null;
}

export interface SchedulableEvent {
  id: number;
  title: string;
  date: string | Date;
  startTime: string;
  endTime: string;
  location: string | null;
  instructor?: string | null;
  instructorDisplayName?: string | null;
  instructorAvatarUrl?: string | null;
  description?: string | null;
}

function toSnapshot(event: SchedulableEvent): SavedEventSnapshot {
  const date = event.date instanceof Date
    ? `${event.date.getFullYear()}-${String(event.date.getMonth() + 1).padStart(2, '0')}-${String(event.date.getDate()).padStart(2, '0')}`
    : event.date;
  return {
    id: event.id,
    title: event.title,
    date,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    instructor: event.instructor ?? null,
    instructorDisplayName: event.instructorDisplayName,
    instructorAvatarUrl: event.instructorAvatarUrl,
    description: event.description,
  };
}

export function useSavedEvents() {
  const [savedEvents, setSavedEvents] = useState<SavedEventSnapshot[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((json) => {
      if (json) {
        try {
          setSavedEvents(JSON.parse(json));
        } catch {
          // ignore corrupt data
        }
      }
      setIsLoaded(true);
    });
  }, []);

  const persist = useCallback(async (events: SavedEventSnapshot[]) => {
    setSavedEvents(events);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, []);

  const toggle = useCallback(async (event: SchedulableEvent) => {
    const snapshot = toSnapshot(event);
    const exists = savedEvents.some((e) => e.id === event.id);
    if (exists) {
      await persist(savedEvents.filter((e) => e.id !== event.id));
    } else {
      await persist([...savedEvents, snapshot]);
    }
  }, [savedEvents, persist]);

  const remove = useCallback(async (id: number) => {
    await persist(savedEvents.filter((e) => e.id !== id));
  }, [savedEvents, persist]);

  const isGoing = useCallback((id: number): boolean => {
    return savedEvents.some((e) => e.id === id);
  }, [savedEvents]);

  return { savedEvents, isGoing, toggle, remove, isLoaded };
}
