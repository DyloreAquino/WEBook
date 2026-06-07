import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import { colors, fonts } from "@/styles/theme"

type ConfirmModalProps = {
  visible: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  visible, title, message,
  confirmLabel = "Confirm", cancelLabel = "Cancel",
  destructive = false, loading = false,
  onConfirm, onCancel,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancel} onPress={onCancel} disabled={loading} activeOpacity={0.7}>
              <Text style={styles.cancel_text}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirm, destructive && styles.confirm_destructive]}
              onPress={onConfirm}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading
                ? <ActivityIndicator color={colors.text} size="small" />
                : <Text style={styles.confirm_text}>{confirmLabel}</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center", justifyContent: "center", padding: 32,
  },
  dialog: {
    width: "100%", maxWidth: 360,
    backgroundColor: colors.surface, borderRadius: 18, padding: 24,
    borderWidth: 1, borderColor: colors.border,
  },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 8 },
  message: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, marginBottom: 20, lineHeight: 20 },
  actions: { flexDirection: "row", gap: 10 },
  cancel: {
    flex: 1, paddingVertical: 12, borderRadius: 10,
    backgroundColor: colors.background, alignItems: "center", borderWidth: 1, borderColor: colors.border,
  },
  cancel_text: { fontFamily: fonts.medium, fontSize: 14, color: colors.textMuted },
  confirm: {
    flex: 1, paddingVertical: 12, borderRadius: 10,
    backgroundColor: colors.accent, alignItems: "center",
  },
  confirm_destructive: { backgroundColor: colors.primary },
  confirm_text: { fontFamily: fonts.bold, fontSize: 14, color: colors.text },
})