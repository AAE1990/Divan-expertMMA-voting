import { useQuery } from "@tanstack/react-query";
import { tournamentService } from "../services/tournament.service";

export const useGetTournaments = (page?: number, limit?: number, search?: string) => {
  return useQuery({
    queryKey: ["tournaments", page, limit, search],
    queryFn: () => tournamentService.getAll(page, limit, search),
  });
};
