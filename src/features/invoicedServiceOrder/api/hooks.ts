import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  getInvoicedServiceOrders,
  GetInvoicedServiceOrdersParams,
  GetInvoicedServiceOrdersResponse,
} from "./services";

export const useInvoicedServiceOrder = (
  params: GetInvoicedServiceOrdersParams,
  options?: Omit<
    UseQueryOptions<GetInvoicedServiceOrdersResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["invoiced-service-orders", params],
    queryFn: () => getInvoicedServiceOrders(params),
    ...options,
  });
};
