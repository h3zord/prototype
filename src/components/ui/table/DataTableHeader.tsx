import SearchInput from "../filters/SearchInput";
import { IoMdFunnel } from "react-icons/io";
import { ReactNode } from "react";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "../../../components/components/ui/breadcrumps";
import { FileSpreadsheet } from "lucide-react";

export interface DataTableHeaderProps {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode[];
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
  hasActiveFilters?: boolean;
  searchInputDefaultValue?: string;
  children?: ReactNode;
  filterMessage?: React.ReactNode | null;
  onExportClick?: () => void;
  exportLabel?: string;
}

const DataTableHeader: React.FC<DataTableHeaderProps> = ({
  title,
  breadcrumbs,
  actions,
  searchPlaceholder = "Buscar...",
  onSearchChange,
  onFilterClick,
  hasActiveFilters,
  searchInputDefaultValue = "",
  children,
  filterMessage,
  onExportClick,
  exportLabel = "Exportar",
}) => {
  return (
    <div className="bg-gray-700 rounded-t border-b border-gray-500 py-4 text-white text-xs">
      <div className="flex items-center justify-between py-2 px-2 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {breadcrumbs ? (
            <Breadcrumbs items={breadcrumbs} />
          ) : (
            <span className="text-sm font-medium truncate max-w-[200px] ml-3">
              {title}
            </span>
          )}
          {children && <div className="ml-2">{children}</div>}
          <div className="flex gap-2">{actions}</div>
        </div>

        <div className="flex items-center gap-4">
          {onExportClick && (
            <div
              className="relative cursor-pointer transition-colors"
              onClick={onExportClick}
              title={exportLabel}
            >
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          )}
          {onFilterClick && (
            <>
              {filterMessage && filterMessage}
              <div
                className="relative cursor-pointer"
                onClick={onFilterClick}
                title="Filtros"
              >
                <IoMdFunnel className="h-4 w-4" />
                {hasActiveFilters && (
                  <span className="absolute -top-0.5 -right-0.5 block w-2.5 h-2.5 bg-orange-400 rounded-full" />
                )}
              </div>
            </>
          )}
          {onSearchChange && (
            <SearchInput
              placeholder={searchPlaceholder}
              onChange={onSearchChange}
              defaultValue={searchInputDefaultValue}
              className="h-7 text-xs px-2 py-1"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTableHeader;
