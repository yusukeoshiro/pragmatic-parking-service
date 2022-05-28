import admin from 'firebase-admin'
import _ from 'lodash'
const BATCH_SIZE = 5

if (admin.apps.length === 0) admin.initializeApp()

const setting: FirebaseFirestore.Settings = {
  ignoreUndefinedProperties: true,
}

export class FirebaseClient {
  db: admin.firestore.Firestore
  auth: admin.auth.Auth
  constructor() {
    this.db = admin.firestore()
    try {
      this.db.settings(setting)
    } catch (error) {
      // do nothing
    }
    this.auth = admin.auth()
  }

  public async exists(path: string) {
    const snapshot = await this.db.doc(path).get()
    return snapshot.exists
  }

  public async getDoc(path: string) {
    const snapshot = await this.db.doc(path).get()
    return snapshot.data()
  }

  public async deleteNonExistingDocs(
    docIdsToKeep: Array<string>,
    ref:
      | FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
      | FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
  ): Promise<DeletionResult> {
    const actualDocs = await ref.get()
    const deletedIds = new Array<string>()
    const existingIds = new Array<string>()

    for (const chunk of _.chunk(actualDocs.docs, BATCH_SIZE)) {
      const deleteRequests = new Array<Promise<any>>()
      chunk.forEach((doc: any) => {
        if (docIdsToKeep.includes(doc.id)) {
          existingIds.push(doc.id)
        } else {
          deleteRequests.push(doc.ref.delete())
          deletedIds.push(doc.id)
        }
      })
      await Promise.all(deleteRequests)
    }
    return { deletedIds, existingIds }
  }
}

type DeletionResult = {
  deletedIds: Array<string>
  existingIds: Array<string>
}

export const firebaseClient = new FirebaseClient()
