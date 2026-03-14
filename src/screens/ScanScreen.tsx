import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { fetchProductByBarcode } from '../services/openFoodFactsAPI';
import { loadDietPreferences } from '../services/dietPreferences';
import { runDietAnalysis } from '../analysis/dietEngine';
import { saveToHistory } from '../services/scanHistory';
import SettingsModal from '../components/SettingsModal';

export default function ScanScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  const handleBarcodeScanned = async ({ data: barcode }: any) => {
    if (!scanning || loading) return;
    setScanning(false);
    setLoading(true);

    try {
      const fetchResult = await fetchProductByBarcode(barcode);

      if (!fetchResult.found) {
        const reason = {
          not_found: 'This product was not found in the Open Food Facts database.',
          network_error: 'Network error. Please check your connection and try again.',
          timeout: 'Request timed out. The API may be slow. Please try again.',
        }[fetchResult.reason] ?? 'An unexpected error occurred.';
        Alert.alert('Could not load product', reason, [
          { text: 'Try Again', onPress: () => setScanning(true) },
        ]);
        return;
      }

      const activeDiets = await loadDietPreferences();
      const { product } = fetchResult;

      const dietResults = runDietAnalysis(
        activeDiets,
        product.ingredients,
        product.allergens
      );

      const result = {
        productName: product.productName,
        brand: product.brand,
        ingredients: product.ingredients,
        allergens: product.allergens,
        dietResults,
        scannedAt: new Date().toISOString(),
      };

      await saveToHistory({ barcode, ...result });
      navigation.navigate('Result', { result });

    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.', [
        { text: 'OK', onPress: () => setScanning(true) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Camera permission is required.</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
        onBarcodeScanned={scanning ? handleBarcodeScanned : undefined}
      />

      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => setSettingsVisible(true)}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.hint}>
          {loading ? 'Looking up product...' : 'Point at a barcode'}
        </Text>
      </View>

      {!scanning && !loading && (
        <TouchableOpacity style={styles.rescanBtn} onPress={() => setScanning(true)}>
          <Text style={styles.rescanText}>Scan Again</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.historyBtn}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.historyText}>View History</Text>
      </TouchableOpacity>

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  topBar: { position: 'absolute', top: 0, right: 0, left: 0 },
  settingsBtn: {
    alignSelf: 'flex-end', margin: 16,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20,
    padding: 8,
  },
  settingsIcon: { fontSize: 22 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanFrame: {
    width: 260, height: 160, borderWidth: 2,
    borderColor: '#fff', borderRadius: 12, backgroundColor: 'transparent',
  },
  hint: {
    marginTop: 20, color: '#fff', fontSize: 16, fontWeight: '500',
    backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 16,
    paddingVertical: 8, borderRadius: 8,
  },
  rescanBtn: {
    position: 'absolute', bottom: 60, alignSelf: 'center',
    backgroundColor: '#fff', paddingHorizontal: 32,
    paddingVertical: 14, borderRadius: 30,
  },
  rescanText: { fontSize: 16, fontWeight: '600', color: '#000' },
  historyBtn: {
    position: 'absolute', bottom: 20, alignSelf: 'center',
    paddingHorizontal: 24, paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
  },
  historyText: { color: '#fff', fontSize: 14 },
  message: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  permBtn: { backgroundColor: '#000', padding: 16, borderRadius: 10 },
  permBtnText: { color: '#fff', fontSize: 15 },
});