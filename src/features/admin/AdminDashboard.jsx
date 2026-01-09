// src/features/admin/AdminDashboard.jsx
import {
  Search,
  Bell,
  LayoutDashboard,
  Users2,
  Clock3,
  CalendarDays,
  HelpCircle,
  Settings,
  UserCircle,
  UsersRound,
  UserPlus,
  UserCheck,
  UserMinus,
} from "lucide-react";

import { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/app/store/authStore";
import logo from "@/assets/branding/logo-hris-1.png";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const MONTHS = [
  { label: "Januari", value: 1 },
  { label: "Februari", value: 2 },
  { label: "Maret", value: 3 },
  { label: "April", value: 4 },
  { label: "Mei", value: 5 },
  { label: "Juni", value: 6 },
  { label: "Juli", value: 7 },
  { label: "Agustus", value: 8 },
  { label: "September", value: 9 },
  { label: "Oktober", value: 10 },
  { label: "November", value: 11 },
  { label: "Desember", value: 12 },
];
/* ===================== HELPER ===================== */


/* ===================== ✅ HELPER (HARUS DI LUAR COMPONENT) ===================== */
function calculateEmployeeStatus(distribution) {
  const total =
    distribution.permanent +
    distribution.contract +
    distribution.intern || 1;

  return [
    {
      label: "Permanen",
      value: +((distribution.permanent / total) * 100).toFixed(2),
      color: "#1D395E",
    },
    {
      label: "PKWT (Kontrak)",
      value: +((distribution.contract / total) * 100).toFixed(2),
      color: "#3B82F6",
    },
    {
      label: "Magang",
      value: +((distribution.intern / total) * 100).toFixed(2),
      color: "#94A3B8",
    },
  ];
}


function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function AdminDashboard() {
  const user = useAuth((s) => s.user);
  const token = useAuth((s) => s.token);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);

// Current Number
const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
const [showCurrentPicker, setShowCurrentPicker] = useState(false);

// Employee Status
const [statusMonth, setStatusMonth] = useState(new Date().getMonth() + 1);
const [statusYear, setStatusYear] = useState(new Date().getFullYear());
const [showStatusPicker, setShowStatusPicker] = useState(false);
const [attendanceStats, setAttendanceStats] = useState({
  onTime: 0,
  late: 0,
  absent: 0,
  annualLeave: 0,
  sickLeave: 0,
});

const [attendanceMonth, setAttendanceMonth] = useState(
  new Date().getMonth() + 1
);
const [attendanceYear, setAttendanceYear] = useState(
  new Date().getFullYear()
);
const [attendanceTable, setAttendanceTable] = useState([]);

// Attendance picker
const [showAttendancePicker, setShowAttendancePicker] = useState(false);


  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    active: 0,
    resigned: 0,
  });
const [statusDistribution, setStatusDistribution] = useState({
  permanent: 0,
  contract: 0,
  intern: 0,
});

  // === Display Name ===
  const displayName =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : user?.username || "Admin";

  // === FIX role ===
  const roleLabel = user?.role || (user?.isAdmin ? "ADMIN" : "USER");

  // === FETCH EMPLOYEES FROM BACKEND ===
