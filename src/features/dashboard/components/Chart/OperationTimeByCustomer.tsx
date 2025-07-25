"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface OperationTimeByCustomerProps {
  product: "CLICHE_CORRUGATED" | "DIECUTBLOCK";
  filters?: Record<string, any>;
  operationTimeByCustomer: Record<
    string,
    {
      CLICHE_CORRUGATED?: Record<string, string>;
      DIECUTBLOCK?: Record<string, string>;
    }
  >;
}

const SERVICE_MAPPING: Record<
  string,
  { dataKey: string; label: string; color: string }
> = {
  NEW: { dataKey: "NEW", label: "Novo", color: "#82ca9d" },
  ALTERATION: { dataKey: "ALTERATION", label: "Alteração", color: "#8884d8" },
  REPRINT: { dataKey: "REPRINT", label: "Regravação", color: "#a4de6c" },
  REASSEMBLY: { dataKey: "REASSEMBLY", label: "Remontagem", color: "#ffc658" },
  RECONFECTION: {
    dataKey: "RECONFECTION",
    label: "Reconfecção",
    color: "#ff8042",
  },
  REPAIR: { dataKey: "REPAIR", label: "Conserto", color: "#d771c4" },
  REPLACEMENT: { dataKey: "REPLACEMENT", label: "Reposição", color: "#e74c3c" },
};

const SERVICE_EXCLUSIONS: Record<string, string[]> = {
  CLICHE_CORRUGATED: ["RECONFECTION"],
  DIECUTBLOCK: ["REASSEMBLY", "REPRINT"],
};

function getServiceMappingForProduct(
  product: "CLICHE_CORRUGATED" | "DIECUTBLOCK",
) {
  const excludedServices = SERVICE_EXCLUSIONS[product] || [];

  return Object.fromEntries(
    Object.entries(SERVICE_MAPPING).filter(
      ([key]) => !excludedServices.includes(key),
    ),
  );
}

// Função auxiliar para converter "HH:MM" para minutos totais
const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const formatTimeLabel = (time: string): string => {
  const [h, m] = time.split(":").map(Number);
  const hourLabel = h > 0 ? `${h}h` : "";
  const minuteLabel = m > 0 ? `${m}min` : "";
  return `${hourLabel}${minuteLabel}` || "0min";
};

function transformData(
  operationTimeByCustomer: OperationTimeByCustomerProps["operationTimeByCustomer"],
  product: "CLICHE_CORRUGATED" | "DIECUTBLOCK",
) {
  return Object.entries(operationTimeByCustomer).map(([name, products]) => {
    const productData = products[product] || {};

    const entry: Record<string, number | string> = {
      name,
    };

    Object.keys(SERVICE_MAPPING).forEach((service) => {
      const rawTime = productData[service] || "0:00";
      entry[SERVICE_MAPPING[service].dataKey] = timeToMinutes(rawTime);
      entry[`${SERVICE_MAPPING[service].dataKey}_raw`] = rawTime;
    });

    const totalRaw = productData["total"] || "0:00";
    entry["Total"] = timeToMinutes(totalRaw);
    entry["Total_raw"] = totalRaw;

    return entry;
  });
}

export default function OperationTimeByCustomer({
  operationTimeByCustomer,
  product,
  filters,
}: OperationTimeByCustomerProps) {
  const data = transformData(operationTimeByCustomer, product);
  const services = getServiceMappingForProduct(product);

  const hasData =
    data.length > 0 && Object.keys(operationTimeByCustomer).length > 0;

  if (!hasData) {
    return (
      <div className="flex items-center justify-center w-full">
        <p className="text-gray-400 text-center text-lg">
          {filters?.statuses.includes("DISPATCHED")
            ? `Não há dados disponíveis para serem exibidos.`
            : `Para a visualização das métricas o status da OS deve ser "Despachada"`}
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          tickFormatter={(value) => `${Math.floor(value / 60)}h`}
          label={{
            value: "Tempo (horas)",
            angle: -90,
            position: "insideLeft",
            dx: -5,
          }}
        />
        <Tooltip
          formatter={(_value, name, props) => {
            const raw = props.payload[`${name}_raw`] || "0:00";
            const label =
              name === "Total" ? "Total" : services[name]?.label || name;
            return [`${formatTimeLabel(raw)}`, label];
          }}
        />
        <Legend
          formatter={(value) => {
            const service = services[value];
            return service?.label || value;
          }}
        />
        {Object.values(services).map((service) => (
          <Bar
            key={service.dataKey}
            dataKey={service.dataKey}
            stackId="a"
            fill={service.color}
          />
        ))}
        <Bar dataKey="Total" fill="#0088fe" />
      </BarChart>
    </ResponsiveContainer>
  );
}
