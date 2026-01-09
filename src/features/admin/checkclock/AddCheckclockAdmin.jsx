import React, { useEffect, useMemo, useState } from "react";
import { http } from "@/lib/http";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useAuth } from "@/app/store/authStore";
import L from "leaflet";
import { Upload, Clock } from "lucide-react";

/* ========= FIX LEAFLET ICON ========= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ========= API BASE URL ========= */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const CITY_PRESETS = {
  JAKARTA: {
    label: "Jakarta",
    center: [-6.1753924, 106.8271528],
    address: "Jakarta, Indonesia",
  },
  BANDUNG: {
    label: "Bandung",
    center: [-6.9174639, 107.6191228],
    address: "Bandung, Indonesia",
  },
  MALANG: {
    label: "Malang",
    center: [-7.9666204, 112.6326321],
    address: "Malang, Indonesia",
  },
};

function MapClickHandler({ onChange }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng);
    },
  });
  return null;
}

export default function AddCheckclockAdmin() {
  const navigate = useNavigate();
  const token = useAuth((s) => s.token);

  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nowTime, setNowTime] = useState(new Date());
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    employeeId: "",
    type: "IN",

    locationType: "JAKARTA",
    locationName: "Jakarta",
    address: CITY_PRESETS.JAKARTA.address,
    latitude: CITY_PRESETS.JAKARTA.center[0],
    longitude: CITY_PRESETS.JAKARTA.center[1],

    notes: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const id = setInterval(() => setNowTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    async function loadEmployees() {
      try {
        setLoadingEmployees(true);
        const res = await http("/api/employees?limit=100");
        setEmployees(res?.data ?? []);
      } catch (e) {
        console.error("Error load employees:", e);
      } finally {
        setLoadingEmployees(false);
      }
    }
    loadEmployees();
  }, []);
