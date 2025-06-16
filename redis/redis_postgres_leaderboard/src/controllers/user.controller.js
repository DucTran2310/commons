import { client } from "../utils/redis.js";

export const viewUser = async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send("Thiếu username");

  await client.incr(`views:${username}`);
  const views = await client.get(`views:${username}`);
  await client.zAdd("leaderboard:views", [{ score: views, value: username }]);

  res.send(`✅ ${username} vừa xem. Tổng lượt: ${views}`);
};

export const getUserInfo = async (req, res) => {
  const username = req.params.username;
  const views = await client.get(`views:${username}`) || 0;
  res.json({ username, views });
};

export const getTopViewers = async (req, res) => {
  const top = await client.zRevRange("leaderboard:views", 0, 9);
  const result = await Promise.all(top.map(async (username) => {
    const score = await client.zScore("leaderboard:views", username);
    return { username, views: parseInt(score) };
  }));
  res.json(result);
};

export const getUniqueUsers = async (req, res) => {
  const users = await client.sMembers("users:unique");
  res.json(users);
};

export const resetWeekly = async (req, res) => {
  await client.del("leaderboard:views");
  res.send("✅ Leaderboard reset weekly");
};

export const getTotalViews = async (req, res) => {
  const users = await client.sMembers("users:unique");
  let total = 0;
  for (const user of users) {
    total += parseInt(await client.get(`views:${user}`) || 0);
  }
  res.json({ totalViews: total });
};