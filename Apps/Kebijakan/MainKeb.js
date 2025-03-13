import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { BottomTabsKeb } from '../../utils/menutab'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getCategory } from '../../service/api'

export default function MainKeb() {
    return (
        <BottomSheetModalProvider>
            <BottomTabsKeb />
        </BottomSheetModalProvider>
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