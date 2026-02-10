import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SettingsData } from "@/types";
import { getSettings, updateSetting } from "@/api/setting.api";

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    staleTime: 1000 * 60 * 10,
    enabled: !!localStorage.getItem("token"),
  });
};

export const useUpdateSetting = <T extends keyof SettingsData>() => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ type, data }: { type: T; data: any }) =>
      updateSetting(type, data),

    onMutate: async ({ type, data }) => {
      await qc.cancelQueries({ queryKey: ["settings"] });
      const previousSettings = qc.getQueryData<SettingsData>(["settings"]);
      if (previousSettings) {
        qc.setQueryData(["settings"], {
          ...previousSettings,
          [type]: {
            ...previousSettings[type],
            values: { ...previousSettings[type].values, ...data },
          },
        });
      }

      return { previousSettings };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousSettings) {
        qc.setQueryData(["settings"], context.previousSettings);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};
