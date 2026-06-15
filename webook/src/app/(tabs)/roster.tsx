import { useMemo, useState } from "react";
import { StyleSheet, SectionList, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { colors, fonts } from "../../styles/theme";
import { GroupCategory } from "@/types/wrestler";
import { groupWrestlers } from "@/lib/groupWrestlers";
import WrestlerCard from "@/components/WrestlerCard";
import GroupByBar from "@/components/GroupByBar";
import { useWrestlers } from "@/hooks/useWrestlers";
import { RefreshControl } from "react-native"
import { WrestlerFilters } from "@/types/filters";
import { countActiveFilters } from "@/lib/serializeFilters";
import FilterModal from "@/components/FilterModal";
import { useTerritories } from "@/hooks/useTerritories";
import { usePromotions } from "@/hooks/usePromotions";
import CreateButton from "@/components/CreateButton";
import { Wrestler } from "@/types/wrestler"
import { ScrollView } from "react-native";

export default function RosterScreen() {
  // 1. Allow the state to accept "alphabetical" alongside your other GroupCategory values
  const [groupBy, setGroupBy] = useState<GroupCategory | "alphabetical">("gender");
  const [filters, setFilters] = useState<WrestlerFilters>({});
  const [filterOpen, setFilterOpen] = useState(false);
  const { data: wrestlers, isLoading, isError, error, refetch, isRefetching } = useWrestlers(filters);
  const activeCount = countActiveFilters(filters);
  const { data: territories } = useTerritories();
  const { data: promotions } = usePromotions();

  const labelMaps = useMemo(() => ({
    territoryId: Object.fromEntries((territories ?? []).map((t) => [String(t.id), t.name])),
    promotionId: Object.fromEntries((promotions ?? []).map((p) => [String(p.id), p.name])),
  }), [territories, promotions]);

  // 2. Intercept and build custom A-Z sections if "alphabetical" is chosen
  const sections = useMemo(() => {
    if (!wrestlers) return [];

    if (groupBy === "alphabetical") {
      // Sort all wrestlers alphabetically by name
      const sortedWrestlers = [...wrestlers].sort((a, b) => 
        (a.name || "").localeCompare(b.name || "")
      );

      // Group them by their first letter
      const groups: Record<string, typeof wrestlers> = {};
      
      sortedWrestlers.forEach((wrestler) => {
        const firstLetter = wrestler.name ? wrestler.name.charAt(0).toUpperCase() : "#";
        const key = /[A-Z]/.test(firstLetter) ? firstLetter : "#";
        
        if (!groups[key]) groups[key] = [];
        groups[key].push(wrestler);
      });

      // Format groups into standard section blocks sorted from A to Z
      return Object.keys(groups)
        .sort((a, b) => {
          if (a === "#") return 1; // Put symbols/numbers at the end
          if (b === "#") return -1;
          return a.localeCompare(b);
        })
        .map((letter) => ({
          title: letter,
          data: groups[letter],
        }));
    }

    // Fall back to your original grouping utility for everything else
    return groupWrestlers(wrestlers, groupBy as GroupCategory, labelMaps);
  }, [wrestlers, groupBy, labelMaps]);
  
  const gridSections = useMemo(
    () => sections.map((s) => ({ title: s.title, data: [s.data] })),
    [sections]
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    )
  }

  if (isError) {
    return (
      <ScrollView style={[styles.container]}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.accent}
            colors={[colors.accent]}
            progressBackgroundColor={colors.surface}
          />
        }
      >
        <Text style={styles.error_text}>Couldn't load roster.</Text>
        <Text style={styles.error_detail}>{(error as Error).message}</Text>
      </ScrollView>
    )
  }

  return (
    <View style={styles.container} >
      <View style={styles.controls}>
        <View style={{ flex: 1 }}>
          {/* Note: Pass active and onChange normally. Ensure GroupByBar can handle "alphabetical" layout-wise */}
          <GroupByBar active={groupBy as any} onChange={setGroupBy as any} />
        </View>
        <TouchableOpacity
          style={styles.filter_button}
          onPress={() => setFilterOpen(true)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Open filters"
        >
          <Text style={styles.filter_button_text}>
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </Text>
        </TouchableOpacity>
      </View>
      <SectionList
        sections={gridSections}
        keyExtractor={(item, index) => `row-${item[0]?.id ?? index}`}
        renderItem={({ item }) => (
          <View style={styles.grid}>
            {item.map((wrestler: Wrestler) => (
              <WrestlerCard key={wrestler.id} wrestler={wrestler} />
            ))}
          </View>
        )}
        renderSectionHeader={({ section }) =>
          section.title ? (
            <Text style={styles.section_header}>{section.title.toUpperCase()}</Text>
          ) : null
        }
        stickySectionHeadersEnabled
        contentContainerStyle={styles.list_content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.accent}
            colors={[colors.accent]}
            progressBackgroundColor={colors.surface}
          />
        }
      />
      <CreateButton href="/wrestler/create" accessibilityLabel="Create wrestler" />
      <FilterModal
        visible={filterOpen}
        applied={filters}
        onApply={setFilters}
        onClose={() => setFilterOpen(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { justifyContent: "center", alignItems: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingHorizontal: 16 },
  list_content: { paddingVertical: 12 },
  section_header: {
    fontFamily: fonts.heading, fontSize: 14, color: colors.textMuted,
    backgroundColor: colors.background, paddingHorizontal: 24, paddingVertical: 8,
  },
  error_text: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  error_detail: {
    fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted,
    marginTop: 6, paddingHorizontal: 24, textAlign: "center",
  },
  controls: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderColor: colors.surface },
  filter_button: {
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 16,
    borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  filter_button_text: { fontFamily: fonts.medium, fontSize: 13, color: colors.text },
})