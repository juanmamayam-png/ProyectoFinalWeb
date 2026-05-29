import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const NOTIF_COLLECTION = 'notificaciones';
const USERS_COLLECTION = 'usuarios';

export async function createNotification(userId, mensaje, tipo, incidenteId) {
  return addDoc(collection(db, NOTIF_COLLECTION), {
    userId,
    mensaje,
    tipo,
    incidenteId,
    leida: false,
    fechaCreacion: serverTimestamp(),
  });
}

export async function notifyAdmins(mensaje, tipo, incidenteId) {
  const q = query(collection(db, USERS_COLLECTION), where('rol', '==', 'admin'));
  const snapshot = await getDocs(q);
  await Promise.all(
    snapshot.docs.map((d) => createNotification(d.id, mensaje, tipo, incidenteId))
  );
}

export function subscribeToUserNotifications(userId, callback) {
  const q = query(
    collection(db, NOTIF_COLLECTION),
    where('userId', '==', userId),
    where('leida', '==', false),
    orderBy('fechaCreacion', 'desc'),
    limit(20)
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function markAsRead(notifId) {
  await updateDoc(doc(db, NOTIF_COLLECTION, notifId), { leida: true });
}

export async function markAllAsRead(userId) {
  const q = query(
    collection(db, NOTIF_COLLECTION),
    where('userId', '==', userId),
    where('leida', '==', false)
  );
  const snapshot = await getDocs(q);
  await Promise.all(snapshot.docs.map((d) => updateDoc(d.ref, { leida: true })));
}
