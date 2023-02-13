import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Image, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import colors from 'tailwindcss/colors'
import { api } from "../lib/axios";
import { typeColors } from "../utils/type-colors";

interface Props {
    name: string;
}

interface Type {
    type: {
        name: string;
    };
}

interface Pokemon {
    id: number;
    types: Type[]
    sprites: {
        front_default: string;
    }
}

export function Card({ name }: Props) {
    const [loading, setLoading] = useState(true);
    const { navigate } = useNavigation();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null)

    /**
     * Retorna as informações de um Pokémon específico
     */
    async function fetchPokemon() {
        try {
            setLoading(true)
            const response = await api.get(`/pokemon/${name}`);
            setPokemon(response.data);
        } catch (error) {
            Alert.alert(':(', 'Não foi possível carregar os Cards.');
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPokemon()
    }, [])

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('details', { pokemonName: name })}
        >
            <View
                className={`h-44 w-44 my-2.5 rounded-lg`}
                style={{ backgroundColor: `${typeColors[pokemon?.types[0].type.name as keyof Object]}` }}
            >
                <View className="h-5/6 items-center justify-center">
                    {
                        loading ?
                            <View className="flex-1 justify-center items-center">
                                <ActivityIndicator color={colors.white} size={60} />
                            </View>
                            :

                            <>
                                {
                                    pokemon?.sprites.front_default !== null ?
                                        <Image
                                            source={{ uri: `${pokemon?.sprites.front_default}` }}
                                            className="h-5/6 w-4/6 mt-5"
                                        />
                                        :
                                        <View className="mt-5">
                                            <Feather name="camera-off" size={50} color={colors.white} />
                                        </View>
                                }

                                <View className="absolute top-0 right-2">
                                    <Text className="text-white font-pokemon">#{pokemon?.id}</Text>
                                </View>
                            </>
                    }
                </View>
                <View className="h-1/6 items-center px-1">
                    <Text className="text-white text-lg font-retro capitalize" numberOfLines={1}>
                        {name}
                    </Text>
                </View>
            </View>
        </TouchableOpacity >
    )
}