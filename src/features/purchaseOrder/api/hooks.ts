import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  getPurchaseOrder,
  GetPurchaseOrdersParams,
  GetPurchaseOrdersResponse,
} from "./services";

export const usePurchaseOrders = (
  params: GetPurchaseOrdersParams,
  options?: Omit<
    UseQueryOptions<GetPurchaseOrdersResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["purchase-orders", params],
    queryFn: () => getPurchaseOrder(params),
    ...options,
  });
};
