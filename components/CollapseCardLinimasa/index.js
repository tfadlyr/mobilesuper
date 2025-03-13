import { Ionicons } from '@expo/vector-icons'
import React, { useRef, useState } from 'react'
import { StyleSheet, TextInput, View, Text, Touchable, Image } from 'react-native'
import {
    Collapse,
    CollapseHeader,
    CollapseBody,
    AccordionList
} from 'accordion-collapse-react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { COLORS, FONTSIZE, FONTWEIGHT } from '../../config/SuperAppps'


export const CollapseCardLinimasa = ({ linimasa }) => {
    const [collapse, setCollapse] = useState(false)
    return (
        <View>
            <Collapse>
                <CollapseHeader>
                    <TouchableOpacity onPress={() => setCollapse(!collapse)}>
                        <View style={styles.card} >
                            <View style={{
                                backgroundColor: collapse === true ? COLORS.secondaryLighter : COLORS.white,
                                paddingHorizontal: 20,
                                paddingVertical: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 10,
                                borderBottomLeftRadius: collapse === true ? 0 : 8,
                                borderBottomRightRadius: collapse === true ? 0 : 8,
                            }}>
                                <Ionicons name='school-outline' size={24} />
                                <Text style={{ fontWeight: FONTWEIGHT.bold }}>Linimasa Pengetahuan</Text>
                                <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }}>
                                    {collapse === true ?
                                        <Ionicons name='chevron-up-outline' size={20} />
                                        :
                                        <Ionicons name='chevron-down-outline' size={20} />}

                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </CollapseHeader>
                <CollapseBody>
                    {linimasa?.map((data, index) => {
                        return (
                            <View key={index} style={[styles.cardCollapse, { justifyContent: 'center', alignItems: 'center' }]}>
                                <View style={{ flexDirection: 'row', marginVertical: 20, marginLeft: 30 }}>
                                    <Image source={data.image} style={{ width: 80, height: 80 }} />
                                    <View style={{ marginLeft: 10 }}>
                                        <View style={{ width: '90%' }}>
                                            <Text style={{ fontSize: FONTSIZE.H2, fontWeight: FONTWEIGHT.bold }}>{data.judul}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 10 }}>
                                            <View style={{
                                                flexDirection: 'row',
                                                gap: 5,
                                                backgroundColor: data.jenis === 'Penelitian' ? COLORS.warningLight : data.jenis === 'Kegiatan' ? COLORS.infoLight : COLORS.successLight,
                                                borderRadius: 30,
                                                height: 30,
                                                width: 90,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>

                                                {data.jenis === 'Penelitian' ? (
                                                    <Ionicons name='document-outline' color={'#F6AD1D'} style={{ marginTop: 2 }} />
                                                ) : data.jenis === 'Kegiatan' ? (
                                                    <Ionicons name='analytics-outline' color={'#1868AB'} style={{ marginTop: 3 }} />
                                                ) : (
                                                    <Ionicons name='videocam-outline' color={'#11C15B'} style={{ marginTop: 2 }} />
                                                )}
                                                <Text style={{ color: data.jenis === 'Penelitian' ? COLORS.warning : data.jenis === 'Kegiatan' ? COLORS.info : COLORS.success }}>{data.jenis}</Text>
                                            </View>

                                            {/* <Divider bold style={{ transform: [{ rotate: '90deg' }], width: 5 }} /> */}
                                            <Text style={{ fontSize: 11, color: COLORS.lighter }}>| {data.nama}</Text>

                                        </View>
                                    </View>
                                </View >
                            </View>
                        )
                    })}
                </CollapseBody>
            </Collapse>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        width: 362
    },
    cardCollapse: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        width: 362,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    }
})
