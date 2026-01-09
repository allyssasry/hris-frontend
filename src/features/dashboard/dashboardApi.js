import { http } from "@/lib/http";

export async function fetchDashboard(month) {
  return http(`/api/dashboard/me?month=${month}`);
}
