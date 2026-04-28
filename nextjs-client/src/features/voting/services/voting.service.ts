import { api } from "@/shared/api/instance.api";
import { IPoll, IVoteInput } from "../types/voting.types";

// В интерфейсы или прямо в сервис добавь тип для создания
export interface ICreatePollInput {
  question: string;
  options: Array<{
    text: string;
    photoUrl?: string;
  }>; // Массив бойцов с именами и фото
  expiresAt: string; // Дата в формате ISO
  tournamentId: string;
}

export const votingService = {
  // Добавляем tournamentId как необязательный аргумент
  async getPolls(tournamentId?: string): Promise<IPoll[]> {
    // Если tournamentId есть, добавляем его в строку запроса
    const url = tournamentId ? `polls?tournamentId=${tournamentId}` : "polls";

    return await api.get<IPoll[]>(url);
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
  },

  // Метод для завершения боя (админский)
  async finishPoll(pollId: string, winnerOptionId: string): Promise<{ winnersCount: number }> {
    return await api.post(`polls/${pollId}/finish`, {
      winnerOptionId,
    });
  },
};