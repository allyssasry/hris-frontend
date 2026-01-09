import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await fetch("http://localhost:4000/api/password/forgot-password", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email }),
});


      // 👉 INI TEMPATNYA
      navigate("/check-email");

    } catch (err) {
      setMessage("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg rounded-xl overflow-hidden">
        
        <div className="hidden md:flex items-center justify-center bg-gray-100">
          <img
            src="/images/forgot-password.png"
            alt="Forgot Password"
            className="w-80"
          />
        </div>

        <div className="p-8 md:p-12">
          <h1 className="text-2xl font-semibold text-gray-800">
            Forgot Password
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            No worries! Enter your email address below, and we'll send you a link
            to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-900 text-white rounded-lg"
            >
              {loading ? "Sending..." : "Reset Password"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-red-600">{message}</p>
          )}

          <div className="mt-6">
            <Link to="/login" className="text-sm text-gray-600">
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
