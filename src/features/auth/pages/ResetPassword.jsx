import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 cek token ada atau tidak
  useEffect(() => {
    if (!token) {
      setError("Token reset tidak valid");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      return setError("Token reset tidak valid");
    }

    if (password.length < 6) {
      return setError("Password minimal 6 karakter");
    }

    if (password !== confirm) {
      return setError("Password tidak sama");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/password/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal reset password");
      }

      // ✅ sukses
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg rounded-xl overflow-hidden">
        
        {/* LEFT IMAGE */}
        <div className="hidden md:flex items-center justify-center bg-gray-100">
          <img
            src="/images/reset-password.png"
            alt="Reset Password"
            className="w-80"
          />
        </div>

        {/* FORM */}
        <div className="p-10">
          <h1 className="text-2xl font-semibold text-gray-800">
            Set new password
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Enter your new password below to complete the reset process.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              placeholder="New password"
              className="w-full px-4 py-2 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm password"
              className="w-full px-4 py-2 border rounded-lg"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              disabled={loading}
              className="w-full py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </form>

          <button
            onClick={() => navigate("/login")}
            className="mt-6 text-sm text-gray-600 hover:text-blue-700"
          >
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
