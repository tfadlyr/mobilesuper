import React from 'react'
import { Image } from 'react-native'
import { View } from 'react-native'
import { COLORS } from '../../config/SuperAppps'

const ListEmpty = () => {
    return (
        <View style={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* <View style={{ 
                backgroundColor: COLORS.white, 
                padding: 20, 
                borderRadius: 8,
                //shadow ios
                    shadowOffset: { width: -2, height: 4 },
                    shadowColor: "#171717",
                    shadowOpacity: 0.2,
                    //shadow android
                    elevation: 2,
            }}> */}
                <Image source={require("../../assets/superApp/ListEmptyLogo.png")} style={{ width: 200, height: 200 }} />
            </View>
        // </View>
    )
}

export default ListEmpty