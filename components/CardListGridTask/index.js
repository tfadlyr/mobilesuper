import React from 'react'
import { Dimensions, Touchable, View } from 'react-native'
import { Text } from 'react-native'
import { AVATAR, COLORS, FONTSIZE, FONTWEIGHT } from '../../config/SuperAppps'
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export const CardListGridTask = ({ id, title, duedate, priority, members }) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPress={() => { navigation.navigate('MainDetailTask', { id: id }) }}>
            <View
                style={{
                    width: 174,
                    flex: 1,
                    height: 150,
                    backgroundColor: COLORS.orange,
                    borderRadius: 8,
                    padding: 16,
                    marginVertical: 5,
                    //shadow
                    shadowOffset: { width: -2, height: 4 },
                    shadowColor: '#171717',
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: FONTWEIGHT.bold, flex: 1 }} numberOfLines={2}>{title}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>{duedate}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: priority === 'high' ? COLORS.infoDangerLight : priority === 'normal' ? COLORS.successLight : COLORS.infoLight, borderRadius: 30, padding: 4 }}>
                        <Text style={{ fontSize: FONTSIZE.H4, color: priority === 'high' ? COLORS.infoDanger : priority === 'normal' ? COLORS.success : COLORS.info, textTransform: 'capitalize' }}>{priority}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ flexDirection: 'row', position: 'relative', display: 'flex', alignItems: 'center', }}>
                        {members.map((data, index) => {
                            return (
                                <View key={data.nip}>
                                    <Image source={{ uri: data.avatar_url }} style={{
                                        marginLeft: index === 0 ? 0 : -8,
                                        borderWidth: 2,
                                        borderRadius: 50,
                                        borderColor: COLORS.white,
                                        width: 30,
                                        height: 30
                                    }} />
                                </View>
                            )
                        })}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}
