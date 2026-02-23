import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ChevronRight, Instagram } from 'lucide-react-native';
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
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-pc-card rounded-xl flex-row items-center p-3.5 mb-2.5"
    >
      {/* Avatar */}
      {artist.avatar ? (
        <Image
          source={{ uri: artist.avatar }}
          className="w-[52px] h-[52px] rounded-[26px] mr-3.5"
        />
      ) : (
        <View
          className="w-[52px] h-[52px] rounded-[26px] justify-center items-center mr-3.5"
          style={{ backgroundColor: avatarBg }}
        >
          <Text className="text-pc-accent text-[17px] font-bold">{initials}</Text>
        </View>
      )}

      {/* Info */}
      <View className="flex-1">
        <View className="flex-row items-center gap-1.5 mb-0.5">
          <Text className="text-pc-text text-base font-bold">{displayName}</Text>
          {artist.instagramHandle ? (
            <Instagram size={14} color="#a855f7" />
          ) : null}
        </View>
        {specialty ? (
          <Text className="text-pc-textMuted text-[13px] mb-1.5" numberOfLines={1}>
            {specialty}
          </Text>
        ) : null}
        <View className="self-start border border-pc-accent rounded-md px-2 py-0.5">
          <Text className="text-pc-accent text-xs font-semibold">
            {artist.workshopCount} {artist.workshopCount === 1 ? 'workshop' : 'workshops'}
          </Text>
        </View>
      </View>

      {/* Chevron */}
      <ChevronRight size={18} color={PC.textMuted} />
    </TouchableOpacity>
  );
}
