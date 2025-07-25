"use client";

import { useState } from "react";
import {
  ExpandedState,
  flexRender,
  getExpandedRowModel,
  PaginationState,
  Updater,
  Row,
  SortingState,
} from "@tanstack/react-table";
import { IndeterminateCheckbox } from "../../components/ui/table/components/IndeterminateCheckbox";
import { TableRow } from "../../components/components/ui/table";
import DataTable from "../../components/ui/table/data-table/DataTable";

interface PCPTableProps {
  data: any[];
  rowSelection: any;
  setRowSelection: (value: any) => void;
  columns: any[];
  pagination: PaginationState;
  setPagination: (updater: Updater<PaginationState>) => void;
  rowCount: number;
  sorting: SortingState;
  setSorting: (updater: Updater<SortingState>) => void;
  isLoading?: boolean;
}

const PCPTable: React.FC<PCPTableProps> = ({
  data,
  rowSelection,
  setRowSelection,
  columns,
  pagination,
  setPagination,
  rowCount,
  sorting,
  setSorting,
  isLoading = false,
}) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const hasRowSelection = !isLoading && rowSelection && setRowSelection;

  const extraTableOptions = {
    enableSubRowSelection: false,
    state: {
      expanded,
      rowSelection,
      sorting,
    },
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row: any) => {
      const transformPreviousServiceOrder = (serviceOrder: any) => {
        const previousOrders = [];
        let currentOrder = serviceOrder.previousServiceOrder;
        while (currentOrder) {
          previousOrders.push({
            version: currentOrder.version,
            ...currentOrder,
          });
          currentOrder = currentOrder.previousServiceOrder;
        }
        return previousOrders;
      };

      if (!row?.previousServiceOrder) return false;
      const transformedRow = {
        ...row,
        previousServiceOrders: transformPreviousServiceOrder(row),
      };
      return transformedRow.previousServiceOrders;
    },
  };

  const customRowRender = (row: Row<any>) => {
    const rowData = row.original;

    const isEven = row.index % 2 === 0;
    const bgColor = isEven ? "bg-gray-600" : "bg-gray-700";
    const hoverColor = isEven ? "hover:bg-gray-500" : "hover:bg-gray-500";

    if (rowData.isHeader) {
      const isFirstRow = row.index === 0;

      return (
        <TableRow key={row.id} className="bg-gray-700 text-white">
          <td
            colSpan={columns.length}
            className={`pt-3 text-center ${
              isFirstRow ? "" : "border-t border-t-gray-500"
            }`}
          >
            <span className="font-medium">
              <span className="text-gray-400">Operador:</span>{" "}
              {rowData.firstName} {rowData.lastName}
            </span>
          </td>
        </TableRow>
      );
    }

    return (
      <TableRow key={row.id} className={`${bgColor} ${hoverColor} text-white`}>
        {hasRowSelection ? (
          row.depth ? (
            <td className="text-center pt-0.5 pl-4 w-fit"></td>
          ) : (
            <td className="text-center pt-0.5 pl-4 w-fit">
              <IndeterminateCheckbox
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                indeterminate={row.getIsSomeSelected()}
                onChange={row.getToggleSelectedHandler()}
              />
            </td>
          )
        ) : null}
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id} className="px-3 first:pl-4 py-1.5">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </TableRow>
    );
  };

  const customMobileRowRender = (row: Row<any>) => {
    const rowData = row.original;
    if (rowData.isHeader) {
      return (
        <div
          key={row.id}
          className="bg-gray-700 p-3 text-white rounded border border-gray-600"
        >
          <span className="font-medium">
            <span className="text-gray-400">Operador:</span> {rowData.firstName}{" "}
            {rowData.lastName}
          </span>
        </div>
      );
    }
    return (
      <div
        key={row.id}
        className="bg-gray-600 p-3 text-white rounded border border-gray-600"
      >
        {hasRowSelection && (
          <div className="mb-2 flex items-center">
            <IndeterminateCheckbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        )}
        {row.getVisibleCells().map((cell) => (
          <div key={cell.id} className="mb-2">
            <span className="block text-sm">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      pagination={pagination}
      setPagination={setPagination}
      rowCount={rowCount}
      sorting={sorting}
      setSorting={setSorting}
      isLoading={isLoading}
      customRowRender={customRowRender}
      customMobileRowRender={customMobileRowRender}
      extraTableOptions={extraTableOptions}
    />
  );
};

export default PCPTable;
