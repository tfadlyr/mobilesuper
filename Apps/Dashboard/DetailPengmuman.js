import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { View } from 'react-native'
import { Text } from 'react-native'
import { useSelector } from 'react-redux'
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTWEIGHT } from '../../config/SuperAppps'
import { StyleSheet } from 'react-native'
import { Search } from '../../components/Search'
import { FlatList } from 'react-native'


const ListPengumuman = ({ judul, tanggal }) => {
    const navigation = useNavigation()
    return (
        <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            width: '90%',
            flex: 1,
            marginTop: 10,
            marginHorizontal: 20,
            //shadow ios
            shadowOffset: { width: -2, height: 4 },
            shadowColor: '#171717',
            shadowOpacity: 0.2,
            //shadow android
            elevation: 2,
        }}>
            <TouchableOpacity onPress={() => navigation.navigate('', {
                item: item
            })}>

                <View style={{ marginVertical: 20, marginHorizontal: 20 }}>
                    <Text style={{ marginVertical: 5, fontSize: 13, fontWeight: FONTWEIGHT.bold }}>{judul}</Text>
                    <Text style={{ color: COLORS.grey, marginVertical: 5, fontSize: 13, }}>{tanggal}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}


export const DetailPengmuman = () => {
    const navigation = useNavigation()
    const { pengumuman } = useSelector(state => state.dashboard)
    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: COLORS.primary, height: '10%', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={[styles.backIcon, { justifyContent: 'center', alignItems: 'center', marginTop: 25, marginLeft: 20 }]}>
                        <Ionicons name='chevron-back' size={24} color={COLORS.primary} />
                    </View>
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 40 }}>
                    <Text style={{ color: 'white', fontSize: 15, fontWeight: 600 }}>Pengumuman</Text>
                </View>
            </View>

            <View style={{ width: '90%', marginLeft: 20, marginTop: 20 }}>
                <Search
                    placeholder={'Cari...'}
                />
            </View>

            <FlatList
                data={pengumuman.lists}
                renderItem={({ item }) => <ListPengumuman
                    judul={item.judul}
                    tanggal={item.tanggal}
                />
                }
                keyExtractor={item => item.id}
            />
        </View >
    )
}
const styles = StyleSheet.create({
    backIcon: {
        backgroundColor: 'white',
        height: 28,
        width: 28,
        borderRadius: 50,
    },
    imageIos: {
        height: 193, width: 350, borderRadius: 16
    },
    imageAndroid: {
        height: 193, width: 369, borderRadius: 16
    },
})