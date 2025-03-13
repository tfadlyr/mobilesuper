import React from 'react'
import { Image } from 'react-native'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { COLORS, FONTSIZE, FONTWEIGHT } from '../../config/SuperAppps'
import { Text } from 'react-native'

export const CardSuka = ({ item }) => {
    return (
        <View key={item.name} style={{ flexDirection: 'row', gap: 10, marginHorizontal: 20, alignItems: 'center', marginTop: 20 }}>
            <Image source={{ uri: item.avatar_url }} style={{ width: 30, height: 30, borderRadius: 20 }} />
            <View>
                <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter }}>{item.name}</Text>
            </View>
        </View>
    )
}
