// src/services/employeeService.js
import { http } from "@/lib/http";

export const getEmployeeById = (id) =>
  http(`/api/employees/${id}`);

export const updateEmployee = (id, formData) =>
  http(`/api/employees/${id}`, {
    method: "PUT",
    body: formData,
    isForm: true,
  });
