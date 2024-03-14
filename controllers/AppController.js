const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  static async getStatus(req, res) {
    try {
      const redis = await redisClient.isAlive();
      const db = await dbClient.isAlive();

      res.status(200).json({ redis, db });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStats(req, res) {
    try {
      const userCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();
      res.status(200).json({ userCount, filesCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AppController;
