import React from 'react'
import { Dimensions, Touchable, View } from 'react-native'
import { Text } from 'react-native'
import { AVATAR, COLORS, FONTSIZE, FONTWEIGHT } from '../../config/SuperAppps'
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';


export const CardTaskCari = ({ index, title, members, warna }) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPress={() => navigation.navigate('MainDetailTask', { id: index })}>
            <View style={{
                width: '100%',
                backgroundColor: COLORS.white,
                borderRadius: 8,
                flexDirection: 'row',
                gap: 20,
                marginVertical: 5,
                //shadow ios
                shadowOffset: { width: -2, height: 4 },
                shadowColor: '#171717',
                shadowOpacity: 0.2,
                shadowRadius: 3,
                //shadow android
                elevation: 5
            }}>
                {warna === COLORS.infoDanger ? (
                    <View style={{ width: '3%', backgroundColor: COLORS.infoDanger, height: 58, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }} />
                ) : warna === "#EA5455" ? (
                    <View style={{ width: '3%', backgroundColor: '#EA5455', height: 58, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }} />

                ) : warna === "#F6AD1D" ? (
                    <View style={{ width: '3%', backgroundColor: '#F6AD1D', height: 58, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }} />

                ) : warna === "#FF8F28" ? (
                    <View style={{ width: '3%', backgroundColor: '#FF8F28', height: 58, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }} />

                ) : warna === "#11C15B" ? (
                    <View style={{ width: '3%', backgroundColor: '#11C15B', height: 58, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }} />
                ) : (
                    <></>
                )}
                <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', flex: 1 }}>
                    <Text
                        ellipsizeMode='tail'
                        numberOfLines={1}
                        style={{
                            fontWeight: FONTWEIGHT.bold,
                            fontSize: FONTSIZE.H2
                        }}
                    >
                        {title}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    {members.map((data, index) => {
                        return (
                            <Image source={{ uri: data.avatar_url }} style={{
                                marginLeft: index === 0 ? 0 : -8,
                                borderWidth: 2,
                                borderRadius: 50,
                                borderColor: COLORS.white,
                                width: 30,
                                height: 30
                            }} />
                        )
                    })}
                    <View style={{ marginLeft: 15, marginRight: 15 }}>
                        <Ionicons name='chevron-forward-outline' size={24} color={COLORS.grey} />
                    </View>
                    {/* <Image source={subAvatar} /> */}
                </View>
            </View>
        </TouchableOpacity>
    )
}
