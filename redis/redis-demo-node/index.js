const express = require("express");
const redis = require("redis");

const app = express();
const port = 3000;

// Tạo Redis client
const client = redis.createClient();

client.on("error", (err) => console.error("Redis Error:", err));

// Kết nối Redis
client.connect().then(() => {
  console.log("✅ Đã kết nối Redis");
});

// Middleware ghi log IP + user-agent
app.use(async (req, res, next) => {
  const log = {
    ip: req.ip,
    ua: req.headers["user-agent"],
    path: req.path,
    time: new Date().toISOString(),
  };
  await client.rPush("logs", JSON.stringify(log));
  await client.lTrim("logs", -1000, -1); // giữ 1000 dòng log gần nhất
  next();
});

// Route đếm lượt truy cập trang chính
app.get("/", async (req, res) => {
  let visits = await client.incr("visits");

  // Thiết lập TTL 1 ngày nếu chưa tồn tại
  await client.set("visits", visits, {
    EX: 86400,
    NX: true,
  });

  const ttl = await client.ttl("visits");

  res.send(`Số lượt truy cập: ${visits} | TTL còn lại: ${ttl} giây`);
});

// ✅ Route /reset → Xóa key visits
app.get("/reset", async (req, res) => {
  await client.del("visits");
  res.send("✅ Đã reset số lượt truy cập.");
});

// ✅ Route đếm truy cập profile
app.get("/profile/:username", async (req, res) => {
  const username = req.params.username;
  const key = `profile:${username}`;

  // ✅ Giới hạn truy cập 10 lần/phút theo IP
  const ipKey = `limit:${req.ip}`;
  const countLimit = await client.incr(ipKey);
  if (countLimit === 1) await client.expire(ipKey, 60); // 60 giây

  if (countLimit > 10) {
    return res
      .status(429)
      .send("⚠️ Bạn đã truy cập quá nhiều lần. Vui lòng thử lại sau.");
  }

  let count = await client.incr(key);

  // Set TTL 1 ngày nếu chưa có
  await client.set(key, count, {
    EX: 86400,
    NX: true,
  });

  // ✅ Tăng điểm trong bảng xếp hạng
  await client.zIncrBy("profile_ranking", 1, username);

  const ttl = await client.ttl(key);
  res.send(
    `👤 ${username} đã được truy cập ${count} lần | TTL còn lại: ${ttl} giây`
  );
});

// ✅ Xem top 5 user được truy cập nhiều nhất
app.get("/profile/top", async (req, res) => {
  const top = await client.zRangeWithScores("profile_ranking", -5, -1, {
    REV: true,
  });
  res.json(top);
});

// ✅ Thống kê nhanh: lượt truy cập hôm nay & tổng user
app.get("/stats", async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const totalVisits = await client.get("visits");
  const totalUsers = await client.zCard("profile_ranking");

  res.json({
    date: today,
    visitsToday: totalVisits || 0,
    totalUsersTracked: totalUsers,
  });
});

// Khởi động server
app.listen(port, () => {
  console.log(`🚀 App chạy tại http://localhost:${port}`);
});