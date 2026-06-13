import { api } from "@/shared/api/instance.api";
import { TCreateNewsSchema } from "../schemes/news.schema";

export interface INews {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  titleRu: string;
  titleEn: string;
  contentRu: string;
  contentEn: string;
}

export interface INewsListResponse {
  news: INews[];
  totalNews: number;
  page: number;
  limit: number;
}

export const newsService = {
  async create(data: TCreateNewsSchema): Promise<INews> {
    return await api.post("news", data);
  },

  async getAll(page?: number, limit?: number): Promise<INewsListResponse> {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    return await api.get(`news${query}`);
  },

  async getLatest(): Promise<INews | null> {
    return await api.get("news/latest");
  },

  async getById(id: string): Promise<INews> {
    return await api.get(`news/${id}`);
  },

  async update(id: string, data: Partial<TCreateNewsSchema>): Promise<INews> {
    return await api.put(`news/${id}`, data);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await api.delete(`news/${id}`);
  },
};