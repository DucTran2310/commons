import { app } from "./app.js";
import { connectPostgres } from "./utils/postgres.js";
import { connectRedis } from "./utils/redis.js";

const PORT = process.env.PORT || 3000;

(async () => {
  await connectPostgres();
  await connectRedis();
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})();