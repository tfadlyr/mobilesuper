import React from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { StyleSheet } from 'react-native'


export const ScannerBarCode = ({ scanData, setScanData }) => {
    const handleBarCodeScanned = ({ type, data }) => {
        setScanData(true)
    }

    return (
        <BarCodeScanner
            onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
        />
    )
}
