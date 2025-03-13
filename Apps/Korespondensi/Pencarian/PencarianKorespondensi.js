import { View } from "react-native";
import { TopsPencarianKorespondensi } from "../../../utils/menutab";
import { PADDING, COLORS } from "../../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState, useEffect } from "react";
import { IconButton } from "react-native-paper";
import { nde_api } from "../../../utils/api.config";
import { getHTTP, handlerError } from "../../../utils/http";
import SearchFilter from "../../../components/UI/SearchFilter";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";

export const PencarianKorespondensi = () => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchFilter, setIsSearchFilter] = useState(false);
  const [isSearchQuery, setIsSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const animation = useRef(null);

  const willFocusSubscription = navigation.addListener("focus", () => {
    if (isSearchFilter && searchQuery.length != 0) {
      getSearchGlobal(1);
    } else {
      setIsSearchFilter(false);
      setList([]);
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (isSearchFilter && searchQuery.length != 0) {
      getSearchGlobal(1);
    } else {
      setIsLoading(false);
    }
    return willFocusSubscription;
  }, [isSearchQuery, isSearchFilter]);

  async function getSearchGlobal(page) {
    setIsLoading(true);
    try {
      if (searchQuery.length == 0) {
        setIsSearchFilter(false);
        setSearchQuery("");
        setIsSearchQuery("");
        setList([]);
      } else {
        setIsSearchQuery(searchQuery);
        let word;
        if (searchQuery.length == 0) {
          word = "";
        } else {
          word = searchQuery;
        }
        let url = nde_api.searchglobal + "?";
        url = url + "&query=" + word;
        let response;
        response = await getHTTP(url);
        if (response) {
          setIsSearchFilter(true);
          setList(response.data);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsSearchFilter(false);
      handlerError(error, "Peringatan!", "Pencarian tidak berfungsi");
      setIsLoading(false);
    }
  }

  function loadMore() {
    if (list?.next != null) {
      getSearchGlobal(list?.next);
    }
  }
  function refresh() {
    setIsLoading(true);
    setSearchQuery("");
    setIsSearchQuery("");
    setIsSearchFilter(false);
    setList([]);
    setIsLoading(false);
  }

  const clearSearch = () => (
    <>
      {searchQuery.length > 0 && (
        <IconButton
          icon="close"
          onPress={() => {
            setSearchQuery("");
            setIsSearchQuery("");
            setIsSearchFilter(false);
            setList([]);
          }}
        />
      )}
    </>
  );

  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  return (
    <>
      {loadingOverlay}
      <View
        style={{
          padding: PADDING.Page,
          flex: 1,
          backgroundColor: COLORS.white,
        }}
      >
        <View>
          <SearchFilter
            tipe="searchGlobal"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            clearSearch={clearSearch}
            getSearch={() => {
              getSearchGlobal(1);
            }}
          />
        </View>
        <TopsPencarianKorespondensi data={list} />
      </View>
    </>
  );
};
