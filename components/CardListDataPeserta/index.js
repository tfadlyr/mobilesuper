import { useDispatch } from "react-redux";
import { setAddressbookSelected } from "../../store/AddressbookKKP";
import { View } from "react-native";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export const CardListDataPeserta = ({ item, addressbook, persetaSubAgenda = false, setPilihanPeserta }) => {
    const dispatch = useDispatch()
    const deleteItem = (id, state) => {
        let data;
        let datas = persetaSubAgenda ? addressbook : addressbook.selected
        if (state === "jabatan") {
            data = datas.filter(data => {
                let nip = data.nip || data.officer.official?.split('/')[1]
                return nip !== id
            })
            if (persetaSubAgenda) {
                setPilihanPeserta(data)
            } else {
                dispatch(setAddressbookSelected(data))
            }
        } else {
            data = datas.filter(data => data.nip !== id)
            if (persetaSubAgenda) {
                setPilihanPeserta(data)
            } else {
                dispatch(setAddressbookSelected(data))
            }
        }
    }
    return (
        <View key={item.nip || item.id}>
            {
                item.code !== undefined || (item.title !== undefined && item.title.name !== '') ? (
                    <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', marginTop: 10, marginHorizontal: '5%', gap: 10 }}>
                        <Text>-</Text>
                        <Text style={{ width: '80%' }}>{item.nama !== undefined ? item.nama : item.title}</Text>
                        <TouchableOpacity onPress={() => {
                            deleteItem(item.nip || item.officer.official?.split('/')[1], 'jabatan')
                        }}>
                            <Ionicons name='trash-outline' size={24} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', marginTop: 10, marginHorizontal: '5%', gap: 10 }}>
                        <Text>-</Text>
                        <Text style={{ width: '80%' }}>{item.nama || item.fullname}</Text>
                        <TouchableOpacity onPress={() => {
                            deleteItem(item.nip, 'pegawai')
                        }}>
                            <Ionicons name='trash-outline' size={24} />
                        </TouchableOpacity>
                    </View>
                )
            }
        </View>
    )
}