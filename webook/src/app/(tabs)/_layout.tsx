import { useState } from "react";
import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, fonts } from "@/styles/theme";
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  Pressable, FlatList, ActivityIndicator
} from "react-native";
import { useActiveUniverse, Universe } from "@/context/UniverseContext";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

function SidebarMenu({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { universes, activeUniverse, switchActiveUniverse, clearUniverse, loading } = useActiveUniverse()
  const { logout } = useAuth()

  const handleSwitch = async (universe: Universe) => {
    if (universe.id === activeUniverse?.id) { onClose(); return }
    try {
      await switchActiveUniverse(universe.id)
      onClose()
    } catch (e: any) {
      console.log("switch failed:", e.response?.status)
    }
  }

  const handleCreateNew = () => {
    onClose()
    router.push("/create-universe")
  }

  const handleLogout = async () => {
    onClose()
    clearUniverse()
    await logout()
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.drawer} onPress={() => {}}>

          <Text style={styles.drawer_eyebrow}>UNIVERSE</Text>
          <Text style={styles.drawer_heading}>{activeUniverse?.name ?? "—"}</Text>

          <View style={styles.divider} />

          <Text style={styles.section_label}>SWITCH SAVE FILE</Text>

          {loading ? (
            <ActivityIndicator color={colors.accent} style={{ marginVertical: 16 }} />
          ) : (
            <FlatList
              data={universes}
              keyExtractor={(item) => String(item.id)}
              scrollEnabled={universes.length > 5}
              style={styles.universe_list}
              renderItem={({ item }) => {
                const isActive = item.id === activeUniverse?.id
                return (
                  <TouchableOpacity
                    style={[styles.universe_row, isActive && styles.universe_row_active]}
                    onPress={() => handleSwitch(item)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.universe_dot, isActive && styles.universe_dot_active]} />
                    <Text style={[styles.universe_name, isActive && styles.universe_name_active]}>
                      {item.name}
                    </Text>
                    {isActive && (
                      <Ionicons name="checkmark" color={colors.accent} size={16} />
                    )}
                  </TouchableOpacity>
                )
              }}
              ListEmptyComponent={
                <Text style={styles.empty}>No universes found.</Text>
              }
            />
          )}

          <TouchableOpacity style={styles.action_row} onPress={handleCreateNew} activeOpacity={0.7}>
            <Ionicons name="add-circle-outline" color={colors.accent} size={18} />
            <Text style={styles.action_text}>New universe</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.action_row} onPress={handleLogout} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" color={colors.textMuted} size={18} />
            <Text style={styles.action_text_muted}>Log out</Text>
          </TouchableOpacity>

        </Pressable>
      </Pressable>
    </Modal>
  )
}

function MenuButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menu_btn} activeOpacity={0.7}>
      <Ionicons name="menu" color={colors.text} size={26} />
    </TouchableOpacity>
  )
}

export default function TabLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  const headerRight = () => (
    <MenuButton onPress={() => setMenuOpen(true)} />
  )

  return (
    <>
      <Tabs
        screenOptions={{
          // Tab Bar Styles
          tabBarInactiveTintColor: colors.text,
          tabBarActiveTintColor: colors.primary,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            borderColor: colors.background,
            backgroundColor: colors.background,
          },
          tabBarLabelStyle: {
            fontFamily: fonts.bold,
          },

          // Header Styles
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            fontFamily: fonts.heading,
            fontSize: 32,
          },
          headerRight,
        }}
      >
        <Tabs.Screen name="shows" options={{
          title: 'Shows',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'tv-sharp' : 'tv-outline'} color={color} size={24} />
          ),
        }} />
        <Tabs.Screen name="home" options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }} />
        <Tabs.Screen name="roster" options={{
          title: 'Roster',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={color} size={24} />
          ),
        }} />
      </Tabs>

      <SidebarMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

const DRAWER_WIDTH = 300

const styles = StyleSheet.create({
  menu_btn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  drawer: {
    width: DRAWER_WIDTH,
    backgroundColor: colors.surface,
    borderLeftWidth: 1,
    borderColor: colors.border,
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  drawer_eyebrow: {
    fontFamily: fonts.heading,
    fontSize: 11,
    letterSpacing: 3,
    color: colors.accent,
    marginBottom: 6,
  },
  drawer_heading: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.text,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  section_label: {
    fontFamily: fonts.heading,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.textMuted,
    marginBottom: 10,
  },
  universe_list: {
    maxHeight: 260,
  },
  universe_row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 2,
  },
  universe_row_active: {
    backgroundColor: colors.background,
  },
  universe_dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  universe_dot_active: {
    backgroundColor: colors.accent,
  },
  universe_name: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
  universe_name_active: {
    color: colors.text,
  },
  empty: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    paddingVertical: 12,
  },
  action_row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },
  action_text: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.accent,
  },
  action_text_muted: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
})