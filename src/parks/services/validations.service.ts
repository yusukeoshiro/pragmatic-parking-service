import { Injectable, NotFoundException } from '@nestjs/common'
import admin from 'firebase-admin'
import { firebaseClient } from 'src/lib/firebase'
import {
  ValidationCreateDto,
  ValidationDto,
  ValidationListDto,
} from '../dto/validation.dto'

@Injectable()
export class ValidationsService {
  async create(data: ValidationCreateDto) {
    const ref = firebaseClient.db.collection('validations').doc()
    await ref.set({
      ...data,
      id: ref.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    return await this.getById(ref.id)
  }

  async list(data: ValidationListDto) {
    let ref: admin.firestore.Query | admin.firestore.CollectionReference =
      firebaseClient.db.collection('validations')

    if (data?.tenantId) {
      ref = ref.where('tenantId', '==', data.tenantId)
    }
    if (data?.parkEntryId) {
      ref = ref.where('parkEntryId', '==', data.parkEntryId)
    }

    const q = await ref.get()
    return q.docs.map((doc) => doc2Validation(doc.data()))
  }

  async getById(id: string) {
    const q = await firebaseClient.db.collection('validations').doc(id).get()
    if (!q.exists) throw new NotFoundException(`validation ${id} does not exist`)

    return doc2Validation(q.data())
  }
}

const doc2Validation = (data: admin.firestore.DocumentData): ValidationDto => {
  data.createdAt = data.createdAt?.toDate()
  return data as ValidationDto
}
