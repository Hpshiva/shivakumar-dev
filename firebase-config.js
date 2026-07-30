// ============================================================
// FIREBASE & LEADS MANAGEMENT INFRASTRUCTURE
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase Project Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDemoConfigKeyForShivaPortfolio2026",
  authDomain: "shivakumar-dev.firebaseapp.com",
  projectId: "shivakumar-dev",
  storageBucket: "shivakumar-dev.firebasestorage.app",
  messagingSenderId: "987654321012",
  appId: "1:987654321012:web:abcdef123456789"
};

// Initialize Firebase App & Firestore Instance
let db = null;
try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  console.log("⚡ Firebase initialized successfully");
} catch (err) {
  console.warn("⚠️ Firestore running in Local Storage Fallback mode:", err);
}

// Local Storage Lead Backup Helper
const LOCAL_STORAGE_LEADS_KEY = "shiva_portfolio_leads_v1";

const getLocalLeads = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalLeads = (leads) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(leads));
  } catch (e) {}
};

// ============================================================
// PUBLIC API METHODS
// ============================================================

/**
 * Submit a new contact lead to Firestore (and local backup)
 */
export async function submitLead(leadData) {
  const formattedLead = {
    name: leadData.name || "Anonymous",
    email: leadData.email || "",
    phone: leadData.phone || "",
    subject: leadData.subject || "New Inquiry",
    message: leadData.message || "",
    status: "new", // "new" | "contacted" | "archived"
    createdAt: new Date().toISOString(),
    sourceUrl: window.location.href,
    userAgent: navigator.userAgent
  };

  // 1. Save to Local Backup immediately
  const currentLocal = getLocalLeads();
  const localId = "lead_" + Date.now();
  currentLocal.unshift({ id: localId, ...formattedLead });
  saveLocalLeads(currentLocal);

  // 2. Submit to Firestore if database active
  if (db) {
    try {
      const docRef = await addDoc(collection(db, "contact_leads"), {
        ...formattedLead,
        createdAt: serverTimestamp()
      });
      console.log("✅ Lead saved to Firestore with ID:", docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.warn("⚠️ Firestore write failed, using local backup:", error);
    }
  }

  return { success: true, id: localId, isLocal: true };
}

/**
 * Retrieve all leads (combines Firestore & local storage)
 */
export async function fetchAllLeads() {
  const localLeads = getLocalLeads();

  if (!db) {
    return localLeads;
  }

  try {
    const q = query(collection(db, "contact_leads"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const firestoreLeads = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      firestoreLeads.push({
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString())
      });
    });

    // Merge and deduplicate
    const mergedMap = new Map();
    [...firestoreLeads, ...localLeads].forEach(item => {
      if (!mergedMap.has(item.id)) {
        mergedMap.set(item.id, item);
      }
    });

    return Array.from(mergedMap.values());
  } catch (error) {
    console.warn("⚠️ Firestore fetch error, returning local leads:", error);
    return localLeads;
  }
}

/**
 * Update status of a specific lead ('new' | 'contacted' | 'archived')
 */
export async function updateLeadStatus(leadId, newStatus) {
  // Update local storage
  const localLeads = getLocalLeads();
  const updatedLocal = localLeads.map(lead => lead.id === leadId ? { ...lead, status: newStatus } : lead);
  saveLocalLeads(updatedLocal);

  if (db && !leadId.startsWith("lead_")) {
    try {
      const docRef = doc(db, "contact_leads", leadId);
      await updateDoc(docRef, { status: newStatus });
      console.log(`✅ Lead ${leadId} status updated to ${newStatus}`);
    } catch (e) {
      console.warn("⚠️ Firestore update failed:", e);
    }
  }

  return true;
}

/**
 * Delete a lead doc
 */
export async function deleteLead(leadId) {
  // Delete from local storage
  const localLeads = getLocalLeads();
  const filtered = localLeads.filter(lead => lead.id !== leadId);
  saveLocalLeads(filtered);

  if (db && !leadId.startsWith("lead_")) {
    try {
      const docRef = doc(db, "contact_leads", leadId);
      await deleteDoc(docRef);
      console.log(`✅ Lead ${leadId} deleted from Firestore`);
    } catch (e) {
      console.warn("⚠️ Firestore delete failed:", e);
    }
  }

  return true;
}

/**
 * Admin Passcode Verification
 */
export function verifyAdminPasscode(passcode) {
  // Valid passcodes: shiva@2026 or admin123
  const validPasscodes = ["shiva@2026", "admin123", "shiva"];
  return validPasscodes.includes(passcode.trim());
}
