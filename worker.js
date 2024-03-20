const Queue = require('bull');
const imageThumbnail = require('image-thumbnail');
const dbClient = require('./utils/db');
const { ObjectId } = require('mongodb');

const fileQueue = new Queue('fileQueue');

fileQueue.process(async (job) => {
  const { fileId, userId } = job.data;
  
  if (!userId) {
    throw new Error('Missing userId');
  }
  if (!fileId) {
    throw new Error('Missing fileId');
  }

  const file = await dbClient.db.collection('files').findOne({ _id: ObjectId(fileId) });

  if (!file) {
    throw new Error('File not found');
  }

  const thumbnailSizes = [500, 250, 100];
  for (const size of thumbnailSizes) {
    const thumbnail = await imageThumbnail(file.localPath, { width: size, height: size });
    const thumbnailName = `${fileId}_${size}.jpg`;
    await dbClient.db.collection('users').updateOne({ _id: ObjectId(userId) }, { $set: { [`thumbnails.${size}`]: thumbnailName } });
  }
}
);

module.exports = fileQueue;
