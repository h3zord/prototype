import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  GetPrintersByCustomerResponse,
  GetServiceOrdersParams,
  GetServiceOrdersResponse,
  GetDeliveriesOfTheDayResponse,
  InsertMeasureServiceOrderBody,
  ModifyServiceOrderBody,
  PrepareToDispatchServiceOrderBody,
  UpsertServiceOrderBody,
  createServiceOrder,
  editServiceOrder,
  getPCPServiceOrders,
  getDeliveriesOfTheDay,
  getPrintersByCustomer,
  getServiceOrders,
  insertMeasureServiceOrder,
  modifyServiceOrder,
  prepareToDispatchServiceOrder,
  reuseServiceOrder,
  GetPCPServiceOrdersParams,
  GetDeliveriesOfTheDayParams,
  getServiceOrdersList,
  GetServiceOrdersListResponse,
  updateServiceOrderPurchaseOrder,
  markPDFAsSent,
  MarkPDFAsSentBody,
  saveAnnotation,
  Annotation,
  getServiceOrderAnnotations,
  UploadExternalPDFBody,
  uploadExternalPDF,
  getExternalPDF,
  UpdateExternalPDFStatusBody,
  updateExternalPDFStatus,
  getprintSheetFile,
  registerServiceOrderLog,
  type RegisterServiceOrderLogBody,
  generateServiceOrderXML,
  type ServiceOrderTitlesQuery,
  type GetServiceOrderTitlesResponse,
  getServiceOrderTitles,
  getServiceOrderFile,
  getInvoicingServiceOrders,
  getDieCutBlockSheetFile,
} from "./services";
import { UseCustomMutationParams } from "../../../config/queryClient";
import { ServiceOrderStatus } from "../../../types/models/serviceorder";
import { stepSchemas } from "./schemas";
import {
  getServiceOrderFormDefaultValues,
  ServiceOrderFormType,
} from "./helpers";
import z, { ZodType } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const usePrintersByCustomer = (
  customerId: number,
  options?: Omit<
    UseQueryOptions<GetPrintersByCustomerResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["Printers", customerId],
    queryFn: () => getPrintersByCustomer(customerId),
    enabled: !!customerId,
    ...options,
  });
};

export const useCreateServiceOrder = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  any,
  Error,
  {
    file: any;
    printSheet: any;
    dieCutBlockSheet: any;
    data: UpsertServiceOrderBody;
  }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createServiceOrder,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["pcp"] });
      queryClient.invalidateQueries({ queryKey: ["serviceorders"] });
      queryClient.invalidateQueries({ queryKey: ["DeliveriesOfTheDay"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao criar ordem de serviço",
      SUCCESS_MESSAGE: "Ordem de serviço criada com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useEditServiceOrder = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  any,
  Error,
  {
    id: number;
    file: any;
    printSheet: any;
    dieCutBlockSheet: any;
    data: UpsertServiceOrderBody;
  }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editServiceOrder,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["pcp"] });
      queryClient.invalidateQueries({ queryKey: ["serviceorders"] });
      queryClient.invalidateQueries({ queryKey: ["DeliveriesOfTheDay"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao atualizar ordem de serviço",
      SUCCESS_MESSAGE: "Ordem de serviço atualizada com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useReuseServiceOrder = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  any,
  Error,
  {
    id: number;
    file: any;
    printSheet: any;
    dieCutBlockSheet: any;
    data: UpsertServiceOrderBody;
  }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reuseServiceOrder,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["pcp"] });
      queryClient.invalidateQueries({ queryKey: ["serviceorders"] });
      queryClient.invalidateQueries({ queryKey: ["DeliveriesOfTheDay"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao criar ordem de serviço",
      SUCCESS_MESSAGE: "Ordem de serviço criada com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useServiceOrders = (
  params: GetServiceOrdersParams,
  options?: Omit<
    UseQueryOptions<GetServiceOrdersResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["serviceorders", params],
    queryFn: () => getServiceOrders(params),
    ...options,
  });
};

export const useInvoicingServiceOrders = (
  params: GetServiceOrdersParams,
  options?: Omit<
    UseQueryOptions<GetServiceOrdersResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["serviceorders", params],
    queryFn: () => getInvoicingServiceOrders(params),
    ...options,
  });
};

export const usePCPServiceOrders = (
  params: GetPCPServiceOrdersParams,
  options?: Omit<
    UseQueryOptions<GetServiceOrdersResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["pcp", params],
    queryFn: () => getPCPServiceOrders(params),
    ...options,
  });
};

