import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, Image, ListRenderItemInfo, ScrollView, Text, View } from "react-native";
import { BackButton } from "../components/BackButton";
import { typeColors } from "../utils/type-colors";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { TypePokemon } from "../components/TypePokemon";
import { StatsBar } from "../components/StatsBar";
import Feather from 'react-native-vector-icons/Feather';
import colors from 'tailwindcss/colors'
import { Abilities } from "../components/Abilities";
import { EvolutionChain } from "../components/EvolutionChain";

interface Params {
    pokemonName: string;
}

interface Ability {
    ability: {
        name: string;
    }
}

interface Stat {
    base_stat: number;
    effort: number;
    stat: {
        name: string;
    };
}

interface Type {
    type: {
        name: string;
    };
}

interface Pokemon {
    id: number;
    abilities: Ability[];
    stats: Stat[];
    types: Type[];
    base_experience: number;
    height: number;
    weight: number;
    sprites: {
        front_default: string;
    }
}

export function Details() {
    const [loading, setLoading] = useState(true);
    const route = useRoute();
    const { pokemonName } = route.params as Params;
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const screenWidth = Dimensions.get('window').width;

    /**
     * Retorna as informações de um Pokémon específico
     */
    async function fetchPokemon() {
        try {
            setLoading(true);
            const response = await api.get(`/pokemon/${pokemonName}`);
            setPokemon(response.data);
        } catch (error) {
            Alert.alert(':(', 'Não foi possível carregar os dados do Pokémon.');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPokemon()
    }, [pokemonName])

    if (loading) {
        return (
            <Loading />
        )
    }

    function renderStats({ item }: ListRenderItemInfo<Stat>) {
        return <StatsBar statName={item.stat.name} statValue={item.base_stat} />
    }

    function renderAbilities({ item }: ListRenderItemInfo<Ability>) {
        return <Abilities abilityName={item.ability.name} />
    }

    return (
        <View className="flex-1 bg-background">
            <View
                className="flex-row w-full h-1/3 pt-8 rounded-b-3xl"
                style={{ backgroundColor: `${typeColors[pokemon?.types[0].type.name as keyof Object]}` }}
            >
                <BackButton />
                <View className="flex-1 justify-center items-center">
                    {
                        pokemon?.sprites.front_default !== null ?
                            <Image
                                source={{ uri: `${pokemon?.sprites.front_default}` }}
                                className="h-full w-8/12 absolute mt-8"
                            />
                            :
                            <View className="mr-10">
                                <Feather name="camera-off" size={100} color={colors.white} />
                            </View>
                    }
                    <View className="absolute top-0 right-2">
                        <Text className="text-white text-xl font-pokemon">#{pokemon?.id}</Text>
                    </View>
                </View>
            </View>

            <View className="px-5">

                <View className="items-center py-3">
                    <Text className="text-white text-2xl font-retro capitalize">
                        {pokemonName}
                    </Text>
                </View>

                <View className="flex-row justify-evenly py-2.5">
                    {
                        pokemon?.types.map((slot, i) => (
                            <TypePokemon key={i + slot.type.name} typeName={slot.type.name} />
                        ))
                    }
                </View>

                <View className="flex-row justify-around py-2.5">
                    <View className="items-center">
                        <Text className="text-white">{parseFloat((pokemon!.weight / 10).toFixed(1))} KG</Text>
                        <Text className="text-white opacity-70">Peso</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-white">{parseFloat((pokemon!.height / 10).toFixed(2))} M</Text>
                        <Text className="text-white opacity-70">Altura</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
            >

                {/* STATUS BASE */}

                <FlatList
                    className="px-5"
                    style={{ width: screenWidth }}
                    keyExtractor={(item) => item.stat.name}
                    data={pokemon?.stats}
                    renderItem={renderStats}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={() => (
                        <View className="items-center py-4 bg-background">
                            <Text className="text-white text-2xl font-retro capitalize">
                                <Feather name="bar-chart" size={30} color={colors.white} /> Status Base
                            </Text>

                            <View className="absolute top-1/2 right-0">
                                <Feather name="arrow-right" size={30} color={colors.white} />
                            </View>
                        </View>
                    )}
                    stickyHeaderIndices={[0]}
                />

                {/* HABILIDADES */}

                <FlatList
                    className="px-5"
                    style={{ width: screenWidth }}
                    keyExtractor={(item, index) => item.ability.name + index}
                    data={pokemon?.abilities}
                    renderItem={renderAbilities}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={() => (
                        <View className="items-center py-4 bg-background">
                            <View className="absolute top-1/2 left-0">
                                <Feather name="arrow-left" size={30} color={colors.white} />
                            </View>

                            <Text className="text-white text-2xl font-retro capitalize">
                                <Feather name="list" size={30} color={colors.white} /> Habilidades
                            </Text>

                            <View className="absolute top-1/2 right-0">
                                <Feather name="arrow-right" size={30} color={colors.white} />
                            </View>
                        </View>
                    )}
                    stickyHeaderIndices={[0]}
                />

                {/* EVOLUÇÕES */}

                <EvolutionChain pokemonName={pokemonName} />

            </ScrollView>
        </View>
    )
}