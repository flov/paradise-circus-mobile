import React, { useMemo } from "react"
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useQuery } from "@tanstack/react-query"
import {
  Flame,
  Circle,
  Accessibility,
  Drama,
  Music,
  type LucideIcon,
} from "lucide-react-native"
import { useRouter } from "expo-router"
import { fetchTimetable, fetchArtists } from "@/lib/api"
import { formatLocalDate, getWeekDates } from "@/lib/utils"
import { PC } from "@/constants/Colors"
import { AnimatedItem } from "@/components/AnimatedItem"

const heroImage = require("@/assets/images/hero.webp")

const PHRASES = [
  "The stage awaits — come as you are",
  "Unleash your inner performer",
  "Where passion meets performance",
  "Join the circus of your dreams",
  "Elevate your artistry",
  "Where ordinary becomes extraordinary",
  "All levels are welcome",
  "Come curious, leave inspired",
]

const WORKSHOP_CATEGORIES: { name: string; icon: LucideIcon }[] = [
  { name: "Poi / Staff / Flow", icon: Flame },
  { name: "Hoop / Juggling", icon: Circle },
  { name: "Acrobatics", icon: Accessibility },
  { name: "Theater & Clowning", icon: Drama },
  { name: "Dance", icon: Music },
]

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const phrase = useMemo(
    () => PHRASES[Math.floor(Math.random() * PHRASES.length)],
    [],
  )

  // Fetch this week's events (same query key as timetable tab to prefetch)
  const thisWeek = useMemo(() => getWeekDates(0), [])
  const start = useMemo(() => formatLocalDate(thisWeek[0]), [thisWeek])
  const end = useMemo(() => formatLocalDate(thisWeek[6]), [thisWeek])

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["timetable", start, end],
    queryFn: () => fetchTimetable(start, end),
    staleTime: 5 * 60 * 1000,
  })

  const { data: artists } = useQuery({
    queryKey: ["artists"],
    queryFn: fetchArtists,
    staleTime: 5 * 60 * 1000,
  })

  // Derived stats
  const workshopCount = useMemo(() => {
    if (!events) return 0
    return events.filter((e) => e.isWorkshop && !e.isBlocked).length
  }, [events])

  const artistCount = artists?.length ?? 0

  const WEEKLY_SHOWS = [
    {
      day: "EVERY TUESDAY",
      title: "Open Stage",
      description:
        "An open night where anyone can perform. Perfect for trying new acts!",
    },
    {
      day: "EVERY THURSDAY",
      title: "Main Show",
      description:
        "Our signature weekly show featuring the best acts from the community.",
    },
    {
      day: "EVERY SUNDAY",
      title: "Main Show",
      description:
        "End the week with another spectacular showcase of talent and creativity.",
    },
  ]

  return (
    <View className="flex-1 bg-pc-bg">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="relative" style={{ height: 380 }}>
          <Image
            source={heroImage}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Brand Title */}
        <View className="px-6 mt-18">
          <Text className="text-white text-[42px] font-rye leading-[48px]">
            PARADISE
          </Text>
          <Text
            className="text-[42px] font-rye leading-[48px]"
            style={{ color: PC.accent }}
          >
            CIRCUS
          </Text>
          <Text className="text-pc-textMuted text-[16px] italic mt-2 mb-4">
            {phrase}
          </Text>
        </View>

        {/* Stats Bar */}
        <View className="mx-5 -mt-1 mb-6 bg-pc-card rounded-2xl border border-pc-cardBorder overflow-hidden">
          <View className="flex-row">
            <View className="flex-1 items-center py-4">
              <Text
                className="text-[22px] font-bold"
                style={{ color: PC.accent }}
              >
                {eventsLoading ? "–" : workshopCount}
              </Text>
              <Text className="text-pc-textMuted text-[12px] mt-0.5">
                Workshops
              </Text>
            </View>
            <View className="w-px bg-pc-cardBorder" />
            <View className="flex-1 items-center py-4">
              <Text
                className="text-[22px] font-bold"
                style={{ color: PC.accent }}
              >
                {artistCount || "–"}
              </Text>
              <Text className="text-pc-textMuted text-[12px] mt-0.5">
                Artists
              </Text>
            </View>
            <View className="w-px bg-pc-cardBorder" />
            <View className="flex-1 items-center py-4">
              <Text
                className="text-[22px] font-bold"
                style={{ color: PC.accent }}
              >
                7
              </Text>
              <Text className="text-pc-textMuted text-[12px] mt-0.5">Days</Text>
            </View>
          </View>
        </View>

        {/* Workshops Section */}
        <View className="mb-6">
          <Text className="text-pc-text text-[22px] font-rye px-5 mb-4">
            Workshops
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
          >
            {WORKSHOP_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <TouchableOpacity
                  key={cat.name}
                  activeOpacity={0.7}
                  onPress={() => router.push({ pathname: "/(tabs)/timetable" })}
                  className="items-center rounded-xl p-3"
                  style={{ width: 80, backgroundColor: PC.card }}
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mb-2"
                    style={{
                      borderWidth: 2,
                      borderColor: PC.accent,
                      backgroundColor: "rgba(240,144,16,0.1)",
                    }}
                  >
                    <Icon size={22} color={PC.accent} />
                  </View>
                  <Text
                    className="text-pc-textSecondary text-[10px] text-center"
                    numberOfLines={2}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* Weekly Shows Section */}
        <View className="px-5 pb-10">
          <Text
            className="text-[11px] font-bold tracking-[2px] mb-1"
            style={{ color: PC.accent }}
          >
            LIVE ENTERTAINMENT
          </Text>
          <Text className="text-pc-text text-[22px] font-rye mb-2">
            Weekly Shows
          </Text>
          <Text className="text-pc-textMuted text-[14px] mb-5">
            Every week we come together to celebrate our art. Two main shows and
            one open stage.
          </Text>
          {WEEKLY_SHOWS.map((show, index) => (
            <AnimatedItem key={show.day} index={index}>
              <View
                className="rounded-xl mb-3 p-5 border border-pc-cardBorder"
                style={{ backgroundColor: PC.card }}
              >
                <Text
                  className="text-[11px] font-bold tracking-[2px] mb-1"
                  style={{ color: PC.accent }}
                >
                  {show.day}
                </Text>
                <Text
                  className="text-[20px] font-rye mb-2"
                  style={{ color: PC.text }}
                >
                  {show.title}
                </Text>
                <Text
                  className="text-[14px] leading-[20px]"
                  style={{ color: PC.text, opacity: 0.8 }}
                >
                  {show.description}
                </Text>
              </View>
            </AnimatedItem>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
