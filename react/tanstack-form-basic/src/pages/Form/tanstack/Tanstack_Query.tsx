import useDebounce from "@/hooks/useDebounce";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Product type
export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
};

// Fetch API with error handling
const fetchProducts = async ({
  page,
  keyword,
  priceMin,
  priceMax,
  category,
}: {
  page: number;
  keyword: string;
  priceMin: number;
  priceMax: number;
  category: string;
}): Promise<Product[]> => {
  const skip = (page - 1) * 10;
  const url = `https://dummyjson.com/products/search?q=${keyword}&limit=10&skip=${skip}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Fetch failed");

    const data = await res.json();
    let products: Product[] = data.products || [];

    if (category) {
      products = products.filter((p) => p.category.includes(category));
    }

    return products.filter((p) => p.price >= priceMin && p.price <= priceMax);
  } catch (error) {
    console.error("Fetch error:", error);
    return []; // fallback
  }
};

const Tanstack_Query = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [priceMin, setPriceMin] = useState(Number(searchParams.get("min") || "0"));
  const [priceMax, setPriceMax] = useState(Number(searchParams.get("max") || "2000"));
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [page, setPage] = useState(Number(searchParams.get("page") || "1"));
  const queryClient = useQueryClient();
  const listRef = useRef<HTMLUListElement | null>(null);

  // ✅ Debounce với đúng kiểu dữ liệu
  const debouncedKeyword = useDebounce(keyword.trim(), 1000);
  const debouncedPriceMin = useDebounce(priceMin.toString(), 1000);
  const debouncedPriceMax = useDebounce(priceMax.toString(), 1000);

  const queryKey = ["products", page, debouncedKeyword, debouncedPriceMin, debouncedPriceMax, category];

  const {
    data: products = [],
    isPending,
    isError,
    isFetching,
  } = useQuery<Product[]>({
    queryKey,
    queryFn: () =>
      fetchProducts({
        page,
        keyword: debouncedKeyword,
        priceMin: Number(debouncedPriceMin),
        priceMax: Number(debouncedPriceMax),
        category,
      }),
    staleTime: 30 * 1000 * 5,
    placeholderData: (prev) => prev,
  });

  // ✅ Prefetch trang tiếp theo
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["products", page + 1, debouncedKeyword, debouncedPriceMin, debouncedPriceMax, category],
      queryFn: () =>
        fetchProducts({
          page: page + 1,
          keyword: debouncedKeyword,
          priceMin: Number(debouncedPriceMin),
          priceMax: Number(debouncedPriceMax),
          category,
        }),
      staleTime: 30 * 1000,
    });
  }, [page, debouncedKeyword, debouncedPriceMin, debouncedPriceMax, category, queryClient]);

  // ✅ Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setPage(1);
  }, [keyword, debouncedPriceMin, debouncedPriceMax, category]);

  // ✅ Cập nhật URL
  useEffect(() => {
    setSearchParams({
      page: page.toString(),
      keyword,
      min: debouncedPriceMin.toString(),
      max: debouncedPriceMax.toString(),
      category,
    });
  }, [page, keyword, debouncedPriceMin, debouncedPriceMax, category, setSearchParams]);

  // ✅ Scroll lên đầu khi đổi trang
  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [page]);

  const allCategories = ["smartphones", "laptops", "fragrances", "skincare", "groceries", "furniture"];

  // ✅ Kiểm tra trước xem có thể sang trang tiếp theo không
  const nextPage = page + 1;
  const nextPageQueryKey = ["products", nextPage, debouncedKeyword, debouncedPriceMin, debouncedPriceMax, category];
  const nextPageData = queryClient.getQueryData<Product[]>(nextPageQueryKey);
  const canGoNext = nextPageData ? nextPageData.length > 0 : true;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">📦 Sản phẩm (Trang {page})</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="🔍 Tìm sản phẩm"
          className="border px-2 py-1 rounded w-1/3"
        />
        <input
          type="number"
          value={priceMin}
          onChange={(e) => setPriceMin(Number(e.target.value))}
          placeholder="Giá từ"
          className="border px-2 py-1 rounded w-24"
        />
        <input
          type="number"
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          placeholder="Đến"
          className="border px-2 py-1 rounded w-24"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border px-2 py-1 rounded w-1/4">
          <option value="">📂 Tất cả danh mục</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Loading / Error */}
      {isPending && <p className="text-gray-500 animate-pulse">Đang tải...</p>}
      {isError && <p className="text-red-500">❌ Lỗi khi tải dữ liệu</p>}

      {/* Product list */}
      <div>
        <p className="text-gray-500 text-sm">Tìm thấy {products?.length || 0} sản phẩm</p>

        <ul ref={listRef} className="grid gap-4">
          {products?.map((product) => (
            <li key={product.id} className="flex gap-4 border p-3 rounded shadow-sm">
              <img src={product.thumbnail} alt={product.title} className="w-20 h-20 object-cover rounded" />
              <div>
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-sm text-gray-600">
                  💰 ${product.price} – 📂 {product.category}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          ◀ Trang trước
        </button>

        {isFetching && <p className="text-blue-500 animate-pulse">Đang cập nhật...</p>}

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!canGoNext}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Trang sau ▶
        </button>
      </div>
    </div>
  );
};

export default Tanstack_Query;