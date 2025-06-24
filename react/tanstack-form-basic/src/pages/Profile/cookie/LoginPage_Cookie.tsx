import { useState } from "react";
import axios from "axios";
import { setCookie } from "@/utils/cookies.utils";
import { useNavigate } from "react-router-dom";
import { PROFILE_PAGE_COOKIE } from "@/constants/menus.constants";

const LoginPage_Cookie = () => {
  const [email, setEmail] = useState("john@mail.com");
  const [password, setPassword] = useState("changeme");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://api.escuelajs.co/api/v1/auth/login", {
        email,
        password,
      });
      const { access_token, refresh_token } = res.data;
      setCookie("access_token", access_token, 1);
      setCookie("refresh_token", refresh_token, 7);
      navigate(PROFILE_PAGE_COOKIE);
    } catch (err) {
      alert(`Login failed: ${err}`);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto mt-10 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">🔐 Login</h2>
      <input className="w-full mb-2 p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input
        className="w-full mb-2 p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button className="w-full bg-blue-600 text-white py-2 rounded" onClick={handleLogin}>
        Đăng nhập
      </button>
    </div>
  );
};

export default LoginPage_Cookie;
