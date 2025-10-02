import API from "@/utils/api";
import type { IComponent, ComponentPayload } from "@/types/component.types";

// Fetches all components from the library
export const fetchAllComponents = async (): Promise<IComponent[]> => {
  const response = await API.get("/components");
  return response.data;
};

// Creates a new component
export const createComponent = async (
  componentData: ComponentPayload
): Promise<IComponent> => {
  const response = await API.post("/components", componentData);
  return response.data;
};

// Updates an existing component
export const updateComponent = async (
  id: string,
  componentData: ComponentPayload
): Promise<IComponent> => {
  const response = await API.put(`/components/${id}`, componentData);
  return response.data;
};

// Deletes a component by its ID
export const deleteComponent = async (
  id: string
): Promise<{ message: string }> => {
  const response = await API.delete(`/components/${id}`);
  return response.data;
};
