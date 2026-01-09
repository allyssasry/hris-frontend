// src/features/admin/EmployeeCreatePage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Upload } from "lucide-react";
import { useAuth } from "@/app/store/authStore";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function EmployeeCreatePage() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const navigate = useNavigate();
  const token = useAuth((s) => s.token);
const user = useAuth((s) => s.user); // dari authStore
const [companyName, setCompanyName] = useState("");

  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [contractType, setContractType] = useState("");

  const [form, setForm] = useState({
      employeeId: "",          // ⭐ BARU (WAJIB)
    email: "",         // ← ⭐ DITAMBAHKAN
    password: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    nik: "",
    gender: "",
    birthDate: "",
    jobdesk: "",
    branch: "",
    grade: "",
    bank: "",
    accountName: "",
    accountNumber: "",
    spType: "",
    education: "",      // ⭐ BARU
    avatar: null,
  });

  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!data?.data) throw new Error("Employee not found");

        const emp = data.data;
console.log("EMPLOYEE DETAIL:", emp);

setForm((prev) => ({
  ...prev,

  // ✅ AMBIL DARI RELASI PRISMA YANG BENAR
  employeeId: String(emp.employeeId ?? ""), // PAKSA STRING
  email: emp.User?.email || "",

  firstName: emp.firstName || "",
  lastName: emp.lastName || "",
  mobileNumber: emp.phone || "",
  nik: emp.nik || "",
  gender: emp.gender || "",
  birthDate: emp.birthDate ? emp.birthDate.substring(0, 10) : "",
  jobdesk: emp.jobdesk || "",
  branch: emp.branch || "",
  grade: emp.grade || "",
  bank: emp.bank || "",
  accountName: emp.accountName || "",
  accountNumber: emp.accountNumber || "",
  spType: emp.spType || "",
    education: emp.education || "",   // ⭐ BARU
  avatar: emp.avatar || null,
}));


        setContractType(emp.contractType || "");
      } catch (err) {
        alert("Gagal memuat data employee.");
        navigate("/admin/employees");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, token, navigate]);

  useEffect(() => {
  async function fetchCompany() {
    try {
      const res = await fetch(`${API_BASE}/api/company/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        console.error("Failed fetch company:", json);
        return;
      }

      setCompanyName(json.data.name); // ✅ INI KUNCI
    } catch (err) {
      console.error("Fetch company error:", err);
    }
  }

  if (token) fetchCompany();
}, [token]);


  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatarFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const url = isEdit
      ? `${API_BASE}/api/employees/${id}`
      : `${API_BASE}/api/employees`;

    const method = isEdit ? "PUT" : "POST";

    const fd = new FormData();
fd.append("employeeId", form.employeeId);

    fd.append("email", form.email);        // ← ⭐ DITAMBAHKAN
    fd.append("password", form.password);

    fd.append("firstName", form.firstName);
    fd.append("lastName", form.lastName);
    fd.append("mobileNumber", form.mobileNumber);
    fd.append("nik", form.nik);
    fd.append("gender", form.gender);
    fd.append("birthDate", form.birthDate);
    fd.append("jobdesk", form.jobdesk);
    fd.append("branch", form.branch);
    fd.append("grade", form.grade);
    fd.append("bank", form.bank);
    fd.append("accountName", form.accountName);
    fd.append("accountNumber", form.accountNumber);
    fd.append("spType", form.spType);
    fd.append("education", form.education); // ⭐ BARU

    fd.append("contractType", contractType);

    if (avatarFile) fd.append("avatar", avatarFile);

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed");

      alert(isEdit ? "Employee updated!" : "Employee created!");
      navigate("/admin/employees");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-6 py-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#1D395E] mb-4">
          {isEdit ? "Edit Employee" : "Employee Database"}
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E1E5ED] px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-xl bg-[#E5E9F2] overflow-hidden flex items-center justify-center">
                {avatarFile ? (
                  <img src={URL.createObjectURL(avatarFile)} className="w-full h-full object-cover" />
                ) : form.avatar ? (
                  <img src={`${API_BASE}${form.avatar}`} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-400">Avatar</span>
                )}
              </div>

              <label className="inline-flex items-center px-3 py-2 rounded-full bg-[#1D395E] text-white text-xs cursor-pointer gap-2">
                <Upload className="w-3 h-3" />
                <span>Upload Avatar</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

<div className="md:col-span-2">
  <label className="text-sm font-medium text-[#1D395E]">
    Company
  </label>
  <input
    value={companyName}
    readOnly
    className="
      w-full rounded-lg border px-3 py-2.5 text-sm 
      bg-gray-100 text-gray-600 cursor-not-allowed
    "
  />
</div>
<Input
  label="Employee ID (Login ID)"
  name="employeeId"
  value={form.employeeId}
  onChange={handleChange}
  disabled={isEdit}
  autoComplete="new-password"   // 🔥 PAKSA BROWSER
/>


              {/* ⭐ EMAIL DITAMBAHKAN DI SINI */}
              <Input label="Email" name="email" value={form.email} onChange={handleChange} />

              <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />

              <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
              <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />

              <Input label="Mobile Number" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} />
              <Input label="NIK" name="nik" value={form.nik} onChange={handleChange} />

              <Select
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                options={[
                  { value: "", label: "Choose Gender" },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
              />
<Select
  label="Pendidikan Terakhir"
  name="education"
  value={form.education}
  onChange={handleChange}
  options={[
    { value: "", label: "Pilih Pendidikan" },
    { value: "sma", label: "SMA" },
    { value: "smk", label: "SMK" },
    { value: "d3", label: "D3" },
    { value: "s1", label: "S1" },
    { value: "s2", label: "S2" },
    { value: "s3", label: "S3" },
  ]}
/>

              <Input label="Tanggal Lahir" type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
{/* ================= TIPE KONTRAK ================= */}
<div className="md:col-span-2">
  <label className="text-sm font-medium text-[#1D395E] mb-2 block">
    Tipe Kontrak
  </label>

  <div className="flex items-center gap-6 text-sm text-[#1A1A1A]">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="contractType"
        value="permanent"
        checked={contractType === "permanent"}
        onChange={(e) => setContractType(e.target.value)}
      />
      Tetap
    </label>

    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="contractType"
        value="contract"
        checked={contractType === "contract"}
        onChange={(e) => setContractType(e.target.value)}
      />
      Kontrak
    </label>
 {/* ⭐ BARU: MAGANG */}
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="contractType"
        value="intern"
        checked={contractType === "intern"}
        onChange={(e) => setContractType(e.target.value)}
      />
      Magang
    </label>
    
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="contractType"
        value="resign"
        checked={contractType === "resign"}
        onChange={(e) => setContractType(e.target.value)}
      />
      Lepas
    </label>
  </div>
</div>

<Select
  label="Jobdesk"
  name="jobdesk"
  value={form.jobdesk}
  onChange={handleChange}
  options={[
    { value: "", label: "Pilih Jobdesk" },
    { value: "IT Manager", label: "IT Manager" },
    { value: "IT Support", label: "IT Support" },
    { value: "HR Manager", label: "HR Manager" },
    { value: "HR Staff", label: "HR Staff" },
    { value: "Finance", label: "Finance" },
    { value: "Accounting", label: "Accounting" },
    { value: "Marketing", label: "Marketing" },
    { value: "Sales", label: "Sales" },
    { value: "Admin", label: "Admin" },
    { value: "Designer", label: "Designer" },
    { value: "Developer", label: "Developer" },
    { value: "Project Manager", label: "Project Manager" },
  ]}
/>
              <Input label="Cabang" name="branch" value={form.branch} onChange={handleChange} />

              <Input label="Grade" name="grade" value={form.grade} onChange={handleChange} />
              <Input label="Bank" name="bank" value={form.bank} onChange={handleChange} />
              <Input label="Nomor Rekening" name="accountNumber" value={form.accountNumber} onChange={handleChange} />
              <Input label="Atas Nama" name="accountName" value={form.accountName} onChange={handleChange} />

              <Select
                label="SP Type"
                name="spType"
                value={form.spType}
                onChange={handleChange}
                options={[
                  { value: "", label: "Pilih SP" },
                  { value: "sp1", label: "SP 1" },
                  { value: "sp2", label: "SP 2" },
                  { value: "sp3", label: "SP 3" },
                ]}
              />
            </div>

            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/employees")}
                className="px-5 py-2.5 border border-[#D1D9E6] rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-[#1D395E] text-white rounded-lg"
              >
                {loading ? "Saving..." : isEdit ? "Update" : "Save"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", disabled }) {
  return (
    <div>
      <label className="text-sm font-medium text-[#1D395E]">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete="off"     // 🔥 INI PENTING
        className="w-full rounded-lg border px-3 py-2.5 text-sm"
      />
    </div>
  );
}


function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="text-sm font-medium text-[#1D395E]">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border px-3 py-2.5 text-sm text-[#1A1A1A] appearance-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
