import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import React from 'react'
import { BottomTabsDetailAgenda } from '../../utils/menutab'
import { Host } from 'react-native-portalize'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export const MainDetailAgenda = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Host>
                <BottomSheetModalProvider>
                    <BottomTabsDetailAgenda />
                </BottomSheetModalProvider>
            </Host>
        </GestureHandlerRootView>
    )
}
