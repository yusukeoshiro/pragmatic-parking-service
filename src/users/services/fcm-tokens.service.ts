import { Injectable, NotFoundException } from '@nestjs/common'
import admin from 'firebase-admin'
import { firebaseClient } from 'src/lib/firebase'
import {
  FcmTokenCreateDto,
  FcmTokenDto,
  FcmTokenListDto,
} from '../dto/fcm-token.dto'

@Injectable()
export class FcmTokensService {
  private async updateLastUsedAt(token: FcmTokenDto) {
    await firebaseClient.db.collection('fcm_tokens').doc(token.id).update({
      lastUsedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    return await this.getById(token.id)
  }

  async create(data: FcmTokenCreateDto): Promise<FcmTokenDto> {
    const token: FcmTokenDto | undefined = await this.getByTokenAndUser(
      data.token,
      data.userId,
    ).catch(() => undefined)
    if (token) {
      return await this.updateLastUsedAt(token)
    }
    const ref = firebaseClient.db.collection('fcm_tokens').doc()
    const timestamp = admin.firestore.FieldValue.serverTimestamp()
    await ref.set({
      ...data,
      createdAt: timestamp,
      lastUsedAt: timestamp,
      id: ref.id,
    })

    return await this.getById(ref.id)
  }

  async list(data: FcmTokenListDto) {
    const q = await firebaseClient.db
      .collection('fcm_tokens')
      .where('userId', '==', data.userId)
      .get()

    return q.docs.map((doc) => doc2FcmToken(doc.data()))
  }

  async getByTokenAndUser(token: string, userId: string) {
    const q = await firebaseClient.db
      .collection('fcm_tokens')
      .where('token', '==', token)
      .where('userId', '==', userId)
      .limit(1)
      .get()

    if (q.empty)
      throw new NotFoundException(
        `fcmtoken ending with ${token.slice(-4)} for ${userId} was not found`,
      )

    return doc2FcmToken(q.docs[0].data())
  }

  async getById(id: string): Promise<FcmTokenDto> {
    const q = await firebaseClient.db.collection('fcm_tokens').doc(id).get()
    if (!q.exists) throw new NotFoundException(`fcmtoken ${id} does not exist`)

    return doc2FcmToken(q.data())
  }
}

const doc2FcmToken = (doc: admin.firestore.DocumentData): FcmTokenDto => {
  doc.createdAt = doc.createdAt?.toDate()
  doc.lastUsedAt = doc.lastUsedAt?.toDate()
  return doc as FcmTokenDto
}
