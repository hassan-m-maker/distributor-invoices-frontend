import { openDB } from 'idb';

const dbPromise = openDB('invoices-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('customers')) {
      db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('ovens')) {
      db.createObjectStore('ovens', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('invoices')) {
      db.createObjectStore('invoices', { keyPath: 'id', autoIncrement: true });
    }
  },
});

// Customers
export async function addCustomer(customer) {
  return (await dbPromise).add('customers', customer);
}
export async function getCustomers() {
  return (await dbPromise).getAll('customers');
}

// Ovens
export async function addOven(oven) {
  return (await dbPromise).add('ovens', oven);
}
export async function getOvens() {
  return (await dbPromise).getAll('ovens');
}

// Invoices
export async function addInvoice(invoice) {
  return (await dbPromise).add('invoices', invoice);
}
export async function getInvoices() {
  return (await dbPromise).getAll('invoices');
}
// Delete customer by ID
export async function deleteCustomer(id) {
  return (await dbPromise).delete('customers', id);
}

// Delete oven by ID
export async function deleteOven(id) {
  return (await dbPromise).delete('ovens', id);
}

// ✅ Delete invoice by ID
export async function deleteInvoice(id) {
  const db = await dbPromise;
  await db.delete('invoices', id);
}
