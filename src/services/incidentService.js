import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { createNotification, notifyAdmins } from './notificationService';

const COLLECTION = 'incidentes';

export async function createIncident(data) {
  const incident = {
    usuarioId: data.usuarioId,
    usuarioNombre: data.usuarioNombre,
    tipo: data.tipo,
    descripcion: data.descripcion,
    imagenURL: data.imagenURL || null,
    ubicacionTexto: data.ubicacionTexto,
    latitud: data.latitud || null,
    longitud: data.longitud || null,
    fechaCreacion: serverTimestamp(),
    estado: 'Reportado',
    grupoId: null,
  };

  const docRef = await addDoc(collection(db, COLLECTION), incident);

  // RF-14: notify all admins of new incident
  await notifyAdmins(
    `Nuevo incidente "${data.tipo}" reportado por ${data.usuarioNombre} en ${data.ubicacionTexto}`,
    'nuevo_incidente',
    docRef.id
  );

  return docRef.id;
}

export async function getIncidents() {
  const q = query(
    collection(db, COLLECTION),
    orderBy('fechaCreacion', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getUserIncidents(userId) {
  const q = query(
    collection(db, COLLECTION),
    where('usuarioId', '==', userId),
    orderBy('fechaCreacion', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getIncidentById(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function updateIncidentStatus(id, estado) {
  const incident = await getIncidentById(id);
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { estado });

  if (incident) {
    if (incident.grupoId) {
      // Group update also handles notifications for all group members
      await updateGroupStatus(incident.grupoId, estado);
    } else {
      // RF-13: notify the reporter of status change
      await createNotification(
        incident.usuarioId,
        `Tu incidente "${incident.tipo}" cambió de estado a "${estado}"`,
        'estado_cambiado',
        id
      );
    }
  }
}

export async function groupIncidents(incidentIds, grupoId) {
  const batch = writeBatch(db);
  for (const id of incidentIds) {
    const docRef = doc(db, COLLECTION, id);
    batch.update(docRef, { grupoId });
  }
  await batch.commit();
}

export async function updateGroupStatus(grupoId, estado) {
  const q = query(
    collection(db, COLLECTION),
    where('grupoId', '==', grupoId)
  );
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => {
    batch.update(d.ref, { estado });
  });
  await batch.commit();

  // RF-13: notify each reporter in the group
  await Promise.all(
    snapshot.docs.map((d) => {
      const data = d.data();
      return createNotification(
        data.usuarioId,
        `Tu incidente "${data.tipo}" (agrupado) cambió de estado a "${estado}"`,
        'estado_cambiado',
        d.id
      );
    })
  );
}

export async function markIncidentNotified(id) {
  await updateDoc(doc(db, COLLECTION, id), { notificacionEstancadoEnviada: true });
}

export async function deleteIncident(id) {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}

export async function getIncidentsByPeriod(startDate, endDate) {
  const start = Timestamp.fromDate(new Date(startDate));
  const end = Timestamp.fromDate(new Date(endDate));

  const q = query(
    collection(db, COLLECTION),
    where('fechaCreacion', '>=', start),
    where('fechaCreacion', '<=', end),
    orderBy('fechaCreacion', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
