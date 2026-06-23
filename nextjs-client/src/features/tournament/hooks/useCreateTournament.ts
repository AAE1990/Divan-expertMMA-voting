import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tournamentService } from "../services/tournament.service";
import { useTranslations } from "next-intl"
import { toast } from "sonner";
import { toastMessageHandler } from "@/shared/utils";

export const useCreateTournament = () => {
  const t = useTranslations('Toasts')
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => tournamentService.create(data),
    onSuccess: () => {
      toast.success(t('tournamentCreatedSuccess'));
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
    onError: (error: any) => {
      toastMessageHandler(error, t);
    },
  });
};
