"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
  useCallback,
  useState,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type PaginationState,
  type Row,
  type SortingState,
  type Updater,
  type RowSelectionState,
  flexRender,
  type HeaderContext,
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
import { IndeterminateCheckbox } from "../components/IndeterminateCheckbox";
import PageSizeSelect from "../components/PageSizeSelect";
import Pagination from "../components/Pagination";

type AnyRow = { id: string | number; isHeader?: boolean };

interface DataTableProps<T extends AnyRow> {
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
  showPagination?: boolean;
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

  /** conteúdo por coluna pro rodapé (alinhado 1:1 com colunas visíveis) */
  footerByColumnId?: Record<string, React.ReactNode>;
}

const DataTable = <T extends AnyRow>({
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
  showPagination = true,
  footerByColumnId,
}: DataTableProps<T>) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showingAll, setShowingAll] = useState(false);

  // refs p/ medir sem setState
  const scrollerRef = useRef<HTMLDivElement>(null);
  const theadRef = useRef<HTMLTableSectionElement>(null);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const tfootRef = useRef<HTMLTableSectionElement>(null);
  const spacerRowRef = useRef<HTMLTableRowElement>(null); // “empurra” p/ o fundo quando tem pouco conteúdo
  const padRowRef = useRef<HTMLTableRowElement>(null); // sempre reserva a altura do footer p/ não cobrir última linha

  const hasStickyFooter =
    !!footerByColumnId && Object.keys(footerByColumnId).length > 0;

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
    getRowId: (row) => String(row.id),
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

  const headerGroups = table.getHeaderGroups();
  const rowModel = table.getRowModel().rows;

  const hasRowSelection = !isLoading && rowSelection && setRowSelection;
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

  /**
   * Medição sem setState (evita loops/piscar):
   * - Define CSS var --tfoot-h no scroller com a altura do footer
   * - Ajusta a linha “pad” (sempre = altura do footer) para não cobrir última linha
   * - Ajusta a linha “spacer” (somente quando faltar espaço) para empurrar o footer até o fundo sem overflow
   */
  const measure = useCallback(() => {
    const scroller = scrollerRef.current;
    const thead = theadRef.current;
    const tbody = tbodyRef.current;
    const tfoot = tfootRef.current;
    const spacerRow = spacerRowRef.current;
    const padRow = padRowRef.current;
    if (!scroller || !thead || !tbody || !tfoot || !spacerRow || !padRow)
      return;

    const tdPad = padRow.firstElementChild as HTMLElement | null;
    const tdSpacer = spacerRow.firstElementChild as HTMLElement | null;
    if (!tdPad || !tdSpacer) return;

    // Alturas atuais (descontando as próprias linhas “pad” e “spacer”)
    const footH = Math.round(tfoot.getBoundingClientRect().height);
    const headH = Math.round(thead.getBoundingClientRect().height);

    // Para medir o conteúdo real do tbody, zeramos temporariamente as alturas das linhas auxiliares
    const prevPadH = tdPad.style.height;
    const prevSpacerH = tdSpacer.style.height;
    tdPad.style.height = "0px";
    tdSpacer.style.height = "0px";

    const bodyHReal = Math.round(tbody.getBoundingClientRect().height);

    // restaura (para cálculo final)
    tdPad.style.height = prevPadH;
    tdSpacer.style.height = prevSpacerH;

    // viewport visível do scroller
    const avail = scroller.clientHeight;

    // 1) Sempre reservar o espaço do rodapé para não cobrir última linha
    const currentCssFoot = scroller.style.getPropertyValue("--tfoot-h");
    if (currentCssFoot !== `${footH}px`) {
      scroller.style.setProperty("--tfoot-h", `${footH}px`);
    }
    if (tdPad.style.height !== `${footH}px`) {
      tdPad.style.height = `${footH}px`;
    }

    // 2) Se faltar espaço para o footer “encostar” no fundo, cria o espaçador
    const gap = avail - (headH + bodyHReal + footH);
    const spacerH = gap > 0 ? gap : 0;
    if (tdSpacer.style.height !== `${spacerH}px`) {
      tdSpacer.style.height = `${spacerH}px`;
    }
  }, []);

  // observar mudanças de tamanho sem setState
  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    const sc = scrollerRef.current;
    const th = theadRef.current;
    const tb = tbodyRef.current;
    const tf = tfootRef.current;
    if (sc) ro.observe(sc);
    if (th) ro.observe(th);
    if (tb) ro.observe(tb);
    if (tf) ro.observe(tf);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [measure]);

  // remedir quando dados mudam
  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    rowModel.length,
    isLoading,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  return (
    <div className="space-y-4">
      <div
        className="relative flex flex-col border border-gray-600 rounded-lg bg-gray-700"
        style={{ height: "calc(100vh - 16rem)", minHeight: 600 }}
      >
        {/* SCROLLER ÚNICO */}
        <div
          ref={scrollerRef}
          className="flex-1 overflow-auto"
          // padding-bottom também pode ser usado em conjunto, mas a linha pad já resolve a sobreposição
        >
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
                  {headerGroup.headers.map((header) => (
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
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody ref={tbodyRef}>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={totalColumns}
                    className="text-center py-20 text-white"
                  >
                    Carregando...
                  </TableCell>
                </TableRow>
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

                  {/* Linha PAD: sempre reserva a altura do footer para não encobrir a última linha */}
                  <TableRow ref={padRowRef} aria-hidden>
                    <TableCell
                      colSpan={totalColumns}
                      style={{ height: "var(--tfoot-h, 0px)" }}
                    />
                  </TableRow>

                  {/* Linha SPACER: só terá altura > 0 quando faltar espaço para encostar o footer no fundo */}
                  <TableRow ref={spacerRowRef} aria-hidden>
                    <TableCell colSpan={totalColumns} style={{ height: 0 }} />
                  </TableRow>
                </>
              )}
            </TableBody>

            {/* Rodapé sticky alinhado às colunas */}
            {hasStickyFooter && (
              <TableFooter
                ref={tfootRef}
                className="sticky bottom-0 z-20 bg-gray-800"
                style={{ transform: "translateZ(0)" }}
              >
                <TableRow>
                  {hasRowSelection && (
                    <TableCell className="bg-gray-800 text-white text-[10px] px-1 py-2" />
                  )}

                  {table
                    .getAllLeafColumns()
                    .filter((c) => c.getIsVisible())
                    .map((col) => {
                      const id = (col.id ||
                        col.columnDef.id ||
                        col.columnDef.accessorKey) as string;
                      const content = footerByColumnId![id];
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
                          className={`bg-gray-800 text-white text-[10px] px-1 py-2 ${
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

      {showPagination && (
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
      )}
    </div>
  );
};

export default DataTable;
