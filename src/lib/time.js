export function combineDateTimeToISO(dateStr, timeStr, tzOffsetMinutes = 420 /*WIB*/) {
  // dateStr: "2025-11-04", timeStr: "09:00"
  if (!dateStr || !timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date(dateStr);
  d.setHours(h, m, 0, 0);
  // apply offset manual → ISO dengan offset +07:00
  const localMs = d.getTime() - (d.getTimezoneOffset() - tzOffsetMinutes) * 60000;
  return new Date(localMs).toISOString();
}
