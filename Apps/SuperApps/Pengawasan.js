import React from 'react'
import { Text, View } from 'react-native'

export const Pengawasan = () => {
    return (
        <View style={{ marginVertical: 20, marginHorizontal: 20, }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginVertical: 10 }}>
                <View style={{ backgroundColor: 'white', height: 64, width: 64, borderRadius: 40 }}></View>
                <Text>Lapor.go.id</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginVertical: 10 }}>
                <View style={{ backgroundColor: 'white', height: 64, width: 64, borderRadius: 40 }}></View>
                <Text>WBS KKP</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginVertical: 10 }}>
                <View style={{ backgroundColor: 'white', height: 64, width: 64, borderRadius: 40 }}></View>
                <Text>Sidak</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginVertical: 10 }}>
                <View style={{ backgroundColor: 'white', height: 64, width: 64, borderRadius: 40 }}></View>
                <Text>JDIH</Text>
            </View>
        </View>
    )
}
