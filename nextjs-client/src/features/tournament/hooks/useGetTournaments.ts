import { useQuery } from "@tanstack/react-query";
import { tournamentService } from "../services/tournament.service";

export const useGetTournaments = () => {
  return useQuery({
    queryKey: ["tournaments"],
    queryFn: () => tournamentService.getAll(),
  });
};
