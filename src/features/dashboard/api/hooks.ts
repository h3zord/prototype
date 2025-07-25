import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  DashboardData,
  getDashboardData,
  GetDashboardDataParams,
  getDashboardFilters,
  type DashboardFilters,
} from "./services";

export const useDashboardFilters = (
  options?: Omit<
    UseQueryOptions<DashboardFilters, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["dashboard", "filters"],
    queryFn: getDashboardFilters,
    meta: { ERROR_MESSAGE: "Erro ao buscar filtros do dashboard" },
    ...options,
  });
};

export const useDashboardData = (
  params: GetDashboardDataParams,
  options?: Omit<
    UseQueryOptions<DashboardData, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["cards", params],
    queryFn: () => getDashboardData(params),
    meta: { ERROR_MESSAGE: "Erro ao buscar status dos cards" },
    ...options,
  });
};
