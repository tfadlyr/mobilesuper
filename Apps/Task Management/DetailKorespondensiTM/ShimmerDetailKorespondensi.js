import { LinearGradient } from 'expo-linear-gradient'
import { createShimmerPlaceHolder } from 'expo-shimmer-placeholder'
import React from 'react'
import { View } from 'react-native'
import { COLORS, FONTSIZE } from '../../../config/SuperAppps'
import { Text } from 'react-native'

export const ShimmerDetailKorespondensi = () => {
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
        <View style={{ backgroundColor: COLORS.white, marginHorizontal: 20, marginBottom: 20, borderRadius: 8 }}>
            <View style={{ marginHorizontal: 20, marginVertical: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <View style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={200} height={18} />
                    <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={250} height={15} />
                </View>

                <View style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter, width: '40%' }}>Target Tanggal</Text>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter }}>: </Text>
                            <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={100} height={15} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter, width: '40%' }}>Prioritas</Text>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter }}>: </Text>
                            <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={100} height={15} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter, width: '40%' }}>Penanggung Jawab</Text>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter }}>: </Text>
                            {
                                renderMember()
                            }
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter, width: '40%' }}>Pembuat Project</Text>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter }}>: </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <ShimmerPlaceHolder style={{ borderWidth: 2, borderColor: COLORS.white, borderRadius: 100 }} width={30} height={30} />
                                <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={100} height={15} />
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter, width: '40%' }}>Pembuat Tugas</Text>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter }}>: </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <ShimmerPlaceHolder style={{ borderWidth: 2, borderColor: COLORS.white, borderRadius: 100 }} width={30} height={30} />
                                <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={100} height={15} />
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter, width: '40%' }}>Project PIC</Text>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter }}>: </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <ShimmerPlaceHolder style={{ borderWidth: 2, borderColor: COLORS.white, borderRadius: 100 }} width={30} height={30} />
                                <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={100} height={15} />
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter, width: '40%' }}>Pengingat</Text>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: FONTSIZE.H4, color: COLORS.lighter }}>: </Text>
                            <ShimmerPlaceHolder style={{ borderRadius: 4 }} width={100} height={15} />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}
