import { api } from "@/shared/api/instance.api";

export interface ITournament {
  id: string;
  name: string;
  date: string;
  description?: string;
}

export const tournamentService = {
  async create(data: any): Promise<ITournament> {
    return await api.post("tournaments", data);
  },

  async getAll(): Promise<ITournament[]> {
    return await api.get<ITournament[]>("tournaments");
  },

  async getById(id: string): Promise<ITournament> {
    return await api.get<ITournament>(`tournaments/${id}`);
  }
};
