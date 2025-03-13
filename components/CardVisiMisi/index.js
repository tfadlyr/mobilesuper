import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Text } from 'react-native'
import { View } from 'react-native'
import { COLORS, FONTSIZE } from '../../config/SuperAppps'
import { StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native'

export const CardVisiMisi = ({ setModalVisibleVisiMisi }) => {
    return (
        <View style={styles.cardBack}>
            <View style={styles.CardMidle}>
                <TouchableOpacity style={styles.cardFront} onPress={() => setModalVisibleVisiMisi(true)}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'row', gap: 20 }}>
                        <Ionicons name='information-circle-outline' size={24} color={COLORS.white} />
                        <Text style={{ color: COLORS.white }}>VISI & MISI</Text>
                        <Image source={require('../../assets/superApp/logoKecil.png')} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    cardBack: {
        height: 128,
        width: '90%',
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        marginHorizontal: 15,
        marginVertical: 20,
        //shadow ios
        shadowOffset: { width: -2, height: 4 },
        shadowColor: '#171717',
        shadowOpacity: 0.2,
        //shadow android
        elevation: 5
    },
    CardMidle: {
        height: 120,
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        position: 'absolute',
        bottom: 0
    },
    cardFront: {
        backgroundColor: COLORS.primary,
        width: '90%',
        height: 64,
        marginHorizontal: 15,
        marginVertical: 30,
        borderTopLeftRadius: 16,
        borderBottomRightRadius: 16
    }
})
