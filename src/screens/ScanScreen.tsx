import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { scanBarcode } from '../services/api';
import { saveToHistory } from '../services/history';

export default function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  const handleBarcodeScanned = async ({ data: barcode }) => {
    if (!scanning || loading) return;
    setScanning(false);
    setLoading(true);

    try {
      const result = await scanBarcode(barcode);
      await saveToHistory({ barcode, ...result });
      navigation.navigate('Result', { result });
    } catch (err) {
      Alert.alert('Error', 'Could not fetch product data. Try again.');
      setScanning(true);
    } finally {
      setLoading(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Camera permission is required to scan barcodes.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanFrame: {
    width: 260, height: 160,
    borderWidth: 2, borderColor: '#fff', borderRadius: 12,
    backgroundColor: 'transparent',
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
  message: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#000', padding: 16, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 15 },
});