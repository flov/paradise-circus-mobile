import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
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
import type { Workshop } from '@/lib/types';

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

function isUpcoming(workshop: Workshop): boolean {
  const dateStr = parseDateStr(workshop.date);
  const [y, m, d] = dateStr.split('-').map(Number);
  const workshopDate = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return workshopDate >= today;
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
    if (!data?.workshops) return [];
    return data.workshops
      .filter(isUpcoming)
      .sort((a, b) => parseDateStr(a.date).localeCompare(parseDateStr(b.date)));
  }, [data]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={PC.accent} style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={18} color={PC.accent} />
          <Text style={styles.backText}>Artists</Text>
        </TouchableOpacity>
        <Text style={styles.errorText}>Could not load artist profile.</Text>
      </SafeAreaView>
    );
  }

  const { user, props } = data;
  const displayName = user.displayName || user.username;
  const initials = getInitials(displayName);
  const avatarBg = getAvatarBgColor(user.username);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={18} color={PC.accent} />
          <Text style={styles.backText}>Artists</Text>
        </TouchableOpacity>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          {user.performanceStyle ? (
            <Text style={styles.specialty}>{user.performanceStyle}</Text>
          ) : null}
        </View>

        {/* Prop tags */}
        {props.length > 0 && (
          <View style={styles.tagRow}>
            {props.map((p) => (
              <View key={p.propName} style={styles.tag}>
                <Text style={styles.tagText}>{p.propName.toLowerCase()}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.divider} />

        {/* About */}
        {user.bio ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ABOUT</Text>
            <Text style={styles.bio}>{user.bio}</Text>
          </View>
        ) : null}

        <View style={styles.divider} />

        {/* Workshops */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            WORKSHOPS ({upcomingWorkshops.length})
          </Text>
          {upcomingWorkshops.length === 0 ? (
            <Text style={styles.noWorkshops}>No upcoming workshops</Text>
          ) : (
            upcomingWorkshops.map((workshop) => {
              const dateStr = parseDateStr(workshop.date);
              const going = isGoing(workshop.id);
              return (
                <View
                  key={workshop.id}
                  style={[styles.workshopCard, { borderLeftColor: getEventBorderColor(workshop.id) }]}
                >
                  <View style={styles.workshopMeta}>
                    <View style={styles.metaRow}>
                      <Calendar size={12} color={PC.textMuted} style={styles.metaIcon} />
                      <Text style={styles.metaText}>{getShortDayName(dateStr)}</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Clock size={12} color={PC.textMuted} style={styles.metaIcon} />
                      <Text style={styles.metaText}>
                        {formatTime(workshop.startTime)} – {formatTime(workshop.endTime)}
                      </Text>
                    </View>
                    {workshop.location ? (
                      <View style={styles.metaRow}>
                        <MapPin size={12} color={PC.textMuted} style={styles.metaIcon} />
                        <Text style={styles.metaText}>{workshop.location}</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.workshopBottom}>
                    <Text style={styles.workshopTitle}>{workshop.title}</Text>
                    <TouchableOpacity
                      onPress={() => toggle({
                        id: workshop.id,
                        title: workshop.title,
                        date: dateStr,
                        startTime: workshop.startTime,
                        endTime: workshop.endTime,
                        location: workshop.location,
                        instructor: workshop.instructor,
                      })}
                      style={[styles.joinBtn, going && styles.joinBtnGoing]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.joinBtnText, going && styles.joinBtnTextGoing]}>
                        {going ? '✓ Joined' : 'Join'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PC.bg,
  },
  loader: {
    marginTop: 60,
  },
  errorText: {
    color: PC.textMuted,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backText: {
    color: PC.accent,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 2,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarText: {
    color: PC.accent,
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    color: PC.text,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  specialty: {
    color: PC.textMuted,
    fontSize: 15,
    textAlign: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 4,
  },
  tag: {
    borderWidth: 1,
    borderColor: PC.accent,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    color: PC.accent,
    fontSize: 13,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: PC.separator,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionLabel: {
    color: PC.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  bio: {
    color: PC.textSecondary,
    fontSize: 15,
    lineHeight: 23,
  },
  noWorkshops: {
    color: PC.textMuted,
    fontSize: 14,
  },
  workshopCard: {
    backgroundColor: PC.card,
    borderRadius: 12,
    borderLeftWidth: 3,
    padding: 14,
    marginBottom: 12,
  },
  workshopMeta: {
    marginBottom: 10,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 6,
  },
  metaText: {
    color: PC.textMuted,
    fontSize: 13,
  },
  workshopBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  workshopTitle: {
    color: PC.text,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  joinBtn: {
    backgroundColor: PC.accent,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  joinBtnGoing: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: PC.accent,
  },
  joinBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  joinBtnTextGoing: {
    color: PC.accent,
  },
  bottomPad: {
    height: 40,
  },
});
