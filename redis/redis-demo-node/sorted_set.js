const express = require("express");
const redis = require("redis");

const app = express();
app.use(express.json());

const client = redis.createClient();
client.connect().then(() => console.log("✅ Redis connected"));

const LEADERBOARD_KEY = "game:leaderboard";

// POST /score → Gửi điểm người chơi
app.post("/score", async (req, res) => {
  const { username, score } = req.body;

  if (!username || typeof score !== "number") {
    return res.status(400).send("❌ Thiếu username hoặc điểm không hợp lệ");
  }

  await client.sendCommand(["ZADD", LEADERBOARD_KEY, score.toString(), username]);
  res.send("✅ Cập nhật điểm thành công");
});

// GET /top → Hiển thị top 10
app.get("/top", async (req, res) => {
  const topUsers = await client.sendCommand(["ZREVRANGE", LEADERBOARD_KEY, "0", "9"]);
  const result = await Promise.all(
    topUsers.map(async (user) => {
      const score = await client.sendCommand(["ZSCORE", LEADERBOARD_KEY, user]);
      return { username: user, score: parseFloat(score) };
    })
  );

  res.json(result);
});

// GET /rank/:username → Xem xếp hạng của người chơi
app.get("/rank/:username", async (req, res) => {
  const username = req.params.username;
  const rank = await client.sendCommand(["ZREVRANK", LEADERBOARD_KEY, username]);
  const score = await client.sendCommand(["ZSCORE", LEADERBOARD_KEY, username]);

  if (rank === null) {
    return res.status(404).send("❌ Người chơi không tồn tại");
  }

  res.json({
    username,
    rank: parseInt(rank) + 1,
    score: parseFloat(score),
  });
});

// DELETE /remove/:username → Xóa khỏi bảng xếp hạng
app.delete("/remove/:username", async (req, res) => {
  const username = req.params.username;
  await client.sendCommand(["ZREM", LEADERBOARD_KEY, username]);
  res.send(`🗑️ Đã xóa ${username} khỏi bảng xếp hạng`);
});

app.listen(3001, () => {
  console.log("🚀 Leaderboard server running on http://localhost:3001");
});