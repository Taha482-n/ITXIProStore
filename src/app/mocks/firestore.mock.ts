// src/app/mocks/firestore.mock.ts
/**
 * MockFirestore simulates Firebase's Firestore service for testing purposes.
 */
export class MockFirestore {
  // In-memory data store: { collectionName: { docId: data } }
  private collections: { [collectionName: string]: { [docId: string]: any } } = {};

  /**
   * Retrieves a mock collection reference.
   * @param collectionName The name of the collection.
   * @returns An object with a `doc` method to access documents within the collection.
   */
  collection(collectionName: string) {
    // Initialize the collection if it doesn't exist
    if (!this.collections[collectionName]) {
      this.collections[collectionName] = {};
    }

    return {
      /**
       * Retrieves a mock document reference.
       * @param docId The ID of the document.
       * @returns An object with `set`, `get`, `update`, and `delete` methods to manipulate the document.
       */
      doc: (docId: string) => ({
        /**
         * Sets data for the specified document.
         * @param data The data to set in the document.
         * @returns A promise that resolves when the operation is complete.
         */
        set: (data: any): Promise<void> => {
          this.collections[collectionName][docId] = data;
          return Promise.resolve();
        },

        /**
         * Retrieves data from the specified document.
         * @returns A promise that resolves with the document data or indicates if it exists.
         */
        get: (): Promise<{ exists: boolean; data: () => any }> => {
          const docData = this.collections[collectionName][docId];
          return Promise.resolve({
            exists: !!docData,
            data: () => docData,
          });
        },

        /**
         * Updates data for the specified document.
         * @param data The data to update in the document.
         * @returns A promise that resolves when the operation is complete.
         */
        update: (data: any): Promise<void> => {
          if (!this.collections[collectionName][docId]) {
            return Promise.reject(new Error('Document does not exist'));
          }
          this.collections[collectionName][docId] = {
            ...this.collections[collectionName][docId],
            ...data,
          };
          return Promise.resolve();
        },

        /**
         * Deletes the specified document.
         * @returns A promise that resolves when the operation is complete.
         */
        delete: (): Promise<void> => {
          delete this.collections[collectionName][docId];
          return Promise.resolve();
        },
      }),
    };
  }

  /**
   * Retrieves a mock document reference directly.
   * @param path The path to the document (e.g., 'users/123').
   * @returns An object with `set`, `get`, `update`, and `delete` methods to manipulate the document.
   */
  doc(path: string) {
    const [collectionName, docId] = path.split('/');
    return this.collection(collectionName).doc(docId);
  }

  /**
   * Seeds the mock Firestore with initial data.
   * @param collectionName The name of the collection.
   * @param docId The ID of the document.
   * @param data The data to set in the document.
   */
  seedData(collectionName: string, docId: string, data: any): void {
    if (!this.collections[collectionName]) {
      this.collections[collectionName] = {};
    }
    this.collections[collectionName][docId] = data;
  }

  /**
   * Clears all data from the mock Firestore.
   */
  clearData(): void {
    this.collections = {};
  }

  // Add other Firestore methods as needed
}
