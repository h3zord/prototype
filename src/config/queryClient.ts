import {
  Mutation,
  MutationCache,
  Query,
  QueryCache,
  QueryClient,
  QueryKey,
  UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onSuccess: (
      _data: unknown,
      query: Query<unknown, unknown, unknown, QueryKey>,
    ): void => {
      if (query.meta?.SUCCESS_MESSAGE) {
        toast.success(`${query.meta.SUCCESS_MESSAGE}`);
      }
    },
    onError: (
      _: unknown,
      query: Query<unknown, unknown, unknown, QueryKey>,
    ): void => {
      if (query.meta?.ERROR_MESSAGE) {
        toast.error(`${query.meta.ERROR_MESSAGE}`);
      }
    },
  }),
  mutationCache: new MutationCache({
    onSuccess: (
      _data: unknown,
      _variables: unknown,
      _context: unknown,
      mutation: Mutation<unknown, unknown, unknown, unknown>,
    ): void => {
      if (mutation.meta?.SUCCESS_MESSAGE) {
        toast.success(`${mutation.meta.SUCCESS_MESSAGE}`);
      }
    },
    onError: (
      error: any,
      _variables: unknown,
      _context: unknown,
      mutation: Mutation<unknown, unknown, unknown, unknown>,
    ): void => {
      const customBackendMessage = error?.response?.data?.message;
      const statusCode = error?.response?.status;

      if (customBackendMessage && statusCode >= 400 && statusCode < 500) {
        toast.error(customBackendMessage);
      } else if (mutation.meta?.ERROR_MESSAGE) {
        toast.error(`${mutation.meta.ERROR_MESSAGE}`);
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export type UseCustomMutationParams<TData, TError, TVariables> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  "mutationFn"
> & {
  onSuccess?: (data: TData, variables: TVariables, context: unknown) => void;
};
