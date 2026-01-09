// src/features/dashboard/UserDashboard.jsx
import React, { useMemo, useState } from "react";
import {
  Bell, Search, ChevronDown, CircleDot, Clock, Users,
  CalendarClock, HelpCircle, Settings, LayoutGrid, Calendar
} from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "@/assets/branding/logo-hris-1.png";
import { useDashboardData } from "./useDashboardData.js";
import { useMyProfile } from "./useMyProfile";

/* ---------- UI TOKENS ---------- */
const colors = {
  navy: "bg-slate-800",
  textNavy: "text-slate-800",
  soft: "bg-slate-100",
  border: "border-slate-200",
};
const statusColors = {
  ontime: "bg-green-500",
  late: "bg-red-500",
  absent: "bg-yellow-500",
  annual: "bg-sky-500",
  sick: "bg-rose-400",
};

/* ---------- SMALL PARTS ---------- */
function SectionCard({ children, className = "" }) {
  return (
    <section className={`rounded-xl border ${colors.border} bg-white shadow-sm ${className}`}>
      {children}
    </section>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className={`${colors.navy} text-white px-4 py-2 flex items-center gap-2`}>
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      <div className="px-6 py-6 text-3xl font-semibold text-slate-800">{value}</div>
    </div>
  );
}

/* ----- Donut from API ----- */
function Donut({ donut }) {
  const total = Math.max(
    1,
    (donut?.ontime || 0) +
    (donut?.late || 0) +
    (donut?.absent || 0) +
    (donut?.annualLeave || 0) +
    (donut?.sickLeave || 0)
  );

  const parts = [
    ["#22c55e", donut?.ontime || 0],
    ["#ef4444", donut?.late || 0],
    ["#f59e0b", donut?.absent || 0],
    ["#0ea5e9", donut?.annualLeave || 0],
    ["#fb7185", donut?.sickLeave || 0],
  ];
  let acc = 0;
  const conic = parts.map(([c, n]) => {
    const p = (n / total) * 100;
    const from = acc; const to = acc + p; acc = to; return `${c} ${from}% ${to}%`;
  }).join(", ");

  return (
    <div className="relative mx-auto h-48 w-48">
      <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(${conic})` }} />
      <div className="absolute inset-4 rounded-full bg-white" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center leading-tight">
          <div className="text-sm font-semibold text-slate-700">Total</div>
          <div className="text-base font-semibold text-slate-700">Presensi</div>
        </div>
      </div>
    </div>
  );
}

function TinyLegend({ donut }) {
  const Item = ({ label, className, value }) => (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${className}`} />
      <span className="text-sm text-slate-700">{label}</span>
      <span className="text-xs text-slate-500">({value})</span>
    </div>
  );
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
      <Item className={statusColors.ontime} label="Ontime" value={donut?.ontime ?? 0} />
      <Item className={statusColors.late} label="Late" value={donut?.late ?? 0} />
      <Item className={statusColors.absent} label="Absent" value={donut?.absent ?? 0} />
      <Item className={statusColors.annual} label="Annual Leave" value={donut?.annualLeave ?? 0} />
      <Item className={statusColors.sick} label="Sick Leave" value={donut?.sickLeave ?? 0} />
    </div>
  );
}

