import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user.services";

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => userService.getLeaderboard(), // Не забудь добавить этот метод в свой userService на фронте
  });
};