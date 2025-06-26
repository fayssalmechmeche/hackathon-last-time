import { getDatabase } from "../db/client.js";
import type {
  ServiceDocument,
  ServiceDocumentInsert,
  ServiceDocumentUpdate,
} from "../db/schema.js";

const COLLECTION_NAME = "services";

export async function createService(
  service: ServiceDocumentInsert
): Promise<ServiceDocument> {
  const db = getDatabase();
  const collection = db.collection<ServiceDocument>(COLLECTION_NAME);

  const now = new Date();
  const serviceWithTimestamps: ServiceDocument = {
    ...service,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(serviceWithTimestamps);

  if (!result.acknowledged) {
    throw new Error("Failed to create service");
  }

  return serviceWithTimestamps;
}

export async function findServiceById(
  id: string
): Promise<ServiceDocument | null> {
  const db = getDatabase();
  const collection = db.collection<ServiceDocument>(COLLECTION_NAME);

  return await collection.findOne({ _id: id });
}

export async function findServicesByUserId(
  userId: string
): Promise<ServiceDocument[]> {
  const db = getDatabase();
  const collection = db.collection<ServiceDocument>(COLLECTION_NAME);

  return await collection.find({ createdBy: userId }).toArray();
}

export async function findAllActiveServices(): Promise<ServiceDocument[]> {
  const db = getDatabase();
  const collection = db.collection<ServiceDocument>(COLLECTION_NAME);

  return await collection.find({ status: "active" }).toArray();
}

export async function updateService(
  id: string,
  updates: ServiceDocumentUpdate
): Promise<ServiceDocument | null> {
  const db = getDatabase();
  const collection = db.collection<ServiceDocument>(COLLECTION_NAME);

  const updatesWithTimestamp = {
    ...updates,
    updatedAt: new Date(),
  };

  const result = await collection.findOneAndUpdate(
    { _id: id },
    { $set: updatesWithTimestamp },
    { returnDocument: "after" }
  );

  return result || null;
}

export async function deleteService(id: string): Promise<boolean> {
  const db = getDatabase();
  const collection = db.collection<ServiceDocument>(COLLECTION_NAME);

  const result = await collection.deleteOne({ _id: id });
  return result.deletedCount === 1;
}
