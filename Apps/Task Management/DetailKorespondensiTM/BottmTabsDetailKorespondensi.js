import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { COLORS, FONTSIZE, FONTWEIGHT } from '../../../config/SuperAppps';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetBackdrop,
    BottomSheetView,
    BottomSheetTextInput,
    useBottomSheetDynamicSnapPoints
} from '@gorhom/bottom-sheet';
import { useMemo } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { } from 'react-native';


function MyTabBarDetailKorespondensi({ props, navigation }) {
    const [tabItemIndex, setTabItemIndex] = useState(1);
    const bottomSheetModalAddRef = useRef(null);

    const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], [])
    const {
        animatedHandleHeight,
        animatedSnapPoints,
        animatedContentHeight,
        handleContentLayout,
    } = useBottomSheetDynamicSnapPoints(initialSnapPoints)

    const bottomSheetAdd = () => {
        bottomSheetModalAddRef.current?.present()
    }

    return (
        < >
            <BottomSheetModalProvider>
                <View style={{ flexDirection: 'row', height: 68, backgroundColor: COLORS.white, justifyContent: 'space-around', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                    <TouchableOpacity
                        key={1}
                        onPress={() => {
                            setTabItemIndex(1)
                            navigation.navigate('DetailKorespondensi', { unread: false })
                            // props.navigation.navigate('Home', { unread: false })
                        }}>
                        {tabItemIndex === 1 ? (
                            <View style={{
                                alignItems: 'center',
                                height: 65,
                                justifyContent: 'center',
                                width: 80,
                            }}>

                                <View style={{
                                    width: '100%',
                                    height: 3,
                                    backgroundColor: COLORS.primary,
                                    position: 'absolute',
                                    top: 0,
                                    //shadow ios
                                    shadowOffset: { width: -2, height: 5 },
                                    shadowColor: COLORS.primary,
                                    shadowOpacity: 0.4,
                                    //shadow android
                                    elevation: 2,
                                }} />
                                <Ionicons name='information-circle-outline' color={COLORS.primary} size={24} />
                                <Text style={{ color: COLORS.primary }}>Detail</Text>
                            </View>
                        ) : (
                            <View style={{
                                alignItems: 'center',
                                height: 65,
                                justifyContent: 'center',
                                width: 80,
                            }}>
                                <Ionicons name='information-circle-outline' color={COLORS.grey} size={24} />
                                <Text style={{ color: COLORS.grey }}>Detail</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                        key={2}
                        onPress={() => {
                            setTabItemIndex(2)
                            navigation.navigate('LampiranTask', { unread: false })
                            // props.navigation.navigate('Home', { unread: false })
                        }}>
                        {tabItemIndex === 2 ? (
                            <View style={{
                                alignItems: 'center',
                                height: 65,
                                justifyContent: 'center',
                                width: 80,
                            }}>

                                <View style={{
                                    width: '100%',
                                    height: 3,
                                    backgroundColor: COLORS.primary,
                                    position: 'absolute',
                                    top: 0,
                                    //shadow ios
                                    shadowOffset: { width: -2, height: 5 },
                                    shadowColor: COLORS.primary,
                                    shadowOpacity: 0.4,
                                    //shadow android
                                    elevation: 2,
                                }} />
                                <Ionicons name='attach-outline' color={COLORS.primary} size={24} />
                                <Text style={{ color: COLORS.primary }}>Lampiran</Text>
                            </View>
                        ) : (
                            <View style={{
                                alignItems: 'center',
                                height: 65,
                                justifyContent: 'center',
                                width: 80,
                            }}>
                                <Ionicons name='attach-outline' color={COLORS.grey} size={24} />
                                <Text style={{ color: COLORS.grey }}>Lampiran</Text>
                            </View>
                        )}
                    </TouchableOpacity> */}
                </View>
            </BottomSheetModalProvider>
        </ >
    )
}


const styles = StyleSheet.create({

})
export default MyTabBarDetailKorespondensi