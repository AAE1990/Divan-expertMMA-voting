import { useMutation, useQueryClient } from "@tanstack/react-query";
import { votingService, ICreatePollInput } from "../services/voting.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useCreatePoll = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ICreatePollInput) => votingService.createPoll(data),
    onSuccess: () => {
      toast.success("Новое голосование создано!");
      // Обновляем список, чтобы сразу увидеть новый бой
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      // Можно редиректнуть на страницу голосований
      router.push("/voting");
    },
    onError: (error: any) => {
      toast.error(error.message || "Ошибка при создании голосования");
    },
  });
};
