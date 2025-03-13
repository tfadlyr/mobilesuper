import React from 'react'
import { Text, View } from 'react-native'

export const KPP = () => {
    return (
        <View style={{ marginVertical: 20, marginHorizontal: 20, }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginVertical: 10 }}>
                <View style={{ backgroundColor: 'white', height: 64, width: 64, borderRadius: 40 }}></View>
                <Text>Emonev Bapennas</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginVertical: 10 }}>
                <View style={{ backgroundColor: 'white', height: 64, width: 64, borderRadius: 40 }}></View>
                <Text>KinerjaKu</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginVertical: 10 }}>
                <View style={{ backgroundColor: 'white', height: 64, width: 64, borderRadius: 40 }}></View>
                <Text>E-Milea</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginVertical: 10 }}>
                <View style={{ backgroundColor: 'white', height: 64, width: 64, borderRadius: 40 }}></View>
                <Text>E-Kinerja BKN</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginVertical: 10 }}>
                <View style={{ backgroundColor: 'white', height: 64, width: 64, borderRadius: 40 }}></View>
                <Text>SIASN BKN</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginVertical: 10 }}>
                <View style={{ backgroundColor: 'white', height: 64, width: 64, borderRadius: 40 }}></View>
                <Text>My SAPK</Text>
            </View>
        </View>
    )
}
