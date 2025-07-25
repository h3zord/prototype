import React, { useState, useRef } from "react";
import { ServiceOrderStatus } from "../../../types/models/serviceorder";
import {
  useModifyServiceOrder,
  useRegisterServiceOrderLog,
} from "../../../features/serviceOrder/api/hooks";
import { getServiceOrderStatuses } from "../../../helpers/options/serviceorder";
import { getLabelFromValue } from "../../../helpers/options/getOptionFromValue";
import {
  getLastStatusLog,
  ModifyServiceOrderBody,
} from "../../../features/serviceOrder/api/services";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../components/components/ui/dropdown-menu";
import { usePermission } from "../../../context/PermissionsContext";
import { PERMISSIONS_TYPE } from "../../../types/models/permissions";
import { Plus } from "lucide-react";

const statusStyles: Record<ServiceOrderStatus, string> = {
  [ServiceOrderStatus.WAITING_PRODUCTION]: "bg-yellow-400 text-gray-800",
  [ServiceOrderStatus.PREPRESS]: "bg-blue-500 text-white",
  [ServiceOrderStatus.CREDIT_ANALYSIS]: "bg-purple-500 text-white",
  [ServiceOrderStatus.CONFERENCE]: "bg-green-400 text-gray-800",
  [ServiceOrderStatus.PREASSEMBLY]: "bg-teal-400 text-gray-800",
  [ServiceOrderStatus.IN_APPROVAL]: "bg-cyan-500 text-white",
  [ServiceOrderStatus.RECORDING]: "bg-pink-400 text-gray-800",
  [ServiceOrderStatus.LAYOUT]: "bg-indigo-400 text-gray-800",
  [ServiceOrderStatus.IMAGE_PROCESSING]: "bg-red-400 text-white",
  [ServiceOrderStatus.PLOTTING]: "bg-orange-500 text-white",
  [ServiceOrderStatus.CNC]: "bg-gray-500 text-white",
  [ServiceOrderStatus.DEVELOPMENT]: "bg-lime-500 text-gray-800",
  [ServiceOrderStatus.LAMINATION]: "bg-yellow-500 text-gray-800",
  [ServiceOrderStatus.RUBBERIZING]: "bg-orange-950 text-white",
  [ServiceOrderStatus.CANCELLED]: "bg-red-600 text-white",
  [ServiceOrderStatus.FINALIZED]: "bg-black text-white",
  [ServiceOrderStatus.DISPATCHED]: "bg-green-600 text-white",
};

type StatusBadgeProps = {
  serviceOrder: {
    id: string;
    status: ServiceOrderStatus;
    substatus?: ServiceOrderStatus[];
    preparedToDispatch: boolean;
    operator: { id: string };
    transport: { id: string };
    dispatchDate?: string;
    unit: string;
  };
  isClickable?: boolean;
};

