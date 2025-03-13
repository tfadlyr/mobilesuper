import React, { useState } from 'react'
import { Image, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../config/SuperAppps';
import { TouchableOpacity } from 'react-native';


export const CardPilihMember = ({ nama, avatar, id, handleClickItem, filter }) => {
    const [cekBadge, setCekBadege] = useState('')

    const handleBadge = () => {
        if (cekBadge === "") {
            setCekBadege(id)
            handleClickItem(id, true)
        } else {
            setCekBadege("")
            handleClickItem(id, false)
        }
    }
    return (
        <View>
            <TouchableOpacity onPress={handleBadge}>
                <View style={{ flexDirection: filter ? 'column' : 'row', gap: 10, marginVertical: 8, marginHorizontal: 20, alignItems: 'center' }}>
                    <View style={{ position: 'relative' }}>
                        <Image source={avatar} style={{ width: 28, height: 28 }} />
                        {cekBadge === id ? (
                            <View style={{ position: 'absolute', bottom: 0, right: -5, borderRadius: '100', backgroundColor: COLORS.success }}>
                                <Ionicons name='checkmark-outline' size={12} color={COLORS.white} />
                            </View>
                        ) : (
                            <></>
                        )}
                    </View>
                    <Text>{nama}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}
