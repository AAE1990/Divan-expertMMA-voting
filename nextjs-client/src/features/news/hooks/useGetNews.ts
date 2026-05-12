import { useQuery } from "@tanstack/react-query";
import { newsService } from "../services/news.service";

export const useGetNews = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: ["news", "list", page, limit],
    queryFn: () => newsService.getAll(page, limit),
  });
};