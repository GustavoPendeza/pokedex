import { View } from "react-native";
import { Header } from "../components/Header";
import { PokemonList } from "../components/PokemonList";

export function Home() {
    

    return (
        <View className="flex-1 bg-background">

            <Header />

            <PokemonList />
            
        </View>
    )
}