import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView,
} from 'react-native';
import { DIET_PROFILES } from '../analysis/dietProfiles';
import { DietKey } from '../types';
import { saveDietPreferences, setOnboardingComplete } from '../services/dietPreferences';

export default function OnboardingScreen({ navigation }: any) {
  const [selected, setSelected] = useState<DietKey[]>(['glutenFree']);

  const toggle = (key: DietKey) => {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleContinue = async () => {
    if (selected.length === 0) return;
    await saveDietPreferences(selected);
    await setOnboardingComplete();
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Welcome to GlutenScan 🌾</Text>
        <Text style={styles.subtitle}>
          Select the diets you want to monitor. You can change these anytime in settings.
        </Text>

        {DIET_PROFILES.map(diet => {
          const isSelected = selected.includes(diet.key);
          return (
            <TouchableOpacity
              key={diet.key}
              style={[styles.dietCard, isSelected && styles.dietCardSelected]}
              onPress={() => toggle(diet.key)}
            >
              <View style={styles.dietLeft}>
                <Text style={styles.dietIcon}>{diet.icon}</Text>
                <View>
                  <Text style={[styles.dietLabel, isSelected && styles.dietLabelSelected]}>
                    {diet.label}
                  </Text>
                  <Text style={styles.dietDesc}>{diet.description}</Text>
                </View>
              </View>
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.continueBtn, selected.length === 0 && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={selected.length === 0}
        >
          <Text style={styles.continueBtnText}>Continue →</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          ⚠️ Always verify ingredients on the product label. This app is informational only.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24 },
  title: { fontSize: 26, fontWeight: '700', color: '#111', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 28, lineHeight: 22 },
  dietCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderRadius: 14, borderWidth: 1.5,
    borderColor: '#e0e0e0', backgroundColor: '#fafafa', marginBottom: 12,
  },
  dietCardSelected: { borderColor: '#111', backgroundColor: '#f0f0f0' },
  dietLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  dietIcon: { fontSize: 28, marginRight: 14 },
  dietLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
  dietLabelSelected: { color: '#111' },
  dietDesc: { fontSize: 13, color: '#888', marginTop: 2, maxWidth: 220 },
  checkbox: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: '#ccc',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxSelected: { borderColor: '#111', backgroundColor: '#111' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700' },
  continueBtn: {
    backgroundColor: '#111', padding: 16, borderRadius: 30,
    alignItems: 'center', marginTop: 24, marginBottom: 16,
  },
  continueBtnDisabled: { backgroundColor: '#ccc' },
  continueBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  disclaimer: { fontSize: 12, color: '#aaa', textAlign: 'center', lineHeight: 18 },
});