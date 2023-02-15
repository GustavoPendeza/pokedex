import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
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
        fetchPokemonByType();
    }, [typeName])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <View className='flex-1' >

            {
                apiResponse?.pokemon[0] ?
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="flex-row flex-wrap justify-between px-5 pb-5 pt-3" >
                            {
                                apiResponse.pokemon.map((pokemon, index) => (
                                    <Card
                                        key={index+pokemon.pokemon.name}
                                        name={pokemon.pokemon.name}
                                    />
                                ))
                            }
                        </View>
                    </ScrollView >
                    :
                    <View className='h-2/4 justify-center items-center'>
                        <Text className='text-white text-base'>O tipo <Text className='font-retro capitalize'>{typeName}</Text> não tem nenhum Pokémon</Text>
                    </View>
            }
        </View >
    )
}