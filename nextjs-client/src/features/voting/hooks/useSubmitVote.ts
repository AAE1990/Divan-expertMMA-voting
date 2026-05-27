import { useMutation, useQueryClient } from "@tanstack/react-query";
import { votingService } from "../services/voting.service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const useSubmitVote = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('Voting');

  return useMutation({
    mutationFn: votingService.submitVote,
    onSuccess: () => {
      toast.success(t('voteCounted'));
      // Принудительно обновляем список голосований в кэше React Query,
      // чтобы пользователь сразу увидел обновленные проценты/кол-во голосов
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      // Также инвалидируем опросы "Народный чемпион"
      queryClient.invalidateQueries({ queryKey: ["people-champ-polls"] });
      // Инвалидируем профиль для обновления счета (если опрос завершился)
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      // Выводим ошибку (например, "Вы уже голосовали" или "Голосование закрыто")
      toast.error(error.message || t('voteFailed'));
    },
  });
};