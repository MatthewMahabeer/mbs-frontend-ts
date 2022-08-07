import { baseUrl } from "./baseUrl";

// declare an interface for brands
interface Brand {
  id: number;
  name: string;
}

// declare an interface for models
interface Model {
  id: number;
  name: string;
  brandId: number;
}

export const getBrands = async (): Promise<Brand[]> => {
  const res = await baseUrl.get("/api/brands");
  return res.data;
};

export const getModels = async (brandId: string): Promise<Model[]> => {
  const res = await baseUrl.get(`/api/models/${brandId}`);
  return res.data;
}

export const addBrand = async (name: string): Promise<Brand> => {
  const res = await baseUrl.post("/api/brands", { name });
  return res.data;
}

export const addModel = async (brandId: string, name: string): Promise<Model> => {
  const res = await baseUrl.post(`/api/models/${brandId}`, { name });
  return res.data;
}

export const deleteBrand = async (brandId: string): Promise<Brand> => {
  const res = await baseUrl.delete(`/api/brands/${brandId}`);
  return res.data;
}