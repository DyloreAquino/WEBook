// app/(tabs)/index.tsx (or wherever home lives)
import { useState } from "react"
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { useManagedPromotion } from "@/context/PromotionContext"
import { usePromotions } from "@/hooks/usePromotions"
import { useLatestShow } from "@/hooks/useLatestShow"
import { useChampionshipsByPromotion } from "@/hooks/useChampionshipsByPromotion"
import PromotionPickerModal from "@/components/PromotionPickerModal"
import RecentShowCard from "@/components/RecentShowCard"
import ChampionshipCard from "@/components/ChampionshipCard"
import { router } from "expo-router"

export default function HomeScreen() {
  const { promotionId, setPromotionId, loading: promoLoading } = useManagedPromotion()
  const { data: promotions } = usePromotions()
  const { data: latestShow } = useLatestShow()
  const { data: championships, isLoading: champLoading, refetch, isRefetching } = useChampionshipsByPromotion(promotionId)
  const [pickerOpen, setPickerOpen] = useState(false)

  const promotionName = promotions?.find((p) => p.id === promotionId)?.name ?? "Select promotion"
  const mustPick = !promoLoading && promotionId == null

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.accent}      // iOS spinner color
          colors={[colors.accent]}       // Android spinner color
        />
      }
    >
      {/* booker banner — promotion changer */}
      <Text style={styles.booker_label}>You are the booker of</Text>
      <TouchableOpacity style={styles.promo_row} onPress={() => setPickerOpen(true)} activeOpacity={0.7}>
        <Text style={styles.promo_name}>{promotionName}</Text>
        <Ionicons name="chevron-down" color={colors.accent} size={22} />
      </TouchableOpacity>

      {/* most recent show */}
      {latestShow && <RecentShowCard show={latestShow} />}

      {/* championships */}
      <View style={styles.section_row}>
        <Text style={styles.section}>CHAMPIONSHIPS</Text>
        <TouchableOpacity
          style={styles.add_champ}
          onPress={() => router.push("/championship/create")}
          activeOpacity={0.7}
          accessibilityLabel="Add championship"
        >
          <Ionicons name="add" color={colors.accent} size={20} />
        </TouchableOpacity>
      </View>
      {champLoading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 20 }} />
      ) : (championships ?? []).length === 0 ? (
        <Text style={styles.empty}>No championships in this promotion.</Text>
      ) : (
        (championships ?? []).map((c) => <ChampionshipCard key={c.id} championship={c} />)
      )}

      <PromotionPickerModal
        visible={pickerOpen || mustPick}
        currentId={promotionId}
        dismissable={!mustPick}
        onSelect={(id) => { setPromotionId(id); setPickerOpen(false) }}
        onClose={() => setPickerOpen(false)}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 60 },
  booker_label: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, marginBottom: 4 },
  promo_row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 24 },
  promo_name: { fontFamily: fonts.bold, fontSize: 28, color: colors.text },
  section: { fontFamily: fonts.heading, fontSize: 14, color: colors.textMuted, marginBottom: 14 },
  empty: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, textAlign: "center", marginTop: 20 },
  section_row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  add_champ: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.accent,
    alignItems: "center", justifyContent: "center",
  },
})