import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect } from 'react'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { Host } from 'react-native-portalize'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomTabsOutgoingKorespondensi } from '../../../../utils/menutab'


export default function MainOutgoingDetail() {

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Host>
                <BottomSheetModalProvider>
                    <BottomTabsOutgoingKorespondensi />
                </BottomSheetModalProvider>
            </Host>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 70,
        left: 150
    }
})