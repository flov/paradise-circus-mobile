import * as Calendar from "expo-calendar"
import { Alert, Platform } from "react-native"
import type { TimetableEvent } from "@/lib/types"

function buildDate(dateStr: string, timeStr: string): Date {
  // dateStr: "YYYY-MM-DD", timeStr: "HH:MM" or "HH:MM:SS"
  // Events are in Thailand time (UTC+7). We construct a UTC date
  // by subtracting 7 hours from the local Thailand time.
  const [y, m, d] = dateStr.split("-").map(Number)
  const [h, min] = timeStr.split(":").map(Number)
  return new Date(Date.UTC(y, m - 1, d, h - 7, min))
}

async function getDefaultCalendarId(): Promise<string | null> {
  if (Platform.OS === "ios") {
    const defaultCal = await Calendar.getDefaultCalendarAsync()
    return defaultCal.id
  }

  // Android: find the first modifiable calendar
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT,
  )
  const writable = calendars.find(
    (c) => c.allowsModifications && c.accessLevel === "owner",
  )
  return writable?.id ?? calendars[0]?.id ?? null
}

export async function addEventToCalendar(
  event: TimetableEvent,
): Promise<void> {
  const { status } = await Calendar.requestCalendarPermissionsAsync()
  if (status !== "granted") {
    Alert.alert(
      "Permission required",
      "Calendar access is needed to add events.",
    )
    return
  }

  const calendarId = await getDefaultCalendarId()
  if (!calendarId) {
    Alert.alert("No calendar found", "Could not find a calendar on this device.")
    return
  }

  const startDate = buildDate(event.date as string, event.startTime)
  const endDate = buildDate(event.date as string, event.endTime)

  const notes = [
    event.description,
    event.instructor
      ? `Instructor: ${event.instructorDisplayName || event.instructor}`
      : null,
    event.prop ? `Prop: ${event.prop.name}` : null,
    event.whatToBring ? `Bring: ${event.whatToBring}` : null,
  ]
    .filter(Boolean)
    .join("\n\n")

  try {
    await Calendar.createEventAsync(calendarId, {
      title: event.title,
      startDate,
      endDate,
      location: event.location ?? undefined,
      notes,
      timeZone: "Asia/Bangkok",
    })
    Alert.alert("Added to calendar", `"${event.title}" has been added.`)
  } catch {
    Alert.alert("Error", "Could not add the event to your calendar.")
  }
}
