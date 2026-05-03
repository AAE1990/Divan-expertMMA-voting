import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user.services";

export const useLeaderboard = (page?: number, limit?: number, period?: 'all' | 'month' | 'week') => {
  return useQuery({
    queryKey: ["leaderboard", page, limit, period],
    queryFn: () => userService.getLeaderboard(page, limit, period),
  });
};