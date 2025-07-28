export function useSampleData() {
  const loadSampleData = () => {
    const sampleA = {
      name: "Alice",
      age: 25,
      email: "alice@example.com",
      address: {
        city: "Hanoi",
        country: "Vietnam"
      },
      skills: ["React", "TypeScript", "Node.js"]
    };

    const sampleB = {
      name: "Alice",
      age: 26, // thay đổi tuổi
      email: "alice_new@example.com", // thay đổi email
      address: {
        city: "Ho Chi Minh City", // thay đổi thành phố
        country: "Vietnam"
      },
      skills: ["React", "Node.js", "GraphQL"], // thay đổi skill
      isActive: true // thêm field mới
    };

    return { sampleA, sampleB };
  };

  return { loadSampleData };
}