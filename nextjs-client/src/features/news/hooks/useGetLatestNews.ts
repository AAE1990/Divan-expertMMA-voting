import { useQuery } from "@tanstack/react-query";
import { newsService } from "../services/news.service";

export const useGetLatestNews = () => {
  return useQuery({
    queryKey: ["news", "latest"],
    queryFn: () => newsService.getLatest(),
  });
};