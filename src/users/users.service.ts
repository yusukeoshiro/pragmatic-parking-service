import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { firebaseClient } from 'src/lib/firebase'
import { UserCreateDto, UserDto } from './dto/user.dto'
import admin from 'firebase-admin'

@Injectable()
export class UsersService {
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

  async list(): Promise<UserDto[]> {
    const q = await firebaseClient.db.collection('users').get()
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
