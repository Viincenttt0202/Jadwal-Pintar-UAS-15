import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import colors from '../constants/colors';
import { saveUserSession } from '../utils/storage';

export default function LoginScreen({ navigation }) {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [errorNim, setErrorNim] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const handleLogin = async () => {
    let isValid = true;

    // Validasi NIM
    if (!nim.trim()) {
      setErrorNim('NIM tidak boleh kosong!');
      isValid = false;
    } else if (nim.length < 5) {
      setErrorNim('NIM minimal harus 5 karakter!');
      isValid = false;
    } else {
      setErrorNim('');
    }

    // Validasi Password
    if (!password.trim()) {
      setErrorPassword('Password tidak boleh kosong!');
      isValid = false;
    } else if (password.length < 6) {
      setErrorPassword('Password minimal 6 karakter!');
      isValid = false;
    } else {
      setErrorPassword('');
    }

    if (isValid) {
      try {
        const userData = { nim, name: 'Vincent', role: 'Mahasiswa' };
        await saveUserSession(userData);
      } catch (error) {
        console.error('Gagal menyimpan sesi user:', error);
      } finally {
        // Navigasi dipastikan SELALU berjalan setelah tombol diklik & validasi lolos
        navigation.replace('MainTabs');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jadwal Pintar📊</Text>
      <Text style={styles.subtitle}>Silakan masuk dengan akun Anda</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errorNim ? styles.inputError : null]}
          placeholder="NIM (misal: 243303621414)"
          value={nim}
          onChangeText={setNim}
          keyboardType="numeric"
        />
        {errorNim ? <Text style={styles.errorText}>{errorNim}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errorPassword ? styles.inputError : null]}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errorPassword ? <Text style={styles.errorText}>{errorPassword}</Text> : null}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>MASUK</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.primary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30 },
  inputContainer: { marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', backgroundColor: '#fff', padding: 12, borderRadius: 8, fontSize: 16 },
  inputError: { borderColor: '#e74c3c' },
  errorText: { color: '#e74c3c', fontSize: 12, marginTop: 4, marginLeft: 4 },
  button: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});