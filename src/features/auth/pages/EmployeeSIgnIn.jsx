import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeSignIn() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyUser: "",
    employeeId: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🔥 HAPUS TOKEN LAMA (ADMIN / LAINNYA)
      localStorage.clear();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/employee/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login gagal");
      }

      // 🔐 SIMPAN TOKEN EMPLOYEE
      localStorage.setItem("token", data.token);
      localStorage.setItem("active_role", "employee");

      // (opsional, tapi berguna)
      localStorage.setItem(
        "employee_profile",
        JSON.stringify(data.user)
      );

      // 🔁 REDIRECT KE DASHBOARD EMPLOYEE
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-black">
            Sign in with Employee ID
          </h1>
          <p className="text-sm text-black mt-1">
            Welcome back! Please sign in to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* COMPANY */}
          <div>
            <label className="text-sm font-medium text-black">
              Company Username
            </label>
            <input
              type="text"
              name="companyUser"
              value={form.companyUser}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2.5 border rounded-lg text-black"
              required
            />
          </div>

          {/* EMPLOYEE ID */}
          <div>
            <label className="text-sm font-medium text-black">
              Employee ID
            </label>
            <input
              type="text"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              placeholder="contoh: 123455"
              className="w-full mt-1 px-3 py-2.5 border rounded-lg text-black"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-black">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2.5 border rounded-lg text-black"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#1D395E] text-white"
          >
            {loading ? "Signing in..." : "SIGN IN"}
          </button>
        </form>
      </div>
    </div>
  );
}
