import { useMutation, useQueryClient } from "@tanstack/react-query";
import { votingService, ICreatePollInput } from "../services/voting.service";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { toastMessageHandler } from "@/shared/utils";

export const useCreatePoll = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations("Voting");

  return useMutation({
    mutationFn: (data: ICreatePollInput) => votingService.createPoll(data),
    onSuccess: () => {
      toast.success(t("pollCreated"));
      // Обновляем список, чтобы сразу увидеть новый бой
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      // Можно редиректнуть на страницу голосований
      router.push("/voting");
    },
    onError: (error: any) => {
      toastMessageHandler(error, t);
    },
  });
};
