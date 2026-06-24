import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newsService } from "../services/news.service";
import { TCreateNewsSchema } from "../schemes/news.schema";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { toastMessageHandler } from "@/shared/utils";

export const useCreateNews = () => {
  const t = useTranslations('Toasts');
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: TCreateNewsSchema) => newsService.create(data),
    onSuccess: () => {
      toast.success(t('newsPublishedSuccess'));
      queryClient.invalidateQueries({ queryKey: ["news"] });
      router.push('/news');
    },
    onError: (error: any) => {
      toastMessageHandler(error, t);
    },
  });
};