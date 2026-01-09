// src/pages/ProfileSettings.jsx
import { useEffect, useState } from "react";
import { getEmployeeById, updateEmployee } from "@/services/employeeService";

export default function ProfileSettings() {
  const employeeId = localStorage.getItem("employee_id"); // 🔑 simpan saat login
  const [employee, setEmployee] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await getEmployeeById(employeeId);
      setEmployee(res.data);
      setForm({
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        mobileNumber: res.data.phone,
        nik: res.data.nik,
        gender: res.data.gender,
        education: res.data.education,
        birthPlace: res.data.branch, // mapping tempat tinggal
        bank: res.data.bank,
        accountName: res.data.accountName,
        accountNumber: res.data.accountNumber,
      });
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSave() {
    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) fd.append(key, form[key]);
    });

    if (avatarFile) {
      fd.append("avatar", avatarFile);
    }

    try {
      await updateEmployee(employeeId, fd);
      alert("Profil berhasil diperbarui");
      setEdit(false);
      fetchProfile();
    } catch (err) {
      alert(err.message || "Gagal update profil");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white rounded-xl">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Pengaturan Profil</h2>
        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={onSave}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Simpan
          </button>
        )}
      </div>

      {/* ================= AVATAR ================= */}
      <div className="flex gap-6 mb-8">
        <img
          src={`${import.meta.env.VITE_API_URL}${employee.avatar}`}
          className="w-24 h-24 rounded-full object-cover"
        />
        {edit && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
        )}
      </div>

      {/* ================= DATA PRIBADI ================= */}
      <Section title="Data Pribadi">
        <Input label="First Name" name="firstName" {...{ edit, form, onChange }} />
        <Input label="Last Name" name="lastName" {...{ edit, form, onChange }} />
        <Input label="No. Handphone" name="mobileNumber" {...{ edit, form, onChange }} />
        <Input label="NIK" name="nik" {...{ edit, form, onChange }} />

        <Select
          label="Jenis Kelamin"
          name="gender"
          edit={edit}
          value={form.gender}
          onChange={onChange}
          options={[
            { value: "male", label: "Laki-laki" },
            { value: "female", label: "Perempuan" },
          ]}
        />

        <Select
          label="Pendidikan Terakhir"
          name="education"
          edit={edit}
          value={form.education}
          onChange={onChange}
          options={[
            { value: "sma", label: "SMA" },
            { value: "smk", label: "SMK" },
            { value: "d3", label: "D3" },
            { value: "s1", label: "S1" },
            { value: "s2", label: "S2" },
          ]}
        />

        <Input label="Tempat Tinggal" name="birthPlace" {...{ edit, form, onChange }} />
      </Section>

      {/* ================= REKENING ================= */}
      <Section title="Informasi Rekening">
        <Input label="Bank" name="bank" {...{ edit, form, onChange }} />
        <Input label="Atas Nama" name="accountName" {...{ edit, form, onChange }} />
        <Input label="No Rekening" name="accountNumber" {...{ edit, form, onChange }} />
      </Section>

      {/* ================= PASSWORD ================= */}
      {edit && (
        <Section title="Ubah Password">
          <Input
            label="Password Baru"
            name="password"
            type="password"
            {...{ edit, form, onChange }}
          />
        </Section>
      )}
    </div>
  );
}

/* ================= REUSABLE ================= */

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Input({ label, name, form, edit, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name] || ""}
        disabled={!edit}
        onChange={onChange}
        className="w-full mt-1 px-3 py-2 border rounded disabled:bg-gray-100"
      />
    </div>
  );
}

function Select({ label, name, value, edit, onChange, options }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <select
        name={name}
        value={value || ""}
        disabled={!edit}
        onChange={onChange}
        className="w-full mt-1 px-3 py-2 border rounded disabled:bg-gray-100"
      >
        <option value="">Pilih</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
