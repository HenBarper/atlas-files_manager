const User = require('../models/User');
const sha1 = require('sha1');

const UsersController = {
  postNew: async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).send({ error: 'Missing password' });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send({ error: 'Already exist' });
      }

      const sha1Password = sha1(password);
      const newUser = new User({ email, password: sha1Password });
      await newUser.save();
      return res.status(201).json({ id: newUser._id, email: newUser.email });
    } catch (error) {
      console.error("Error creating user: ", error);
      return res.status(500).json({ error: "Internal service error" });
    }
  }
};

module.exports = UsersController;