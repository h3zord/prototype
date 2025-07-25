export const ColumnDivider = ({ isLast }: { isLast: boolean }) => (
  <div
    className={`absolute top-0 right-0 h-8 w-[1px] ${isLast ? "" : "bg-gray-500"}`}
  />
);
