// Storage interface for future backend operations
// Currently using Firebase Firestore directly from the client
// This file is kept for potential future server-side operations

export interface IStorage {
  // Placeholder for future backend operations
}

export class MemStorage implements IStorage {
  constructor() {
    // Placeholder
  }
}

export const storage = new MemStorage();
