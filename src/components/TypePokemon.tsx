import { Text, View } from 'react-native'
import { typeColors } from '../utils/type-colors'

interface Props {
    typeName: string
}

export function TypePokemon({ typeName }: Props) {
    return (
        <View
            className="rounded-xl h-6 mx-2 items-center justify-center"
            style={{ backgroundColor: `${typeColors[typeName as keyof Object]}` }}
        >
            <Text className="text-white font-retro capitalize">    {typeName}    </Text>
        </View>
    )
}