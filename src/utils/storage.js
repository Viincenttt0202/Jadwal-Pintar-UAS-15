import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@user_session';
const COURSES_KEY = '@courses_data';

// --- CRUD USER SESSION ---
export const saveUserSession = async (userData) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
  } catch (e) {
    console.error('Gagal menyimpan sesi user', e);
  }
};

export const getUserSession = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Gagal mengambil sesi user', e);
    return null;
  }
};

export const removeUserSession = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Gagal menghapus sesi user', e);
  }
};

// --- CRUD DOMAIN DATA (MATKUL) ---
export const saveCoursesData = async (courses) => {
  try {
    await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  } catch (e) {
    console.error('Gagal menyimpan data matkul', e);
  }
};

export const getCoursesData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(COURSES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Gagal mengambil data matkul', e);
    return null;
  }
};

// --- CRUD FOTO TUGAS ---
export const saveCourseImage = async (courseId, imageUri) => {
  try {
    await AsyncStorage.setItem(`@task_image_${courseId}`, imageUri);
  } catch (e) {
    console.error('Gagal menyimpan foto tugas', e);
  }
};

export const getCourseImage = async (courseId) => {
  try {
    return await AsyncStorage.getItem(`@task_image_${courseId}`);
  } catch (e) {
    console.error('Gagal mengambil foto tugas', e);
    return null;
  }
};

export const removeCourseImage = async (courseId) => {
  try {
    await AsyncStorage.removeItem(`@task_image_${courseId}`);
  } catch (e) {
    console.error('Gagal menghapus foto tugas', e);
  }
};