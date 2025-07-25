import { useMemo, useState } from "react";
import {
  PaginationState,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";

import { Button, DataTableHeader, IconButton } from "../../../components";
import { PiPlusBold } from "react-icons/pi";
import { BiSolidEdit, BiSolidTrash } from "react-icons/bi";
import { useModal } from "../../../hooks/useModal";
import { useTransports } from "../api/hook";
import CreateTransportModal from "./modals/CreateTransport";
import { Transport } from "../../../types/models/transport";
import EditTransportModal from "./modals/EditTransportModal";
import { formatCpfOrCnpj, formatPhone } from "../../../helpers/formatter";
import DeleteTransportModal from "./modals/DeleteTransportModal";
import { unitAbbrevOptions } from "../../../helpers/options/customer";
import { getLabelFromValue } from "../../../helpers/options/getOptionFromValue";
import { usePermission } from "../../../context/PermissionsContext";
import { PERMISSIONS_TYPE } from "../../../types/models/permissions";
import DataTable from "../../../components/ui/table/data-table/DataTable";

const TransportTable = () => {
  const { permissions }: { permissions: string[] } = usePermission();

  const { openModal, closeModal } = useModal();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: -1,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);
  const [search, setSearch] = useState<string>("");

  const { data: customersResult, isLoading } = useTransports({
    pagination,
    sorting: sorting[0],
    search,
  });

  const handleEditClick = (transport: Transport) => {
    openModal("editTransport", EditTransportModal, {
      selectedTransport: transport,
      onClose: () => closeModal("editTransport"),
    });
  };

  const handleDeleteClick = (transport: Transport) => {
    openModal("deleteTransport", DeleteTransportModal, {
      transport,
      onClose: () => closeModal("deleteTransport"),
    });
  };

  const handleCreateClick = () => {
    openModal("createTransport", CreateTransportModal, {
      onClose: () => closeModal("createTransport"),
    });
  };

  const columns: ColumnDef<Transport>[] = useMemo(() => {
    const baseColumns: ColumnDef<Transport>[] = [
      {
        accessorKey: "fantasyName",
        header: "Nome",
        cell: ({ row }) => (
          <div className="max-w-[180px]">{row.original.fantasyName}</div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Telefone",
        cell: ({ row }) => formatPhone(row.original.phone),
      },
      {
        accessorKey: "cpfCnpj",
        header: "CPF/CNPJ",
        cell: ({ row }) => formatCpfOrCnpj(row.original.cpfCnpj),
      },
      {
        accessorKey: "unit",
        header: "Uni.",
        cell: ({ row }) =>
          getLabelFromValue(row.original.unit, unitAbbrevOptions),
      },
    ];

    if (
      permissions.includes(PERMISSIONS_TYPE.UPDATE_TRANSPORT) ||
      permissions.includes(PERMISSIONS_TYPE.DELETE_TRANSPORT)
    ) {
      baseColumns.push({
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            {permissions.includes(PERMISSIONS_TYPE.UPDATE_TRANSPORT) && (
              <IconButton
                onClick={() => handleEditClick(row.original)}
                icon={
                  <BiSolidEdit size={18} className="text-white outline-none" />
                }
              />
            )}
            {permissions.includes(PERMISSIONS_TYPE.DELETE_TRANSPORT) && (
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions]);

  return (
    <>
      <DataTableHeader
        // title="Transporte"
        actions={
          permissions.includes(PERMISSIONS_TYPE.CREATE_TRANSPORT)
            ? [
                <Button onClick={handleCreateClick}>
                  <div className="flex items-center gap-2">
                    <PiPlusBold />
                    <span>Cadastrar transporte</span>
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
        data={customersResult?.data ?? []}
        pagination={pagination}
        sorting={sorting}
        setSorting={setSorting}
        rowCount={customersResult?.totalCount ?? 0}
        setPagination={setPagination}
        isLoading={isLoading}
      />
    </>
  );
};

export default TransportTable;
