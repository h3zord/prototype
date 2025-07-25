import { useMemo, useState } from "react";
import {
  PaginationState,
  SortingState,
  ColumnDef,
  Updater,
} from "@tanstack/react-table";
import { Button, DataTableHeader } from "../../../components";
import DataTable from "../../../components/ui/table/data-table/DataTable";
import { PiPlusBold } from "react-icons/pi";
import { BiSolidEdit, BiSolidTrash } from "react-icons/bi";
import { HiPrinter } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useModal } from "../../../hooks/useModal";
import { useCustomers } from "../api/hooks";
import { Customer, CustomerType } from "../../../types/models/customer";

type TableCustomer = Customer & { isHeader: boolean };
import { getLabelFromValue } from "../../../helpers/options/getOptionFromValue";
import { unitAbbrevOptions } from "../../../helpers/options/customer";
import { usePermission } from "../../../context/PermissionsContext";
import { PERMISSIONS_TYPE } from "../../../types/models/permissions";
import {
  formatCpfOrCnpj,
  formatCustomerType,
  formatPhone,
} from "../../../helpers/formatter";
import DeleteCustomerModal from "./modals/DeleteCustomerModal";
import ShowMorePrices from "./ShowMorePrices";
import UpsertCustomerModal from "./modals/UpsertCustomerModal";
import UpsertExternalCustomerModal from "./modals/UpsertExternalCustomerModal";
import * as XLSX from "xlsx";

