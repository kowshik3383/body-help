import { ObjectId, Collection } from 'mongodb';
import { getDatabase } from '../mongodb';

export interface DiseaseCache {
  _id?: ObjectId;
  age: number;
  gender: string;
  bodyPart: string;
  language: string;
  response: unknown;
  createdAt: Date;
}

export interface DiseaseCacheQuery {
  age: number;
  gender: string;
  bodyPart: string;
  language: string;
}

class DiseaseCacheModel {
  private async getCollection(): Promise<Collection<DiseaseCache>> {
    const db = await getDatabase();
    return db.collection<DiseaseCache>('disease_cache');
  }

  async ensureIndexes(): Promise<void> {
    const collection = await this.getCollection();
    await collection.createIndexes([
      {
        key: { age: 1, gender: 1, bodyPart: 1, language: 1 },
        unique: true,
      },
      {
        key: { createdAt: 1 },
        expireAfterSeconds: 86400, // 24 hours TTL
      },
    ]);
  }

  async find(query: DiseaseCacheQuery): Promise<DiseaseCache | null> {
    const collection = await this.getCollection();
    return await collection.findOne(query);
  }

  async store(
    query: DiseaseCacheQuery,
    response: unknown
  ): Promise<DiseaseCache> {
    const collection = await this.getCollection();
    const cache: DiseaseCache = {
      ...query,
      response,
      createdAt: new Date(),
    };

    // Use upsert to avoid duplicates
    const result = await collection.findOneAndUpdate(
      query,
      { $set: cache },
      { upsert: true, returnDocument: 'after' }
    );

    return result || cache;
  }

  async clearByLanguage(language: string): Promise<number> {
    const collection = await this.getCollection();
    const result = await collection.deleteMany({ language });
    return result.deletedCount;
  }

  async clearByBodyPart(bodyPart: string): Promise<number> {
    const collection = await this.getCollection();
    const result = await collection.deleteMany({ bodyPart });
    return result.deletedCount;
  }

  async clearAll(): Promise<number> {
    const collection = await this.getCollection();
    const result = await collection.deleteMany({});
    return result.deletedCount;
  }
}

export const diseaseCacheModel = new DiseaseCacheModel();
