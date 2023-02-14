import { useState, useEffect } from "react";
import { Alert, Text, View } from "react-native";
import { api } from "../lib/axios";
import { Card } from "./Card";
import { Loading } from "./Loading";

interface Props {
    search: string
}

interface ApiResponse {
    name: string
}

export function SearchPokemon({ search }: Props) {
    const [loading, setLoading] = useState(true);
    const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

    /**
     * Retorna as informações de um Pokémon específico
     */
    async function fetchPokemon() {
        try {
            setLoading(true);
            const response = await api.get(`/pokemon/${search}`)
            setApiResponse(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setApiResponse(null)
        fetchPokemon()
    }, [search])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <View className="flex-1">
            <View className="flex-row flex-wrap justify-between px-5 pb-5 pt-1">
                {
                    apiResponse && apiResponse !== null && apiResponse !== undefined ?
                        <Card
                            key={apiResponse.name}
                            name={apiResponse.name}
                        />
                        :
                        <View className="flex-1 h-full items-center justify-center gap-3">
                            <Text className="text-white text-base">
                                Não encontramos o Pokémon que você buscou.
                            </Text>
                            <Text className="text-zinc-400 text-sm">
                                Verifique se digitou corretamente.
                            </Text>
                        </View>
                }
            </View>
        </View>
    )
}