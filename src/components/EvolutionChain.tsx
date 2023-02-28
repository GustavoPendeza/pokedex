import { Dimensions, ScrollView, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { Loading } from './Loading';
import Feather from 'react-native-vector-icons/Feather';
import colors from 'tailwindcss/colors'
import { Card } from './Card';

interface Props {
    pokemonName: string;
}

interface Specie {
    evolution_chain: {
        url: string;
    }
}

interface SecondEvolution {
    species: {
        name: string;
    }
}

interface FirstEvolution {
    evolves_to: SecondEvolution[] | null;
    species: {
        name: string;
    }
}

interface BaseEvolution {
    chain: {
        evolves_to: FirstEvolution[] | null;
        species: {
            name: string;
        }
    }

}

export function EvolutionChain({ pokemonName }: Props) {
    const [loading, setLoading] = useState(true);
    const [specie, setSpecie] = useState<Specie | null>(null)
    const [evolution, setEvolution] = useState<BaseEvolution | null>(null)
    const screenWidth = Dimensions.get('window').width;

    /**
     * Retorna os dados da espécie do Pokémon
     */
    async function fetchSpecie() {
        try {
            setLoading(true);
            const responseSpecie = await api.get(`/pokemon-species/${pokemonName}`)
            setSpecie(responseSpecie.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Retorna as evoluções do Pokémon
     */
    async function fetchEvolution() {
        try {
            setLoading(true);
            const responseEvolution = await api.get(`/evolution-chain/${specie?.evolution_chain.url.slice(42, -1)}`);
            setEvolution(responseEvolution.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSpecie();
    }, [])

    /**
     * Usado para fazer a busca das evoluções assim que acabar a de espécie
     */
    useEffect(() => {
        fetchEvolution();
    }, [specie])

    if (loading) {
        return (
            <View style={{ width: screenWidth }}>
                <Loading />
            </View>
        )
    }



    return (
        <View className='flex-1 justify-center items-center px-5' style={{ width: screenWidth }}>
            <View className="w-full items-center py-4 bg-background">
                <View className="absolute top-1/2 left-0">
                    <Feather name="arrow-left" size={30} color={colors.white} />
                </View>

                <Text className="text-white text-2xl font-retro capitalize">
                    <Feather name="zap" size={30} color={colors.white} /> Evoluções
                </Text>
            </View>

            {
                evolution?.chain.evolves_to ?
                    <ScrollView
                        className='w-full'
                        showsVerticalScrollIndicator={false}
                    >
                        <View className='flex-row flex-wrap justify-evenly pb-2'>
                            {/* FORMA BASE */}
                            <Card key={evolution?.chain.species.name} name={evolution?.chain.species.name} />

                            {/* PRIMEIRA EVOLUÇÃO */}

                            {
                                evolution?.chain.evolves_to && evolution.chain.evolves_to.map((first) => (
                                    <Card key={first.species.name} name={first.species.name} />
                                ))
                            }

                            {/* SEGUNDA EVOLUÇÃO */}

                            {
                                evolution?.chain.evolves_to && evolution.chain.evolves_to.map(
                                    f => f.evolves_to && f.evolves_to.map((second) => (
                                        <Card key={second.species.name} name={second.species.name} />
                                    ))
                                )
                            }
                        </View>
                    </ScrollView>
                    :
                    <View className='flex-1 top-1/4'>
                        <Text className='text-white text-base'>Esse Pokémon não tem Evoluções</Text>
                    </View>
            }

        </View >
    )
}