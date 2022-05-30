import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { firebaseClient } from 'src/lib/firebase'
import { UserCreateDto, UserDto, UserListDto } from '../dto/user.dto'
import admin from 'firebase-admin'
import { VehicleCreateDto } from '../dto/vehicle.dto'
import { Args } from '@nestjs/graphql'

@Injectable()
export class UsersService {
  async createAnonymous(): Promise<UserDto> {
    const ref = firebaseClient.db.collection('users').doc()
    const data: UserCreateDto = {
      id: `${ref.id}@anonymous.com`,
      firstName: 'anonymous',
      lastName: 'anonymous',
      isAnonymous: true,
    }
    return await this.create(data)
  }

  async create(data: UserCreateDto): Promise<UserDto> {
    const exists = await firebaseClient.exists(`/users/${data.id}`)
    if (exists) throw new ConflictException(`${data.id} already exists`)

    await firebaseClient.db
      .collection('users')
      .doc(data.id)
      .set({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })
    return await this.getById(data.id)
  }

  async list(data?: UserListDto): Promise<UserDto[]> {
    let ref: admin.firestore.CollectionReference | admin.firestore.Query =
      firebaseClient.db.collection('users')
    if (data && data.isAnonymous !== undefined) {
      ref = ref.where('isAnonymous', '==', data.isAnonymous)
    }
    const q = await ref.get()
    return q.docs.map((doc) => doc2User(doc.data()))
  }

  async getById(id: string): Promise<UserDto> {
    const q = await firebaseClient.db.collection('users').doc(id).get()
    if (!q.exists) throw new NotFoundException(`${id} does not exist`)

    return doc2User(q.data())
  }
}

const doc2User = (doc: admin.firestore.DocumentData): UserDto => {
  doc.createdAt = doc.createdAt?.toDate()
  return doc as UserDto
}
