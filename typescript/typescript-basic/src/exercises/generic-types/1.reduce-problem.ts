const array = [
  {
    name: "John",
  },
  {
    name: "Steve",
  },
];

const obj = array.reduce<Record<string, any>>((accum, item) => {
  accum[item.name] = item;
  return accum;
}, {});
console.log("🚀 ~ obj:", obj);
