import React, { useEffect, useRef, useState } from "react";

type Item = {
  id: number;
  name: string;
};

const InfiniteList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLLIElement | null>(null);

  // Giả lập API call
  const fetchItems = async (page: number) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // delay

    const newItems = Array.from({ length: 10 }, (_, i) => {
      const id = (page - 1) * 10 + i + 1;
      return { id, name: `Item ${id}` };
    });

    setItems((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const filteredNewItems = newItems.filter((item) => !existingIds.has(item.id));
      return [...prev, ...filteredNewItems];
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchItems(page);
  }, [page]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.current.observe(loadMoreRef.current);

    return () => {
      observer.current?.disconnect();
    };
  }, [loading]);

  return (
    <div className="p-4 max-w-md mx-auto h-[100vh]">
      <h2 className="text-xl font-bold mb-4">Infinite Scroll Demo</h2>

      {/* Scrollable Container */}
      <ul className="space-y-2 overflow-y-scroll h-[800px] border rounded p-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="p-2 border rounded shadow-sm bg-white hover:bg-gray-100"
          >
            {item.name}
          </li>
        ))}

        {/* 👇 Mục tiêu để observer quan sát */}
        <li ref={loadMoreRef} className="h-10 flex justify-center items-center">
          {loading && <span>🔄 Đang tải thêm...</span>}
        </li>
      </ul>
    </div>
  );
};

export default InfiniteList;