import { ObjectId, Collection } from 'mongodb';
import { getDatabase } from '../mongodb';

export type Gender = 'male' | 'female' | 'other';

export interface User {
  _id?: ObjectId;
  name: string;
  age: number;
  gender: Gender;
  language: string;
  healthGoal?: string;
  onboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  age: number;
  gender: Gender;
  language: string;
  healthGoal?: string;
}

export interface UpdateUserData {
  name?: string;
  age?: number;
  gender?: Gender;
  language?: string;
  healthGoal?: string;
}

class UserModel {
  private async getCollection(): Promise<Collection<User>> {
    const db = await getDatabase();
    return db.collection<User>('users');
  }

  async ensureIndexes(): Promise<void> {
    const collection = await this.getCollection();
    await collection.createIndexes([
      { key: { language: 1 } },
      { key: { createdAt: 1 } },
      { key: { onboarded: 1 } },
    ]);
  }

  async create(data: CreateUserData): Promise<User> {
    const collection = await this.getCollection();
    const user: User = {
      ...data,
      onboarded: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async findById(id: string): Promise<User | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  async update(id: string, data: UpdateUserData): Promise<User | null> {
    const collection = await this.getCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    return result || null;
  }

  async setOnboarded(id: string, onboarded: boolean): Promise<User | null> {
    const collection = await this.getCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          onboarded,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    return result || null;
  }

  async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async getAll(limit = 100, skip = 0): Promise<User[]> {
    const collection = await this.getCollection();
    return await collection
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }
}

export const userModel = new UserModel();
