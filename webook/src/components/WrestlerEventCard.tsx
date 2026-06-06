import { colors, fonts } from "@/styles/theme"
import { View, Text, StyleSheet } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Event } from "@/types/event"
import EventTag from "@/components/EventTag"
import { TYPE_TAG, PLACEMENT_TAG } from "@/lib/eventTags"
import { formatShow } from "@/lib/formatShow"
import { Show } from "@/types/show"

type Props = {
  event: Event
  matchTypeName?: string | null
  championshipName?: string | null
  show?: Show | null        // was: showName?: string
}

export default function WrestlerEventCard({ event, matchTypeName, championshipName, show }: Props) {
  const won = Boolean(event.isWinner)
  const isMatch = event.type === "MATCH"
  const showLine = show ? formatShow(show) : null

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.heading}>{TYPE_TAG[event.type]?.label ?? event.type}</Text>

        {/* show line below header */}
        {showLine ? <Text style={styles.show_line}>{showLine}</Text> : null}

        <View style={styles.tags}>
          {matchTypeName && <EventTag label={matchTypeName} bg="#1a4a4a" />}
          <EventTag
            label={PLACEMENT_TAG[event.placement]?.label ?? event.placement}
            bg={PLACEMENT_TAG[event.placement]?.bg ?? "#3a3a3a"}
          />
        </View>

        {event.stipulations && event.stipulations.length > 0 && (
          <View style={styles.tags}>
            {event.stipulations.map((s) => (
              <EventTag key={s.id} label={s.name} bg="#43352a" />
            ))}
          </View>
        )}

        {championshipName ? <Text style={styles.meta}>{championshipName}</Text> : null}
      </View>

      {isMatch && event.finishType && (
        <View style={[styles.result, { backgroundColor: won ? "#1f4a2e" : "#3a3a3a" }]}>
          <Ionicons name={won ? "trophy" : "close"} color={colors.text} size={22} />
          <Text style={styles.result_label} numberOfLines={1}>{event.finishType}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  content: { flex: 1 },
  heading: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 8 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  meta: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  result: {
    width: 72,
    height: 72,        // fixed both dimensions -> uniform square every card
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    gap: 4,
  },
  result_label: {
    fontFamily: fonts.regular,
    fontSize: 8,
    color: colors.text,
    textAlign: "center",
  },
  show_line: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 10,
  },
})