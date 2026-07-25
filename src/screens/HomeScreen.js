import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Button } from 'react-native';
import colors from '../constants/colors';
import { getCoursesData, saveCoursesData } from '../utils/storage';

const INITIAL_DATA = [
  { id: '1', name: 'Pemrograman Mobile', code: 'MK001', schedule: 'Senin, 08:00 - 10:30' },
  { id: '2', name: 'Basis Data Lanjut', code: 'MK002', schedule: 'Selasa, 10:30 - 13:00' },
  { id: '3', name: 'Sistem Pakar & AI', code: 'MK003', schedule: 'Rabu, 13:00 - 15:30' },
];

export default function HomeScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Data dari AsyncStorage (Poin 4 & 7)
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    let data = await getCoursesData();
    if (!data || data.length === 0) {
      data = INITIAL_DATA;
      await saveCoursesData(data);
    }
    setCourses(data);
    setLoading(false);
  };

  const handleClearData = async () => {
    setCourses([]);
    await saveCoursesData([]);
  };

  // 1. CONDITIONAL RENDERING: Loading State (Poin 1 & 7)
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Memuat Daftar Mata Kuliah...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Daftar Mata Kuliah</Text>
        <Button title="Reset / Clear" color="#e74c3c" onPress={handleClearData} />
      </View>

      {/* 2 & 3. FLATLIST & CONDITIONAL RENDERING: Empty vs Populated State (Poin 1 & 3) */}
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DetailScreen', { course: item })}
          >
            <Text style={styles.courseName}>{item.name}</Text>
            <Text style={styles.courseCode}>Kode: {item.code}</Text>
            <Text style={styles.schedule}>Jadwal: {item.schedule}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada data mata kuliah.</Text>
            <TouchableOpacity style={styles.reloadButton} onPress={loadData}>
              <Text style={styles.reloadText}>Muat Ulang Data</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.primary },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  courseName: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  courseCode: { fontSize: 14, color: '#666', marginTop: 4 },
  schedule: { fontSize: 14, color: colors.secondary, marginTop: 4 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#888', marginBottom: 15 },
  reloadButton: { backgroundColor: colors.primary, padding: 10, borderRadius: 6 },
  reloadText: { color: '#fff', fontWeight: 'bold' }
});