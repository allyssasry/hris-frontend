import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Clock, Upload } from "lucide-react";
import { useAuth } from "@/app/store/authStore";

/* ================= FIX LEAFLET ICON ================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ================= API URL ================= */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/* ================= CITY PRESET ================= */
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

export default function UserCheckclockPage() {
  const navigate = useNavigate();
const token = localStorage.getItem("token");

  const [nowTime, setNowTime] = useState(new Date());
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
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

  /* ================= CLOCK REALTIME ================= */
  useEffect(() => {
    const t = setInterval(() => setNowTime(new Date()), 1000);
    return () => clearInterval(t);
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
    () => [form.latitude, form.longitude],
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
      alert("Browser tidak mendukung geolocation");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          locationType: "OTHER",
          locationName: "Lokasi Saya",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      () => alert("Gagal mengambil lokasi")
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      let mappedType;
      if (form.type === "IN") mappedType = "CLOCK_IN";
      else if (form.type === "OUT") mappedType = "CLOCK_OUT";
      else mappedType = form.type;

      const fd = new FormData();
      fd.append("type", mappedType);
      fd.append("locationName", form.locationName);
      fd.append("address", form.address);
      fd.append("latitude", form.latitude);
      fd.append("longitude", form.longitude);
      fd.append("notes", form.notes || "");

      if (["ANNUAL_LEAVE", "SICK_LEAVE"].includes(form.type)) {
        fd.append("startDate", form.startDate);
        fd.append("endDate", form.endDate);
      }

      if (file) fd.append("proof", file);

      const res = await fetch(`${API_URL}/api/user/check-clocks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const out = await res.json();
      if (!res.ok) throw new Error(out.message);

      navigate("/checkclock");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  }

  const timeDisplay = nowTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const showDateRange = [ "ANNUAL_LEAVE", "SICK_LEAVE"].includes(
    form.type
  );

  return (
    <div className="min-h-screen bg-[#EEF3F7] px-6 py-6 text-black">
      <div className="max-w-7xl mx-auto text-black">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Absensi Saya
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow border p-6 text-black"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ================= LEFT ================= */}
            <div className="space-y-4 text-black">

              <div>
                <label className="text-sm font-medium text-black">
                  Tipe Absensi
                </label>
                <select
                  className="w-full rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                  value={form.type}
                  onChange={(e) =>
                    handleChange("type", e.target.value)
                  }
                >
                  <option value="IN">Clock In</option>
                  <option value="OUT">Clock Out</option>
                  <option value="ABSENT">Absent</option>
                  <option value="ANNUAL_LEAVE">Annual Leave</option>
                  <option value="SICK_LEAVE">Sick Leave</option>
                </select>
              </div>

              {showDateRange && (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    className="rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                    value={form.startDate}
                    onChange={(e) =>
                      handleChange("startDate", e.target.value)
                    }
                  />
                  <input
                    type="date"
                    className="rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                    value={form.endDate}
                    onChange={(e) =>
                      handleChange("endDate", e.target.value)
                    }
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-black">
                  Waktu
                </label>
                <div className="flex items-center border rounded-xl px-3 py-2 bg-[#F9FBFF] text-black">
                  <Clock size={16} />
                  <input
                    readOnly
                    value={timeDisplay}
                    className="bg-transparent w-full ml-2 text-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-black">
                  Upload Bukti
                </label>
                <div className="border border-dashed rounded-2xl p-6 text-center bg-[#F9FBFF] text-black">
                  <Upload className="mx-auto mb-2" />
                  <label className="cursor-pointer border px-3 py-1 rounded-lg bg-white text-black">
                    Browse
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        setFile(e.target.files?.[0])
                      }
                    />
                  </label>
                  {file && (
                    <p className="mt-2 text-sm text-black">
                      {file.name}
                    </p>
                  )}
                </div>
              </div>

              <textarea
                rows={4}
                placeholder="Catatan"
                className="w-full rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                value={form.notes}
                onChange={(e) =>
                  handleChange("notes", e.target.value)
                }
              />
            </div>

            {/* ================= RIGHT ================= */}
            <div className="space-y-4 text-black">

              <select
                className="w-full rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                value={form.locationType}
                onChange={(e) =>
                  handleLocationTypeChange(e.target.value)
                }
              >
                <option value="JAKARTA">Jakarta</option>
                <option value="BANDUNG">Bandung</option>
                <option value="MALANG">Malang</option>
                <option value="OTHER">Lainnya</option>
              </select>

              <button
                type="button"
                onClick={handleMyLocation}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full"
              >
                My Location
              </button>

              <div className="h-[260px] rounded-2xl overflow-hidden border">
                <MapContainer center={center} zoom={14} style={{ height: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={center} />
                  <MapClickHandler onChange={handleMapChange} />
                </MapContainer>
              </div>

              <input
                className="w-full rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                placeholder="Alamat"
                value={form.address}
                onChange={(e) =>
                  handleChange("address", e.target.value)
                }
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  className="rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                  value={form.latitude}
                  onChange={(e) =>
                    handleChange("latitude", e.target.value)
                  }
                />
                <input
                  className="rounded-xl border px-3 py-2 bg-[#F9FBFF] text-black"
                  value={form.longitude}
                  onChange={(e) =>
                    handleChange("longitude", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-200 p-3 rounded-xl text-black">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white"
            >
              {submitting ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
