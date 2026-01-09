import React, { useEffect, useState } from "react";
import { http } from "@/lib/http";
import { Link } from "react-router-dom";
import { Search, Check, X, LogOut } from "lucide-react";
function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d)) return "-";
  return d.toLocaleDateString("id-ID");
}

function formatTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d)) return "-";
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function CheckclockAdmin() {
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [submittingId, setSubmittingId] = useState(null);

  /* ===================== SIDE PANEL STATE ===================== */
  const [selectedRow, setSelectedRow] = useState(null);
  /* =========================================================== */

  /* =========================== LOAD LIST =========================== */
  async function load() {
    try {
      setLoading(true);
      const res = await http("/api/admin/checkclock?t=" + Date.now());
      const list = Array.isArray(res) ? res : res?.data ?? [];

      const safeList = list.map((item) => ({
        ...item,
        avatar:
          item.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            item.employeeName || "User"
          )}&background=random`,
        approval: item.approval || "PENDING",
      }));

      setRows(safeList);
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  /* =========================== FILTER =========================== */
  const filtered = rows.filter((r) =>
    r.employeeName?.toLowerCase().includes(search.toLowerCase())
  );

  /* =========================== STATUS =========================== */
  function resolveAttendanceStatus(row) {
    if (row.attendanceType === "CLOCK_IN") {
      return row.status || "-";
    }

    if (
      ["ANNUAL_LEAVE", "SICK_LEAVE", "ABSENT"].includes(row.attendanceType)
    ) {
      if (row.approval === "APPROVED") {
        return row.attendanceType
          .replace("_", " ")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
      if (row.approval === "REJECTED") return "Rejected";
      return "Pending";
    }

    return "-";
  }

  /* =========================== APPROVE =========================== */
  async function handleApprove(id, approved) {
    try {
      setSubmittingId(id);
      await http(`/api/admin/checkclock/${id}/approve`, {
        method: "PATCH",
        body: { approved },
      });

      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, approval: approved ? "APPROVED" : "REJECTED" }
            : r
        )
      );
    } finally {
      setSubmittingId(null);
    }
  }

  /* =========================== CLOCK OUT =========================== */
  async function handleClockOut(row) {
    try {
      setSubmittingId(row.id);

      await http("/api/admin/checkclock", {
        method: "POST",
        body: { employeeId: row.employeeId, type: "CLOCK_OUT" },
      });

      // ✅ INI YANG PENTING
      await load(); // fetch ulang data admin
    } catch (err) {
      console.error("Clock out error:", err);
    } finally {
      setSubmittingId(null);
    }
  }


  /* =========================== DETAIL =========================== */
  async function openDetail(row) {
    try {
      setLoadingDetail(true);

      const res = await http(`/api/admin/checkclock/${row.id}`);
      const detail = res?.data ?? res;

      console.log("DETAIL FIXED:", detail);

      setSelectedRow({
        id: row.id,
        employeeName: row.employeeName,
        avatar: row.avatar,
        jobdesk: row.jobdesk,

        attendanceType: detail.attendanceType,
        approval: detail.approval,
        status: detail.status,

        clockIn: detail.clockIn,
        clockOut: detail.clockOut,

        startDate: detail.startDate,
        endDate: detail.endDate,

        locationName: detail.locationName,
        address: detail.address,
        latitude: detail.latitude,
        longitude: detail.longitude,

        notes: detail.notes,
        proofUrl: detail.proofUrl,
        proofName: detail.proofName,

        workHours: detail.workHours,
      });
    } catch (err) {
      console.error(err);
      alert("Gagal memuat detail");
    } finally {
      setLoadingDetail(false);
    }
  }



  /* =========================== STYLE =========================== */
  function attendanceStatusStyle(status) {
    switch (status) {
      case "On Time":
        return "bg-green-100 text-green-800 border-green-300";
      case "Late":
        return "bg-red-100 text-red-800 border-red-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Rejected":
        return "bg-gray-200 text-gray-800 border-gray-400";
      default:
        return "bg-slate-100 text-black border-slate-300";
    }
  }

  function approvalStyle(approval) {
    return approval === "APPROVED"
      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
      : approval === "REJECTED"
        ? "bg-gray-200 text-gray-800 border-gray-400"
        : "bg-yellow-100 text-yellow-800 border-yellow-300";
  }

  return (
    <div className="min-h-screen bg-[#EEF3F7] px-6 py-6 text-black relative">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between mb-3">
          <h1 className="text-[26px] font-bold">Checkclock</h1>
          <Link
            to="/admin/checkclock/add"
            className="bg-[#E5484D] px-3 py-2 text-white rounded-xl"
          >
            + Tambah Data
          </Link>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow border p-4">
          <div className="flex mb-3">
            <div className="flex items-center border rounded-xl px-3 py-1 w-80">
              <Search size={17} />
              <input
                className="ml-2 w-full text-sm outline-none"
                placeholder="Search Employee"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th>Employee</th>
                <th>Jabatan</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Work Hours</th>
                <th>Approve</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                filtered.map((row) => {
                  const status = resolveAttendanceStatus(row);
                  return (
                    <tr key={row.id} className="border-b">
                      <td className="flex gap-2 py-3 items-center">
                        <img src={row.avatar} className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="font-medium">{row.employeeName}</div>
                        </div>
                      </td>
                      <td className="text-sm text-gray-700">
                        {row.jobdesk || "-"}
                      </td>
                      <td>{row.clockIn || "-"}</td>

                     <td>
  {row.canClockOut ? (
    <button
      onClick={() => handleClockOut(row)}
      className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full flex items-center gap-1"
    >
      <LogOut size={12} />
      Clock Out
    </button>
  ) : (
    row.clockOut || "-"
  )}
</td>


                      <td className="text-sm font-medium">
                        {row.workHours || "-"} {/* ✅ */}
                      </td>

                  <td>
  {row.createdByRole === "admin" ? (
    /* ================= ADMIN CREATED ================= */
    <span
      className={`px-3 py-1 text-xs rounded-full border ${approvalStyle(
        row.approval
      )}`}
    >
      {row.approval}
    </span>
  ) : row.approval === "PENDING" ? (
    /* ================= USER CREATED & PENDING ================= */
    <div className="flex gap-2">
      <button
        disabled={submittingId === row.id}
        onClick={() => handleApprove(row.id, true)}
        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1"
      >
        <Check size={12} />
        Approve
      </button>

      <button
        disabled={submittingId === row.id}
        onClick={() => handleApprove(row.id, false)}
        className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center gap-1"
      >
        <X size={12} />
        Reject
      </button>
    </div>
  ) : (
    /* ================= USER CREATED & FINAL ================= */
    <span
      className={`px-3 py-1 text-xs rounded-full border ${approvalStyle(
        row.approval
      )}`}
    >
      {row.approval}
    </span>
  )}
</td>

                      <td>
                        <span
                          className={`px-3 py-1 text-xs rounded-full border ${attendanceStatusStyle(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => openDetail(row)}
                          className="text-xs border px-3 py-1.5 rounded-lg"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== SIDE PANEL ===================== */}
      {/* ===================== SIDE PANEL ===================== */}
      {selectedRow && (
        <div className="fixed top-0 right-0 w-[380px] h-full bg-white shadow-lg border-l p-4 z-50 overflow-y-auto">
          <div className="flex justify-between mb-4">
            <h2 className="font-bold text-lg">Attendance Details</h2>
            <button onClick={() => setSelectedRow(null)}>
              <X />
            </button>
          </div>

          {/* ================= EMPLOYEE ================= */}
          <div className="flex gap-3 mb-4">
            <img src={selectedRow.avatar} className="w-12 h-12 rounded-full" />
            <div>
              <div className="font-semibold">{selectedRow.employeeName}</div>
              <div className="text-sm text-gray-500">
                {selectedRow.jobdesk || "-"}
              </div>
            </div>
          </div>

          {/* ================= ATTENDANCE ================= */}
          <div className="border rounded-xl p-3 mb-3">
            <div className="font-semibold mb-2">Attendance Information</div>

            {/* CLOCK IN / OUT */}
            {["CLOCK_IN", "CLOCK_OUT"].includes(selectedRow.attendanceType) && (
              <>
                <div className="text-sm">Date: {formatDate(selectedRow.clockIn)}</div>
                <div className="text-sm">Check In: {formatTime(selectedRow.clockIn)}</div>
                <div className="text-sm">Check Out: {formatTime(selectedRow.clockOut)}</div>
                <div className="text-sm">Work Hours: {selectedRow.workHours || "-"}</div>
              </>
            )}

            {/* ABSENT / LEAVE */}
            {["ABSENT", "ANNUAL_LEAVE", "SICK_LEAVE"].includes(
              selectedRow.attendanceType
            ) && (
                <>
                  <div className="text-sm">Start Date: {formatDate(selectedRow.startDate)}</div>
                  <div className="text-sm">End Date: {formatDate(selectedRow.endDate)}</div>
                </>
              )}

            <div className="text-sm mt-2">
              Status: {resolveAttendanceStatus(selectedRow)}
            </div>
          </div>

          {/* ================= LOCATION ================= */}
          <div className="border rounded-xl p-3 mb-3">
            <div className="font-semibold mb-2">Location Information</div>
            <div className="text-sm">Location: {selectedRow.locationName || "-"}</div>
            <div className="text-sm">Address: {selectedRow.address || "-"}</div>

            {selectedRow.latitude != null && selectedRow.longitude != null && (
              <div className="text-sm">
                Lat: {selectedRow.latitude} | Long: {selectedRow.longitude}
              </div>
            )}
          </div>

          {/* ================= NOTES ================= */}
          <div className="border rounded-xl p-3 mb-3">
            <div className="font-semibold mb-2">Notes</div>
            <div className="text-sm">
              {selectedRow?.notes?.trim()
                ? selectedRow.notes
                : "Tidak ada catatan"}
            </div>

          </div>

          {/* ================= PROOF ================= */}
          <div className="border rounded-xl p-3">
            <div className="font-semibold mb-2">Proof of Attendance</div>

            {selectedRow?.proofUrl ? (
              <a
                href={`${API_URL}${selectedRow.proofUrl}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline text-sm"
              >
                📎 {selectedRow.proofName || "Lihat file"}
              </a>
            ) : (
              <div className="text-sm text-gray-400">
                Tidak ada file terunggah
              </div>
            )}


          </div>
        </div>
      )}


    </div>
  );
}
