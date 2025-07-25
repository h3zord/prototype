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
import { useCylinders } from "../api/hooks";
import { Cylinder } from "../../../types/models/customercylinder";
import { usePermission } from "../../../context/PermissionsContext";
import { PERMISSIONS_TYPE } from "../../../types/models/permissions";
import DeleteCylinderModal from "./modals/DeleteCylinderModal";
import { useParams } from "react-router-dom";
import CreateCylinderModal from "./modals/CreateCylinderModal";
import EditCylinderModal from "./modals/EditCylinderModel";
import DataTable from "../../../components/ui/table/data-table/DataTable";
import { useCustomerFlowBreadcrumbs } from "../../../helpers/breadcrumbs_customers_flow";

type RouteParams = {
  idCustomer: string;
  idPrinter: string;
};

const CustomerCylindersTable = () => {
  const { permissions }: { permissions: string[] } = usePermission();
  const { idCustomer, idPrinter } = useParams<RouteParams>();

  const breadcrumbItems = useCustomerFlowBreadcrumbs();
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

  const customerId = idCustomer ? parseInt(idCustomer, 10) : null;
  const printerId = idPrinter ? parseInt(idPrinter, 10) : null;

  const columns: ColumnDef<Cylinder>[] = useMemo(() => {
    const baseColumns: ColumnDef<Cylinder>[] = [
      {
        accessorKey: "id",
        header: "Id",
        cell: ({ row }) => (
          <div className="max-w-[180px]">{row.original.id}</div>
        ),
      },
      {
        accessorKey: "cylinder",
        header: "Cilindro",
        cell: ({ row }) => (
          <div className="max-w-[180px]">{row.original.cylinder} mm</div>
        ),
      },
      {
        accessorKey: "polyesterMaxHeight",
        header: "Poliéster Alt. Máx",
        cell: ({ row }) => (
          <div className="max-w-[180px]">
            {row.original.polyesterMaxHeight} mm
          </div>
        ),
      },
      {
        accessorKey: "clicheMaxWidth",
        header: "Clichê Lar. Máx",
        cell: ({ row }) => (
          <div className="max-w-[180px]">{row.original.clicheMaxWidth} mm</div>
        ),
      },
      {
        accessorKey: "distortion",
        header: "Distorção do Clichê",
        cell: ({ row }) => (
          <div className="max-w-[180px]">{row.original.distortion} %</div>
        ),
      },
      {
        accessorKey: "dieCutBlockDistortion",
        header: "Distorção da Forma",
        cell: ({ row }) => (
          <div className="max-w-[180px]">
            {row.original.dieCutBlockDistortion} %
          </div>
        ),
      },
    ];

    if (
      permissions.includes(PERMISSIONS_TYPE.UPDATE_CYLINDER) ||
      permissions.includes(PERMISSIONS_TYPE.DELETE_CYLINDER)
    ) {
      baseColumns.push({
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            {permissions.includes(PERMISSIONS_TYPE.UPDATE_CYLINDER) && (
              <IconButton
                onClick={() => handleEditClick(row.original)}
                icon={
                  <BiSolidEdit size={18} className="text-white outline-none" />
                }
              />
            )}
            {permissions.includes(PERMISSIONS_TYPE.DELETE_CYLINDER) && (
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
  }, [permissions, openModal, closeModal, customerId, printerId]);

  const { data: cylindersResult, isLoading } = useCylinders({
    idCustomer: customerId!,
    idPrinter: printerId!,
    pagination,
    sorting: sorting[0],
    search,
  });

  if (!customerId || !printerId) {
    return <p>Parâmetros inválidos ou não encontrados.</p>;
  }

  const handleEditClick = (selectedCylinder: Cylinder) => {
    openModal("editCylinder", EditCylinderModal, {
      onClose: () => closeModal("editCylinder"),
      selectedCylinder,
      idCustomer: customerId,
      idPrinter: printerId,
    });
  };

  const handleDeleteClick = (selectedCylinder: Cylinder) => {
    openModal("deleteCylinder", DeleteCylinderModal, {
      cylinder: selectedCylinder,
      idCustomer: customerId,
      idPrinter: printerId,
      onClose: () => closeModal("deleteCylinder"),
    });
  };

  const handleCreateClick = () => {
    openModal("createCylinder", CreateCylinderModal, {
      onClose: () => closeModal("createCylinder"),
      idCustomer: customerId,
      idPrinter: printerId,
    });
  };

  return (
    <>
      <DataTableHeader
        title="Cilindros"
        breadcrumbs={breadcrumbItems}
        actions={
          permissions.includes(PERMISSIONS_TYPE.CREATE_CYLINDER)
            ? [
                <Button onClick={handleCreateClick} key="create-cylinder-btn">
                  <div className="flex items-center gap-2">
                    <PiPlusBold />
                    <span>Cadastrar cilindro</span>
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
        data={cylindersResult?.data ?? []}
        pagination={pagination}
        sorting={sorting}
        setSorting={setSorting}
        rowCount={cylindersResult?.totalCount ?? 0}
        setPagination={setPagination}
        isLoading={isLoading}
      />
    </>
  );
};

export default CustomerCylindersTable;
