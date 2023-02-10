import { useEffect } from 'react';
import { Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { generateProgressPercentage } from '../utils/generate-percentage';
import { statsColor, statsName } from '../utils/stats-pokemon'


interface Props {
    statName: string;
    statValue: number;
}

export function StatsBar({ statName, statValue }: Props) {
    const sharedValue = useSharedValue(generateProgressPercentage(statValue))

    const style = useAnimatedStyle(() => {
        return {
            width: `${sharedValue.value}%`,
            backgroundColor: `${statsColor[statName as keyof Object]}`
        }
    })

    useEffect(() => {
        var value = sharedValue.value
        sharedValue.value = 0
        sharedValue.value = withTiming(value, {
            duration: 500
        })
    }, [])

    return (
        <View className='flex-row justify-between items-end py-1.5'>
            <Text className="text-white text-base">{`${statsName[statName as keyof Object]}`}</Text>

            <View className="w-5/6 h-5 rounded-xl bg-zinc-700 mt-4">
                <Animated.View
                    className="h-full rounded-xl items-end justify-center px-1"
                    style={style}
                >
                    {
                        sharedValue.value >= 18 ?
                            <Text className='text-white'>
                                {statValue}/255
                            </Text>
                            :
                            null
                    }
                </Animated.View>
                {
                    sharedValue.value < 18 ?
                    <View className='absolute px-2'>
                        <Text className='text-white'>
                            {statValue}/255
                        </Text>
                    </View>
                    :
                    null
                }
            </View>
        </View>
    )
}