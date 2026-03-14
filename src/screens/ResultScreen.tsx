import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { DietResult } from '../types';

const STATUS_CONFIG = {
  compatible: { color: '#1E8449', bg: '#EAFAF1', icon: '✅', label: 'Compatible' },
  not_compatible: { color: '#C0392B', bg: '#FDEDEC', icon: '⚠️', label: 'Not compatible' },
  unknown: { color: '#B7950B', bg: '#FEF9E7', icon: '❓', label: 'No data' },
};

export default function ResultScreen({ route, navigation }: any) {
  const { result } = route.params;

  const overallSafe = result.dietResults.every(
    (r: DietResult) => r.status === 'compatible'
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.productCard}>
          <Text style={styles.productName}>
            {result.productName ?? 'Unknown Product'}
          </Text>
          {result.brand && (
            <Text style={styles.brand}>{result.brand}</Text>
          )}
        </View>

        <View style={[
          styles.banner,
          { backgroundColor: overallSafe ? '#EAFAF1' : '#FDEDEC' }
        ]}>
          <Text style={styles.bannerText}>
            {overallSafe
              ? '✅ Compatible with all your diets'
              : '⚠️ Not compatible with one or more diets'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Diet Analysis</Text>
        {result.dietResults.map((dietResult: DietResult) => {
          const config = STATUS_CONFIG[dietResult.status];
          return (
            <View
              key={dietResult.dietKey}
              style={[styles.dietRow, { backgroundColor: config.bg }]}
            >
              <View style={styles.dietRowHeader}>
                <Text style={styles.dietIcon}>{config.icon}</Text>
                <Text style={[styles.dietLabel, { color: config.color }]}>
                  {dietResult.label}
                </Text>
                <Text style={[styles.dietStatus, { color: config.color }]}>
                  {config.label}
                </Text>
              </View>
              {dietResult.triggeredIngredients.length > 0 && (
                <Text style={styles.triggers}>
                  Contains: {dietResult.triggeredIngredients.join(', ')}
                </Text>
              )}
            </View>
          );
        })}

        {result.ingredients && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Full Ingredient List</Text>
            <Text style={styles.ingredients}>{result.ingredients}</Text>
          </View>
        )}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ This result is informational only. Always verify ingredients on
            the product label. Cross contamination warnings are not detected.
          </Text>
        </View>

        <TouchableOpacity style={styles.scanAgain} onPress={() => navigation.goBack()}>
          <Text style={styles.scanAgainText}>Scan Another Product</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scroll: { padding: 16 },
  productCard: {
    backgroundColor: '#fff', padding: 20, borderRadius: 14,
    marginBottom: 12, elevation: 2,
  },
  productName: { fontSize: 20, fontWeight: '700', color: '#111' },
  brand: { fontSize: 14, color: '#888', marginTop: 4 },
  banner: { padding: 14, borderRadius: 10, marginBottom: 20, alignItems: 'center' },
  bannerText: { fontSize: 15, fontWeight: '600', color: '#333' },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: '#555',
    textTransform: 'uppercase', marginBottom: 10, marginTop: 4,
  },
  dietRow: { padding: 14, borderRadius: 12, marginBottom: 10 },
  dietRowHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dietIcon: { fontSize: 18 },
  dietLabel: { fontSize: 15, fontWeight: '600', flex: 1 },
  dietStatus: { fontSize: 13, fontWeight: '500' },
  triggers: { fontSize: 13, color: '#555', marginTop: 6, marginLeft: 26 },
  section: { marginTop: 16 },
  ingredients: { fontSize: 13, color: '#444', lineHeight: 20 },
  disclaimer: {
    marginTop: 20, padding: 14, backgroundColor: '#FFF8E1',
    borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#F59E0B',
  },
  disclaimerText: { fontSize: 12, color: '#6B5A00', lineHeight: 18 },
  scanAgain: {
    backgroundColor: '#111', padding: 16, borderRadius: 30,
    alignItems: 'center', marginTop: 16, marginBottom: 24,
  },
  scanAgainText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});