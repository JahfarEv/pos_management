
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  [key: string]: any;
}

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = ApiClient.token;
        if (token) {
          config.headers = config.headers || {};
          (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );
  }

  // --- NEW STATIC TOKEN STORAGE ---
  private static token: string | null = null;

  // --- NEW TOKEN SETTER ---
  static setAuthToken(token: string | null) {
    ApiClient.token = token;

    if (token) {
      apiClient.axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete apiClient.axiosInstance.defaults.headers.common["Authorization"];
    }
  }

  async request<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.request<ApiResponse<T>>({
      url: endpoint,
      ...options,
    });
    return response.data;
  }

  get<T>(endpoint: string, params?: any) {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  post<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, { method: "POST", data: body });
  }

  put<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, { method: "PUT", data: body });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

const apiClient = new ApiClient();

// --- EXPORT IT HERE ---

export default apiClient;
export { ApiClient };               
export const setAuthToken = ApiClient.setAuthToken; 
