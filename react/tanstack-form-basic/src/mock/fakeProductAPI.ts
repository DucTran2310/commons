export const fetchProducts = async () => {
  await new Promise((r) => setTimeout(r, 800));
  return mockDB;
};

export const addProduct = async (name: string) => {
  await delayWithPossibleError();
  const newItem = { id: Date.now(), name };
  mockDB.push(newItem);
  return newItem;
};

export const deleteProduct = async (id: number) => {
  await delayWithPossibleError();
  mockDB = mockDB.filter((item) => item.id !== id);
  return id;
};

export const updateProduct = async ({ id, name }: { id: number; name: string }) => {
  await delayWithPossibleError();
  mockDB = mockDB.map((item) => (item.id === id ? { ...item, name } : item));
  return { id, name };
};

let mockDB = [
  { id: 1, name: "Apple 🍎" },
  { id: 2, name: "Banana 🍌" },
  { id: 3, name: "Carrot 🥕" },
];

const delayWithPossibleError = async () => {
  await new Promise((r) => setTimeout(r, 1000));
  if (Math.random() < 0.8) {
    throw new Error("Lỗi server ngẫu nhiên!");
  }
};