useEffect(() => {
  if (!["ANNUAL_LEAVE", "SICK_LEAVE"].includes(form.type)) {
    setForm((f) => ({
      ...f,
      startDate: "",
      endDate: "",
    }));
  }
}, [form.type]);

  const center = useMemo(
    () => [form.latitude || 0, form.longitude || 0],
    [form.latitude, form.longitude]
  );

  function handleChange(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleLocationTypeChange(val) {
    if (val === "OTHER") {
      setForm((f) => ({
        ...f,
        locationType: "OTHER",
        locationName: "Lainnya",
        address: "",
      }));
      return;
    }

    const preset = CITY_PRESETS[val];
    setForm((f) => ({
      ...f,
      locationType: val,
      locationName: preset.label,
      address: preset.address,
      latitude: preset.center[0],
      longitude: preset.center[1],
    }));
  }

  function handleMapChange(latlng) {
    setForm((f) => ({
      ...f,
      latitude: latlng.lat,
      longitude: latlng.lng,
    }));
  }

  function handleMyLocation() {
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung geolocation.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((f) => ({
          ...f,
          locationType: "OTHER",
          locationName: "Lainnya",
          latitude,
          longitude,
        }));
      },
      () => alert("Gagal mengambil lokasi.")
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.employeeId) {
      setError("Employee is required.");
      return;
    }

    try {
      setSubmitting(true);

     let mappedType;

if (form.type === "IN") {
  mappedType = "CLOCK_IN";
} else if (form.type === "OUT") {
  mappedType = "CLOCK_OUT";
} else if (["ABSENT", "ANNUAL_LEAVE", "SICK_LEAVE"].includes(form.type)) {
  mappedType = form.type;
} else {
  throw new Error("Invalid attendance type");
}


      const fd = new FormData();
      fd.append("employeeId", form.employeeId);
      fd.append("type", mappedType);
      fd.append("locationName", form.locationName);
      fd.append("address", form.address || "");
      fd.append("latitude", String(form.latitude));
      fd.append("longitude", String(form.longitude));
      fd.append("notes", form.notes?.trim() || "");
      fd.append("time", nowTime.toISOString());

      if (["ANNUAL_LEAVE", "SICK_LEAVE"].includes(form.type)) {
        fd.append("startDate", form.startDate);
        fd.append("endDate", form.endDate);
      }

      if (file) fd.append("proof", file);

      const res = await fetch(`${API_URL}/api/admin/checkclock`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const out = await res.json();
      if (!res.ok) throw new Error(out.message);

      navigate("/admin/checkclock");
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setSubmitting(false);
    }
  }

  const timeDisplay = nowTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const showDateRange = ["ANNUAL_LEAVE", "SICK_LEAVE"].includes(form.type);

  return (
    <div className="min-h-screen bg-[#EEF3F7] px-6 py-6 text-black">
      <div className="max-w-7xl mx-auto text-black">
        <h1 className="text-[26px] font-bold mb-4 text-black">
          Add Checkclock Admin
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow border p-6 text-black"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ================= LEFT ================= */}
            <div className="space-y-4 text-black">

              {/* EMPLOYEE */}
              <div>
                <label className="text-sm font-medium text-black">Karyawan</label>
                <select
                  className="w-full rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                  value={form.employeeId}
                  onChange={(e) => handleChange("employeeId", e.target.value)}
                >
                  <option value="">
                    {loadingEmployees ? "Memuat..." : "Pilih Karyawan"}
                  </option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* TYPE */}
              <div>
                <label className="text-sm font-medium text-black">Tipe Absensi</label>
                <select
                  className="w-full rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                  value={form.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                >
                  <option value="IN">Clock In</option>
                  <option value="OUT">Clock Out</option>
                  <option value="ABSENT">Absent</option>
                  <option value="ANNUAL_LEAVE">Annual Leave</option>
                  <option value="SICK_LEAVE">Sick Leave</option>
                </select>
              </div>

              {/* DATE RANGE */}
              {showDateRange && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-black">Start Date</label>
                    <input
                      type="date"
                      className="w-full rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                      value={form.startDate}
                      onChange={(e) => handleChange("startDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black">End Date</label>
                    <input
                      type="date"
                      className="w-full rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                      value={form.endDate}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* CLOCK */}
              <div>
                <label className="text-sm font-medium text-black">Waktu Absensi</label>
                <div className="flex items-center border rounded-xl px-3 py-2 bg-[#F9FBFF] text-black">
                  <Clock size={16} />
                  <input
                    readOnly
                    value={timeDisplay}
                    className="bg-transparent w-full ml-2 text-black"
                  />
                </div>
              </div>

              {/* UPLOAD */}
              <div>
                <label className="text-sm font-medium text-black">Upload Bukti Pendukung</label>
                <div className="border border-dashed rounded-2xl p-6 text-center bg-[#F9FBFF] text-black">
                  <Upload className="mx-auto mb-2" />
                  <label className="cursor-pointer border px-3 py-1 bg-white rounded-lg text-black">
                    Browse
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0])}
                    />
                  </label>
                  {file && <p className="mt-2 text-sm text-black">{file.name}</p>}
                </div>
              </div>

              {/* NOTES */}
              <div>
                <label className="text-sm font-medium text-black">Notes</label>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                />
              </div>
            </div>

            {/* ================= RIGHT ================= */}
            <div className="space-y-4 text-black">

              {/* LOCATION */}
              <div>
                <label className="text-sm font-medium text-black">Lokasi</label>
                <select
                  className="w-full rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                  value={form.locationType}
                  onChange={(e) => handleLocationTypeChange(e.target.value)}
                >
                  <option value="JAKARTA">Jakarta</option>
                  <option value="BANDUNG">Bandung</option>
                  <option value="MALANG">Malang</option>
                  <option value="OTHER">Lainnya</option>
                </select>
              </div>

              {/* MAP */}
              <div>
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-black">Peta Lokasi</label>
                  <button
                    type="button"
                    onClick={handleMyLocation}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full"
                  >
                    My Location
                  </button>
                </div>

                <div className="rounded-2xl overflow-hidden border h-[260px]">
                  <MapContainer
                    key={`${center[0]}-${center[1]}`}
                    center={center}
                    zoom={14}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={center} />
                    <MapClickHandler onChange={handleMapChange} />
                  </MapContainer>
                </div>
              </div>

              {/* ADDRESS */}
              <div>
                <label className="text-sm font-medium text-black">Detail Alamat</label>
                <input
                  type="text"
                  className="w-full rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>

              {/* LAT LNG */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-black">Latitude</label>
                  <input
                    className="w-full rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                    value={form.latitude}
                    onChange={(e) => handleChange("latitude", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-black">Longitude</label>
                  <input
                    className="w-full rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                    value={form.longitude}
                    onChange={(e) => handleChange("longitude", e.target.value)}
                  />
                </div>
              </div>

            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-200 border border-red-300 rounded-xl p-3 text-black">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-xl border bg-white text-black"
              onClick={() => navigate("/admin/checkclock")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-blue-600 text-white"
            >
              {submitting ? "Saving..." : "Upload Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
