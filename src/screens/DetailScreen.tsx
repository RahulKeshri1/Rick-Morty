import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { RootStackParamList } from '@/types';
import { colors } from '@/theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export default function DetailScreen({ route }: Props) {
  // snag the character data passed from the nav stack
  const { character } = route.params;

  if (!character) {
    return (
      <View style={styles.centerWrap}>
        <Text>Error loading character details.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imgContainer}>
        <FastImage 
          source={{ uri: character.image, priority: FastImage.priority.high }} 
          style={styles.mainImg} 
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.title}>{character.name}</Text>
        
        <View style={styles.row}>
          <Text style={styles.lbl}>Status:</Text>
          <Text style={styles.val}>{character.status}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.lbl}>Species:</Text>
          <Text style={styles.val}>{character.species}</Text>
        </View>

        {character.type ? (
          <View style={styles.row}>
            <Text style={styles.lbl}>Type:</Text>
            <Text style={styles.val}>{character.type}</Text>
          </View>
        ) : null}

        <View style={styles.row}>
          <Text style={styles.lbl}>Gender:</Text>
          <Text style={styles.val}>{character.gender || 'Unknown'}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  centerWrap: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  imgContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 60,
    backgroundColor: colors.gray800,
  },
  mainImg: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },
  infoBox: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: -40,
    borderRadius: 24,
    padding: 24,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: 24,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    alignItems: 'center',
  },
  lbl: {
    flex: 1,
    fontSize: 15,
    color: colors.gray500,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  val: {
    flex: 2,
    fontSize: 17,
    color: colors.gray800,
    fontWeight: '500',
  }
});
