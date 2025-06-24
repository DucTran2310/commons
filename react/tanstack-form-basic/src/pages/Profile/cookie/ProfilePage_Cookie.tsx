import { COOKIE } from "@/constants/commons.constants";
import { useProfile } from "@/hooks/useHookProfile";
import { deleteCookie } from "@/utils/cookies.utils";
import { useNavigate } from "react-router-dom";

const ProfilePage_Cookie = () => {
  const { profile, loading } = useProfile(COOKIE);
  const navigate = useNavigate();

  const handleLogout = () => {
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    navigate("/login");
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }
  if (!profile) {
    return <div className="p-4 text-red-600">Không thể tải thông tin.</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <div className="flex flex-col items-center">
          <img src={profile.avatar} className="w-24 h-24 rounded-full mb-3" />
          <h2 className="text-xl font-bold">👋 Hello, {profile.name}</h2>
          <p className="text-gray-600">{profile.email}</p>
          <p className="text-sm text-blue-600 mt-1">Role: {profile.role}</p>
        </div>
        <div className="text-sm mt-4 text-gray-500">
          <p>🕒 Created: {new Date(profile.creationAt).toLocaleString()}</p>
          <p>🔄 Updated: {new Date(profile.updatedAt).toLocaleString()}</p>
        </div>
        <button className="mt-6 w-full bg-red-500 text-white py-2 rounded" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default ProfilePage_Cookie;
