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
import { useDieCutBlocks } from "../api/hooks";
import CreateDieCutBlockModal from "./modals/CreateDieCutBlockModal";
import { usePermission } from "../../../context/PermissionsContext";
import { PERMISSIONS_TYPE } from "../../../types/models/permissions";
import { User } from "../../../context/api/PermissionsService";
import EditDieCutBlockModal from "./modals/EditDieCutBlockModal";
import DeleteDieCutBlockModal from "./modals/DeleteDieCutBlockModal";
import { useParams } from "react-router-dom";
import { DieCutBlock } from "../../../types/models/cutomerdiecutblock";
import DataTable from "../../../components/ui/table/data-table/DataTable";

const CustomerDieCutBlocksTable = () => {
  const { permissions }: { permissions: string[]; user: User | null } =
    usePermission();
  const {
    idCustomer: customerId,
    idPrinter: printerId,
    idCylinder: cylinderId,
  } = useParams<{
    idCustomer: string;
    idPrinter: string;
    idCylinder: string;
  }>();
  const idCustomer = customerId ? parseInt(customerId, 10) : null;
  const idPrinter = printerId ? parseInt(printerId, 10) : null;
  const idCylinder = cylinderId ? parseInt(cylinderId, 10) : null;

  const { openModal, closeModal } = useModal();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);
  const [search, setSearch] = useState<string>("");

  if (!idCustomer || !idPrinter || !idCylinder)
    return <div>Usuário não encontrado</div>;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: dieCutBlocksResult, isLoading } = useDieCutBlocks({
    idCustomer,
    pagination,
    sorting: sorting[0],
    search,
    idPrinter,
    idCylinder,
  });

  const handleEditClick = (dieCutBlock: DieCutBlock) => {
    openModal("editDieCutBlock", EditDieCutBlockModal, {
      selectedDieCutBlock: dieCutBlock,
      onClose: () => closeModal("editDieCutBlock"),
      idCustomer,
      idPrinter,
      idCylinder,
    });
  };

  const handleDeleteClick = (dieCutBlock: DieCutBlock) => {
    openModal("deleteDieCutBlock", DeleteDieCutBlockModal, {
      dieCutBlock,
      idCustomer,
      idPrinter,
      idCylinder,
      onClose: () => closeModal("deleteDieCutBlock"),
    });
  };

  const handleCreateClick = () => {
    openModal("createDieCutBlock", CreateDieCutBlockModal, {
      onClose: () => closeModal("createDieCutBlock"),
      idCustomer,
      idPrinter,
      idCylinder,
    });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const columns: ColumnDef<DieCutBlock>[] = useMemo(() => {
    const baseColumns: ColumnDef<DieCutBlock>[] = [
      {
        accessorKey: "distortion",
        header: "Distorção",
        cell: ({ row }) => (
          <div className="max-w-[180px]">{row.original.distortion}</div>
        ),
      },
    ];

    if (
      permissions.includes(PERMISSIONS_TYPE.UPDATE_DIECUTBLOCK) ||
      permissions.includes(PERMISSIONS_TYPE.DELETE_DIECUTBLOCK)
    ) {
      baseColumns.push({
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            {permissions.includes(PERMISSIONS_TYPE.UPDATE_DIECUTBLOCK) && (
              <IconButton
                onClick={() => handleEditClick(row.original)}
                icon={
                  <BiSolidEdit size={18} className="text-white outline-none" />
                }
              />
            )}
            {permissions.includes(PERMISSIONS_TYPE.DELETE_DIECUTBLOCK) && (
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
        title="Facas"
        actions={
          permissions.includes(PERMISSIONS_TYPE.CREATE_DIECUTBLOCK)
            ? [
                <Button onClick={handleCreateClick}>
                  <div className="flex items-center gap-2">
                    <PiPlusBold />
                    <span>Cadastrar facas</span>
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
        data={dieCutBlocksResult?.data ?? []}
        pagination={pagination}
        sorting={sorting}
        setSorting={setSorting}
        rowCount={dieCutBlocksResult?.totalCount ?? 0}
        setPagination={setPagination}
        isLoading={isLoading}
      />
    </>
  );
};

export default CustomerDieCutBlocksTable;
