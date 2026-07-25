import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { getUserSession, removeUserSession } from '../utils/storage';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getUserSession();
      setUser(session);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await removeUserSession();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>V</Text>
      </View>
      <Text style={styles.name}>{user?.name || 'Vincent'}</Text>
      <Text style={styles.nim}>NIM: {user?.nim || '243303621414'}</Text>
      <Text style={styles.role}>Status: {user?.role || 'Mahasiswa'}</Text>

      <View style={styles.buttonWrapper}>
        <Button title="LOGOUT" color="#e74c3c" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  nim: { fontSize: 16, color: '#666', marginTop: 5 },
  role: { fontSize: 14, color: colors.secondary, marginTop: 2 },
  buttonWrapper: { marginTop: 40, width: '60%' }
});