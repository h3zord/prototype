"use client";

import { useState } from "react";
import {
  ExpandedState,
  flexRender,
  getExpandedRowModel,
  Row,
  type PaginationState,
  type SortingState,
  type RowSelectionState,
  type ColumnDef,
} from "@tanstack/react-table";
import { IndeterminateCheckbox } from "../../components/ui/table/components/IndeterminateCheckbox";
import { TableRow } from "../../components/components/ui/table";
import DataTable from "../../components/ui/table/data-table/DataTable";

interface DeliveriesOfTheDayTableProps {
  data: any[];
  rowSelection: RowSelectionState;
  setRowSelection: (
    updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)
  ) => void;
  columns: ColumnDef<any>[];
  pagination: PaginationState;
  setPagination: (
    updater: PaginationState | ((old: PaginationState) => PaginationState)
  ) => void;
  sorting: SortingState;
  setSorting: (
    updater: SortingState | ((old: SortingState) => SortingState)
  ) => void;
  rowCount: number;
  isLoading?: boolean;
}

const DeliveriesOfTheDayTable = ({
  data,
  rowSelection,
  setRowSelection,
  columns,
  pagination,
  setPagination,
  sorting,
  setSorting,
  rowCount,
  isLoading = false,
}: DeliveriesOfTheDayTableProps) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const hasRowSelection = !isLoading && rowSelection && setRowSelection;

  const extraTableOptions = {
    enableSubRowSelection: false,
    state: { expanded, rowSelection },
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

  const customRowRender = (
    row: Row<any>,
    _tableInstance: ReturnType<
      typeof import("@tanstack/react-table").useReactTable<any>
    >
  ) => {
    const rowData = row.original;
    if (rowData.isHeader) {
      return (
        <TableRow key={row.id} className="bg-gray-700 text-white">
          <td
            colSpan={columns.length + (hasRowSelection ? 1 : 0)}
            className="pt-3 text-center border-t border-t-gray-500"
          >
            <span className="font-medium">
              <span className="text-gray-400">Transporte:</span>{" "}
              {rowData.fantasyName}
            </span>
          </td>
        </TableRow>
      );
    }

    const isEven = row.index % 2 === 0;
    const bgColor = isEven ? "bg-gray-600" : "bg-gray-700";
    const hoverColor = isEven ? "hover:bg-gray-500" : "hover:bg-gray-500";

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

  const customMobileRowRender = (
    row: Row<any>,
    _tableInstance: ReturnType<
      typeof import("@tanstack/react-table").useReactTable<any>
    >
  ) => {
    const rowData = row.original;
    if (rowData.isHeader) {
      return (
        <div
          key={row.id}
          className="bg-gray-700 p-3 text-white rounded border border-gray-600"
        >
          <span className="font-medium">
            <span className="text-gray-400">Transporte:</span>{" "}
            {rowData.fantasyName}
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
      pagination={pagination}
      rowSelection={rowSelection}
      sorting={sorting}
      rowCount={rowCount}
      setPagination={setPagination}
      setRowSelection={setRowSelection}
      setSorting={setSorting}
      isLoading={isLoading}
      customRowRender={customRowRender}
      customMobileRowRender={customMobileRowRender}
      extraTableOptions={extraTableOptions}
    />
  );
};

export default DeliveriesOfTheDayTable;
