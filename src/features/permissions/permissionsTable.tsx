import { useCallback, useMemo, useState } from "react";
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { Button } from "../../components/components/ui/button";
import DataTableHeader from "../../components/ui/table/DataTableHeader";
import DataTable from "../../components/ui/table/data-table/DataTable";
import Modal from "../../components/ui/modal/Modal";
import {
  useGroupsWithRoutes,
  useUpdateGroupRoutes,
  useUpdateGroupPermissions,
  useUpdateGroupRedirectSettings,
} from "./api/hooks";
import { toast } from "react-toastify";
import SelectMultiFieldWithSelectAll from "./components/SelectMultiFieldWithSelectAll";
import SelectField from "../../components/ui/form/SelectField";
import {
  productTypeAllOptions,
  serviceOrderProductOptions,
  serviceOrdeAllStatusOptions,
  productTypeCorrugatedClicheOptions,
  productTypeDieCutBlockOptions,
  serviceOrderClicheStatusOptions,
  serviceOrderDieCutBlockStatusOptions,
} from "../../helpers/options/serviceorder";
import { mapToSelectOptions } from "../../helpers/options/mapToSelectOptions";
import { useCustomersList } from "../../features/customers/api/hooks";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BsThreeDots } from "react-icons/bs";

interface MoreActionsMenuProps {
  actions: { label: React.ReactNode; onClick: () => void }[];
}

