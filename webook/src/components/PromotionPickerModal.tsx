// components/PromotionPickerModal.tsx
import { Modal, View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { usePromotions } from "@/hooks/usePromotions"

type Props = {
  visible: boolean
  currentId: number | null
  onSelect: (id: number) => void
  onClose: () => void
  dismissable?: boolean   // false on first-launch forced pick
}

export default function PromotionPickerModal({ visible, currentId, onSelect, onClose, dismissable = true }: Props) {
  const { data: promotions } = usePromotions()

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => dismissable && onClose()}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            {dismissable
              ? <TouchableOpacity onPress={onClose} accessibilityLabel="Close"><Ionicons name="close" color={colors.text} size={26} /></TouchableOpacity>
              : <View style={{ width: 26 }} />}
            <Text style={styles.title}>Select Promotion</Text>
            <View style={{ width: 26 }} />
          </View>
          <FlatList
            data={promotions ?? []}
            keyExtractor={(p) => String(p.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const active = item.id === currentId
              return (
                <TouchableOpacity style={styles.row} onPress={() => onSelect(item.id)} activeOpacity={0.7}>
                  <Text style={[styles.name, active && styles.name_active]}>{item.name}</Text>
                  {active && <Ionicons name="checkmark" color={colors.accent} size={22} />}
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "85%", paddingTop: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, marginBottom: 16 },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  list: { paddingHorizontal: 24, paddingBottom: 24 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  name: { fontFamily: fonts.regular, fontSize: 16, color: colors.text },
  name_active: { fontFamily: fonts.medium, color: colors.accent },
})