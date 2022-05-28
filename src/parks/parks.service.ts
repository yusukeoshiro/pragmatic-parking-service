import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { firebaseClient } from 'src/lib/firebase'
import { ParkCreateDto, ParkDto, ParkListDto } from './dto/park.dto'
import {
  geohashForLocation,
  geohashQueryBounds,
  distanceBetween,
} from 'geofire-common'
import admin from 'firebase-admin'

@Injectable()
export class ParksService {
  async create(data: ParkCreateDto) {
    const ref = firebaseClient.db.collection('parks').doc()
    await ref.set({
      ...data,
      id: ref.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      geoHash: geohashForLocation([data.latitude, data.longitude]),
    })
    return await this.getById(ref.id)
  }

  async list(data?: ParkListDto): Promise<ParkDto[]> {
    if (!data || Object.keys(data).length === 0) {
      const q = await firebaseClient.db.collection('parks').get()
      return q.docs.map((doc) => doc2Park(doc.data()))
    }

    if (data.center && data.distance) {
      const distanceM = data.distance * 1000 // in meter

      const bounds = geohashQueryBounds(
        [data.center.latitude, data.center.longitude],
        distanceM,
      )
      const promises = bounds.map((b) =>
        firebaseClient.db
          .collection('parks')
          .orderBy('geoHash')
          .startAt(b[0])
          .endAt(b[1])
          .get(),
      )
      const qs = await Promise.all(promises)
      const parks = qs
        .map((q) => q.docs.map((doc) => doc.data()))
        .flat()
        .map((park) => doc2Park(park))
        .filter(
          (park) =>
            distanceBetween(
              [data.center.latitude, data.center.longitude],
              [park.latitude, park.longitude],
            ) < data.distance,
        )
        .sort((a, b) => {
          return (
            distanceBetween(
              [data.center.latitude, data.center.longitude],
              [a.latitude, a.longitude],
            ) -
            distanceBetween(
              [data.center.latitude, data.center.longitude],
              [b.latitude, b.longitude],
            )
          )
        })

      return parks
    }

    throw new BadRequestException()
  }

  async getById(id: string): Promise<ParkDto> {
    const q = await firebaseClient.db.collection('parks').doc(id).get()
    if (!q.exists) throw new NotFoundException(`${id} does not exist`)

    return doc2Park(q.data())
  }
}

const doc2Park = (data: admin.firestore.DocumentData): ParkDto => {
  data.createdAt = data.createdAt?.toDate()
  return data as ParkDto
}
