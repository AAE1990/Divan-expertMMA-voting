import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tournamentService } from "../services/tournament.service";
import { useTranslations } from "next-intl"
import { toast } from "sonner";
import { toastMessageHandler } from "@/shared/utils";

export const useCreateTournament = () => {
  const t = useTranslations('Toasts')
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => {
      // Если дата окончания голосования заполнена
      if (data.expiresAt) {
        const localDate = new Date(data.expiresAt); // Считываем время из инпута (Екатеринбург)

        // Вычитаем 5 часов часового пояса, чтобы получить чистый UTC (Гринвич)
        localDate.setHours(localDate.getHours() - 5);

        // Перезаписываем в объект отправки ISO-строку с буквой Z на конце
        data.expiresAt = localDate.toISOString();
      }

      return tournamentService.create(data);
    },
    onSuccess: () => {
      toast.success(t('tournamentCreatedSuccess'));
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
    onError: (error: any) => {
      toastMessageHandler(error, t);
    },
  });
};
