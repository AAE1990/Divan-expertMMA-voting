import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newsService } from "../services/news.service";
import { TCreateNewsSchema } from "../schemes/news.schema";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: TCreateNewsSchema) => newsService.create(data),
    onSuccess: () => {
      toast.success("Новость успешно создана!");
      queryClient.invalidateQueries({ queryKey: ["news"] });
      router.push("/admin/news");
    },
    onError: (error: any) => {
      toast.error(error.message || "Ошибка при создании новости");
    },
  });
};