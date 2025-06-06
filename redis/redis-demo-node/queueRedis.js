const express = require("express");
const redis = require("redis");

const app = express();
const port = 3000;
app.use(express.json());

const client = redis.createClient();
client.connect().then(() => console.log("✅ Đã kết nối Redis"));

const QUEUE_KEY = "message_queue";
const MAX_QUEUE_LENGTH = 100;

// POST /send → Thêm tin nhắn vào cuối hàng (với metadata)
app.post("/send", async (req, res) => {
  const { message, user } = req.body;
  if (!message || !user) {
    return res.status(400).send("⚠️ Vui lòng nhập đầy đủ 'user' và 'message'");
  }

  const data = {
    user,
    content: message,
    timestamp: new Date().toISOString()
  };

  // Đẩy vào cuối hàng
  await client.rPush(QUEUE_KEY, JSON.stringify(data));

  // Giới hạn danh sách chỉ giữ lại 100 tin mới nhất
  await client.lTrim(QUEUE_KEY, -MAX_QUEUE_LENGTH, -1);

  res.send("✅ Tin nhắn đã được thêm vào hàng đợi.");
});

// GET /receive → Lấy tin nhắn đầu tiên ra khỏi hàng
app.get("/receive", async (req, res) => {
  const data = await client.lPop(QUEUE_KEY);
  if (!data) return res.send("📭 Hàng đợi rỗng.");
  res.send(`📩 Tin nhắn: ${data}`);
});

// GET /receive-block → Chờ đến khi có tin nhắn (blocking)
app.get("/receive-block", async (req, res) => {
  try {
    const result = await client.blPop(QUEUE_KEY, 5); // timeout 5s
    if (!result) return res.send("⌛ Hết thời gian chờ, không có tin nhắn.");
    const [, message] = result;
    res.send(`⏳ Nhận blocking: ${message}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Lỗi khi dùng BLPOP");
  }
});

// GET /peek → Xem tất cả tin nhắn còn lại
app.get("/peek", async (req, res) => {
  const all = await client.lRange(QUEUE_KEY, 0, -1);
  const messages = all.map((item) => JSON.parse(item));
  res.json(messages);
});

// GET /length → Đếm số tin nhắn còn trong hàng đợi
app.get("/length", async (req, res) => {
  const len = await client.lLen(QUEUE_KEY);
  res.send(`📦 Tổng số tin nhắn trong hàng đợi: ${len}`);
});

app.listen(port, () => {
  console.log(`🚀 Server chạy tại http://localhost:${port}`);
});