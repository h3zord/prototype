"use client";

import { useEffect, useState, useRef } from "react";
import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  flexRender,
  Updater,
  RowSelectionState,
  SortingState,
  ColumnDef,
  HeaderContext,
  Row,
} from "@tanstack/react-table";
import { HiChevronDown, HiChevronUp, HiChevronUpDown } from "react-icons/hi2";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "../../../components/ui/table";
import { ColumnDivider } from "../components/ColumnDivider";
import { SkeletonRow } from "../components/SkeletonRow";
import { IndeterminateCheckbox } from "../components/IndeterminateCheckbox";
import PageSizeSelect from "../components/PageSizeSelect";
import Pagination from "../components/Pagination";
import { formatPrice } from "../../../../helpers/formatter";

interface DataTableProps<T extends { id: string | number }> {
  columns: ColumnDef<T>[];
  data: T[];
  pagination: PaginationState;
  rowSelection?: RowSelectionState;
  sorting: SortingState;
  rowCount: number;
  totalPrice?: number;
  clicheCorrugatedTotalPrice?: number;
  diecutblockTotalPrice?: number;
  osNumber?: number;
  totalInvoice?: number;
  metragemCliche?: number;
  metragemForma?: number;
  setSorting: (updater: Updater<SortingState>) => void;
  setPagination: (updater: Updater<PaginationState>) => void;
  setRowSelection?: (updater: Updater<RowSelectionState>) => void;
  isLoading: boolean;
  showAllOption?: boolean;
  customRowRender?: (
    row: Row<T>,
    table: ReturnType<typeof useReactTable<T>>
  ) => JSX.Element;
  customMobileRowRender?: (
    row: Row<T>,
    table: ReturnType<typeof useReactTable<T>>
  ) => JSX.Element;
  extraTableOptions?: Partial<
    Omit<
      Parameters<typeof useReactTable<T>>[0],
      | "data"
      | "columns"
      | "getRowId"
      | "rowCount"
      | "state"
      | "onPaginationChange"
      | "onRowSelectionChange"
      | "onSortingChange"
      | "getCoreRowModel"
      | "manualPagination"
      | "manualSorting"
      | "enableRowSelection"
    >
  > & { state?: Partial<{ [key: string]: any }> };
}

const DataTable = <
  T extends {
    isHeader: boolean;
    id: string | number;
  },
