import { create } from "zustand";
import { authService } from "@/services/authService";
import { getToken, clearToken } from "@/lib/http";

export const useAuth = create((set, get) => ({
  // ================= STATE =================
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: getToken() || localStorage.getItem("token") || null,
  loading: false,
  error: null,

  // ================= LOGIN NORMAL =================
  login: async ({ identifier, password }) => {
    set({ loading: true, error: null });

    try {
      const res = await authService.signIn({ identifier, password });

      const token = res?.token || res?.accessToken;
      if (!token) throw new Error("Token tidak ditemukan");

      const user = {
        ...res.user,
        role: res.user?.role || "user", // ⭐ WAJIB ADA ROLE
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ token, user, loading: false });
      return { ok: true, user };
    } catch (err) {
      set({
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Login gagal",
        loading: false,
      });
      return { ok: false };
    }
  },

  // ================= LOGIN GOOGLE / TOKEN =================
  loginWithToken: ({ token, user }) => {
    if (!token || !user) return;

    const normalizedUser = {
      ...user,
      role: user?.role || "user",
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));

    set({
      token,
      user: normalizedUser,
      error: null,
    });
  },

  // ================= LOGOUT =================
  logout: () => {
    clearToken();
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      token: null,
      user: null,
      error: null,
      loading: false,
    });
  },

  // ================= HELPERS =================
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
