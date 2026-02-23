import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Calendar, Clock, MapPin } from 'lucide-react-native';
import { fetchArtist } from '@/lib/api';
import { useSavedEvents } from '@/lib/schedule';
import { PC, getAvatarBgColor, getEventBorderColor } from '@/constants/Colors';
import { getInitials } from '@/lib/utils';

function parseDateStr(date: string | Date): string {
  if (date instanceof Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  return String(date).split('T')[0];
}

function formatTime(t: string): string {
  return t.substring(0, 5);
}

function getShortDayName(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return names[new Date(y, m - 1, d).getDay()];
}


export default function ArtistProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const { isGoing, toggle } = useSavedEvents();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['artist', username],
    queryFn: () => fetchArtist(username),
    enabled: !!username,
  });

  const upcomingWorkshops = useMemo(() => {
    if (!data?.workshops?.upcoming) return [];
    return [...data.workshops.upcoming].sort((a, b) =>
      parseDateStr(a.date).localeCompare(parseDateStr(b.date)),
    );
  }, [data]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-pc-bg">
        <ActivityIndicator color={PC.accent} className="mt-[60px]" />
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView className="flex-1 bg-pc-bg">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center px-5 pt-4 pb-2">
          <ChevronLeft size={18} color={PC.accent} />
          <Text className="text-pc-accent text-base font-semibold ml-0.5">Artists</Text>
        </TouchableOpacity>
        <Text className="text-pc-textMuted text-[15px] text-center mt-10">
          Could not load artist profile.
        </Text>
      </SafeAreaView>
    );
  }

  const { user, props } = data;
  const displayName = user.displayName || user.username;
  const initials = getInitials(displayName);
  const avatarBg = getAvatarBgColor(user.username);

  return (
    <SafeAreaView className="flex-1 bg-pc-bg">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center px-5 pt-4 pb-2">
          <ChevronLeft size={18} color={PC.accent} />
          <Text className="text-pc-accent text-base font-semibold ml-0.5">Artists</Text>
        </TouchableOpacity>

        {/* Avatar */}
        <View className="items-center pt-5 pb-4 px-5">
          <View
            className="w-[88px] h-[88px] rounded-[44px] justify-center items-center mb-3.5"
            style={{ backgroundColor: avatarBg }}
          >
            <Text className="text-pc-accent text-[28px] font-bold">{initials}</Text>
          </View>
          <Text className="text-pc-text text-[26px] font-extrabold mb-1 text-center">
            {displayName}
          </Text>
          {user.performanceStyle ? (
            <Text className="text-pc-textMuted text-[15px] text-center">
              {user.performanceStyle}
            </Text>
          ) : null}
        </View>

        {/* Prop tags */}
        {props.length > 0 && (
          <View className="flex-row flex-wrap justify-center px-5 gap-2 mb-1">
            {props.map((p) => (
              <View key={p.propName} className="border border-pc-accent rounded-2xl px-3 py-1">
                <Text className="text-pc-accent text-[13px] font-medium">
                  {p.propName.toLowerCase()}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View className="h-px bg-pc-separator mx-5 my-5" />

        {/* About */}
        {user.bio ? (
          <View className="px-5">
            <Text className="text-pc-textMuted text-[11px] font-bold tracking-wider mb-3">
              ABOUT
            </Text>
            <Text className="text-pc-textSecondary text-[15px] leading-[23px]">{user.bio}</Text>
          </View>
        ) : null}

        <View className="h-px bg-pc-separator mx-5 my-5" />

        {/* Workshops */}
        <View className="px-5">
          <Text className="text-pc-textMuted text-[11px] font-bold tracking-wider mb-3">
            WORKSHOPS ({upcomingWorkshops.length})
          </Text>
          {upcomingWorkshops.length === 0 ? (
            <Text className="text-pc-textMuted text-sm">No upcoming workshops</Text>
          ) : (
            upcomingWorkshops.map((workshop) => {
              const dateStr = parseDateStr(workshop.date);
              const going = isGoing(workshop.id);
              return (
                <View
                  key={workshop.id}
                  className="bg-pc-card rounded-xl border-l-[3px] p-3.5 mb-3"
                  style={{ borderLeftColor: getEventBorderColor(workshop.id) }}
                >
                  <View className="mb-2.5 gap-1">
                    <View className="flex-row items-center">
                      <Calendar size={12} color={PC.textMuted} className="mr-1.5" />
                      <Text className="text-pc-textMuted text-[13px]">
                        {getShortDayName(dateStr)}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Clock size={12} color={PC.textMuted} className="mr-1.5" />
                      <Text className="text-pc-textMuted text-[13px]">
                        {formatTime(workshop.startTime)} – {formatTime(workshop.endTime)}
                      </Text>
                    </View>
                    {workshop.location ? (
                      <View className="flex-row items-center">
                        <MapPin size={12} color={PC.textMuted} className="mr-1.5" />
                        <Text className="text-pc-textMuted text-[13px]">{workshop.location}</Text>
                      </View>
                    ) : null}
                  </View>
                  <View className="flex-row justify-between items-center gap-3">
                    <Text className="text-pc-text text-base font-bold flex-1">{workshop.title}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        toggle({
                          id: workshop.id,
                          title: workshop.title,
                          date: dateStr,
                          startTime: workshop.startTime,
                          endTime: workshop.endTime,
                          location: workshop.location,
                          instructor: workshop.instructor,
                        })
                      }
                      className={`rounded-lg px-4 py-2 ${
                        going ? 'bg-transparent border border-pc-accent' : 'bg-pc-accent'
                      }`}
                      activeOpacity={0.8}
                    >
                      <Text
                        className={`text-sm font-bold ${going ? 'text-pc-accent' : 'text-black'}`}
                      >
                        {going ? '✓ Joined' : 'Join'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
