import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect } from 'react'
import { BottomTabsDetailTask } from '../../../utils/menutab'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useDispatch } from 'react-redux'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Host } from 'react-native-portalize'
import { getDetailTaskTM } from '../../../service/api'
import { getTokenValue } from '../../../service/session'
import { useState } from 'react'

export default function MainDetailTask({ route }) {
    const { id } = route.params
    const dispatch = useDispatch()
    const [token, setToken] = useState("");

    useEffect(() => {
        getTokenValue().then((val) => {
            setToken(val);
        });
    }, [id]);

    useEffect(() => {
        dispatch(getDetailTaskTM({ token: token, id_task: id }))
    }, [token]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Host>
                <BottomSheetModalProvider>
                    <BottomTabsDetailTask />
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