useEffect(() => {
  if (!token) return;

  fetch(
    `${API_BASE}/api/employees/stats?month=${currentMonth}&year=${currentYear}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
    .then((res) => res.json())
    .then((json) => {
      setStats(json.stats);
setLastUpdated(json.lastUpdated);
    });
}, [token, currentMonth, currentYear]);

useEffect(() => {
  if (!token) return;

  fetch(
    `${API_BASE}/api/employees/stats?month=${statusMonth}&year=${statusYear}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
   .then((res) => res.json())
    .then((json) => {
      setStatusDistribution(json.statusDistribution); // ✅ WAJIB
    });
}, [token, statusMonth, statusYear]);

useEffect(() => {
  if (!token) return;

  fetch(
    `${API_BASE}/api/admin/checkclock/attendance/stats?month=${attendanceMonth}&year=${attendanceYear}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((json) => {
      if (json.success) {
        setAttendanceStats(json.stats);
      }
    });
}, [token, attendanceMonth, attendanceYear]);


useEffect(() => {
  if (!token) return;

  fetch(
    `${API_BASE}/api/admin/checkclock/attendance/table?month=${attendanceMonth}&year=${attendanceYear}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
    .then((res) => res.json())
    .then((json) => {
      if (json.success) {
        setAttendanceTable(json.data);
      }
    });
}, [token, attendanceMonth, attendanceYear]);

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter((emp) => {
      const fullName = `${emp.firstName ?? ""} ${emp.lastName ?? ""}`.toLowerCase();
      return (
        fullName.includes(q) ||
        emp?.phone?.toLowerCase?.().includes(q) ||
        emp?.branch?.toLowerCase?.().includes(q)
      );
    });
  }, [employees, search]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-56 bg-white shadow-md rounded-r-2xl flex flex-col py-6 px-4">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <img src={logo} alt="HRIS logo" className="w-10 h-10 object-contain" />
          <span className="text-lg font-semibold text-[#1D395E]">HRIS</span>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-1">
          <SidebarItem to="/dashboard" label="Dashboard" icon={LayoutDashboard} />
          <SidebarItem to="/admin/employees" label = "Employee Database" icon={Users2} />
          <SidebarItem to="/admin/checkclock" label="Checkclock" icon={Clock3} />
          <SidebarItem to="/work-schedule" label="Work Schedule" icon={CalendarDays} />
        </nav>

        {/* Bottom menu */}
        <div className="mt-6 border-t border-[#E5E9F2] pt-4 space-y-1">
          <BottomItem icon={HelpCircle} label="Bantuan(?)" />
          <BottomItem icon={Settings} label="Setting" />
        </div>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 px-6 py-6">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#1D395E]">Dashboard</h1>

          {/* Search */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center w-full max-w-md rounded-full bg-white border border-[#D1D9E6] px-4 py-1.5 shadow-sm">
              <input
                className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
                placeholder="Cari"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="w-4 h-4 text-gray-500" />
            </div>
          </div>

          {/* Right: bell + user */}
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full bg-white border border-[#D1D9E6] flex items-center justify-center shadow-sm">
              <Bell className="w-4 h-4 text-[#1D395E]" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
                <UserCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-medium text-[#111827]">{displayName}</span>
                <span className="text-[11px] text-gray-500 uppercase">{roleLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ====== TOP STAT CARDS ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
<DashboardStatCard
  icon={UsersRound}
  title="Total Employee"
  value={stats.total}
  subtitle={`Updated: ${formatDate(lastUpdated)}`}
/>

<DashboardStatCard
  icon={UserPlus}
  title="New Employees"
  value={stats.new}
  subtitle={`Updated: ${formatDate(lastUpdated)}`}
/>

<DashboardStatCard
  icon={UserCheck}
  title="Active Employees"
  value={stats.active}
  subtitle={`Updated: ${formatDate(lastUpdated)}`}
/>

<DashboardStatCard
  icon={UserMinus}
  title="Resigned Employees"
  value={stats.resigned}
  subtitle={`Updated: ${formatDate(lastUpdated)}`}
/>



        </div>

        {/* ===== ROW 2: 2 CHART ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Left */}
<ChartCurrentEmployee
  stats={stats}
  selectedMonth={currentMonth}
  selectedYear={currentYear}
  onPick={() => setShowCurrentPicker(true)}
/>



          {/* Right */}
      <ChartEmployeeStatus
  statusDistribution={statusDistribution}
  selectedMonth={statusMonth}
  selectedYear={statusYear}
  onPick={() => setShowStatusPicker(true)}
/>


        </div>

        {/* ===== ROW 3: PIE + TABLE ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AttendancePie
    stats={attendanceStats}
    selectedMonth={attendanceMonth}
    selectedYear={attendanceYear}
  />

 <AttendanceTable
  attendanceStats={attendanceStats}
  rows={attendanceTable}
  selectedMonth={attendanceMonth}
  selectedYear={attendanceYear}
  onPickMonth={() => setShowAttendancePicker(true)}
/>



        </div>

      </main>
      {/* ===== MONTH PICKER (HARUS DI SINI) ===== */}
   {showCurrentPicker && (
  <MonthPicker
    selectedMonth={currentMonth}
    selectedYear={currentYear}
    onSelect={(m, y) => {
      setCurrentMonth(m);
      setCurrentYear(y);
    }}
    onClose={() => setShowCurrentPicker(false)}
  />
)}

{showStatusPicker && (
  <MonthPicker
    selectedMonth={statusMonth}
    selectedYear={statusYear}
    onSelect={(m, y) => {
      setStatusMonth(m);
      setStatusYear(y);
    }}
    onClose={() => setShowStatusPicker(false)}
  />
)}
{showAttendancePicker && (
  <MonthPicker
    selectedMonth={attendanceMonth}
    selectedYear={attendanceYear}
    onSelect={(m, y) => {
      setAttendanceMonth(m);
      setAttendanceYear(y);
    }}
    onClose={() => setShowAttendancePicker(false)}
  />
)}

  </div>
  );
}

// ===================== MONTH PICKER =====================
function MonthPicker({
  selectedMonth,
  selectedYear,
  onSelect,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-[320px] p-4">
        <h3 className="text-sm font-semibold text-[#1D395E] mb-3">
          Pilih Bulan
        </h3>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {MONTHS.map((m) => (
            <button
              key={m.value}
              onClick={() => {
                onSelect(m.value, selectedYear);
                onClose();
              }}
              className={`text-xs px-2 py-2 rounded-lg border
                ${
                  selectedMonth === m.value
                    ? "bg-[#1D395E] text-white"
                    : "bg-white text-[#1D395E] hover:bg-[#E5E9F2]"
                }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-xs px-3 py-1 rounded-full border border-[#D1D9E6]"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* ========================== SUB COMPONENTS ================================ */
/* ========================================================================== */

function SidebarItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm relative
        transition-colors 
        ${isActive ? "bg-[#1D395E] text-white shadow-sm" : "text-[#4B5563] hover:bg-[#E5E9F2]"}
        `
      }
    >
      {/* Active Indicator (dot) */}
      <div
        className={`
          absolute left-[-10px] w-2 h-2 rounded-full 
          ${window.location.pathname === to ? "bg-[#1D395E]" : "bg-transparent"}
        `}
      />

      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  );
}


function BottomItem({ icon: Icon, label }) {
  return (
    <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#4B5563] hover:bg-[#E5E9F2] w-full text-left">
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}

/* ===================== DashboardStatCard (UI EXACT LIKE IMAGE) ===================== */
function DashboardStatCard({ icon: Icon, title, value, subtitle }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-[#E3E7EF] px-4 py-3 flex flex-col gap-3">
      {/* Icon + Title */}
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-[#C72560]" strokeWidth={2.4} />
        <p className="text-sm font-semibold text-[#1D395E]">{title}</p>
      </div>

      {/* Value */}
      <p className="text-3xl font-semibold text-black">{value}</p>

      {/* Footer */}
      <div className="bg-[#0F2A47] text-white text-[11px] py-2 px-3 rounded-lg mt-1">
        {subtitle}
      </div>
    </div>
  );
}

/* ===================== Charts & Bars ===================== */

function LegendDot({ color, label, textColor }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span
        className="text-[11px]"
        style={{ color: textColor || "#1F2937" }}
      >
        {label}
      </span>
    </div>
  );
}

function BarGroup({ label, values }) {
  const max = Math.max(...values, 1);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-end gap-2 h-[140px]">
        {values.map((v, i) => (
          <div
            key={i}
            className="rounded-t-md"
            style={{
              width: "14px",
              height: `${(v / max) * 100}%`,
              backgroundColor: i === 0 ? "#D52F2F" : "#1D395E",
            }}
          />
        ))}
      </div>
      <span className="text-[11px] text-gray-500">{label}</span>
    </div>
  );
}

function StatusBar({ label, value, max, color }) {
  const width = `${Math.min((value / max) * 100, 100)}%`;

  return (
    <div>
      <div className="flex justify-between mb-1 text-[11px] font-medium">
        <span style={{ color }}>{label}</span>
        <span style={{ color }}>{value}</span>
      </div>

      <div className="w-full h-2 rounded-full bg-[#E5E9F2] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width, backgroundColor: color }}
        />
      </div>
    </div>
  );
}


/* ===================== Chart Components ===================== */
function calculateChartEmployee(employees) {
  const result = {
    new: 0,
    active: 0,
    resign: 0,
  };

  employees.forEach((emp) => {
    const type = (emp.contractType || "").toLowerCase();

    if (type === "resign" || type === "terminated") {
      result.resign++;
    } else {
      result.active++;
      if (isNewEmployee(emp.createdAt)) {
        result.new++;
      }
    }
  });

  return result;
}

function ChartCurrentEmployee({
  stats,
  selectedMonth,
  selectedYear,
  onPick,
}) {

  return (
    <div className="bg-white rounded-2xl border border-[#E1E5ED] shadow-sm p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] text-gray-400">Employee Statistics</p>
          <h2 className="text-sm font-semibold text-[#1D395E]">
            Current Number of Employee
          </h2>
        </div>

        <button
          className="text-[11px] px-3 py-1 rounded-full bg-[#1D395E] text-white"
onClick={onPick}
        >
          {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear}
        </button>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-6 flex-1 px-4">
        <BarGroup label="New" values={[stats.new]} />
        <BarGroup label="Active" values={[stats.active]} />
        <BarGroup label="Resign" values={[stats.resigned]} />
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-[11px] text-gray-500 mt-4">
        <LegendDot color="#1D395E" label="Employee" />
      </div>
    </div>
  );
}

function ChartEmployeeStatus({
  statusDistribution,
  selectedMonth,
  selectedYear,
  onPick,
}) {
  const data = calculateEmployeeStatus(statusDistribution);

  return (
    <div className="bg-white rounded-2xl border border-[#E1E5ED] shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] text-gray-400">Employee Statistics</p>
          <h2 className="text-sm font-semibold text-[#1D395E]">
            Employee Status
          </h2>
        </div>
         <button
    className="text-[11px] px-3 py-1 rounded-full bg-[#1D395E] text-white"
onClick={onPick}
  >
    {MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}
  </button>
      </div>

      <div className="space-y-4">
        {data.map((item) => (
          <StatusBar key={item.label} {...item} max={100} />
        ))}
      </div>
    </div>
  );
}




/* ===================== Attendance ===================== */
function AttendancePie({ stats, selectedMonth, selectedYear }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E1E5ED] shadow-sm p-4 flex">
      {/* PIE (placeholder, nanti bisa pakai chart lib) */}
      <div className="flex items-center justify-center w-1/2">
        <div className="relative w-40 h-40 rounded-full bg-[#E5E9F2] flex items-center justify-center">
          <span className="text-xs font-semibold text-[#1D395E]">
            Attendance
          </span>
        </div>
      </div>

      {/* LEGEND */}
      <div className="w-1/2 flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#1D395E] mb-1">
            Statistics Attendance
          </h2>

          <div className="space-y-1 text-[11px] font-medium">
            <LegendDot
              color="#16A34A"
              label={`Ontime (${stats.onTime})`}
            />
            <LegendDot
              color="#FACC15"
              label={`Late (${stats.late})`}
            />
            <LegendDot
              color="#EF4444"
              label={`Absent (${stats.absent})`}
            />
            <LegendDot
              color="#0EA5E9"
              label={`Annual Leave (${stats.annualLeave})`}
            />
            <LegendDot
              color="#6366F1"
              label={`Sick Leave (${stats.sickLeave})`}
            />
          </div>
        </div>

        <div className="text-right text-[11px] text-[#6B7280] font-medium">
          {MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}
        </div>
      </div>
    </div>
  );
}


function AttendanceTable({
  attendanceStats,
  rows,
  selectedMonth,
  selectedYear,
  onPickMonth,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E1E5ED] shadow-sm p-4 flex flex-col gap-3">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#1D395E]">Attendance</h2>

          {/* STAT */}
          <p className="text-[11px] text-gray-500 mt-1 flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span className="font-semibold text-[#16A34A]">
                {attendanceStats.onTime}
              </span>
              Ontime
            </span>

            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#F97316]" />
              <span className="font-semibold text-[#F97316]">
                {attendanceStats.late}
              </span>
              Late
            </span>

            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
              <span className="font-semibold text-[#EF4444]">
                {attendanceStats.absent}
              </span>
              Absent
            </span>
          </p>
        </div>

        {/* SELECT MONTH BUTTON */}
        <button
          onClick={onPickMonth}
          className="text-[11px] px-3 py-1 rounded-full bg-[#1D395E] text-white"
        >
          {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear}
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-[#E5E9F2]">
        <table className="w-full text-xs">
          <thead className="bg-[#F3F4F6] text-[#6B7280]">
            <tr>
              <th className="py-2 px-3 text-left">No</th>
              <th className="py-2 px-3 text-left">Nama</th>
              <th className="py-2 px-3 text-left">Status Kehadiran</th>
              <th className="py-2 px-3 text-left">Check In</th>
            </tr>
          </thead>

          <tbody className="text-[#111827]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No attendance data
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <AttendanceRow key={row.no} {...row} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AttendanceRow({ no, name, status, statusColor, checkIn }) {
  return (
    <tr className="border-t border-[#E5E9F2]">
      <td className="py-2 px-3">{no}</td>
      <td className="py-2 px-3">{name}</td>

      <td className="py-2 px-3">
        <span
          className="inline-flex items-center justify-center
                     px-4 py-1 min-w-[72px]
                     rounded-full text-[11px] font-semibold text-white"
          style={{ backgroundColor: statusColor }}
        >
          {status}
        </span>
      </td>

      <td className="py-2 px-3 font-medium">{checkIn}</td>
    </tr>
  );
}


