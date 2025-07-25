import React from "react";
import { Control } from "react-hook-form";
import RangeDatePicker from "../../../../components/ui/form/RangeDatePicker";

interface ToolBarProps {
  control: Control<any>;
}

const ToolBar: React.FC<ToolBarProps> = ({ control }) => (
  <div className="mb-4 w-full rounded-lg flex items-end space-x-4">
    <div className="flex items-center text-[12px]">
      <RangeDatePicker
        control={control}
        name="dateInterval"
        label="Selecione um período"
        placeholder="Selecione um período (opcional)"
      />
    </div>
    <div className="text-[12px] h-10 flex justify-center items-center text-gray-600 bg-gray-200 p-2 rounded-lg border border-gray-600">
      <span className="font-medium">💡 Dica:</span> Para comparação de mês no
      dashboard, é necessário selecionar um mês inteiro para visualizar essa
      métrica.
    </div>
  </div>
);

export default ToolBar;
