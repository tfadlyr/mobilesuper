import React from 'react'
import { Image, Text, View } from 'react-native'

export const KRT = () => {
    return (
        <View style={{ marginVertical: 20, marginHorizontal: 20, }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginVertical: 10 }}>
                <View style={{ backgroundColor: 'white', height: 64, width: 64, borderRadius: 40 }}>
                    <Image source={require('../../assets/superApp/Tp1.png')} style={{ alignItems: 'center', justifyContent: 'center', flex: 1, right: 7, top: 5 }} />
                </View>
                <Text>Semar</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginVertical: 10 }}>
                <View style={{ backgroundColor: 'white', height: 64, width: 64, borderRadius: 40 }}>
                    <Image source={require('../../assets/superApp/Tp2.png')} style={{ alignItems: 'center', justifyContent: 'center', flex: 1, right: 7, top: 5 }} />
                </View>
                <Text>Sistolik</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginVertical: 10 }}>
                <View style={{ backgroundColor: 'white', height: 64, width: 64, borderRadius: 40 }}>
                    <Image source={require('../../assets/superApp/Tp3.png')} style={{ alignItems: 'center', justifyContent: 'center', flex: 1, right: 7, top: 5 }} />
                </View>
                <Text>Bus Jemputan</Text>
            </View>
        </View>
    )
}
