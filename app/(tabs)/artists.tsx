import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
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
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.username}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Brand header */}
            <View style={styles.header}>
              <Text style={styles.brand}>PARADISE CIRCUS</Text>
              <Text style={styles.pageTitle}>Artists</Text>
            </View>

            {/* Search bar */}
            <View style={styles.searchContainer}>
              <Search size={16} color={PC.textMuted} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
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
              <Text style={styles.countLabel}>
                {filtered.length} {filtered.length === 1 ? 'ARTIST' : 'ARTISTS'}
              </Text>
            )}

            {isLoading && (
              <ActivityIndicator color={PC.accent} style={styles.loader} />
            )}
            {isError && (
              <Text style={styles.errorText}>Could not load artists. Check your connection.</Text>
            )}
          </View>
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }: { item: ArtistListItem }) => (
          <ArtistCard
            artist={item}
            onPress={() => router.push(`/artists/${item.username}`)}
          />
        )}
        ListEmptyComponent={
          !isLoading && !isError ? (
            <Text style={styles.emptyText}>No artists found</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PC.bg,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  brand: {
    color: PC.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
  },
  pageTitle: {
    color: PC.text,
    fontSize: 30,
    fontWeight: '800',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PC.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: PC.text,
    fontSize: 15,
    padding: 0,
  },
  countLabel: {
    color: PC.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  loader: {
    marginTop: 40,
  },
  errorText: {
    color: PC.textMuted,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: PC.textMuted,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
  },
});
