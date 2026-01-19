import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-4xl font-bold mb-4">Welcome to Ancher</Text>
      <Text className="text-lg text-gray-600">Your mobile app is ready!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
