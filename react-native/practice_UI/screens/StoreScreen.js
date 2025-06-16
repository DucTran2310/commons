import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  ArrowDownTrayIcon,
  Bars3CenterLeftIcon,
  BellIcon,
} from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import GameCard from "../components/GameCard";
import GradientButton from "../components/GradientButton";
import { storeColors } from "../theme";
import { CATEGORIES, FEATURED } from "../constants/store_constants";

export default function StoreScreen() {
  const [activeCategory, setActiveCategory] = useState("Action");
  const [selectedGame, setSelectedGame] = useState(null);
  return (
    <LinearGradient
      colors={["rgba(58, 131, 244,0.4)", "rgba(9, 181, 211, 0.4)"]}
      className="w-full flex-1"
    >
      <SafeAreaView>
        <View className="container">
          <View className="flex-row justify-between items-center px-4">
            <Bars3CenterLeftIcon color={storeColors.text} size="30" />
            <BellIcon color={storeColors.text} size="30" />
          </View>

          {/* categories */}
          <View className="mt-3 space-y-3">
            <Text
              style={{ color: storeColors.text }}
              className="ml-4 text-3xl font-bold"
            >
              Browse Games
            </Text>
            <View className="pl-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {CATEGORIES.map((catItem, index) => {
                  if ((activeCategory === catItem)) {
                    // show gradient category
                    return (
                      <GradientButton value={catItem} key={index} containerClass="mr-2"/>
                    )
                  } else {
                    // show normal category
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          console.log('CATITEM: ', catItem)
                          setActiveCategory(catItem)
                        }}
                        key={index}
                        className="bg-blue-200 p-3 px-4 rounded-full mr-2"
                      >
                        <Text>{catItem}</Text>
                      </TouchableOpacity>
                    );
                  }
                })}
              </ScrollView>
            </View>
          </View>

          {/* featured row  */}
          <View className="mt-3 space-x-4">
            <Text
              style={{color: storeColors.text}}
              className="ml-4 text-lg font-bold"
            >
              Featured Games
            </Text>
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {
                  FEATURED.map((item, index) => {
                    return (
                      <GameCard key={index} game={item}/>
                    )
                  })
                }
              </ScrollView>
            </View>
          </View>

          {/* top action games list */}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
