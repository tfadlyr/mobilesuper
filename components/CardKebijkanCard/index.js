import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import { Divider } from 'react-native-paper';
import { COLORS } from '../../config/SuperAppps';

export const CardKebijakanCard = ({ subjek, bentuk, id_peraturan, item, route, nomor, tahun, tgl_penetapan, tgl_diundangkan, status }) => {
    const navigation = useNavigation()
    return (
        <View key={id_peraturan}>
            <TouchableOpacity onPress={() => navigation.navigate('DetailDashboard', {
                data: item
            })}>
                <View style={styles.card}>
                    <Text style={styles.nama}>{bentuk}</Text>
                    <Text style={styles.deskripsi}>{subjek}</Text>
                    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                        <Divider bold style={{ width: '95%' }} />
                    </View>
                    <Text style={styles.deskripsiTgl}>No. {nomor} / {tahun}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Text style={styles.deskripsiTgl}>Ditetapkan: </Text>
                        <Text style={styles.deskripsiTgl}>{tgl_penetapan}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 5 }}>
                        <Text style={styles.deskripsiTgl}>Diundangkan: </Text>
                        <Text style={styles.deskripsiTgl}>{tgl_diundangkan}</Text>
                    </View>
                    <View style={[
                        styles.status,
                        {
                            backgroundColor: status === 'Berlaku' ? COLORS.infoDangerLight : COLORS.successLight,
                            width: status === 'Berlaku' ? '20%' : '31%',
                        }
                    ]}>
                        <Text style={{ color: status === 'Berlaku' ? COLORS.infoDanger : COLORS.success, paddingVertical: 3 }}>{status}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    nama: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'left',
        paddingLeft: 10,
        paddingTop: 10
    },
    deskripsi: {
        color: 'grey',
        fontSize: 15,
        marginTop: 10,
        fontWeight: '600',
        paddingLeft: 10,
    },
    deskripsiTgl: {
        color: 'grey',
        fontSize: 14,
        fontWeight: '4000',
        paddingLeft: 10,
    },
    tanggal: {
        fontSize: 14,
        color: 'grey',
        marginTop: 10
    },
    card: {
        backgroundColor: "grey",
        flex: 1,
        width: '95%',
        height: '90%',
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#959CA9',
    },
    status: {
        marginLeft: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30
    }
})