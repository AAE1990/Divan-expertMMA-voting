import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tournamentService } from "../services/tournament.service";
import { toast } from "sonner";

export const useCreateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => tournamentService.create(data),
    onSuccess: () => {
      toast.success("Турнир успешно создан!");
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Ошибка при создании турнира");
    },
  });
};
