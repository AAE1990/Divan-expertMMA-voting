import { useQuery } from "@tanstack/react-query";
import { votingService } from "../services/voting.service";

export const useGetPolls = (tournamentId?: string) => {
  return useQuery({
    queryKey: ["polls", tournamentId], // Добавляем ID в ключ, чтобы кэш обновлялся при смене турнира
    queryFn: () => votingService.getPolls(tournamentId),
  });
};
