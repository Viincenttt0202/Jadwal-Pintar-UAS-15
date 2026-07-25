import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Button, 
  Image, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  TouchableOpacity,
  ActionSheetIOS, // Opsional untuk iOS, kita pakai Alert agar universal
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../constants/colors';
import { saveCourseImage, getCourseImage, removeCourseImage } from '../utils/storage';

export default function DetailScreen({ route }) {
  const course = route?.params?.course;
  const [imageUri, setImageUri] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // 1. Load foto tersimpan saat halaman dibuka
  useEffect(() => {
    if (course?.id) {
      loadSavedImage();
    }
  }, [course]);

  const loadSavedImage = async () => {
    const savedUri = await getCourseImage(course.id);
    if (savedUri) {
      setImageUri(savedUri);
    }
  };

  // --- FUNGSI LOGIK PEMROSES FOTO (DIGUNAKAN OLEH KAMERA & GALERI) ---
  const processImageResult = async (result) => {
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      setImageUri(selectedUri);
      
      // Simpan permanen ke AsyncStorage berdasarkan ID matkul
      await saveCourseImage(course.id, selectedUri);
      Alert.alert('Sukses ✅', 'Bukti tugas berhasil disimpan secara permanen di aplikasi.');
    }
  };

  // --- FITUR A: PILIH DARI GALERI ---
  const handlePickFromGallery = async () => {
    // Minta izin galeri
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      setPermissionDenied(true);
      Alert.alert('Izin Ditolak 🖼️', 'Aplikasi perlu izin galeri untuk memilih foto.');
      return;
    }

    setPermissionDenied(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    processImageResult(result);
  };

  // --- FITUR B: LANGSUNG FOTO DARI KAMERA ---
  const handleTakePhoto = async () => {
    // Minta izin kamera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      setPermissionDenied(true);
      Alert.alert('Izin Ditolak 📷', 'Aplikasi perlu izin kamera untuk mengambil foto langsung.');
      return;
    }

    setPermissionDenied(false);
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    processImageResult(result);
  };

  // --- FITUR C: MENU PILIHAN (ACTION SHEET) ---
  const handleSelectImageSource = () => {
    // Menampilkan pilihan menggunakan Alert standar (Universal Android/iOS)
    Alert.alert(
      'Kumpulkan Tugas 📝',
      'Silakan pilih sumber foto bukti tugas Anda:',
      [
        {
          text: '📷 Ambil Foto Langsung (Kamera)',
          onPress: handleTakePhoto,
        },
        {
          text: '🖼️ Pilih dari Galeri HP',
          onPress: handlePickFromGallery,
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ],
      { cancelable: true } // User bisa klik di luar alert untuk menutup
    );
  };

  // --- FITUR D: HAPUS TUGAS ---
  const handleDeleteImage = async () => {
    if (course?.id) {
      Alert.alert(
        'Hapus Tugas?',
        'Apakah Anda yakin ingin menghapus bukti tugas ini?',
        [
          { text: 'Batal', style: 'cancel' },
          { 
            text: 'Hapus', 
            style: 'destructive', 
            onPress: async () => {
              await removeCourseImage(course.id);
              setImageUri(null);
              Alert.alert('Informasi', 'Foto tugas berhasil dihapus.');
            } 
          },
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{course?.name || 'Detail Mata Kuliah'}</Text>
        <Text style={styles.info}>Kode: {course?.code || '-'}</Text>
        <Text style={styles.info}>Jadwal: {course?.schedule || '-'}</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Status Pengumpulan Tugas</Text>
      
      {permissionDenied && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Izin Kamera/Galeri ditolak. Silakan aktifkan di Pengaturan HP agar bisa mengumpulkan tugas.
          </Text>
        </View>
      )}

      {/* TOMBOL UTAMA: MENAMPILKAN PILIHAN */}
      <TouchableOpacity style={styles.mainButton} onPress={handleSelectImageSource}>
        <Text style={styles.mainButtonText}>
          {imageUri ? "⚡ Ganti Bukti Tugas" : "📤 Kumpulkan Tugas"}
        </Text>
      </TouchableOpacity>

      {imageUri && (
        <View style={styles.imageContainer}>
          <Text style={styles.imageLabel}>Bukti Tugas Tersimpan:</Text>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteImage}>
            <Text style={styles.deleteText}>Hapus Tugas Ini</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  cardHeader: { backgroundColor: '#fff', padding: 16, borderRadius: 10, elevation: 2 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.primary, marginBottom: 6 },
  info: { fontSize: 15, color: '#555', marginBottom: 3 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  warningBox: { backgroundColor: '#ffe6e6', padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ffcccc' },
  warningText: { color: '#c0392b', fontSize: 13, textAlign: 'center', fontWeight: '500' },
  
  // Styling Tombol Utama Elegan
  mainButton: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 8, alignItems: 'center', elevation: 3 },
  mainButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  imageContainer: { marginTop: 25, alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 10, elevation: 1 },
  imageLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 12, color: '#27ae60' },
  previewImage: { width: '100%', height: 250, borderRadius: 10, resizeMode: 'cover' },
  deleteButton: { marginTop: 16, backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, borderWidth: 1, borderColor: '#e74c3c' },
  deleteText: { color: '#e74c3c', fontWeight: 'bold', fontSize: 13 }
});