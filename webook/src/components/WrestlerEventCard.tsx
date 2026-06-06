import { colors, fonts } from "@/styles/theme"
import { View, Text, StyleSheet } from "react-native"
import { Event } from "@/types/event"
import EventTag from "@/components/EventTag"
import { TYPE_TAG, PLACEMENT_TAG } from "@/lib/eventTags"
import { formatShow } from "@/lib/formatShow"
import { Show } from "@/types/show"
import Ionicons from "@expo/vector-icons/Ionicons"

type Props = {
  event: Event
  matchTypeName?: string | null
  championshipName?: string | null
  show?: Show | null
}

export default function WrestlerEventCard({
  event, matchTypeName, championshipName, show,
}: Props) {
  const won = Boolean(event.isWinner)
  const isMatch = event.type === "MATCH"
  const showLine = show ? formatShow(show) : null
  const wrestlers = event.wrestlers ?? []

  return (
    <View style={styles.card}>
      {/* header: title + matchtype + placement on the left, result tag top-right */}
      <View style={styles.header}>
        <View style={styles.header_left}>
          <Text style={styles.heading}>{TYPE_TAG[event.type]?.label ?? event.type}</Text>
          {matchTypeName && <EventTag label={matchTypeName} bg="#1a4a4a" />}
          <EventTag
            label={PLACEMENT_TAG[event.placement]?.label ?? event.placement}
            bg={PLACEMENT_TAG[event.placement]?.bg ?? "#3a3a3a"}
          />
        </View>
        {isMatch && event.finishType && (
          <View style={[styles.result, { backgroundColor: won ? "#1f4a2e" : "#3a3a3a" }]}>
            <Ionicons name={won ? "trophy" : "close"} color={colors.text} size={13} />
            <Text style={styles.result_text}>{won ? "WON" : "LOST"}</Text>
          </View>
        )}
      </View>

      {showLine ? <Text style={styles.show_line}>{showLine}</Text> : null}

      {event.stipulations && event.stipulations.length > 0 && (
        <View style={styles.tags}>
          {event.stipulations.map((s) => (
            <EventTag key={s.id} label={s.name} bg="#43352a" />
          ))}
        </View>
      )}

      {wrestlers.length > 0 && (
        <View style={styles.opponents}>
          {wrestlers.map((w) => (
            <View key={w.id} style={styles.opp_row}>
              <Text style={[styles.opp_name, w.isWinner && styles.opp_winner]} numberOfLines={1}>
                {w.isWinner ? "★ " : ""}{w.name}
              </Text>
              <Text style={styles.opp_result}>
                {w.finishType ? `${w.isWinner ? "Won" : "Lost"} · ${w.finishType}` : ""}
              </Text>
            </View>
          ))}
        </View>
      )}

      {championshipName ? <Text style={styles.meta}>{championshipName}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  header_left: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  heading: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  meta: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  result: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  result_text: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.text,
  },
  show_line: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 10,
  },
  opponents: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    marginBottom: 8,
  },
  opp_row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 4 },
  opp_name: { fontFamily: fonts.regular, fontSize: 13, color: colors.text, flex: 1, marginRight: 8 },
  opp_winner: { fontFamily: fonts.medium, color: colors.accent },
  opp_result: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted },
})