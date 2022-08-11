import { baseUrl } from "./baseUrl";

// declare an interface for brands
export interface Brand {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// declare an interface for models
export interface Model {
  id: number;
  name: string;
  type: string;
  brandId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Machine {
  id?: number;
  brandId?: number;
  modelId?: number;
  status: string;
  serial: string;
  brandName?: string;
  modelName?: string;
  type?: string;
}

export interface ModelInput {
  brandId: number;
  name: string;
  type: string;
}

export const getBrands = async (): Promise<Brand[]> => {
  const res = await baseUrl.get("/brands");
  return res.data;
};

export const getModels = async (brandId: number | undefined): Promise<Model[]> => {
  const res = await baseUrl.get(`/models/${brandId}`);
  return res.data;
}

export const addBrand = async (name: string): Promise<Brand> => {
  const res = await baseUrl.post("/brands", { name });
  return res.data;
}

export const addModel = async (data: ModelInput): Promise<Model> => {
  const res = await baseUrl.post(`/models/${data.brandId}`, data);
  return res.data;
}

export const addMachine = async (data: Machine): Promise<Machine> => {
  const res = await baseUrl.post("/machines", data);
  return res.data;
}

export const deleteBrand = async (brandId: string): Promise<Brand> => {
  const res = await baseUrl.delete(`/brands/${brandId}`);
  return res.data;
}