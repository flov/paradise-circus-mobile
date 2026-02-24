import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchTimetable } from '@/lib/api';
import { getWeekDates, formatLocalDate } from '@/lib/utils';
import { useSavedEvents } from '@/lib/schedule';
import { PC } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import EventCard from '@/components/EventCard';
import type { TimetableEvent } from '@/lib/types';

const DAY_ABBREVS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getTodayIndex(): number {
  const day = new Date().getDay(); // 0=Sun
  return day === 0 ? 6 : day - 1; // Mon=0
}

function parseDateDayIndex(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  const day = new Date(y, m - 1, d).getDay(); // 0=Sun
  return day === 0 ? 6 : day - 1; // Mon=0
}

function formatWeekRange(monday: Date, sunday: Date): string {
  const d1 = monday.getDate();
  const m1 = MONTHS[monday.getMonth()];
  const y1 = monday.getFullYear();
  const d2 = sunday.getDate();
  const m2 = MONTHS[sunday.getMonth()];
  const y2 = sunday.getFullYear();

  if (y1 !== y2) {
    return `${m1} ${d1}, ${y1} – ${m2} ${d2}, ${y2}`;
  }
  if (m1 !== m2) {
    return `${m1} ${d1} – ${m2} ${d2}, ${y2}`;
  }
  return `${m1} ${d1} – ${d2}, ${y1}`;
}

export default function TimetableScreen() {
  const todayIndex = useMemo(getTodayIndex, []);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(todayIndex);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const start = useMemo(() => formatLocalDate(weekDates[0]), [weekDates]);
  const end = useMemo(() => formatLocalDate(weekDates[6]), [weekDates]);
  const weekLabel = useMemo(() => formatWeekRange(weekDates[0], weekDates[6]), [weekDates]);

  function changeWeek(delta: number) {
    const newOffset = weekOffset + delta;
    setWeekOffset(newOffset);
    setExpandedId(null);
    setSelectedDay(newOffset === 0 ? todayIndex : 0);
  }

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
    <SafeAreaView className="flex-1 bg-pc-bg">
      <LinearGradient
        colors={['#3D1A04', '#1A0A02', PC.bg]}
        locations={[0, 0.5, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 420 }}
        pointerEvents="none"
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Brand header */}
        <View className="px-5 pt-5 pb-4">
          <Text className="text-pc-accent text-[11px] font-bold tracking-[2px] mb-1">
            PARADISE CIRCUS
          </Text>
          <Text className="text-pc-text text-[30px] font-extrabold">Weekly Timetable</Text>
        </View>

        {/* Week navigator */}
        <View className="flex-row items-center justify-between px-3 mb-4">
          <TouchableOpacity onPress={() => changeWeek(-1)} className="p-2" activeOpacity={0.7}>
            <ChevronLeft size={20} color={PC.textMuted} />
          </TouchableOpacity>
          <Text className="text-pc-textSecondary text-sm font-semibold">{weekLabel}</Text>
          <TouchableOpacity onPress={() => changeWeek(1)} className="p-2" activeOpacity={0.7}>
            <ChevronRight size={20} color={PC.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Day chip selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row px-5 pb-5 gap-2">
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
                className={`flex-row items-center rounded-2xl py-2 px-3.5 gap-1.5 ${
                  isSelected ? 'bg-pc-accent' : 'bg-pc-card'
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-sm font-semibold ${isSelected ? 'text-black' : 'text-pc-textMuted'}`}
                >
                  {abbrev}
                </Text>
                <View
                  className={`min-w-5 h-5 justify-center items-center px-1 rounded-[10px] ${
                    isSelected ? 'bg-black/30' : 'bg-[#0D0A07]'
                  }`}
                >
                  <Text className="text-pc-text text-[11px] font-bold">{count}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
          </View>
        </ScrollView>

        {/* Day label */}
        <View className="flex-row justify-between items-baseline px-5 mb-4">
          <Text className="text-pc-text text-[22px] font-bold">{DAY_FULL[selectedDay]}</Text>
          <Text className="text-pc-textMuted text-[13px]">
            {selectedEvents.length} {selectedEvents.length === 1 ? 'workshop' : 'workshops'}
          </Text>
        </View>

        {/* Events */}
        <View className="px-5 pb-8">
          {isLoading && (
            <ActivityIndicator color={PC.accent} className="mt-10" />
          )}
          {isError && (
            <Text className="text-pc-textMuted text-[15px] text-center mt-10">
              Could not load workshops. Check your connection.
            </Text>
          )}
          {!isLoading && !isError && selectedEvents.length === 0 && (
            <Text className="text-pc-textMuted text-[15px] text-center mt-10">
              No workshops today
            </Text>
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
