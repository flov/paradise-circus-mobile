import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Search, ChevronDown, X } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { fetchArtists } from '@/lib/api';
import { PC } from '@/constants/Colors';
import ArtistCard from '@/components/ArtistCard';
import type { ArtistListItem } from '@/lib/types';

type SortOrder = 'newest' | 'az';

function FilterChip({
  label,
  active,
  onPress,
  activeColor = PC.accent,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  activeColor?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: active ? activeColor : PC.card,
        borderWidth: 1,
        borderColor: active ? activeColor : PC.cardBorder,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
      }}
    >
      <Text style={{ color: active ? PC.text : PC.textMuted, fontSize: 13, fontWeight: '600' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function ArtistsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedProp, setSelectedProp] = useState<string | null>(null);
  const [propPickerVisible, setPropPickerVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [filterInstructor, setFilterInstructor] = useState(false);
  const [filterVideos, setFilterVideos] = useState(false);
  const [filterBio, setFilterBio] = useState(false);

  const { data: artists, isLoading, isError } = useQuery({
    queryKey: ['artists'],
    queryFn: fetchArtists,
  });

  const allProps = useMemo(() => {
    if (!artists) return [];
    const names = new Set<string>();
    artists.forEach((a) => a.props.forEach((p) => names.add(p.name)));
    return [...names].sort();
  }, [artists]);

  const filtered = useMemo(() => {
    if (!artists) return [];
    let result = artists;

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((a) => {
        const name = (a.name || a.username).toLowerCase();
        const specialty = (a.performanceStyle || '').toLowerCase();
        const bio = (a.bio || '').toLowerCase();
        const props = a.props.map((p) => p.name.toLowerCase()).join(' ');
        return name.includes(q) || specialty.includes(q) || bio.includes(q) || props.includes(q);
      });
    }

    if (selectedProp) {
      result = result.filter((a) => a.props.some((p) => p.name === selectedProp));
    }

    if (filterInstructor) result = result.filter((a) => a.isInstructor);
    if (filterVideos) result = result.filter((a) => a.videoCount > 0);
    if (filterBio) result = result.filter((a) => !!a.bio);

    return [...result].sort((a, b) =>
      sortOrder === 'newest'
        ? Number(b.id) - Number(a.id)
        : (a.name || a.username).localeCompare(b.name || b.username)
    );
  }, [artists, query, selectedProp, sortOrder, filterInstructor, filterVideos, filterBio]);

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
            <View className="flex-row items-center bg-pc-card rounded-xl px-3.5 py-2.5 mb-3">
              <Search size={16} color={PC.textMuted} style={{ marginRight: 8 }} />
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

            {/* Prop filter select */}
            {allProps.length > 0 && (
              <>
                <TouchableOpacity
                  onPress={() => setPropPickerVisible(true)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: PC.card,
                    borderWidth: 1,
                    borderColor: selectedProp ? PC.accent : PC.cardBorder,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ flex: 1, color: selectedProp ? PC.accent : PC.textMuted, fontSize: 14 }}>
                    {selectedProp ?? 'All props'}
                  </Text>
                  {selectedProp ? (
                    <TouchableOpacity onPress={() => setSelectedProp(null)} hitSlop={8}>
                      <X size={15} color={PC.accent} />
                    </TouchableOpacity>
                  ) : (
                    <ChevronDown size={15} color={PC.textMuted} />
                  )}
                </TouchableOpacity>

                <Modal
                  visible={propPickerVisible}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setPropPickerVisible(false)}
                >
                  <Pressable
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
                    onPress={() => setPropPickerVisible(false)}
                  >
                    <Pressable>
                      <View style={{ backgroundColor: PC.card, borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 32 }}>
                        {/* Handle */}
                        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                          <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: PC.cardBorder }} />
                        </View>
                        {/* All props option */}
                        <TouchableOpacity
                          onPress={() => { setSelectedProp(null); setPropPickerVisible(false); }}
                          style={{ paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: PC.cardBorder }}
                        >
                          <Text style={{ color: selectedProp === null ? PC.accent : PC.textMuted, fontSize: 15, fontWeight: selectedProp === null ? '700' : '400' }}>
                            All props
                          </Text>
                        </TouchableOpacity>
                        {allProps.map((prop) => (
                          <TouchableOpacity
                            key={prop}
                            onPress={() => { setSelectedProp(prop); setPropPickerVisible(false); }}
                            style={{ paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: PC.cardBorder }}
                          >
                            <Text style={{ color: selectedProp === prop ? PC.accent : PC.text, fontSize: 15, fontWeight: selectedProp === prop ? '700' : '400' }}>
                              {prop}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </Pressable>
                  </Pressable>
                </Modal>
              </>
            )}

            {/* Filter toggles + sort */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <FilterChip
                label="Instructors"
                active={filterInstructor}
                onPress={() => setFilterInstructor((v) => !v)}
                activeColor={PC.instructor}
              />
              <FilterChip
                label="Videos"
                active={filterVideos}
                onPress={() => setFilterVideos((v) => !v)}
                activeColor={PC.purple}
              />
              <FilterChip
                label="Bio"
                active={filterBio}
                onPress={() => setFilterBio((v) => !v)}
                activeColor="#2B7B5A"
              />
              <View style={{ flex: 1 }} />
              <TouchableOpacity onPress={() => setSortOrder((s) => (s === 'newest' ? 'az' : 'newest'))}>
                <Text style={{ color: PC.textMuted, fontSize: 13, fontWeight: '600' }}>
                  {sortOrder === 'newest' ? 'Newest ↑' : 'A–Z ↑'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Count */}
            {!isLoading && !isError && (
              <Text className="text-pc-textMuted text-[11px] font-bold tracking-wider mb-3">
                {filtered.length} OF {artists?.length ?? 0} {filtered.length === 1 ? 'ARTIST' : 'ARTISTS'}
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
