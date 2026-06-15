// app/(tabs)/shows.tsx
import { useState, useEffect, useRef } from "react"
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions, Platform } from "react-native" // Import Platform
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { Show } from "@/types/show"
import { useLatestShow } from "@/hooks/useLatestShow"
import { useShowsByMonth } from "@/hooks/useShowsByMonth"
import { useShow } from "@/hooks/useShow"
import ShowDetail from "@/components/ShowDetail"
import { router } from "expo-router"
import { useManagedPromotion } from "@/context/PromotionContext"
import { usePromotions } from "@/hooks/usePromotions"
import PromotionPickerModal from "@/components/PromotionPickerModal"

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const SHOW_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  TV: "tv", PPV: "star", SPECIAL: "flame",
}

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const STRIP_WIDTH = SCREEN_WIDTH - 40 

export default function ShowsScreen() {
  const { data: latest, isLoading: latestLoading } = useLatestShow()

  const [year, setYear] = useState<number | null>(null)
  const [month, setMonth] = useState<number | null>(null)
  const [selectedWeek, setSelectedWeek] = useState(1)

  const scrollViewRef = useRef<ScrollView>(null)

  const { promotionId, setPromotionId, loading: promoLoading } = useManagedPromotion()
  const { data: promotions } = usePromotions()
  const [promoPickerOpen, setPromoPickerOpen] = useState(false)

  const promotionName = promotions?.find((p) => p.id === promotionId)?.name ?? "Select promotion"
  const mustPick = !promoLoading && promotionId == null

  useEffect(() => {
    if (year != null) return
    if (latest) { setYear(latest.year); setMonth(latest.month); setSelectedWeek(latest.week) }
    else if (!latestLoading) { setYear(new Date().getFullYear()); setMonth(new Date().getMonth() + 1) }
  }, [latest, latestLoading, year])

  const ready = year != null && month != null

  const prevMonthVal = month === 1 ? 12 : (month ?? 1) - 1
  const prevYearVal = month === 1 ? (year ?? 0) - 1 : (year ?? 0)

  const nextMonthVal = month === 12 ? 1 : (month ?? 1) + 1
  const nextYearVal = month === 12 ? (year ?? 0) + 1 : (year ?? 0)

  // Fetch neighboring month data ONLY on mobile apps to reduce web API load overhead
  const isWeb = Platform.OS === "web"
  
  const { data: prevMonthShows } = useShowsByMonth(prevYearVal, prevMonthVal, promotionId, ready && promotionId != null && !isWeb)
  const { data: currentMonthShows, refetch, isRefetching } = useShowsByMonth(year ?? 0, month ?? 0, promotionId, ready && promotionId != null)
  const { data: nextMonthShows } = useShowsByMonth(nextYearVal, nextMonthVal, promotionId, ready && promotionId != null && !isWeb)

  const getSlotsForMonth = (shows: Show[] | undefined) => {
    const slotsArr: (Show | null)[] = [null, null, null, null]
    for (const s of shows ?? []) {
      if (s.week >= 1 && s.week <= 4) slotsArr[s.week - 1] = s
    }
    return slotsArr
  }

  const currentSlots = getSlotsForMonth(currentMonthShows)
  const prevSlots = getSlotsForMonth(prevMonthShows)
  const nextSlots = getSlotsForMonth(nextMonthShows)

  const selectedShow = currentSlots[selectedWeek - 1]
  const { data: showDetail } = useShow(selectedShow?.id ?? null)

  // Only run slide positions if running on mobile targets
  useEffect(() => {
    if (ready && scrollViewRef.current && !isWeb) {
      scrollViewRef.current.scrollTo({ x: STRIP_WIDTH, animated: false })
    }
  }, [month, year, ready, isWeb])

  const shiftMonthState = (direction: number) => {
    if (direction === -1) {
      setMonth((m) => {
        if (m === 1) { setYear((y) => (y ?? 0) - 1); return 12 }
        return (m ?? 1) - 1
      })
    } else {
      setMonth((m) => {
        if (m === 12) { setYear((y) => (y ?? 0) + 1); return 1 }
        return (m ?? 1) + 1
      })
    }
  }

  const handlePrevMonthBtn = () => {
    if (scrollViewRef.current && !isWeb) {
      scrollViewRef.current.scrollTo({ x: 0, animated: true })
    } else {
      shiftMonthState(-1)
    }
  }

  const handleNextMonthBtn = () => {
    if (scrollViewRef.current && !isWeb) {
      scrollViewRef.current.scrollTo({ x: STRIP_WIDTH * 2, animated: true })
    } else {
      shiftMonthState(1)
    }
  }

  const onScrollEnd = (e: any) => {
    if (isWeb) return
    const offsetX = e.nativeEvent.contentOffset.x
    const currentPageIndex = Math.round(offsetX / STRIP_WIDTH)

    if (currentPageIndex === 0) {
      shiftMonthState(-1)
    } else if (currentPageIndex === 2) {
      shiftMonthState(1)
    }
  }

  if (latestLoading || !ready) {
    return <View style={[styles.screen, styles.center]}><ActivityIndicator color={colors.accent} size="large" /></View>
  }

  const renderWeekStrip = (slots: (Show | null)[], isInteractive: boolean) => (
    <View style={[styles.stripPage, isWeb && styles.stripPageWeb]}>
      {slots.map((show, i) => {
        const week = i + 1
        const isSel = isInteractive && week === selectedWeek
        const iconName = show ? SHOW_ICON[show.type] ?? "ellipse" : "close"
        return (
          <TouchableOpacity
            key={week}
            style={[styles.cell, isSel && styles.cell_sel]}
            disabled={!isInteractive}
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
  )

  return (
    <ScrollView 
      style={styles.screen} 
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.accent}
          colors={[colors.accent]}
        />
      }
    >
      {/* PROMOTION */}
      <TouchableOpacity style={styles.promo_header} onPress={() => setPromoPickerOpen(true)} activeOpacity={0.7}>
        <Text style={styles.promo_name}>{promotionName}</Text>
        <Ionicons name="chevron-down" color={colors.textMuted} size={18} />
      </TouchableOpacity>

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
        <TouchableOpacity onPress={handlePrevMonthBtn} accessibilityLabel="Previous month">
          <Ionicons name="chevron-back" color={colors.textMuted} size={20} />
        </TouchableOpacity>
        <Text style={styles.month_label}>{MONTHS[(month ?? 1) - 1]}</Text>
        <TouchableOpacity onPress={handleNextMonthBtn} accessibilityLabel="Next month">
          <Ionicons name="chevron-forward" color={colors.textMuted} size={20} />
        </TouchableOpacity>
      </View>

      {/* Adaptive Layout Switcher */}
      {isWeb ? (
        // Web: Static, straightforward rendering layout container
        <View style={styles.webContainer}>
          {renderWeekStrip(currentSlots, true)}
        </View>
      ) : (
        // Mobile Layout: Smooth Hardware Pager Carousel
        <View style={styles.carouselWrapper}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScrollEnd}
            contentOffset={{ x: STRIP_WIDTH, y: 0 }} 
            scrollEventThrottle={16}
          >
            {renderWeekStrip(prevSlots, false)}
            {renderWeekStrip(currentSlots, true)}
            {renderWeekStrip(nextSlots, false)}
          </ScrollView>
        </View>
      )}

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

      <PromotionPickerModal
        visible={promoPickerOpen || mustPick}
        currentId={promotionId}
        dismissable={!mustPick}
        onSelect={(id) => { setPromotionId(id); setPromoPickerOpen(false) }}
        onClose={() => setPromoPickerOpen(false)}
      />
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
  
  // Carousel Config Constraints
  carouselWrapper: { width: STRIP_WIDTH, height: STRIP_WIDTH * 0.25 + 4, marginBottom: 20, overflow: "hidden" },
  webContainer: { marginBottom: 20, width: "100%" },
  stripPage: { flexDirection: "row", width: STRIP_WIDTH, gap: 8 },
  stripPageWeb: { width: "100%" }, // Let it span natural container dimensions on web viewports
  
  cell: {
    flex: 1, aspectRatio: 1, borderRadius: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    alignItems: "center", justifyContent: "center", gap: 4,
    maxHeight: 120, // Prevents elements from stretching wildly on large desktop layouts
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
  promo_header: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    marginBottom: 12,
  },
  promo_name: { fontFamily: fonts.heading, fontSize: 15, color: colors.accent },
})