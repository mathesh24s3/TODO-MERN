const mongodb = require("mongodb");

const { MongoClient } = mongodb;

let db;

async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();
  console.log("Databases: ");
  databasesList.databases.forEach((db) => {
    console.log(db.name);
  });
}

async function connectDb() {
  const client = new MongoClient("mongodb://localhost:27017/", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("MERN");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function getDb() {
  if (!db) throw new Error("Database not initialized");
  return db;
}

module.exports = {
  connectDb,
  getDb,
};
