import { LOCAL_STORAGE } from "@/constants/commons.constants";
import { useProfile } from "@/hooks/useHookProfile";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { profile, loading } = useProfile(LOCAL_STORAGE);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  if (loading) {
    return <div className="p-4 text-gray-600">🔄 Loading profile...</div>;
  }
  if (!profile) {
    return <div className="p-4 text-red-500">❌ Failed to load profile</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md">
        <div className="flex flex-col items-center">
          <img src={profile.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">👋 Welcome, {profile.name}</h2>
          <p className="text-gray-600 mt-1">{profile.email}</p>
          <span className="mt-2 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">Role: {profile.role}</span>
        </div>

        <div className="mt-6 border-t pt-4 text-sm text-gray-500">
          <p>🕒 Created at: {new Date(profile.creationAt).toLocaleString()}</p>
          <p>🔄 Updated at: {new Date(profile.updatedAt).toLocaleString()}</p>
        </div>

        <button onClick={handleLogout} className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
          🔓 Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
