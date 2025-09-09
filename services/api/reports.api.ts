import api from "../config/api.config";
import { API_ENDPOINTS } from "../../constant/api.constant";

export type CreateReportPayload = {
  productId: string;
  comment?: string;
};

export type Report = {
  _id: string;
  product: string;
  comment?: string;
  status: "pending" | "resolved" | "rejected";
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateReportResponse = {
  message: string;
  success: boolean;
  data: Report;
};

export const reportsApi = {
  create: async (payload: CreateReportPayload): Promise<CreateReportResponse> => {
    const response = await api.post(API_ENDPOINTS.REPORTS.CREATE, payload);
    return response as unknown as CreateReportResponse;
  },
};

export default reportsApi;


