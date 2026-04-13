import { useMutation, useQueryClient } from "@tanstack/react-query";
import { votingService } from "../services/voting.service";
import { toast } from "sonner";

export const useSubmitVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: votingService.submitVote,
    onSuccess: () => {
      toast.success("Ваш голос учтен!");
      // Принудительно обновляем список голосований в кэше React Query,
      // чтобы пользователь сразу увидел обновленные проценты/кол-во голосов
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
    onError: (error: any) => {
      // Выводим ошибку (например, "Вы уже голосовали" или "Голосование закрыто")
      toast.error(error.message || "Не удалось отправить голос");
    },
  });
};