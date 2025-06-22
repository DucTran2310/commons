import React, { useEffect, useRef, useState } from "react";
import { FixedSizeList as List } from "react-window";

// ---- Types ----
type Item = {
  id: number;
  name: string;
};

// ---- Constants ----
const TOTAL_ITEMS = 10000;
const CHUNK_SIZE = 100;
const ITEM_HEIGHT = 70;
const LAZY_IMAGE_URL = (id: number) => `https://picsum.photos/id/${id % 200}/100/60.jpg`;
const maxPage = Math.ceil(TOTAL_ITEMS / CHUNK_SIZE);

// ---- Component ----
const InfiniteScrollAdvanced: React.FC = () => {
  const [cache, setCache] = useState<Record<number, Item[]>>({});
  const [visibleItems, setVisibleItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasLoaded = useRef<Set<number>>(new Set());
  const hasIntersectedRecently = useRef(false);

  const fetchChunk = async (page: number): Promise<Item[]> => {
    return new Promise((res) => {
      setTimeout(() => {
        const start = (page - 1) * CHUNK_SIZE;
        const items = Array.from({ length: CHUNK_SIZE }, (_, i) => ({
          id: start + i + 1,
          name: `Item ${start + i + 1}`,
        }));
        res(items);
      }, 800);
    });
  };

  const loadPage = async (pageToLoad: number) => {
    if (hasLoaded.current.has(pageToLoad) || loading) return;
    setLoading(true);
    const data = await fetchChunk(pageToLoad);
    hasLoaded.current.add(pageToLoad);
    setCache((prev) => ({ ...prev, [pageToLoad]: data }));
    setVisibleItems((prev) => [...prev, ...data]);
    setLoading(false);
  };

  useEffect(() => {
    loadPage(page);
  }, [page]);

  const canObserve = visibleItems.length * ITEM_HEIGHT >= 700;
  const hasMore = page < maxPage;

  // Intersection Observer
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loading || !canObserve) return;

    observer.current = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        !loading &&
        hasMore &&
        !hasIntersectedRecently.current
      ) {
        hasIntersectedRecently.current = true;
        setPage((prev) => prev + 1);
      }
    });

    observer.current.observe(sentinelRef.current);

    return () => {
      observer.current?.disconnect();
    };
  }, [loading, hasMore, canObserve]);

  // Reset flag khi người dùng scroll
  useEffect(() => {
    const scrollContainer = document.querySelector(".scrollable-container");

    const handleScroll = () => {
      hasIntersectedRecently.current = false;
    };

    scrollContainer?.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Skeleton loader
  const Skeleton = ({ style }: { style: React.CSSProperties }) => (
    <div
      style={{ ...style, padding: 8 }}
      className="border rounded bg-gray-100 animate-pulse flex gap-2 items-center"
    >
      <div className="w-[100px] h-[60px] bg-gray-300 rounded" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
    </div>
  );

  const Row = React.memo(
    ({ index, style, data }: { index: number; style: React.CSSProperties; data: Item[] }) => {
      const item = data[index];
      if (!item) return <Skeleton style={style} />;
      return (
        <div
          style={{ ...style, padding: 8 }}
          className="border rounded bg-white shadow-sm hover:bg-gray-100 flex gap-2 items-center"
        >
          <img
            loading="lazy"
            src={LAZY_IMAGE_URL(item.id)}
            alt="img"
            className="w-[100px] h-[60px] object-cover rounded"
          />
          <span>{item.name}</span>
        </div>
      );
    },
    (prevProps, nextProps) => prevProps.data === nextProps.data
  );

  return (
    <div className="p-4 max-w-md mx-auto h-[100vh]">
      <h2 className="text-xl font-bold mb-4">Infinite Scroll + Observer + Cache + Virtual</h2>
      <div className="scrollable-container border rounded overflow-y-auto h-[700px]">
        <List
          height={700}
          width="100%"
          itemCount={visibleItems.length}
          itemSize={ITEM_HEIGHT}
          itemData={visibleItems}
          className="px-2"
        >
          {Row}
        </List>

        {/* Sentinel chỉ mount nếu đủ dữ liệu */}
        {canObserve && <div ref={sentinelRef} className="h-4" />}

        {loading && (
          <div className="text-center text-sm text-gray-500 p-4">Đang tải thêm...</div>
        )}
      </div>
    </div>
  );
};

export default InfiniteScrollAdvanced;