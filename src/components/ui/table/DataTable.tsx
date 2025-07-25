import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  flexRender,
  Updater,
  RowSelectionState,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import Pagination from "./components/Pagination";
import PageSizeSelect from "./components/PageSizeSelect";
import { HiChevronDown, HiChevronUp, HiChevronUpDown } from "react-icons/hi2";
import { IndeterminateCheckbox } from "./components/IndeterminateCheckbox";
import { ColumnDivider } from "./components/ColumnDivider";
import { SkeletonRow } from "./components/SkeletonRow";

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  pagination: PaginationState;
  rowSelection?: RowSelectionState;
  sorting: SortingState;
  rowCount: number;
  setPagination: (pagination: Updater<PaginationState>) => void;
  setRowSelection?: (rowSelection: Updater<RowSelectionState>) => void;
  setSorting: (sorting: Updater<SortingState>) => void;
  isLoading: boolean;
}

const DataTable = <T,>({
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
}: DataTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    rowCount,
    state: {
      pagination,
      rowSelection,
      sorting,
    },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    enableRowSelection: !!(rowSelection && setRowSelection),
    manualSorting: true,
  });
  // console.log(isIndeterminateCheckbox);
  const hasRowSelection = !isLoading && rowSelection && setRowSelection;

  return (
    <>
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full border-separate border-spacing-y-3 table-auto rounded-b bg-gray-700">
          <thead className="text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {hasRowSelection ? (
                  <th className="text-center color-black pt-0.5 pl-4 w-[30px]">
                    <IndeterminateCheckbox
                      {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                      }}
                    />
                  </th>
                ) : null}
                {headerGroup.headers.map((header, index, headersArray) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`relative font-normal text-left px-3 first:pl-4`}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "flex items-center justify-between cursor-pointer select-none"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: (
                            <span className="">
                              <HiChevronUp />
                            </span>
                          ),
                          desc: (
                            <span className="">
                              <HiChevronDown />
                            </span>
                          ),
                          false: header.column.getCanSort() ? (
                            <span className="">
                              <HiChevronUpDown />
                            </span>
                          ) : null,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                    <ColumnDivider isLast={headersArray.length - 1 === index} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              Array(table.getState().pagination.pageSize)
                .fill(null)
                .map((_, index) => (
                  <SkeletonRow key={index} columns={columns} />
                ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-3 text-white"
                >
                  Nenhum resultado encontrado
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="bg-gray-600 text-white">
                  {hasRowSelection ? (
                    <td className="text-center pt-0.5 pl-4 w-fit">
                      <IndeterminateCheckbox
                        {...{
                          checked: row.getIsSelected(),
                          disabled: !row.getCanSelect(),
                          indeterminate: row.getIsSomeSelected(),
                          onChange: row.getToggleSelectedHandler(),
                        }}
                      />
                    </td>
                  ) : null}
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 first:pl-4 py-1.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end items-center gap-4">
        <div>
          Mostrando{" "}
          {Math.min(
            table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              table.getRowModel().rows.length,
            rowCount,
          )}{" "}
          de {rowCount.toLocaleString()}
        </div>
        <PageSizeSelect
          pageSize={table.getState().pagination.pageSize}
          options={[10, 20, 30, 40, 50]}
          onChange={(newPageSize) => table.setPageSize(newPageSize)}
        />
        <Pagination
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          onPageChange={(page) => table.setPageIndex(page - 1)}
        />
      </div>
    </>
  );
};

export default DataTable;
