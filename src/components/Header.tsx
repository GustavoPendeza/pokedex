import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import colors from "tailwindcss/colors";
import { BackButton } from "./BackButton";

interface Props {
    homePage: boolean;
}

export function Header({ homePage = true }: Props) {
    const { navigate } = useNavigation();

    return (
        <View className="flex-row justify-center pt-4 bg-red-700">

            <Text className="text-lg text-white font-pokemon py-6">Pokédex</Text>

            {
                homePage === false ?
                    <View className="absolute mt-11 left-1">
                        <BackButton />
                    </View>
                    :
                    <View className="absolute mt-11 right-6">
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => navigate('search')}
                            className="ml-2"
                        >
                            <Feather name="search" size={32} color={colors.white} />
                        </TouchableOpacity>
                    </View>
            }

        </View>
    )
}