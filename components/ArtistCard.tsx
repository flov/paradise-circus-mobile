import React from "react"
import { View, Text, TouchableOpacity, Image } from "react-native"
import { ChevronRight, Instagram, FileText } from "lucide-react-native"
import { PC, getAvatarBgColor } from "@/constants/Colors"
import { getInitials } from "@/lib/utils"
import type { ArtistListItem } from "@/lib/types"

interface Props {
  artist: ArtistListItem
  onPress: () => void
}

export default function ArtistCard({ artist, onPress }: Props) {
  const displayName = artist.name || artist.username
  const initials = getInitials(displayName)
  const avatarBg = getAvatarBgColor(artist.username)
  const propNames = artist.props.length > 0 ? artist.props.map((p) => p.name).join(" · ") : null

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
          <Text className="text-pc-accent text-[17px] font-bold">
            {initials}
          </Text>
        </View>
      )}

      {/* Info */}
      <View className="flex-1">
        <Text
          className="text-pc-text text-base mb-0.5"
          style={{ fontFamily: 'JosefinSans_700Bold' }}
        >
          {displayName}
        </Text>
        {propNames ? (
          <Text className="text-pc-textMuted text-[13px] mb-1.5">
            {propNames}
          </Text>
        ) : null}
        <View className="flex-row items-center gap-2">
          {artist.isInstructor ? (
            <View
              className="self-start border rounded-md px-2 py-0.5"
              style={{ borderColor: PC.instructor }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: PC.instructor }}
              >
                Instructor
              </Text>
            </View>
          ) : null}
          {artist.workshopCount > 0 ? (
            <View className="self-start border border-pc-accent rounded-md px-2 py-0.5">
              <Text className="text-pc-accent text-xs font-semibold">
                {artist.workshopCount}{" "}
                {artist.workshopCount === 1 ? "workshop" : "workshops"}
              </Text>
            </View>
          ) : null}
          {artist.instagramHandle ? (
            <Instagram size={20} color={PC.instagram} />
          ) : null}
          {artist.bio ? <FileText size={20} color={PC.purple} /> : null}
        </View>
      </View>

      {/* Chevron */}
      <ChevronRight size={18} color={PC.textMuted} />
    </TouchableOpacity>
  )
}
