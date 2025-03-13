import { LinearGradient } from 'expo-linear-gradient'
import { createShimmerPlaceHolder } from 'expo-shimmer-placeholder'
import React from 'react'
import { View } from 'react-native'
import { COLORS } from '../../config/SuperAppps'
import { Text } from 'react-native'

export const CardShimmerListTask = () => {
    const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient)
    return (
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
            <View style={{ marginVertical: 10, marginLeft: 10 }}>
                <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={250} height={15} />
            </View>
            <View style={{ marginBottom: 10, marginLeft: 10, display: 'flex', flexDirection: 'row', gap: 2 }}>
                <Text>Target Tanggal: </Text>
                <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={100} height={15} />
            </View>
        </View>
    )
}
