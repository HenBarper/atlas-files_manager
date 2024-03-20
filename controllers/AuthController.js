const { v4: uuidv4 } = require('uuid');
const sha1 = require('sha1');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db'); // Import dbClient

class AuthController {
  static async getConnect(req, res) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ error: 'Unatuhorized' });
      }

      const credentialsBase64 = authHeader.split(' ')[1];
      const credentials = Buffer.from(credentialsBase64, 'base64').toString('ascii');
      const [email, password] = credentials.split(':');

      const user = await dbClient.users.findOne({ email });

      if (!user || user.password !== sha1(password)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = uuidv4();

      await redisClient.set(`auth_${token}`, user._id.toString(), 'EX', 24 * 60 * 60);

      return res.status(200).json({ token });
    } catch (error) {
      console.log('get connect error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const userId = await redisClient.get(`auth_${token}`);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await redisClient.del(`auth_${token}`);

      return res.status(204).send();
    } catch (error) {
      console.error('Error during disconnection:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = AuthController;
