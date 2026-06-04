import { Text, View, StyleSheet } from "react-native";
import { colors } from '../../styles/theme';

export default function ShowsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>fire</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: colors.text
  }
});
