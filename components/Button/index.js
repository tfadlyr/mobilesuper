import { useFonts } from 'expo-font';
import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

export const Button = ({ title, onClick, style, icon, textColor }) => {
    return (
        <Pressable
            style={[styles.button, style]}
            onPress={onClick}
        >
            {icon ? (
                <Ionicons name={icon} size={24} color={'#DA6317'} />
            ) : (
                <Text style={{ color: textColor, fontSize: 18 }}>{title}</Text>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 16,
        backgroundColor: "white",
        paddingVertical: 12,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

