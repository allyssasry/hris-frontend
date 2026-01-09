import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/store/authStore";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAuth((s) => s.token);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    employeeId: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    branch: "",
    grade: "",
    contractType: "",
    position: "",
  });

  // ================= LOAD EMPLOYEE =================
  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        const emp = json?.data;
        if (!emp) throw new Error("Not found");

        setForm({
          employeeId: emp.employeeId || "",
          email: emp.User?.email || "",
          password: "",
          firstName: emp.firstName || "",
          lastName: emp.lastName || "",
          phone: emp.phone || "",
          gender: emp.gender || "",
          branch: emp.branch || "",
          grade: emp.grade || "",
          contractType: emp.contractType || "",
          position: emp.jobdesk || "",
        });

        setLoading(false);
      } catch (err) {
        alert("Gagal memuat data employee");
        navigate("/admin/employees");
      }
    })();
  }, [id, token, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Employee updated");
      navigate("/admin/employees");
    } catch (err) {
      alert("Gagal update employee");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-semibold text-[#153962] mb-4">
        Edit Employee
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Employee ID (Login ID)"
          name="employeeId"
          value={form.employeeId}
          disabled
        />

        <Input
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <Input
          label="Password (kosongkan jika tidak diubah)"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        <Input
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
        />

        <Input
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
        />

        <Input
          label="Mobile Number"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <Select
          label="Gender"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          options={[
            { value: "", label: "Pilih" },
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
        />

        <Select
          label="Contract Type"
          name="contractType"
          value={form.contractType}
          onChange={handleChange}
          options={[
            { value: "", label: "Pilih" },
            { value: "permanent", label: "Tetap" },
            { value: "contract", label: "Kontrak" },
            { value: "intern", label: "Magang" },
            { value: "resign", label: "Lepas" },
          ]}
        />

        <Input
          label="Branch"
          name="branch"
          value={form.branch}
          onChange={handleChange}
        />

        <Input
          label="Grade"
          name="grade"
          value={form.grade}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-[#153962] text-white rounded-md"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* =======================
   INPUT COMPONENT (FIXED)
   ======================= */
function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
  required = false,
}) {
  return (
    <div>
      <label className="text-sm font-medium text-[#1D395E]">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className="
          w-full rounded-lg border px-3 py-2.5 text-sm
          bg-white text-black
          placeholder:text-gray-400

          disabled:text-black
          disabled:bg-gray-100
          disabled:opacity-100
        "
      />
    </div>
  );
}

/* =======================
   SELECT COMPONENT
   ======================= */
function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="text-sm font-medium text-[#1D395E]">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full rounded-lg border px-3 py-2.5 text-sm
          bg-white text-black
        "
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
