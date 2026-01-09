import { http, setToken, clearToken } from "@/lib/http";

const PATH = {
  login:    "/api/auth/login",
  register: "/api/auth/signup",
  me:       "/api/auth/me",     // implement di BE kalau butuh
  logout:   "/api/auth/logout", // implement di BE kalau butuh
};

export const authService = {
  async signIn({ identifier, password }) {
    // --- DEBUG sementara: cek apa yang dikirim FE
    console.log("authService.signIn payload:", { identifier, password });

    const res = await http(PATH.login, {
      method: "POST",
      body: { identifier, password }, // ← WAJIB ADA IDENTIFIER
    });

    const token = res?.token || res?.accessToken || res?.data?.token;
    if (token) setToken(token);
    return res;
  },



  async signUp(payload) {
    // payload: { firstName,lastName,email,username,password }
    return http(PATH.register, { method: "POST", body: payload });
  },

  async me() {
    return http(PATH.me, { method: "GET" });
  },

  async signOut() {
    clearToken();
    try { await http(PATH.logout, { method: "POST" }); } catch {}
  },
};
