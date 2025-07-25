import { useMemo, useState } from "react";
import {
  PaginationState,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { Button, DataTableHeader, IconButton } from "../../../components";
import { PiPlusBold, PiWarningBold } from "react-icons/pi";
import { RiProfileFill } from "react-icons/ri";
import { BiSolidEdit, BiSolidTrash, BiSolidCylinder } from "react-icons/bi";
import { useModal } from "../../../hooks/useModal";
import { usePrinters } from "../api/hooks";
import CreatePrinterModal from "./modals/CreateCustomerPrinter";
import { usePermission } from "../../../context/PermissionsContext";
import { PERMISSIONS_TYPE } from "../../../types/models/permissions";
import { User } from "../../../context/api/PermissionsService";
import EditPrinterModal from "./modals/EditCustomerPrinterModal";
import DeleteCustomerPrinterModal from "./modals/DeleteCustumerPrinter";
import { Link, useLocation, useParams } from "react-router-dom";
import { getLabelFromValue } from "../../../helpers/options/getOptionFromValue";
import { flapOptions } from "../../../helpers/options/printer";
import { Printer } from "../../../types/models/customerprinter";
import { convertToFrontendType } from "../../../helpers/getTypePrinter";
import DataTable from "../../../components/ui/table/data-table/DataTable";
import { useCustomerFlowBreadcrumbs } from "../../../helpers/breadcrumbs_customers_flow";

const CustomerPrinterTable = () => {
  const { permissions }: { permissions: string[]; user: User | null } =
    usePermission();

  const { idCustomer: idCustomerStr } = useParams<{ idCustomer: string }>();
  const { pathname } = useLocation();

  const { openModal, closeModal } = useModal();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [search, setSearch] = useState<string>("");
  const breadcrumbItems = useCustomerFlowBreadcrumbs();

  const idCustomer = idCustomerStr ? parseInt(idCustomerStr, 10) : null;

  const { data: printersResult, isLoading } = usePrinters({
    idCustomer: idCustomer!,
    pagination,
    sorting: sorting[0],
    search,
  });

  const columns: ColumnDef<Printer>[] = useMemo(() => {
    const baseColumns: ColumnDef<Printer>[] = [
      {
        accessorKey: "name",
        header: "Nome",
        cell: ({ row }) => {
          const hasNoCylinder =
            !row.original.cylinders || row.original.cylinders.length === 0;
          const hasNoProfile =
            !row.original.profiles || row.original.profiles.length === 0;
          const showWarning = hasNoCylinder || hasNoProfile;

          return (
            <div className="flex items-center justify-between w-full">
              <span>{row.original.name}</span>
              {showWarning && (
                <PiWarningBold
                  size={18}
                  className="text-yellow-500"
                  title={
                    hasNoCylinder && hasNoProfile
                      ? "Sem cilindro e perfil cadastrado"
                      : hasNoCylinder
                        ? "Sem cilindro cadastrado"
                        : "Sem perfil cadastrado"
                  }
                />
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }) => (
          <div className="max-w-[180px]">
            {convertToFrontendType(row.original.type)}
          </div>
        ),
      },
      {
        accessorKey: "corrugatedPrinter.variation",
        header: "Variação",
        cell: ({ row }) => (
          <div className="max-w-[180px]">
            {row.original.corrugatedPrinter?.variation} mm
          </div>
        ),
      },
      {
        accessorKey: "corrugatedPrinter.flap",
        header: "LAP",
        cell: ({ row }) =>
          getLabelFromValue(row.original.corrugatedPrinter?.flap, flapOptions),
      },
      {
        accessorKey: "colorsAmount",
        header: "Cores",
        cell: ({ row }) => (
          <div className="max-w-[180px]">{row.original.colorsAmount}</div>
        ),
      },
    ];

    if (
      permissions.includes(PERMISSIONS_TYPE.UPDATE_PRINTER) ||
      permissions.includes(PERMISSIONS_TYPE.DELETE_PRINTER)
    ) {
      baseColumns.push({
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            {
              <Link
                className="flex items-center space-x-3"
                to={`${pathname}/${row.original.id}/cylinder`}
              >
                <IconButton
                  icon={
                    <BiSolidCylinder
                      size={18}
                      className="text-white outline-none"
                    />
                  }
                />
              </Link>
            }
            {
              <Link
                className="flex items-center space-x-3"
                to={`${pathname}/${row.original.id}/profile`}
              >
                <IconButton
                  icon={
                    <RiProfileFill
                      size={18}
                      className="text-white outline-none"
                    />
                  }
                />
              </Link>
            }
            {permissions.includes(PERMISSIONS_TYPE.UPDATE_PRINTER) && (
              <IconButton
                onClick={() => handleEditClick(row.original)}
                icon={
                  <BiSolidEdit size={18} className="text-white outline-none" />
                }
              />
            )}
            {permissions.includes(PERMISSIONS_TYPE.DELETE_PRINTER) && (
              <IconButton
                onClick={() => handleDeleteClick(row.original)}
                icon={
                  <BiSolidTrash size={18} className="text-white outline-none" />
                }
              />
            )}
          </div>
        ),
      });
    }
    return baseColumns;
  }, [permissions, pathname, openModal, closeModal, idCustomer]);

  if (!idCustomer) return <div>Usuário não encontrado</div>;

  const handleEditClick = (printer: Printer) => {
    openModal("editPrinter", EditPrinterModal, {
      selectedPrinter: printer,
      onClose: () => closeModal("editPrinter"),
      idCustomer,
      canCreateChannel: permissions.includes(PERMISSIONS_TYPE.CREATE_CHANNEL),
      canUpdateChannel: permissions.includes(PERMISSIONS_TYPE.UPDATE_CHANNEL),
      canDeleteChannel: permissions.includes(PERMISSIONS_TYPE.DELETE_CHANNEL),
      canCreateCurve: permissions.includes(PERMISSIONS_TYPE.CREATE_CURVE),
      canUpdateCurve: permissions.includes(PERMISSIONS_TYPE.UPDATE_CURVE),
      canDeleteCurve: permissions.includes(PERMISSIONS_TYPE.DELETE_CURVE),
    });
  };

  const handleDeleteClick = (printer: Printer) => {
    openModal("deletePrinter", DeleteCustomerPrinterModal, {
      printer,
      idCustomer,
      onClose: () => closeModal("deletePrinter"),
    });
  };

  const handleCreateClick = () => {
    openModal("createPrinter", CreatePrinterModal, {
      onClose: () => closeModal("createPrinter"),
      idCustomer,
      canCreateChannel: permissions.includes(PERMISSIONS_TYPE.CREATE_CHANNEL),
      canUpdateChannel: permissions.includes(PERMISSIONS_TYPE.UPDATE_CHANNEL),
      canDeleteChannel: permissions.includes(PERMISSIONS_TYPE.DELETE_CHANNEL),
      canCreateCurve: permissions.includes(PERMISSIONS_TYPE.CREATE_CURVE),
      canUpdateCurve: permissions.includes(PERMISSIONS_TYPE.UPDATE_CURVE),
      canDeleteCurve: permissions.includes(PERMISSIONS_TYPE.DELETE_CURVE),
    });
  };

  return (
    <>
      <DataTableHeader
        title="Impressoras"
        breadcrumbs={breadcrumbItems}
        actions={
          permissions.includes(PERMISSIONS_TYPE.CREATE_PRINTER)
            ? [
                <Button onClick={handleCreateClick}>
                  <div className="flex items-center gap-2">
                    <PiPlusBold />
                    <span>Cadastrar impressora</span>
                  </div>
                </Button>,
              ]
            : []
        }
        onSearchChange={(data) => {
          setSearch(data);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
      />
      <DataTable
        columns={columns}
        data={printersResult?.data ?? []}
        pagination={pagination}
        sorting={sorting}
        setSorting={setSorting}
        rowCount={printersResult?.totalCount ?? 0}
        setPagination={setPagination}
        isLoading={isLoading}
      />
    </>
  );
};

export default CustomerPrinterTable;
