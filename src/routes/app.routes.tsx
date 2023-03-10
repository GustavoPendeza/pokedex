import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Details } from '../screens/Details'
import { Filter } from '../screens/Filter'
import { Home } from '../screens/Home'
import { Search } from '../screens/Search'

const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes() {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name='home' component={Home} />
            <Screen name='details' component={Details} />
            <Screen name='search' component={Search} />
            <Screen name='filter' component={Filter} />
        </Navigator>
    )
}