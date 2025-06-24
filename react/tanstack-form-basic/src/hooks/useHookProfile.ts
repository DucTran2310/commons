import axiosInstance from "@/api/axiosInstance";
import axiosInstance_cookie from "@/api/axiosInstance_cookie";
import { LOCAL_STORAGE } from "@/constants/commons.constants";
import { useEffect, useState } from "react";

interface Profile {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
  creationAt: string;
  updatedAt: string;
}

export const useProfile = (type: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    type === LOCAL_STORAGE
      ? axiosInstance
          .get("/auth/profile")
          .then((res) => setProfile(res.data))
          .catch((err) => {
            console.error("Failed to load profile", err);
            setProfile(null);
          })
          .finally(() => setLoading(false))
      : axiosInstance_cookie
          .get("/auth/profile")
          .then((res) => setProfile(res.data))
          .catch((err) => {
            console.error("Failed to load profile", err);
            setProfile(null);
          })
          .finally(() => setLoading(false));
  }, []);

  return { profile, loading };
};
