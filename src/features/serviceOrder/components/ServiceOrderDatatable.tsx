import React, { useMemo } from "react";
import {
  PaginationState,
  RowSelectionState,
  SortingState,
  Updater,
  ColumnDef,
} from "@tanstack/react-table";
import DataTable from "../../../components/ui/table/data-table/DataTable";

export interface ServiceOrder {
  id: string;
  customer: string;
  date: string;
  status: string;
  previousServiceOrder?: ServiceOrder;
  subRows?: ServiceOrder[];
}

export interface ServiceOrderDataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  pagination: PaginationState;
  rowSelection?: RowSelectionState;
  sorting: SortingState;
  rowCount: number;
  setPagination: (updater: Updater<PaginationState>) => void;
  setRowSelection?: (updater: Updater<RowSelectionState>) => void;
  setSorting: (updater: Updater<SortingState>) => void;
  isLoading: boolean;
}

function ServiceOrderDataTable<T extends { previousServiceOrder?: T }>({
  columns,
  data,
  pagination,
  rowSelection,
  sorting,
  rowCount,
  setPagination,
  setRowSelection,
  setSorting,
  isLoading,
}: ServiceOrderDataTableProps<T>) {
  const transformedData = useMemo((): T[] => {
    const transformPrevious = (order: T): T[] => {
      const result: T[] = [];
      let current = order.previousServiceOrder;
      while (current) {
        result.push(current);
        current = current.previousServiceOrder;
      }
      return result;
    };

    return data.map((order) => {
      if (order.previousServiceOrder) {
        return {
          ...order,
          subRows: transformPrevious(order),
        };
      }
      return order;
    });
  }, [data]);

  return (
    <DataTable
      columns={columns}
      data={transformedData}
      pagination={pagination}
      rowSelection={rowSelection}
      sorting={sorting}
      rowCount={rowCount}
      setPagination={setPagination}
      setRowSelection={setRowSelection}
      setSorting={setSorting}
      isLoading={isLoading}
      showAllOption={false}
    />
  );
}

export default ServiceOrderDataTable;
