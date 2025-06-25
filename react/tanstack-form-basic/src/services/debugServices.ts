export const fetchUsers = async () => {
  await new Promise((res) => setTimeout(res, 1000));
  return [
    { id: 1, name: "Alice", age: 25, activity: [1, 2, 3] },
    { id: 2, name: "Bob", age: 35, activity: [5, 1, 2] },
    { id: 3, name: "Charlie", age: 40, activity: [2, 4, 6] },
  ];
};
