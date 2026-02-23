import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchTimetable } from '@/lib/api';
import { getWeekDates, formatLocalDate } from '@/lib/utils';
import { useSavedEvents } from '@/lib/schedule';
import { PC } from '@/constants/Colors';
import EventCard from '@/components/EventCard';
import type { TimetableEvent } from '@/lib/types';

const DAY_ABBREVS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function getTodayIndex(): number {
  const day = new Date().getDay(); // 0=Sun
  return day === 0 ? 6 : day - 1; // Mon=0
}

function parseDateDayIndex(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  const day = new Date(y, m - 1, d).getDay(); // 0=Sun
  return day === 0 ? 6 : day - 1; // Mon=0
}

export default function TimetableScreen() {
  const weekDates = useMemo(() => getWeekDates(0), []);
  const start = useMemo(() => formatLocalDate(weekDates[0]), [weekDates]);
  const end = useMemo(() => formatLocalDate(weekDates[6]), [weekDates]);

  const todayIndex = useMemo(getTodayIndex, []);
  const [selectedDay, setSelectedDay] = useState(todayIndex);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['timetable', start, end],
    queryFn: () => fetchTimetable(start, end),
  });

  const { isGoing, toggle } = useSavedEvents();

  // Group events by day index (Mon=0 ... Sun=6), sorted by startTime
  const eventsByDay = useMemo(() => {
    const result: TimetableEvent[][] = Array.from({ length: 7 }, () => []);
    if (!events) return result;
    for (const event of events) {
      if (event.isBlocked) continue;
      const idx = parseDateDayIndex(event.date);
      result[idx].push(event);
    }
    for (const dayEvents of result) {
      dayEvents.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return result;
  }, [events]);

  const selectedEvents = eventsByDay[selectedDay] ?? [];

  function handleCardPress(id: number) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Brand header */}
        <View style={styles.header}>
          <Text style={styles.brand}>PARADISE CIRCUS</Text>
          <Text style={styles.pageTitle}>Weekly Timetable</Text>
        </View>

        {/* Day chip selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {DAY_ABBREVS.map((abbrev, i) => {
            const count = eventsByDay[i]?.length ?? 0;
            const isSelected = i === selectedDay;
            return (
              <TouchableOpacity
                key={abbrev}
                onPress={() => {
                  setSelectedDay(i);
                  setExpandedId(null);
                }}
                style={[styles.chip, isSelected && styles.chipSelected]}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {abbrev}
                </Text>
                <View style={[styles.chipBadge, isSelected && styles.chipBadgeSelected]}>
                  <Text style={styles.chipBadgeText}>{count}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Day label */}
        <View style={styles.dayHeader}>
          <Text style={styles.dayName}>{DAY_FULL[selectedDay]}</Text>
          <Text style={styles.dayCount}>
            {selectedEvents.length} {selectedEvents.length === 1 ? 'workshop' : 'workshops'}
          </Text>
        </View>

        {/* Events */}
        <View style={styles.eventList}>
          {isLoading && (
            <ActivityIndicator color={PC.accent} style={styles.loader} />
          )}
          {isError && (
            <Text style={styles.emptyText}>Could not load workshops. Check your connection.</Text>
          )}
          {!isLoading && !isError && selectedEvents.length === 0 && (
            <Text style={styles.emptyText}>No workshops today</Text>
          )}
          {selectedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isExpanded={expandedId === event.id}
              onPress={() => handleCardPress(event.id)}
              isGoing={isGoing(event.id)}
              onToggleSchedule={() => toggle(event)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PC.bg,
  },
  scroll: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  brand: {
    color: PC.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
  },
  pageTitle: {
    color: PC.text,
    fontSize: 30,
    fontWeight: '800',
  },
  chipRow: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PC.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: PC.accent,
  },
  chipText: {
    color: PC.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#000',
  },
  chipBadge: {
    backgroundColor: '#0D0A07',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  chipBadgeSelected: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  chipBadgeText: {
    color: PC.text,
    fontSize: 11,
    fontWeight: '700',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  dayName: {
    color: PC.text,
    fontSize: 22,
    fontWeight: '700',
  },
  dayCount: {
    color: PC.textMuted,
    fontSize: 13,
  },
  eventList: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  loader: {
    marginTop: 40,
  },
  emptyText: {
    color: PC.textMuted,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
});
