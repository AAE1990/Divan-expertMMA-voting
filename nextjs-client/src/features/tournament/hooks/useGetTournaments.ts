import { useQuery } from "@tanstack/react-query";
import { tournamentService } from "../services/tournament.service";

export const useGetTournaments = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: ["tournaments", page, limit],
    queryFn: () => tournamentService.getAll(page, limit),
  });
};
