import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

export const uploadIncidentImage = async (file, userId) => {
  const fileName = `incidents/${userId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, fileName);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

export const deleteIncidentImage = async (imagenURL) => {
  if (!imagenURL) return;
  const match = decodeURIComponent(imagenURL).match(/\/o\/(.+?)(\?|$)/);
  if (!match) return;
  const imageRef = ref(storage, match[1]);
  await deleteObject(imageRef);
};
