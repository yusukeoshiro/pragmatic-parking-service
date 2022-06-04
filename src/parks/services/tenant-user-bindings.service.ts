import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { firebaseClient } from 'src/lib/firebase'
import {
  TenantUserBindingCreateDto,
  TenantUserBindingDeleteDto,
  TenantUserBindingDto,
  TenantUserBindingListDto,
} from '../dto/tenant-user.dto'
import admin from 'firebase-admin'

@Injectable()
export class TenantUserBindingsService {
  async delete(data: TenantUserBindingDeleteDto) {
    await this.getById(data.id)
    await firebaseClient.db
      .collection('tenant_user_bindings')
      .doc(data.id)
      .delete()
  }

  async create(data: TenantUserBindingCreateDto) {
    const list = await this.list(data)
    if (list.length > 0) throw new BadRequestException(`already exists`)

    const ref = firebaseClient.db.collection('tenant_user_bindings').doc()
    await ref.set({
      ...data,
      id: ref.id,
    })

    return await this.getById(ref.id)
  }

  async list(data: TenantUserBindingListDto) {
    let ref: admin.firestore.Query | admin.firestore.CollectionReference =
      firebaseClient.db.collection('tenant_user_bindings')

    if (data.tenantId) {
      ref = ref.where('tenantId', '==', data.tenantId)
    }
    if (data.userId) {
      ref = ref.where('userId', '==', data.userId)
    }

    const q = await ref.get()
    return q.docs.map((doc) => doc2TenantUserBinding(doc.data()))
  }

  async getById(id: string) {
    const q = await firebaseClient.db
      .collection('tenant_user_bindings')
      .doc(id)
      .get()
    if (!q.exists)
      throw new NotFoundException(`tenant user binding ${id} does not exist`)

    return doc2TenantUserBinding(q.data())
  }
}
const doc2TenantUserBinding = (
  data: admin.firestore.DocumentData,
): TenantUserBindingDto => {
  data.createdAt = data.createdAt?.toDate()
  return data as TenantUserBindingDto
}
