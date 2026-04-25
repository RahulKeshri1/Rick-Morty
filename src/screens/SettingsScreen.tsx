import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { resetData } from '@/store/listSlice';
import { RootStackParamList } from '@/types';
import { colors } from '@/theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [modalVisible, setModalVisible] = useState(false);

  const handleClearCache = () => {
    setModalVisible(true);
  };

  const confirmClearCache = () => {
    dispatch(resetData());
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>App Information</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Version</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Data Source</Text>
          <Text style={styles.value}>Rick and Morty API</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Storage</Text>
          <Text style={styles.value}>AsyncStorage + Redux Persist</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.dangerBtn} onPress={handleClearCache}>
        <Text style={styles.dangerBtnText}>Clear Cached Data</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Clear Cache</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to clear all downloaded characters? This will force a fresh fetch.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.cancelBtn]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.confirmBtn]} 
                onPress={confirmClearCache}
              >
                <Text style={styles.confirmBtnText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
    padding: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: colors.gray600,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: colors.gray800,
    fontWeight: '600',
  },
  dangerBtn: {
    backgroundColor: colors.red100,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.red400,
  },
  dangerBtnText: {
    color: colors.red600,
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.blackOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: colors.gray100,
  },
  confirmBtn: {
    backgroundColor: colors.red100,
  },
  cancelBtnText: {
    color: colors.gray800,
    fontSize: 16,
    fontWeight: '700',
  },
  confirmBtnText: {
    color: colors.red600,
    fontSize: 16,
    fontWeight: '700',
  }
});
