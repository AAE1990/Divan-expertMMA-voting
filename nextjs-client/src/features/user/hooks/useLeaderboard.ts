import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user.services";

export const useLeaderboard = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: ["leaderboard", page, limit],
    queryFn: () => userService.getLeaderboard(page, limit),
  });
};