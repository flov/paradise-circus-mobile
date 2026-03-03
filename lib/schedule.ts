import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, useContext } from "react"

export const STORAGE_KEY = "paradise_saved_events_v1"

export interface SavedEventSnapshot {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  location: string | null
  instructor: string | null
  instructorDisplayName?: string | null
  instructorAvatarUrl?: string | null
  description?: string | null
}

export interface SchedulableEvent {
  id: number
  title: string
  date: string | Date
  startTime: string
  endTime: string
  location: string | null
  instructor?: string | null
  instructorDisplayName?: string | null
  instructorAvatarUrl?: string | null
  description?: string | null
}

export function toSnapshot(event: SchedulableEvent): SavedEventSnapshot {
  const date =
    event.date instanceof Date
      ? `${event.date.getFullYear()}-${String(event.date.getMonth() + 1).padStart(2, "0")}-${String(event.date.getDate()).padStart(2, "0")}`
      : event.date
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
  }
}

export interface SavedEventsContextValue {
  savedEvents: SavedEventSnapshot[]
  isGoing: (id: number) => boolean
  toggle: (event: SchedulableEvent) => Promise<void>
  remove: (id: number) => Promise<void>
  isLoaded: boolean
}

export const SavedEventsContext =
  createContext<SavedEventsContextValue | null>(null)

export function useSavedEvents() {
  const context = useContext(SavedEventsContext)
  if (!context) {
    throw new Error("useSavedEvents must be used within a SavedEventsProvider")
  }
  return context
}