/* ----- Work hours bar from API ----- */
function WorkHoursChart({ series, totalMinutes }) {
  const max = Math.max(1, ...(series?.map(s => s.minutes) ?? [1]));

  return (
    <div className="relative px-4 pb-6">
      <div className="mb-3">
        <div className="text-lg font-semibold text-slate-700">
          Your Work Hours
        </div>
        <div className="text-slate-500 text-sm">
          {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
        </div>
      </div>

      <div className="relative h-56 w-full border-t border-slate-200 pt-6">
        {/* GRID */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-2 top-6 bottom-2"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(148,163,184,0.6) 0 1px, transparent 1px 32px)"
          }}
        />

        {/* BARS */}
        <div className="relative grid grid-cols-12 items-end gap-3 h-full">
          {(series || []).map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              {/* angka */}
              <div className="text-[10px] text-slate-700 font-medium">
                {Math.floor(s.minutes / 60)}h {s.minutes % 60}m
              </div>

              {/* bar */}
            <div
  className="
    w-6 rounded-md
    bg-sky-400
    hover:bg-sky-700
    transition-colors duration-200
    cursor-pointer
  "
  style={{
    height: `${Math.max(6, (s.minutes / max) * 100)}%`
  }}
  title={`${s.label}: ${Math.floor(s.minutes / 60)}h ${s.minutes % 60}m`}
/>


              {/* label */}
              <div className="text-[10px] text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- PAGE ---------- */
export default function UserDashboard() {
  // state bulan (YYYY-MM)
  const { profile } = useMyProfile();
  const today = new Date();
  const ym = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}`;
  const [month, setMonth] = useState(ym);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState("week"); // "week" | "month"

  const { data, loading, error, reload } = useDashboardData(month, viewMode);
  const cards = data?.cards;
  const donut = data?.donut;
  const leave = data?.leave;

  const totalMinutesThisMonth = useMemo(()=>cards?.workHoursMinutes ?? 0, [cards]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-[1180px] lg:max-w-7xl px-3 py-4">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 rounded-[22px] border border-slate-200 bg-white shadow-[0_6px_18px_rgba(2,6,23,0.08)] ring-1 ring-slate-50 p-4 flex flex-col justify-between">
            <div>
              <div className="px-2 pt-1 pb-4 flex items-center gap-3">
                <img src={logo} alt="HRIS" className="h-8 w-auto" />
                <div className="text-xl font-semibold text-slate-800">HRIS</div>
              </div>
              <nav className="px-2 mt-1 flex flex-col gap-1">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    "flex items-center gap-3 rounded-xl px-3 py-2 " +
                    (isActive ? "bg-[#E6F1F8] text-slate-900 font-semibold" : "text-slate-500 hover:bg-slate-50")
                  }
                >
                  <LayoutGrid className="h-5 w-5 text-slate-700" />
                  Dashboard
                </NavLink>

                <NavLink
                  to="/employees"
                  className={({ isActive }) =>
                    "flex items-center gap-3 rounded-xl px-3 py-2 " +
                    (isActive ? "bg-[#E6F1F8] text-slate-900 font-semibold" : "text-slate-500 hover:bg-slate-50")
                  }
                >
                  <Users className="h-5 w-5" />
                  Employee Database
                </NavLink>

                <NavLink
                  to="/checkclock"
                  className={({ isActive }) =>
                    "flex items-center gap-3 rounded-xl px-3 py-2 " +
                    (isActive ? "bg-[#E6F1F8] text-slate-900 font-semibold" : "text-slate-500 hover:bg-slate-50")
                  }
                >
                  <CalendarClock className="h-5 w-5" />
                  Checkclock
                </NavLink>

                <NavLink
                  to="/schedule"
                  className={({ isActive }) =>
                    "flex items-center gap-3 rounded-xl px-3 py-2 " +
                    (isActive ? "bg-[#E6F1F8] text-slate-900 font-semibold" : "text-slate-500 hover:bg-slate-50")
                  }
                >
                  <Calendar className="h-5 w-5" />
                  Work Schedule
                </NavLink>
              </nav>
            </div>
            <div className="px-2 pt-2 space-y-2 text-sm text-slate-600">
              <a className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-50"><HelpCircle className="h-4 w-4" /> Bantuan(?)</a>
              <a className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-50"><Settings className="h-4 w-4" /> Setting</a>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 p-0 lg:p-1">
            {/* Topbar */}
            <div className="mb-5 flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-800">Dashboard</div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input className="w-[240px] md:w-[360px] rounded-full border border-slate-300 bg-white px-9 py-2 text-sm outline-none focus:border-slate-500" placeholder="Cari" />
                </div>
                <button className="rounded-full p-2 hover:bg-slate-200"><Bell className="h-5 w-5 text-slate-700" /></button>
              <div className="flex items-center gap-2">
  <img
    className="h-9 w-9 rounded-full object-cover"
    src={
      profile?.avatar
        ? `${import.meta.env.VITE_API_URL}${profile.avatar}`
        : "https://ui-avatars.com/api/?name=User"
    }
    alt="avatar"
  />

  <div className="text-xs leading-tight">
   <div className="font-semibold">
  {profile ? `${profile.firstName} ${profile.lastName || ""}` : "Loading"}
</div>

<div className="text-slate-500">
  {profile?.jobdesk || "-"}
</div>
  </div>

  <ChevronDown className="h-4 w-4 text-slate-500" />
</div>

              </div>
            </div>

            {/* Filter bulan */}
            <div className="mb-4">
              <label className="mr-2 text-sm text-slate-600">Bulan:</label>
              <input
                type="month"
                value={month}
                onChange={(e)=>setMonth(e.target.value)}
                className="rounded-md border px-2 py-1 text-sm"
              />
              <button onClick={reload} className="ml-2 rounded-md border px-3 py-1 text-sm">Reload</button>
              {loading && <span className="ml-3 text-sm text-slate-500">Loading…</span>}
              {error && <span className="ml-3 text-sm text-rose-600">{error}</span>}
            </div>

            {/* Stat cards (pakai data API) */}
            <div className="grid gap-5 md:grid-cols-4">
              <StatCard icon={<Clock className="h-4 w-4" />} title="Work Hours"
                        value={`${Math.floor((cards?.workHoursMinutes||0)/60)}`} />
              <StatCard icon={<CircleDot className="h-4 w-4" />} title="On Time"
                        value={`${cards?.onTime ?? 0}`} />
              <StatCard icon={<CircleDot className="h-4 w-4" />} title="Late"
                        value={`${cards?.late ?? 0}`} />
              <StatCard icon={<CircleDot className="h-4 w-4" />} title="Not Attend"
                        value={`${cards?.notAttend ?? 0}`} />
            </div>

            {/* Middle widgets */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
            <SectionCard className="p-5">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-bold text-slate-800">
      Attendance Summary
    </h3>

    {/* Month selector (AKTIF) */}
    <input
      type="month"
      value={month}
      onChange={(e) => setMonth(e.target.value)}
      className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-700 cursor-pointer"
    />
  </div>


  <Donut donut={donut} />
  <TinyLegend donut={donut} />
</SectionCard>


              <SectionCard className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Leave Summary</h3>
                  <input
  type="month"
  value={month}
  onChange={(e) => setMonth(e.target.value)}
  className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-700 cursor-pointer"
/>

                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-300 overflow-hidden">
                    <div className="px-4 py-3 font-semibold text-slate-700">
                      • Total Quota Annual Leave: {leave?.quotaDays ?? 0} hari
                    </div>
                    <div className="border-t px-4 py-2 text-sm">
                      <button className="rounded-md border border-slate-300 px-3 py-1">Request Leave</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-slate-300 overflow-hidden">
                      <div className="px-4 py-3 font-semibold text-slate-700">
                        • Taken: {leave?.takenDays ?? 0} hari
                      </div>
                      <div className="border-t px-4 py-2 text-sm">
                        <button className="rounded-md border border-slate-300 px-3 py-1">See Details</button>
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-300 overflow-hidden">
                      <div className="px-4 py-3 font-semibold text-slate-700">
                        • Remaining: {leave?.remainingDays ?? 0} hari
                      </div>
                      <div className="border-t px-4 py-2 text-sm">
                        <button className="rounded-md border border-slate-300 px-3 py-1">Request Leave</button>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Work hours chart */}
<SectionCard className="mt-6 relative z-10">
              <div className="flex items-center justify-between p-4">
                <div className="text-lg font-bold text-slate-700">Your Work Hours</div>
<div className="relative">
  <button
    onClick={() => setOpen(o => !o)}
    className="rounded-lg border border-slate-300 px-3 py-1 text-sm flex items-center gap-2"
  >
    view by {viewMode}
    <ChevronDown className="h-4 w-4" />
  </button>

  {open && (
    <div className="absolute right-0 mt-2 w-32 rounded-lg border text-black bg-white shadow-lg z-20">
      {["week", "month"].map(v => (
        <button
          key={v}
          onClick={() => {
            setViewMode(v);
            setOpen(false);
          }}
          className={`block w-full px-3 py-2 text-left text-sm hover:bg-slate-100 ${
            viewMode === v ? "font-semibold text-slate-900" : ""
          }`}
        >
          by {v}
        </button>
      ))}
    </div>
  )}
</div>


              </div>
            <WorkHoursChart
  series={data?.workHours?.series || []}
  totalMinutes={data?.workHours?.totalMinutes || 0}
/>

            </SectionCard>
          </main>
        </div>
      </div>
    </div>
  );
}