const CustomersTable = () => {
  const { permissions }: { permissions: string[] } = usePermission();
  const { openModal, closeModal } = useModal();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: -1,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [search, setSearch] = useState("");
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const updatePagination = (updater: Updater<PaginationState>) => {
    setPagination((prev) =>
      typeof updater === "function"
        ? (updater as (prevState: PaginationState) => PaginationState)(prev)
        : updater,
    );
  };

  const updateSorting = (updater: Updater<SortingState>) => {
    setSorting((prev) =>
      typeof updater === "function"
        ? (updater as (prevState: SortingState) => SortingState)(prev)
        : updater,
    );
  };

  const { data: customersResult, isLoading } = useCustomers({
    pagination,
    sorting: sorting[0],
    search,
  });

  const tableData = useMemo(
    () =>
      customersResult?.data.map((customer) => ({
        ...customer,
        isHeader: false,
      })) ?? [],
    [customersResult?.data],
  );

  const handleEditClick = (customer: Customer) => {
    openModal("editCustomer", UpsertCustomerModal, {
      selectedCustomer: customer,
      title: "Editar Cliente",
      submitText: "Editar cliente",
      onClose: () => closeModal("editCustomer"),
    });
  };

  const handleEditExternalCustomerClick = (customer: Customer) => {
    openModal("editExternalCustomer", UpsertExternalCustomerModal, {
      selectedCustomer: customer,
      title: "Editar Cliente Externo",
      submitText: "Editar cliente externo",
      onClose: () => closeModal("editExternalCustomer"),
    });
  };

  const handleDeleteClick = (customer: Customer) => {
    openModal("deleteCustomer", DeleteCustomerModal, {
      customer,
      onClose: () => closeModal("deleteCustomer"),
    });
  };

  const handleCreateClick = () => {
    openModal("createCustomer", UpsertCustomerModal, {
      title: "Cadastrar Cliente",
      submitText: "Cadastrar cliente",
      onClose: () => closeModal("createCustomer"),
    });
  };

  const handleCreateExternalCustomerClick = () => {
    openModal("createExternalCustomer", UpsertExternalCustomerModal, {
      title: "Cadastrar Cliente Externo",
      submitText: "Cadastrar cliente externo",
      onClose: () => closeModal("createExternalCustomer"),
    });
  };

  const handleExportToExcel = () => {
    console.log("rowSelection:", rowSelection);

    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key],
    );

    if (selectedRows.length === 0) {
      alert("Nenhum cliente selecionado para exportação");
      return;
    }

    if (!customersResult?.data) {
      alert("Nenhum dado disponível para exportação");
      return;
    }

    // Mapear os IDs selecionados para os dados reais
    const selectedCustomers = selectedRows
      .map((rowId) => {
        // O rowId pode ser o índice ou um ID único, vamos tentar ambos
        const rowIndex = parseInt(rowId);
        let customer: Customer | undefined = customersResult.data[rowIndex];

        // Se não encontrou pelo índice, procurar pelo ID
        if (!customer) {
          customer = customersResult.data.find(
            (c, index) => String(index) === rowId || String(c.id) === rowId,
          );
        }

        console.log(
          "Accessing rowId:",
          rowId,
          "rowIndex:",
          rowIndex,
          "Customer:",
          customer,
        );
        return customer;
      })
      .filter((customer): customer is Customer => customer !== undefined);

    console.log("selectedCustomers:", selectedCustomers);

    if (selectedCustomers.length === 0) {
      alert("Erro ao localizar os clientes selecionados para exportação");
      return;
    }

    const exportData = selectedCustomers.map((customer) => ({
      Cliente: customer.fantasyName?.length
        ? customer.fantasyName
        : customer.name,
      "CNPJ/CPF": formatCpfOrCnpj(customer.cpfCnpj, "-"),
      Telefone: formatPhone(customer.phone),
      "Email NFE": customer.nfeEmail || "",
      "Email Financeiro": customer.financialEmail || "",
      Contato: customer.generalEmail || "",
      Transporte: customer.transport?.fantasyName || "-",
      Representante:
        customer.representative?.firstName || customer.representative?.lastName
          ? `${customer.representative?.firstName || ""} ${
              customer.representative?.lastName || ""
            }`.trim()
          : "-",
      Unidade: customer.unit
        ? getLabelFromValue(customer.unit, unitAbbrevOptions)
        : "-",
      Tipo: formatCustomerType(customer.type),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();

    // Definir larguras das colunas
    const colWidths = [
      { wch: 30 }, // Cliente
      { wch: 18 }, // CNPJ/CPF
      { wch: 16 }, // Telefone
      { wch: 25 }, // Email NFE
      { wch: 25 }, // Email Financeiro
      { wch: 25 }, // Email Geral
      { wch: 20 }, // Transporte
      { wch: 25 }, // Representante
      { wch: 12 }, // Unidade
      { wch: 15 }, // Tipo
    ];

    ws["!cols"] = colWidths;

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, "Clientes");

    // Gerar nome do arquivo com data atual
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");
    const fileName = `clientes_selecionados_${dateStr}.xlsx`;

    // Fazer download do arquivo
    XLSX.writeFile(wb, fileName);
  };

  const columns: ColumnDef<TableCustomer>[] = useMemo(() => {
    const baseColumns: ColumnDef<TableCustomer>[] = [
      {
        accessorKey: "name",
        header: "Cliente",
        cell: ({ row }) => (
          <div className="max-w-[180px]">
            {row.original.fantasyName?.length
              ? row.original.fantasyName
              : row.original.name}
          </div>
        ),
      },
      {
        accessorKey: "cpfCnpj",
        header: "CNPJ/CPF",
        cell: ({ row }) => formatCpfOrCnpj(row.original.cpfCnpj, "-"),
      },
      {
        accessorKey: "phone",
        header: "Telefone",
        cell: ({ row }) => formatPhone(row.original.phone),
      },
      {
        accessorKey: "nfeEmail",
        header: "Email NFE",
        cell: ({ row }) => {
          const email = row.original.nfeEmail;
          return (
            <div className="truncate max-w-[150px]" title={email}>
              {email}
            </div>
          );
        },
      },
      {
        accessorKey: "financialEmail",
        header: "Email FIN.",
        cell: ({ row }) => {
          const email = row.original.financialEmail;
          return (
            <div className="truncate max-w-[150px]" title={email}>
              {email}
            </div>
          );
        },
      },
      {
        accessorKey: "generalEmail",
        header: "Contato",
        cell: ({ row }) => {
          const email = row.original.generalEmail;
          return (
            <div className="truncate max-w-[150px]" title={email ?? undefined}>
              {email}
            </div>
          );
        },
      },
      {
        accessorKey: "transport.fantasyName",
        header: "Transporte",
        cell: ({ row }) => (
          <div>{row.original?.transport?.fantasyName ?? "-"}</div>
        ),
      },
      {
        accessorKey: "representative.name",
        header: "Representante",
        cell: ({ row }) => (
          <div>
            {row.original?.representative?.firstName ||
            row.original?.representative?.lastName
              ? `${row.original?.representative?.firstName} ${row.original?.representative?.lastName}`
              : "-"}
          </div>
        ),
      },
      {
        enableSorting: false,
        header: "Preços",
        cell: ({ row }) => <ShowMorePrices customer={row.original} />,
      },
      {
        accessorKey: "unit",
        header: "Uni.",
        cell: ({ row }) =>
          row.original.unit
            ? getLabelFromValue(row.original.unit, unitAbbrevOptions)
            : "-",
      },
      {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }) => <div>{formatCustomerType(row.original.type)}</div>,
      },
    ];

    if (
      permissions.includes(PERMISSIONS_TYPE.UPDATE_CUSTOMER) ||
      permissions.includes(PERMISSIONS_TYPE.DELETE_CUSTOMER) ||
      permissions.includes(PERMISSIONS_TYPE.CREATE_PRINTER) ||
      permissions.includes(PERMISSIONS_TYPE.UPDATE_PRINTER) ||
      permissions.includes(PERMISSIONS_TYPE.DELETE_PRINTER)
    ) {
      baseColumns.push({
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            {(permissions.includes(PERMISSIONS_TYPE.CREATE_PRINTER) ||
              permissions.includes(PERMISSIONS_TYPE.UPDATE_PRINTER) ||
              permissions.includes(PERMISSIONS_TYPE.DELETE_PRINTER)) && (
              <>
                {row.original.type !== CustomerType.EXTERNAL && (
                  <Link
                    className="flex items-center space-x-3"
                    to={`/customer/${row.original.id}/printer`}
                  >
                    <HiPrinter size={18} className="text-white" />
                  </Link>
                )}
              </>
            )}
            {permissions.includes(PERMISSIONS_TYPE.UPDATE_CUSTOMER) && (
              <BiSolidEdit
                onClick={() =>
                  row.original.type === CustomerType.EXTERNAL
                    ? handleEditExternalCustomerClick(row.original)
                    : handleEditClick(row.original)
                }
                size={18}
                className="text-white cursor-pointer"
              />
            )}
            {permissions.includes(PERMISSIONS_TYPE.DELETE_CUSTOMER) && (
              <BiSolidTrash
                onClick={() => handleDeleteClick(row.original)}
                size={18}
                className="text-white cursor-pointer"
              />
            )}
          </div>
        ),
      });
    }
    return baseColumns;
  }, [permissions]);

  const selectedRowsCount = Object.keys(rowSelection).filter(
    (key) => rowSelection[key],
  ).length;

  console.log("Current rowSelection:", rowSelection);
  console.log("Selected rows count:", selectedRowsCount);

  return (
    <>
      <DataTableHeader
        // title="Clientes"
        actions={
          permissions.includes(PERMISSIONS_TYPE.CREATE_CUSTOMER)
            ? [
                <Button key="create" onClick={handleCreateClick}>
                  <div className="flex items-center gap-2">
                    <PiPlusBold />
                    <span>Cadastrar cliente</span>
                  </div>
                </Button>,
                <Button
                  key="createExternal"
                  onClick={handleCreateExternalCustomerClick}
                >
                  <div className="flex items-center gap-2">
                    <PiPlusBold />
                    <span>Cadastrar cliente externo</span>
                  </div>
                </Button>,
              ]
            : []
        }
        onSearchChange={(data) => {
          setSearch(data);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
        onExportClick={selectedRowsCount > 0 ? handleExportToExcel : undefined}
        exportLabel={
          selectedRowsCount > 0
            ? `Exportar selecionados (${selectedRowsCount})`
            : undefined
        }
      />
      <DataTable
        columns={columns}
        data={tableData}
        pagination={pagination}
        sorting={sorting}
        rowCount={customersResult?.totalCount ?? 0}
        setPagination={updatePagination}
        setSorting={updateSorting}
        isLoading={isLoading}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </>
  );
};

export default CustomersTable;
