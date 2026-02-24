import React from "react"
import { CalendarDays, Clock, Users } from "lucide-react-native"
import { Tabs } from "expo-router"
import { PC } from "@/constants/Colors"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PC.accent,
        tabBarInactiveTintColor: "#6A6460",
        tabBarStyle: {
          backgroundColor: "#0D0A07",
          borderTopColor: "#2A2420",
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Timetable",
          tabBarIcon: ({ color }) => <CalendarDays size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "My Schedule",
          tabBarIcon: ({ color }) => <Clock size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="artists"
        options={{
          title: "Artists",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
    </Tabs>
  )
}
