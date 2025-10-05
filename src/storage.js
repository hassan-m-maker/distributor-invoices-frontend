import { openDB } from "idb";

const DB_NAME = "invoices-db";
const STORE_NAME = "invoices";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    }
  });
}

export async function saveInvoice(invoice) {
  const db = await getDB();
  await db.add(STORE_NAME, invoice);
}

export async function getInvoices() {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function clearInvoices() {
  const db = await getDB();
  return db.clear(STORE_NAME);
}
