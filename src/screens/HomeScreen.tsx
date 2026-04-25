import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity,
  AppState,
  AppStateStatus,
  BackHandler,
  RefreshControl
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { useNetInfo } from '@react-native-community/netinfo';
import debounce from 'lodash.debounce';
import { RootState, AppDispatch } from '../store';
import { fetchCharacters, setQueryString, listSelectors } from '../store/listSlice';
import { CharacterItem, RootStackParamList } from '../types';
import { colors } from '../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, errMsg, currentPage, canLoadMore, query } = useSelector((state: RootState) => state.listData);
  const items = useSelector(listSelectors.selectAll);
  
  const [localSearch, setLocalSearch] = useState(query);
  const appState = useRef(AppState.currentState);
  const fetchPromise = useRef<any>(null);
  const netInfo = useNetInfo();
  const [refreshing, setRefreshing] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        if (fetchPromise.current) fetchPromise.current.abort();
        dispatch(setQueryString(text));
        fetchPromise.current = dispatch(fetchCharacters({ page: 1, searchStr: text }));
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // handle app lifecycle
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
        // optionally refresh data here, but since it's persisted, we might just log it
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // initial load
  useEffect(() => {
    if (items.length === 0 && !isLoading) {
      fetchPromise.current = dispatch(fetchCharacters({ page: 1, searchStr: query }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // hardware back button interceptor
  useEffect(() => {
    const onBackPress = () => {
      if (localSearch.length > 0 || query.length > 0) {
        if (fetchPromise.current) fetchPromise.current.abort();
        // clear search and fetch default list instead of closing app
        setLocalSearch('');
        dispatch(setQueryString(''));
        fetchPromise.current = dispatch(fetchCharacters({ page: 1, searchStr: '' }));
        return true; 
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, [localSearch, query, dispatch]);

  const handleSearchChange = (text: string) => {
    setLocalSearch(text);
    debouncedSearch(text);
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchCharacters({ page: 1, searchStr: query })).finally(() => setRefreshing(false));
  };

  const fetchLock = useRef(false);

  const loadMoreData = () => {
    if (canLoadMore && !isLoading && !errMsg && items.length > 0 && !fetchLock.current) {
      fetchLock.current = true;
      fetchPromise.current = dispatch(fetchCharacters({ page: currentPage, searchStr: query }));
      fetchPromise.current.finally(() => {
        fetchLock.current = false;
      });
    }
  };

  const renderCharacter = ({ item }: { item: CharacterItem }) => {
    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('Details', { character: item })}
      >
        <FastImage 
          source={{ uri: item.image, priority: FastImage.priority.normal }} 
          style={styles.thumbnail} 
        />
        <View style={styles.cardInfo}>
          <Text style={styles.nameTxt}>{item.name}</Text>
          <Text style={styles.statusTxt}>{item.status} - {item.species}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getItemLayout = (_: any, index: number) => ({
    length: 112,
    offset: 112 * index,
    index,
  });

  return (
    <View style={styles.container}>
      {netInfo.isConnected === false && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
      )}

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.inputBox}
          placeholder="Search characters..."
          placeholderTextColor={colors.gray400}
          value={localSearch}
          onChangeText={handleSearchChange}
          returnKeyType="search"
        />
      </View>

      {errMsg ? (
        <View style={styles.errBox}>
          <Text style={styles.errText}>{errMsg}</Text>
        </View>
      ) : null}

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCharacter}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
        indicatorStyle="black"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListFooterComponent={() => {
          if (isLoading) return <ActivityIndicator size="large" color={colors.primary} style={{ margin: 20 }} />;
          return null;
        }}
        ListEmptyComponent={() => {
          if (!isLoading) return <Text style={{ textAlign: 'center', marginTop: 50 }}>No results found.</Text>;
          return null;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  searchWrap: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  inputBox: {
    height: 50,
    backgroundColor: colors.gray50,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 0,
    fontSize: 16,
    color: colors.black,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.gray200,
  },
  cardInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  nameTxt: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: 4,
  },
  statusTxt: {
    fontSize: 14,
    color: colors.gray600,
    fontWeight: '500',
  },
  errBox: {
    padding: 16,
    backgroundColor: colors.red100,
    margin: 16,
    borderRadius: 12,
  },
  errText: {
    color: colors.red700,
    textAlign: 'center',
    fontWeight: '600',
  },
  offlineBanner: {
    backgroundColor: colors.gray800,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  offlineText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  }
});
