// app/(tabs)/shows.tsx  (or wherever your shows tab lives)
import { useState, useEffect } from "react"
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { Show } from "@/types/show"
import { useLatestShow } from "@/hooks/useLatestShow"
import { useShowsByMonth } from "@/hooks/useShowsByMonth"
import { useShow } from "@/hooks/useShow"
import ShowDetail from "@/components/ShowDetail"
import { router } from "expo-router"

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const SHOW_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  // map your show types -> icons; verify the type values
  TV: "tv", PPV: "star", SPECIAL: "flame",
}

export default function ShowsScreen() {
  const { data: latest, isLoading: latestLoading } = useLatestShow()

  // start undefined until latest loads, then seed
  const [year, setYear] = useState<number | null>(null)
  const [month, setMonth] = useState<number | null>(null)
  const [selectedWeek, setSelectedWeek] = useState(1)

  useEffect(() => {
    if (year != null) return
    if (latest) { setYear(latest.year); setMonth(latest.month); setSelectedWeek(latest.week) }
    else if (!latestLoading) { setYear(new Date().getFullYear()); setMonth(new Date().getMonth() + 1) }
  }, [latest, latestLoading, year])

  const ready = year != null && month != null
  const { data: monthShows } = useShowsByMonth(year ?? 0, month ?? 0, ready)

  // slot shows into weeks 1-4
  const slots: (Show | null)[] = [null, null, null, null]
  for (const s of monthShows ?? []) if (s.week >= 1 && s.week <= 4) slots[s.week - 1] = s

  const selectedShow = slots[selectedWeek - 1]
  const { data: showDetail } = useShow(selectedShow?.id ?? null)

  if (latestLoading || !ready) {
    return <View style={[styles.screen, styles.center]}><ActivityIndicator color={colors.accent} size="large" /></View>
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* year nav */}
      <View style={styles.year_nav}>
        <TouchableOpacity onPress={() => setYear((y) => (y ?? 0) - 1)} accessibilityLabel="Previous year">
          <Ionicons name="play-back" color={colors.textMuted} size={20} />
        </TouchableOpacity>
        <Text style={styles.year_label}>{year}</Text>
        <TouchableOpacity onPress={() => setYear((y) => (y ?? 0) + 1)} accessibilityLabel="Next year">
          <Ionicons name="play-forward" color={colors.textMuted} size={20} />
        </TouchableOpacity>
      </View>

      {/* month nav */}
      <View style={styles.month_nav}>
        <TouchableOpacity onPress={() => setMonth((m) => (m === 1 ? 12 : (m ?? 1) - 1))} accessibilityLabel="Previous month">
          <Ionicons name="chevron-back" color={colors.textMuted} size={20} />
        </TouchableOpacity>
        <Text style={styles.month_label}>{MONTHS[(month ?? 1) - 1]}</Text>
        <TouchableOpacity onPress={() => setMonth((m) => (m === 12 ? 1 : (m ?? 1) + 1))} accessibilityLabel="Next month">
          <Ionicons name="chevron-forward" color={colors.textMuted} size={20} />
        </TouchableOpacity>
      </View>

      {/* week strip */}
      <View style={styles.strip}>
        {slots.map((show, i) => {
          const week = i + 1
          const isSel = week === selectedWeek
          const iconName = show ? SHOW_ICON[show.type] ?? "ellipse" : "close"
          return (
            <TouchableOpacity
              key={week}
              style={[styles.cell, isSel && styles.cell_sel]}
              onPress={() => setSelectedWeek(week)}
              activeOpacity={0.7}
            >
              <Text style={styles.cell_week}>WK {week}</Text>
              <Ionicons
                name={iconName}
                color={show ? colors.accent : colors.textMuted}
                size={24}
              />
            </TouchableOpacity>
          )
        })}
      </View>

      {/* detail */}
      {selectedShow ? (
        <ShowDetail show={showDetail ?? selectedShow} loading={!showDetail} />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.empty_text}>No show booked for week {selectedWeek}</Text>
          <TouchableOpacity 
            style={styles.book_btn} 
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: "/show/create",
                params: { year: String(year), month: String(month), week: String(selectedWeek) },
              })
            }
          >
            <Ionicons name="add" color={colors.text} size={18} />
            <Text style={styles.book_text}>Book show</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 60 },
  center: { justifyContent: "center", alignItems: "center" },
  year_nav: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 8 },
  year_label: { fontFamily: fonts.bold, fontSize: 22, color: colors.text, minWidth: 80, textAlign: "center" },
  month_nav: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 20 },
  month_label: { fontFamily: fonts.medium, fontSize: 16, color: colors.textMuted, minWidth: 110, textAlign: "center" },
  strip: { flexDirection: "row", gap: 8, marginBottom: 20 },
  cell: {
    flex: 1, aspectRatio: 1, borderRadius: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    alignItems: "center", justifyContent: "center", gap: 4,
  },
  cell_sel: { borderColor: colors.accent, borderWidth: 2 },
  cell_week: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted },
  empty: { alignItems: "center", paddingVertical: 30 },
  empty_text: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, marginBottom: 14 },
  book_btn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: colors.accent, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
  },
  book_text: { fontFamily: fonts.medium, fontSize: 14, color: colors.text },
})