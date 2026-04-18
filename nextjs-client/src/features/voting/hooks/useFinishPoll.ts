import { useMutation, useQueryClient } from "@tanstack/react-query";
import { votingService } from "../services/voting.service";
import { toast } from "sonner";

export const useFinishPoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Мы передаем объект с ID опроса и ID победителя
    mutationFn: ({ pollId, winnerOptionId }: { pollId: string; winnerOptionId: string }) => 
      votingService.finishPoll(pollId, winnerOptionId),
      
    onSuccess: (data) => {
      toast.success(`Бой завершен! Баллы начислены ${data.winnersCount} пользователям.`);
      // Обновляем список голосований, чтобы статус сменился на FINISHED
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      // Также инвалидируем профиль, чтобы админ (если он голосовал) сразу увидел свой новый score
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Не удалось завершить бой");
    },
  });
};
