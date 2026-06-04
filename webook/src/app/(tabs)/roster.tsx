import { StyleSheet, ScrollView, FlatList } from "react-native";
import { colors } from '../../styles/theme';
import { Wrestler } from "@/types/wrestler";
import WrestlerCard from "@/components/WrestlerCard";

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
  return (
    <FlatList
      style={styles.container}
      data={DATA}
      renderItem={({item}) => <WrestlerCard wrestler={item} />}
      keyExtractor={item => item.id.toString()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text,
    fontSize: 40,
  }
});
