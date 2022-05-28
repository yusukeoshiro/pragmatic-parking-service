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

@Injectable()
export class ParkEntriesService {
  async create(data: ParkEntryCreateDto) {
    const ref = firebaseClient.db.collection('park_entries').doc()
    await ref.set({
      ...data,
      id: ref.id,
      entryTime: data.entryTime ?? new Date(),
      ...(data.exitTime && { exitTime: data.exitTime }),
      status: data.exitTime
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

    const q = await ref.get()
    return q.docs.map((doc) => doc2ParkEntry(doc.data()))
  }
}

const doc2ParkEntry = (data: admin.firestore.DocumentData): ParkEntryDto => {
  data.entryTime = data.entryTime ? data.entryTime.toDate() : undefined
  data.exitTime = data.exitTime ? data.exitTime.toDate() : undefined
  return data as ParkEntryDto
}
