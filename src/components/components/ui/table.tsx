import * as React from "react";
import { cn } from "../../lib/utils";

// TABLE
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    // IMPORTANTE: "border-separate" e "border-spacing-y-3" para espaçamento vertical
    className={cn(
      "w-full table-auto border-separate border-spacing-x-0",
      className,
    )}
    {...props}
  />
));
Table.displayName = "Table";

// TABLE HEADER
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    // Removemos ou ajustamos a borda inferior para o cabeçalho, se preferir
    // "[&_tr]:border-b" -> se quiser manter a linha no header, pode deixar
    className={cn("[&_tr]:border-b", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

// TABLE BODY
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    // Removemos o "[&_tr:last-child]:border-0" pois agora cada linha terá borda própria
    className={cn(className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

// TABLE FOOTER
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

// TABLE ROW
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    // Removemos "border-b" e aplicamos uma borda e rounded para simular "cartões"
    className={cn(
      "rounded-md border border-border/30 shadow-sm", // Borda em volta do "cartão"
      "transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", // Efeito hover e seleção
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

// TABLE HEAD
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-2 text-left align-middle font-medium text-muted-foreground",
      "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

// TABLE CELL
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle",
      "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

// TABLE CAPTION
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
