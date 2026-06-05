import { useMemo, useState } from "react";
import { StyleSheet, SectionList, View, Text } from "react-native";
import { colors, fonts } from "../../styles/theme";
import { Wrestler, GroupCategory } from "@/types/wrestler";
import { groupWrestlers } from "@/lib/groupWrestlers";
import WrestlerCard from "@/components/WrestlerCard";
import GroupByBar from "@/components/GroupByBar";

const DATA: Wrestler[] = [
  {
    id: 1,
    createdAt: '2025-01-15T08:30:00.000000Z',
    updatedAt: '2025-01-15T08:30:00.000000Z',
    name: 'Rey Calzado',
    gender: 'MALE',
    finisherName: 'Manila Driver',
    allegiance: 'FACE',
    role: 'WRESTLER',
    territoryId: 3,
    promotionId: 1,
    popularity: 78,
    strength: 65,
    skill: 88,
    agility: 92,
    stamina: 74,
    attitude: 60,
    managerId: null,
    partnerId: 2,
    storyFriendId: 2,
    storyEnemyId: 3,
    realFriendId: null,
    realEnemyId: null,
  },
  {
    id: 2,
    createdAt: '2025-01-15T08:31:00.000000Z',
    updatedAt: '2025-01-15T08:31:00.000000Z',
    name: 'Diego Santos',
    gender: 'MALE',
    finisherName: 'Santos Special',
    allegiance: 'FACE',
    role: 'WRESTLER',
    territoryId: 3,
    promotionId: 1,
    popularity: 71,
    strength: 80,
    skill: 76,
    agility: 68,
    stamina: 82,
    attitude: 55,
    managerId: null,
    partnerId: 1,
    storyFriendId: 1,
    storyEnemyId: null,
    realFriendId: null,
    realEnemyId: null,
  },
  {
    id: 3,
    createdAt: '2025-01-15T08:32:00.000000Z',
    updatedAt: '2025-01-15T08:32:00.000000Z',
    name: 'Viktor Cross',
    gender: 'MALE',
    finisherName: 'Crossfire',
    allegiance: 'HEEL',
    role: 'WRESTLER',
    territoryId: 1,
    promotionId: 1,
    popularity: 85,
    strength: 90,
    skill: 82,
    agility: 60,
    stamina: 77,
    attitude: 95,
    managerId: null,
    partnerId: null,
    storyFriendId: null,
    storyEnemyId: 1,
    realFriendId: null,
    realEnemyId: null,
  },
];

export default function RosterScreen() {
  const [groupBy, setGroupBy] = useState<GroupCategory>("gender");

  const sections = useMemo(
    () => groupWrestlers(DATA, groupBy),
    [groupBy]
  );
  
  const gridSections = useMemo(
    () => sections.map((s) => ({ title: s.title, data: [s.data] })),
    [sections]
  );

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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list_content: {
    paddingVertical: 12,
  },
  section_header: {
    fontFamily: fonts.heading,
    fontSize: 14,
    color: colors.textMuted,
    backgroundColor: colors.background, // opaque so cards don't bleed under the sticky header
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginTop:16
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 16,
  },
});