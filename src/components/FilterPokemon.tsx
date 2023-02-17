import { useEffect, useState } from 'react';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';
import { api } from '../lib/axios';
import { Card } from './Card';
import { Loading } from './Loading';

interface Props {
    typeName: string;
}

interface Pokemon {
    pokemon: {
        name: string
    }
}

interface ApiResponse {
    pokemon: Pokemon[]
}

export function FilterPokemon({ typeName }: Props) {
    const [loading, setLoading] = useState(true);
    const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

    async function fetchPokemonByType() {
        try {
            setLoading(true);
            const response = await api.get(`/type/${typeName}`)
            setApiResponse(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setApiResponse(null);
        fetchPokemonByType();
    }, [typeName])

    if (loading) {
        return (
            <Loading />
        )
    }

    function renderItem({ item }: ListRenderItemInfo<Pokemon>) {
        return <Card name={item.pokemon.name} />
    }

    return (
        <View className='flex-1' >

            {
                apiResponse?.pokemon[0] ?
                    <FlatList
                        className="mb-5 pt-1"
                        keyExtractor={(item) => item.pokemon.name}
                        data={apiResponse?.pokemon}
                        renderItem={renderItem}
                        horizontal={false}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: "space-evenly" }}
                        showsVerticalScrollIndicator={false}
                        maxToRenderPerBatch={4}
                        removeClippedSubviews={true}
                        updateCellsBatchingPeriod={0}
                        windowSize={4}
                    />
                    :
                    <View className='h-2/4 justify-center items-center'>
                        <Text className='text-white text-base'>O tipo <Text className='font-retro capitalize'>{typeName}</Text> não tem nenhum Pokémon</Text>
                    </View>
            }
        </View >
    )
}