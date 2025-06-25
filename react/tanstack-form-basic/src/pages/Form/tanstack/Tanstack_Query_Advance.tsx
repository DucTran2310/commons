import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

interface User {
  id: number;
  name: string;
}
interface Post {
  id: number;
  title: string;
  body: string;
}
interface Comment {
  id: number;
  name: string;
  body: string;
  postId: number;
}

const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  return res.json();
};

const fetchPostsByUser = async (userId: number): Promise<Post[]> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
  return res.json();
};

const fetchCommentsByUser = async (userId: number): Promise<Comment[]> => {
  const postsRes = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
  const posts = await postsRes.json();
  const postIds = posts.map((p: Post) => p.id);

  const commentsRes = await fetch(`https://jsonplaceholder.typicode.com/comments`);
  const allComments = await commentsRes.json();
  return allComments.filter((c: Comment) => postIds.includes(c.postId));
};

const fetchCommentsByPost = async ({ pageParam = 0, postId }: { pageParam?: number; postId: number }): Promise<Comment[]> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
  const all = await res.json();
  return all.slice(pageParam, pageParam + 10);
};

const highlight = (text: string, keyword: string) => {
  if (!keyword) {
    return text;
  }
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200">
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

const UserPostCommentsTabs = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState<"user" | "post">("user");
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ["posts", selectedUserId],
    queryFn: () => fetchPostsByUser(selectedUserId!),
    enabled: !!selectedUserId,
  });

  const { data: userComments = [] } = useQuery({
    queryKey: ["comments-by-user", selectedUserId],
    queryFn: () => fetchCommentsByUser(selectedUserId!),
    enabled: !!selectedUserId && tab === "user",
  });

  const {
    data: postCommentsData,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["comments-by-post", selectedPostId],
    queryFn: ({ pageParam = 0 }) => fetchCommentsByPost({ pageParam, postId: selectedPostId! }),
    enabled: !!selectedPostId && tab === "post",
    getNextPageParam: (lastPage, allPages) => (lastPage.length < 10 ? undefined : allPages.length * 10),
  });

  useEffect(() => {
    const el = observerRef.current;
    if (!el || !hasNextPage) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        fetchNextPage();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const filteredPosts = posts.filter(
    (p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.body.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredUserComments = userComments.filter(
    (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.body.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredPostComments = (postCommentsData?.pages.flat() ?? []).filter(
    (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.body.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">👤 Users → 📝 Posts → 💬 Comments</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold">1. Chọn người dùng:</label>
          <select
            value={selectedUserId || ""}
            onChange={(e) => {
              const userId = Number(e.target.value);
              setSelectedUserId(userId);
              setSelectedPostId(null);
              setTab("user");
            }}
            className="border px-2 py-1 rounded"
          >
            <option value="">-- Chọn User --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold">Tìm kiếm bài viết / bình luận:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-2 py-1 rounded w-full"
            placeholder="Nhập từ khoá..."
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button onClick={() => setTab("user")} className={`px-3 py-1 rounded ${tab === "user" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
            💬 Tất cả bình luận của user
          </button>
          <button
            onClick={() => setTab("post")}
            className={`px-3 py-1 rounded ${tab === "post" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            disabled={!selectedUserId}
          >
            📝 Bài viết và bình luận của post
          </button>
        </div>

        {tab === "user" && selectedUserId && (
          <div>
            <h3 className="font-semibold mt-4">💬 Bình luận tất cả bài viết:</h3>
            {filteredUserComments.length ? (
              <ul className="space-y-2 mt-2">
                {filteredUserComments.map((comment) => (
                  <li key={comment.id} className="border p-2 rounded">
                    <p className="text-sm font-medium">{highlight(comment.name, searchTerm)}</p>
                    <p className="text-xs text-gray-700">{highlight(comment.body, searchTerm)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Không có bình luận nào.</p>
            )}
          </div>
        )}

        {tab === "post" && selectedUserId && (
          <div>
            <h3 className="font-semibold mt-4">📝 Danh sách bài viết:</h3>
            <ul className="space-y-2 mt-2">
              {filteredPosts.map((post) => (
                <li
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`cursor-pointer border p-2 rounded hover:bg-gray-100 ${selectedPostId === post.id ? "bg-blue-100" : ""}`}
                >
                  <strong>{highlight(post.title, searchTerm)}</strong>
                  <p className="text-sm text-gray-600">{highlight(post.body, searchTerm)}</p>
                </li>
              ))}
            </ul>

            {selectedPostId && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">💬 Bình luận bài viết:</h4>
                {filteredPostComments.length ? (
                  <ul className="space-y-2">
                    {filteredPostComments.map((comment) => (
                      <li key={comment.id} className="border p-2 rounded">
                        <p className="text-sm font-medium">{highlight(comment.name, searchTerm)}</p>
                        <p className="text-xs text-gray-700">{highlight(comment.body, searchTerm)}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Không có bình luận cho bài viết này.</p>
                )}
                <div ref={observerRef} className="h-10"></div>
                {isLoading && <p>Đang tải thêm...</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPostCommentsTabs;
