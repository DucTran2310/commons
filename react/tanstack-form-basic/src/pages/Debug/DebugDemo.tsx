import Loading from "@/components/Loading/Loading";
import { useUserPoints } from "@/hooks/useUserPoint";
import { fetchUsers } from "@/services/debugServices";
import { useQuery } from "@tanstack/react-query";

const DebugDemo = () => {
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
  const { getUserPoints } = useUserPoints();

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <p>Error...</p>;
  }

  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-bold mb-4">🔍 Debug Demo</h2>
      <ul className="space-y-2">
        {users.map((u) => {
          const points = getUserPoints(u); // <-- Có thể debug ở đây
          return (
            <li key={u.id} className="border rounded p-2 flex justify-between bg-white shadow">
              <span>{u.name}</span>
              <span className="font-bold text-blue-600">{points} pts</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DebugDemo;
