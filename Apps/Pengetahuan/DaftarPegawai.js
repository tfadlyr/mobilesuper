import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Image, ScrollView, StyleSheet, TouchableOpacity, View, Text, TextInput, KeyboardAvoidingView } from 'react-native'
import { COLORS, FONTSIZE, FONTWEIGHT } from '../../config/SuperAppps'
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from '../../components/DropDown';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Search } from '../../components/Search'

import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints
} from '@gorhom/bottom-sheet'
import { TopsRangkumanIKU } from '../../utils/menutab';

const tahun = [
  { key: '1', value: '2023' },
  { key: '2', value: '2021' },
  { key: '3', value: '2020' },
]

const triwulan = [
  { key: '1', value: 'TW 4' },
  { key: '2', value: 'TW 3' },
  { key: '3', value: 'TW 2' },
  { key: '3', value: 'TW 1' },
]

const informationData = [
  {
    name: 'Effin Martiana',
    position: 'Kepala Biro Hukum',
    jabatanInfo: '1',
  },
];

const informationData2 = [
  {
    name: 'Danielle Mahartika',
    position: 'Kepala Biro Hukum',
    jabatanInfo: '4',
  },
];

export const DaftarPegawai = () => {

  const initialSnapPoints = useMemo(() => ["50%", "90%"], [])
  const initialSnapPointsTambah = useMemo(() => ["CONTENT_HEIGHT"], [])
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPointsTambah)

  const bottomSheetModalRef = useRef(null);
  const bottomSheetModalSelectRef = useRef(null);
  const bottomSheetModalAddRef = useRef(null);

  const bottomSheetAttach = () => {
    bottomSheetModalRef.current?.present()
  }

  const [choiceTipe, setChoiceTipe] = useState({ key: '1', value: 'Dashboard' })
  const [choiceKategori, setChoiceKategori] = useState('')
  const [choiceList, setChoiceList] = useState('')
  const [dataKategori, setDataKategori] = useState([])
  const [dataList, setDataList] = useState([])

  const [choiceFilter, setChoiceFilter] = useState('semua')


  const bottomSheetAttachClose = () => {
    if (bottomSheetModalRef.current)
      bottomSheetModalRef.current?.close()
  }

  const bottomSheetAttachSelect = () => {
    bottomSheetModalSelectRef.current?.present()
  }

  const filter = (event) => {
    setSearch(event)
  }

  return (
    <ScrollView>
      <View  style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', backgroundColor: COLORS.primary, height: 80, paddingBottom: 20 }}>
        <View style={{
          backgroundColor: COLORS.white,
          borderRadius: 20,
          width: 28,
          height: 28,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 20
        }}>
          <TouchableOpacity style={{}} onPress={() => navigation.navigate("Home")}>
            <Ionicons name='chevron-back-outline' size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, alignItems: 'center', marginRight: 50 }}>
          <Text style={{ fontSize: 15, fontWeight: 600, color: COLORS.white }}>Rangkuman IKU</Text>
        </View>
      </View>

      <TopsRangkumanIKU />

      <View style={{ flexDirection: 'row', gap: 5, marginHorizontal: 15, width: '100%' }}>
        <TouchableOpacity onPress={bottomSheetAttachSelect} style={{ width: '80%' }}>
          <View style={{ backgroundColor: COLORS.white, marginVertical: 20, height: 54, justifyContent: 'center', borderRadius: 8 }}>
            <Text style={{ marginLeft: 20, color: COLORS.lighter }}>Pilih</Text>
          </View>
        </TouchableOpacity>

        <BottomSheetModal
          ref={bottomSheetModalSelectRef}
          snapPoints={initialSnapPoints}
          handleHeight={animatedHandleHeight}
          contentHeight={animatedContentHeight}
          index={0}
          style={{ borderRadius: 50 }}
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjust"
          backdropComponent={({ style }) => (
            <View style={[style, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />
          )}
        >
          <BottomSheetView onLayout={handleContentLayout} >
            <View style={{ flex: 1 }}>
              <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <Text style={{ fontSize: FONTSIZE.H1, fontWeight: 500 }}>Pilih</Text>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "center", gap: 26, paddingBottom: 15 }}>
                <View style={{ width: '40%' }}>
                  <Dropdown
                    placeHolder={'Pilih Tahun'}
                    borderWidth={1}
                    data={tahun}
                    // selected={choiceTipe}
                    setSelected={setChoiceTipe}
                    borderColor={COLORS.ExtraDivinder}
                    borderwidthDrop={1}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderWidthValue={1}
                    borderColorValue={COLORS.ExtraDivinder}
                  />
                </View>

                <View style={{ width: '40%' }}>
                  <Dropdown
                    placeHolder={'Pilih Triwulan'}
                    borderWidth={1}
                    data={triwulan}
                    // selected={choiceTipe}
                    setSelected={setChoiceTipe}
                    borderColor={COLORS.ExtraDivinder}
                    borderwidthDrop={1}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderWidthValue={1}
                    borderColorValue={COLORS.ExtraDivinder}
                  />
                </View>
              </View>

              <View style={{ width: '94%', paddingLeft: 25 }}>
                <Dropdown
                  placeHolder={'Pilih Unit Kerja'}
                  borderWidth={1}
                  data={tahun}
                  // selected={choiceTipe}
                  setSelected={setChoiceTipe}
                  borderColor={COLORS.ExtraDivinder}
                  borderwidthDrop={1}
                  borderColorDrop={COLORS.ExtraDivinder}
                  borderWidthValue={1}
                  borderColorValue={COLORS.ExtraDivinder}
                />
              </View>

              {
                choiceTipe.key === '3' || choiceTipe.key === '4' || choiceTipe.key === '5' ? (
                  <>

                  </>
                ) : null
              }

              <TouchableOpacity style={{
                width: '90%',
                backgroundColor: COLORS.primary,
                height: 50,
                marginVertical: 40,
                borderRadius: 6,
                alignItems: 'center',
                marginHorizontal: 20,
                justifyContent: 'center'
              }}
                onPress={() => {
                  bottomSheetSelectClose()
                  handleChoiceSubmit()
                }}
              >
                <Text style={{ color: COLORS.white, fontSize: FONTSIZE.H1, fontWeight: 500 }}>Simpan</Text>
              </TouchableOpacity>

            </View>
          </BottomSheetView>
        </BottomSheetModal>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={animatedSnapPoints}
          handleHeight={animatedHandleHeight}
          contentHeight={animatedContentHeight}
          index={0}
          style={{ borderRadius: 50 }}
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjust"
          backdropComponent={({ style }) => (
            <View style={[style, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />
          )}
        >
          <BottomSheetView onLayout={handleContentLayout} >
            <View style={{ marginHorizontal: 20 }}>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <View style={{ flex: 1, backgroundColor: '#F0F0F0', borderRadius: 8, borderColor: COLORS.white, }}>
                  <Search
                    placeholder={"Cari"}
                    iconColor={COLORS.primary}
                    onSearch={filter}
                  />
                </View>
                <TouchableOpacity style={{ justifyContent: 'center' }}
                  onPress={() => {
                    bottomSheetAttachClose()
                  }}
                >
                  <Text style={{ fontSize: FONTSIZE.H1, color: COLORS.infoDanger, fontWeight: 500 }}>Batal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>

        <TouchableOpacity onPress={bottomSheetAttach} style={{ width: "11%" }}>
          <View style={{ backgroundColor: COLORS.white, marginVertical: 20, height: 54, justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}>
            {/* <Text style={{ marginLeft: 20, color: COLORS.lighter }}>Pilih Project</Text> */}
            <Ionicons name='search-outline' size={24} color={COLORS.primary} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ marginHorizontal: 15, flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>*) Nilai Minimum = 3</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 50, padding: 5 }}>
            <Icon name="get-app" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 50, padding: 5 }}>
              <Icon name="menu" size={24} color="black" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ gap: 15 }}>
        <View style={{ marginHorizontal: 15, marginTop: 15 }}>
          {informationData.map((item, index) => {
            const numericValue = parseInt(item.jabatanInfo.match(/\d+/)[0]);

            const status = numericValue < 3 ? 'Tidak Memenuhi' : 'Memenuhi';

            return (
              <TouchableOpacity
                key={index}
                style={{ backgroundColor: COLORS.white, borderRadius: 10, padding: 10, gap: 5 }}
              >
                <Text style={{ fontSize: FONTSIZE.H1, fontWeight: FONTWEIGHT.bold }}>{item.name}</Text>
                <Text>Jabatan: {item.position}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: COLORS.lighter }}>Nilai Saat Ini: {item.jabatanInfo}</Text>
                  <View style={{ backgroundColor: status === 'Tidak Memenuhi' ? '#EA5455' : 'green', borderRadius: 10, padding: 3, paddingHorizontal: 10 }}>
                    <Text style={{ color: 'white' }}>{status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ marginHorizontal: 15 }}>
          {informationData2.map((item, index) => {
            const numericValue = parseInt(item.jabatanInfo.match(/\d+/)[0]);

            const status = numericValue < 3 ? 'Tidak Memenuhi' : 'Memenuhi';

            return (
              <TouchableOpacity
                key={index}
                style={{ backgroundColor: COLORS.white, borderRadius: 10, padding: 10, gap: 5 }}
              >
                <Text style={{ fontSize: FONTSIZE.H1, fontWeight: FONTWEIGHT.bold }}>{item.name}</Text>
                <Text>Jabatan: {item.position}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: COLORS.lighter }}>Nilai Saat Ini: {item.jabatanInfo}</Text>
                  <View style={{ backgroundColor: status === 'Tidak Memenuhi' ? '#EA5455' : 'green', borderRadius: 10, padding: 3, paddingHorizontal: 10 }}>
                    <Text style={{ color: 'white' }}>{status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>


    </View >
    </ScrollView >
  );
};

