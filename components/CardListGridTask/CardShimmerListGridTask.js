import { LinearGradient } from 'expo-linear-gradient'
import { createShimmerPlaceHolder } from 'expo-shimmer-placeholder'
import React from 'react'
import { Text } from 'react-native'
import { View } from 'react-native'
import { COLORS } from '../../config/SuperAppps'

export const CardShimmerListGridTask = () => {
    const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient)

    const renderMember = () => {
        const arr = []
        for (let i = 0; i <= 3; i++) {
            arr.push(
                <View key={i}>
                    <ShimmerPlaceHolder style={{ borderWidth: 2, borderColor: COLORS.white, borderRadius: 100, marginLeft: i === 0 ? 0 : -8, }} width={30} height={30} />
                </View>
            )
        }
        return arr
    }

    return (
        <View
            style={{
                width: 174,
                flex: 1,
                height: 150,
                backgroundColor: COLORS.white,
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
                <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={150} height={15} />
            </View>
            <View style={{ flexDirection: 'row' }}>
                <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={100} height={15} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={70} height={15} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ flexDirection: 'row', position: 'relative', display: 'flex', alignItems: 'center', }}>
                    {
                        renderMember()
                    }
                </View>
            </View>
        </View>
    )
}
