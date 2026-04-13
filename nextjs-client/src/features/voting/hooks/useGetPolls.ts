import { useQuery } from "@tanstack/react-query";
import { votingService } from "../services/voting.service";

export const useGetPolls = () => {
  return useQuery({
    queryKey: ["polls"], // Ключ для кэширования
    queryFn: () => votingService.getPolls(),
    // В будущем, пока не настроим WebSocket, можно раскомментировать строку ниже,
    // чтобы данные обновлялись сами каждые 10 секунд:
    refetchInterval: 10000, 
  });
};