import { Modal, View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { Event } from "@/types/event"
import WrestlerEventCard from "@/components/WrestlerEventCard"
import { useMatchTypes } from "@/hooks/useLookups"
import { useChampionships } from "@/hooks/useChampionships"
import { useShows } from "@/hooks/useShows"

type Props = {
  visible: boolean
  wrestlerName: string
  events: Event[]
  onClose: () => void
}

export default function HistoryModal({ visible, wrestlerName, events, onClose }: Props) {
  const { data: matchTypes } = useMatchTypes()
  const { data: championships } = useChampionships()
  const { data: shows } = useShows()

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            
            <Text style={styles.title} numberOfLines={1}>{wrestlerName} — History</Text>
            <View style={{ width: 26 }} />
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close history">
              <Ionicons name="close" color={colors.text} size={26} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={events}
            keyExtractor={(e) => String(e.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <WrestlerEventCard
                event={item}
                matchTypeName={item.matchTypeId != null ? matchTypes?.get(item.matchTypeId) ?? null : null}
                championshipName={item.championshipId != null ? championships?.get(item.championshipId)?.name ?? null : null}
                show={item.showId != null ? shows?.get(item.showId) ?? null : null}
              />
            )}
            ListEmptyComponent={<Text style={styles.empty}>No events yet.</Text>}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: "85%", paddingTop: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -320 },  // negative height = shadow casts upward
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 20,  // android
  },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 24, marginBottom: 16,
  },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, flex: 1, textAlign: "center", marginHorizontal: 8 },
  list: { paddingHorizontal: 24, paddingBottom: 24 },
  empty: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, textAlign: "center", marginTop: 40 },
})