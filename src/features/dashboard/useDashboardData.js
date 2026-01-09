import { useEffect, useState } from "react";
import { http } from "@/lib/http";

export function useDashboardData(month, viewMode) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    if (!month) return;

    setLoading(true);
    setError(null);

    try {
      const qs = `?month=${month}&view=${viewMode}`;

      const [attendance, workHours, leave] = await Promise.all([
        http(`/api/user/check-clocks/summary${qs}`),
        http(`/api/user/work-hours${qs}`),
        http(`/api/user/leave/summary${qs}`),
      ]);

      setData({
        cards: {
          workHoursMinutes: workHours.totalMinutes,
          onTime: attendance.onTime,
          late: attendance.late,
          notAttend: attendance.absent,
        },
        donut: {
          ontime: attendance.onTime,
          late: attendance.late,
          absent: attendance.absent,
          annualLeave: leave.annualLeave,
          sickLeave: leave.sickLeave,
        },
        leave,
        workHours: {
          series: workHours.series,
          totalMinutes: workHours.totalMinutes,
        },
      });
    } catch (err) {
      setError(err?.data?.message || err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [month, viewMode]);

  return { data, loading, error, reload: load };
}
