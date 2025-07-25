import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  getCylinders,
  createCylinder,
  editCylinder,
  deleteCylinder,
  GetCylindersParams,
  GetCylindersResponse,
  UpsertCylinderBody,
} from "./services";
import { UseCustomMutationParams } from "../../../config/queryClient";
import { Cylinder } from "../../../types/models/customercylinder";

// Hook para listar cilindros
export const useCylinders = (
  params: GetCylindersParams,
  options?: Omit<
    UseQueryOptions<GetCylindersResponse, unknown>,
    "queryKey" | "queryFn"
  >,
) => {
  const { idCustomer, idPrinter, ...restParams } = params;

  return useQuery({
    queryKey: ["cylinders", idCustomer, idPrinter, restParams],
    queryFn: () => getCylinders({ idCustomer, idPrinter, ...restParams }),
    ...options,
  });
};

// Hook para criar um cilindro
export const useCreateCylinder = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  Cylinder, // Tipo esperado no retorno da mutation
  Error,
  { idCustomer: number; idPrinter: number; body: UpsertCylinderBody }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idCustomer, idPrinter, body }) =>
      createCylinder(idCustomer, idPrinter, body),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["cylinders", args[0]?.idCustomer, args[0]?.idPrinter],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao criar cilindro",
      SUCCESS_MESSAGE: "Cilindro criado com sucesso!",
    },
    ...mutationConfig,
  });
};

// Hook para editar um cilindro
export const useEditCylinder = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  Cylinder, // Tipo do retorno da mutation
  Error,
  {
    idCustomer: number;
    idPrinter: number;
    idCylinder: number;
    body: UpsertCylinderBody;
  }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idCustomer, idPrinter, idCylinder, body }) =>
      editCylinder({ idCustomer, idPrinter, idCylinder, body }),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["cylinders", args[0]?.idCustomer, args[0]?.idPrinter],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao editar cilindro",
      SUCCESS_MESSAGE: "Cilindro editado com sucesso!",
    },
    ...mutationConfig,
  });
};

// Hook para deletar um cilindro
export const useDeleteCylinder = ({
  onSuccess,
  ...mutationConfig
}: UseCustomMutationParams<
  void,
  Error,
  { idCustomer: number; idPrinter: number; id: number }
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCylinder,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["cylinders", args[0]?.idCustomer, args[0]?.idPrinter],
      });
      onSuccess?.(data, ...args);
    },
    meta: {
      ERROR_MESSAGE: "Erro ao deletar cilindro",
      SUCCESS_MESSAGE: "Cilindro deletado com sucesso!",
    },
    ...mutationConfig,
  });
};