export const useDeliveriesOfTheDay = (
  params: GetDeliveriesOfTheDayParams,
  options?: Omit<
    UseQueryOptions<GetDeliveriesOfTheDayResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["DeliveriesOfTheDay", params],
    queryFn: () => getDeliveriesOfTheDay(params),
    ...options,
  });
};

export const useModifyServiceOrder = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<any, Error, ModifyServiceOrderBody> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: modifyServiceOrder,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["pcp"] });
      queryClient.invalidateQueries({ queryKey: ["serviceorders"] });
      queryClient.invalidateQueries({ queryKey: ["DeliveriesOfTheDay"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao alterar ordem de serviço",
      SUCCESS_MESSAGE: "Ordem de serviço alterada com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useRegisterServiceOrderLog = ({
  onSuccess,
  ...mutationConfig
}: {
  onSuccess?: (
    data: void,
    variables: RegisterServiceOrderLogBody,
    context: unknown,
  ) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, RegisterServiceOrderLogBody>({
    mutationFn: registerServiceOrderLog,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["serviceorders"] });
      queryClient.invalidateQueries({ queryKey: ["pcp"] });
      onSuccess?.(data, variables, context);
    },

    ...mutationConfig,
  });
};

export const usePrepareToDispatchServiceOrder = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  any,
  Error,
  PrepareToDispatchServiceOrderBody
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: prepareToDispatchServiceOrder,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["pcp"] });
      queryClient.invalidateQueries({ queryKey: ["serviceorders"] });
      queryClient.invalidateQueries({ queryKey: ["DeliveriesOfTheDay"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao preparar para despacho",
      SUCCESS_MESSAGE: "Ordem de serviço preparada para despacho!",
    },
    ...mutationConfig,
  });
};

export const useInsertMeasureServiceOrder = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<any, Error, InsertMeasureServiceOrderBody> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: insertMeasureServiceOrder,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["pcp"] });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "pcp",
      });
      queryClient.invalidateQueries({ queryKey: ["serviceorders"] });
      queryClient.invalidateQueries({ queryKey: ["DeliveriesOfTheDay"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao alterar ordem de serviço",
      SUCCESS_MESSAGE: "Ordem de serviço alterada com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useServiceOrdersList = (
  query?: { statuses: ServiceOrderStatus[] },
  options?: Omit<
    UseQueryOptions<GetServiceOrdersListResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["serviceorders", "list", query],
    queryFn: () => getServiceOrdersList(query),
    ...options,
  });
};

export const useUpdateServiceOrderPurchaseOrder = ({
  onSuccess,
  ...mutationConfig
}: {
  onSuccess?: (data: any, ...args: any[]) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateServiceOrderPurchaseOrder,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["pcp"] });
      queryClient.invalidateQueries({ queryKey: ["serviceorders"] });
      queryClient.invalidateQueries({ queryKey: ["DeliveriesOfTheDay"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao atualizar Ordem de Compra",
      // SUCCESS_MESSAGE: "Ordem de Compra atualizada com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useMarkPDFAsSent = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<any, Error, MarkPDFAsSentBody> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markPDFAsSent,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["serviceorders"] });
      queryClient.invalidateQueries({ queryKey: ["pcp"] });
      queryClient.invalidateQueries({ queryKey: ["DeliveriesOfTheDay"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao marcar PDF como enviado",
      SUCCESS_MESSAGE: "PDF marcado como enviado com sucesso!",
    },
    ...mutationConfig,
  });
};

export const useUploadExternalPDF = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<any, Error, UploadExternalPDFBody> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UploadExternalPDFBody) => {
      const formData = new FormData();
      formData.append("file", body.file);
      return uploadExternalPDF(body.serviceOrderId, formData);
    },
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["serviceorders"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao enviar arquivo PDF",
      SUCCESS_MESSAGE:
        "Arquivo PDF enviado com sucesso e aguardando aprovação!",
    },
    ...mutationConfig,
  });
};

export type FileType = "serviceOrder" | "printSheet" | "dieCutBlockSheet";

export const useFileQuery = (
  serviceOrderId: number | undefined,
  fileType: FileType,
  {
    ...queryConfig
  }: Omit<UseQueryOptions<{ blob: Blob }, Error>, "queryKey" | "queryFn"> = {},
) =>
  useQuery({
    queryKey: [fileType, serviceOrderId],
    enabled: !!serviceOrderId,
    staleTime: 0,
    queryFn: async () => {
      if (!serviceOrderId) throw new Error("serviceOrderId is undefined");

      let blob: Blob;
      if (fileType === "serviceOrder") {
        blob = await getServiceOrderFile(serviceOrderId);
      }
      if (fileType === "dieCutBlockSheet") {
        blob = await getDieCutBlockSheetFile(serviceOrderId);
      } else {
        blob = await getprintSheetFile(serviceOrderId);
      }

      return { blob };
    },
    ...queryConfig,
  });

