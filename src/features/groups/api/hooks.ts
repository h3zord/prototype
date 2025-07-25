import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getGroupsList, GetGroupsListResponse } from "./services";

export const useGroupsList = (
  options?: Omit<
    UseQueryOptions<GetGroupsListResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["groups", "list"],
    queryFn: () => getGroupsList(),
    ...options,
  });
};
