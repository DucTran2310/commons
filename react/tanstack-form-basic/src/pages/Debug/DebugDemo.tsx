import { useEffect, useState } from "react";

const DebuggerDemo = () => {
  const [count, setCount] = useState(0);

  const handleIncrease = () => {
    const newCount = count + 1;

    // 👇 Tạm dừng ở đây để kiểm tra giá trị
    debugger;

    setCount(newCount);
  };

  useEffect(() => {
    console.log("Component mounted!");
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛠️ Debugger Demo</h1>
      <p className="mb-4">Giá trị hiện tại: <strong>{count}</strong></p>
      <button
        onClick={handleIncrease}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Tăng số
      </button>
    </div>
  );
};

export default DebuggerDemo;