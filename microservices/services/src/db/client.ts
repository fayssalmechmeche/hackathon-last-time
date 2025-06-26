import { Db, MongoClient } from "mongodb";

let client: MongoClient;
let db: Db;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const dbName = process.env.MONGODB_DB || "hackathon";

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  console.log("Connected to MongoDB");
  return db;
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error(
      "Database not initialized. Call connectToDatabase() first."
    );
  }
  return db;
}

export async function disconnectFromDatabase(): Promise<void> {
  if (client) {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}
