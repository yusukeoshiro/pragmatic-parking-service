import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { firebaseClient } from 'src/lib/firebase'
import { VehicleCreateDto, VehicleDto, VehicleListDto } from './dto/vehicle.dto'
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
    const q = await firebaseClient.db
      .collection('vehicles')
      .where('userId', '==', data.userId)
      .get()

    return q.docs
      .map((d) => d.data())
      .map((d) => {
        d.createdAt = d.createdAt?.toDate()
        return d
      }) as VehicleDto[]
  }

  async getById(id: string): Promise<VehicleDto> {
    const q = await firebaseClient.db.collection('vehicles').doc(id).get()
    if (!q.exists) throw new NotFoundException(`${id} does not exist`)

    const data = q.data()
    data.createdAt = data.createdAt?.toDate()
    return data as VehicleDto
  }
}
