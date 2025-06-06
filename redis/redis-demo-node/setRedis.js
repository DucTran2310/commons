const express = require("express");
const redis = require("redis");

const app = express();
const port = 3000;
app.use(express.json());

const client = redis.createClient();
client.connect().then(() => console.log("✅ Đã kết nối Redis"));

const SET_KEY = "unique_users";

// POST /join → Thêm người dùng vào nhóm
app.post("/join", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send("⚠️ Vui lòng nhập username");

  const added = await client.sAdd(SET_KEY, username);
  if (added) {
    res.send(`✅ ${username} đã được thêm vào nhóm.`);
  } else {
    res.send(`ℹ️ ${username} đã tồn tại trong nhóm.`);
  }
});

// GET /users → Lấy danh sách tất cả người dùng
app.get("/users", async (req, res) => {
  const members = await client.sMembers(SET_KEY);
  res.json(members);
});

// GET /check/:username → Kiểm tra user có trong nhóm không
app.get("/check/:username", async (req, res) => {
  const { username } = req.params;
  const exists = await client.sIsMember(SET_KEY, username);
  res.send(exists ? `✅ ${username} có trong nhóm.` : `❌ ${username} không có trong nhóm.`);
});

// DELETE /leave/:username → Xóa user khỏi nhóm
app.delete("/leave/:username", async (req, res) => {
  const { username } = req.params;
  const removed = await client.sRem(SET_KEY, username);
  res.send(removed ? `🗑️ Đã xóa ${username} khỏi nhóm.` : `⚠️ Không tìm thấy ${username} trong nhóm.`);
});

// Khởi động server
app.listen(port, () => {
  console.log(`🚀 App chạy tại http://localhost:${port}`);
});

// Giả sử bạn có các nhóm user: groupA, groupB

// POST /group/:groupname/add
// app.post("/group/:group/add", async (req, res) => {
//   const { group } = req.params;
//   const { user } = req.body;
//   if (!user) return res.status(400).send("Thiếu user");

//   await client.sAdd(`group:${group}`, user);
//   res.send(`✅ ${user} đã được thêm vào group ${group}`);
// });

// // GET /group/union/a/b → Hợp 2 group
// app.get("/group/union/:a/:b", async (req, res) => {
//   const users = await client.sUnion(`group:${req.params.a}`, `group:${req.params.b}`);
//   res.json({ union: users });
// });

// // GET /group/intersection/a/b → Giao 2 group
// app.get("/group/intersection/:a/:b", async (req, res) => {
//   const users = await client.sInter(`group:${req.params.a}`, `group:${req.params.b}`);
//   res.json({ intersection: users });
// });

// // GET /group/difference/a/b → Hiệu A \ B
// app.get("/group/difference/:a/:b", async (req, res) => {
//   const users = await client.sDiff(`group:${req.params.a}`, `group:${req.params.b}`);
//   res.json({ difference: users });
// });