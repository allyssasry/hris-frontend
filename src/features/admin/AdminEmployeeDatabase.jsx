// ===================== AdminEmployeeDatabase.jsx ==========================

import {
  Bell,
  Search,
  ChevronDown,
  Plus,
  Edit3,
  Trash2,
  Eye,
  LayoutGrid,
  Users2,
  Clock3,
  CalendarDays,
} from "lucide-react";

import { useAuth } from "@/app/store/authStore";
import { useNavigate, NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import logo from "@/assets/branding/logo-hris-1.png";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
function calculateEmployeeSummary(employees) {
  const summary = {
    total: employees.length,
    newHire: 0,     // magang + kontrak
    fullTime: 0,    // permanent
    resign: 0,
  };

  employees.forEach((emp) => {
    const type = (emp.contractType || "").toLowerCase();

    // ✅ NEW HIRE = MAGANG + KONTRAK
    if (type === "intern" || type === "magang" || type === "contract") {
      summary.newHire++;
    }

    // ✅ FULL TIME = PERMANENT
    else if (type === "permanent") {
      summary.fullTime++;
    }

    // ✅ RESIGN
    else if (type === "resign") {
      summary.resign++;
    }
  });

  return summary;
}


export default function AdminDashboard() {
  const user = useAuth((s) => s.user);
  const token = useAuth((s) => s.token);
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [detailData, setDetailData] = useState(null);
// ==================== SUMMARY ====================
const summary = useMemo(
  () => calculateEmployeeSummary(employees),
  [employees]
);

  const displayName =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : user?.username || "Admin";

  // 🌟 FETCH EMPLOYEE DATA
  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/employees`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const list = data?.data || [];
        setEmployees(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to load employees:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // ==================== SUMMARY ====================

  const periode = new Date().toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  // ==================== SEARCH ====================
  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();

    return employees.filter((emp) => {
      const fullname = `${emp.firstName ?? ""} ${emp.lastName ?? ""}`.toLowerCase();
      return (
        fullname.includes(q) ||
        emp?.phone?.toLowerCase?.().includes(q) ||
        emp?.branch?.toLowerCase?.().includes(q)
      );
    });
  }, [search, employees]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const ok = confirm("Yakin ingin menghapus data karyawan ini?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/api/employees/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data employee.");
    }
  };

  const openDetail = (emp) => setDetailData(emp);
  const closeDetail = () => setDetailData(null);

  return (
    <div className="min-h-screen bg-[#F5F8FD] flex justify-center">
      <div className="flex w-full max-w-[1440px] px-4 py-4 gap-4">

        {/* SIDEBAR */}
        <aside className="flex flex-col w-[220px] bg-white rounded-[24px] shadow border border-[#E2E8F0] pt-6 pb-6">
          <div className="flex items-center justify-center mb-10 px-4">
            <img src={logo} className="h-10 object-contain" />
          </div>

          <nav className="flex-1 space-y-2 px-4 text-[13px]">
            <SidebarItem to="/admin/dashboard" label="Dashboard" icon={LayoutGrid} />
            <SidebarItem to="/admin/employees" label="Employee Database" icon={Users2} />
            <SidebarItem to="/admin/checkclock" label="Checkclock" icon={Clock3} />
            <SidebarItem to="/work-schedule" label="Work Schedule" icon={CalendarDays} />
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1 flex flex-col">
          <TopBar search={search} setSearch={setSearch} />

          {/* SUMMARY BAR */}
          <section className="w-full bg-[#F5F8FD] border border-[#CBD5E1] rounded-[15px] px-8 py-4 mb-6 flex items-center justify-between">
            <SummaryItem label="Periode" value={periode} bold />
            <Divider />
<SummaryItem label="Total Employee" value={summary.total} />
            <Divider />
<SummaryItem label="Total New Hire" value={summary.newHire} />
            <Divider />
<SummaryItem label="Full Time Employee" value={summary.fullTime} />
          </section>

          {/* TABLE */}
          <EmployeesTable
            employees={filteredEmployees}
            loading={loading}
            navigate={navigate}
            handleDelete={handleDelete}
            openDetail={openDetail}
          />
        </main>
      </div>

      {detailData && <DetailPanel data={detailData} close={closeDetail} />}
    </div>
  );
}

/* ================================================================
   COMPONENTS
================================================================ */

// --- SUMMARY ITEM ---
function SummaryItem({ label, value, bold }) {
  return (
    <div className="flex flex-col text-center">
      <span className="text-[12px] text-[#1A2A46]">{label}</span>
      <span className={`text-[18px] ${bold ? "font-bold" : "font-semibold"} text-[#153962]`}>
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="h-10 w-px bg-[#90A4BE]" />;
}

// --- SIDEBAR ITEM ---
function SidebarItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-full ${
          isActive ? "bg-[#E3EFFA] text-[#1A2A46]" : "text-[#8B90A0] hover:bg-[#F5F7FB]"
        }`
      }
    >
      <Icon className="w-4" />
      <span>{label}</span>
    </NavLink>
  );
}

// --- TOP BAR ---
function TopBar({ search, setSearch }) {
  return (
    <div className="flex items-center gap-4 mb-3 mt-1">
      <h1 className="text-[22px] font-semibold text-[#153962]">Employee Database</h1>

      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-[540px]">
          <input
            type="text"
            placeholder="Cari"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[40px] pl-4 pr-4 rounded-full bg-[#F4F8FC] border border-[#99B3CD] text-[13px] text-[#153962]"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 text-[#355C82]" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// ⭐ EMPLOYEES TABLE (COMPLETE WITH UNIVERSAL AVATAR HANDLER)
// ---------------------------------------------------------------------
function EmployeesTable({ employees, loading, navigate, handleDelete, openDetail }) {
  return (
    <section className="bg-white rounded-[24px] shadow-sm border border-[#E2E8F0]">

      <div className="px-6 pt-4 pb-3 border-b border-[#E2E8F0] flex justify-between">
        <p className="font-semibold text-[14px] text-[#153962]">
          All Employees Information
        </p>

        <button
          onClick={() => navigate("/admin/employees/new")}
          className="px-3 py-1.5 rounded-full bg-[#EB3B7A] text-white text-[11px] flex items-center gap-1"
        >
          <Plus className="w-3" /> Tambah Data
        </button>
      </div>

      <div className="px-6 pb-4 pt-1 overflow-x-auto">
        <table className="min-w-full text-[11px]">
          <thead>
            <tr className="bg-[#F5F7FB] text-[#1A1A1A]">
              <Th align="left">No</Th>
              <Th>Avatar</Th>
              <Th align="left">Nama</Th>
              <Th align="left">Gender</Th>
              <Th align="left">Telepon</Th>
              <Th align="left">Cabang</Th>
              <Th align="left">Jabatan</Th>
              <Th align="left">Grade</Th>
              <Th align="center">Contract</Th>
              <Th align="center">Action</Th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp, idx) => {
              const fullName = `${emp.firstName ?? ""} ${emp.lastName ?? ""}`.trim();

              // ⭐ UNIVERSAL AVATAR LOGIC
              let avatarURL = null;

              if (emp.avatar) {
                if (emp.avatar.startsWith("http")) {
                  avatarURL = emp.avatar;
                } else if (emp.avatar.includes("/uploads/")) {
                  avatarURL = `${API_BASE}${emp.avatar}`;
                } else {
                  avatarURL = `${API_BASE}/uploads/avatars/${emp.avatar}`;
                }
              }

              return (
                <tr key={emp.id} className="border-b hover:bg-[#F9FBFF] text-[#1A1A1A]">

                  <Td align="left">{idx + 1}</Td>

                  <Td>
                    {avatarURL ? (
                      <img
                        src={avatarURL}
                        alt="avatar"
                        className="h-7 w-7 rounded-full object-cover mx-auto"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-gray-300 mx-auto" />
                    )}
                  </Td>

                  <Td align="left">{fullName}</Td>
                  <Td align="left">{emp.gender}</Td>
                  <Td align="left">{emp.phone}</Td>
                  <Td align="left">{emp.branch}</Td>
                  <Td align="left">{emp.jobdesk}</Td>
                  <Td align="left">{emp.grade}</Td>

                  <Td align="center">
                    <span className="px-3 py-1 rounded-full bg-[#EFF6FF] text-[#1A1A1A]">
                      {emp.contractType || "-"}
                    </span>
                  </Td>

                  <Td align="center">
                    <div className="flex justify-center gap-1">
                      <IconButton variant="info" onClick={() => openDetail(emp)}>
                        <Eye className="w-3" />
                      </IconButton>

                      <IconButton
                        variant="primary"
                        onClick={() => navigate(`/admin/employees/${emp.id}/edit`)}
                      >
                        <Edit3 className="w-3" />
                      </IconButton>

                      <IconButton variant="danger" onClick={() => handleDelete(emp.id)}>
                        <Trash2 className="w-3" />
                      </IconButton>
                    </div>
                  </Td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// ⭐ DETAIL PANEL (COMPLETE WITH UNIVERSAL AVATAR HANDLER)
// ---------------------------------------------------------------------
function DetailPanel({ data, close }) {
  let avatarURL = null;

  if (data.avatar) {
    if (data.avatar.startsWith("http")) {
      avatarURL = data.avatar;
    } else if (data.avatar.includes("/uploads/")) {
      avatarURL = `${API_BASE}${data.avatar}`;
    } else {
      avatarURL = `${API_BASE}/uploads/avatars/${data.avatar}`;
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
      <div className="flex-1" onClick={close} />

      <div className="w-[380px] h-full bg-white shadow-xl p-6 overflow-y-auto">

        <h2 className="text-lg font-semibold text-[#153962] mb-4">Employee Detail</h2>

        <div className="flex justify-center mb-4">
          {avatarURL ? (
            <img
              src={avatarURL}
              className="h-20 w-20 rounded-full object-cover border"
            />
          ) : (
            <div className="h-20 w-20 bg-gray-300 rounded-full" />
          )}
        </div>

        <div className="space-y-2 text-[14px] text-[#1A1A1A]">
          <p><b>Nama:</b> {data.firstName} {data.lastName}</p>
          <p><b>Gender:</b> {data.gender}</p>
          <p><b>Telepon:</b> {data.phone}</p>
          <p><b>NIK:</b> {data.nik}</p>
          <p><b>Tanggal Lahir:</b> {data.birthDate?.substring(0, 10)}</p>
          <p><b>Jobdesk:</b> {data.jobdesk}</p>
          <p><b>Cabang:</b> {data.branch}</p>
          <p><b>Grade:</b> {data.grade}</p>
          <p><b>Bank:</b> {data.bank}</p>
          <p><b>Rekening:</b> {data.accountNumber}</p>
          <p><b>A/N:</b> {data.accountName}</p>
          <p><b>SP Type:</b> {data.spType}</p>
          <p><b>Tipe Kontrak:</b> {data.contractType}</p>
        </div>

      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// SMALL COMPONENTS
// ---------------------------------------------------------------------
function IconButton({ children, variant, ...props }) {
  const style =
    variant === "danger"
      ? "border-red-300 bg-red-50 text-red-700"
      : variant === "primary"
      ? "border-blue-300 bg-blue-50 text-blue-700"
      : "border-gray-300 bg-gray-100 text-[#1A1A1A]";

  return (
    <button {...props} className={`h-7 w-7 rounded-md border flex items-center justify-center ${style}`}>
      {children}
    </button>
  );
}

function Th({ children, align }) {
  return <th className={`px-3 py-2 text-${align} font-semibold text-[#1A1A1A]`}>{children}</th>;
}

function Td({ children, align }) {
  return <td className={`px-3 py-2 text-${align} text-[#1A1A1A]`}>{children}</td>;
}
