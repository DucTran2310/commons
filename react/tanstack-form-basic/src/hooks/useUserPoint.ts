export const useUserPoints = () => {
  const getUserPoints = (user: { age: number; activity: number[] }) => {
    // 🎯 Conditional breakpoint ở đây nếu age > 30
    let total = 0;
    // if(user.age > 30) debugger;
    for (let i = 0; i < user.activity.length; i++) {
      const factor = user.age > 30 ? 2 : 1;
      total += user.activity[i] * factor;

      // 🔄 Debug vòng lặp phức tạp
    }

    return total;
  };

  return { getUserPoints };
};
