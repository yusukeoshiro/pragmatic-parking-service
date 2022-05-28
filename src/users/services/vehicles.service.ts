import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { firebaseClient } from 'src/lib/firebase'
import {
  VehicleCreateDto,
  VehicleDto,
  VehicleListDto,
} from '../dto/vehicle.dto'
import admin from 'firebase-admin'

@Injectable()
export class VehiclesService {
  async create(data: VehicleCreateDto): Promise<VehicleDto> {
    const list = await this.list(data)
    if (list.length > 30) {
      throw new BadRequestException(`you cannot add more than 30 vehicles`)
    }
    for (const v of list) {
      if (v.name === data.name) {
        const message = `${v.name} is already taken. choose a different name`
        throw new BadRequestException(message)
      }

      if (
        `${v.regionName}${v.classNumber}${v.letter}${v.number}` ===
        `${data.regionName}${data.classNumber}${data.letter}${data.number}`
      ) {
        const message = `You already have exactly the same vehicle added. Duplicate addition is not allowed.`
        throw new BadRequestException(message)
      }
    }

    const ref = firebaseClient.db.collection('vehicles').doc()
    await ref.set({
      ...data,
      id: ref.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    return await this.getById(ref.id)
  }

  async list(data: VehicleListDto): Promise<VehicleDto[]> {
    let ref: admin.firestore.CollectionReference | admin.firestore.Query =
      firebaseClient.db.collection('vehicles')

    if (data && data.userId) {
      ref = ref.where('userId', '==', data.userId)
    }

    const q = await firebaseClient.db
      .collection('vehicles')

      .get()

    return q.docs.map((d) => doc2Vehicle(d.data()))
  }

  async getById(id: string): Promise<VehicleDto> {
    const q = await firebaseClient.db.collection('vehicles').doc(id).get()
    if (!q.exists) throw new NotFoundException(`${id} does not exist`)

    return doc2Vehicle(q.data())
  }
}

const doc2Vehicle = (doc: admin.firestore.DocumentData) => {
  doc.createdAt = doc.createdAt?.toDate()
  return doc as VehicleDto
}
