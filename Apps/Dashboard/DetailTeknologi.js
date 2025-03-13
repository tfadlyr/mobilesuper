import React from 'react'
import { TouchableOpacity } from 'react-native'
import { View } from 'react-native'
import { Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../config/SuperAppps'
import { StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Image } from 'react-native'
import { ScrollView } from 'react-native'


export const DetailTeknologi = ({ route }) => {
    const { item } = route.params
    const navigation = useNavigation()
    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ backgroundColor: COLORS.primary, height: '10%', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View style={[styles.backIcon, { justifyContent: 'center', alignItems: 'center', marginTop: 25, marginLeft: 20 }]}>
                            <Ionicons name='chevron-back' size={24} color={COLORS.primary} />
                        </View>
                    </TouchableOpacity>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 40 }}>
                        <Text style={{ color: 'white', fontSize: 15, fontWeight: 600 }}></Text>
                    </View>
                </View>

                <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 40 }}>
                    <Image source={item.image} />
                    <Image source={item.imagedetail} />
                </View>
            </ScrollView>
        </View >
    )
}
const styles = StyleSheet.create({
    backIcon: {
        backgroundColor: 'white',
        height: 28,
        width: 28,
        borderRadius: 50,
    },
    imageIos: {
        height: 193, width: 350, borderRadius: 16
    },
    imageAndroid: {
        height: 193, width: 369, borderRadius: 16
    },
})
