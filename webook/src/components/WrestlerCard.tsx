import { colors, fonts } from "@/styles/theme"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { router } from "expo-router"
import { Wrestler } from "@/types/wrestler"
import Ionicons from "@expo/vector-icons/Ionicons"

export default function WrestlerCard({wrestler} : {wrestler : Wrestler}) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => {router.push("/(tabs)/home")}}
    >
        <Text style={styles.name_text}>{wrestler.name}</Text>
        <View style={styles.symbol_container}>
          <View style={styles.symbol_label}>
            <Ionicons name={'man'} color={colors.text} size={24} />
            <Text style={styles.symbol_label_text}>MALE</Text>
          </View>
          <View style={styles.symbol_label}>
            <Ionicons name={'happy'} color={colors.text} size={24} />
            <Text style={styles.symbol_label_text}>FACE</Text>
          </View>
          <View style={styles.symbol_label}>
            <Ionicons name={'barbell'} color={colors.text} size={24} />
            <Text style={styles.symbol_label_text}>WRESTLER</Text>
          </View>
        </View>
        
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    marginHorizontal: 24,
    marginVertical: 5,
    padding: 16,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    shadowColor:'#000000',
    shadowOffset:{
      width: 0, 
      height: 1
    },
    alignItems:'center',
    justifyContent:'space-between',
    height:80
  },
  symbol_container: {
    flexDirection:'row',
    justifyContent: 'flex-end',
    gap:12,
    maxWidth: 200,
  },
  symbol_label: {
    justifyContent:'center',
    alignItems:'center',
    padding:10,
    width:56,
  },
  symbol_label_text: {
    marginTop:4,
    fontSize:12,
    color:colors.text
  },
  name_text: {
    flex:1,
    color: colors.text,
    fontWeight:'bold',
    fontFamily:fonts.regular,
    marginRight:16,
    fontSize:20
  },
  text: {
    color: colors.text,
  }
})