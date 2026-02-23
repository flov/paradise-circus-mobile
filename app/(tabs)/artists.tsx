import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { fetchArtists } from '@/lib/api';
import { PC } from '@/constants/Colors';
import ArtistCard from '@/components/ArtistCard';
import type { ArtistListItem } from '@/lib/types';

export default function ArtistsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const { data: artists, isLoading, isError } = useQuery({
    queryKey: ['artists'],
    queryFn: fetchArtists,
  });

  const filtered = useMemo(() => {
    if (!artists) return [];
    if (!query.trim()) return artists;
    const q = query.toLowerCase();
    return artists.filter((a) => {
      const name = (a.name || a.username).toLowerCase();
      const specialty = (a.performanceStyle || '').toLowerCase();
      const bio = (a.bio || '').toLowerCase();
      const props = a.props.map((p) => p.name.toLowerCase()).join(' ');
      return name.includes(q) || specialty.includes(q) || bio.includes(q) || props.includes(q);
    });
  }, [artists, query]);

  return (
    <SafeAreaView className="flex-1 bg-pc-bg">
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.username}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Brand header */}
            <View className="pt-5 pb-4">
              <Text className="text-pc-accent text-[11px] font-bold tracking-[2px] mb-1">
                PARADISE CIRCUS
              </Text>
              <Text className="text-pc-text text-[30px] font-extrabold">Artists</Text>
            </View>

            {/* Search bar */}
            <View className="flex-row items-center bg-pc-card rounded-xl px-3.5 py-2.5 mb-4">
              <Search size={16} color={PC.textMuted} className="mr-2" />
              <TextInput
                className="flex-1 text-pc-text text-[15px] p-0"
                placeholder="Search artists, disciplines..."
                placeholderTextColor={PC.textMuted}
                value={query}
                onChangeText={setQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Count */}
            {!isLoading && !isError && (
              <Text className="text-pc-textMuted text-[11px] font-bold tracking-wider mb-3">
                {filtered.length} {filtered.length === 1 ? 'ARTIST' : 'ARTISTS'}
              </Text>
            )}

            {isLoading && (
              <ActivityIndicator color={PC.accent} className="mt-10" />
            )}
            {isError && (
              <Text className="text-pc-textMuted text-[15px] text-center mt-10">
                Could not load artists. Check your connection.
              </Text>
            )}
          </View>
        }
        contentContainerClassName="px-5 pb-8"
        renderItem={({ item }: { item: ArtistListItem }) => (
          <ArtistCard
            artist={item}
            onPress={() => router.push(`/artists/${item.username}`)}
          />
        )}
        ListEmptyComponent={
          !isLoading && !isError ? (
            <Text className="text-pc-textMuted text-[15px] text-center mt-5">
              No artists found
            </Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
