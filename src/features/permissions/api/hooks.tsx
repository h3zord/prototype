import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  getGroupsWithRoutes,
  updateGroupRoutes,
  updateGroupPermissions,
  updateGroupRedirectSettings,
  GroupWithPermissions,
} from "./services";

export const useGroupsWithRoutes = (
  options?: Omit<
    UseQueryOptions<GroupWithPermissions[], unknown>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: () => getGroupsWithRoutes(),
    ...options,
  });
};

export const useUpdateGroupRoutes = (
  options?: Omit<
    UseMutationOptions<
      unknown,
      unknown,
      { groupId: number; routes: string[] },
      unknown
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGroupRoutes,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });

      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

export const useUpdateGroupPermissions = (
  options?: Omit<
    UseMutationOptions<
      unknown,
      unknown,
      { groupId: number; permissions: string[] },
      unknown
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGroupPermissions,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });

      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

// Hook ajustado para configurações de redirecionamento
export const useUpdateGroupRedirectSettings = (
  options?: Omit<
    UseMutationOptions<
      unknown,
      unknown,
      {
        groupId: number;
        redirectRoute: string;
        defaultFilters: any | null;
      },
      unknown
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGroupRedirectSettings,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });

      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};
