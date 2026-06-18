import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"

interface StarRatingProps {
  rating: number | null
  interactive?: boolean
  onChange?: (rating: number | null) => void
}

export default function StarRating({ rating, interactive = false, onChange }: StarRatingProps) {
  const currentRating = rating ?? 0

  return (
    <View style={styles.star_container}>
      <View style={styles.star_row}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            disabled={!interactive}
            activeOpacity={0.8}
            onPress={() => {
              if (onChange) {
                // Clicking the same star sets rating back to null (unrated)
                onChange(currentRating === star ? null : star)
              }
            }}
          >
            <Ionicons
              name={star <= currentRating ? "star" : "star-outline"}
              size={56}
              color={star <= currentRating ? colors.accent : colors.textMuted}
              style={styles.star_icon}
            />
          </TouchableOpacity>
        ))}
      </View>
      {!interactive && rating === null ? (
        <Text style={styles.unrated_text}>This match is unrated</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  star_container: { marginVertical: 4},
  star_row: { flexDirection: "row", alignItems: "center" },
  star_icon: { marginRight: 6 },
  unrated_text: { 
    fontFamily: fonts.regular, 
    fontSize: 13, 
    color: colors.textMuted, 
    marginTop: 16, 
    alignSelf:'center'},
})