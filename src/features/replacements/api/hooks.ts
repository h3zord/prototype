import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  getReplacements,
  GetReplacementsParams,
  GetReplacementsResponse,
} from "./services";

export const useReplacements = (
  params: GetReplacementsParams,
  options?: Omit<
    UseQueryOptions<GetReplacementsResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["replacements", params],
    queryFn: () => getReplacements(params),
    ...options,
  });
};
