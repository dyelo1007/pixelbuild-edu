import API from "@/utils/api";
import type { IPart, PartPayload } from "@/types/component.types";

// ✅ Fetch all parts (renamed but keeps same function name for compatibility)
export const fetchAllComponents = async (): Promise<IPart[]> => {
  const response = await API.get("/components");
  return response.data;
};

// ✅ Create a new part
export const createComponent = async (partData: PartPayload): Promise<IPart> => {
  const response = await API.post("/components", partData);
  return response.data;
};

// ✅ Update existing part
export const updateComponent = async (
  id: string,
  partData: PartPayload
): Promise<IPart> => {
  const response = await API.put(`/components/${id}`, partData);
  return response.data;
};

// ✅ Delete part
export const deleteComponent = async (id: string): Promise<{ message: string }> => {
  const response = await API.delete(`/components/${id}`);
  return response.data;
};
