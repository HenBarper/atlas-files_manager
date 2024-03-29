const { ObjectId } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class FilesController {
  static async postUpload(req, res) {
    const userToken = req.headers['x-token'];
    const {
      name,
      type,
      data,
      parentId = '0',
      isPublic = false,
    } = req.body;

    const userId = await redisClient.get(`auth_${userToken}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    if (!type) {
      return res.status(400).json({ error: 'Missing type' });
    }

    const validTypes = ['folder', 'file', 'image'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }

    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    if (parentId !== '0') {
      if (!ObjectId.isValid(parentId)) {
        return res.status(400).json({ error: 'Invalid parentId' });
      }
      const parentFile = await dbClient.files.findOne({ _id: ObjectId(parentId) });
      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    try {
      if (type === 'folder') {
        if (parentId !== '0') {
          return res.status(400).json({ error: 'Cannot create a folder inside another folder' });
        }
      } else if (type !== 'folder' && parentId === '0') {
        return res.status(400).json({ error: 'Cannot create a file at the root' });
      }

      let localPath;
      if (type === 'file' || type === 'image') {
        const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
        localPath = path.join(folderPath, `${uuidv4()}`);
        const fileContent = Buffer.from(data, 'base64');
        fs.writeFileSync(localPath, fileContent);
      }

      const newFile = {
        userId: ObjectId(userId),
        name,
        type,
        isPublic,
        parentId: ObjectId(parentId),
        localPath: localPath || null,
      };

      const result = await dbClient.files.insertOne(newFile);

      return res.status(201).json({
        id: result.insertedId,
        userId,
        name,
        type,
        isPublic,
        parentId,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = FilesController;
