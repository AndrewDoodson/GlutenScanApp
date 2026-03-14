import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, Switch, ScrollView,
} from 'react-native';
import { DIET_PROFILES } from '../analysis/dietProfiles';
import { DietKey } from '../types';
import { loadDietPreferences, saveDietPreferences } from '../services/dietPreferences';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: Props) {
  const [selected, setSelected] = useState<DietKey[]>([]);

  useEffect(() => {
    if (visible) loadDietPreferences().then(setSelected);
  }, [visible]);

  const toggle = async (key: DietKey) => {
    const updated = selected.includes(key)
      ? selected.filter(k => k !== key)
      : [...selected, key];
    setSelected(updated);
    await saveDietPreferences(updated);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Dietary Restrictions</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Toggle which diets to check when scanning products.
          </Text>

          <ScrollView>
            {DIET_PROFILES.map(diet => {
              const isOn = selected.includes(diet.key);
              return (
                <View key={diet.key} style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Text style={styles.rowIcon}>{diet.icon}</Text>
                    <View>
                      <Text style={styles.rowLabel}>{diet.label}</Text>
                      <Text style={styles.rowDesc}>{diet.description}</Text>
                    </View>
                  </View>
                  <Switch
                    value={isOn}
                    onValueChange={() => toggle(diet.key)}
                    trackColor={{ false: '#ddd', true: '#111' }}
                    thumbColor="#fff"
                  />
                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24, maxHeight: '85%',
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#111' },
  closeBtn: { padding: 4 },
  closeText: { fontSize: 18, color: '#888' },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 20 },
  row: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowIcon: { fontSize: 24, marginRight: 14 },
  rowLabel: { fontSize: 15, fontWeight: '600', color: '#222' },
  rowDesc: { fontSize: 12, color: '#999', marginTop: 2, maxWidth: 220 },
  doneBtn: {
    backgroundColor: '#111', padding: 14, borderRadius: 30,
    alignItems: 'center', marginTop: 20,
  },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});