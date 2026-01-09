import { useEffect, useState } from "react";
import api from "@/utils/axios";

export function useMyProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/employees/me")
      .then(res => setProfile(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return { profile };
}