const MoreActionsMenu: React.FC<MoreActionsMenuProps> = ({ actions }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className=" rounded hover:bg-gray-500 focus:outline-none">
          <BsThreeDots className="h-5 w-5" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="bg-gray-700 rounded shadow-lg z-40 mt-2 p-1"
        align="end"
      >
        {actions.map((action, index) => (
          <DropdownMenu.Item
            key={index}
            onSelect={action.onClick}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-500 cursor-pointer"
          >
            {action.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export enum PermissionType {
  CREATE_USER = "CREATE_USER",
  UPDATE_USER = "UPDATE_USER",
  DELETE_USER = "DELETE_USER",
  CREATE_CUSTOMER = "CREATE_CUSTOMER",
  UPDATE_CUSTOMER = "UPDATE_CUSTOMER",
  DELETE_CUSTOMER = "DELETE_CUSTOMER",
  CREATE_TRANSPORT = "CREATE_TRANSPORT",
  UPDATE_TRANSPORT = "UPDATE_TRANSPORT",
  DELETE_TRANSPORT = "DELETE_TRANSPORT",
  CREATE_PRINTER = "CREATE_PRINTER",
  UPDATE_PRINTER = "UPDATE_PRINTER",
  DELETE_PRINTER = "DELETE_PRINTER",
  CREATE_CYLINDER = "CREATE_CYLINDER",
  UPDATE_CYLINDER = "UPDATE_CYLINDER",
  DELETE_CYLINDER = "DELETE_CYLINDER",
  CREATE_PROFILE = "CREATE_PROFILE",
  UPDATE_PROFILE = "UPDATE_PROFILE",
  DELETE_PROFILE = "DELETE_PROFILE",
  CREATE_SERVICE_ORDER = "CREATE_SERVICE_ORDER",
  UPDATE_SERVICE_ORDER = "UPDATE_SERVICE_ORDER",
  ADD_MEASURE = "ADD_MEASURE",
  MANAGE_DISPATCH = "MANAGE_DISPATCH",
  CHANGE_STATUS_PCP = "CHANGE_STATUS_PCP",
  INVOICE_EARLY = "INVOICE_EARLY",
  CREATE_CHANNEL = "CREATE_CHANNEL",
  UPDATE_CHANNEL = "UPDATE_CHANNEL",
  DELETE_CHANNEL = "DELETE_CHANNEL",
  CREATE_CURVE = "CREATE_CURVE",
  UPDATE_CURVE = "UPDATE_CURVE",
  DELETE_CURVE = "DELETE_CURVE",
  CREATE_INVOICE = "CREATE_INVOICE",
  UPDATE_INVOICE = "UPDATE_INVOICE",
  DELETE_INVOICE = "DELETE_INVOICE",
  GENERATE_PDF = "GENERATE_PDF",
  UPDATE_EXTERNALPDF = "UPDATE_EXTERNALPDF",
  SEND_EMAIL = "SEND_EMAIL",
  VIEW_NOTIFICATION_FINANCIAL = "VIEW_NOTIFICATION_FINANCIAL",
  VIEW_NOTIFICATION_PCP = "VIEW_NOTIFICATION_PCP",
  LIST_PERMISSIONS = "LIST_PERMISSIONS",
  MANAGE_PERMISSIONS = "MANAGE_PERMISSIONS",
  VIEW_PCP_PRICES = "VIEW_PCP_PRICES",
}

const permissionLabels: Record<PermissionType, string> = {
  [PermissionType.CREATE_USER]: "Criar Usuário",
  [PermissionType.UPDATE_USER]: "Atualizar Usuário",
  [PermissionType.DELETE_USER]: "Deletar Usuário",
  [PermissionType.CREATE_CUSTOMER]: "Criar Cliente",
  [PermissionType.UPDATE_CUSTOMER]: "Atualizar Cliente",
  [PermissionType.DELETE_CUSTOMER]: "Deletar Cliente",
  [PermissionType.CREATE_TRANSPORT]: "Criar Transporte",
  [PermissionType.UPDATE_TRANSPORT]: "Atualizar Transporte",
  [PermissionType.DELETE_TRANSPORT]: "Deletar Transporte",
  [PermissionType.CREATE_PRINTER]: "Criar Impressora",
  [PermissionType.UPDATE_PRINTER]: "Atualizar Impressora",
  [PermissionType.DELETE_PRINTER]: "Deletar Impressora",
  [PermissionType.CREATE_CYLINDER]: "Criar Cilindro",
  [PermissionType.UPDATE_CYLINDER]: "Atualizar Cilindro",
  [PermissionType.DELETE_CYLINDER]: "Deletar Cilindro",
  [PermissionType.CREATE_PROFILE]: "Criar Perfil",
  [PermissionType.UPDATE_PROFILE]: "Atualizar Perfil",
  [PermissionType.DELETE_PROFILE]: "Deletar Perfil",
  [PermissionType.CREATE_SERVICE_ORDER]: "Criar Ordem de Serviço",
  [PermissionType.UPDATE_SERVICE_ORDER]: "Atualizar Ordem de Serviço",
  [PermissionType.CREATE_CHANNEL]: "Criar Calha",
  [PermissionType.UPDATE_CHANNEL]: "Atualizar Calha",
  [PermissionType.DELETE_CHANNEL]: "Deletar Calha",
  [PermissionType.CREATE_CURVE]: "Criar Curva",
  [PermissionType.UPDATE_CURVE]: "Atualizar Curva",
  [PermissionType.DELETE_CURVE]: "Deletar Curva",
  [PermissionType.CREATE_INVOICE]: "Criar Fatura e OC",
  [PermissionType.UPDATE_INVOICE]: "Atualizar Fatura e OC",
  [PermissionType.DELETE_INVOICE]: "Deletar Fatura e OC",
  [PermissionType.GENERATE_PDF]: "Gerar PDF",
  [PermissionType.UPDATE_EXTERNALPDF]: "Atualizar PDF Externo",
  [PermissionType.SEND_EMAIL]: "Enviar Email",
  [PermissionType.VIEW_NOTIFICATION_FINANCIAL]:
    "Ver Notificação de cadastro incompleto",
  [PermissionType.VIEW_NOTIFICATION_PCP]: "Ver Notificação de PCP",
  [PermissionType.LIST_PERMISSIONS]: "Listar Permissões",
  [PermissionType.MANAGE_PERMISSIONS]: "Gerenciar Permissões",
  [PermissionType.ADD_MEASURE]: "Adicionar Medidas",
  [PermissionType.CHANGE_STATUS_PCP]: "Alterar Status no PCP",
  [PermissionType.MANAGE_DISPATCH]: "Gerenciar Despacho",
  [PermissionType.INVOICE_EARLY]: "Faturar Antecipadamente",
  [PermissionType.VIEW_PCP_PRICES]: "Visualizar Preços no PCP",
};

interface Option {
  label: string;
  value: string;
}

// Estendendo a interface GroupWithPermissions para incluir os novos campos
interface ExtendedGroupWithPermissions {
  id: number;
  name: string;
  routes: string[];
  permissions: string[];
  redirectRoute?: string;
  defaultFilters?: any; // JSON object from backend
}

type PermissionTableData = {
  isHeader: boolean;
  id: string | number;
  name: string;
  routes: string[];
  permissions: string[];
  redirectRoute?: string;
  defaultFilters?: any;
};

interface PermissionsFormData {
  routes: Option[];
  permissions: Option[];
}

interface RedirectSettingsFormData {
  redirectRoute: Option | null;
  defaultProduct: Option | null;
  defaultProductType: Option | null;
  defaultStatus: Option[];
  defaultCustomer: Option | null;
}

const PermissionsTable = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] =
    useState<ExtendedGroupWithPermissions | null>(null);

  const { data: groupsList, isLoading } = useGroupsWithRoutes();
  const { data: customers } = useCustomersList();

  const updateRoutesMutation = useUpdateGroupRoutes({
    onError: (error) => {
      console.error("Erro ao salvar permissões de rota:", error);
      toast.error("Erro ao salvar permissões de rota. Tente novamente.");
    },
  });

  const updatePermissionsMutation = useUpdateGroupPermissions({
    onSuccess: () => {
      toast.success("Permissões atualizadas com sucesso!");
      handleClosePermissionsModal();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
    onError: (error) => {
      console.error("Erro ao salvar permissões de ação:", error);
      toast.error("Erro ao salvar permissões de ação. Tente novamente.");
    },
  });

  const updateRedirectSettingsMutation = useUpdateGroupRedirectSettings({
    onSuccess: () => {
      toast.success(
        "Configurações de redirecionamento atualizadas com sucesso!",
      );
      handleCloseRedirectModal();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
    onError: (error) => {
      console.error("Erro ao salvar configurações de redirecionamento:", error);
      toast.error(
        "Erro ao salvar configurações de redirecionamento. Tente novamente.",
      );
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PermissionsFormData>({
    defaultValues: {
      routes: [],
      permissions: [],
    },
  });

  const {
    control: redirectControl,
    handleSubmit: handleRedirectSubmit,
    reset: resetRedirect,
    watch: watchRedirect,
    setValue: setRedirectValue,
    formState: { errors: redirectErrors },
  } = useForm<RedirectSettingsFormData>({
    defaultValues: {
      redirectRoute: null,
      defaultProduct: null,
      defaultProductType: null,
      defaultStatus: [],
      defaultCustomer: null,
    },
  });

  const selectedRoutes = watch("routes");
  const selectedPermissions = watch("permissions");
  const selectedRedirectRoute = watchRedirect("redirectRoute");
  const selectedDefaultProduct = watchRedirect("defaultProduct");
  const selectedDefaultProductType = watchRedirect("defaultProductType");
  const selectedDefaultStatus = watchRedirect("defaultStatus");
  const selectedDefaultCustomer = watchRedirect("defaultCustomer");

  console.log("test", selectedDefaultProduct);

  const productTypeOptions =
    selectedDefaultProduct?.value === "CLICHE_CORRUGATED"
      ? productTypeCorrugatedClicheOptions
      : productTypeDieCutBlockOptions;

  const serviceOrderStatusOptions =
    selectedDefaultProduct?.value === "CLICHE_CORRUGATED"
      ? serviceOrderClicheStatusOptions
      : serviceOrderDieCutBlockStatusOptions;

  // Rotas disponíveis para módulos permitidos (acesso aos módulos)
  const availableModuleRoutes: Option[] = useMemo(
    () => [
      { label: "Dashboard", value: "/dashboard" },
      { label: "Usuários", value: "/users" },
      { label: "Clientes", value: "/customers" },
      { label: "Transporte", value: "/transport" },
      { label: "Permissões", value: "/permissions" },
      { label: "PCP", value: "/pcp" },
      { label: "Entregas do Dia", value: "/deliveriesoftheday" },
      { label: "Histórico", value: "/serviceorder" },
      { label: "Faturamento", value: "/invoiceserviceorder" },
      { label: "Faturadas", value: "/invoiced-serviceorder" },
      { label: "Ordens de Compra", value: "/purchaseorder" },
      { label: "Notas Fiscais", value: "/invoices" },
      { label: "Reposições", value: "/replacements" },
    ],
    [],
  );

  // Rotas disponíveis para redirecionamento pós-login
  const availableRedirectRoutes: Option[] = useMemo(
    () => [
      { label: "Dashboard", value: "/dashboard" },
      { label: "PCP", value: "/pcp" },
      { label: "Entregas do Dia", value: "/deliveriesoftheday" },
      { label: "Faturamento", value: "/invoiceserviceorder" },
    ],
    [],
  );

  const availablePermissions: Option[] = Object.entries(permissionLabels).map(
    ([value, label]) => ({
      label,
      value,
    }),
  );

  // Convert customers to select options
  const customerOptions = mapToSelectOptions(
    customers || [],
    "fantasyName",
    "id",
  );

  // Verificar se a rota selecionada não é dashboard
  const shouldShowDefaultFilters = useMemo(() => {
    return (
      selectedRedirectRoute?.value &&
      selectedRedirectRoute.value !== "/dashboard"
    );
  }, [selectedRedirectRoute]);

  const handleOpenPermissions = useCallback(
    (group: ExtendedGroupWithPermissions) => {
      setSelectedGroup(group);
      setIsPermissionsModalOpen(true);

      const currentRoutes: Option[] = group.routes.map((route) => {
        const routeOption = availableModuleRoutes.find(
          (option) => option.value === route,
        );
        return routeOption || { label: route, value: route };
      });

      const currentPermissions: Option[] = group.permissions.map(
        (permissionValue) => {
          return (
            availablePermissions.find(
              (option) => option.value === permissionValue,
            ) || { label: permissionValue, value: permissionValue }
          );
        },
      );

      setValue("routes", currentRoutes);
      setValue("permissions", currentPermissions);
    },
    [availableModuleRoutes, availablePermissions, setValue],
  );

  const handleOpenRedirectSettings = useCallback(
    (group: ExtendedGroupWithPermissions) => {
      setSelectedGroup(group);
      setIsRedirectModalOpen(true);

      const redirectRouteOption = group.redirectRoute
        ? availableRedirectRoutes.find(
            (option) => option.value === group.redirectRoute,
          )
        : null;

      setRedirectValue("redirectRoute", redirectRouteOption || null);

      // Parse defaultFilters from backend (JSON object)
      const defaultFilters = group.defaultFilters || {};

      setRedirectValue(
        "defaultProduct",
        defaultFilters.defaultProduct
          ? serviceOrderProductOptions.find(
              (opt) => opt.value === defaultFilters.defaultProduct,
            ) || null
          : null,
      );

      setRedirectValue(
        "defaultProductType",
        defaultFilters.defaultProductType
          ? productTypeAllOptions.find(
              (opt) => opt.value === defaultFilters.defaultProductType,
            ) || null
          : null,
      );

      setRedirectValue(
        "defaultStatus",
        defaultFilters.defaultStatus &&
          Array.isArray(defaultFilters.defaultStatus)
          ? (defaultFilters.defaultStatus
              .map((status: string) =>
                serviceOrdeAllStatusOptions.find((opt) => opt.value === status),
              )
              .filter(Boolean) as Option[])
          : [],
      );

      // Correção para o defaultCustomer - converter ambos os valores para string para comparação
      setRedirectValue(
        "defaultCustomer",
        defaultFilters.defaultCustomer && customerOptions.length > 0
          ? customerOptions.find(
              (opt) =>
                String(opt.value) === String(defaultFilters.defaultCustomer),
            ) || null
          : null,
      );
    },
    [availableRedirectRoutes, setRedirectValue, customerOptions],
  );

  const handleClosePermissionsModal = () => {
    setIsPermissionsModalOpen(false);
    setSelectedGroup(null);
    reset();
  };

  const handleCloseRedirectModal = () => {
    setIsRedirectModalOpen(false);
    setSelectedGroup(null);
    resetRedirect();
  };

  const onSubmitPermissions = async (data: PermissionsFormData) => {
    if (!selectedGroup) return;

    try {
      const routes = data.routes.map((route) => route.value);
      const permissions = data.permissions.map((permission) =>
        String(permission.value),
      );

      await updateRoutesMutation.mutateAsync({
        groupId: selectedGroup.id,
        routes,
      });

      await updatePermissionsMutation.mutateAsync({
        groupId: selectedGroup.id,
        permissions,
      });
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
    }
  };

  const onSubmitRedirectSettings = async (data: RedirectSettingsFormData) => {
    if (!selectedGroup) return;

    try {
      const defaultFilters: any = {};

      if (data.defaultProduct?.value) {
        defaultFilters.defaultProduct = data.defaultProduct.value;
      }
      if (data.defaultProductType?.value) {
        defaultFilters.defaultProductType = data.defaultProductType.value;
      }

      if (data.defaultStatus && data.defaultStatus.length > 0) {
        const allStatusOptionsCount = serviceOrdeAllStatusOptions.length;
        const selectedStatusCount = data.defaultStatus.length;

        if (selectedStatusCount < allStatusOptionsCount) {
          defaultFilters.defaultStatus = data.defaultStatus.map(
            (status) => status.value,
          );
        }
      }

      if (data.defaultCustomer?.value) {
        defaultFilters.defaultCustomer = data.defaultCustomer.value;
      }

      const mutationParams = {
        groupId: selectedGroup.id,
        redirectRoute: data.redirectRoute?.value || "",
        defaultFilters:
          Object.keys(defaultFilters).length > 0 ? defaultFilters : null,
      };

      await updateRedirectSettingsMutation.mutateAsync(mutationParams);
    } catch (error) {
      console.error("Erro ao salvar configurações de redirecionamento:", error);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columns: ColumnDef<PermissionTableData>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Grupo de Usuário",
      },
      {
        accessorKey: "routes",
        header: "Módulos Permitidos",
        cell: ({ row }) => {
          const routes = row.original.routes;
          return (
            <div className="max-w-md">
              {routes.length > 0 ? (
                <span className="text-white">
                  {routes
                    .map((route) => {
                      const routeOption = availableModuleRoutes.find(
                        (option) => option.value === route,
                      );
                      return routeOption ? routeOption.label : route;
                    })
                    .join(", ")}
                </span>
              ) : (
                <span className="text-white text-foreground">
                  Nenhuma rota permitida
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "permissions",
        header: "Ações Permitidas",
        cell: ({ row }) => {
          const permissions = row.original.permissions;
          return (
            <div className="max-w-md">
              {permissions.length > 0 ? (
                <span className="text-white">
                  {permissions
                    .map((p) => permissionLabels[p as PermissionType] || p)
                    .join(", ")}
                </span>
              ) : (
                <span className="text-white text-foreground">
                  Nenhuma ação permitida
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Ações",
        enableSorting: false,
        size: 160,
        cell: ({ row }) => {
          const group: ExtendedGroupWithPermissions = {
            id: row.original.id as number,
            name: row.original.name,
            routes: row.original.routes,
            permissions: row.original.permissions,
            redirectRoute: row.original.redirectRoute,
            defaultFilters: row.original.defaultFilters,
          };

          const actions = [
            {
              label: "Definir permissões de rotas",
              onClick: () => handleOpenPermissions(group),
            },
            {
              label: "Definir permissões de redirecionamento",
              onClick: () => handleOpenRedirectSettings(group),
            },
          ];

          return <MoreActionsMenu actions={actions} />;
        },
      },
    ],
    [availableModuleRoutes, handleOpenPermissions, handleOpenRedirectSettings],
  );

  const transformedData = useMemo(() => {
    if (!groupsList) return [];

    return groupsList.map(
      (group): PermissionTableData => ({
        isHeader: false,
        id: group.id,
        name: group.name,
        routes: group.routes,
        permissions: group.permissions || [],
        redirectRoute: group.redirectRoute,
        defaultFilters: group.defaultFilters,
      }),
    );
  }, [groupsList]);

  const filteredData = useMemo(() => {
    if (!transformedData) return [];

    if (!searchTerm.trim()) return transformedData;

    const lowercaseSearch = searchTerm.toLowerCase().trim();

    return transformedData.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(lowercaseSearch);

      const routeMatch = item.routes.some((route) => {
        const routeOption = availableModuleRoutes.find(
          (option) => option.value === route,
        );
        const routeLabel = routeOption ? routeOption.label : route;

        return (
          route.toLowerCase().includes(lowercaseSearch) ||
          routeLabel.toLowerCase().includes(lowercaseSearch)
        );
      });

      const permissionMatch = item.permissions.some((permission) =>
        (permissionLabels[permission as PermissionType] || permission)
          .toLowerCase()
          .includes(lowercaseSearch),
      );

      return nameMatch || routeMatch || permissionMatch;
    });
  }, [transformedData, searchTerm, availableModuleRoutes]);

  const paginatedData = useMemo(() => {
    if (!filteredData) return [];

    const startIndex = pagination.pageIndex * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;

    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, pagination]);

  const isPending =
    updateRoutesMutation.isPending ||
    updatePermissionsMutation.isPending ||
    updateRedirectSettingsMutation.isPending;

  return (
    <>
      <DataTableHeader
        onSearchChange={handleSearchChange}
        searchInputDefaultValue={searchTerm}
        searchPlaceholder="Buscar..."
      />

      <DataTable
        columns={columns}
        data={paginatedData}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        rowCount={filteredData?.length ?? 0}
        isLoading={isLoading}
      />

      {/* Modal de Permissões */}
      {isPermissionsModalOpen && selectedGroup && (
        <Modal
          title={`Permissões - ${selectedGroup.name}`}
          onClose={handleClosePermissionsModal}
          className="w-[800px]"
          padding="p-6"
        >
          <form
            onSubmit={handleSubmit(onSubmitPermissions)}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Selecione os módulos que este grupo de usuário pode acessar:
              </h3>

              <SelectMultiFieldWithSelectAll
                label="Módulos Permitidos"
                options={availableModuleRoutes}
                control={control}
                name="routes"
                error={errors.routes}
                selectAllText="Selecionar Todas as Rotas"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Selecione as ações que este grupo de usuário pode realizar:
              </h3>

              <SelectMultiFieldWithSelectAll
                label="Ações Permitidas"
                options={availablePermissions}
                control={control}
                name="permissions"
                error={errors.permissions}
                selectAllText="Selecionar Todas as Ações"
              />
            </div>

            <div className="text-sm text-gray-400">
              <p>
                <strong>Grupo:</strong> {selectedGroup.name}
              </p>
              <p>
                <strong>Rotas selecionadas:</strong>{" "}
                {selectedRoutes && selectedRoutes.length > 0
                  ? selectedRoutes.map((route) => route.label).join(", ")
                  : "Nenhuma rota selecionada"}
              </p>
              <p>
                <strong>Ações selecionadas:</strong>{" "}
                {selectedPermissions && selectedPermissions.length > 0
                  ? selectedPermissions.map((p) => p.label).join(", ")
                  : "Nenhuma ação selecionada"}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClosePermissionsModal}
                className="text-gray-300 hover:text-white"
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#f9a853]/90 hover:bg-[#f9a853] text-white"
                disabled={isPending}
              >
                {isPending ? "Salvando..." : "Salvar Permissões"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal de Configurações de Redirecionamento */}
      {isRedirectModalOpen && selectedGroup && (
        <Modal
          title={`Redirecionamento - ${selectedGroup.name}`}
          onClose={handleCloseRedirectModal}
          className="w-[700px]"
          padding="p-6"
        >
          <form
            onSubmit={handleRedirectSubmit(onSubmitRedirectSettings)}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Configuração de Redirecionamento Pós-Login
              </h3>

              <div className="space-y-4">
                <SelectField
                  label="Tela de Redirecionamento"
                  options={availableRedirectRoutes}
                  control={redirectControl}
                  name="redirectRoute"
                  error={redirectErrors.redirectRoute}
                />

                {shouldShowDefaultFilters && (
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-white">
                      Filtros Padrão
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SelectField
                        label="Produto"
                        options={serviceOrderProductOptions}
                        control={redirectControl}
                        name="defaultProduct"
                        error={redirectErrors.defaultProduct}
                      />

                      <SelectField
                        label="Tipo de Produto"
                        options={productTypeOptions}
                        control={redirectControl}
                        name="defaultProductType"
                        error={redirectErrors.defaultProductType}
                      />

                      <SelectMultiFieldWithSelectAll
                        label="Status"
                        options={serviceOrderStatusOptions}
                        control={redirectControl}
                        name="defaultStatus"
                        error={redirectErrors.defaultStatus}
                        selectAllText="Selecionar Todos os Status"
                      />

                      {/* <SelectField
                        label="Cliente"
                        options={customerOptions}
                        control={redirectControl}
                        name="defaultCustomer"
                        error={redirectErrors.defaultCustomer}
                        loading={isCustomersPending}
                      /> */}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-400">
              <p>
                <strong>Grupo:</strong> {selectedGroup.name}
              </p>
              <p>
                <strong>Redirecionamento:</strong>{" "}
                {selectedRedirectRoute?.value
                  ? selectedRedirectRoute.label
                  : "Nenhuma tela selecionada"}
              </p>
              {shouldShowDefaultFilters && (
                <>
                  <p>
                    <strong>Produto:</strong>{" "}
                    {selectedDefaultProduct?.label || "Nenhum selecionado"}
                  </p>
                  <p>
                    <strong>Tipo de produto:</strong>{" "}
                    {selectedDefaultProductType?.label || "Nenhum selecionado"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {selectedDefaultStatus && selectedDefaultStatus.length > 0
                      ? selectedDefaultStatus
                          .map((status) => status.label)
                          .join(", ")
                      : "Nenhum selecionado"}
                  </p>
                  <p>
                    <strong>Cliente:</strong>{" "}
                    {selectedDefaultCustomer?.label || "Nenhum selecionado"}
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCloseRedirectModal}
                className="text-gray-300 hover:text-white"
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#f9a853]/90 hover:bg-[#f9a853] text-white"
                disabled={isPending}
              >
                {isPending ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default PermissionsTable;
