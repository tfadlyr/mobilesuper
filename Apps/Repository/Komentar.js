import React, { useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";
import { Image } from "react-native";
import { useState } from "react";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import {} from "react-native-safe-area-context";
import ListEmpty from "../../components/ListEmpty";
import { getTokenValue } from "../../service/session";
import { getDetailDocument, postCommentRepo } from "../../service/api";
import { setRefresh } from "../../store/Repository";

const DaftarKomentar = ({ items, setParentId, device }) => {
  const [toggleComment, setToggleComment] = useState({
    toggle: false,
    id: items.id,
  });
  const handleClickBalas = () => {
    // if (inputRef.current) {
    //   inputRef.current.focus();
    setParentId({ id: items.id, creator: items.creator });
    // }
  };
  const clickBalas = (id, temp) => {
    setToggleComment({
      toggle: temp,
      id: id,
    });
  };

  return (
    <View
      key={items.id}
      style={{
        justifyContent: "center",
        flex: 1,
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 10,
          width: "90%",
          marginVertical: 5,
          shadowColor: "black",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginVertical: 10,
            marginHorizontal: 20,
          }}
        >
          <View>
            <Image
              style={{
                width: device === "tablet" ? 50 : 30,
                height: device === "tablet" ? 50 : 30,
                borderRadius: 50,
              }}
              source={{ uri: items.creator_avatar }}
            />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
                fontWeight: FONTWEIGHT.bold,
                lineHeight: device === "tablet" ? 30 : 20,
                wordWrap: "break-word",
              }}
            >
              {items.creator}
            </Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text
                style={{
                  color: COLORS.lighter,
                  fontSize: fontSizeResponsive("H5", device),
                  fontWeight: FONTWEIGHT.normal,
                  lineHeight: device === "tablet" ? 30 : 18,
                  marginBottom: 10,
                  wordWrap: "break-word",
                }}
              >
                {items.created_at}
              </Text>
            </View>
            <Text
              style={{
                color: COLORS.lighter,
                fontSize: fontSizeResponsive("H5", device),
                fontWeight: FONTWEIGHT.normal,
                lineHeight: device === "tablet" ? 30 : 18,
                wordWrap: "break-word",
              }}
            >
              {items.message}
            </Text>
            <TouchableOpacity
              style={{
                color: COLORS.lighter,
                fontSize: FONTSIZE.H3,
                fontWeight: FONTWEIGHT.normal,
                wordWrap: "break-word",
                marginTop: 10,
              }}
              onPress={() => {
                handleClickBalas();
              }}
            >
              <Text
                style={{
                  color: COLORS.primary,
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Balas
              </Text>
            </TouchableOpacity>
            {items.children?.length === 0 ? null : (
              <View>
                {(!toggleComment.toggle && toggleComment.id === items.id) ||
                (toggleComment.id !== items.id && items.children > 0) ? (
                  <TouchableOpacity
                    key={items.id}
                    onPress={() => clickBalas(items.id, true)}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                        marginTop: 10,
                      }}
                    >
                      <View
                        style={{
                          height: 1,
                          width: 20,
                          backgroundColor: "#DBDADE",
                        }}
                      />
                      <Text
                        style={{
                          color: COLORS.lighter,
                          fontSize: fontSizeResponsive("H5", device),
                          fontWeight: FONTWEIGHT.normal,
                          lineHeight: device === "tablet" ? 30 : 18,
                          wordWrap: "break-word",
                        }}
                      >
                        Tampilkan {items.children?.length} Balasan
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}

                {items.id === toggleComment.id && toggleComment.toggle ? (
                  <View>
                    {items.children?.map((listKomen, index) => (
                      <View
                        style={{
                          flexDirection: "row",
                          marginVertical: 10,
                          marginHorizontal: 20,
                        }}
                      >
                        <View>
                          <Image
                            source={{ uri: listKomen.creator_avatar }}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 20,
                            }}
                          />
                        </View>
                        <View style={{ marginLeft: 10 }}>
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H2", device),
                              fontWeight: FONTWEIGHT.bold,
                              lineHeight: device === "tablet" ? 30 : 20,
                            }}
                          >
                            {listKomen.creator}
                          </Text>
                          <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text
                              style={{
                                color: COLORS.lighter,
                                fontSize: fontSizeResponsive("H5", device),
                                fontWeight: FONTWEIGHT.normal,
                                lineHeight: device === "tablet" ? 30 : 18,
                                marginBottom: 10,
                              }}
                            >
                              {listKomen.created_at}
                            </Text>
                            <View
                              style={{
                                height: "70%",
                                width: 1,
                                backgroundColor: "#DBDADE",
                              }}
                            />
                            <Text
                              style={{
                                color: COLORS.lighter,
                                fontSize: fontSizeResponsive("H5", device),
                                fontWeight: FONTWEIGHT.normal,
                                lineHeight: device === "tablet" ? 30 : 18,
                              }}
                            >
                              {listKomen.jam}
                            </Text>
                          </View>
                          <Text
                            style={{
                              color: "#999999",
                              fontSize: fontSizeResponsive("H5", device),
                              fontWeight: FONTWEIGHT.normal,
                              lineHeight: device === "tablet" ? 30 : 18,
                            }}
                          >
                            {listKomen.message}
                          </Text>
                          {items.children?.length - 1 === index ? (
                            <TouchableOpacity
                              key={listKomen.id}
                              onPress={() => clickBalas(items.id, false)}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 5,
                                  marginTop: 10,
                                }}
                              >
                                <View
                                  style={{
                                    height: 1,
                                    width: 20,
                                    backgroundColor: "#DBDADE",
                                  }}
                                />
                                <Text
                                  style={{
                                    color: COLORS.lighter,
                                    fontSize: fontSizeResponsive("H5", device),
                                    fontWeight: FONTWEIGHT.normal,
                                    lineHeight: device === "tablet" ? 30 : 18,
                                  }}
                                >
                                  Tutup {items.children?.length} Balasan
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export const Komentar = () => {
  const navigation = useNavigation();
  const [parentId, setParentId] = useState({ id: "", creator: "" });
  const [komen, setKomen] = useState("");
  const inputRef = useRef(null);
  const { dokumen, refresh } = useSelector((state) => state.repository);
  const [token, setToken] = useState("");
  const detail = dokumen.detail;

  const comment = detail.comments;

  const dispatch = useDispatch();
  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const handleComment = () => {
    const payload = {
      document_id: detail.id,
      parent_id: parentId.id !== "" ? parentId.id : "",
      message: komen,
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(postCommentRepo(data));
    setKomen("");
    setParentId({ id: "", creator: "" });
    dispatch(setRefresh(true));
  };

  useEffect(() => {
    if (refresh === true) {
      const params = { token: token, id: detail.id };
      dispatch(getDetailDocument(params));
      dispatch(setRefresh(false));
    }
  }, [refresh]);

  const { device } = useSelector((state) => state.apps);

  return (
    // <>
    <KeyboardAvoidingView
      style={{ flex: 1, marginBottom: 10 }}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      enabled
      keyboardVerticalOffset={Platform.select({ ios: 80, android: 50 })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          backgroundColor: COLORS.primary,
          height: 80,
          paddingBottom: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            width: device === "tablet" ? 40 : 28,
            height: device === "tablet" ? 40 : 28,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={device === "tablet" ? 40 : 24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.white,
            }}
          >
            Komentar
          </Text>
        </View>
      </View>
      <View style={{ marginVertical: 20, marginLeft: 20 }}>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
          Komentar ({comment?.length})
        </Text>
      </View>
      <FlatList
        data={comment}
        renderItem={({ item }) => (
          <View key={item.id}>
            <DaftarKomentar
              items={item}
              // inputRef={inputRef}
              setParentId={setParentId}
              device={device}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => <ListEmpty />}
        style={{ height: "68%" }}
      />
      <View
        style={{
          justifyContent: "flex-end",
          width: "90%",
          alignSelf: "center",
        }}
      >
        {parentId.id !== "" ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingTop: 10,
            }}
          >
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              Membalas {parentId.creator}
            </Text>
            <TouchableOpacity>
              <Ionicons
                name="close"
                size={20}
                color={COLORS.primary}
                onPress={() => setParentId({ id: "", creator: "" })}
              />
            </TouchableOpacity>
          </View>
        ) : null}
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: COLORS.lighter,
            opacity: 0.3,
            marginTop: 10,
          }}
        />
        <View
          style={{
            borderWidth: 1,
            width: "100%",
            borderRadius: 16,
            borderColor: COLORS.ExtraDivinder,
            flexDirection: "row",
            backgroundColor: COLORS.ExtraDivinder,
            marginTop: 10,
          }}
        >
          <TextInput
            numberOfLines={1}
            maxLength={30}
            placeholder="Ketik Komentar Disini"
            // ref={inputRef}
            style={{
              padding: 10,
              width: "90%",
              fontSize: fontSizeResponsive("H4", device),
            }}
            onChangeText={setKomen}
            value={komen}
            allowFontScaling={false}
          />
          <View
            style={{
              alignItems: "flex-end",
              flex: 1,
              marginRight: 10,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleComment();
              }}
            >
              <Ionicons name="send-sharp" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
    // </ >
  );
};
