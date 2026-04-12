import { closeMongoClient, getDb, getMongoClient, getMongoConfig } from "./lib/mongodb.mjs";

try {
  const { dbName } = getMongoConfig();
  const client = await getMongoClient();
  const db = await getDb();
  const admin = client.db("admin").admin();
  const now = new Date();

  await db.collection("app_health").updateOne(
    { _id: "mongodb-connection" },
    {
      $set: {
        appName: "losaltoshacks",
        status: "connected",
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );

  const databases = await admin.listDatabases();
  const collections = await db.listCollections({}, { nameOnly: true }).toArray();

  console.log(
    JSON.stringify(
      {
        ok: true,
        dbName,
        initializedCollection: "app_health",
        databases: databases.databases.map(database => database.name).sort(),
        collections: collections.map(collection => collection.name).sort(),
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error(
    JSON.stringify(
      {
        ok: false,
        name: error?.name,
        message: error?.message,
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
} finally {
  await closeMongoClient();
}
