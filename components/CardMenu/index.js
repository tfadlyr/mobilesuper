import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image, } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

export const CardMenu = () => {
    const navigation = useNavigation()
    return (
        <View>
            <View style={{ flexDirection: 'row', gap: 33, backgroundColor: '#F4F7FE', marginVertical: 10, }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <View style={[styles.card, { backgroundColor: '#11C15B', justifyContent: 'center', alignItems: 'center', display: 'flex' }]}>
                        <TouchableOpacity onPress={() => navigation.navigate('Drawer')}>
                            <View>
                                <Image source={require('../../assets/superApp/Vector.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>NDE</Text>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <View style={[styles.card, { backgroundColor: '#2C338D', justifyContent: 'center', alignItems: 'center', display: 'flex' }]}>
                        <TouchableOpacity onPress={() => navigation.navigate('Kebijakan')}>
                            <View>
                                <Image source={require('../../assets/superApp/Vector.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>Policy</Text>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <View style={[styles.card, { backgroundColor: '#0089D3', justifyContent: 'center', alignItems: 'center', display: 'flex' }]}>
                        <TouchableOpacity >
                            <View>
                                <Image source={require('../../assets/superApp/Vector.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>Task</Text>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <View style={[styles.card, { backgroundColor: '#C9D90D', justifyContent: 'center', alignItems: 'center', display: 'flex' }]}>
                        <TouchableOpacity >
                            <View>
                                <Image source={require('../../assets/superApp/Vector.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>Event</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 33, backgroundColor: '#F4F7FE', marginTop: 10 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <View style={[styles.card, { backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center', display: 'flex' }]}>
                        <TouchableOpacity >
                            <View>
                                <Image source={require('../../assets/superApp/Vector.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>Cuti</Text>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <View style={[styles.card, { backgroundColor: '#0089D3', justifyContent: 'center', alignItems: 'center', display: 'flex' }]}>
                        <TouchableOpacity >
                            <View>
                                <Image source={require('../../assets/superApp/Vector.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>MP</Text>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <View style={[styles.card, { backgroundColor: '#2C338D', justifyContent: 'center', alignItems: 'center', display: 'flex' }]}>
                        <TouchableOpacity >
                            <View>
                                <Image source={require('../../assets/superApp/Vector.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>App</Text>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <View style={[styles.card, { backgroundColor: '#11C15B', justifyContent: 'center', alignItems: 'center', display: 'flex' }]}>
                        <TouchableOpacity >
                            <View>
                                <Image source={require('../../assets/superApp/Union.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>More</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: 60,
        height: 60,
        borderRadius: 40,
    },
    profile: {
        fontSize: 15,
        fontWeight: '600',
        marginTop: 8,
        left: 16
    }
})