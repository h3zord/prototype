"use client";

import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
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

interface DataTableProps<T extends { id: string | number }> {
  columns: ColumnDef<T>[];
  data: T[];
  pagination: PaginationState;
  rowSelection?: RowSelectionState;
  sorting?: SortingState;
  rowCount: number;

  setSorting?: (updater: Updater<SortingState>) => void;
  setPagination: (updater: Updater<PaginationState>) => void;
  setRowSelection?: (updater: Updater<RowSelectionState>) => void;

  isLoading?: boolean;
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

  /** Conteúdo por id da coluna para o rodapé (alinha 1:1 com as colunas visíveis) */
  footerByColumnId?: Record<string, React.ReactNode>;
}

const DataTable = <
  T extends {
    isHeader?: boolean;
    id: string | number;
  },
>({
  columns,
  data,
  pagination,
  rowSelection,
  sorting = [],
  rowCount,
  setPagination,
  setRowSelection,
  setSorting,
  isLoading = false,
  customRowRender,
  customMobileRowRender,
  extraTableOptions,
  showAllOption = true,
  footerByColumnId,
}: DataTableProps<T>) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showingAll, setShowingAll] = useState<boolean>(false);

  // ---- Refs para medir alturas e calcular o espaçador
  const containerRef = useRef<HTMLDivElement>(null); // wrapper do componente
  const scrollRef = useRef<HTMLDivElement>(null); // div com overflow:auto
  const theadRef = useRef<HTMLTableSectionElement>(null); // <thead>
  const tbodyRef = useRef<HTMLTableSectionElement>(null); // <tbody>
  const tfootRef = useRef<HTMLTableSectionElement>(null); // <tfoot>
  const [spacerHeight, setSpacerHeight] = useState<number>(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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

  useEffect(() => {
    setShowingAll(
      showAllOption &&
        (pagination.pageSize >= rowCount || pagination.pageSize === -1)
    );
  }, [pagination.pageSize, rowCount, showAllOption]);

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

  const defaultDesktopRowRender = (row: Row<T>) => {
    const isEven = row.index % 2 === 0;
    const bgColor = isEven ? "bg-gray-600" : "bg-gray-700";
    return (
      <TableRow
        key={row.id}
        className={`${bgColor} hover:bg-gray-500 text-white text-[10px] border-b-1 border-gray-100`}
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

  // ---- Cálculo do espaçador (para manter o TFOOT encostado no fundo)
  const recomputeSpacer = useCallback(() => {
    const scroller = scrollRef.current;
    const thead = theadRef.current;
    const tbody = tbodyRef.current;
    const tfoot = tfootRef.current;
    if (!scroller || !thead || !tbody) {
      setSpacerHeight(0);
      return;
    }

    const available = scroller.clientHeight; // altura visível do container rolável
    const headH = thead.offsetHeight || 0;
    const bodyH = tbody.offsetHeight || 0;
    const footH = tfoot?.offsetHeight || 0;

    // espaço que falta para o tfoot ficar no fundo quando não há overflow
    const gap = available - (headH + bodyH + footH);
    setSpacerHeight(gap > 0 ? gap : 0);
  }, []);

  useLayoutEffect(() => {
    recomputeSpacer();
  }, [
    recomputeSpacer,
    data,
    rowModel.length,
    isLoading,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    const onResize = () => recomputeSpacer();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recomputeSpacer]);

  return (
    <div className="space-y-4" ref={containerRef}>
      {!isMobile ? (
        <div
          className="relative h-screen flex flex-col border border-gray-600 rounded-lg bg-gray-700"
          style={{ height: "calc(100vh - 16rem)", minHeight: 600 }}
        >
          {/* Um ÚNICO <Table> com THEAD, TBODY e TFOOT - garante alinhamento */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <div ref={scrollRef} style={{ height: "100%", overflow: "auto" }}>
              <Table className="w-full table-auto">
                <TableHeader
                  ref={theadRef}
                  className="sticky top-0 z-10 bg-gray-700 text-white border"
                >
                  {headerGroups.map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {hasRowSelection && (
                        <TableHead className="flex items-center justify-center p-3 text-black text-[12px]">
                          <IndeterminateCheckbox
                            checked={table.getIsAllRowsSelected()}
                            indeterminate={table.getIsSomeRowsSelected()}
                            onChange={table.getToggleAllRowsSelectedHandler()}
                          />
                        </TableHead>
                      )}
                      {headerGroup.headers.map((header, index) => (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className="relative font-normal p-2 align-middle text-left text-[12px] break-words border-r-gray-600 border-r-[1px] last:border-r-0"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {!header.isPlaceholder && (
                            <div
                              className={
                                header.column.getCanSort()
                                  ? "flex items-center justify-between cursor-pointer select-none"
                                  : ""
                              }
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
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )}
                          {/* <ColumnDivider isLast={headersArray.length - 1 === index} /> */}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody ref={tbodyRef}>
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
                        className="text-center py-20 text-white"
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
                      {/* Linha espaçadora dinâmica para empurrar o rodapé ao fundo quando não há overflow */}
                      {spacerHeight > 0 && (
                        <TableRow aria-hidden>
                          <TableCell
                            colSpan={totalColumns}
                            style={{ height: spacerHeight }}
                          />
                        </TableRow>
                      )}
                    </>
                  )}
                </TableBody>

                {/* Rodapé STICKY alinhado por coluna */}
                {footerByColumnId &&
                  Object.keys(footerByColumnId).length > 0 && (
                    <TableFooter
                      ref={tfootRef}
                      className="sticky bottom-0 z-10 bg-gray-800"
                    >
                      <TableRow>
                        {/* Coluna de seleção (se existir) */}
                        {hasRowSelection && (
                          <TableCell className="bg-gray-800" />
                        )}

                        {/* Uma célula por coluna visível, usando o id/acessorKey */}
                        {table
                          .getAllLeafColumns()
                          .filter((c) => c.getIsVisible())
                          .map((col) => {
                            const id = (col.id ||
                              col.columnDef.id ||
                              col.columnDef.accessorKey) as string;
                            const content = footerByColumnId[id];
                            const alignRight = [
                              "cliente",
                              "fabricante",
                              "modelo",
                              "formato",
                              "alturaChapa",
                              "larguraChapa",
                              "quantidade",
                              "m2",
                              "quantidadeCaixas",
                              "numeroNF",
                              "valorNF",
                              "dolar",
                              "unidade",
                              "entryDate",
                            ].includes(id);

                            return (
                              <TableCell
                                key={id}
                                className={`bg-gray-800 text-[10px] px-1 py-2 text-white ${
                                  alignRight ? "text-right" : "text-left"
                                } ${id === "codBar" ? "pl-2" : ""}`}
                              >
                                {content ?? ""}
                              </TableCell>
                            );
                          })}
                      </TableRow>
                    </TableFooter>
                  )}
              </Table>
            </div>
          </div>
        </div>
      ) : (
        // Mobile (mantido)
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
                customMobileRowRender ? (
                  customMobileRowRender(row, table)
                ) : (
                  <div
                    key={row.id}
                    className="bg-gray-700 border border-gray-600 rounded-lg shadow p-4 text-white"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <div key={cell.id} className="mb-2">
                        <span className="block text-[12px] font-medium">
                          {flexRender(
                            cell.column.columnDef.header,
                            cell.getContext() as unknown as HeaderContext<
                              T,
                              unknown
                            >
                          )}
                        </span>
                        <span className="block text-[12px]">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </div>
      )}

      {/* Paginação */}
      <div className="mt-2 flex justify-end items-center gap-2 text-xs">
        <div>
          {showingAll
            ? `Mostrando todos os ${rowCount.toLocaleString()} resultados`
            : `Mostrando ${Math.min(
                pagination.pageIndex * pagination.pageSize + rowModel.length,
                rowCount
              )} de ${rowCount.toLocaleString()}`}
        </div>
        <PageSizeSelect
          pageSize={showingAll ? -1 : pagination.pageSize}
          options={
            showAllOption ? [10, 20, 30, 40, 50, -1] : [10, 20, 30, 40, 50]
          }
          onChange={handlePageSizeChange}
          showAllLabel="Todos"
          totalCount={rowCount}
        />
        {!showingAll && (
          <Pagination
            currentPage={pagination.pageIndex + 1}
            totalPages={Math.ceil(rowCount / (pagination.pageSize || 1))}
            onPageChange={(page) => table.setPageIndex(page - 1)}
          />
        )}
      </div>
    </div>
  );
};

export default DataTable;
