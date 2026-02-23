import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { PC, getAvatarBgColor } from '@/constants/Colors';
import { getInitials } from '@/lib/utils';
import type { ArtistListItem } from '@/lib/types';

interface Props {
  artist: ArtistListItem;
  onPress: () => void;
}

export default function ArtistCard({ artist, onPress }: Props) {
  const displayName = artist.name || artist.username;
  const initials = getInitials(displayName);
  const avatarBg = getAvatarBgColor(artist.username);
  const specialty = artist.performanceStyle || null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.card}>
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{displayName}</Text>
        {specialty ? (
          <Text style={styles.specialty} numberOfLines={1}>{specialty}</Text>
        ) : null}
        <View style={styles.workshopBadge}>
          <Text style={styles.workshopBadgeText}>
            {artist.workshopCount} {artist.workshopCount === 1 ? 'workshop' : 'workshops'}
          </Text>
        </View>
      </View>

      {/* Chevron */}
      <ChevronRight size={18} color={PC.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: PC.card,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: PC.accent,
    fontSize: 17,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    color: PC.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  specialty: {
    color: PC.textMuted,
    fontSize: 13,
    marginBottom: 6,
  },
  workshopBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: PC.accent,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  workshopBadgeText: {
    color: PC.accent,
    fontSize: 12,
    fontWeight: '600',
  },
});
