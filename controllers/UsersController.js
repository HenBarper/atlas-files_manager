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
      const existingUser = await dbClient.findUser({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      const sha1Password = sha1(password);
      const newUser = {
        email,
        password: sha1Password,
      };
      await newUser.save();
      return res.status(201).json({ id: newUser._id, email: newUser.email });
    } catch (error) {
      console.error('Error creating user: ', error);
      return res.status(500).json({ error: 'Internal service error' });
    }
  }
}

module.exports = UsersController;
