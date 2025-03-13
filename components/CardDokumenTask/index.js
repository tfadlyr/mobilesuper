import React from 'react'
import { FlatList, Text } from 'react-native'
import { View } from 'react-native'
import { COLORS, FONTSIZE } from '../../config/SuperAppps'
import { Image } from 'react-native'

const data = [
    {
        image: require('../../assets/superApp/pdf.png'),
        file: 'Business Agility with Scrum',
        size: '8 MB'
    },
    {
        image: require('../../assets/superApp/word.png'),
        file: 'Business Agility with Scrum',
        size: '8 MB'
    },
    {
        image: require('../../assets/superApp/ppt.png'),
        file: 'Business Agility with Scrum',
        size: '8 MB'
    },
    {
        image: require('../../assets/superApp/excel.png'),
        file: 'Business Agility with Scrum',
        size: '8 MB'
    },
]

export const CardDokumen = ({ image, file, size }) => {
    return (
        <View style={{ backgroundColor: COLORS.white, width: 164, borderRadius: 8, marginHorizontal: 10, marginBottom: 10 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                <Image source={image} />
            </View>
            <View style={{ marginVertical: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: FONTSIZE.H4 }}>{file}</Text>
                <Text style={{ fontSize: FONTSIZE.H5, marginTop: 10, color: COLORS.lighter }}>{size}</Text>
            </View>
        </View>
    )
}

export const CardDokumenTask = ({ taskDetail }) => {
    return (
        <View>
            <FlatList
                key={'#'}
                data={taskDetail[0].lampiranDokumen}
                renderItem={({ item }) => <CardDokumen
                    image={item.image}
                    file={item.file}
                    size={item.size}
                />
                }
                scrollEnabled={false}
                numColumns={2}
                keyExtractor={item => "#" + item.id}
            />
        </View>
    )
}
