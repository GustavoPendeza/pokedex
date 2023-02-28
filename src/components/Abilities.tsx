import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { api } from '../lib/axios';
import colors from 'tailwindcss/colors'

interface Props {
    abilityName: string;
}

interface Effect {
    effect: string;
    language: {
        name: string;
    }
}

interface Name {
    language: {
        name: string;
    }
    name: string;
}

export function Abilities({ abilityName }: Props) {
    const [loading, setLoading] = useState(true);
    const [effect, setEffect] = useState<Effect | null>(null)
    const [name, setName] = useState<Name | null>(null)

    /**
     * Retorna as habilidades do Pokémon
     */
    async function fetchAbility() {
        try {
            setLoading(true)
            await api.get(`/ability/${abilityName}`).then(res => {
                res.data.effect_entries.some((effect: Effect) => {
                    if (effect.language.name === "en") {
                        setEffect(effect)
                    }
                })

                res.data.names.some((name: Name) => {
                    if (name.language.name === "en") {
                        setName(name)
                    }
                })
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAbility();
    }, [])

    return (
        <View className='p-3 my-2 rounded-xl bg-zinc-700'>
            {
                loading ?
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator color={colors.white} size={60} />
                    </View>
                    :
                    <View>
                        <Text className='font-retro text-lg text-white mb-2'>{name?.name}</Text>
                        {
                            effect?.effect ?
                                <Text className='text-zinc-300'>{effect?.effect}</Text>
                                :
                                <Text className='text-zinc-300'>No info.</Text>
                        }
                    </View>
            }
        </View>
    )
}