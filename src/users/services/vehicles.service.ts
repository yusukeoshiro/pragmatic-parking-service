import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { firebaseClient } from 'src/lib/firebase'
import {
  VehicleCreateDto,
  VehicleDto,
  VehicleFindByNumberDto,
  VehicleListDto,
  VehicleQueryDto,
} from '../dto/vehicle.dto'
import admin from 'firebase-admin'
import { UsersService } from './users.service'

@Injectable()
export class VehiclesService {
  constructor(private usersService: UsersService) {}
  async createAnonymous(dataVehicle: VehicleQueryDto): Promise<VehicleDto> {
    const user = await this.usersService.createAnonymous()
    const data: VehicleCreateDto = {
      ...dataVehicle,
      name: 'anonymous',
      userId: user.id,
    }
    return await this.create(data)
  }

  async query(data: VehicleQueryDto): Promise<VehicleDto | undefined> {
    const q = await firebaseClient.db
      .collection('vehicles')
      .where('number', '==', data.number)
      .where('letter', '==', data.letter)
      .where('classNumber', '==', data.classNumber)
      .where('regionName', '==', data.regionName)
      .where('isDeleted', '==', false)
      .limit(1)
      .get()
    if (q.empty) {
      return undefined
    }
    return doc2Vehicle(q.docs[0].data())
  }

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
      isDeleted: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    return await this.getById(ref.id)
  }

  async list(data: VehicleListDto): Promise<VehicleDto[]> {
    let ref: admin.firestore.CollectionReference | admin.firestore.Query =
      firebaseClient.db.collection('vehicles').where('isDeleted', '==', false)

    if (data && data.userId) {
      ref = ref.where('userId', '==', data.userId)
    }

    const q = await ref.get()

    return q.docs.map((d) => doc2Vehicle(d.data()))
  }

  async findFirst(data: VehicleFindByNumberDto) {
    const q = await firebaseClient.db
      .collection('vehicles')
      .where('letter', '==', data.letter)
      .where('classNumber', '==', data.classNumber)
      .where('regionName', '==', data.regionName)
      .where('number', '==', data.number)
      .where('isDeleted', '==', false)
      .limit(1)
      .get()

    if (q.empty) return undefined

    return doc2Vehicle(q.docs[0].data())
  }

  async getById(id: string): Promise<VehicleDto> {
    const q = await firebaseClient.db.collection('vehicles').doc(id).get()
    if (!q.exists) throw new NotFoundException(`vehicle ${id} does not exist`)

    return doc2Vehicle(q.data())
  }

  async deleteById(id: string): Promise<void> {
    const vehicle = await this.getById(id)
    if (vehicle.isDeleted)
      throw new NotFoundException(`vehicle ${id} not found`)

    await firebaseClient.db.collection('vehicles').doc(id).update({
      isDeleted: true,
    })
  }
}

const doc2Vehicle = (doc: admin.firestore.DocumentData) => {
  doc.createdAt = doc.createdAt?.toDate()
  return doc as VehicleDto
}
