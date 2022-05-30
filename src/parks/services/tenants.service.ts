import { Injectable, NotFoundException } from '@nestjs/common'
import { ParkListDto } from '../dto/park.dto'
import { TenantCreateDto, TenantDto, TenantListDto } from '../dto/tenant.dto'
import admin from 'firebase-admin'
import { firebaseClient } from 'src/lib/firebase'

@Injectable()
export class TenantsService {
  async create(data: TenantCreateDto): Promise<TenantDto> {
    const ref = firebaseClient.db.collection('tenants').doc()
    await ref.set({
      ...data,
      id: ref.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    return await this.getById(ref.id)
  }

  async list(data?: TenantListDto): Promise<TenantDto[]> {
    let ref: admin.firestore.Query | admin.firestore.CollectionReference =
      firebaseClient.db.collection('tenants')
    if (data && data.parkId) {
      ref = ref.where('parkId', '==', data.parkId)
    }

    const q = await ref.get()
    return q.docs.map((doc) => doc2Tenant(doc.data()))
  }

  async getById(id: string): Promise<TenantDto> {
    const q = await firebaseClient.db.collection('tenants').doc(id).get()
    if (!q.exists) throw new NotFoundException(`tenant ${id} not found`)

    return doc2Tenant(q.data())
  }
}

const doc2Tenant = (data: admin.firestore.DocumentData): TenantDto => {
  data.createdAt = data.createdAt?.toDate()
  return data as TenantDto
}
