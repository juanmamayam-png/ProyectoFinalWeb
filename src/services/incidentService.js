import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

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
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { estado });

  // If this incident belongs to a group, update all incidents in the group
  const incident = await getIncidentById(id);
  if (incident && incident.grupoId) {
    await updateGroupStatus(incident.grupoId, estado);
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
