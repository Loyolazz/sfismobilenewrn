import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EsquemasOperacionais() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EsquemasOperacionais</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, color: '#0F3C52' },
});
