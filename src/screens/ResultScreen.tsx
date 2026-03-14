import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const STATUS_CONFIG = {
  contains_gluten: {
    color: '#C0392B', bg: '#FDEDEC', emoji: '🚫', label: 'Contains Gluten',
  },
  no_gluten_detected: {
    color: '#1E8449', bg: '#EAFAF1', emoji: '✅', label: 'No Gluten Ingredients Detected',
  },
  unknown_product: {
    color: '#B7950B', bg: '#FEF9E7', emoji: '❓', label: 'Unknown / Product Not Found',
  },
};

export default function ResultScreen({ route, navigation }) {
  const { result } = route.params;
  const config = STATUS_CONFIG[result.status];

  return (
    <ScrollView style={[styles.container, { backgroundColor: config.bg }]}>
      <View style={[styles.resultCard, { borderColor: config.color }]}>
        <Text style={styles.emoji}>{config.emoji}</Text>
        <Text style={[styles.statusLabel, { color: config.color }]}>{config.label}</Text>
        {result.productName && (
          <Text style={styles.productName}>{result.productName}</Text>
        )}
        {result.detectedGlutenIngredients?.length > 0 && (
          <Text style={styles.detected}>
            Found: {result.detectedGlutenIngredients.join(', ')}
          </Text>
        )}
      </View>

      {result.ingredients && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.ingredients}>{result.ingredients}</Text>
        </View>
      )}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚠️ This result is informational only. Always verify ingredients on the product label.
        </Text>
      </View>

      <TouchableOpacity style={styles.scanAgain} onPress={() => navigation.goBack()}>
        <Text style={styles.scanAgainText}>Scan Another Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  resultCard: {
    margin: 20, padding: 24, backgroundColor: '#fff',
    borderRadius: 16, borderWidth: 2, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  emoji: { fontSize: 52, marginBottom: 12 },
  statusLabel: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  productName: {
    marginTop: 10, fontSize: 16, color: '#333',
    textAlign: 'center', fontWeight: '500',
  },
  detected: { marginTop: 8, fontSize: 14, color: '#888' },
  section: { marginHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#555', marginBottom: 6, textTransform: 'uppercase' },
  ingredients: { fontSize: 14, color: '#444', lineHeight: 22 },
  disclaimer: {
    margin: 20, padding: 14, backgroundColor: '#FFF8E1',
    borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#F59E0B',
  },
  disclaimerText: { fontSize: 13, color: '#6B5A00', lineHeight: 20 },
  scanAgain: {
    marginHorizontal: 20, marginBottom: 40,
    backgroundColor: '#111', padding: 16, borderRadius: 30, alignItems: 'center',
  },
  scanAgainText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});