const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    this.dbURL = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(this.dbURL, { useUnifiedTopology: true });
    this.client.connect();
    this.db = this.client.db(database);
    this.users = this.db.collection('users');
    // this.files = this.db.collection('files');
  }

  isAlive() {
    return this.client.isConnected();
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
