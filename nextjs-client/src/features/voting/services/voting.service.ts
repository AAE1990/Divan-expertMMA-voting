import { api } from "@/shared/api/instance.api";
import { IPoll, IVoteInput } from "../types/voting.types";

// В интерфейсы или прямо в сервис добавь тип для создания
export interface ICreatePollInput {
  question: string;
  options: string[]; // Массив имен бойцов
  expiresAt: string; // Дата в формате ISO
}

export const votingService = {
  // Твой метод get<T> подхватит IPoll[]
  async getPolls(): Promise<IPoll[]> {
    return await api.get<IPoll[]>("polls");
  },

  // Для POST запроса обычно используется api.post(endpoint, options)
  async submitVote(data: IVoteInput): Promise<{ success: boolean }> {
    // Просто передаем data, FetchClient сам превратит её в строку
    return await api.post("polls/vote", data);
  },

  async getPollById(id: string): Promise<IPoll> {
    return await api.get<IPoll>(`polls/${id}`);
  },

  async createPoll(data: ICreatePollInput): Promise<IPoll> {
    return await api.post("polls/create", data);
  }
};