>({
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
  customRowRender,
  customMobileRowRender,
  extraTableOptions,
  totalPrice,
  clicheCorrugatedTotalPrice,
  diecutblockTotalPrice,
  totalInvoice,
  metragemCliche,
  osNumber = 0,
  metragemForma,
  showAllOption = true,
}: DataTableProps<T>) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showingAll, setShowingAll] = useState<boolean>(false);
  const [tableHeight, setTableHeight] = useState<string>("600px");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    const calculateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const availableHeight = window.innerHeight - rect.top - 120;
        const minHeight = 400;
        const maxHeight = 800;
        const height = Math.max(
          minHeight,
          Math.min(availableHeight, maxHeight)
        );
        setTableHeight(`${height}px`);
      }
    };
    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  // useEffect(() => {
  //   setShowingAll(showAllOption && pagination.pageSize >= rowCount);
  // }, [pagination.pageSize, rowCount, showAllOption]);

  useEffect(() => {
    setShowingAll(
      showAllOption &&
        (pagination.pageSize >= rowCount || pagination.pageSize === -1)
    );
  }, [pagination.pageSize, rowCount, showAllOption]);

  useEffect(() => {
    if (!showAllOption && pagination.pageSize >= rowCount) {
      setPagination((prev) => ({ ...prev, pageSize: 10, pageIndex: 0 }));
    }
  }, [showAllOption]);

  useEffect(() => {
    // Se o pageSize inicial for -1 e showAllOption estiver habilitado,
    // configure para mostrar todos os registros
    if (pagination.pageSize === -1 && showAllOption && rowCount > 0) {
      setPagination((prev) => ({
        ...prev,
        pageSize: rowCount,
      }));
      setShowingAll(true);
    }
  }, [rowCount, showAllOption]); // Adicione este useEffect

  const table = useReactTable<T>({
    data,
    columns,
    getRowId: (row) => row.id.toString(),
    rowCount,
    state: {
      pagination,
      rowSelection,
      sorting,
      ...(extraTableOptions?.state || {}),
    },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    enableRowSelection: !!(rowSelection && setRowSelection),
    ...extraTableOptions,
  });

  const hasRowSelection = !isLoading && rowSelection && setRowSelection;
  const headerGroups = table.getHeaderGroups();
  const rowModel = table.getRowModel().rows;
  const totalColumns =
    (hasRowSelection ? 1 : 0) +
    (headerGroups[0]?.headers.length ?? columns.length);

  const orderCount = rowModel.filter(
    (row) => row.original?.isHeader !== true
  ).length;

  // const handlePageSizeChange = (newPageSize: number) => {
  //   if (newPageSize === -1 && showAllOption) {
  //     table.setPageSize(rowCount);
  //     table.setPageIndex(0);
  //     setShowingAll(true);
  //   } else {
  //     table.setPageSize(newPageSize);
  //     setShowingAll(false);
  //   }
  // };

  const handlePageSizeChange = (newPageSize: number) => {
    if (newPageSize === -1 && showAllOption) {
      table.setPageSize(rowCount);
      table.setPageIndex(0);
      setShowingAll(true);
    } else {
      table.setPageSize(newPageSize);
      setShowingAll(false);
    }
  };

  const formatMetragemForma = (value?: number) => {
    if (!value || value === 0) return "-";
    return `${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} m`;
  };

  const formatMetragemCliche = (value?: number) => {
    if (!value || value === 0) return "-";
    return `${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} m²`;
  };

  const pageSizeOptions = showAllOption
    ? [10, 20, 30, 40, 50, -1]
    : [10, 20, 30, 40, 50];

  const defaultDesktopRowRender = (row: Row<T>) => {
    const isEven = row.index % 2 === 0;
    const bgColor = isEven ? "bg-gray-600" : "bg-gray-700";
    const hoverColor = isEven ? "hover:bg-gray-500" : "hover:bg-gray-500";

    return (
      <TableRow
        key={row.id}
        className={`${bgColor} ${hoverColor} text-white text-[10px] border-b-1 border-gray-100`}
      >
        {hasRowSelection && (
          <TableCell className="text-center align-middle pl-1 w-[25px]">
            <IndeterminateCheckbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </TableCell>
        )}
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            className="px-1 first:pl-2 align-middle text-left text-[10px] break-words"
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const hasAnyTotal =
    totalPrice !== undefined ||
    metragemCliche !== undefined ||
    metragemForma !== undefined;

  const defaultMobileRowRender = (row: Row<T>) => (
    <div
      key={row.id}
      className="bg-gray-700 border border-gray-600 rounded-lg shadow p-4 text-white"
    >
      {hasRowSelection && (
        <div className="mb-2 flex items-center">
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
          <span className="ml-2 font-medium">Selecionado</span>
        </div>
      )}
      {row.getVisibleCells().map((cell) => (
        <div key={cell.id} className="mb-2">
          <span className="block text-[12px] font-medium">
            {flexRender(
              cell.column.columnDef.header,
              cell.getContext() as unknown as HeaderContext<T, unknown>
            )}
          </span>
          <span className="block text-[12px]">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4" ref={containerRef}>
      {!isMobile ? (
        <div
          className="relative h-screen flex flex-col border border-gray-600 rounded-lg bg-gray-700"
          style={{
            height: "calc(100vh - 16rem)",
            minHeight: 600,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <div style={{ flex: 1, overflow: "auto" }}>
              <Table className="w-full overflow-x-auto table-auto">
                <TableHeader className="sticky top-0 z-10 bg-gray-700 overflow-x-auto text-white border">
                  {headerGroups.map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {hasRowSelection && (
                        <TableHead className="flex items-center overflow-x-auto justify-center p-3 text-black text-[12px]">
                          <IndeterminateCheckbox
                            checked={table.getIsAllRowsSelected()}
                            indeterminate={table.getIsSomeRowsSelected()}
                            onChange={table.getToggleAllRowsSelectedHandler()}
                          />
                        </TableHead>
                      )}
                      {headerGroup.headers.map(
                        (header, index, headersArray) => (
                          <TableHead
                            key={header.id}
                            colSpan={header.colSpan}
                            className="relative font-normal overflow-x-auto p-2 align-middle text-left text-[12px] break-words border-r-gray-600 border-r-[1px] last:border-r-0"
                          >
                            {!header.isPlaceholder && (
                              <div
                                className={
                                  header.column.getCanSort()
                                    ? "flex items-center justify-between overflow-x-auto cursor-pointer select-none"
                                    : ""
                                }
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext() as unknown as HeaderContext<
                                    T,
                                    unknown
                                  >
                                )}
                                {{
                                  asc: <HiChevronUp />,
                                  desc: <HiChevronDown />,
                                  false: header.column.getCanSort() ? (
                                    <HiChevronUpDown />
                                  ) : null,
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </div>
                            )}
                            {/* <ColumnDivider
                              isLast={headersArray.length - 1 === index}
                            /> */}
                          </TableHead>
                        )
                      )}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({
                      length: Math.max(10, pagination.pageSize),
                    }).map((_, index) => (
                      <SkeletonRow key={index} columns={columns} />
                    ))
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={totalColumns}
                        className="text-center py-20 text-white overflow-x-auto"
                      >
                        Nenhum resultado encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {rowModel.map((row) =>
                        customRowRender
                          ? customRowRender(row, table)
                          : defaultDesktopRowRender(row)
                      )}
                      {rowModel.length < 10 && !isLoading && (
                        <TableRow className="flex-1 overflow-x-auto">
                          <TableCell
                            colSpan={totalColumns}
                            className="h-full"
                            style={{
                              minHeight: `${(10 - rowModel.length) * 40}px`,
                            }}
                          />
                        </TableRow>
                      )}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          {/* Rodapé fixo */}
          {hasAnyTotal && (
            <div className="sticky bottom-0 left-0 right-0 z-5 w-full bg-gray-800 overflow-x-auto">
              <Table className="w-full table-auto overflow-x-auto">
                <TableFooter>
                  <TableRow>
                    <TableCell
                      colSpan={totalColumns}
                      className=" px-1 text-center align-bottom text-white font-semibold text-[12px]"
                    >
                      <div className="flex items-end justify-end space-x-4 space-y-1">
                        <div className="flex flex-col items-start">
                          {totalPrice !== undefined && (
                            <div>
                              {`Total Valor de Tabela (${osNumber} OS): `}
                              {formatPrice({ price: totalPrice })}
                            </div>
                          )}

                          {totalInvoice !== undefined && (
                            <div>
                              Total Valor da Nota Fiscal:{" "}
                              {formatPrice({ price: totalInvoice })}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="flex flex-col items-start">
                            {clicheCorrugatedTotalPrice !== undefined &&
                              metragemCliche !== undefined && (
                                <div>
                                  Valor Total Clichê:{" "}
                                  {formatPrice({
                                    price: clicheCorrugatedTotalPrice,
                                  })}
                                </div>
                              )}
                            {diecutblockTotalPrice !== undefined &&
                              metragemForma !== undefined && (
                                <div>
                                  Valor Total Forma:{" "}
                                  {formatPrice({
                                    price: diecutblockTotalPrice,
                                  })}
                                </div>
                              )}
                          </div>

                          <div className="flex flex-col items-start">
                            {metragemCliche !== undefined && (
                              <div>
                                Metragem Clichê:{" "}
                                {formatMetragemCliche(metragemCliche)}
                              </div>
                            )}
                            {metragemForma !== undefined && (
                              <div>
                                Metragem Forma:{" "}
                                {formatMetragemForma(metragemForma)}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-start">
                            {clicheCorrugatedTotalPrice !== undefined &&
                              metragemCliche !== undefined && (
                                <div>
                                  R$ por m²:{" "}
                                  {formatPrice({
                                    price:
                                      clicheCorrugatedTotalPrice /
                                      metragemCliche,
                                  })}
                                </div>
                              )}
                            {diecutblockTotalPrice !== undefined &&
                              metragemForma !== undefined && (
                                <div>
                                  R$ por m:{" "}
                                  {formatPrice({
                                    price:
                                      diecutblockTotalPrice / metragemForma,
                                  })}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          )}
        </div>
      ) : (
        // Mobile permanece igual
        <div className="flex flex-col gap-4">
          {isLoading ? (
            Array.from({
              length: table.getState().pagination.pageSize,
            }).map((_, index) => <SkeletonRow key={index} columns={columns} />)
          ) : data.length === 0 ? (
            <div className="text-center py-3 text-white bg-gray-700 rounded">
              Nenhum resultado encontrado
            </div>
          ) : (
            <>
              {rowModel.map((row) =>
                customMobileRowRender
                  ? customMobileRowRender(row, table)
                  : defaultMobileRowRender(row)
              )}

              {/* Rodapé para mobile */}
              {((totalPrice && totalPrice > 0) ||
                (metragemCliche && metragemCliche > 0) ||
                (metragemForma && metragemForma > 0)) && (
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-white font-semibold text-sm">
                  <div className="flex flex-col gap-2 text-center text-[12px]">
                    {totalPrice && totalPrice > 0 && (
                      <div>
                        Total Valor de Tabela:{" "}
                        {formatPrice({ price: totalPrice })}
                      </div>
                    )}

                    {totalInvoice !== undefined && (
                      <div>
                        Total Valor da Nota Fiscal:{" "}
                        {formatPrice({ price: totalInvoice })}
                      </div>
                    )}

                    {metragemCliche && metragemCliche > 0 && (
                      <div>
                        Metragem Clichê: {formatMetragemCliche(metragemCliche)}
                      </div>
                    )}
                    {metragemForma && metragemForma > 0 && (
                      <div>
                        Metragem Forma: {formatMetragemForma(metragemForma)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="mt-2 flex justify-end items-center gap-2 text-xs">
        <div>
          {showingAll
            ? `Mostrando todos os ${rowCount.toLocaleString()} resultados`
            : `Mostrando ${Math.min(
                pagination.pageIndex * pagination.pageSize +
                  (orderCount ?? rowModel.length),
                rowCount
              )} de ${rowCount.toLocaleString()}`}
        </div>
        <PageSizeSelect
          pageSize={showingAll ? -1 : pagination.pageSize}
          options={pageSizeOptions}
          onChange={handlePageSizeChange}
          showAllLabel="Todos"
          totalCount={rowCount}
          className=""
        />
        {!showingAll && (
          <Pagination
            currentPage={pagination.pageIndex + 1}
            totalPages={Math.ceil(rowCount / pagination.pageSize)}
            onPageChange={(page) => table.setPageIndex(page - 1)}
          />
        )}
      </div>
    </div>
  );
};

export default DataTable;
