// src/lib/http.js
const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000";

/* ====== Token helpers ====== */
export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (token) localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

/**
 * Universal fetch wrapper
 * - Support JSON & FormData
 * - Auto Authorization header
 * - Auto throw error when !ok
 */
export async function http(
  path,
  {
    method = "GET",
    body,
    headers = {},
    useCookie = false,
    isForm = false,
  } = {}
) {
  const url = `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const finalHeaders = { ...headers };

  // Content-Type
  if (!isForm) {
    finalHeaders["Content-Type"] = "application/json";
  }

  // 🔑 Bearer Token (INI KUNCI)
  const token = getToken();
  if (token && !useCookie) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers: finalHeaders,
    // ❌ JANGAN pakai same-origin
    credentials: "include", // ✅ FIX
  };

  if (body) {
    options.body = isForm ? body : JSON.stringify(body);
  }

  const res = await fetch(url, options);

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `HTTP ${res.status} ${res.statusText}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    err.url = url;
    throw err;
  }

  return data;
}