export const StatusBadge: React.FC<StatusBadgeProps> = React.memo(
  ({ serviceOrder, isClickable = true }) => {
    const { mutate } = useModifyServiceOrder();
    const { mutate: registerLog } = useRegisterServiceOrderLog();
    const { permissions, user } = usePermission();

    const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
    const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
    const badgeRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const subDropdownRef = useRef<HTMLDivElement>(null);

    const canChangeStatus = permissions.includes(
      PERMISSIONS_TYPE.CHANGE_STATUS_PCP
    );

    const allStatuses = getServiceOrderStatuses(serviceOrder);

    // Garantir que PLOTTING e RECORDING estejam disponíveis como status principais
    let availableStatuses = allStatuses
      .filter((opt) => opt.value !== ServiceOrderStatus.FINALIZED)
      .filter(
        (opt) =>
          serviceOrder.preparedToDispatch ||
          opt.value !== ServiceOrderStatus.DISPATCHED
      );

    // Garantir que PLOTTING esteja sempre disponível no dropdown principal
    const plottingOption = {
      label: "Plotagem",
      value: ServiceOrderStatus.PLOTTING,
    };
    const hasPlotting = availableStatuses.some(
      (status) => status.value === ServiceOrderStatus.PLOTTING
    );

    if (!hasPlotting) {
      availableStatuses = [...availableStatuses, plottingOption];
    }

    // Garantir que RECORDING esteja sempre disponível no dropdown principal
    const recordingOption = {
      label: "Gravação",
      value: ServiceOrderStatus.RECORDING,
    };
    const hasRecording = availableStatuses.some(
      (status) => status.value === ServiceOrderStatus.RECORDING
    );

    if (!hasRecording) {
      availableStatuses = [...availableStatuses, recordingOption];
    }

    // Ordenar os status para que PLOTTING apareça após RECORDING
    availableStatuses = availableStatuses.sort((a, b) => {
      const statusOrder = [
        ServiceOrderStatus.WAITING_PRODUCTION,
        ServiceOrderStatus.PREPRESS,
        ServiceOrderStatus.CREDIT_ANALYSIS,
        ServiceOrderStatus.CONFERENCE,
        ServiceOrderStatus.PREASSEMBLY,
        ServiceOrderStatus.IN_APPROVAL,
        ServiceOrderStatus.RECORDING,
        ServiceOrderStatus.PLOTTING,
        ServiceOrderStatus.LAYOUT,
        ServiceOrderStatus.IMAGE_PROCESSING,
        ServiceOrderStatus.CNC,
        ServiceOrderStatus.DEVELOPMENT,
        ServiceOrderStatus.LAMINATION,
        ServiceOrderStatus.RUBBERIZING,
        ServiceOrderStatus.CANCELLED,
        ServiceOrderStatus.DISPATCHED,
      ];

      const indexA = statusOrder.indexOf(a.value as ServiceOrderStatus);
      const indexB = statusOrder.indexOf(b.value as ServiceOrderStatus);

      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });

    // Substatus disponíveis baseado no status atual
    const getAvailableSubstatus = () => {
      if (serviceOrder.status === ServiceOrderStatus.RECORDING) {
        return [{ label: "Plotagem", value: ServiceOrderStatus.PLOTTING }];
      }

      if (serviceOrder.status === ServiceOrderStatus.PLOTTING) {
        return [{ label: "Gravação", value: ServiceOrderStatus.RECORDING }];
      }

      return [];
    };

    const availableSubstatus = getAvailableSubstatus();

    const currentStyle =
      statusStyles[serviceOrder.status] ?? "bg-gray-200 text-gray-800";
    const statusLabel = getLabelFromValue(serviceOrder.status, [
      ...allStatuses,
      plottingOption,
      recordingOption,
    ]);

    // Verifica se há substatus válido (para RECORDING e PLOTTING)
    const hasSubstatus =
      (serviceOrder.status === ServiceOrderStatus.RECORDING ||
        serviceOrder.status === ServiceOrderStatus.PLOTTING) &&
      serviceOrder.substatus &&
      serviceOrder.substatus.length > 0;

    const handleChange = async (newStatus: ServiceOrderStatus) => {
      if (!user) {
        console.error("Usuário não encontrado para registrar o log.");
        return;
      }
      const previousStatus = serviceOrder.status;
      const previousSubStatus = serviceOrder.substatus?.[0] || undefined;

      const payload: ModifyServiceOrderBody = {
        serviceOrderIds: [Number(serviceOrder.id)],
        operatorId: Number(serviceOrder.operator.id),
        transportId: Number(serviceOrder.transport.id),
        dispatchDate: serviceOrder.dispatchDate,
        status: newStatus,
        unit: serviceOrder.unit as any,
        substatus: undefined,
      };

      let duration: number | undefined = undefined;
      try {
        const lastLog = await getLastStatusLog(Number(serviceOrder.id));
        if (lastLog?.changedAt) {
          const previousDate = new Date(lastLog.changedAt).getTime();
          const now = new Date().getTime();
          duration = Math.floor((now - previousDate) / 1000);
        }
      } catch (err) {
        console.warn("Erro ao buscar último log de status:", err);
      }

      mutate(payload, {
        onSuccess: () => {
          registerLog({
            serviceOrderId: Number(serviceOrder.id),
            previousStatus,
            previousSubStatus,
            newStatus,
            newSubStatus: undefined,
            changedById: Number(user.id),
            duration,
          });
        },
      });
    };

    const handleSubstatusAdd = async (substatus: ServiceOrderStatus) => {
      if (!user) {
        console.error("Usuário não encontrado para registrar o log.");
        return;
      }

      const currentSubstatus = serviceOrder.substatus || [];

      if (currentSubstatus.includes(substatus)) {
        return;
      }

      const newSubstatus = [...currentSubstatus, substatus];
      const previousSubStatus = serviceOrder.substatus?.[0] || undefined;

      const payload: ModifyServiceOrderBody = {
        serviceOrderIds: [Number(serviceOrder.id)],
        operatorId: Number(serviceOrder.operator.id),
        transportId: Number(serviceOrder.transport.id),
        dispatchDate: serviceOrder.dispatchDate,
        status: serviceOrder.status,
        unit: serviceOrder.unit as any,
        substatus: newSubstatus[0],
      };

      let duration: number | undefined = undefined;
      try {
        const lastLog = await getLastStatusLog(Number(serviceOrder.id));
        if (lastLog?.changedAt) {
          const previousDate = new Date(lastLog.changedAt).getTime();
          const now = new Date().getTime();
          duration = Math.floor((now - previousDate) / 1000);
        }
      } catch (err) {
        console.warn("Erro ao buscar último log de status:", err);
      }

      mutate(payload, {
        onSuccess: () => {
          registerLog({
            serviceOrderId: Number(serviceOrder.id),
            previousStatus: serviceOrder.status,
            previousSubStatus,
            newStatus: serviceOrder.status,
            newSubStatus: substatus,
            changedById: Number(user.id),
            duration,
          });
        },
      });
    };

    // Função para renderizar o conteúdo do badge
    const renderBadgeContent = () => {
      if (hasSubstatus) {
        const allStatusOptions = [
          ...allStatuses,
          plottingOption,
          recordingOption,
          ...availableSubstatus,
        ];
        const substatusLabels = serviceOrder
          .substatus!.map((sub) => getLabelFromValue(sub, allStatusOptions))
          .join(", ");

        const firstSubstatus = serviceOrder.substatus![0];
        const substatusStyle =
          statusStyles[firstSubstatus] ?? "bg-gray-200 text-gray-800";

        const getColorFromStyle = (style: string) => {
          const colorClass = style.split(" ")[0];
          const colorMap: Record<string, string> = {
            "bg-yellow-400": "#facc15",
            "bg-blue-500": "#3b82f6",
            "bg-purple-500": "#a855f7",
            "bg-green-400": "#4ade80",
            "bg-teal-400": "#2dd4bf",
            "bg-cyan-500": "#06b6d4",
            "bg-pink-400": "#f472b6",
            "bg-indigo-400": "#818cf8",
            "bg-red-400": "#f87171",
            "bg-violet-500": "#8b5cf6",
            "bg-orange-500": "#f97316",
            "bg-gray-500": "#6b7280",
            "bg-lime-500": "#84cc16",
            "bg-yellow-500": "#eab308",
            "bg-orange-950": "#7c2d12",
            "bg-red-600": "#dc2626",
            "bg-black": "#000000",
            "bg-green-600": "#16a34a",
            "bg-gray-200": "#e5e7eb",
          };
          return colorMap[colorClass] || "#e5e7eb";
        };

        const statusColor = getColorFromStyle(currentStyle);
        const substatusColor = getColorFromStyle(substatusStyle);

        return (
          <>
            <div
              className="absolute inset-0 rounded-[16px]"
              style={{
                background: `linear-gradient(135deg, ${statusColor} 0%, ${statusColor} 48%, ${substatusColor} 52%, ${substatusColor} 100%)`,
              }}
            />
            <div className="relative z-10 w-full flex items-center justify-center">
              <span className="flex-1 text-center text-[12px] font-medium text-white drop-shadow-sm">
                {statusLabel}
              </span>
              <span className="flex-1 text-center text-[10px] font-medium text-white drop-shadow-sm">
                {substatusLabels}
              </span>
            </div>
          </>
        );
      }

      return <span className="text-[12px] font-medium">{statusLabel}</span>;
    };

    const Badge = React.forwardRef<
      HTMLDivElement,
      React.HTMLAttributes<HTMLDivElement>
    >(({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={`px-2 py-1 text-[12px] min-w-[150px] text-nowrap rounded-[16px] text-center font-medium relative overflow-hidden ${currentStyle} ${className}`}
        {...props}
      >
        {renderBadgeContent()}
      </div>
    ));
    Badge.displayName = "Badge";

    if (!isClickable) {
      return <Badge />;
    }

    // Função para renderizar a seta no badge quando dropdown está aberto
    const renderDropdownArrow = () => {
      if (!isMainDropdownOpen) return null;

      return (
        <div className="absolute left-1 top-1/2 transform -translate-y-1/2 z-10">
          <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[6px] border-r-white drop-shadow-sm"></div>
        </div>
      );
    };

    return (
      <div className="relative">
        {/* Indicador visual quando dropdown está aberto */}
        {(isMainDropdownOpen || isSubDropdownOpen) && (
          <div className="absolute -inset-1 bg-white/20 rounded-[18px] animate-pulse"></div>
        )}

        <DropdownMenu onOpenChange={setIsMainDropdownOpen}>
          <DropdownMenuTrigger asChild disabled={!canChangeStatus}>
            <div
              ref={badgeRef}
              className={`px-2 py-1 text-[12px] min-w-[150px] text-nowrap rounded-[16px] text-center font-medium relative overflow-hidden ${currentStyle} ${!canChangeStatus ? "cursor-not-allowed" : "cursor-pointer"} ${isMainDropdownOpen ? "ring-2 ring-white/50" : ""}`}
            >
              {renderBadgeContent()}
              {renderDropdownArrow()}
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            ref={dropdownRef}
            side="left"
            align="start"
            sideOffset={8}
            className="w-48 bg-gray-700 p-1"
          >
            {availableStatuses.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                className={`w-full text-left px-4 py-2 text-sm rounded-sm hover:bg-gray-800 ${statusStyles[opt.value]}`}
                onClick={() => handleChange(opt.value as ServiceOrderStatus)}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Botão + para adicionar substatus */}
        {(serviceOrder.status === ServiceOrderStatus.RECORDING ||
          serviceOrder.status === ServiceOrderStatus.PLOTTING) &&
          canChangeStatus &&
          !hasSubstatus && (
            <DropdownMenu onOpenChange={setIsSubDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`absolute -top-1 -right-1 w-5 h-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] transition-colors ${isSubDropdownOpen ? "ring-2 ring-white" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <Plus size={12} />
                  {isSubDropdownOpen && (
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-r-[4px] border-r-white drop-shadow-sm"></div>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                ref={subDropdownRef}
                side="left"
                align="start"
                sideOffset={8}
                className="w-48 bg-gray-700 p-1"
              >
                {availableSubstatus.map((substatus) => (
                  <DropdownMenuItem
                    key={substatus.value}
                    className={`w-full text-left px-4 py-2 text-sm rounded-sm hover:bg-gray-800 ${statusStyles[substatus.value]}`}
                    onClick={() => handleSubstatusAdd(substatus.value)}
                  >
                    {substatus.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
      </div>
    );
  }
);
