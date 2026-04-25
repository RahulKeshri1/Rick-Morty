import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { CharacterItem } from '@/types';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { layout } from '@/theme/layout';

interface CharacterCardProps {
  item: CharacterItem;
  onPress: (character: CharacterItem) => void;
}

const CharacterCard = ({ item, onPress }: CharacterCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(item)}
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

export default memo(CharacterCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: layout.radius.lg,
    ...layout.shadows.md,
    alignItems: 'center',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: layout.radius.round,
    backgroundColor: colors.gray200,
  },
  cardInfo: {
    marginLeft: spacing.lg,
    flex: 1,
    justifyContent: 'center',
  },
  nameTxt: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  statusTxt: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
    fontWeight: typography.weights.medium,
  },
});
