import { useMemo, useState } from "react";
import {
  PaginationState,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { User } from "../../../types/models/user";
import { useUsers } from "../api/hooks";
import { Button, DataTableHeader, IconButton } from "../../../components";
import { PiPlusBold } from "react-icons/pi";
import { BiSolidEdit, BiSolidTrash } from "react-icons/bi";
import EditUserModal from "./modals/EditUserModal";
import DeleteUserModal from "./modals/DeleteUserModal";
import CreateUserModal from "./modals/CreateUserModal";
import { usePermission } from "../../../context/PermissionsContext";
import { PERMISSIONS_TYPE } from "../../../types/models/permissions";
import { useModal } from "../../../hooks/useModal";
import DataTable from "../../../components/ui/table/data-table/DataTable";
import { useNavigate } from "react-router-dom";
import routes from "../../../routes/routes";

const UsersTable = () => {
  const navigate = useNavigate();

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

  console.log(sorting);

  const { data: usersResult, isLoading } = useUsers({
    pagination,
    sorting: sorting[0],
    search,
  });

  const handleEditClick = (user: User) => {
    openModal("editUser", EditUserModal, {
      selectedUser: user,
      onClose: () => closeModal("editUser"),
    });
  };

  const handleDeleteClick = (user: User) => {
    openModal("deleteUser", DeleteUserModal, {
      user,
      onClose: () => closeModal("deleteUser"),
    });
  };

  const openPopupCreate = () => {
    openModal("createUser", CreateUserModal, {
      onClose: () => closeModal("createUser"),
    });
  };

  const columns: ColumnDef<User>[] = useMemo(() => {
    const baseColumns: ColumnDef<User>[] = [
      {
        accessorKey: "group.name",
        header: "Grupo",
      },
      {
        accessorKey: "customer.name",
        header: "Empresa",
      },
      {
        accessorKey: "firstName",
        header: "Nome",
        cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "isApprover",
        header: "Aprovador",
        cell: (info) => (info.getValue() ? "Sim" : "Não"),
      },
    ];

    if (
      permissions.includes(PERMISSIONS_TYPE.UPDATE_USER) ||
      permissions.includes(PERMISSIONS_TYPE.DELETE_USER)
    ) {
      baseColumns.push({
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            {permissions.includes(PERMISSIONS_TYPE.UPDATE_USER) && (
              <IconButton
                onClick={() => handleEditClick(row.original)}
                icon={
                  <BiSolidEdit size={18} className="text-white outline-none" />
                }
              />
            )}
            {permissions.includes(PERMISSIONS_TYPE.DELETE_USER) && (
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
  }, [permissions]);

  return (
    <div className="">
      <DataTableHeader
        // title="Usuários"
        actions={[
          permissions.includes(PERMISSIONS_TYPE.CREATE_USER) && (
            <Button onClick={openPopupCreate} key="create-user">
              <div className="flex items-center gap-2">
                <PiPlusBold />
                <span>Cadastrar usuário</span>
              </div>
            </Button>
          ),
          <Button
            onClick={() => navigate(routes.CHANGE_PASSWORD)}
            key="change-password"
          >
            <div className="flex items-center gap-2">
              <span>Trocar minha senha</span>
            </div>
          </Button>,
        ].filter(Boolean)}
        onSearchChange={(data) => {
          setSearch(data);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
      />
      <DataTable
        columns={columns}
        data={usersResult?.data ?? []}
        pagination={pagination}
        sorting={sorting}
        setSorting={setSorting}
        rowCount={usersResult?.totalCount ?? 0}
        setPagination={setPagination}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UsersTable;
