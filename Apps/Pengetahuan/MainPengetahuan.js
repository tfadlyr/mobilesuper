import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect } from 'react'
import { BottomTabsDetailTask, BottomTabsPengetahuan } from '../../utils/menutab'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useDispatch } from 'react-redux'
import { setTaskDetail } from '../../store/Task'
import { AVATAR, COLORS } from '../../config/SuperAppps'
import { setPenilaian } from '../../store/Pengetahuan'
import { Host } from 'react-native-portalize'
import { GestureHandlerRootView } from 'react-native-gesture-handler'


export default function MainPengetahuan() {

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Host>
                <BottomSheetModalProvider>
                    <BottomTabsPengetahuan />
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