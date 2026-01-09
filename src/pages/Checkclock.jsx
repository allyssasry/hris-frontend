import React from "react";
import CheckclockPage from "@/features/checkclock/CheckclockPage";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

export default function Checkclock() {
  const { data, reload } = useDashboardData(); // biar available kalau mau tampil ringkasan kecil
  return (
    <>
      {/* optional mini ringkasan */}
      {data && (
        <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6 mb-2 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card title="Work Hours" value={`${Math.floor(data.cards.workHoursMinutes/60)}h`} />
          <Card title="On Time" value={data.cards.onTime} />
          <Card title="Late" value={data.cards.late} />
          <Card title="Not Attend" value={data.cards.notAttend} />
        </div>
      )}
      <CheckclockPage onSaved={reload} />
    </>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
