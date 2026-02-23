import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
      className="bg-pc-card rounded-xl border-l-[3px] p-3.5 mb-3"
      style={{ borderLeftColor: borderColor }}
    >
      {/* Header row */}
      <View className="flex-row justify-between items-center mb-1.5">
        <View className="flex-row items-center">
          <Clock size={13} color={PC.textMuted} className="mr-1" />
          <Text className="text-pc-textMuted text-[13px]">
            {formatTime(event.startTime)} – {formatTime(event.endTime)}
          </Text>
        </View>
        {isGoing && (
          <View className="bg-pc-accent rounded-md px-2 py-0.5">
            <Text className="text-black text-[11px] font-bold">✓ Joined</Text>
          </View>
        )}
      </View>

      <Text className="text-pc-text text-[17px] font-bold mb-2">{event.title}</Text>

      <View className="flex-row justify-between items-center">
        {instructorName ? (
          <Text className="text-pc-accent text-sm font-medium flex-1">{instructorName}</Text>
        ) : (
          <View />
        )}
        {event.location ? (
          <View className="flex-row items-center">
            <MapPin size={12} color={PC.textMuted} className="mr-1" />
            <Text className="text-pc-textMuted text-[13px]">{event.location}</Text>
          </View>
        ) : null}
      </View>

      {/* Expanded content */}
      {isExpanded && (
        <View className="mt-2">
          <View className="h-px bg-pc-separator my-2.5" />
          {event.description ? (
            <Text className="text-pc-textSecondary text-sm leading-[21px] mb-3.5">
              {event.description}
            </Text>
          ) : null}
          <TouchableOpacity
            onPress={onToggleSchedule}
            className={`rounded-[10px] py-3 items-center ${
              isGoing ? 'bg-pc-accentDanger border border-[#8B2020]' : 'bg-pc-accent'
            }`}
            activeOpacity={0.8}
          >
            <Text
              className={`text-[15px] font-bold ${isGoing ? 'text-red-500' : 'text-black'}`}
            >
              {isGoing ? '× Remove from Schedule' : '+ Add to My Schedule'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}
