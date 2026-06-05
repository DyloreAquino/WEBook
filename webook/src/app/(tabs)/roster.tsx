import { useMemo, useState } from "react";
import { StyleSheet, SectionList, View, Text, ActivityIndicator } from "react-native";
import { colors, fonts } from "../../styles/theme";
import { GroupCategory } from "@/types/wrestler";
import { groupWrestlers } from "@/lib/groupWrestlers";
import WrestlerCard from "@/components/WrestlerCard";
import GroupByBar from "@/components/GroupByBar";
import { useWrestlers } from "@/hooks/useWrestlers";
import { RefreshControl } from "react-native"

export default function RosterScreen() {
  const [groupBy, setGroupBy] = useState<GroupCategory>("gender");
  const { data: wrestlers, isLoading, isError, error, refetch, isRefetching } = useWrestlers()

  const sections = useMemo(
    () => groupWrestlers(wrestlers ?? [], groupBy),
    [wrestlers, groupBy]
  )
  
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
      <View style={[styles.container, styles.center]}>
        <Text style={styles.error_text}>Couldn't load roster.</Text>
        <Text style={styles.error_detail}>{(error as Error).message}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <GroupByBar active={groupBy} onChange={setGroupBy} />
      <SectionList
        sections={gridSections}
        keyExtractor={(item, index) => `row-${item[0]?.id ?? index}`}
        renderItem={({ item }) => (
          <View style={styles.grid}>
            {item.map((wrestler) => (
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
            tintColor={colors.accent}      // iOS spinner color
            colors={[colors.accent]}        // Android spinner color(s)
            progressBackgroundColor={colors.surface}  // Android spinner bg
          />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 16,
  },
  list_content: {
    paddingVertical: 12,
  },
  section_header: {
    fontFamily: fonts.heading,
    fontSize: 14,
    color: colors.textMuted,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  error_text: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
  },
  error_detail: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 6,
    paddingHorizontal: 24,
    textAlign: "center",
  },
})