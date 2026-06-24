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
    onSuccess: (responseData, variables) => {
      toast.success(t("pollCreated"));

      queryClient.invalidateQueries({ queryKey: ["polls"] });

      // Проверяем: если чекбокс "isPeopleChamp" был нажат (равен true)
      if (variables.isPeopleChamp) {
        router.push("/people-champ"); // Перекидываем в Народного чемпиона
      } else {
        router.push("/voting"); // Иначе в обычные голосования
      }
    },
    onError: (error: any) => {
      toastMessageHandler(error, t);
    },
  });
};
