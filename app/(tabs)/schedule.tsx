import React, { useMemo } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, MapPin, X } from 'lucide-react-native';
import { useSavedEvents, type SavedEventSnapshot } from '@/lib/schedule';
import { PC, getEventBorderColor } from '@/constants/Colors';
import { AnimatedItem } from '@/components/AnimatedItem';

function parseDateDayName(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return names[new Date(y, m - 1, d).getDay()];
}

function formatTime(t: string): string {
  return t.substring(0, 5);
}

interface Section {
  title: string;
  data: SavedEventSnapshot[];
}

export default function MyScheduleScreen() {
  const insets = useSafeAreaInsets();
  const { savedEvents, remove } = useSavedEvents();

  const sections: Section[] = useMemo(() => {
    const byDay: Record<string, SavedEventSnapshot[]> = {};
    for (const event of savedEvents) {
      const day = parseDateDayName(event.date);
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(event);
    }
    return Object.entries(byDay)
      .sort(([, a], [, b]) => a[0].date.localeCompare(b[0].date))
      .map(([day, events]) => ({
        title: day.toUpperCase(),
        data: events.sort((a, b) => a.startTime.localeCompare(b.startTime)),
      }));
  }, [savedEvents]);

  return (
    <View className="flex-1 bg-pc-bg">
      {/* Brand header */}
      <View className="px-5 pb-4" style={{ paddingTop: insets.top + 12 }}>
        <Text className="text-pc-accent text-[11px] font-bold tracking-[2px] mb-1">
          PARADISE CIRCUS
        </Text>
        <Text className="text-pc-text text-[30px] font-rye mb-1">My Schedule</Text>
        <Text className="text-pc-textMuted text-sm">
          {savedEvents.length === 0
            ? 'No workshops saved yet'
            : `${savedEvents.length} ${savedEvents.length === 1 ? 'workshop' : 'workshops'} booked`}
        </Text>
      </View>

      {savedEvents.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-4xl mb-4">📅</Text>
          <Text className="text-pc-text text-lg font-bold mb-2 text-center">
            Your schedule is empty
          </Text>
          <Text className="text-pc-textMuted text-sm text-center leading-5">
            Tap on a workshop in the Timetable and hit "Add to My Schedule"
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          contentContainerClassName="px-5 pb-8"
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <AnimatedItem index={0}>
              <View className="flex-row items-center mt-5 mb-3 gap-2">
                <View className="w-2 h-2 rounded-full bg-pc-accent" />
                <Text className="text-pc-textMuted text-[11px] font-bold tracking-wider">
                  {section.title}
                </Text>
                <View className="flex-1 h-px bg-pc-separator" />
              </View>
            </AnimatedItem>
          )}
          renderItem={({ item, index }) => (
            <AnimatedItem index={index + 1}>
            <View
              className="bg-pc-card rounded-xl border-l-[3px] p-3.5 mb-2.5 relative"
              style={{ borderLeftColor: getEventBorderColor(item.id) }}
            >
              {/* Remove button */}
              <TouchableOpacity
                onPress={() => remove(item.id)}
                className="absolute top-3 right-3 bg-[#2A1010] rounded-md p-1.5"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={16} color="#EF4444" />
              </TouchableOpacity>

              {/* Time */}
              <View className="flex-row items-center mb-1.5">
                <Clock size={13} color={PC.textMuted} className="mr-1" />
                <Text className="text-pc-textMuted text-[13px]">
                  {formatTime(item.startTime)} – {formatTime(item.endTime)}
                </Text>
              </View>

              <Text className="text-pc-text text-[17px] font-bold mb-2 pr-9">{item.title}</Text>

              <View className="flex-row justify-between items-center">
                {item.instructorDisplayName || item.instructor ? (
                  <Text className="text-pc-accent text-sm font-medium flex-1">
                    {item.instructorDisplayName || item.instructor}
                  </Text>
                ) : (
                  <View />
                )}
                {item.location ? (
                  <View className="flex-row items-center">
                    <MapPin size={12} color={PC.textMuted} className="mr-1" />
                    <Text className="text-pc-textMuted text-[13px]">{item.location}</Text>
                  </View>
                ) : null}
              </View>
            </View>
            </AnimatedItem>
          )}
        />
      )}
    </View>
  );
}
