import { useState } from "react";
import { Image, Text, TextInput, View } from "react-native";
import { Header } from "../components/Header";
import { SearchPokemon } from "../components/SearchPokemon";
import colors from "tailwindcss/colors";

export function Search() {
    const [search, setSearch] = useState<String | null>(null);

    const getSearch = ((text: string) => {
        setSearch(text)
    })

    return (
        <View className="flex-1 bg-background">

            <Header searchPage={true} />

            <View>
                <TextInput
                    className="m-2 border border-zinc-500 rounded-lg text-white p-2"
                    placeholder="Pesquise o nome ou ID do Pokémon desejado"
                    placeholderTextColor={colors.zinc[400]}
                    onSubmitEditing={(event) => getSearch(event.nativeEvent.text)}
                />
            </View>

            {
                search ?
                    <SearchPokemon search={search.trim().toLowerCase()} />
                    :
                    <View className="h-2/4 items-center justify-center gap-5">
                        <Text className="text-white text-base">
                            Pesquise um Pokémon.
                        </Text>
                        <Image
                            source={{ uri: 'https://user-images.githubusercontent.com/53589614/218863714-07c7822c-bb72-4c9b-8d9a-e3cada657a41.png' }}
                            className="h-16 w-16"
                        />
                    </View>
            }

        </View>
    )
}