import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, MapPin } from 'lucide-react-native';
import { PC, getEventBorderColor } from '@/constants/Colors';
import type { TimetableEvent } from '@/lib/types';

interface Props {
  event: TimetableEvent;
  isExpanded: boolean;
  onPress: () => void;
  isGoing: boolean;
  onToggleSchedule: () => void;
}

function formatTime(t: string): string {
  return t.substring(0, 5);
}

export default function EventCard({ event, isExpanded, onPress, isGoing, onToggleSchedule }: Props) {
  const instructorName = event.instructorDisplayName || event.instructor;
  const borderColor = getEventBorderColor(event.id);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, { borderLeftColor: borderColor }]}
    >
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.timeRow}>
          <Clock size={13} color={PC.textMuted} style={styles.icon} />
          <Text style={styles.time}>
            {formatTime(event.startTime)} – {formatTime(event.endTime)}
          </Text>
        </View>
        {isGoing && (
          <View style={styles.joinedBadge}>
            <Text style={styles.joinedBadgeText}>✓ Joined</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>{event.title}</Text>

      <View style={styles.bottomRow}>
        {instructorName ? (
          <Text style={styles.instructor}>{instructorName}</Text>
        ) : (
          <View />
        )}
        {event.location ? (
          <View style={styles.locationRow}>
            <MapPin size={12} color={PC.textMuted} style={styles.icon} />
            <Text style={styles.location}>{event.location}</Text>
          </View>
        ) : null}
      </View>

      {/* Expanded content */}
      {isExpanded && (
        <View style={styles.expanded}>
          <View style={styles.divider} />
          {event.description ? (
            <Text style={styles.description}>{event.description}</Text>
          ) : null}
          <TouchableOpacity
            onPress={onToggleSchedule}
            style={[styles.scheduleBtn, isGoing && styles.scheduleBtnRemove]}
            activeOpacity={0.8}
          >
            <Text style={[styles.scheduleBtnText, isGoing && styles.scheduleBtnTextRemove]}>
              {isGoing ? '× Remove from Schedule' : '+ Add to My Schedule'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: PC.card,
    borderRadius: 12,
    borderLeftWidth: 3,
    padding: 14,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  time: {
    color: PC.textMuted,
    fontSize: 13,
  },
  joinedBadge: {
    backgroundColor: PC.accent,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  joinedBadgeText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: PC.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
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
  expanded: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: PC.separator,
    marginVertical: 10,
  },
  description: {
    color: PC.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  scheduleBtn: {
    backgroundColor: PC.accent,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  scheduleBtnRemove: {
    backgroundColor: PC.accentDanger,
    borderWidth: 1,
    borderColor: '#8B2020',
  },
  scheduleBtnText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
  },
  scheduleBtnTextRemove: {
    color: '#EF4444',
  },
});
