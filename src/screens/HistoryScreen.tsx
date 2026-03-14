import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getHistory, clearHistory, ScanRecord } from '../services/history';

const STATUS_LABELS = {
  contains_gluten: { label: 'Contains Gluten', color: '#C0392B', bg: '#FDEDEC' },
  no_gluten_detected: { label: 'No Gluten', color: '#1E8449', bg: '#EAFAF1' },
  unknown_product: { label: 'Unknown', color: '#B7950B', bg: '#FEF9E7' },
};

export default function HistoryScreen() {
  const [history, setHistory] = useState<ScanRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      getHistory().then(setHistory);
    }, [])
  );

  const handleClear = async () => {
    await clearHistory();
    setHistory([]);
  };

  if (history.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No scans yet. Start scanning products!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => {
          const config = STATUS_LABELS[item.status];
          return (
            <View style={[styles.item, { backgroundColor: config.bg }]}>
              <View style={styles.itemLeft}>
                <Text style={styles.productName}>{item.productName ?? 'Unknown Product'}</Text>
                <Text style={styles.barcode}>{item.barcode}</Text>
                <Text style={styles.date}>{new Date(item.scannedAt).toLocaleDateString()}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: config.color }]}>
                <Text style={styles.badgeText}>{config.label}</Text>
              </View>
            </View>
          );
        }}
      />
      <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
        <Text style={styles.clearText}>Clear History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyText: { fontSize: 16, color: '#888', textAlign: 'center' },
  item: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    margin: 10, padding: 16, borderRadius: 12,
  },
  itemLeft: { flex: 1 },
  productName: { fontSize: 15, fontWeight: '600', color: '#222' },
  barcode: { fontSize: 12, color: '#888', marginTop: 2 },
  date: { fontSize: 12, color: '#aaa', marginTop: 2 },
  badge: {
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, marginLeft: 10,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  clearBtn: {
    margin: 16, padding: 14, backgroundColor: '#eee',
    borderRadius: 30, alignItems: 'center',
  },
  clearText: { fontSize: 15, color: '#666' },
});