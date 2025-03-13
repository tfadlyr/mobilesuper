import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native'
import { COLORS } from '../../config/SuperAppps'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { CardSuka } from '../../components/CardSuka'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import { } from 'react-native-safe-area-context'


export const ListSukaLinimasa = () => {
    const { linimasa } = useSelector(state => state.pengetahuan)
    const item = linimasa.listsLike
    const navigation = useNavigation()
    return (
        < >
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', backgroundColor: COLORS.primary, height: 80, paddingBottom: 20 }}>
                <View style={{
                    backgroundColor: COLORS.white,
                    borderRadius: 20,
                    width: 28,
                    height: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 20
                }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Ionicons name='chevron-back-outline' size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginLeft: 20, marginTop: 20 }}>
                <Text style={{ opacity: 0.5 }}>Disukai ({item.length})</Text>
            </View>
            <View>
                <FlatList
                    data={item}
                    renderItem={({ item }) => <CardSuka
                        item={item}
                    />
                    }
                />
            </View>
        </ >
    )
}
