import React, { useMemo } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Linking,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useQuery } from "@tanstack/react-query"
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Instagram,
  Play,
  Globe,
  Shield,
  Code,
} from "lucide-react-native"
import { fetchArtist } from "@/lib/api"
import { useSavedEvents } from "@/lib/schedule"
import { PC, getAvatarBgColor, getEventBorderColor } from "@/constants/Colors"
import {
  getInitials,
  extractYouTubeId,
  extractVimeoId,
  getVimeoEmbedUrl,
} from "@/lib/utils"
import { WebView } from "react-native-webview"

function YouTubeThumbnail({ videoId }: { videoId: string }) {
  const thumbUri = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  return (
    <TouchableOpacity
      onPress={() =>
        Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`)
      }
      activeOpacity={0.85}
      className="mb-4 rounded-xl overflow-hidden bg-black"
      style={{ height: 200 }}
    >
      <Image
        source={{ uri: thumbUri }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "rgba(0,0,0,0.65)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Play size={24} color="white" fill="white" />
        </View>
      </View>
    </TouchableOpacity>
  )
}

function parseDateStr(date: string | Date): string {
  if (date instanceof Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }
  return String(date).split("T")[0]
}

function formatTime(t: string): string {
  return t.substring(0, 5)
}

function getShortDayName(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number)
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return names[new Date(y, m - 1, d).getDay()]
}

function formatOrdinalDate(dateStr: string): string {
  const [, m, d] = dateStr.split("-").map(Number)
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const suffix =
    d === 1 || d === 21 || d === 31
      ? "st"
      : d === 2 || d === 22
        ? "nd"
        : d === 3 || d === 23
          ? "rd"
          : "th"
  return `${d}${suffix} of ${months[m - 1]}`
}

export default function ArtistProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>()
  const router = useRouter()
  const { isGoing, toggle } = useSavedEvents()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["artist", username],
    queryFn: () => fetchArtist(username),
    enabled: !!username,
  })

  const upcomingWorkshops = useMemo(() => {
    if (!data?.workshops?.upcoming) return []
    return [...data.workshops.upcoming].sort((a, b) =>
      parseDateStr(a.date).localeCompare(parseDateStr(b.date)),
    )
  }, [data])

  const pastWorkshops = useMemo(() => {
    if (!data?.workshops?.past) return []
    return [...data.workshops.past].sort((a, b) =>
      parseDateStr(b.date).localeCompare(parseDateStr(a.date)),
    )
  }, [data])

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-pc-bg">
        <ActivityIndicator color={PC.accent} className="mt-[60px]" />
      </SafeAreaView>
    )
  }

  if (isError || !data) {
    return (
      <SafeAreaView className="flex-1 bg-pc-bg">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center px-5 pt-4 pb-2"
        >
          <ChevronLeft size={18} color={PC.accent} />
          <Text className="text-pc-accent text-base font-semibold ml-0.5">
            Artists
          </Text>
        </TouchableOpacity>
        <Text className="text-pc-textMuted text-[15px] text-center mt-10">
          Could not load artist profile.
        </Text>
      </SafeAreaView>
    )
  }

  const { user, props } = data
  const displayName = user.displayName || user.username
  const initials = getInitials(displayName)
  const avatarBg = getAvatarBgColor(user.username)

  return (
    <SafeAreaView className="flex-1 bg-pc-bg">
      {/* Warm radial glow behind the header */}
      <LinearGradient
        colors={["#3D1A04", "#1A0A02", PC.bg]}
        locations={[0, 0.5, 1]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 420 }}
        pointerEvents="none"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center px-5 pt-4 pb-2"
        >
          <ChevronLeft size={18} color={PC.accent} />
          <Text className="text-pc-accent text-base font-semibold ml-0.5">
            Artists
          </Text>
        </TouchableOpacity>

        {/* Avatar */}
        <View className="items-center pt-5 pb-4 px-5">
          {user.avatarImageUrl ? (
            <Image
              source={{ uri: user.avatarImageUrl }}
              className="w-[88px] h-[88px] rounded-[44px] mb-3.5"
            />
          ) : (
            <View
              className="w-[88px] h-[88px] rounded-[44px] justify-center items-center mb-3.5"
              style={{ backgroundColor: avatarBg }}
            >
              <Text className="text-pc-accent text-[28px] font-bold">
                {initials}
              </Text>
            </View>
          )}
          <Text className="text-pc-text text-[26px] font-extrabold mb-1 text-center">
            {displayName}
          </Text>
          {user.performanceStyle ? (
            <Text className="text-pc-textMuted text-[15px] text-center">
              {user.performanceStyle}
            </Text>
          ) : null}
          {user.location ? (
            <View className="flex-row items-center gap-1.5 mt-1.5">
              <Globe size={13} color={PC.textMuted} />
              <Text className="text-pc-textMuted text-[13px]">
                {user.location}
              </Text>
            </View>
          ) : null}
          {user.instagramHandle ? (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(`https://instagram.com/${user.instagramHandle}`)
              }
              className="flex-row items-center gap-1.5 mt-2"
              activeOpacity={0.7}
            >
              <Instagram size={14} color={PC.instagram} />
              <Text style={{ color: PC.instagram }} className="text-[13px]">
                @{user.instagramHandle}
              </Text>
            </TouchableOpacity>
          ) : null}
          {user.patreonPage ? (
            <TouchableOpacity
              onPress={() => Linking.openURL(user.patreonPage!)}
              className="flex-row items-center gap-1.5 mt-2"
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: "#FF424D",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: "800",
                    lineHeight: 12,
                  }}
                >
                  P
                </Text>
              </View>
              <Text style={{ color: "#FF424D" }} className="text-[13px]">
                Patreon
              </Text>
            </TouchableOpacity>
          ) : null}
          {user.isInstructor ||
          user.isAdmin ||
          user.username === "the_flow_wizard" ? (
            <View className="flex-row items-center gap-2 mt-2.5">
              {user.isInstructor ? (
                <View
                  className="border rounded-md px-2 py-0.5"
                  style={{ borderColor: "#DC2626" }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: "#DC2626" }}
                  >
                    Instructor
                  </Text>
                </View>
              ) : null}
              {user.isAdmin ? <Shield size={18} color="#3B82F6" /> : null}
              {user.username === "the_flow_wizard" ? (
                <Code size={18} color="#22D3EE" />
              ) : null}
            </View>
          ) : null}
        </View>

        {/* Prop tags */}
        {props.length > 0 && (
          <View className="flex-row flex-wrap justify-center px-5 gap-2 mb-1">
            {props.map((p) => (
              <View
                key={p.propName}
                className="border border-pc-accent rounded-2xl px-3 py-1"
              >
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
            <Text className="text-pc-textSecondary text-[15px] leading-[23px]">
              {user.bio}
            </Text>
          </View>
        ) : null}

        <View className="h-px bg-pc-separator mx-5 my-5" />

        {/* Videos */}
        {(() => {
          const youtubeIds = (user.youtubeVideos ?? [])
            .map(extractYouTubeId)
            .filter(Boolean) as string[]
          const vimeoIds = (user.vimeoVideos ?? [])
            .map(extractVimeoId)
            .filter(Boolean) as string[]
          if (youtubeIds.length === 0 && vimeoIds.length === 0) return null
          return (
            <View className="px-5">
              <Text className="text-pc-textMuted text-[11px] font-bold tracking-wider mb-3">
                VIDEOS ({youtubeIds.length + vimeoIds.length})
              </Text>
              {youtubeIds.map((id) => (
                <YouTubeThumbnail key={id} videoId={id} />
              ))}
              {vimeoIds.map((id) => (
                <View
                  key={id}
                  className="mb-4 rounded-xl overflow-hidden bg-black"
                  style={{ height: 200 }}
                >
                  <WebView
                    source={{ uri: getVimeoEmbedUrl(id) }}
                    allowsFullscreenVideo
                    mediaPlaybackRequiresUserAction
                    style={{ flex: 1, backgroundColor: "black" }}
                  />
                </View>
              ))}
              <View className="h-px bg-pc-separator my-5 -mx-0" />
            </View>
          )
        })()}

        {/* Workshops */}
        <View className="px-5">
          <Text className="text-pc-textMuted text-[11px] font-bold tracking-wider mb-3">
            WORKSHOPS ({upcomingWorkshops.length})
          </Text>
          {upcomingWorkshops.length === 0 ? (
            <Text className="text-pc-textMuted text-sm">
              No upcoming workshops
            </Text>
          ) : (
            upcomingWorkshops.map((workshop) => {
              const dateStr = parseDateStr(workshop.date)
              const going = isGoing(workshop.id)
              return (
                <View
                  key={workshop.id}
                  className="bg-pc-card rounded-xl border-l-[3px] p-3.5 mb-3"
                  style={{ borderLeftColor: getEventBorderColor(workshop.id) }}
                >
                  <View className="mb-2.5 gap-1">
                    <View className="flex-row items-center">
                      <Calendar
                        size={12}
                        color={PC.textMuted}
                        className="mr-1.5"
                      />
                      <Text className="text-pc-textMuted text-[13px]">
                        {getShortDayName(dateStr)}, {formatOrdinalDate(dateStr)}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Clock
                        size={12}
                        color={PC.textMuted}
                        className="mr-1.5"
                      />
                      <Text className="text-pc-textMuted text-[13px]">
                        {formatTime(workshop.startTime)} –{" "}
                        {formatTime(workshop.endTime)}
                      </Text>
                    </View>
                    {workshop.location ? (
                      <View className="flex-row items-center">
                        <MapPin
                          size={12}
                          color={PC.textMuted}
                          className="mr-1.5"
                        />
                        <Text className="text-pc-textMuted text-[13px]">
                          {workshop.location}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <View className="flex-row justify-between items-center gap-3">
                    <Text className="text-pc-text text-base font-bold flex-1">
                      {workshop.title}
                    </Text>
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
                        going
                          ? "bg-transparent border border-pc-accent"
                          : "bg-pc-accent"
                      }`}
                      activeOpacity={0.8}
                    >
                      <Text
                        className={`text-sm font-bold ${going ? "text-pc-accent" : "text-black"}`}
                      >
                        {going ? "✓ Added to schedule" : "Add to schedule"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })
          )}
        </View>

        {/* Past workshops */}
        {pastWorkshops.length > 0 && (
          <View className="px-5 mt-5">
            <Text className="text-pc-textMuted text-[11px] font-bold tracking-wider mb-3">
              PAST WORKSHOPS ({pastWorkshops.length})
            </Text>
            {pastWorkshops.map((workshop) => {
              const dateStr = parseDateStr(workshop.date)
              const [y, m, d] = dateStr.split("-").map(Number)
              const formatted = new Date(y, m - 1, d).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              )
              return (
                <View
                  key={workshop.id}
                  className="flex-row justify-between mb-2"
                >
                  <Text className="text-pc-text text-[14px] flex-1 mr-3">
                    {workshop.title}
                  </Text>
                  <Text className="text-pc-textMuted text-[13px]">
                    {formatted}
                  </Text>
                </View>
              )
            })}
          </View>
        )}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  )
}
