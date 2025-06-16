const express = require("express");
const redis = require("redis");

const app = express();
const client = redis.createClient();

const port = 3001

// Kết nối Redis
client.connect().then(() => {
  console.log("✅ Đã kết nối Redis");
});

app.use(express.json());

// Mỗi lần user xem → tăng lượt xem, cập nhật xếp hạng
app.post("/view", async (req, res) => {
  const { username, name, email } = req.body;
  if (!username) return res.status(400).send("Thiếu username");

  // Tăng view
  const viewKey = `views:${username}`;
  await client.incr(viewKey);

  // Lưu user info vào Hash
  const userKey = `user:${username}`;
  await client.hSet(userKey, { name: name || "", email: email || "" });

  // Thêm vào Set user duy nhất
  await client.sAdd("users:unique", username);

  // Cập nhật điểm trên bảng xếp hạng
  const views = await client.get(viewKey);
  await client.zAdd("leaderboard:views", [{ score: views, value: username }]);

  res.send(`✅ ${username} vừa xem. Tổng lượt: ${views}`);
});

// Lấy thông tin + lượt xem
app.get("/user/:username", async (req, res) => {
  const username = req.params.username;
  const info = await client.hGetAll(`user:${username}`);
  const views = await client.get(`views:${username}`) || 0;
  res.json({ username, views, ...info });
});

// Lấy danh sách user duy nhất đã xem
app.get("/unique-users", async (req, res) => {
  const users = await client.sMembers("users:unique");
  res.json(users);
});

//Lấy top 10 user xem nhiều nhất
app.get("/top-viewers", async (req, res) => {
  const top = await client.zRevRange("leaderboard:views", 0, 9);
  const result = await Promise.all(top.map(async (username) => {
    const score = await client.zScore("leaderboard:views", username);
    return { username, views: parseInt(score) };
  }));
  res.json(result);
});

// Khởi động server
app.listen(port, () => {
  console.log(`🚀 App chạy tại http://localhost:${port}`);
});