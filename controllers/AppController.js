const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');


class AppController {
  static async getStatus(req, res) {
    try {
      const redisAlive = await redisClient.isAlive();
      const dbAlive = await dbClient.isAlive();
  
      res.status(200).json({ "redis": redisAlive, "db": dbAlive });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  static async getStats(req, res) {
    try {
      const userCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = AppController;
