import { Text, View } from "react-native";

export function Header() {
    return (
        <View className="flex-row justify-center pt-4 bg-red-700">
            <Text className="text-lg text-white font-pokemon py-6">Pokédex</Text>
        </View>
    )
}