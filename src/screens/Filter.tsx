import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Header } from "../components/Header";
import { SearchPokemon } from "../components/SearchPokemon";
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";
import { Loading } from "../components/Loading";
import { TypePokemon } from "../components/TypePokemon";
import { FilterPokemon } from "../components/FilterPokemon";

interface Types {
    name: string;
}

interface ApiResponse {
    results: Types[]
}

export function Filter() {
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState<string | null>(null);
    const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

    async function fetchTypes() {
        try {
            setLoading(true);
            const response = await api.get("/type")
            setApiResponse(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const getType = ((typeName: string) => {
        if (typeName !== type) {
            setType(typeName)
        }
    })

    useEffect(() => {
        fetchTypes()
    }, [])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <View className="flex-1 bg-background">

            <Header homePage={false} />

            <View>
                <ScrollView className="py-3 px-2 gap-x-2" horizontal showsHorizontalScrollIndicator={false}>
                    {
                        apiResponse && apiResponse.results.map((type) => (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => getType(type.name)}
                            >
                                <TypePokemon
                                    key={type.name}
                                    typeName={type.name}
                                />
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            </View>

            {
                type ?
                    <FilterPokemon typeName={type} />
                    :
                    <View className="h-2/4 items-center justify-center gap-5">
                        <Text className="text-white text-base">
                            Escolha um tipo de Pokémon.
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