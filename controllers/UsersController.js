const sha1 = require('sha1');
const dbClient = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      const existingUser = await dbClient.users.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      const sha1Password = sha1(password);
      const newUser = await dbClient.users.insertOne({ email, password: sha1Password });
      // await newUser.save();
      return res.status(201).json({ id: newUser.insertedId, email });
    } catch (error) {
      console.error('Error creating user: ', error);
      return res.status(500).json({ error: 'Internal service error' });
    }
  }

  static async getMe(req, res) {
    const userToken = req.headers('X-token');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // try begin
      const userId = await redisClient.get(`auth_${token}`);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await dbClient.users.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      return res.status(200).json({ email: user.email, id: user._id });
      // try end
    } catch {
      // catch begin
      return res.status(500).json({ error: "Internal Server Error" });
      // catch end
    }
  }
}

module.exports = UsersController;
