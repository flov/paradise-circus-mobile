import AsyncStorage from "@react-native-async-storage/async-storage"
import { useState, useEffect, useCallback } from "react"
import type { ReactNode } from "react"
import {
  SavedEventsContext,
  STORAGE_KEY,
  toSnapshot,
  type SavedEventSnapshot,
  type SchedulableEvent,
} from "@/lib/schedule"

export function SavedEventsProvider({
  children,
}: {
  children: ReactNode
}): ReactNode {
  const [savedEvents, setSavedEvents] = useState<SavedEventSnapshot[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => {
        if (json) {
          try {
            setSavedEvents(JSON.parse(json))
          } catch {
            // ignore corrupt data
          }
        }
        setIsLoaded(true)
      })
      .catch(() => {
        setIsLoaded(true)
      })
  }, [])

  const toggle = useCallback(async (event: SchedulableEvent) => {
    const snapshot = toSnapshot(event)
    setSavedEvents((prev) => {
      const exists = prev.some((e) => e.id === event.id)
      const next = exists
        ? prev.filter((e) => e.id !== event.id)
        : [...prev, snapshot]
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {})
      return next
    })
  }, [])

  const remove = useCallback(async (id: number) => {
    setSavedEvents((prev) => {
      const next = prev.filter((e) => e.id !== id)
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {})
      return next
    })
  }, [])

  const isGoing = useCallback(
    (id: number): boolean => {
      return savedEvents.some((e) => e.id === id)
    },
    [savedEvents],
  )

  return (
    <SavedEventsContext.Provider
      value={{ savedEvents, isGoing, toggle, remove, isLoaded }}
    >
      {children}
    </SavedEventsContext.Provider>
  )
}
