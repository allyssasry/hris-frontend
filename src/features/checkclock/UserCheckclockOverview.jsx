import React, { useEffect, useState } from "react";
import { http } from "@/lib/http";
import { LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function formatDate(v) {
  if (!v) return "-";
  return new Date(v).toLocaleDateString("id-ID");
}

function formatTime(v) {
  if (!v) return "-";
  return new Date(v).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function resolveStatus(approval) {
  if (approval === "APPROVED") return "Approved";
  if (approval === "REJECTED") return "Rejected";
  return "Waiting Approval";
}

function statusStyle(status) {
  if (status === "Approved")
    return "bg-green-100 text-green-800 border-green-300";
  if (status === "Rejected")
    return "bg-gray-200 text-gray-800 border-gray-400";
  return "bg-yellow-100 text-yellow-800 border-yellow-300";
}

export default function UserCheckclockOverview() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  async function load() {
    setLoading(true);
    const res = await http("/api/user/check-clocks/me");
    setRows(Array.isArray(res) ? res : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleClockOut(row) {
    try {
      setSubmittingId(row.id);
      await http("/api/user/check-clocks", {
        method: "POST",
        body: { type: "CLOCK_OUT" },
      });
      await load();
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#EEF3F7] px-6 py-6 text-black">
      <div className="max-w-6xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            Checkclock Overview
          </h1>

          <button
            onClick={() => navigate("/checkclock/new")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            <Plus size={16} />
            Tambah Absensi
          </button>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-2xl shadow border p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Work Hours</th>
                <th>Type</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                rows.map((row) => {
                  const status = resolveStatus(row.approval);
                  const isClockIn =
                    row.type === "CLOCK_IN" && !row.clockOut;

                  return (
                    <tr key={row.id} className="border-b">
                      <td className="py-3">
                        {formatDate(row.date)}
                      </td>

                      <td>{formatTime(row.clockIn)}</td>

                      <td>
                        {isClockIn ? (
                          <button
                            disabled={submittingId === row.id}
                            onClick={() => handleClockOut(row)}
                            className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full flex items-center gap-1"
                          >
                            <LogOut size={12} />
                            Clock Out
                          </button>
                        ) : (
                          formatTime(row.clockOut)
                        )}
                      </td>

                      <td>
                        {row.workHours || "-"}
                      </td>
<td className="text-xs font-semibold">
  {row.type.replace("_", " ")}
</td>


                      <td>
                        <span
                          className={`px-3 py-1 text-xs rounded-full border ${statusStyle(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td></td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
