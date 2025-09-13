import React from "react";
import { List, Clock, CheckCircle } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../../components/components/ui/tabs";

// Define os tipos de filtro possíveis
type StatusFilter = "all" | "pending" | "approved";

// Define as props que o componente aceitará
interface StatusFilterTabsProps {
  currentFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
}

const StatusFilterTabs: React.FC<StatusFilterTabsProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <Tabs
      value={currentFilter}
      onValueChange={(value) => onFilterChange(value as StatusFilter)}
      className="w-fit"
    >
      <TabsList className="flex gap-x-2 w-full border h-8 border-gray-600">
        {/* Aba para mostrar todos os itens */}
        <TabsTrigger
          value="all"
          className="flex items-center justify-center h-6 gap-2 text-white data-[state=active]:bg-[#f9a853] text-[12px]"
        >
          <List size={12} />
          <span>Todos</span>
        </TabsTrigger>

        {/* Aba para filtrar por "Pendente" */}
        <TabsTrigger
          value="pending"
          className="flex items-center justify-center h-6 gap-2 text-white data-[state=active]:bg-[#f9a853] text-[12px]"
        >
          <Clock size={12} />
          <span>Pendentes</span>
        </TabsTrigger>

        {/* Aba para filtrar por "Aprovado" */}
        <TabsTrigger
          value="approved"
          className="flex items-center justify-center h-6 gap-2 text-white data-[state=active]:bg-[#f9a853] text-[12px]"
        >
          <CheckCircle size={12} />
          <span>Aprovados</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default StatusFilterTabs;
