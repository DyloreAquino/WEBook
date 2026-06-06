import { colors, fonts } from "@/styles/theme"
import { View, Text, StyleSheet } from "react-native"
import { Event } from "@/types/event"
import EventTag from "@/components/EventTag"
import { TYPE_TAG, PLACEMENT_TAG } from "@/lib/eventTags"

type Props = {
  event: Event
  matchTypeName?: string
  championshipName?: string | null
  showName?: string
}

export default function ShowEventCard({ event, matchTypeName, championshipName, showName }: Props) {
  const meta = [matchTypeName, championshipName, showName].filter(Boolean).join(" · ")
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>{TYPE_TAG[event.type]?.label ?? event.type}</Text>
      <View style={styles.tags}>
        <EventTag label={PLACEMENT_TAG[event.placement]?.label ?? event.placement}
                  bg={PLACEMENT_TAG[event.placement]?.bg ?? "#3a3a3a"} />
        {event.stipulations?.map((s) => (
          <EventTag key={s.id} label={s.name} bg="#43352a" />
        ))}
      </View>
      {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      <View style={styles.wrestlers}>
        {event.wrestlers?.map((w) => (
          <View key={w.id} style={styles.w_row}>
            <Text style={[styles.w_name, w.isWinner && styles.w_winner]} numberOfLines={1}>
              {w.isWinner ? "★ " : ""}{w.name}
            </Text>
            {w.finishType && <Text style={styles.w_finish}>{w.finishType}</Text>}
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, marginBottom: 12 },
  heading: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 10 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  meta: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginBottom: 10 },
  wrestlers: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8 },
  w_row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 5 },
  w_name: { fontFamily: fonts.regular, fontSize: 14, color: colors.text, flex: 1, marginRight: 8 },
  w_winner: { fontFamily: fonts.medium, color: colors.accent },
  w_finish: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted },
})