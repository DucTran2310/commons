const users = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
}));

export const fetchUsersPage = async ({ pageParam = 1, pageSize = 10 }: { pageParam?: number; pageSize?: number }) => {
  await new Promise((r) => setTimeout(r, 800)); // giả lập delay

  const start = (pageParam - 1) * pageSize;
  const end = start + pageSize;
  const data = users.slice(start, end);

  return {
    data,
    nextPage: end < users.length ? pageParam + 1 : undefined,
  };
};

const mockUsers = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@mail.com`,
}));

const mockPosts = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  userId: (i % 10) + 1,
  title: `Post ${i + 1}`,
}));

export const fetchAllUsers = async () => {
  await delay();
  return mockUsers;
};

export const fetchUserById = async (id: number) => {
  await delay();
  const found = mockUsers.find((u) => u.id === id);
  if (!found) {
    throw new Error("User không tồn tại");
  }
  return found;
};

export const fetchUserPosts = async (id: number) => {
  await delay();
  return mockPosts.filter((p) => p.userId === id);
};

export const updateUserName = async ({ id, name }: { id: number; name: string }) => {
  await delay();
  const user = mockUsers.find((u) => u.id === id);
  if (!user) {
    throw new Error("Không tìm thấy user");
  }
  user.name = name;
  return user;
};

const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

export const fetchRandomData = async () => {
  await new Promise((res) => setTimeout(res, 800));

  const random = Math.random();

  if (random < 0.2) {
    throw new Error("🔌 NetworkError");
  }
  if (random < 0.4) {
    throw new Error("🚫 AuthError");
  }
  if (random < 0.6) {
    throw new Error("💥 ServerCrashed");
  }

  return { message: "🎉 Tải dữ liệu thành công!" };
};
