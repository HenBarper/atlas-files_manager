// const redis = require('redis');
import redis from 'redis';

class RedisClient {
  // constructor that creates a client to Redis
  constructor() {
    this.client = redis.createClient();

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  // isAlive that returns true when the connection to Redis is a success otherwise, false
  isAlive() {
    return this.client.connected;
  }

  // asynchronous function that takes a string key argument
  // and returns the Redis value stored for this key
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  // asynchronous set takes a string key, value and duration in
  // seconds to store it in Redis (with an expiration set by the duration argument)
  async set(key, value, durationInSeconds) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', durationInSeconds, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  // asynchronous del that takes a string key argument and removes the value in Redis for this key
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }
}

// Create an instance of the RedisClient class
const redisClient = new RedisClient();

// Export the redisClient instance to make it accessible from other files
export default redisClient;
