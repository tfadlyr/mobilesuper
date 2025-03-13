import React from 'react'
import { Dimensions, Touchable, View } from 'react-native'
import { Text } from 'react-native'
import { AVATAR, COLORS, FONTSIZE, FONTWEIGHT } from '../../config/SuperAppps'
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export const CardListTaskKorespondensi = ({ id, title, duedate,priority }) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPress={() => { navigation.navigate('MainDetailKorespondensiTM', { id: id }) }} key={id}>
            <View
                style={{
                    width: '100%',
                    backgroundColor: COLORS.white,
                    borderRadius: 8,
                    gap: 1,
                    marginVertical: 5,
                    //shadow
                    shadowOffset: { width: -2, height: 4 },
                    shadowColor: '#171717',
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                }}>
                <View style={{flexDirection:"row", width:"100%",}}>
                    <View style={{ marginVertical: 10, marginLeft: 10, width:"70%" }}>
                        <Text style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H2, }}>{title}</Text>
                    </View>
                    <View style={{ marginLeft: 10, borderRadius:10, backgroundColor:COLORS.infoLight, width:"20%", alignSelf:"center", alignItems:"center", maxHeight:20 }}>
                        <Text style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H2 }}>{priority}</Text>
                    </View>
                </View>
                <View style={{ marginBottom: 10, marginLeft: 10, display: 'flex', flexDirection: 'row', gap: 2 }}>
                    <Text>Target Tanggal: </Text>
                    <Text style={{ color: COLORS.danger }}>{duedate}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
