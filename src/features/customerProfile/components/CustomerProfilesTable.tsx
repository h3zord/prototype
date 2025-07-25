import { useMemo, useState } from "react";
import {
  PaginationState,
  SortingState,
  RowSelectionState,
  ColumnDef,
} from "@tanstack/react-table";
import { Button, DataTableHeader, IconButton } from "../../../components";
import { PiPlusBold } from "react-icons/pi";
import { BiSolidEdit, BiSolidTrash } from "react-icons/bi";
import { useModal } from "../../../hooks/useModal";
import { useProfiles } from "../api/hooks";
import CreateProfileModal from "./modals/CreateProfileModal";
import EditProfileModal from "./modals/EditProfileModal";
import DeleteProfileModal from "./modals/DeleteProfileModal";
import { usePermission } from "../../../context/PermissionsContext";
import { PERMISSIONS_TYPE } from "../../../types/models/permissions";
import { User } from "../../../context/api/PermissionsService";
import { ProfilesSchema } from "../api/schemas";
import { useParams } from "react-router-dom";
import DataTable from "../../../components/ui/table/data-table/DataTable";
import { useCustomerFlowBreadcrumbs } from "../../../helpers/breadcrumbs_customers_flow";

type ProfileWithId = ProfilesSchema & { id: string | number };

const CustomerProfilesTable = () => {
  const { permissions }: { permissions: string[]; user: User | null } =
    usePermission();
  const { idCustomer, idPrinter } = useParams<{
    idCustomer: string;
    idPrinter: string;
  }>();

  const { openModal, closeModal } = useModal();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);
  const [search, setSearch] = useState<string>("");
  const breadcrumbItems = useCustomerFlowBreadcrumbs();

  const idCustomerNumber = idCustomer ? parseInt(idCustomer, 10) : null;
  const idPrinterNumber = idPrinter ? parseInt(idPrinter, 10) : null;

  const { data: profilesResult, isLoading } = useProfiles({
    idCustomer: idCustomerNumber!,
    idPrinter: idPrinterNumber!,
    pagination,
    sorting: sorting[0],
    search,
  });

  // console.log(profilesResult);

  const columns: ColumnDef<ProfileWithId>[] = useMemo(() => {
    const baseColumns: ColumnDef<ProfileWithId>[] = [
      {
        accessorKey: "name",
        header: "Nome",
        cell: ({ row }) => (
          <div className="max-w-[180px]">{row.original.name}</div>
        ),
      },
    ];

    if (
      permissions.includes(PERMISSIONS_TYPE.UPDATE_PROFILE) ||
      permissions.includes(PERMISSIONS_TYPE.DELETE_PROFILE)
    ) {
      baseColumns.push({
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            {permissions.includes(PERMISSIONS_TYPE.UPDATE_PROFILE) && (
              <IconButton
                onClick={() => handleEditClick(row.original)}
                icon={
                  <BiSolidEdit size={18} className="text-white outline-none" />
                }
              />
            )}
            {permissions.includes(PERMISSIONS_TYPE.DELETE_PROFILE) && (
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
  }, [permissions, openModal, closeModal, idCustomerNumber, idPrinterNumber]);

  if (!idCustomerNumber || !idPrinterNumber)
    return <div>Perfil não encontrado</div>;

  const handleEditClick = (profile: ProfileWithId) => {
    openModal("editProfile", EditProfileModal, {
      selectedProfile: profile,
      onClose: () => closeModal("editProfile"),
      idCustomer: idCustomerNumber,
      idPrinter: idPrinterNumber,
    });
  };

  const handleDeleteClick = (profile: ProfileWithId) => {
    openModal("deleteProfile", DeleteProfileModal, {
      profile,
      idCustomer: idCustomerNumber,
      idPrinter: idPrinterNumber,
      onClose: () => closeModal("deleteProfile"),
    });
  };

  const handleCreateClick = () => {
    openModal("createProfile", CreateProfileModal, {
      onClose: () => closeModal("createProfile"),
      idCustomer: idCustomerNumber,
      idPrinter: idPrinterNumber,
    });
  };

  // const handleDeleteClick = (profile: ProfileWithId) => {
  //   openModal("deleteProfile", DeleteProfileModal, {
  //     profile,
  //     idCustomer: idCustomerNumber,
  //     idPrinter: idPrinterNumber,
  //     onClose: () => closeModal("deleteProfile"),
  //   });
  // };

  // const handleCreateClick = () => {
  //   openModal("createProfile", CreateProfileModal, {
  //     onClose: () => closeModal("createProfile"),
  //     idCustomer: idCustomerNumber,
  //     idPrinter: idPrinterNumber,
  //   });
  // };

  const data: ProfileWithId[] =
    profilesResult?.data.map((profile, index) => ({
      ...profile,
      id: (profile as any).id ?? index,
    })) || [];

  // console.log(data);

  return (
    <>
      <DataTableHeader
        title="Perfis"
        breadcrumbs={breadcrumbItems}
        actions={
          permissions.includes(PERMISSIONS_TYPE.CREATE_PROFILE)
            ? [
                <Button key="createProfile" onClick={handleCreateClick}>
                  <div className="flex items-center gap-2">
                    <PiPlusBold />
                    <span>Cadastrar perfil</span>
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
        data={data}
        pagination={pagination}
        // rowSelection={rowSelection}
        sorting={sorting}
        setSorting={setSorting}
        rowCount={profilesResult?.totalCount ?? 0}
        setPagination={setPagination}
        // setRowSelection={setRowSelection}
        isLoading={isLoading}
      />
    </>
  );
};

export default CustomerProfilesTable;
