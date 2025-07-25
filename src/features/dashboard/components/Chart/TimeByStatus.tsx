"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TimeByStatusProps {
  product: "CLICHE_CORRUGATED" | "DIECUTBLOCK";
  statusDurationByCustomer?: {
    CLICHE_CORRUGATED?: Record<
      string,
      Record<string, { time: string; count: number }>
    >;
    DIECUTBLOCK?: Record<
      string,
      Record<string, { time: string; count: number }>
    >;
  };
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatMinutesToHoursAndMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hoursString = hours > 0 ? `${hours}h` : "";
  const minutesString = remainingMinutes > 0 ? `${remainingMinutes}min` : "";

  if (hoursString && minutesString) {
    return `${hoursString}${minutesString}`;
  }
  return hoursString || minutesString || "0min";
}

export default function TimeByStatus({
  product,
  statusDurationByCustomer,
}: TimeByStatusProps) {
  const rawData = statusDurationByCustomer?.[product] ?? {};

  const hasData = Object.keys(rawData).length > 0;

  if (!hasData) {
    return (
      <div className="flex items-center justify-center my-auto w-full">
        <p className="text-gray-400 text-center text-lg m-auto">
          Não há dados disponíveis para serem exibidos.
        </p>
      </div>
    );
  }

  const statusMap: Record<string, Record<string, number>> = {};
  const countMap: Record<string, Record<string, number>> = {};

  Object.entries(rawData).forEach(([cliente, statusObj]) => {
    Object.entries(statusObj).forEach(([status, { time, count }]) => {
      const minutes = parseTimeToMinutes(time);
      if (!statusMap[status]) {
        statusMap[status] = {};
        countMap[status] = {};
      }
      statusMap[status][cliente] = minutes;
      countMap[status][cliente] = count;
    });
  });

  const clientes = Array.from(
    new Set(Object.values(statusMap).flatMap((c) => Object.keys(c))),
  );

  const statusLabels: Record<string, string> = {
    WAITING_PRODUCTION: "Aguard. Produção",
    CREDIT_ANALYSIS: "Análise de Crédito",
    CONFERENCE: "Conferência",
    PREPRESS: "Pré-impressão",
    PREASSEMBLY: "Pré-montagem",
    IN_APPROVAL: "Em Aprovação",
    RECORDING: "Gravação",
    LAYOUT: "Layout",
    IMAGE_PROCESSING: "Tratamento de Imagem",
    CNC: "CNC",
    DEVELOPMENT: "Desenvolvimento",
    LAMINATION: "Laminação",
    RUBBERIZING: "Emborrachamento",
    CANCELLED: "Cancelada",
    FINALIZED: "Finalizada",
    DISPATCHED: "Despachada",
  };

  const data = Object.entries(statusMap).map(([status, clientesData]) => {
    const entry: Record<string, number | string> = {
      name: statusLabels[status] || status,
    };

    let total = 0;
    let count = 0;

    clientes.forEach((cliente) => {
      const val = clientesData[cliente];
      if (val !== undefined) {
        entry[cliente] = val;
        entry[`${cliente}_count`] = countMap[status]?.[cliente] ?? 0;
        total += val;
        count++;
      }
    });

    entry["Média"] = count > 0 ? Math.round(total / count) : 0;
    return entry;
  });

  const minWidth = Math.max(data.length * 120, 1200);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <div style={{ minWidth: `${minWidth}px` }}>
        <BarChart width={minWidth} height={350} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 16 }} height={50} />
          <YAxis
            width={70}
            label={{
              value: "Tempo (horas)",
              angle: -90,
              position: "insideLeft",
            }}
            tickFormatter={(value) => `${Math.round(value / 60)}h`}
          />
          <Tooltip
            formatter={(value, name, props) => {
              if (name === "Média") {
                return [
                  formatMinutesToHoursAndMinutes(value as number),
                  "Média",
                ];
              }

              const cliente = name as string;
              const count = props.payload[`${cliente}_count`] ?? 0;
              return [
                `${formatMinutesToHoursAndMinutes(value as number)} (${count} OS)`,
                cliente,
              ];
            }}
            labelFormatter={(label) => `Status: ${label}`}
          />
          <Legend />
          {clientes.map((cliente, i) => (
            <Bar
              key={cliente}
              dataKey={cliente}
              fill={`hsl(${i * 50}, 70%, 60%)`}
              minPointSize={15}
            />
          ))}
          <Bar dataKey="Média" name="Média" fill="#0088fe" minPointSize={15} />
        </BarChart>
      </div>
    </div>
  );
}
