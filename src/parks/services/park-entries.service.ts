import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  ParkEntryCreateDto,
  ParkEntryDto,
  ParkEntryExitDto,
  ParkEntryListDto,
  ParkEntryStatus,
} from 'src/parks/dto/park-entry.dto'
import admin from 'firebase-admin'
import { firebaseClient } from 'src/lib/firebase'
import { Storage } from '@google-cloud/storage'
import { ConfigService } from '@nestjs/config'
import fs from 'fs'

const storage = new Storage()

@Injectable()
export class ParkEntriesService {
  imagesBucket: string
  constructor(private cs: ConfigService) {
    this.imagesBucket = this.cs.get('imagesBucket')
  }
  async create(data: ParkEntryCreateDto) {
    const { image, ...parkEntryCreateDto } = data

    const ref = firebaseClient.db.collection('park_entries').doc()
    const fileName = `${ref.id}.jpg`
    fs.writeFileSync(
      fileName,
      image.replace(/^data:image\/jpeg;base64,/, ''),
      'base64',
    )

    await storage.bucket(this.imagesBucket).upload(fileName)
    fs.unlinkSync(fileName)

    await ref.set({
      ...parkEntryCreateDto,
      id: ref.id,
      entryTime: parkEntryCreateDto.entryTime ?? new Date(),
      ...(parkEntryCreateDto.exitTime && {
        exitTime: parkEntryCreateDto.exitTime,
      }),
      status: parkEntryCreateDto.exitTime
        ? ParkEntryStatus.EXITED
        : ParkEntryStatus.IN_PARKING,
    })

    return this.getById(ref.id)
  }

  async exit(data: ParkEntryExitDto) {
    const entry = await this.getById(data.id)
    if (entry.status === ParkEntryStatus.EXITED)
      throw new BadRequestException(`this entry is already exited`)

    await firebaseClient.db.collection('park_entries').doc(data.id).update({
      exitTime: admin.firestore.FieldValue.serverTimestamp(),
      status: ParkEntryStatus.EXITED,
    })
    return this.getById(data.id)
  }

  async getById(id: string): Promise<ParkEntryDto> {
    const q = await firebaseClient.db.collection('park_entries').doc(id).get()
    if (!q.exists) throw new NotFoundException(`${id} does not exist`)

    return doc2ParkEntry(q.data())
  }

  async list(data: ParkEntryListDto): Promise<ParkEntryDto[]> {
    let ref: admin.firestore.CollectionReference | admin.firestore.Query =
      firebaseClient.db.collection('park_entries')

    if (data.parkId) {
      ref = ref.where('parkId', '==', data.parkId)
    }

    if (data.userId) {
      ref = ref.where('userId', '==', data.userId)
    }

    if (data.vehicleId) {
      ref = ref.where('vehicleId', '==', data.vehicleId)
    }

    if (data.status) {
      ref = ref.where('status', '==', data.status)
    }

    const q = await ref.get()
    return q.docs.map((doc) => doc2ParkEntry(doc.data()))
  }
}

const doc2ParkEntry = (data: admin.firestore.DocumentData): ParkEntryDto => {
  data.entryTime = data.entryTime ? data.entryTime.toDate() : undefined
  data.exitTime = data.exitTime ? data.exitTime.toDate() : undefined
  return data as ParkEntryDto
}
