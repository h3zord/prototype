import { useState } from "react";
import {
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";

interface UseTableStateOptions {
  initialSorting?: SortingState;
}

export function useTableState({ initialSorting }: UseTableStateOptions = {}) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? []);

  const [search, setSearch] = useState<string>("");

  return {
    pagination,
    setPagination,
    rowSelection,
    setRowSelection,
    sorting,
    setSorting,
    search,
    setSearch,
  };
}
