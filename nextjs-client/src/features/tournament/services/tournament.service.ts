import { api } from "@/shared/api/instance.api";

export interface ITournament {
  id: string;
  name: string;
  date: string;
  description?: string;
}

export interface ITournamentsResponse {
  tournaments: ITournament[];
  totalTournaments: number;
  page: number;
  limit: number;
}

export const tournamentService = {
  async create(data: any): Promise<ITournament> {
    return await api.post("tournaments", data);
  },

  async getAll(page?: number, limit?: number): Promise<ITournamentsResponse> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (limit !== undefined) params.append('limit', limit.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return await api.get<ITournamentsResponse>(`tournaments${query}`);
  },

  async getById(id: string): Promise<ITournament> {
    return await api.get<ITournament>(`tournaments/${id}`);
  }
};
