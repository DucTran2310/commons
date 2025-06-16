import redis from 'redis';

const client = redis.createClient();

export const connectRedis = async () => {
  try {
    await client.connect();
    console.log("✅ Redis connected");
  } catch (err) {
    console.error("Redis Error:", err);
    process.exit(1);
  }
};

export { client };