"use client";

import { useEffect, useState } from "react";

const DB_NAME = "cinestream-offline";
const DB_VERSION = 10;
const STORE_NAME = "content";

const openDB = (): Promise<IDBDatabase> => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.log("DB open error, trying fresh");
      indexedDB.deleteDatabase(DB_NAME);
      const retryReq = indexedDB.open(DB_NAME, DB_VERSION);
      retryReq.onsuccess = () => resolve(retryReq.result);
      retryReq.onerror = () => reject(retryReq.error);
    };
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "_id" });
      }
    };
  });
};

const deleteOldDB = (): Promise<void> => {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.deleteDatabase(DB_NAME);
      req.onsuccess = () => {
        console.log("Old DB deleted");
        resolve();
      };
      req.onerror = () => {
        console.log("DB delete error");
        resolve();
      };
      req.onblocked = () => {
        console.log("DB delete blocked");
        resolve();
      };
    } catch (e) {
      resolve();
    }
  });
};

let dbInitialized = false;

export async function saveContentOffline(data: unknown[]): Promise<void> {
  if (!data || data.length === 0) return;
  
  try {
    if (!dbInitialized) {
      await deleteOldDB();
      dbInitialized = true;
    }
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    for (const item of data) {
      const itemObj = item as Record<string, unknown>;
      const id = itemObj._id || itemObj.id;
      if (id) {
        store.put({ ...itemObj, _id: String(id), cachedAt: Date.now() });
      }
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error("Error saving content offline:", error);
  }
}

export async function getOfflineContent(): Promise<unknown[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    return new Promise<unknown[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error getting offline content:", error);
    return [];
  }
}

export default function ServiceWorkerRegistration() {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration.scope);
          setIsRegistered(true);

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  newWorker.postMessage({ type: "SKIP_WAITING" });
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return null;
}
