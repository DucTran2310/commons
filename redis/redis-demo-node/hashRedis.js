const express = require("express");
const redis = require("redis");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;
app.use(express.json());

const client = redis.createClient();
client.connect().then(() => console.log("✅ Đã kết nối Redis"));

const USER_PREFIX = "user:";
const DEFAULT_TTL = 86400; // 1 ngày

// Middleware validate
function validateUser(req, res, next) {
  const { name, email, age } = req.body;
  if (!name || !email) return res.status(400).send("❌ Thiếu name hoặc email");

  if (typeof name !== "string" || name.length < 2)
    return res.status(400).send("⚠️ Tên không hợp lệ");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).send("⚠️ Email không đúng định dạng");

  if (age && isNaN(Number(age)))
    return res.status(400).send("⚠️ Tuổi phải là số");

  next();
}

// POST /register
app.post("/register", validateUser, async (req, res) => {
  const { name, email, age } = req.body;

  // Kiểm tra trùng email
  const keys = await client.keys(`${USER_PREFIX}*`);
  for (const key of keys) {
    const existingEmail = await client.hGet(key, "email");
    if (existingEmail === email) {
      return res.status(400).send("⚠️ Email đã tồn tại!");
    }
  }

  const userId = uuidv4().slice(0, 8); // Tạo ID ngắn
  const key = `${USER_PREFIX}${userId}`;

  await client.hSet(key, {
    id: userId,
    name,
    email,
    age: age || "",
    createdAt: new Date().toISOString(),
  });

  await client.expire(key, DEFAULT_TTL); // Set TTL

  res.send(`✅ Đăng ký thành công với ID: ${userId}`);
});

// GET /user/:id
app.get("/user/:id", async (req, res) => {
  const key = `${USER_PREFIX}${req.params.id}`;
  const user = await client.hGetAll(key);

  if (!user || Object.keys(user).length === 0)
    return res.status(404).send("❌ Không tìm thấy người dùng");

  const ttl = await client.ttl(key);
  user.ttl = ttl;
  res.json(user);
});

// DELETE /user/:id/field/:field
app.delete("/user/:id/field/:field", async (req, res) => {
  const key = `${USER_PREFIX}${req.params.id}`;
  const field = req.params.field;
  await client.hDel(key, field);
  res.send(`🗑️ Đã xoá trường ${field} của ${key}`);
});

// GET /users?page=1&limit=5&search=abc
app.get("/users", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search?.toLowerCase() || "";

  const allKeys = await client.keys(`${USER_PREFIX}*`);
  const allUsers = [];

  for (const key of allKeys) {
    const user = await client.hGetAll(key);
    if (
      !search ||
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    ) {
      const ttl = await client.ttl(key);
      allUsers.push({ ...user, ttl });
    }
  }

  const total = allUsers.length;
  const start = (page - 1) * limit;
  const paginated = allUsers.slice(start, start + limit);

  res.json({
    page,
    total,
    data: paginated,
  });
});

app.listen(port, () => {
  console.log(`🚀 Server tại http://localhost:${port}`);
});
