import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { COLORS } from '../../config/SuperAppps'
import { Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native'
import { CardSuka } from '../../components/CardSuka'

export const ListSuka = ({ route }) => {

    const navigation = useNavigation()
    const { detail } = route.params
    return (
        <View>
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
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name='chevron-back-outline' size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginLeft: 20, marginTop: 20 }}>
                <Text style={{ opacity: 0.5 }}>Disukai ({detail.disukai})</Text>
            </View>
            <View>
                <FlatList
                    data={detail.orangSuka}
                    renderItem={({ item }) => <CardSuka
                        avatar={item.avatar}
                        nama={item.nama}
                        jabatan={item.jabatan}
                    />
                    }
                />
            </View>

        </View>
    )
}
