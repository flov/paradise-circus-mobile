import React, { useMemo } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Clock, MapPin, X } from 'lucide-react-native';
import { useSavedEvents, type SavedEventSnapshot } from '@/lib/schedule';
import { PC, getEventBorderColor } from '@/constants/Colors';

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
    <SafeAreaView style={styles.safe}>
      {/* Brand header */}
      <View style={styles.header}>
        <Text style={styles.brand}>PARADISE CIRCUS</Text>
        <Text style={styles.pageTitle}>My Schedule</Text>
        <Text style={styles.subtitle}>
          {savedEvents.length === 0
            ? 'No workshops saved yet'
            : `${savedEvents.length} ${savedEvents.length === 1 ? 'workshop' : 'workshops'} booked`}
        </Text>
      </View>

      {savedEvents.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>Your schedule is empty</Text>
          <Text style={styles.emptyBody}>
            Tap on a workshop in the Timetable and hit "Add to My Schedule"
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionLine} />
            </View>
          )}
          renderItem={({ item }) => (
            <View style={[styles.card, { borderLeftColor: getEventBorderColor(item.id) }]}>
              {/* Remove button */}
              <TouchableOpacity
                onPress={() => remove(item.id)}
                style={styles.removeBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={16} color="#EF4444" />
              </TouchableOpacity>

              {/* Time */}
              <View style={styles.timeRow}>
                <Clock size={13} color={PC.textMuted} style={styles.icon} />
                <Text style={styles.time}>
                  {formatTime(item.startTime)} – {formatTime(item.endTime)}
                </Text>
              </View>

              <Text style={styles.title}>{item.title}</Text>

              <View style={styles.bottomRow}>
                {item.instructorDisplayName || item.instructor ? (
                  <Text style={styles.instructor}>
                    {item.instructorDisplayName || item.instructor}
                  </Text>
                ) : (
                  <View />
                )}
                {item.location ? (
                  <View style={styles.locationRow}>
                    <MapPin size={12} color={PC.textMuted} style={styles.icon} />
                    <Text style={styles.location}>{item.location}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PC.bg,
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
    marginBottom: 4,
  },
  subtitle: {
    color: PC.textMuted,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
    gap: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PC.accent,
  },
  sectionTitle: {
    color: PC.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: PC.separator,
  },
  card: {
    backgroundColor: PC.card,
    borderRadius: 12,
    borderLeftWidth: 3,
    padding: 14,
    marginBottom: 10,
    position: 'relative',
  },
  removeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#2A1010',
    borderRadius: 6,
    padding: 5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 4,
  },
  time: {
    color: PC.textMuted,
    fontSize: 13,
  },
  title: {
    color: PC.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
    paddingRight: 36,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instructor: {
    color: PC.accent,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    color: PC.textMuted,
    fontSize: 13,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  emptyTitle: {
    color: PC.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyBody: {
    color: PC.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
