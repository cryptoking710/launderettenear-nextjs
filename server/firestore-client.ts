// Firestore client for backend operations
// Uses Firestore REST API to avoid need for service account credentials in development

interface FirestoreDocument {
  name?: string;
  fields: Record<string, any>;
  createTime?: string;
  updateTime?: string;
}

interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  arrayValue?: { values: FirestoreValue[] };
  mapValue?: { fields: Record<string, FirestoreValue> };
}

function toFirestoreValue(value: any): FirestoreValue {
  if (value === null || value === undefined) {
    return { stringValue: "" };
  }
  
  if (typeof value === "string") {
    return { stringValue: value };
  }
  
  if (typeof value === "number") {
    return Number.isInteger(value) 
      ? { integerValue: value.toString() } 
      : { doubleValue: value };
  }
  
  if (typeof value === "boolean") {
    return { booleanValue: value };
  }
  
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map(toFirestoreValue)
      }
    };
  }
  
  if (typeof value === "object") {
    const fields: Record<string, FirestoreValue> = {};
    for (const [key, val] of Object.entries(value)) {
      fields[key] = toFirestoreValue(val);
    }
    return { mapValue: { fields } };
  }
  
  return { stringValue: String(value) };
}

function fromFirestoreValue(value: FirestoreValue): any {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return parseInt(value.integerValue);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.arrayValue) {
    return value.arrayValue.values?.map(fromFirestoreValue) || [];
  }
  if (value.mapValue?.fields) {
    const obj: any = {};
    for (const [key, val] of Object.entries(value.mapValue.fields)) {
      obj[key] = fromFirestoreValue(val);
    }
    return obj;
  }
  return null;
}

function documentToData(doc: FirestoreDocument): any {
  const data: any = {};
  
  if (!doc.fields) return data;
  
  for (const [key, value] of Object.entries(doc.fields)) {
    data[key] = fromFirestoreValue(value);
  }
  
  return data;
}

function dataToDocument(data: any): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {};
  
  for (const [key, value] of Object.entries(data)) {
    fields[key] = toFirestoreValue(value);
  }
  
  return fields;
}

const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

export const firestoreClient = {
  collection(collectionName: string) {
    return {
      async get() {
        try {
          const response = await fetch(`${baseUrl}/${collectionName}`);
          
          if (!response.ok) {
            throw new Error(`Firestore request failed: ${response.statusText}`);
          }
          
          const data = await response.json();
          const documents = data.documents || [];
          
          return {
            docs: documents.map((doc: FirestoreDocument) => {
              const id = doc.name?.split('/').pop() || '';
              return {
                id,
                data: () => documentToData(doc),
                exists: true
              };
            })
          };
        } catch (error) {
          console.error("Firestore collection get error:", error);
          throw error;
        }
      },
      
      async add(data: any) {
        try {
          const response = await fetch(`${baseUrl}/${collectionName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fields: dataToDocument(data) })
          });
          
          if (!response.ok) {
            throw new Error(`Firestore create failed: ${response.statusText}`);
          }
          
          const doc = await response.json();
          const id = doc.name?.split('/').pop() || '';
          
          return {
            id,
            get: async () => ({
              id,
              data: () => documentToData(doc),
              exists: true
            })
          };
        } catch (error) {
          console.error("Firestore add error:", error);
          throw error;
        }
      },
      
      doc(docId: string) {
        return {
          async get() {
            try {
              const response = await fetch(`${baseUrl}/${collectionName}/${docId}`);
              
              if (response.status === 404) {
                return { id: docId, exists: false, data: () => ({}) };
              }
              
              if (!response.ok) {
                throw new Error(`Firestore request failed: ${response.statusText}`);
              }
              
              const doc = await response.json();
              
              return {
                id: docId,
                data: () => documentToData(doc),
                exists: true
              };
            } catch (error) {
              console.error("Firestore doc get error:", error);
              throw error;
            }
          },
          
          async update(data: any) {
            try {
              const response = await fetch(`${baseUrl}/${collectionName}/${docId}?updateMask.fieldPaths=*`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fields: dataToDocument(data) })
              });
              
              if (!response.ok) {
                throw new Error(`Firestore update failed: ${response.statusText}`);
              }
              
              return await response.json();
            } catch (error) {
              console.error("Firestore update error:", error);
              throw error;
            }
          },
          
          async delete() {
            try {
              const response = await fetch(`${baseUrl}/${collectionName}/${docId}`, {
                method: 'DELETE'
              });
              
              if (!response.ok && response.status !== 404) {
                throw new Error(`Firestore delete failed: ${response.statusText}`);
              }
            } catch (error) {
              console.error("Firestore delete error:", error);
              throw error;
            }
          }
        };
      }
    };
  }
};
