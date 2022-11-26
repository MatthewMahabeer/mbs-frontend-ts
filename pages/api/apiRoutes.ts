import { baseUrl, baseUrlAuth } from "./baseUrl";
import axios from "axios";

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

export interface JwtPayload {
  [key: string]: any;
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
}

export interface ModelInput {
  brandId: number;
  name: string;
  type: string;
}

export enum ROLES {
  ADMIN,
  USER,
  SUDO
}
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  authenticated: boolean;
  role: ROLES;
  createdAt: Date;
  updatedAt: Date;
  hasUpdatedPassword: boolean;

}
export type TokenValidationResponse = {
  isValid?: JwtPayload | string;
  user?: User
  error?: {
    name: string;
    message: string;
  }
} 

interface TokenResponseError { 
      name: string;
      message: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  isPasswordMatch: boolean;
  user: User | null;
  token?: string;
  error: string | null;
}

export interface updatePasswordInput {
  email: string;
  oneTimePassword: string;
  newPassword: string;
  token: string;
}

export interface updatePasswordOutput {
  passwordMatch: boolean;
  error?: string;
  token?: string;
}
const baseURL = "http://localhost:3001"

export const updatePassword = async ({email, oneTimePassword, newPassword, token}: updatePasswordInput): Promise<updatePasswordOutput> => {
  const updatedResponse = await axios.post(`${baseURL}/update-password`, {email, oneTimePassword, newPassword}, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  return updatedResponse.data;
}

export const getBrands = async (token: string): Promise<Brand[]> => {
  const brands = await axios.get(`${baseURL}/brands`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })
  return brands.data;
};

export const getModels = async (brandId: number | undefined, token: string): Promise<Model[]> => {
  const res = await axios.get(`${baseURL}/models/${brandId}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
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

// Auth Handlers

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await baseUrl.post("/login", { email, password });
  return res.data;
}

export const register = async (email: string, password: string): Promise<any> => {
  const res = await baseUrl.post("/auth/register", { email, password });
  return res.data;
}

export const validateToken = async (token: string): Promise<any> => {
  const res = await baseUrlAuth.post("/validate-token", { token: token });
  console.log(res.data);
  return res.data;
}

export function isJsonWebTokenError(e: unknown): e is TokenResponseError {
  return (
    typeof e === "object" && e !== null && "name" in e && "message" in e
  )
}