export const useServiceOrderFileQuery = (
  serviceOrderId: number | undefined,
  queryConfig = {},
) => useFileQuery(serviceOrderId, "serviceOrder", queryConfig);

export const usePrintSheetFileQuery = (
  serviceOrderId: number | undefined,
  queryConfig = {},
) => useFileQuery(serviceOrderId, "printSheet", queryConfig);

export const usePrintSheetQuery = (
  id: number | undefined,
  cfg: Omit<UseQueryOptions<string, Error>, "queryKey" | "queryFn"> = {},
) =>
  useQuery({
    queryKey: ["printSheet", id],
    enabled: !!id,
    queryFn: async () => {
      const blob = await getprintSheetFile(id!);
      return URL.createObjectURL(blob);
    },
    ...cfg,
  });

export const useDieCutBlockSheetQuery = (
  id: number | undefined,
  cfg: Omit<UseQueryOptions<string, Error>, "queryKey" | "queryFn"> = {},
) =>
  useQuery({
    queryKey: ["dieCutBlockSheet", id],
    enabled: !!id,
    queryFn: async () => {
      const blob = await getDieCutBlockSheetFile(id!);
      return URL.createObjectURL(blob);
    },
    ...cfg,
  });

export const useSaveServiceOrderAnnotation = (options?: {
  onSuccess?: () => void;
  onError?: (err: Error) => void;
}) => {
  return useMutation({
    mutationFn: saveAnnotation,
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (err: Error) => {
      options?.onError?.(err);
    },
    meta: {
      SUCCESS_MESSAGE: "Anotação salva com sucesso!",
      ERROR_MESSAGE: "Erro ao salvar anotação",
    },
  });
};

export const useServiceOrderAnnotations = (
  serviceOrderId: number | undefined,
  options?: Omit<UseQueryOptions<Annotation[], Error>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["serviceOrder", serviceOrderId, "annotations"],
    queryFn: () => {
      if (!serviceOrderId) throw new Error("serviceOrderId is undefined");
      return getServiceOrderAnnotations(serviceOrderId);
    },
    enabled: !!serviceOrderId,
    ...options,
  });
};

export const useUpdateExternalPDFStatus = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  any,
  Error,
  UpdateExternalPDFStatusBody
> = {}): UseMutationResult<
  any,
  Error,
  UpdateExternalPDFStatusBody,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExternalPDFStatus,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["serviceorders"] });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao atualizar status do PDF",
      SUCCESS_MESSAGE: "Status do PDF atualizado com sucesso!",
    },
    ...mutationConfig,
  }) as UseMutationResult<any, Error, UpdateExternalPDFStatusBody, unknown>;
};

export const useExternalPDF = (
  serviceOrderId: number,
  options?: Omit<UseQueryOptions<Blob, Error, Blob>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["externalPDF", serviceOrderId],
    queryFn: () => getExternalPDF(serviceOrderId),
    ...options,
  });
};

export const useGenerateServiceOrderXML = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<any, Error, number> = {}) => {
  return useMutation({
    mutationFn: generateServiceOrderXML,
    onSuccess,
    meta: {
      SUCCESS_MESSAGE: "XML gerado!",
      ERROR_MESSAGE: "Erro ao gerar XML",
    },
    ...mutationConfig,
  });
};

export const useServiceOrderTitles = (
  query?: ServiceOrderTitlesQuery,
  options?: Omit<
    UseQueryOptions<GetServiceOrderTitlesResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["serviceOrderTitles", query],
    queryFn: () => getServiceOrderTitles(query),
    ...options,
  });
};

type StepSchemas = typeof stepSchemas;
type StepSchemaKeys = keyof StepSchemas;
type SchemaByStep<K extends StepSchemaKeys> = z.infer<StepSchemas[K]>;

export function useStepForm<K extends StepSchemaKeys>(
  step: K,
  serviceOrderFormType: ServiceOrderFormType,
  serviceOrder?: any,
): UseFormReturn<SchemaByStep<K>, any, SchemaByStep<K>> {
  const schema = stepSchemas[step] as ZodType<SchemaByStep<K>>;

  return useForm<SchemaByStep<K>, any, SchemaByStep<K>>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: getServiceOrderFormDefaultValues(
      serviceOrderFormType,
      serviceOrder,
    ),
  });
}
