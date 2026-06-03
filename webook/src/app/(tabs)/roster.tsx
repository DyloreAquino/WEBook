import { Text, View, StyleSheet, ScrollView } from "react-native";
import { colors } from '../../theme';
import WrestlerListItem from "@/components/WrestlerListItem";

export default function RosterScreen() {
  return (
    <ScrollView style={styles.container}>
      <WrestlerListItem name="yes"/>
      <WrestlerListItem name="yes"/>
      <WrestlerListItem name="yes"/>
      <WrestlerListItem name="yes"/>
      <WrestlerListItem name="yes"/>
      <WrestlerListItem name="yes"/>
      <WrestlerListItem name="yes"/>
      <WrestlerListItem name="yes"/>
    </ScrollView>
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
