import { colors } from "@/theme"
import { View, Text, StyleSheet } from "react-native"

export default function WrestlerListItem({name} : {name : string}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 5,
    padding: 16,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    shadowColor:colors.text,
    shadowOffset:{width: 0, height: 1}
  },
  text: {
    color: colors.text
  }
})