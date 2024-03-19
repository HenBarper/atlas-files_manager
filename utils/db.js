const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const dbURL = `mongodb://${host}:${port}/${database}`;

class DBClient {
  constructor() {
    MongoClient.connect(dbURL, { useUnifiedTopology: true }, (error, client) => {
      if (client) {
        this.db = client.db(database);
        this.users = this.db.collection('users');
        this.files = this.db.collection('files');
      }
      if (error) {
        this.db = false;
        console.log(error);
      }
    });
    // this.client = new MongoClient(this.dbURL, { useUnifiedTopology: true });
    // this.client.connect();
  }

  isAlive() {
    if (!this.db) {
      return !!this.db;
    }
    return !!this.db;
  }

  async nbUsers() {
    const db = this.client.db();
    const usersCollection = db.collection('users');
    return usersCollection.countDocuments();
  }

  async nbFiles() {
    const db = this.client.db();
    const filesCollection = db.collection('files');
    return filesCollection.countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
