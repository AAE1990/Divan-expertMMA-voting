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
        // Создаем объект даты. Браузер сам поймет локальный пояс компьютера (UTC+5)
        const localDate = new Date(data.expiresAt);

        // Просто переводим в ISO. Метод .toISOString() сам автоматически 
        // вычтет нужные 5 часов часового пояса и добавит букву Z!
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
