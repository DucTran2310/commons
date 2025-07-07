const users = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
}));

export const fetchUsersPage = async ({
  pageParam = 1,
  pageSize = 10,
}: {
  pageParam?: number;
  pageSize?: number;
}) => {
  await new Promise((r) => setTimeout(r, 800)); // giả lập delay

  const start = (pageParam - 1) * pageSize;
  const end = start + pageSize;
  const data = users.slice(start, end);

  return {
    data,
    nextPage: end < users.length ? pageParam + 1 : undefined,
  };
};